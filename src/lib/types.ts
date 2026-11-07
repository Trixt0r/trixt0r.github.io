export type Locale = "de" | "en" | "ru";

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
}

export interface Hero {
  headline: string;
  subheadline: string;
  lead: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface Summary {
  yearsExperienceLabel: string;
  currentRoleLabel: string;
  focusAreas: string[];
  blurb: string;
  about: string[];
}

export interface ImpactItem {
  id: string;
  title: string;
  summary: string;
  details: string[];
  tech: string[];
  link?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string | null;
  summary: string;
  highlights: string[];
  tech: string[];
  featured: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  period: string;
  url: string;
  summary: string;
  tech: string[];
  featured: boolean;
}

export interface ProjectPageSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface ProjectPageLink {
  label: string;
  url: string;
}

/** Long-form page for a project; `id` matches a ProjectItem id and doubles as the URL slug. */
export interface ProjectPage {
  id: string;
  seoTitle: string;
  description: string;
  heading: string;
  lead: string;
  status: string;
  period: string;
  updatedAt: string;
  sections: ProjectPageSection[];
  links: ProjectPageLink[];
  sourcesNote: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export interface Skills {
  groups: SkillGroup[];
}

export interface WorkingStyle {
  items: string[];
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface Languages {
  items: LanguageItem[];
}

export interface EducationItem {
  institution: string;
  location: string;
  degree: string;
  period: string;
  summary: string;
}

export interface Education {
  items: EducationItem[];
}

export interface Links {
  github: string;
  linkedin: string;
}

export interface Seo {
  title: string;
  description: string;
  updatedAt: string;
}

export interface Cv {
  pdfPath: string;
  pdfLabel: string;
  updatedAt: string;
}

export interface Labels {
  navHome: string;
  navCv: string;
  sectionAbout: string;
  sectionHistory: string;
  sectionSnapshot: string;
  sectionImpact: string;
  sectionExperience: string;
  sectionSkills: string;
  sectionProjects: string;
  sectionWorkingStyle: string;
  sectionEducation: string;
  sectionLanguages: string;
  sectionContact: string;
  currentRole: string;
  currentFocus: string;
  viewCv: string;
  previewPdf: string;
  downloadPdf: string;
  printCv: string;
  contactMe: string;
  techStack: string;
  featuredProjects: string;
  timelineToday: string;
  localeLabel: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  pdfViewerTitle: string;
  pdfViewerHint: string;
  backToSite: string;
  emailLabel: string;
  phoneLabel: string;
  locationLabel: string;
}

export interface LocaleContent {
  profile: Profile;
  hero: Hero;
  summary: Summary;
  impact: ImpactItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  projectPages: ProjectPage[];
  skills: Skills;
  workingStyle: WorkingStyle;
  languages: Languages;
  education: Education;
  links: Links;
  seo: Seo;
  cv: Cv;
  labels: Labels;
}
