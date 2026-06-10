import { runRedisCommand } from '../src/server/upstashRedisClient.js';
import { sendJson } from '../src/server/sharedAssumptionsHttp.js';
import { isSharedAssumptionsError } from '../src/server/sharedAssumptionsErrors.js';
import { enforceRateLimit, extractClientIp } from '../src/server/sharedAssumptionsService.js';

const HEALTH_EVAL_SCRIPT = "return 'ok'";

const runRedisChecks = async () => {
  const pingResult = await runRedisCommand('PING');
  const evalResult = await runRedisCommand('EVAL', HEALTH_EVAL_SCRIPT, '0');

  return {
    redisPing: pingResult === 'PONG' ? 'ok' : `unexpected:${String(pingResult)}`,
    redisEval: evalResult === 'ok' ? 'ok' : `unexpected:${String(evalResult)}`,
  };
};

const handler = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    sendJson(res, 405, {
      ok: false,
      error: 'method_not_allowed',
      message: `Method ${req.method} is not allowed.`,
    });
    return;
  }

  const checkMode = req.query?.check;
  const shouldCheckRedis = checkMode === 'redis' || checkMode === 'all';
  const basePayload = {
    ok: true,
    timestamp: new Date().toISOString(),
    checks: {
      app: 'ok',
    },
  };

  if (!shouldCheckRedis) {
    sendJson(res, 200, basePayload);
    return;
  }

  try {
    // Redis checks cost Upstash commands, so anonymous callers can't run
    // them without limit.
    await enforceRateLimit('health', extractClientIp(req));

    const redisChecks = await runRedisChecks();
    sendJson(res, 200, {
      ...basePayload,
      checks: {
        ...basePayload.checks,
        ...redisChecks,
      },
    });
  } catch (error) {
    if (isSharedAssumptionsError(error) && error.status === 429) {
      sendJson(res, 429, {
        ok: false,
        error: error.code,
        message: error.message,
      });
      return;
    }

    // Log the detail; don't echo internals (e.g. upstream Redis responses)
    // on a public endpoint.
    console.error('[health] Redis health check failed', {
      code: isSharedAssumptionsError(error) ? error.code : undefined,
      message: error?.message,
    });
    sendJson(res, 503, {
      ok: false,
      error: isSharedAssumptionsError(error) ? error.code : 'health_check_failed',
      message: 'Redis health check failed.',
      checks: {
        app: 'ok',
        redis: 'failed',
      },
    });
  }
};

export default handler;
