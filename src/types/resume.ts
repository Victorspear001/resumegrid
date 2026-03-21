export type SectionType = 'personal' | 'experience' | 'education' | 'skills' | 'projects';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  profilePicture?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[]; // Array of bullet points
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  percentage: string;
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface ResumeTheme {
  accentColor: string;
  fontFamily: string;
  headingFontFamily: string;
  spacing: 'compact' | 'normal' | 'spacious';
  template: 'minimal' | 'executive' | 'creative';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  sectionOrder: SectionType[];
  theme: ResumeTheme;
}
