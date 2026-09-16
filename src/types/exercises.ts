import { ExerciseType } from './database';

export interface Point3D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface Landmark extends Point3D {
  name?: string;
}

export type RepState = 'UP' | 'DESCENDING' | 'DOWN' | 'ASCENDING' | 'COMPLETED';

export type AIStatus =
  | 'Loading AI'
  | 'AI Ready'
  | 'AI Live'
  | 'No Person Detected'
  | 'Low Confidence'
  | 'Camera Error'
  | 'Demo Active';

export interface ExerciseThresholds {
  // e.g. for squat: knee angle
  upThreshold: number; // e.g. 155°
  downThreshold: number; // e.g. 95°
  hysteresis: number; // buffer degrees
  minTransitionDurationMs: number; // prevent noise/flutter
  debounceMs: number; // lockout time after rep completion
  minConfidence: number; // min landmark visibility
}

export interface JointFeedback {
  issueDetected: boolean;
  scorePenalty: number;
  message: string;
}

export interface ExerciseConfig {
  id: ExerciseType;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  primaryJoint: string;
  secondaryJoint?: string;
  targetMuscles: string[];
  thresholds: ExerciseThresholds;
  requiredLandmarks: number[];
  calculatePrimaryAngle: (landmarks: Landmark[]) => number;
  calculateSecondaryAngle?: (landmarks: Landmark[]) => number;
  evaluateForm: (landmarks: Landmark[], primaryAngle: number) => {
    score: number;
    feedback: string;
    issues: string[];
  };
}

export interface RepCounterResult {
  state: RepState;
  repCount: number;
  formScore: number;
  feedback: string;
  currentAngle: number;
  confidence: number;
  repProgress: number; // 0% to 100%
  isNewRep: boolean;
  issues: string[];
}
