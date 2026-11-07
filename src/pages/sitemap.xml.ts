import type { APIRoute } from "astro";

import { absoluteUrl, getSiteRoutes } from "../lib/seo";

// Plain sitemap: canonical URLs and meaningful lastmod only. Language alternates are declared once, in each
// page's <head> (see BaseLayout), so there is no second annotation system to keep consistent.
export const GET: APIRoute = () => {
  const items = getSiteRoutes().flatMap((route) =>
    route.locales.map((locale) => `<url><loc>${absoluteUrl(locale, route.suffix)}</loc><lastmod>${route.lastmod(locale)}</lastmod></url>`)
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</urlset>\n`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
