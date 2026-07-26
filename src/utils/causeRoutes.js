export const CAUSES_PATH = '/causes';
export const CAUSES_QUERY_PARAM = 'causes';

export const buildCausePath = (causeId) => `/cause/${encodeURIComponent(causeId)}`;

export const buildCauseScopedHomePath = (serializedSelection) => {
  if (!serializedSelection) {
    return '/';
  }

  const searchParams = new globalThis.URLSearchParams();
  searchParams.set(CAUSES_QUERY_PARAM, serializedSelection);
  return `/?${searchParams.toString()}`;
};
