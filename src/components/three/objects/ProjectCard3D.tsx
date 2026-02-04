'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useHandPosition, useIsPinching, useIsGestureEnabled } from '@/stores/gestureStore';
import type { Project } from '@/types/portfolio.types';

interface ProjectCard3DProps {
  project: Project;
  position: [number, number, number];
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export function ProjectCard3D({
  project,
  position,
  index,
  isActive,
  onClick,
}: ProjectCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const handPosition = useHandPosition();
  const isPinching = useIsPinching();
  const isGestureEnabled = useIsGestureEnabled();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();

    // Floating animation
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + index * 0.5) * 0.1;

    // Check if hand is hovering (gesture mode)
    if (isGestureEnabled && handPosition) {
      const handX = (handPosition.x - 0.5) * 6;
      const handY = -(handPosition.y - 0.5) * 4;
      const dx = groupRef.current.position.x - handX;
      const dy = groupRef.current.position.y - handY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1) {
        setHovered(true);
        // Scale up when hovered
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.1, 0.1));

        // Handle pinch selection
        if (isPinching) {
          onClick();
        }
      } else {
        setHovered(false);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1));
      }
    } else {
      // Mouse-based hover is handled by onPointerOver/Out
      const targetScale = hovered || isActive ? 1.1 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }

    // Rotate slightly based on hover
    const targetRotation = hovered ? 0.05 : 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      0.1
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Card background */}
      <RoundedBox args={[2, 2.5, 0.1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color="#1a1a2e"
          emissive={project.color}
          emissiveIntensity={hovered || isActive ? 0.3 : 0.1}
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.95}
        />
      </RoundedBox>

      {/* Glow border */}
      <RoundedBox args={[2.05, 2.55, 0.05]} radius={0.1} smoothness={4} position={[0, 0, -0.03]}>
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={hovered || isActive ? 0.6 : 0.2}
        />
      </RoundedBox>

      {/* Project title */}
      <Text
        position={[0, 0.6, 0.06]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {project.title}
      </Text>

      {/* Project description */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.08}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.7}
        textAlign="center"
      >
        {project.description}
      </Text>

      {/* Tags */}
      <group position={[0, -0.8, 0.06]}>
        {project.tags.slice(0, 3).map((tag, i) => (
          <Text
            key={tag}
            position={[(i - 1) * 0.6, 0, 0]}
            fontSize={0.06}
            color={project.color}
            anchorX="center"
            anchorY="middle"
          >
            {tag}
          </Text>
        ))}
      </group>

      {/* Interactive buttons - always visible on active card */}
      {isActive && (
        <Html position={[0, -1.05, 0.15]} center distanceFactor={10}>
          <div className="flex gap-3 pointer-events-auto">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-all hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-full transition-all hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Code
              </a>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
