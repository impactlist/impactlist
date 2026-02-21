import { runRedisCommand } from '../src/server/upstashRedisClient.js';
import { sendJson } from '../src/server/sharedAssumptionsHttp.js';
import { isSharedAssumptionsError } from '../src/server/sharedAssumptionsErrors.js';

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
    const redisChecks = await runRedisChecks();
    sendJson(res, 200, {
      ...basePayload,
      checks: {
        ...basePayload.checks,
        ...redisChecks,
      },
    });
  } catch (error) {
    if (isSharedAssumptionsError(error)) {
      sendJson(res, 503, {
        ok: false,
        error: error.code,
        message: error.message,
        checks: {
          app: 'ok',
          redis: 'failed',
        },
      });
      return;
    }

    sendJson(res, 503, {
      ok: false,
      error: 'health_check_failed',
      message: 'Health check failed.',
      checks: {
        app: 'ok',
        redis: 'failed',
      },
    });
  }
};

export default handler;
