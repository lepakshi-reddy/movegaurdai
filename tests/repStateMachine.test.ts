import { describe, it, expect, beforeEach } from 'vitest';
import { RepStateMachine } from '../src/ai/repStateMachine';
import { ExerciseThresholds } from '../src/types/exercises';

describe('RepStateMachine - Biomechanical Repetition Counting', () => {
  const defaultThresholds: ExerciseThresholds = {
    upThreshold: 155,
    downThreshold: 95,
    hysteresis: 15,
    minTransitionDurationMs: 400,
    debounceMs: 500,
    minConfidence: 0.5,
  };

  let machine: RepStateMachine;

  beforeEach(() => {
    // Instantiate with alpha 1.0 for precise step testing of transition state machine
    machine = new RepStateMachine(defaultThresholds, 1.0);
  });

  it('Pattern: UP -> DOWN -> DOWN -> DOWN -> UP equals exactly 1 rep', () => {
    let t = 1000;

    // Start in UP position (standing)
    machine.update(165, 1.0, t);
    expect(machine.getState()).toBe('UP');
    expect(machine.getCount()).toBe(0);

    // Transition to descent
    t += 500;
    machine.update(130, 1.0, t);
    expect(machine.getState()).toBe('DESCENDING');

    // Reach DOWN depth (85° <= 95°)
    t += 500;
    machine.update(85, 1.0, t);
    expect(machine.getState()).toBe('DOWN');
    expect(machine.getCount()).toBe(0);

    // Stay in DOWN (repeated frames)
    t += 200;
    machine.update(85, 1.0, t);
    expect(machine.getState()).toBe('DOWN');
    expect(machine.getCount()).toBe(0);

    t += 200;
    machine.update(84, 1.0, t);
    expect(machine.getState()).toBe('DOWN');
    expect(machine.getCount()).toBe(0);

    // Ascend: angle rises above downThreshold + hysteresis (95 + 15 = 110)
    t += 500;
    machine.update(125, 1.0, t);
    expect(machine.getState()).toBe('ASCENDING');
    expect(machine.getCount()).toBe(0);

    // Complete repetition: reach UP threshold (>= 155)
    t += 500;
    const result = machine.update(165, 1.0, t);
    expect(machine.getState()).toBe('UP');
    expect(machine.getCount()).toBe(1);
    expect(result.isNewRep).toBe(true);
  });

  it('Pattern: UP -> DOWN -> UP -> DOWN -> UP equals exactly 2 reps', () => {
    let t = 1000;

    // Rep 1: UP -> DOWN -> UP
    machine.update(165, 1.0, t);
    t += 500;
    machine.update(85, 1.0, t); // DOWN
    t += 500;
    machine.update(120, 1.0, t); // ASCENDING
    t += 500;
    machine.update(165, 1.0, t); // UP -> rep 1
    expect(machine.getCount()).toBe(1);

    // Clear debounce (500ms)
    t += 600;

    // Rep 2: UP -> DOWN -> UP
    machine.update(130, 1.0, t); // DESCENDING
    t += 500;
    machine.update(80, 1.0, t); // DOWN
    t += 500;
    machine.update(120, 1.0, t); // ASCENDING
    t += 500;
    machine.update(165, 1.0, t); // UP -> rep 2
    expect(machine.getCount()).toBe(2);
  });

  it('Pattern: Incomplete rep (UP -> DOWN -> DOWN) equals 0 reps', () => {
    let t = 1000;
    machine.update(165, 1.0, t);
    t += 500;
    machine.update(88, 1.0, t); // DOWN
    t += 300;
    machine.update(85, 1.0, t); // Still DOWN
    expect(machine.getCount()).toBe(0);
  });

  it('Pattern: Shallow rep (UP -> DESCENDING -> UP without DOWN) resets to 0 reps', () => {
    let t = 1000;
    machine.update(165, 1.0, t);
    t += 500;
    machine.update(120, 1.0, t); // DESCENDING (did not reach 95)
    expect(machine.getState()).toBe('DESCENDING');
    t += 500;
    machine.update(165, 1.0, t); // Returns back up
    expect(machine.getState()).toBe('UP');
    expect(machine.getCount()).toBe(0);
  });

  it('Pattern: Noise resilience (UP -> DOWN -> DOWN -> UP -> UP -> UP) equals exactly 1 rep', () => {
    let t = 1000;
    machine.update(165, 1.0, t);
    t += 500;
    machine.update(85, 1.0, t);
    t += 200;
    machine.update(85, 1.0, t);
    t += 500;
    machine.update(125, 1.0, t);
    t += 500;
    machine.update(165, 1.0, t); // Rep 1 completed
    expect(machine.getCount()).toBe(1);

    // Repeated consecutive UP frames
    t += 100;
    machine.update(165, 1.0, t);
    t += 100;
    machine.update(168, 1.0, t);
    t += 100;
    machine.update(162, 1.0, t);
    expect(machine.getCount()).toBe(1);
  });

  it('Rejects frames when landmark confidence is below threshold', () => {
    let t = 1000;
    machine.update(165, 1.0, t);
    t += 500;
    // Low confidence frame (0.2 < 0.5)
    const result = machine.update(80, 0.2, t);
    expect(result.issues).toContain('Low landmark confidence');
    expect(machine.getCount()).toBe(0);
  });
});
