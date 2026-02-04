'use client';

import { useMemo } from 'react';
import { skills } from '@/data/skills';
import { SkillOrb } from '../objects/SkillOrb';

export function SkillsScene() {
  const positions = useMemo(() => {
    // Arrange skills in a hexagonal/organic pattern
    const result: [number, number, number][] = [];
    const gridSize = Math.ceil(Math.sqrt(skills.length));
    const spacing = 1.2;

    skills.forEach((_, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      // Offset every other row for hexagonal pattern
      const xOffset = row % 2 === 0 ? 0 : spacing / 2;

      const x = (col - gridSize / 2) * spacing + xOffset;
      const y = (row - Math.ceil(skills.length / gridSize) / 2) * spacing * 0.9;
      const z = Math.random() * 0.5 - 2; // Random depth for visual interest

      result.push([x, y, z]);
    });

    return result;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {skills.map((skill, index) => (
        <SkillOrb
          key={skill.id}
          skill={skill}
          position={positions[index]}
          index={index}
        />
      ))}

      {/* Ambient lighting for skills */}
      <pointLight position={[3, 3, 2]} intensity={0.4} color="#a855f7" />
      <pointLight position={[-3, -3, 2]} intensity={0.3} color="#22d3ee" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#f472b6" />
    </group>
  );
}
