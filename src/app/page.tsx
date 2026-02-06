'use client';

import { useEffect } from 'react';
import { useNavigationStore } from '@/stores/navigationStore';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import type { Section } from '@/types/portfolio.types';

const sectionIds: Section[] = ['hero', 'projects', 'skills', 'experience', 'contact'];

export default function Home() {
  const setActiveSection = useNavigationStore((s) => s.setActiveSection);

  // Intersection Observer for section tracking
  // Skip 'projects' on desktop since ScrollTrigger handles it
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    sectionIds.forEach((id) => {
      // Projects section is managed by its own ScrollTrigger on desktop
      if (isDesktop && id === 'projects') return;

      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(id);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '0px 0px 0px 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [setActiveSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const { navigateToSection, nextSection, prevSection } =
        useNavigationStore.getState();

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          nextSection();
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSection();
          break;
        case 'Home':
          e.preventDefault();
          navigateToSection('hero');
          break;
        case 'End':
          e.preventDefault();
          navigateToSection('contact');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main id="main-content" className="relative">
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}
