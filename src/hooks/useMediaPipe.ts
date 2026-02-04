'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useGestureStore } from '@/stores/gestureStore';
import { usePerformanceStore } from '@/stores/performanceStore';
import { GestureDetector, detectFaceRotation } from '@/lib/mediapipe/gestureDetector';
import { PositionSmoother } from '@/lib/mediapipe/smoothing';

interface MediaPipeInstance {
  handLandmarker: unknown;
  faceLandmarker: unknown;
}

export function useMediaPipe() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const mediaPipeRef = useRef<MediaPipeInstance | null>(null);
  const gestureDetectorRef = useRef<GestureDetector | null>(null);
  const positionSmootherRef = useRef<PositionSmoother | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const [isInitialized, setIsInitialized] = useState(false);

  const {
    isEnabled,
    setEnabled,
    setLoading,
    setPermission,
    setError,
    setHandPosition,
    setPinching,
    triggerSwipe,
    setFaceRotation,
    reset,
  } = useGestureStore();

  const mediaPipeFPS = usePerformanceStore((s) => s.mediaPipeFPS);
  const frameInterval = 1000 / mediaPipeFPS;

  const initializeMediaPipe = useCallback(async () => {
    if (isInitialized || typeof window === 'undefined') return;

    setLoading(true);
    setError(null);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });

      setPermission(true);

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      await video.play();
      videoRef.current = video;

      // Create canvas for processing
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvasRef.current = canvas;

      // Dynamic import MediaPipe
      const { FilesetResolver, HandLandmarker, FaceLandmarker } = await import(
        '@mediapipe/tasks-vision'
      );

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      // Initialize Hand Landmarker
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Initialize Face Landmarker
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });

      mediaPipeRef.current = { handLandmarker, faceLandmarker };
      gestureDetectorRef.current = new GestureDetector();
      positionSmootherRef.current = new PositionSmoother(0.01, 0.1);

      setIsInitialized(true);
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize gesture detection');
      setPermission(false);
      setLoading(false);
    }
  }, [isInitialized, setLoading, setError, setPermission]);

  const processFrame = useCallback(
    (timestamp: number) => {
      if (!isEnabled || !videoRef.current || !mediaPipeRef.current) {
        return;
      }

      // Throttle frame processing
      if (timestamp - lastFrameTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(processFrame);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const { handLandmarker, faceLandmarker } = mediaPipeRef.current as {
        handLandmarker: { detectForVideo: (video: HTMLVideoElement, timestamp: number) => { landmarks: unknown[][] } };
        faceLandmarker: { detectForVideo: (video: HTMLVideoElement, timestamp: number) => { faceLandmarks: unknown[][] } };
      };
      const video = videoRef.current;

      try {
        // Process hands
        const handResults = handLandmarker.detectForVideo(video, timestamp);
        if (handResults.landmarks && handResults.landmarks.length > 0) {
          const landmarks = handResults.landmarks[0] as { x: number; y: number; z: number }[];
          const detector = gestureDetectorRef.current!;
          const smoother = positionSmootherRef.current!;

          // Get hand position (mirror the x coordinate)
          const rawPos = detector.getHandPosition(landmarks);
          const smoothedPos = smoother.update(1 - rawPos.x, rawPos.y, 0);
          setHandPosition({ x: smoothedPos.x, y: smoothedPos.y });

          // Detect pinch
          const pinch = detector.detectPinch(landmarks);
          setPinching(pinch.isPinching, pinch.progress);

          // Detect swipe
          const swipe = detector.detectSwipe(landmarks);
          if (swipe.direction) {
            triggerSwipe(swipe.direction);
          }
        } else {
          setHandPosition(null);
          setPinching(false, 0);
        }

        // Process face
        const faceResults = faceLandmarker.detectForVideo(video, timestamp);
        if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
          const landmarks = faceResults.faceLandmarks[0] as { x: number; y: number; z: number }[];
          const rotation = detectFaceRotation(landmarks);
          setFaceRotation(rotation);
        } else {
          setFaceRotation(null);
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      }

      animationRef.current = requestAnimationFrame(processFrame);
    },
    [isEnabled, frameInterval, setHandPosition, setPinching, triggerSwipe, setFaceRotation]
  );

  const startTracking = useCallback(async () => {
    if (!isInitialized) {
      await initializeMediaPipe();
    }
    setEnabled(true);
  }, [isInitialized, initializeMediaPipe, setEnabled]);

  const stopTracking = useCallback(() => {
    setEnabled(false);
    reset();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [setEnabled, reset]);

  const cleanup = useCallback(() => {
    stopTracking();

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    mediaPipeRef.current = null;
    gestureDetectorRef.current = null;
    positionSmootherRef.current = null;
    setIsInitialized(false);
  }, [stopTracking]);

  // Start processing when enabled
  useEffect(() => {
    if (isEnabled && isInitialized) {
      animationRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isEnabled, isInitialized, processFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isInitialized,
    startTracking,
    stopTracking,
    cleanup,
    videoRef,
  };
}
