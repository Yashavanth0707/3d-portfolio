import { distance2D } from '@/lib/utils/math';
import { VelocityTracker } from './smoothing';
import type { LandmarkPoint, SwipeDirection } from '@/types/gesture.types';

export interface PinchResult {
  isPinching: boolean;
  distance: number;
  progress: number;
}

export interface SwipeResult {
  direction: Exclude<SwipeDirection, null> | null;
  velocity: number;
}

export interface HandLandmarks {
  landmarks: LandmarkPoint[];
}

// Hand landmark indices
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_TIP = 12;
const WRIST = 0;
const INDEX_MCP = 5;
const PINKY_MCP = 17;

// Thresholds
const PINCH_START_THRESHOLD = 0.08;
const PINCH_END_THRESHOLD = 0.12;
const SWIPE_VELOCITY_THRESHOLD = 1.5;

export class GestureDetector {
  private velocityTracker: VelocityTracker;
  private lastPinchState: boolean = false;
  private swipeCooldown: boolean = false;

  constructor() {
    this.velocityTracker = new VelocityTracker(5);
  }

  getPalmCenter(landmarks: LandmarkPoint[]): { x: number; y: number } {
    const wrist = landmarks[WRIST];
    const indexMcp = landmarks[INDEX_MCP];
    const pinkyMcp = landmarks[PINKY_MCP];

    return {
      x: (wrist.x + indexMcp.x + pinkyMcp.x) / 3,
      y: (wrist.y + indexMcp.y + pinkyMcp.y) / 3,
    };
  }

  detectPinch(landmarks: LandmarkPoint[]): PinchResult {
    const thumbTip = landmarks[THUMB_TIP];
    const indexTip = landmarks[INDEX_TIP];

    const distance = distance2D(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);

    // Use hysteresis to prevent flickering
    const threshold = this.lastPinchState
      ? PINCH_END_THRESHOLD
      : PINCH_START_THRESHOLD;

    const isPinching = distance < threshold;
    this.lastPinchState = isPinching;

    // Calculate progress (1 = fully pinched, 0 = far apart)
    const progress = Math.max(0, Math.min(1, 1 - distance / 0.2));

    return {
      isPinching,
      distance,
      progress,
    };
  }

  detectSwipe(landmarks: LandmarkPoint[]): SwipeResult {
    if (this.swipeCooldown) {
      return { direction: null, velocity: 0 };
    }

    const palmCenter = this.getPalmCenter(landmarks);
    this.velocityTracker.addPoint(palmCenter.x, palmCenter.y);

    const { vx, vy } = this.velocityTracker.getVelocity();
    const velocity = Math.sqrt(vx * vx + vy * vy);

    if (velocity > SWIPE_VELOCITY_THRESHOLD) {
      let direction: Exclude<SwipeDirection, null> | null = null;

      if (Math.abs(vx) > Math.abs(vy)) {
        direction = vx > 0 ? 'right' : 'left';
      } else {
        direction = vy > 0 ? 'down' : 'up';
      }

      if (direction) {
        this.swipeCooldown = true;
        setTimeout(() => {
          this.swipeCooldown = false;
          this.velocityTracker.reset();
        }, 500);
      }

      return { direction, velocity };
    }

    return { direction: null, velocity };
  }

  getHandPosition(landmarks: LandmarkPoint[]): { x: number; y: number } {
    // Use index finger tip for precise pointing
    const indexTip = landmarks[INDEX_TIP];
    return { x: indexTip.x, y: indexTip.y };
  }

  isHandOpen(landmarks: LandmarkPoint[]): boolean {
    // Check if fingers are extended
    const thumbTip = landmarks[THUMB_TIP];
    const indexTip = landmarks[INDEX_TIP];
    const middleTip = landmarks[MIDDLE_TIP];
    const wrist = landmarks[WRIST];

    const thumbDist = distance2D(thumbTip.x, thumbTip.y, wrist.x, wrist.y);
    const indexDist = distance2D(indexTip.x, indexTip.y, wrist.x, wrist.y);
    const middleDist = distance2D(middleTip.x, middleTip.y, wrist.x, wrist.y);

    return thumbDist > 0.15 && indexDist > 0.2 && middleDist > 0.2;
  }

  reset(): void {
    this.velocityTracker.reset();
    this.lastPinchState = false;
    this.swipeCooldown = false;
  }
}

// Face landmark indices for rotation detection
const NOSE_TIP = 1;
const LEFT_EYE_OUTER = 33;
const RIGHT_EYE_OUTER = 263;
const CHIN = 152;
const FOREHEAD = 10;

export function detectFaceRotation(landmarks: LandmarkPoint[]): {
  x: number;
  y: number;
  z: number;
} {
  if (landmarks.length < 468) {
    return { x: 0, y: 0, z: 0 };
  }

  const nose = landmarks[NOSE_TIP];
  const leftEye = landmarks[LEFT_EYE_OUTER];
  const rightEye = landmarks[RIGHT_EYE_OUTER];
  const chin = landmarks[CHIN];
  const forehead = landmarks[FOREHEAD];

  // Horizontal rotation (yaw) - based on eye positions
  const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
  const yaw = (nose.x - eyeCenter.x) * 2;

  // Vertical rotation (pitch) - based on nose to chin/forehead
  const faceHeight = Math.abs(forehead.y - chin.y);
  const noseOffset = (nose.y - (forehead.y + chin.y) / 2) / faceHeight;
  const pitch = noseOffset * 2;

  // Roll - based on eye tilt
  const eyeDeltaY = rightEye.y - leftEye.y;
  const eyeDeltaX = rightEye.x - leftEye.x;
  const roll = Math.atan2(eyeDeltaY, eyeDeltaX);

  return {
    x: pitch,
    y: yaw,
    z: roll,
  };
}
