'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleField } from '../objects/ParticleField';

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, -2]}>
      <MeshDistortMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
        distort={0.4}
        speed={2}
        transparent
        opacity={0.7}
      />
    </Sphere>
  );
}

function FloatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.2;
      ring1Ref.current.rotation.y = t * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.15 + Math.PI / 3;
      ring2Ref.current.rotation.z = t * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.2;
      ring3Ref.current.rotation.z = t * 0.1 + Math.PI / 2;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.1, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <group>
      <ParticleField />
      <GlowingSphere />
      <FloatingRings />

      {/* Additional lighting for hero scene */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#a855f7" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#22d3ee" />
      <spotLight
        position={[0, 5, 3]}
        intensity={0.5}
        angle={0.5}
        penumbra={1}
        color="#ffffff"
      />
    </group>
  );
}
