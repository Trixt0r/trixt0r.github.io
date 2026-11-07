import type { APIRoute } from "astro";

import { getContent } from "../lib/content";
import { locales } from "../lib/i18n";
import { absoluteUrl, findProjectPage, projectSuffix } from "../lib/seo";

const content = getContent("en");
const languageNames = { en: "English", de: "German", ru: "Russian" };

export const GET: APIRoute = () => {
  const portfolio = locales.map(
    (locale) =>
      `- [${languageNames[locale]} portfolio](${absoluteUrl(locale)}): Professional profile, skills, experience, projects, education, and contact details.`
  );
  const projects = content.projects.flatMap((project) =>
    locales.flatMap((locale) => {
      const page = findProjectPage(locale, project.id);
      return page ? [`- [${page.heading} (${languageNames[locale]})](${absoluteUrl(locale, projectSuffix(project.id))}): ${page.description}`] : [];
    })
  );

  const body = `# ${content.profile.name}\n\n> ${content.seo.description}\n\n## Portfolio\n\n${portfolio.join("\n")}\n\n## Projects\n\n${projects.join("\n")}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
