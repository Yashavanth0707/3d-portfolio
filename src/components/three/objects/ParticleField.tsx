'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHandPosition, useIsGestureEnabled } from '@/stores/gestureStore';
import { usePerformanceStore } from '@/stores/performanceStore';

export function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const handPosition = useHandPosition();
  const isGestureEnabled = useIsGestureEnabled();
  const particleCount = usePerformanceStore((s) => s.getParticleAmount());

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 5 + 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 3;

      // Neon color palette (purple, cyan, pink)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Purple
        col[i * 3] = 0.66;
        col[i * 3 + 1] = 0.33;
        col[i * 3 + 2] = 0.97;
      } else if (colorChoice < 0.66) {
        // Cyan
        col[i * 3] = 0.13;
        col[i * 3 + 1] = 0.83;
        col[i * 3 + 2] = 0.93;
      } else {
        // Pink
        col[i * 3] = 0.96;
        col[i * 3 + 1] = 0.45;
        col[i * 3 + 2] = 0.71;
      }

      siz[i] = Math.random() * 0.03 + 0.01;
    }

    return [pos, col, siz];
  }, [particleCount]);

  const originalPositions = useRef<Float32Array>(new Float32Array(positions));

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const positionsArray = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    // Get interaction position
    let interactX = 0;
    let interactY = 0;

    if (isGestureEnabled && handPosition) {
      interactX = (handPosition.x - 0.5) * 10;
      interactY = -(handPosition.y - 0.5) * 10;
    } else {
      interactX = pointer.x * 5;
      interactY = pointer.y * 5;
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Get original position
      const origX = originalPositions.current[i3];
      const origY = originalPositions.current[i3 + 1];
      const origZ = originalPositions.current[i3 + 2];

      // Base floating animation
      const floatOffset = Math.sin(time * 0.5 + i * 0.1) * 0.02;

      // Calculate distance from interaction point
      const dx = positionsArray[i3] - interactX;
      const dy = positionsArray[i3 + 1] - interactY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repel particles within radius
      let repelX = 0;
      let repelY = 0;
      const repelRadius = 2;

      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        repelX = (dx / dist) * force * 0.5;
        repelY = (dy / dist) * force * 0.5;
      }

      // Apply transformations with smooth return
      positionsArray[i3] = origX + repelX + Math.sin(time + i) * 0.01;
      positionsArray[i3 + 1] = origY + floatOffset + repelY;
      positionsArray[i3 + 2] = origZ + Math.cos(time * 0.3 + i * 0.05) * 0.02;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    meshRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
