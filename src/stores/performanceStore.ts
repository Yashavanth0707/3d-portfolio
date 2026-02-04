'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ParticleCount = 'low' | 'medium' | 'high';
type QualityPreset = 'low' | 'medium' | 'high';

interface PerformanceStore {
  dpr: number;
  enablePostProcessing: boolean;
  particleCount: ParticleCount;
  mediaPipeFPS: number;
  reducedMotion: boolean;
  setDpr: (dpr: number) => void;
  togglePostProcessing: () => void;
  setParticleCount: (count: ParticleCount) => void;
  setMediaPipeFPS: (fps: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setQualityPreset: (preset: QualityPreset) => void;
  getParticleAmount: () => number;
}

const particleAmounts: Record<ParticleCount, number> = {
  low: 500,
  medium: 1500,
  high: 3000,
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      dpr: 1.5,
      enablePostProcessing: true,
      particleCount: 'medium',
      mediaPipeFPS: 18,
      reducedMotion: false,

      setDpr: (dpr) => set({ dpr }),

      togglePostProcessing: () =>
        set((s) => ({ enablePostProcessing: !s.enablePostProcessing })),

      setParticleCount: (count) => set({ particleCount: count }),

      setMediaPipeFPS: (fps) => set({ mediaPipeFPS: fps }),

      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

      setQualityPreset: (preset) => {
        const presets: Record<QualityPreset, Partial<PerformanceStore>> = {
          low: {
            dpr: 1,
            enablePostProcessing: false,
            particleCount: 'low',
            mediaPipeFPS: 12,
          },
          medium: {
            dpr: 1.5,
            enablePostProcessing: true,
            particleCount: 'medium',
            mediaPipeFPS: 18,
          },
          high: {
            dpr: 2,
            enablePostProcessing: true,
            particleCount: 'high',
            mediaPipeFPS: 24,
          },
        };
        set(presets[preset]);
      },

      getParticleAmount: () => particleAmounts[get().particleCount],
    }),
    {
      name: 'portfolio-performance',
      partialize: (state) => ({
        dpr: state.dpr,
        enablePostProcessing: state.enablePostProcessing,
        particleCount: state.particleCount,
      }),
    }
  )
);
