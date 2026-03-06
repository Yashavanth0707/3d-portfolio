'use client';

import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Yashavantha H. All rights reserved.
        </p>
        <motion.button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm transition-colors"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Back to top
        </motion.button>
      </div>
    </footer>
  );
}
