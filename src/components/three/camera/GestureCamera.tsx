'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useHandPosition, useFaceRotation, useIsGestureEnabled } from '@/stores/gestureStore';
import { lerp } from '@/lib/utils/math';

export function GestureCamera() {
  const { camera } = useThree();
  const handPosition = useHandPosition();
  const faceRotation = useFaceRotation();
  const isGestureEnabled = useIsGestureEnabled();

  const targetRotation = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });

  // Mouse fallback
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isGestureEnabled) {
        mousePosition.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isGestureEnabled]);

  useFrame((_, delta) => {
    const smoothFactor = delta * 3;

    if (isGestureEnabled && handPosition) {
      // Gesture-based camera control
      targetRotation.current.x = (handPosition.y - 0.5) * 0.3;
      targetRotation.current.y = (handPosition.x - 0.5) * 0.5;
    } else {
      // Mouse-based camera control
      targetRotation.current.x = mousePosition.current.y * 0.1;
      targetRotation.current.y = mousePosition.current.x * 0.15;
    }

    // Face rotation adds subtle parallax
    if (isGestureEnabled && faceRotation) {
      targetPosition.current.x = faceRotation.y * 0.3;
      targetPosition.current.y = -faceRotation.x * 0.2;
    } else {
      // Mouse parallax fallback
      targetPosition.current.x = mousePosition.current.x * 0.1;
      targetPosition.current.y = mousePosition.current.y * 0.1;
    }

    // Smooth interpolation
    camera.rotation.x = lerp(camera.rotation.x, targetRotation.current.x, smoothFactor);
    camera.rotation.y = lerp(camera.rotation.y, targetRotation.current.y, smoothFactor);
    camera.position.x = lerp(camera.position.x, targetPosition.current.x, smoothFactor * 0.5);
    camera.position.y = lerp(camera.position.y, targetPosition.current.y, smoothFactor * 0.5);
  });

  return null;
}
