import type { APIRoute } from "astro";

import { defaultLocale, buildPath, locales } from "../lib/i18n";

const site = import.meta.env.SITE;
const basePath = import.meta.env.BASE_URL;

const routes = [
  { pathSuffix: "/", priority: "1.0", changefreq: "weekly" }
];

function toAbsoluteUrl(locale: (typeof locales)[number], pathSuffix: string) {
  return new URL(buildPath(basePath, locale, pathSuffix), site).toString();
}

export const GET: APIRoute = () => {
  const items = routes.flatMap((route) =>
    locales.map((locale) => {
      const url = toAbsoluteUrl(locale, route.pathSuffix);
      const alternates = locales
        .map((alternateLocale) => {
          const href = toAbsoluteUrl(alternateLocale, route.pathSuffix);
          return `<xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${href}" />`;
        })
        .join("");

      return `<url><loc>${url}</loc><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${toAbsoluteUrl(defaultLocale, route.pathSuffix)}" /></url>`;
    })
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${items.join("")}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
