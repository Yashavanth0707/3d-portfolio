'use client';

import { motion } from 'framer-motion';
import { experiences } from '@/data/experience';
import { useIsGestureEnabled } from '@/stores/gestureStore';

export function ExperienceSection() {
  const isGestureEnabled = useIsGestureEnabled();

  return (
    <section
      id="experience"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-white mb-4">Experience</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          My professional journey in software development.
        </p>
        {isGestureEnabled && (
          <p className="text-sm text-gray-600 mt-4">
            Move your hand up/down to scroll through the timeline
          </p>
        )}
      </motion.div>

      {/* Timeline - mobile only, desktop uses 3D scene */}
      <div className="max-w-2xl mx-auto lg:hidden">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-pink-500" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="relative pl-12 pb-12"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-[#0a0a0a]" />

              {/* Date */}
              <span className="text-sm text-purple-400 font-medium">
                {exp.startDate} - {exp.endDate || 'Present'}
              </span>

              {/* Content card */}
              <div className="mt-2 bg-[#1a1a2e] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {exp.title}
                </h3>
                <p className="text-cyan-400 mb-2">{exp.company}</p>
                <p className="text-gray-500 text-sm mb-4">{exp.location}</p>

                <ul className="space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex">
                      <span className="text-purple-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
