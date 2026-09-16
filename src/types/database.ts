export type UserRole = 'user' | 'admin';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type Language = 'en' | 'te' | 'hi';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  age?: number;
  height?: number; // cm
  fitness_level: FitnessLevel;
  preferred_language: Language;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ExerciseType = 'squat' | 'pushup' | 'situp' | 'lunge';

export interface WorkoutSession {
  id: string;
  user_id: string;
  exercise_type: ExerciseType;
  repetitions: number;
  form_score: number; // 0 - 100
  duration_seconds: number;
  feedback_summary: string[];
  is_demo?: boolean;
  started_at: string;
  completed_at: string;
  created_at: string;
}

export interface RepEvent {
  id: string;
  session_id: string;
  user_id: string;
  exercise_type: ExerciseType;
  rep_number: number;
  form_score: number;
  feedback: string;
  metrics: {
    primaryAngle: number;
    depthAchieved?: number;
    durationMs: number;
  };
  created_at: string;
}

export interface PostureSession {
  id: string;
  user_id: string;
  overall_score: number; // 0 - 100
  neck_score: number;
  shoulder_score: number;
  back_score: number;
  duration_seconds: number;
  detected_issues: string[];
  feedback_summary: string[];
  created_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  movement_score: number;
  total_reps: number;
  total_sessions: number;
  active_minutes: number;
  posture_checks: number;
  movement_breaks: number;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender: 'user' | 'assistant';
  content: string;
  created_at: string;
}
