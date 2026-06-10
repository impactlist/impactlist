import { createSharedAssumptionsError, isSharedAssumptionsError } from './sharedAssumptionsErrors.js';

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

const parseJsonString = (raw) => {
  if (!raw) {
    throw createSharedAssumptionsError(400, 'invalid_payload', 'Request body is required.');
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw createSharedAssumptionsError(400, 'invalid_json', 'Request body must be valid JSON.');
  }
};

const assertWithinBodyLimit = (sizeBytes) => {
  if (sizeBytes > MAX_BODY_BYTES) {
    throw createSharedAssumptionsError(413, 'payload_too_large', 'Request body is too large.');
  }
};

export const parseJsonBody = async (req) => {
  // Require JSON up front. Vercel parses non-JSON content types differently
  // (e.g. text/plain arrives as a string with its stream already consumed),
  // and cross-origin "simple" text/plain POSTs shouldn't reach the handlers.
  const contentType = String(req.headers?.['content-type'] || '');
  if (!/^application\/json\b/i.test(contentType.trim())) {
    throw createSharedAssumptionsError(415, 'unsupported_media_type', 'Content-Type must be application/json.');
  }

  // The platform may deliver the body pre-parsed (object), raw (string or
  // Buffer), or not at all (a stream, e.g. under `vite`/`vercel dev`). The
  // stream path enforces MAX_BODY_BYTES as it reads; the pre-parsed paths
  // must enforce it too, or the cap silently doesn't exist in production.
  if (typeof req.body === 'string') {
    assertWithinBodyLimit(textEncoder.encode(req.body).length);
    return parseJsonString(req.body);
  }
  if (globalThis.Buffer?.isBuffer?.(req.body)) {
    assertWithinBodyLimit(req.body.length);
    return parseJsonString(req.body.toString('utf8'));
  }
  if (req.body && typeof req.body === 'object') {
    // Re-serialized size approximates wire size closely enough for a cap.
    assertWithinBodyLimit(textEncoder.encode(JSON.stringify(req.body)).length);
    return req.body;
  }

  return parseJsonString(await parseBodyFromStream(req));
};

const getRequestContext = (req) => {
  if (!req) {
    return {};
  }

  return {
    method: req.method || 'unknown',
    url: req.url || 'unknown',
  };
};

// 5xx details (e.g. upstream Redis response bodies) belong in the logs, not
// in responses to anonymous clients.
const publicServerErrorMessage = (status) =>
  status === 503
    ? 'Service is temporarily unavailable. Please try again later.'
    : 'An unexpected server error occurred. Please try again later.';

export const handleApiError = (reqOrRes, resOrError, maybeError) => {
  const hasRequestArg = maybeError !== undefined;
  const req = hasRequestArg ? reqOrRes : null;
  const res = hasRequestArg ? resOrError : reqOrRes;
  const error = hasRequestArg ? maybeError : resOrError;

  if (isSharedAssumptionsError(error)) {
    if (error.status >= 500) {
      console.error('[shared-assumptions] API error', {
        ...getRequestContext(req),
        status: error.status,
        code: error.code,
        message: error.message,
      });

      sendJson(res, error.status, {
        error: error.code,
        message: publicServerErrorMessage(error.status),
      });
      return;
    }

    if (error.status === 429) {
      // Abuse signal — the production monitoring plan watches for these.
      console.warn('[shared-assumptions] Rate limited', getRequestContext(req));
    }

    sendJson(res, error.status, {
      error: error.code,
      message: error.message,
    });
    return;
  }

  console.error('[shared-assumptions] Unexpected API error', {
    ...getRequestContext(req),
    error,
  });
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
