import { createSharedAssumptionsError } from './sharedAssumptionsErrors';
import { getRedisConfig } from './sharedAssumptionsConfig';

const buildHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const assertRedisConfigured = () => {
  const config = getRedisConfig();
  if (!config) {
    throw createSharedAssumptionsError(500, 'redis_not_configured', 'Redis is not configured.');
  }
  return config;
};

const assertValidPipelineResult = (payload, expectedLength) => {
  if (!Array.isArray(payload) || payload.length === 0 || payload.length !== expectedLength) {
    throw createSharedAssumptionsError(500, 'redis_invalid_response', 'Invalid Redis response shape.');
  }

  payload.forEach((entry, index) => {
    if (entry?.error) {
      throw createSharedAssumptionsError(
        500,
        'redis_command_failed',
        `Redis command failed: ${entry.error} (${index}).`
      );
    }
  });
};

export const runRedisPipeline = async (commands) => {
  if (!Array.isArray(commands) || commands.length === 0) {
    throw createSharedAssumptionsError(500, 'redis_invalid_pipeline', 'Redis pipeline requires at least one command.');
  }

  const { restUrl, restToken } = assertRedisConfigured();

  const response = await globalThis.fetch(`${restUrl}/pipeline`, {
    method: 'POST',
    headers: buildHeaders(restToken),
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    throw createSharedAssumptionsError(
      500,
      'redis_request_failed',
      `Redis request failed with status ${response.status}.`
    );
  }

  const payload = await response.json();
  assertValidPipelineResult(payload, commands.length);
  return payload.map((entry) => entry.result);
};

export const runRedisCommand = async (...commandParts) => {
  const [result] = await runRedisPipeline([commandParts]);
  return result;
};
