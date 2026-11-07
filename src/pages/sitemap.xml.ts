import type { APIRoute } from "astro";

import { absoluteUrl, alternatesFor, getSiteRoutes } from "../lib/seo";

export const GET: APIRoute = () => {
  const items = getSiteRoutes().flatMap((route) => {
    const { entries, xDefault } = alternatesFor(route.suffix, route.locales);
    const alternates =
      entries.map((entry) => `<xhtml:link rel="alternate" hreflang="${entry.locale}" href="${entry.href}" />`).join("") +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}" />`;
    return route.locales.map(
      (locale) => `<url><loc>${absoluteUrl(locale, route.suffix)}</loc><lastmod>${route.lastmod(locale)}</lastmod>${alternates}</url>`
    );
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${items.join("")}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
