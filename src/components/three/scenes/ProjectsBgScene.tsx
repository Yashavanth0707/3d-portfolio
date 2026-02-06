'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COLORS = ['#a855f7', '#22d3ee', '#f472b6', '#fbbf24', '#34d399'];

function FloatingShape({
  position,
  color,
  speed,
  type,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  type: 'box' | 'octahedron' | 'tetrahedron';
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = position[1] + Math.sin(t) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      {type === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {type === 'octahedron' && <octahedronGeometry args={[0.2]} />}
      {type === 'tetrahedron' && <tetrahedronGeometry args={[0.25]} />}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.25}
        wireframe
      />
    </mesh>
  );
}

function BgParticles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export function ProjectsBgScene() {
  const shapes = useMemo(() => {
    const types: ('box' | 'octahedron' | 'tetrahedron')[] = [
      'box', 'octahedron', 'tetrahedron',
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -2 - Math.random() * 4,
      ] as [number, number, number],
      color: COLORS[i % COLORS.length],
      speed: 0.3 + Math.random() * 0.4,
      type: types[i % types.length],
    }));
  }, []);

  return (
    <group>
      <BgParticles />
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
      <pointLight position={[5, 3, 2]} intensity={0.3} color="#a855f7" />
      <pointLight position={[-5, -3, 2]} intensity={0.2} color="#22d3ee" />
    </group>
  );
}
