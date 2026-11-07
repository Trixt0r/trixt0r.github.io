import type { LocaleContent, Locale } from "./types";
import { locales } from "./i18n";

// Every content/<lang>/<name>.json file becomes one field of that language's LocaleContent.
const modules = import.meta.glob("../../content/*/*.json", { eager: true, import: "default" }) as Record<string, unknown>;

const fileToField: Record<string, keyof LocaleContent> = {
  profile: "profile",
  hero: "hero",
  summary: "summary",
  impact: "impact",
  experience: "experience",
  projects: "projects",
  "project-pages": "projectPages",
  skills: "skills",
  "working-style": "workingStyle",
  languages: "languages",
  education: "education",
  links: "links",
  seo: "seo",
  cv: "cv",
  labels: "labels",
  ui: "ui"
};

const content = Object.fromEntries(
  locales.map((locale) => {
    const entries = Object.entries(fileToField).map(([file, field]) => {
      const data = modules[`../../content/${locale}/${file}.json`];
      if (data === undefined) throw new Error(`Missing content/${locale}/${file}.json`);
      return [field, data];
    });
    return [locale, Object.fromEntries(entries)];
  })
) as Record<Locale, LocaleContent>;

export function getContent(locale: Locale) {
  return content[locale];
}
