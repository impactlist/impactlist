export const SHARED_SNAPSHOT_TTL_SECONDS = 60 * 60 * 24 * 365;
export const SHARED_ASSUMPTIONS_SCHEMA_VERSION = 1;
export const MAX_ASSUMPTIONS_BYTES = 100 * 1024;
export const MAX_NAME_LENGTH = 120;
export const MAX_REFERENCE_LENGTH = 80;
export const MAX_SLUG_LENGTH = 40;
export const MIN_SLUG_LENGTH = 3;
export const RATE_LIMIT_MAX_SAVES = 10;
export const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;

export const RESERVED_SLUGS = new Set([
  'about',
  'admin',
  'api',
  'assumption',
  'assumptions',
  'calculator',
  'categories',
  'category',
  'donor',
  'donors',
  'faq',
  'health',
  'privacy',
  'recipient',
  'recipients',
  'robots.txt',
  'sitemap.xml',
  'terms',
]);

export const getRedisConfig = () => {
  const env = globalThis.process?.env || {};
  const restUrl = env.SHARED_ASSUMPTIONS_REDIS_REST_URL;
  const restToken = env.SHARED_ASSUMPTIONS_REDIS_REST_TOKEN;

  if (!restUrl || !restToken) {
    return null;
  }

  return {
    restUrl: restUrl.replace(/\/$/, ''),
    restToken,
  };
};

export const getPublicSiteOrigin = () => {
  const env = globalThis.process?.env || {};
  const origin = env.PUBLIC_SITE_ORIGIN;
  if (!origin) {
    return null;
  }
  return origin.replace(/\/$/, '');
};

export const getAppDataVersion = () => {
  const env = globalThis.process?.env || {};
  return env.VERCEL_GIT_COMMIT_SHA || env.SOURCE_VERSION || 'unknown';
};

export const buildSnapshotKey = (id) => `assumptions:snapshot:${id}`;
export const buildSlugKey = (slug) => `assumptions:slug:${slug}`;
export const buildRateLimitKey = (clientIp) => `assumptions:ratelimit:${clientIp || 'unknown'}`;
