export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  color: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  technologies: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type Section = 'hero' | 'projects' | 'skills' | 'experience' | 'contact';

export interface NavigationState {
  activeSection: Section;
  scrollProgress: number;
  isTransitioning: boolean;
}
