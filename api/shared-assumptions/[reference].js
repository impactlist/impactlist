import { getSharedSnapshot } from '../../src/server/sharedAssumptionsService.js';
import { validateReference } from '../../src/server/sharedAssumptionsValidation.js';
import { handleApiError, requireMethod, sendJson } from '../../src/server/sharedAssumptionsHttp.js';

const handler = async (req, res) => {
  if (!requireMethod(req, res, 'GET')) {
    return;
  }

  try {
    const reference = validateReference(req.query.reference);
    const snapshot = await getSharedSnapshot(reference);
    sendJson(res, 200, snapshot);
  } catch (error) {
    handleApiError(req, res, error);
  }
};

export default handler;
