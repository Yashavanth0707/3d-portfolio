'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/stores/musicStore';

export function MusicPrompt() {
  const { hasAsked, setHasAsked, setPlaying } = useMusicStore();

  const handleChoice = (withMusic: boolean) => {
    setHasAsked(true);
    if (withMusic) {
      setPlaying(true);
    }
  };

  return (
    <AnimatePresence>
      {!hasAsked && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1a1a2e] border border-purple-500/30 rounded-2xl p-8 max-w-md mx-4 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Music icon animation */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <div className="absolute inset-2 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome to My Portfolio
            </h2>
            <p className="text-gray-400 mb-8">
              Would you like to experience this portfolio with background music?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handleChoice(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                With Music
              </motion.button>
              <motion.button
                onClick={() => handleChoice(false)}
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-full font-medium hover:border-gray-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Without Music
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
