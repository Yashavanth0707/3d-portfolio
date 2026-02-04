'use client';

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  hasCamera: boolean;
  hasTouchscreen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebGL: boolean;
  supportsMediaPipe: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasCamera: false,
    hasTouchscreen: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    supportsWebGL: false,
    supportsMediaPipe: false,
    screenWidth: 1920,
    screenHeight: 1080,
    devicePixelRatio: 1,
  });

  useEffect(() => {
    const checkCapabilities = async () => {
      // Screen dimensions
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Device type detection
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;

      // Touch support
      const hasTouchscreen =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      // Camera support
      let hasCamera = false;
      try {
        const devices = await navigator.mediaDevices?.enumerateDevices();
        hasCamera = devices?.some((d) => d.kind === 'videoinput') ?? false;
      } catch {
        hasCamera = false;
      }

      // WebGL support
      let supportsWebGL = false;
      try {
        const canvas = document.createElement('canvas');
        supportsWebGL = !!(
          canvas.getContext('webgl') || canvas.getContext('webgl2')
        );
      } catch {
        supportsWebGL = false;
      }

      // MediaPipe support (requires camera and modern browser features)
      const supportsMediaPipe =
        hasCamera &&
        typeof window !== 'undefined' &&
        'MediaStreamTrackProcessor' in window ||
        (supportsWebGL && !isMobile);

      setCapabilities({
        hasCamera,
        hasTouchscreen,
        isMobile,
        isTablet,
        isDesktop,
        supportsWebGL,
        supportsMediaPipe,
        screenWidth,
        screenHeight,
        devicePixelRatio,
      });
    };

    checkCapabilities();

    const handleResize = () => {
      setCapabilities((prev) => ({
        ...prev,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}
