import type { APIRoute } from "astro";

import { getContent } from "../lib/content";
import { buildPath, locales } from "../lib/i18n";

const site = import.meta.env.SITE;
const basePath = import.meta.env.BASE_URL;
const content = getContent("en");
const languageNames = { en: "English", de: "German", ru: "Russian" };

export const GET: APIRoute = () => {
  const pages = locales.map((locale) => {
    const url = new URL(buildPath(basePath, locale, "/"), site).toString();
    return `- [${languageNames[locale]} portfolio](${url}): Professional profile, skills, experience, projects, education, and contact details.`;
  });

  const body = `# ${content.profile.name}\n\n> ${content.seo.description}\n\n## Portfolio\n\n${pages.join("\n")}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
