'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MusicStore {
  isPlaying: boolean;
  hasAsked: boolean;
  volume: number;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setHasAsked: (asked: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set) => ({
      isPlaying: false,
      hasAsked: false,
      volume: 0.5,

      setPlaying: (playing) => set({ isPlaying: playing }),
      togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setHasAsked: (asked) => set({ hasAsked: asked }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'portfolio-music',
      partialize: (state) => ({ hasAsked: state.hasAsked, volume: state.volume }),
    }
  )
);
