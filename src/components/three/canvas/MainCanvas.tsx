'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceStore } from '@/stores/performanceStore';
import { useActiveSection } from '@/stores/navigationStore';
import { GestureCamera } from '../camera/GestureCamera';
import { HeroScene } from '../scenes/HeroScene';
import { ProjectsBgScene } from '../scenes/ProjectsBgScene';
import { SkillsScene } from '../scenes/SkillsScene';
import { TimelineScene } from '../scenes/TimelineScene';
import { PostProcessing } from '../effects/PostProcessing';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

// Wrapper that fades a scene in smoothly on mount
function FadeScene({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const fadeProgress = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (fadeProgress.current >= 1) return;

    fadeProgress.current = Math.min(fadeProgress.current + delta * 2.5, 1);
    const t = fadeProgress.current;

    groupRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        const mat = obj.material as THREE.Material & { opacity: number };
        if (!mat || !('opacity' in mat)) return;

        // Store original opacity BEFORE modifying
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity;
        }
        mat.opacity = mat.userData.baseOpacity * t;
      }
    });
  });

  return <group ref={groupRef}>{children}</group>;
}

function SceneManager() {
  const activeSection = useActiveSection();
  const isDesktop = useIsDesktop();
  const hasNavigated = useRef(false);

  // Track if user has navigated away from hero
  useEffect(() => {
    if (activeSection !== 'hero') {
      hasNavigated.current = true;
    }
  }, [activeSection]);

  return (
    <>
      {activeSection === 'hero' && (
        hasNavigated.current
          ? <FadeScene key={`hero-fade`}><HeroScene /></FadeScene>
          : <HeroScene />
      )}
      {isDesktop && activeSection === 'projects' && (
        <FadeScene key="projects"><ProjectsBgScene /></FadeScene>
      )}
      {isDesktop && activeSection === 'skills' && (
        <FadeScene key="skills"><SkillsScene /></FadeScene>
      )}
      {isDesktop && activeSection === 'experience' && (
        <FadeScene key="experience"><TimelineScene /></FadeScene>
      )}
    </>
  );
}

export function MainCanvas() {
  const { dpr, setDpr, enablePostProcessing } = usePerformanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5],
        }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(Math.max(1, dpr - 0.5))}
          onIncline={() => setDpr(Math.min(2, dpr + 0.5))}
          flipflops={3}
          factor={0.5}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />

            <GestureCamera />
            <SceneManager />

            {enablePostProcessing && <PostProcessing />}

            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
