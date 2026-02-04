export class KalmanFilter {
  private x: number = 0;
  private p: number = 1;
  private q: number;
  private r: number;

  constructor(processNoise: number = 0.01, measurementNoise: number = 0.1) {
    this.q = processNoise;
    this.r = measurementNoise;
  }

  update(measurement: number): number {
    // Prediction
    this.p = this.p + this.q;

    // Update
    const k = this.p / (this.p + this.r);
    this.x = this.x + k * (measurement - this.x);
    this.p = (1 - k) * this.p;

    return this.x;
  }

  reset(initialValue: number = 0): void {
    this.x = initialValue;
    this.p = 1;
  }

  getValue(): number {
    return this.x;
  }
}

export class PositionSmoother {
  private xFilter: KalmanFilter;
  private yFilter: KalmanFilter;
  private zFilter: KalmanFilter;

  constructor(processNoise: number = 0.01, measurementNoise: number = 0.1) {
    this.xFilter = new KalmanFilter(processNoise, measurementNoise);
    this.yFilter = new KalmanFilter(processNoise, measurementNoise);
    this.zFilter = new KalmanFilter(processNoise, measurementNoise);
  }

  update(x: number, y: number, z: number = 0): { x: number; y: number; z: number } {
    return {
      x: this.xFilter.update(x),
      y: this.yFilter.update(y),
      z: this.zFilter.update(z),
    };
  }

  reset(): void {
    this.xFilter.reset();
    this.yFilter.reset();
    this.zFilter.reset();
  }
}

export class ExponentialSmoother {
  private value: number | null = null;
  private alpha: number;

  constructor(alpha: number = 0.3) {
    this.alpha = alpha;
  }

  update(newValue: number): number {
    if (this.value === null) {
      this.value = newValue;
    } else {
      this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    }
    return this.value;
  }

  reset(): void {
    this.value = null;
  }

  getValue(): number | null {
    return this.value;
  }
}

export class VelocityTracker {
  private history: Array<{ x: number; y: number; time: number }> = [];
  private maxHistory: number;

  constructor(maxHistory: number = 5) {
    this.maxHistory = maxHistory;
  }

  addPoint(x: number, y: number): void {
    this.history.push({ x, y, time: Date.now() });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getVelocity(): { vx: number; vy: number } {
    if (this.history.length < 2) {
      return { vx: 0, vy: 0 };
    }

    const oldest = this.history[0];
    const newest = this.history[this.history.length - 1];
    const dt = (newest.time - oldest.time) / 1000;

    if (dt === 0) return { vx: 0, vy: 0 };

    return {
      vx: (newest.x - oldest.x) / dt,
      vy: (newest.y - oldest.y) / dt,
    };
  }

  reset(): void {
    this.history = [];
  }
}
