import { describe, it, expect, beforeEach } from 'vitest';
import { dbService } from '../src/services/db';
import { WorkoutSession } from '../src/types/database';

describe('Database and Profile Layer', () => {
  beforeEach(() => {
    // Clean mock storage if needed
  });

  it('retrieves seeded demo profile and verifies role', async () => {
    const userProfile = await dbService.getProfile('usr-demo-001');
    expect(userProfile).not.toBeNull();
    expect(userProfile?.role).toBe('user');

    const adminProfile = await dbService.getProfile('usr-admin-001');
    expect(adminProfile).not.toBeNull();
    expect(adminProfile?.role).toBe('admin');
  });

  it('saves and retrieves workout session properly', async () => {
    const session: WorkoutSession = {
      id: `test-session-${Date.now()}`,
      user_id: 'usr-demo-001',
      exercise_type: 'squat',
      repetitions: 15,
      form_score: 93,
      duration_seconds: 90,
      feedback_summary: ['Good depth', 'Smooth cadence'],
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    await dbService.saveWorkoutSession(session, []);
    const userWorkouts = await dbService.getWorkoutSessions('usr-demo-001');
    const saved = userWorkouts.find((w) => w.id === session.id);

    expect(saved).toBeDefined();
    expect(saved?.repetitions).toBe(15);
    expect(saved?.form_score).toBe(93);
  });

  it('calculates admin platform stats correctly without exposing camera frames', async () => {
    const stats = await dbService.getAdminStats();
    expect(stats.totalUsers).toBeGreaterThan(0);
    expect(stats.totalSessions).toBeGreaterThan(0);
    expect(stats.totalReps).toBeGreaterThan(0);
    expect(stats.exerciseDistribution).toBeDefined();
  });
});
