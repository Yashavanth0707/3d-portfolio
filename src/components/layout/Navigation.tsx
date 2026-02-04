'use client';

import { motion } from 'framer-motion';
import { useNavigationStore, useActiveSection } from '@/stores/navigationStore';
import type { Section } from '@/types/portfolio.types';

const sections: Section[] = ['hero', 'projects', 'skills', 'experience', 'contact'];

export function Navigation() {
  const navigateToSection = useNavigationStore((s) => s.navigateToSection);
  const activeSection = useActiveSection();

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <motion.button
            key={section}
            onClick={() => navigateToSection(section)}
            className="group relative w-3 h-3"
            whileHover={{ scale: 1.5 }}
            aria-label={`Navigate to ${section}`}
          >
            <span
              className={`block w-full h-full rounded-full transition-all ${
                activeSection === section
                  ? 'bg-purple-500 scale-125'
                  : 'bg-gray-600 group-hover:bg-gray-400'
              }`}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm text-gray-400 whitespace-nowrap capitalize">
              {section}
            </span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
}
