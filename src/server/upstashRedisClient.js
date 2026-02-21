import { createSharedAssumptionsError } from './sharedAssumptionsErrors.js';
import { getRedisConfig } from './sharedAssumptionsConfig.js';

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

const parseErrorBody = async (response) => {
  try {
    const jsonPayload = await response.clone().json();
    if (jsonPayload && typeof jsonPayload === 'object') {
      return JSON.stringify(jsonPayload);
    }
    return String(jsonPayload);
  } catch {
    try {
      const textPayload = await response.clone().text();
      return textPayload || '';
    } catch {
      return '';
    }
  }
};

const isQuotaOrRateLimitError = (message) => {
  return /quota|rate.?limit|too many|limit exceeded|max.*request/i.test(message);
};

const toRedisHttpError = (status, bodyText) => {
  const detail = bodyText ? ` ${bodyText}` : '';

  if (status === 429 || isQuotaOrRateLimitError(bodyText)) {
    return createSharedAssumptionsError(
      503,
      'redis_quota_or_rate_limited',
      'Redis service is rate limited or over quota. Please try again later.'
    );
  }

  if (status === 401 || status === 403) {
    return createSharedAssumptionsError(
      500,
      'redis_auth_failed',
      `Redis authentication failed (status ${status}).${detail}`
    );
  }

  return createSharedAssumptionsError(
    500,
    'redis_request_failed',
    `Redis request failed with status ${status}.${detail}`
  );
};

const toRedisCommandError = (message, index) => {
  if (isQuotaOrRateLimitError(message)) {
    return createSharedAssumptionsError(
      503,
      'redis_quota_or_rate_limited',
      'Redis service is rate limited or over quota. Please try again later.'
    );
  }

  return createSharedAssumptionsError(500, 'redis_command_failed', `Redis command failed: ${message} (${index}).`);
};

const assertValidPipelineResult = (payload, expectedLength) => {
  if (!Array.isArray(payload) || payload.length === 0 || payload.length !== expectedLength) {
    throw createSharedAssumptionsError(500, 'redis_invalid_response', 'Invalid Redis response shape.');
  }

  payload.forEach((entry, index) => {
    if (entry?.error) {
      throw toRedisCommandError(entry.error, index);
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
    const errorBody = await parseErrorBody(response);
    throw toRedisHttpError(response.status, errorBody);
  }

  const payload = await response.json();
  assertValidPipelineResult(payload, commands.length);
  return payload.map((entry) => entry.result);
};

export const runRedisCommand = async (...commandParts) => {
  const [result] = await runRedisPipeline([commandParts]);
  return result;
};
