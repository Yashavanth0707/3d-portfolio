'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { experiences } from '@/data/experience';
import { TimelineNode } from '../objects/TimelineNode';
import { useHandPosition, useIsGestureEnabled } from '@/stores/gestureStore';
import { useNavigationStore, useActiveSection } from '@/stores/navigationStore';

export function TimelineScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handPosition = useHandPosition();
  const isGestureEnabled = useIsGestureEnabled();
  const navigateToSection = useNavigationStore((s) => s.navigateToSection);
  const activeSection = useActiveSection();

  // Use hand Y position for timeline progress in gesture mode
  useEffect(() => {
    if (isGestureEnabled && handPosition) {
      setProgress(handPosition.y);
      const index = Math.floor(handPosition.y * experiences.length);
      setActiveIndex(Math.min(index, experiences.length - 1));
    }
  }, [isGestureEnabled, handPosition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeSection !== 'experience') return;

      if (e.key === 'ArrowDown') {
        if (activeIndex >= experiences.length - 1) {
          navigateToSection('contact');
        } else {
          setActiveIndex((prev) => Math.min(prev + 1, experiences.length - 1));
          setProgress((prev) => Math.min(prev + 1 / experiences.length, 1));
        }
      } else if (e.key === 'ArrowUp') {
        if (activeIndex <= 0) {
          navigateToSection('skills');
        } else {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          setProgress((prev) => Math.max(prev - 1 / experiences.length, 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, activeSection, navigateToSection]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth camera following
    const targetY = -activeIndex * 1.5 + 1;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.05
    );
  });

  // Generate line points for the timeline - need at least 2 points for Line
  const linePoints = useMemo<[number, number, number][]>(() => {
    return experiences.map((_, i) => [0, -i * 1.5, -1]);
  }, []);

  // Progress line needs at least 2 points
  const progressPoints = useMemo<[number, number, number][]>(() => {
    if (activeIndex === 0) {
      // Create a short line from first point
      return [
        [0, 0, -1],
        [0, -0.1, -1],
      ];
    }
    return linePoints.slice(0, activeIndex + 1);
  }, [activeIndex, linePoints]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Timeline line - only render if we have at least 2 points */}
      {linePoints.length >= 2 && (
        <Line
          points={linePoints}
          color="#4a4a6a"
          lineWidth={2}
          dashed={false}
        />
      )}

      {/* Progress line */}
      {progressPoints.length >= 2 && (
        <Line
          points={progressPoints}
          color="#a855f7"
          lineWidth={3}
        />
      )}

      {/* Timeline nodes */}
      {experiences.map((exp, index) => (
        <TimelineNode
          key={exp.id}
          experience={exp}
          position={[0, -index * 1.5, -1]}
          index={index}
          isActive={index === activeIndex}
          progress={progress}
        />
      ))}

      {/* Ambient lighting */}
      <pointLight position={[3, 0, 2]} intensity={0.4} color="#a855f7" />
      <pointLight position={[-3, 0, 2]} intensity={0.3} color="#22d3ee" />
    </group>
  );
}
