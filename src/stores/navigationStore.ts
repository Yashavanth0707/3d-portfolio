'use client';

import { create } from 'zustand';
import type { Section } from '@/types/portfolio.types';

interface NavigationStore {
  activeSection: Section;
  scrollProgress: number;
  isTransitioning: boolean;
  setActiveSection: (section: Section) => void;
  setScrollProgress: (progress: number) => void;
  navigateToSection: (section: Section) => void;
  nextSection: () => void;
  prevSection: () => void;
}

const sections: Section[] = ['hero', 'projects', 'skills', 'experience', 'contact'];

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  activeSection: 'hero',
  scrollProgress: 0,
  isTransitioning: false,

  setActiveSection: (section) => set({ activeSection: section }),

  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  navigateToSection: (section) => {
    set({ isTransitioning: true, activeSection: section });

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => set({ isTransitioning: false }), 1000);
  },

  nextSection: () => {
    const { activeSection, navigateToSection } = get();
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      navigateToSection(sections[currentIndex + 1]);
    }
  },

  prevSection: () => {
    const { activeSection, navigateToSection } = get();
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      navigateToSection(sections[currentIndex - 1]);
    }
  },
}));

// Selector hooks
export const useActiveSection = () => useNavigationStore((s) => s.activeSection);
export const useIsTransitioning = () => useNavigationStore((s) => s.isTransitioning);
