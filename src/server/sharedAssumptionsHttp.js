import { createSharedAssumptionsError, isSharedAssumptionsError } from './sharedAssumptionsErrors';

const MAX_BODY_BYTES = 120 * 1024;
const textEncoder = new globalThis.TextEncoder();

export const sendJson = (res, statusCode, body) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const removeListener = (emitter, eventName, handler) => {
  if (typeof emitter.off === 'function') {
    emitter.off(eventName, handler);
    return;
  }

  emitter.removeListener(eventName, handler);
};

const parseBodyFromStream = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    let bytesReceived = 0;
    let isSettled = false;

    const cleanup = () => {
      removeListener(req, 'data', onData);
      removeListener(req, 'end', onEnd);
      removeListener(req, 'error', onError);
    };

    const rejectOnce = (error) => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      cleanup();
      if (typeof req.destroy === 'function') {
        req.destroy();
      }
      reject(error);
    };

    const onData = (chunk) => {
      if (isSettled) {
        return;
      }

      const textChunk = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
      bytesReceived += textEncoder.encode(textChunk).length;

      if (bytesReceived > MAX_BODY_BYTES) {
        rejectOnce(createSharedAssumptionsError(413, 'payload_too_large', 'Request body is too large.'));
        return;
      }

      raw += textChunk;
    };

    const onEnd = () => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      cleanup();
      resolve(raw);
    };

    const onError = (error) => {
      rejectOnce(error);
    };

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
  });

export const parseJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const raw = await parseBodyFromStream(req);
  if (!raw) {
    throw createSharedAssumptionsError(400, 'invalid_payload', 'Request body is required.');
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw createSharedAssumptionsError(400, 'invalid_json', 'Request body must be valid JSON.');
  }
};

export const handleApiError = (res, error) => {
  if (isSharedAssumptionsError(error)) {
    sendJson(res, error.status, {
      error: error.code,
      message: error.message,
    });
    return;
  }

  console.error('[shared-assumptions] Unexpected API error', error);
  sendJson(res, 500, {
    error: 'internal_error',
    message: 'An unexpected error occurred.',
  });
};

export const requireMethod = (req, res, method) => {
  if (req.method !== method) {
    sendJson(res, 405, {
      error: 'method_not_allowed',
      message: `Method ${req.method} is not allowed.`,
    });
    return false;
  }

  return true;
};
