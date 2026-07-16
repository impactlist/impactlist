// Absolute origin for build outputs that need real URLs (sitemap.xml,
// robots.txt, index.html social meta tags). Vercel provides the production
// URL automatically during builds; SITE_ORIGIN overrides it (e.g. for a
// custom domain — see .env.example); local builds fall back to the preview
// origin. Shared by the data generator and the Vite HTML transform so the
// sitemap and the og:image/og:url tags can never disagree.
export function resolveSiteOrigin() {
  if (process.env.SITE_ORIGIN) {
    return process.env.SITE_ORIGIN.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:4173';
}
