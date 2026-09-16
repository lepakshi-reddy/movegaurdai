import { describe, it, expect } from 'vitest';
import { calculateAngle, calculateVerticalAngle, AngleSmoother } from '../src/ai/mathAngles';

describe('Biomechanical Vector Angle Calculations', () => {
  it('calculates a 90-degree right angle accurately', () => {
    const a = { x: 0, y: 1 };
    const b = { x: 0, y: 0 }; // vertex
    const c = { x: 1, y: 0 };
    const angle = calculateAngle(a, b, c);
    expect(angle).toBe(90);
  });

  it('calculates a 180-degree straight angle accurately', () => {
    const a = { x: 0, y: 1 };
    const b = { x: 0, y: 0 }; // vertex
    const c = { x: 0, y: -1 };
    const angle = calculateAngle(a, b, c);
    expect(angle).toBe(180);
  });

  it('calculates vertical inclination angle accurately', () => {
    // Perfectly vertical points
    const p1 = { x: 0.5, y: 0.2 };
    const p2 = { x: 0.5, y: 0.8 };
    const angle = calculateVerticalAngle(p1, p2);
    expect(angle).toBe(0);
  });

  it('AngleSmoother filters noise smoothly', () => {
    const smoother = new AngleSmoother(0.5);
    const v1 = smoother.smooth(100);
    expect(v1).toBe(100);

    const v2 = smoother.smooth(120);
    // (0.5 * 120) + (0.5 * 100) = 110
    expect(v2).toBe(110);
  });
});
