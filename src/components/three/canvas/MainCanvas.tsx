'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { usePerformanceStore } from '@/stores/performanceStore';
import { useActiveSection } from '@/stores/navigationStore';
import { GestureCamera } from '../camera/GestureCamera';
import { HeroScene } from '../scenes/HeroScene';
import { ProjectsScene } from '../scenes/ProjectsScene';
import { SkillsScene } from '../scenes/SkillsScene';
import { TimelineScene } from '../scenes/TimelineScene';
import { PostProcessing } from '../effects/PostProcessing';

function SceneManager() {
  const activeSection = useActiveSection();

  return (
    <>
      {activeSection === 'hero' && <HeroScene />}
      {activeSection === 'projects' && <ProjectsScene />}
      {activeSection === 'skills' && <SkillsScene />}
      {activeSection === 'experience' && <TimelineScene />}
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
