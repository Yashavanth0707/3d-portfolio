'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingTextProps {
  text: string;
  subtitle?: string;
  position?: [number, number, number];
  color?: string;
}

export function FloatingText({
  text,
  subtitle,
  position = [0, 0, 0],
  color = '#a855f7',
}: FloatingTextProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Subtle pulsing emissive
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 0.3;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.5}
            height={0.1}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={5}
          >
            {text}
            <meshStandardMaterial
              ref={materialRef}
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </Center>
      </Float>

      {subtitle && (
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <Center position={[0, -0.8, 0]}>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.2}
              height={0.05}
              curveSegments={8}
            >
              {subtitle}
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={0.2}
                metalness={0.6}
                roughness={0.3}
              />
            </Text3D>
          </Center>
        </Float>
      )}
    </group>
  );
}

// Simpler fallback text component
export function SimpleFloatingText({
  subtitle,
  position = [0, 0, 0],
}: Omit<FloatingTextProps, 'text'>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main text using a box as placeholder - text will be in HTML overlay */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 0.1]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      {subtitle && (
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[1.5, 0.3, 0.05]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.2}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}
