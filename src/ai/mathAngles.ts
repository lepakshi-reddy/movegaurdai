import { Point3D } from '../types/exercises';

/**
 * Calculates the angle in degrees at vertex B formed by points A, B, and C.
 * Works in 2D (or 3D if z coordinate is present).
 */
export function calculateAngle(a: Point3D, b: Point3D, c: Point3D): number {
  if (!a || !b || !c) return 180;

  // Vector BA
  const baX = a.x - b.x;
  const baY = a.y - b.y;
  const baZ = (a.z ?? 0) - (b.z ?? 0);

  // Vector BC
  const bcX = c.x - b.x;
  const bcY = c.y - b.y;
  const bcZ = (c.z ?? 0) - (b.z ?? 0);

  // Dot product
  const dotProduct = baX * bcX + baY * bcY + baZ * bcZ;

  // Magnitudes
  const magBA = Math.sqrt(baX * baX + baY * baY + baZ * baZ);
  const magBC = Math.sqrt(bcX * bcX + bcY * bcY + bcZ * bcZ);

  if (magBA === 0 || magBC === 0) return 180;

  // Cosine with numerical clamp to [-1, 1]
  const cosine = Math.max(-1, Math.min(1, dotProduct / (magBA * magBC)));
  const angleRad = Math.acos(cosine);
  const angleDeg = (angleRad * 180) / Math.PI;

  return Math.round(angleDeg * 10) / 10;
}

/**
 * Calculates inclination angle against vertical (90 deg is upright).
 */
export function calculateVerticalAngle(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return Math.round(((angleRad * 180) / Math.PI) * 10) / 10;
}

/**
 * Exponential Moving Average filter for angle smoothing to eliminate camera noise and jitter.
 */
export class AngleSmoother {
  private smoothedValue: number | null = null;
  private alpha: number;

  constructor(alpha: number = 0.35) {
    this.alpha = Math.max(0.05, Math.min(1.0, alpha));
  }

  public smooth(rawValue: number): number {
    if (this.smoothedValue === null) {
      this.smoothedValue = rawValue;
      return rawValue;
    }
    this.smoothedValue = this.alpha * rawValue + (1 - this.alpha) * this.smoothedValue;
    return Math.round(this.smoothedValue * 10) / 10;
  }

  public reset(initialValue?: number) {
    this.smoothedValue = initialValue ?? null;
  }

  public get current(): number | null {
    return this.smoothedValue;
  }
}
