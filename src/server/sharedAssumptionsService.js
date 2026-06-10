import { randomBytes } from 'crypto';
import {
  RATE_LIMITS,
  SHARED_ASSUMPTIONS_SCHEMA_VERSION,
  SHARED_SNAPSHOT_TTL_SECONDS,
  buildRateLimitKey,
  buildSlugKey,
  buildSnapshotKey,
  getAppDataVersion,
} from './sharedAssumptionsConfig.js';
import { createSharedAssumptionsError } from './sharedAssumptionsErrors.js';
import { validateStoredAssumptions } from './sharedAssumptionsValidation.js';
import { runRedisCommand, runRedisPipeline } from './upstashRedisClient.js';

const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 12;
const MAX_UNBIASED_BYTE = 252;
const RATE_LIMIT_LUA = `
local key = KEYS[1]
local window = tonumber(ARGV[1])
local count = redis.call('INCR', key)
if count == 1 then
  redis.call('EXPIRE', key, window)
end
return count
`;

const generateSnapshotId = () => {
  let id = '';

  while (id.length < ID_LENGTH) {
    const bytes = randomBytes(ID_LENGTH);
    for (let i = 0; i < bytes.length && id.length < ID_LENGTH; i += 1) {
      const byte = bytes[i];
      if (byte >= MAX_UNBIASED_BYTE) {
        continue;
      }

      id += ID_ALPHABET[byte % ID_ALPHABET.length];
    }
  }

  return id;
};

export const extractClientIp = (req) => {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    const [first] = forwarded.split(',');
    return first.trim();
  }

  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return 'unknown';
};

export const enforceRateLimit = async (scope, clientIp) => {
  const limit = RATE_LIMITS[scope];
  if (!limit) {
    throw createSharedAssumptionsError(500, 'internal_error', `Unknown rate limit scope "${scope}".`);
  }

  const key = buildRateLimitKey(scope, clientIp);
  const countResult = await runRedisCommand('EVAL', RATE_LIMIT_LUA, '1', key, String(limit.windowSeconds));
  const count = Number(countResult || 0);

  if (count > limit.max) {
    throw createSharedAssumptionsError(429, 'rate_limited', limit.message);
  }
};

const claimSlug = async (slug, snapshotId) => {
  if (!slug) {
    return;
  }

  const claimed = await runRedisCommand(
    'SET',
    buildSlugKey(slug),
    snapshotId,
    'NX',
    'EX',
    String(SHARED_SNAPSHOT_TTL_SECONDS)
  );

  if (claimed !== 'OK') {
    throw createSharedAssumptionsError(409, 'slug_taken', 'That slug is already in use.');
  }
};

const createSnapshotRecord = ({ assumptions, name, description, slug }) => ({
  schemaVersion: SHARED_ASSUMPTIONS_SCHEMA_VERSION,
  createdAt: new Date().toISOString(),
  appDataVersion: getAppDataVersion(),
  name: name || null,
  description: description || null,
  slug: slug || null,
  assumptions,
});

const storeSnapshot = async ({ snapshotId, snapshotRecord }) => {
  await runRedisCommand(
    'SET',
    buildSnapshotKey(snapshotId),
    JSON.stringify(snapshotRecord),
    'EX',
    String(SHARED_SNAPSHOT_TTL_SECONDS)
  );
};

const rollbackSlugClaim = async (slug) => {
  if (!slug) {
    return;
  }

  try {
    await runRedisCommand('DEL', buildSlugKey(slug));
  } catch {
    // Intentionally ignore rollback failures; original error is more important.
  }
};

export const createSharedSnapshot = async ({ assumptions, name, description, slug, clientIp }) => {
  await enforceRateLimit('save', clientIp);

  const snapshotId = generateSnapshotId();
  const snapshotRecord = createSnapshotRecord({ assumptions, name, description, slug });

  await claimSlug(slug, snapshotId);

  try {
    await storeSnapshot({ snapshotId, snapshotRecord });
  } catch (error) {
    await rollbackSlugClaim(slug);
    throw error;
  }

  const reference = slug || snapshotId;
  return {
    id: snapshotId,
    description: description || null,
    slug: slug || null,
    reference,
  };
};

export const getSharedSnapshot = async (reference) => {
  const [mappedId, directSnapshot] = await runRedisPipeline([
    ['GET', buildSlugKey(reference)],
    ['GET', buildSnapshotKey(reference)],
  ]);

  const snapshotId = mappedId || reference;
  const rawSnapshot =
    mappedId && mappedId !== reference ? await runRedisCommand('GET', buildSnapshotKey(mappedId)) : directSnapshot;

  if (!rawSnapshot) {
    throw createSharedAssumptionsError(404, 'not_found', 'Shared assumptions were not found.');
  }

  let parsed;
  try {
    parsed = JSON.parse(rawSnapshot);
  } catch {
    throw createSharedAssumptionsError(500, 'invalid_snapshot', 'Stored snapshot could not be parsed.');
  }

  // Never serve a snapshot the current schema can't represent: it predates
  // write-side validation or the data schema has drifted since it was stored.
  // The 500 is logged by handleApiError, so poison snapshots surface in logs.
  try {
    validateStoredAssumptions(parsed.assumptions);
  } catch (error) {
    throw createSharedAssumptionsError(500, 'invalid_snapshot', `Stored snapshot failed validation: ${error.message}`);
  }

  return {
    id: snapshotId,
    slug: parsed.slug || null,
    name: parsed.name || null,
    description: parsed.description || null,
    createdAt: parsed.createdAt || null,
    assumptions: parsed.assumptions,
  };
};
