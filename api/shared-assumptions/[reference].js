import { enforceRateLimit, extractClientIp, getSharedSnapshot } from '../../src/server/sharedAssumptionsService.js';
import { validateReference } from '../../src/server/sharedAssumptionsValidation.js';
import { handleApiError, requireMethod, sendJson } from '../../src/server/sharedAssumptionsHttp.js';

const handler = async (req, res) => {
  if (!requireMethod(req, res, 'GET')) {
    return;
  }

  try {
    const reference = validateReference(req.query.reference);
    await enforceRateLimit('read', extractClientIp(req));
    const snapshot = await getSharedSnapshot(reference);

    // Snapshots are immutable once created, so responses fetched by canonical
    // id can be cached hard (mainly by the CDN, to spare the Redis quota).
    // A slug can be re-claimed by someone else after its snapshot expires, so
    // slug responses are cached only briefly.
    const isCanonicalId = snapshot.id === reference;
    res.setHeader(
      'Cache-Control',
      isCanonicalId ? 'public, max-age=3600, s-maxage=31536000, immutable' : 'public, max-age=60, s-maxage=300'
    );
    sendJson(res, 200, snapshot);
  } catch (error) {
    handleApiError(req, res, error);
  }
};

export default handler;
