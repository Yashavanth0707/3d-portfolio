export interface HandPosition {
  x: number;
  y: number;
}

export interface FaceRotation {
  x: number;
  y: number;
  z: number;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

export interface GestureState {
  isEnabled: boolean;
  isLoading: boolean;
  hasPermission: boolean | null;
  error: string | null;
  handPosition: HandPosition | null;
  isPinching: boolean;
  pinchProgress: number;
  swipeDirection: SwipeDirection;
  faceRotation: FaceRotation | null;
}

export interface GestureActions {
  setEnabled: (enabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPermission: (permission: boolean) => void;
  setError: (error: string | null) => void;
  setHandPosition: (pos: HandPosition | null) => void;
  setPinching: (isPinching: boolean, progress?: number) => void;
  triggerSwipe: (direction: Exclude<SwipeDirection, null>) => void;
  setFaceRotation: (rotation: FaceRotation | null) => void;
  reset: () => void;
}

export interface MediaPipeConfig {
  hands: boolean;
  faceMesh: boolean;
  targetFPS: number;
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}
