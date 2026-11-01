import type { Locale } from "./types";

export const locales: Locale[] = ["de", "en", "ru"];
export const defaultLocale: Locale = "de";

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function normalizeLocale(input: string | undefined): Locale {
  if (!input) {
    return defaultLocale;
  }

  const lowered = input.toLowerCase();

  if (lowered.startsWith("de")) {
    return "de";
  }

  if (lowered.startsWith("ru")) {
    return "ru";
  }

  if (lowered.startsWith("en")) {
    return "en";
  }

  return defaultLocale;
}

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
  return `${normalizedBase}/${locale}${suffixPart}/`.replace(/\/$/, suffix.endsWith("/") || suffix === "/" ? "/" : "");
}
