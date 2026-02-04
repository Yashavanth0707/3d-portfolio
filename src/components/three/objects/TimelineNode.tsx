'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Experience } from '@/types/portfolio.types';

interface TimelineNodeProps {
  experience: Experience;
  position: [number, number, number];
  index: number;
  isActive: boolean;
  progress: number;
}

export function TimelineNode({
  experience,
  position,
  index,
  isActive,
  progress,
}: TimelineNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();

    // Pulse when active
    if (isActive) {
      const pulse = Math.sin(t * 3) * 0.05 + 1;
      groupRef.current.scale.setScalar(pulse);
    } else {
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.1)
      );
    }
  });

  const nodeProgress = Math.min(1, Math.max(0, (progress - index * 0.2) * 2));
  const color = isActive ? '#a855f7' : '#4a4a6a';
  const glowIntensity = isActive || hovered ? 0.5 : 0.1;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Node sphere */}
      <Sphere args={[0.15, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {/* Outer ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 16, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={nodeProgress * 0.6}
        />
      </mesh>

      {/* Content card (visible when active or hovered) */}
      {(isActive || hovered) && (
        <group position={[1.5, 0, 0]}>
          {/* Card background */}
          <mesh>
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial
              color="#1a1a2e"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Title */}
          <Text
            position={[0, 0.4, 0.01]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.3}
          >
            {experience.title}
          </Text>

          {/* Company */}
          <Text
            position={[0, 0.15, 0.01]}
            fontSize={0.1}
            color="#a855f7"
            anchorX="center"
            anchorY="middle"
          >
            {experience.company}
          </Text>

          {/* Date */}
          <Text
            position={[0, -0.05, 0.01]}
            fontSize={0.07}
            color="#71717a"
            anchorX="center"
            anchorY="middle"
          >
            {experience.startDate} - {experience.endDate || 'Present'}
          </Text>

          {/* Location */}
          <Text
            position={[0, -0.25, 0.01]}
            fontSize={0.06}
            color="#52525b"
            anchorX="center"
            anchorY="middle"
          >
            {experience.location}
          </Text>

          {/* Technologies */}
          <Text
            position={[0, -0.5, 0.01]}
            fontSize={0.05}
            color="#22d3ee"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.3}
          >
            {experience.technologies.slice(0, 4).join(' • ')}
          </Text>
        </group>
      )}

      {/* Year label */}
      <Text
        position={[-0.5, 0, 0]}
        fontSize={0.1}
        color={isActive ? '#a855f7' : '#4a4a6a'}
        anchorX="right"
        anchorY="middle"
      >
        {experience.startDate.split('-')[0]}
      </Text>
    </group>
  );
}
