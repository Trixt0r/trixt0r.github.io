import type { LocaleContent, Locale } from "./types";

import deProfile from "../../content/de/profile.json";
import deHero from "../../content/de/hero.json";
import deSummary from "../../content/de/summary.json";
import deImpact from "../../content/de/impact.json";
import deExperience from "../../content/de/experience.json";
import deProjects from "../../content/de/projects.json";
import deProjectPages from "../../content/de/project-pages.json";
import deSkills from "../../content/de/skills.json";
import deWorkingStyle from "../../content/de/working-style.json";
import deLanguages from "../../content/de/languages.json";
import deEducation from "../../content/de/education.json";
import deLinks from "../../content/de/links.json";
import deSeo from "../../content/de/seo.json";
import deCv from "../../content/de/cv.json";
import deLabels from "../../content/de/labels.json";

import enProfile from "../../content/en/profile.json";
import enHero from "../../content/en/hero.json";
import enSummary from "../../content/en/summary.json";
import enImpact from "../../content/en/impact.json";
import enExperience from "../../content/en/experience.json";
import enProjects from "../../content/en/projects.json";
import enProjectPages from "../../content/en/project-pages.json";
import enSkills from "../../content/en/skills.json";
import enWorkingStyle from "../../content/en/working-style.json";
import enLanguages from "../../content/en/languages.json";
import enEducation from "../../content/en/education.json";
import enLinks from "../../content/en/links.json";
import enSeo from "../../content/en/seo.json";
import enCv from "../../content/en/cv.json";
import enLabels from "../../content/en/labels.json";

import ruProfile from "../../content/ru/profile.json";
import ruHero from "../../content/ru/hero.json";
import ruSummary from "../../content/ru/summary.json";
import ruImpact from "../../content/ru/impact.json";
import ruExperience from "../../content/ru/experience.json";
import ruProjects from "../../content/ru/projects.json";
import ruProjectPages from "../../content/ru/project-pages.json";
import ruSkills from "../../content/ru/skills.json";
import ruWorkingStyle from "../../content/ru/working-style.json";
import ruLanguages from "../../content/ru/languages.json";
import ruEducation from "../../content/ru/education.json";
import ruLinks from "../../content/ru/links.json";
import ruSeo from "../../content/ru/seo.json";
import ruCv from "../../content/ru/cv.json";
import ruLabels from "../../content/ru/labels.json";

const content: Record<Locale, LocaleContent> = {
  de: {
    profile: deProfile,
    hero: deHero,
    summary: deSummary,
    impact: deImpact,
    experience: deExperience,
    projects: deProjects,
    projectPages: deProjectPages,
    skills: deSkills,
    workingStyle: deWorkingStyle,
    languages: deLanguages,
    education: deEducation,
    links: deLinks,
    seo: deSeo,
    cv: deCv,
    labels: deLabels
  },
  en: {
    profile: enProfile,
    hero: enHero,
    summary: enSummary,
    impact: enImpact,
    experience: enExperience,
    projects: enProjects,
    projectPages: enProjectPages,
    skills: enSkills,
    workingStyle: enWorkingStyle,
    languages: enLanguages,
    education: enEducation,
    links: enLinks,
    seo: enSeo,
    cv: enCv,
    labels: enLabels
  },
  ru: {
    profile: ruProfile,
    hero: ruHero,
    summary: ruSummary,
    impact: ruImpact,
    experience: ruExperience,
    projects: ruProjects,
    projectPages: ruProjectPages,
    skills: ruSkills,
    workingStyle: ruWorkingStyle,
    languages: ruLanguages,
    education: ruEducation,
    links: ruLinks,
    seo: ruSeo,
    cv: ruCv,
    labels: ruLabels
  }
};

export function getContent(locale: Locale) {
  return content[locale];
}
