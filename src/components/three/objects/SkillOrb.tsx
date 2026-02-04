'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useHandPosition, useIsGestureEnabled } from '@/stores/gestureStore';
import type { Skill } from '@/types/portfolio.types';

interface SkillOrbProps {
  skill: Skill;
  position: [number, number, number];
  index: number;
}

export function SkillOrb({ skill, position, index }: SkillOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [gestureHovered, setGestureHovered] = useState(false);

  const handPosition = useHandPosition();
  const isGestureEnabled = useIsGestureEnabled();

  useFrame(({ clock }) => {
    if (!groupRef.current || !orbRef.current) return;

    const t = clock.getElapsedTime();

    // Floating animation with offset per orb
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + index * 0.7) * 0.15;
    groupRef.current.position.x = position[0] + Math.cos(t * 0.5 + index * 0.5) * 0.05;

    // Check gesture hover
    if (isGestureEnabled && handPosition) {
      const handX = (handPosition.x - 0.5) * 8;
      const handY = -(handPosition.y - 0.5) * 6;
      const dx = groupRef.current.position.x - handX;
      const dy = groupRef.current.position.y - handY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      setGestureHovered(dist < 0.8);
    } else {
      setGestureHovered(false);
    }

    const isActive = hovered || gestureHovered;

    // Scale animation
    const targetScale = isActive ? 1.3 : 1;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    );

    // Rotation
    orbRef.current.rotation.y = t * 0.5;
    orbRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
  });

  const isActive = hovered || gestureHovered;
  const size = 0.3 + (skill.level / 100) * 0.2;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main orb */}
      <Sphere ref={orbRef} args={[size, 32, 32]}>
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={isActive ? 0.6 : 0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size + 0.1, 0.02, 16, 48]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.8 : 0.3}
        />
      </mesh>

      {/* Skill name - always visible */}
      <Text
        position={[0, -size - 0.15, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {skill.name}
      </Text>

      {/* Level percentage (visible on hover) */}
      {isActive && (
        <Text
          position={[0, size + 0.2, 0]}
          fontSize={0.1}
          color={skill.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {skill.level}%
        </Text>
      )}

      {/* Icon on the orb */}
      <Text
        position={[0, 0, size + 0.01]}
        fontSize={size * 0.7}
        anchorX="center"
        anchorY="middle"
      >
        {skill.icon}
      </Text>
    </group>
  );
}
