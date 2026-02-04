'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@/providers/GestureProvider';
import { useGestureStore, useIsGestureEnabled } from '@/stores/gestureStore';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export function GestureIndicator() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { startTracking, stopTracking } = useGesture();
  const isEnabled = useIsGestureEnabled();
  const isLoading = useGestureStore((s) => s.isLoading);
  const error = useGestureStore((s) => s.error);
  const { hasCamera, isMobile, supportsMediaPipe } = useDeviceCapabilities();

  const canUseGestures = hasCamera && supportsMediaPipe && !isMobile;

  const handleToggle = async () => {
    if (isEnabled) {
      stopTracking();
    } else {
      await startTracking();
    }
  };

  if (!canUseGestures) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
          isEnabled
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
            />
          </svg>
        )}
        <span>{isEnabled ? 'Gestures On' : 'Gestures'}</span>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-sm z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : isEnabled ? (
              <div className="space-y-2">
                <p className="text-green-400 font-medium">Gesture control active</p>
                <ul className="text-gray-400 space-y-1">
                  <li>• Move hand to control camera</li>
                  <li>• Pinch to select items</li>
                  <li>• Swipe to navigate</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300">Enable gesture control</p>
                <p className="text-gray-500 text-xs">
                  Use your webcam for hand and face tracking to interact with the 3D
                  environment.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
