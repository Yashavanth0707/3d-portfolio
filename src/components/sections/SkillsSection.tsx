'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import { useIsGestureEnabled } from '@/stores/gestureStore';

export function SkillsSection() {
  const isGestureEnabled = useIsGestureEnabled();

  const categories = {
    frontend: skills.filter((s) => s.category === 'frontend'),
    backend: skills.filter((s) => s.category === 'backend'),
    tools: skills.filter((s) => s.category === 'tools'),
  };

  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-white mb-4">Skills</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Technologies and tools I work with to bring ideas to life.
        </p>
        {isGestureEnabled && (
          <p className="text-sm text-gray-600 mt-4">
            Hover with your hand to explore each skill
          </p>
        )}
      </motion.div>

      {/* Mobile/fallback skill grid */}
      <div className="lg:hidden max-w-4xl mx-auto">
        {Object.entries(categories).map(([category, categorySkills]) => (
          <motion.div
            key={category}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-purple-400 mb-6 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categorySkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className="bg-[#1a1a2e] rounded-xl p-4 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2">{skill.icon}</div>
                  <h4 className="text-white font-medium mb-2">{skill.name}</h4>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{skill.level}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: 3D scene handles display */}
      <div className="hidden lg:block text-center text-gray-600 text-sm">
        <p>Explore skills in the 3D space</p>
      </div>
    </section>
  );
}
