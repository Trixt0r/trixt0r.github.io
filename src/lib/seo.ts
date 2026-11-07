import { getContent } from "./content";
import { buildPath, fallbackLocale, locales } from "./i18n";
import type { Locale, LocaleContent } from "./types";

const site = import.meta.env.SITE;
const basePath = import.meta.env.BASE_URL;

export const homeSuffix = "/";
export const projectSuffix = (id: string) => `/projects/${id}/`;

export function localePath(locale: Locale, suffix = homeSuffix) {
  return buildPath(basePath, locale, suffix);
}

export function absoluteUrl(locale: Locale, suffix = homeSuffix) {
  return new URL(localePath(locale, suffix), site).toString();
}

export function assetUrl(path: string) {
  return new URL(`${basePath}${path}`, site).toString();
}

/** Stable across languages: the person entity is defined once, relative to the site root. */
export const personId = `${new URL(basePath, site).toString()}#person`;
/** Stable website entity shared by every page; its URL is the default-language root. */
export const websiteId = `${new URL(basePath, site).toString()}#website`;

function websiteNode(content: LocaleContent, locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: new URL(basePath, site).toString(),
    name: `${content.profile.name} Portfolio`,
    inLanguage: locales
  };
}

/** Public profiles that belong to the person, verified to exist. */
export function sameAsLinks(content: LocaleContent) {
  return [content.links.linkedin, content.links.github, "https://www.npmjs.com/~trixt0r"];
}

/** Locales in which a project page with this id exists. */
export function projectPageLocales(id: string): Locale[] {
  return locales.filter((locale) => getContent(locale).projectPages.some((page) => page.id === id));
}

export function findProjectPage(locale: Locale, id: string) {
  return getContent(locale).projectPages.find((page) => page.id === id);
}

export interface SiteRoute {
  suffix: string;
  locales: Locale[];
  lastmod: (locale: Locale) => string;
}

/** Every indexable route. The sitemap, hreflang annotations and llms.txt are all derived from this list. */
export function getSiteRoutes(): SiteRoute[] {
  const projectIds = [...new Set(locales.flatMap((locale) => getContent(locale).projectPages.map((page) => page.id)))];
  return [
    { suffix: homeSuffix, locales, lastmod: (locale) => getContent(locale).seo.updatedAt },
    ...projectIds.map((id) => ({
      suffix: projectSuffix(id),
      locales: projectPageLocales(id),
      lastmod: (locale: Locale) => findProjectPage(locale, id)!.updatedAt
    }))
  ];
}

/** Absolute hreflang targets for a page: only real translations, plus x-default (English where available). */
export function alternatesFor(suffix: string, available: Locale[] = locales) {
  const entries = available.map((locale) => ({ locale, href: absoluteUrl(locale, suffix) }));
  const xDefaultLocale = available.includes(fallbackLocale) ? fallbackLocale : available[0];
  return { entries, xDefault: absoluteUrl(xDefaultLocale, suffix) };
}

export function buildProfileStructuredData(locale: Locale, content: LocaleContent) {
  const canonical = absoluteUrl(locale);
  const currentRole = content.experience.find((item) => item.end === null);
  // The first education entry is the university (Universität Bern); the school-leaving entry follows it.
  const school = content.education.items[0];
  const addressLocality = content.profile.location.split(",")[0].trim();
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(content, locale),
      {
        "@type": "ProfilePage",
        "@id": canonical,
        url: canonical,
        name: content.seo.title,
        description: content.seo.description,
        inLanguage: locale,
        dateModified: content.seo.updatedAt,
        isPartOf: { "@id": websiteId },
        mainEntity: {
          "@type": "Person",
          "@id": personId,
          name: content.profile.name,
          alternateName: "Trixt0r",
          jobTitle: content.summary.currentRoleLabel,
          description: content.summary.blurb,
          url: canonical,
          mainEntityOfPage: { "@id": canonical },
          image: assetUrl("profile-avatar.jpg"),
          email: `mailto:${content.profile.email}`,
          telephone: content.profile.phone,
          address: { "@type": "PostalAddress", addressLocality, addressCountry: "CH" },
          ...(currentRole ? { worksFor: { "@type": "Organization", name: currentRole.company } } : {}),
          ...(school ? { alumniOf: { "@type": "CollegeOrUniversity", name: school.institution } } : {}),
          knowsAbout: [...new Set(content.skills.groups.flatMap((group) => group.items))],
          // Language codes, not localized names, so the value is identical on every translation.
          knowsLanguage: ["de", "ru", "en"],
          sameAs: sameAsLinks(content)
        }
      }
    ]
  };
}

/**
 * Project pages describe a public source repository, so SoftwareSourceCode is accurate.
 * The author references the person entity defined on the profile page.
 */
export function buildProjectStructuredData(locale: Locale, content: LocaleContent, id: string, homeLabel: string) {
  const page = findProjectPage(locale, id)!;
  const project = content.projects.find((item) => item.id === id)!;
  const canonical = absoluteUrl(locale, projectSuffix(id));
  const home = absoluteUrl(locale);
  const author = { "@type": "Person", "@id": personId, name: content.profile.name, url: home };
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(content, locale),
      {
        "@type": "WebPage",
        "@id": canonical,
        url: canonical,
        name: page.seoTitle,
        description: page.description,
        inLanguage: locale,
        dateModified: page.updatedAt,
        isPartOf: { "@id": websiteId },
        about: { "@id": `${canonical}#software` },
        author: { "@id": personId },
        breadcrumb: { "@id": `${canonical}#breadcrumb` }
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${canonical}#software`,
        name: project.name,
        description: page.lead,
        codeRepository: project.url,
        programmingLanguage: project.tech.filter((tech) => ["TypeScript", "JavaScript", "Java"].includes(tech)),
        author
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeLabel, item: home },
          { "@type": "ListItem", position: 2, name: project.name, item: canonical }
        ]
      }
    ]
  };
}
