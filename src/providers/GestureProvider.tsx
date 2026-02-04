'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMediaPipe } from '@/hooks/useMediaPipe';

interface GestureContextValue {
  isInitialized: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

const GestureContext = createContext<GestureContextValue | null>(null);

export function GestureProvider({ children }: { children: ReactNode }) {
  const { isInitialized, startTracking, stopTracking } = useMediaPipe();

  return (
    <GestureContext.Provider
      value={{
        isInitialized,
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </GestureContext.Provider>
  );
}

export function useGesture() {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGesture must be used within a GestureProvider');
  }
  return context;
}

// Re-export store hooks for convenience
export {
  useGestureStore,
  useHandPosition,
  useIsPinching,
  useSwipeDirection,
  useFaceRotation,
  useIsGestureEnabled,
} from '@/stores/gestureStore';
