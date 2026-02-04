'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GestureState, GestureActions, HandPosition, FaceRotation, SwipeDirection } from '@/types/gesture.types';

type GestureStore = GestureState & GestureActions;

const initialState: GestureState = {
  isEnabled: false,
  isLoading: false,
  hasPermission: null,
  error: null,
  handPosition: null,
  isPinching: false,
  pinchProgress: 0,
  swipeDirection: null,
  faceRotation: null,
};

export const useGestureStore = create<GestureStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setEnabled: (enabled: boolean) => set({ isEnabled: enabled }),

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    setPermission: (permission: boolean) => set({ hasPermission: permission }),

    setError: (error: string | null) => set({ error }),

    setHandPosition: (pos: HandPosition | null) => set({ handPosition: pos }),

    setPinching: (isPinching: boolean, progress: number = 0) =>
      set({ isPinching, pinchProgress: progress }),

    triggerSwipe: (direction: Exclude<SwipeDirection, null>) => {
      set({ swipeDirection: direction });
      setTimeout(() => set({ swipeDirection: null }), 300);
    },

    setFaceRotation: (rotation: FaceRotation | null) => set({ faceRotation: rotation }),

    reset: () =>
      set({
        handPosition: null,
        isPinching: false,
        pinchProgress: 0,
        swipeDirection: null,
        faceRotation: null,
      }),
  }))
);

// Selector hooks for optimized re-renders
export const useHandPosition = () => useGestureStore((s) => s.handPosition);
export const useIsPinching = () => useGestureStore((s) => s.isPinching);
export const useSwipeDirection = () => useGestureStore((s) => s.swipeDirection);
export const useFaceRotation = () => useGestureStore((s) => s.faceRotation);
export const useIsGestureEnabled = () => useGestureStore((s) => s.isEnabled);
