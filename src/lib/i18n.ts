import type { Locale } from "./types";

export const locales: Locale[] = ["de", "en", "ru", "fr", "it"];
export const defaultLocale: Locale = "de";
/** hreflang x-default: the language for visitors outside every offered language. */
export const fallbackLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

/** Display names in their own language, used for the language switcher. */
export const localeNames: Record<Locale, string> = { de: "Deutsch", en: "English", ru: "Русский", fr: "Français", it: "Italiano" };

/** Open Graph locales. Regions are only used where the content targets Switzerland. */
export const ogLocales: Record<Locale, string> = { de: "de_CH", en: "en_US", ru: "ru_RU", fr: "fr_CH", it: "it_CH" };

export function formatPeriod(start: string, end: string | null, locale: Locale, todayLabel: string) {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });

  const startValue = formatter.format(new Date(`${start}-01`));
  const endValue = end ? formatter.format(new Date(`${end}-01`)) : todayLabel;
  return `${startValue} - ${endValue}`;
}

export function stripTrailingSlash(value: string) {
  return value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value;
}

export function buildPath(basePath: string, locale: Locale, suffix = "/") {
  const base = stripTrailingSlash(basePath);
  const normalizedBase = base === "/" ? "" : base;
  const cleanedSuffix = suffix === "/" ? "" : suffix.replace(/^\/+|\/+$/g, "");
  const suffixPart = cleanedSuffix ? `/${cleanedSuffix}` : "";
  const localePart = locale === defaultLocale ? "" : `/${locale}`;
  return `${normalizedBase}${localePart}${suffixPart}/`.replace(/\/$/, suffix.endsWith("/") || suffix === "/" ? "/" : "");
}
