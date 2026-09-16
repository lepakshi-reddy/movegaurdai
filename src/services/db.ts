import {
  ChatMessage,
  DailyActivity,
  ExerciseType,
  PostureSession,
  Profile,
  RepEvent,
  WorkoutSession,
} from '../types/database';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  PROFILES: 'mg_profiles',
  WORKOUTS: 'mg_workout_sessions',
  REP_EVENTS: 'mg_rep_events',
  POSTURE: 'mg_posture_sessions',
  DAILY_ACTIVITY: 'mg_daily_activity',
  CHAT: 'mg_chat_messages',
};

// Universal storage adapter (LocalStorage in browser, in-memory Map in Node/test environments)
class UniversalStorage {
  private memoryMap = new Map<string, string>();

  getItem(key: string): string | null {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return this.memoryMap.get(key) || null;
      }
    }
    return this.memoryMap.get(key) || null;
  }

  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        // fall back to memory map
      }
    }
    this.memoryMap.set(key, value);
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {}
    }
    this.memoryMap.delete(key);
  }
}

const storage = new UniversalStorage();

// Seed realistic demo data
function initializeLocalStore() {
  if (!storage.getItem(STORAGE_KEYS.PROFILES)) {
    const demoProfiles: Profile[] = [
      {
        id: 'p-demo-user-1',
        user_id: 'usr-demo-001',
        full_name: 'Alex Rivera',
        email: 'demo@moveguard.ai',
        age: 27,
        height: 178,
        fitness_level: 'intermediate',
        preferred_language: 'en',
        role: 'user',
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'p-demo-admin-1',
        user_id: 'usr-admin-001',
        full_name: 'Dr. Priya Sharma',
        email: 'admin@moveguard.ai',
        age: 34,
        height: 165,
        fitness_level: 'advanced',
        preferred_language: 'en',
        role: 'admin',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    storage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(demoProfiles));
  }

  if (!storage.getItem(STORAGE_KEYS.WORKOUTS)) {
    const now = Date.now();
    const demoWorkouts: WorkoutSession[] = [
      {
        id: 'w-001',
        user_id: 'usr-demo-001',
        exercise_type: 'squat',
        repetitions: 15,
        form_score: 92,
        duration_seconds: 140,
        feedback_summary: ['Excellent depth', 'Consistent cadence', 'Knees aligned'],
        is_demo: false,
        started_at: new Date(now - 3600000 * 2).toISOString(),
        completed_at: new Date(now - 3600000 * 2 + 140000).toISOString(),
        created_at: new Date(now - 3600000 * 2).toISOString(),
      },
      {
        id: 'w-002',
        user_id: 'usr-demo-001',
        exercise_type: 'pushup',
        repetitions: 12,
        form_score: 86,
        duration_seconds: 110,
        feedback_summary: ['Strong body line', 'Lowered to 90°', 'Minor hip sag on rep 11'],
        is_demo: false,
        started_at: new Date(now - 86400000).toISOString(),
        completed_at: new Date(now - 86400000 + 110000).toISOString(),
        created_at: new Date(now - 86400000).toISOString(),
      },
      {
        id: 'w-003',
        user_id: 'usr-demo-001',
        exercise_type: 'lunge',
        repetitions: 16,
        form_score: 89,
        duration_seconds: 160,
        feedback_summary: ['Balanced foot placement', 'Upright trunk', 'Good depth'],
        is_demo: false,
        started_at: new Date(now - 86400000 * 3).toISOString(),
        completed_at: new Date(now - 86400000 * 3 + 160000).toISOString(),
        created_at: new Date(now - 86400000 * 3).toISOString(),
      },
      {
        id: 'w-004',
        user_id: 'usr-demo-001',
        exercise_type: 'situp',
        repetitions: 20,
        form_score: 94,
        duration_seconds: 180,
        feedback_summary: ['Full range of motion', 'Controlled tempo', 'Neck relaxed'],
        is_demo: false,
        started_at: new Date(now - 86400000 * 5).toISOString(),
        completed_at: new Date(now - 86400000 * 5 + 180000).toISOString(),
        created_at: new Date(now - 86400000 * 5).toISOString(),
      },
    ];
    storage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(demoWorkouts));
  }

  if (!storage.getItem(STORAGE_KEYS.POSTURE)) {
    const demoPosture: PostureSession[] = [
      {
        id: 'post-001',
        user_id: 'usr-demo-001',
        overall_score: 84,
        neck_score: 82,
        shoulder_score: 88,
        back_score: 82,
        duration_seconds: 360,
        detected_issues: ['Slight forward head tilt'],
        feedback_summary: ['Good shoulder alignment', 'Bring head back slightly'],
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
    storage.setItem(STORAGE_KEYS.POSTURE, JSON.stringify(demoPosture));
  }
}

initializeLocalStore();

export const dbService = {
  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
      if (!error && data) return data as Profile;
    }
    const stored: Profile[] = JSON.parse(storage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    return stored.find((p) => p.user_id === userId) || null;
  },

  async saveProfile(profile: Profile): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').upsert(profile);
    }
    const stored: Profile[] = JSON.parse(storage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const index = stored.findIndex((p) => p.user_id === profile.user_id);
    if (index >= 0) {
      stored[index] = profile;
    } else {
      stored.push(profile);
    }
    storage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(stored));
  },

  // Workout Sessions
  async saveWorkoutSession(session: WorkoutSession, repEvents: RepEvent[]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('workout_sessions').insert(session);
      if (repEvents.length > 0) {
        await supabase.from('rep_events').insert(repEvents);
      }
    }

    const workouts: WorkoutSession[] = JSON.parse(storage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');
    workouts.unshift(session);
    storage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));

    if (repEvents.length > 0) {
      const storedReps: RepEvent[] = JSON.parse(storage.getItem(STORAGE_KEYS.REP_EVENTS) || '[]');
      storage.setItem(STORAGE_KEYS.REP_EVENTS, JSON.stringify([...storedReps, ...repEvents]));
    }
  },

  async getWorkoutSessions(userId: string, exerciseFilter?: ExerciseType | 'all'): Promise<WorkoutSession[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('workout_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (exerciseFilter && exerciseFilter !== 'all') {
        query = query.eq('exercise_type', exerciseFilter);
      }
      const { data, error } = await query;
      if (!error && data) return data as WorkoutSession[];
    }

    const workouts: WorkoutSession[] = JSON.parse(storage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');
    return workouts.filter((w) => {
      const matchUser = w.user_id === userId;
      const matchType = !exerciseFilter || exerciseFilter === 'all' || w.exercise_type === exerciseFilter;
      return matchUser && matchType;
    });
  },

  // Rep Events
  async getRepEventsBySession(sessionId: string): Promise<RepEvent[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('rep_events').select('*').eq('session_id', sessionId).order('rep_number', { ascending: true });
      if (!error && data) return data as RepEvent[];
    }
    const reps: RepEvent[] = JSON.parse(storage.getItem(STORAGE_KEYS.REP_EVENTS) || '[]');
    return reps.filter((r) => r.session_id === sessionId);
  },

  // Posture Sessions
  async savePostureSession(session: PostureSession): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('posture_sessions').insert(session);
    }
    const list: PostureSession[] = JSON.parse(storage.getItem(STORAGE_KEYS.POSTURE) || '[]');
    list.unshift(session);
    storage.setItem(STORAGE_KEYS.POSTURE, JSON.stringify(list));
  },

  async getPostureSessions(userId: string): Promise<PostureSession[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('posture_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return data as PostureSession[];
    }
    const list: PostureSession[] = JSON.parse(storage.getItem(STORAGE_KEYS.POSTURE) || '[]');
    return list.filter((p) => p.user_id === userId);
  },

  // Chat messages
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    const list: ChatMessage[] = JSON.parse(storage.getItem(`${STORAGE_KEYS.CHAT}_${userId}`) || '[]');
    return list;
  },

  async saveChatMessage(msg: ChatMessage): Promise<void> {
    const key = `${STORAGE_KEYS.CHAT}_${msg.user_id}`;
    const list: ChatMessage[] = JSON.parse(storage.getItem(key) || '[]');
    list.push(msg);
    storage.setItem(key, JSON.stringify(list));
  },

  // Admin Telemetry & Statistics
  async getAdminStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalReps: number;
    avgFormScore: number;
    exerciseDistribution: Record<string, number>;
    recentWorkouts: WorkoutSession[];
    recentUsers: Profile[];
  }> {
    const profiles: Profile[] = JSON.parse(storage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const workouts: WorkoutSession[] = JSON.parse(storage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');

    const totalReps = workouts.reduce((acc, w) => acc + (w.repetitions || 0), 0);
    const avgFormScore =
      workouts.length > 0
        ? Math.round(workouts.reduce((acc, w) => acc + (w.form_score || 0), 0) / workouts.length)
        : 0;

    const exerciseDistribution: Record<string, number> = {
      squat: 0,
      pushup: 0,
      situp: 0,
      lunge: 0,
    };

    workouts.forEach((w) => {
      if (exerciseDistribution[w.exercise_type] !== undefined) {
        exerciseDistribution[w.exercise_type] += w.repetitions;
      }
    });

    return {
      totalUsers: profiles.length,
      activeUsers: profiles.length,
      totalSessions: workouts.length,
      totalReps,
      avgFormScore,
      exerciseDistribution,
      recentWorkouts: workouts.slice(0, 8),
      recentUsers: profiles.slice(0, 8),
    };
  },
};
