import { createSharedSnapshot, extractClientIp, getRequestOrigin } from '../../src/server/sharedAssumptionsService';
import { validateCreatePayload } from '../../src/server/sharedAssumptionsValidation';
import { handleApiError, parseJsonBody, requireMethod, sendJson } from '../../src/server/sharedAssumptionsHttp';

const handler = async (req, res) => {
  if (!requireMethod(req, res, 'POST')) {
    return;
  }

  try {
    const payload = await parseJsonBody(req);
    const { assumptions, name, slug } = validateCreatePayload(payload);
    const clientIp = extractClientIp(req);
    const origin = getRequestOrigin(req);

    const created = await createSharedSnapshot({
      assumptions,
      name,
      slug,
      clientIp,
      origin,
    });

    sendJson(res, 201, created);
  } catch (error) {
    handleApiError(req, res, error);
  }
};

export default handler;
