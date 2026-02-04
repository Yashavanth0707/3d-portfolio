'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projects } from '@/data/projects';
import { ProjectCard3D } from '../objects/ProjectCard3D';
import { useSwipeDirection } from '@/stores/gestureStore';
import { useNavigationStore, useActiveSection } from '@/stores/navigationStore';

export function ProjectsScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const targetRotation = useRef(0);

  const swipeDirection = useSwipeDirection();
  const navigateToSection = useNavigationStore((s) => s.navigateToSection);
  const activeSection = useActiveSection();

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
      if (activeSection !== 'projects') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeIndex >= projects.length - 1) {
          navigateToSection('skills');
        } else {
          setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeIndex <= 0) {
          navigateToSection('hero');
        } else {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, activeSection, navigateToSection]);

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
    // Always rotate the clicked card to front
    setActiveIndex(index);
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
