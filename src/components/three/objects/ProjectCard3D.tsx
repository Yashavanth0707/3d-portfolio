'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
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

      {/* Hover indicator */}
      {(hovered || isActive) && (
        <mesh position={[0, -1.1, 0.06]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={project.color} />
        </mesh>
      )}
    </group>
  );
}
