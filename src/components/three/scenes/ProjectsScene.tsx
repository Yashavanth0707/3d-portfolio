'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projects } from '@/data/projects';
import { ProjectCard3D } from '../objects/ProjectCard3D';
import { useSwipeDirection } from '@/stores/gestureStore';

interface ProjectsSceneProps {
  onProjectSelect?: (projectId: string) => void;
}

export function ProjectsScene({ onProjectSelect }: ProjectsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const targetRotation = useRef(0);

  const swipeDirection = useSwipeDirection();

  // Handle swipe navigation
  useEffect(() => {
    if (swipeDirection === 'left') {
      setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
    } else if (swipeDirection === 'right') {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [swipeDirection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && onProjectSelect) {
        onProjectSelect(projects[activeIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, onProjectSelect]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Calculate target rotation based on active index
    const anglePerCard = (Math.PI * 2) / projects.length;
    targetRotation.current = -activeIndex * anglePerCard;

    // Smooth rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      0.05
    );
  });

  const handleProjectClick = (index: number) => {
    if (index === activeIndex && onProjectSelect) {
      onProjectSelect(projects[index].id);
    } else {
      setActiveIndex(index);
    }
  };

  // Arrange cards in a circular pattern
  const radius = 3;
  const anglePerCard = (Math.PI * 2) / projects.length;

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {projects.map((project, index) => {
        const angle = index * anglePerCard;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;

        return (
          <ProjectCard3D
            key={project.id}
            project={project}
            position={[x, 0, z]}
            index={index}
            isActive={index === activeIndex}
            onClick={() => handleProjectClick(index)}
          />
        );
      })}

      {/* Center lighting */}
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#a855f7" />
      <pointLight position={[0, -2, 0]} intensity={0.3} color="#22d3ee" />
    </group>
  );
}
