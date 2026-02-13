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

export const runRedisCommand = async (...commandParts) => {
  const { restUrl, restToken } = assertRedisConfigured();

  const response = await globalThis.fetch(`${restUrl}/pipeline`, {
    method: 'POST',
    headers: buildHeaders(restToken),
    body: JSON.stringify([commandParts]),
  });

  if (!response.ok) {
    throw createSharedAssumptionsError(
      500,
      'redis_request_failed',
      `Redis request failed with status ${response.status}.`
    );
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || payload.length === 0) {
    throw createSharedAssumptionsError(500, 'redis_invalid_response', 'Invalid Redis response shape.');
  }

  const [firstResult] = payload;
  if (firstResult.error) {
    throw createSharedAssumptionsError(500, 'redis_command_failed', `Redis command failed: ${firstResult.error}`);
  }

  return firstResult.result;
};
