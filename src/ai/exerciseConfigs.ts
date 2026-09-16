import { ExerciseConfig, Landmark } from '../types/exercises';
import { calculateAngle, calculateVerticalAngle } from './mathAngles';

// MediaPipe landmark indices
export const LANDMARK_INDEX = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

function getVisibleSide(landmarks: Landmark[]): 'left' | 'right' {
  const leftVis = (landmarks[LANDMARK_INDEX.LEFT_KNEE]?.visibility ?? 0.8) +
                  (landmarks[LANDMARK_INDEX.LEFT_HIP]?.visibility ?? 0.8);
  const rightVis = (landmarks[LANDMARK_INDEX.RIGHT_KNEE]?.visibility ?? 0.8) +
                   (landmarks[LANDMARK_INDEX.RIGHT_HIP]?.visibility ?? 0.8);
  return leftVis >= rightVis ? 'left' : 'right';
}

export const EXERCISE_CONFIGS: Record<string, ExerciseConfig> = {
  squat: {
    id: 'squat',
    name: 'Squat',
    category: 'Lower Body & Core',
    description: 'Compound exercise targeting quadriceps, glutes, and core stability.',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Hinge at hips and bend knees until thighs are roughly parallel to the ground (angle < 95°).',
      'Keep chest elevated, spine neutral, and knees tracking over toes.',
      'Push through mid-foot to stand back up to starting position (angle > 155°).'
    ],
    primaryJoint: 'Knee Angle',
    secondaryJoint: 'Torso Lean',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
    thresholds: {
      upThreshold: 155,
      downThreshold: 95,
      hysteresis: 15,
      minTransitionDurationMs: 400,
      debounceMs: 500,
      minConfidence: 0.5,
    },
    requiredLandmarks: [
      LANDMARK_INDEX.LEFT_HIP,
      LANDMARK_INDEX.LEFT_KNEE,
      LANDMARK_INDEX.LEFT_ANKLE,
      LANDMARK_INDEX.RIGHT_HIP,
      LANDMARK_INDEX.RIGHT_KNEE,
      LANDMARK_INDEX.RIGHT_ANKLE,
    ],
    calculatePrimaryAngle: (landmarks: Landmark[]): number => {
      const side = getVisibleSide(landmarks);
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];
      const knee = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_KNEE] : landmarks[LANDMARK_INDEX.RIGHT_KNEE];
      const ankle = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_ANKLE] : landmarks[LANDMARK_INDEX.RIGHT_ANKLE];
      return calculateAngle(hip, knee, ankle);
    },
    calculateSecondaryAngle: (landmarks: Landmark[]): number => {
      const side = getVisibleSide(landmarks);
      const shoulder = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_SHOULDER] : landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];
      return calculateVerticalAngle(shoulder, hip);
    },
    evaluateForm: (landmarks: Landmark[], kneeAngle: number) => {
      let score = 95;
      const issues: string[] = [];
      let feedback = 'Good squat depth';

      const side = getVisibleSide(landmarks);
      const shoulder = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_SHOULDER] : landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];

      // Torso angle check (excessive forward lean)
      const torsoAngle = calculateVerticalAngle(shoulder, hip);
      if (torsoAngle > 45) {
        score -= 15;
        issues.push('Excessive torso lean');
        feedback = 'Keep your chest controlled and upright';
      }

      if (kneeAngle > 95 && kneeAngle < 120) {
        score -= 10;
        issues.push('Shallow depth');
        feedback = 'Go slightly deeper to reach parallel';
      }

      return { score: Math.max(50, score), feedback, issues };
    }
  },

  pushup: {
    id: 'pushup',
    name: 'Push-up',
    category: 'Upper Body & Core',
    description: 'Fundamental horizontal press strengthening chest, anterior deltoids, and triceps.',
    instructions: [
      'Begin in a high plank position with hands slightly wider than shoulder-width.',
      'Maintain a rigid straight line from head through hips to heels.',
      'Lower chest by bending elbows to 90° or lower.',
      'Push back up smoothly to full arm lockout without sagging hips.'
    ],
    primaryJoint: 'Elbow Angle',
    secondaryJoint: 'Body Alignment',
    targetMuscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoid', 'Rectus Abdominis'],
    thresholds: {
      upThreshold: 155,
      downThreshold: 90,
      hysteresis: 15,
      minTransitionDurationMs: 350,
      debounceMs: 450,
      minConfidence: 0.5,
    },
    requiredLandmarks: [
      LANDMARK_INDEX.LEFT_SHOULDER,
      LANDMARK_INDEX.LEFT_ELBOW,
      LANDMARK_INDEX.LEFT_WRIST,
      LANDMARK_INDEX.LEFT_HIP,
      LANDMARK_INDEX.LEFT_ANKLE,
    ],
    calculatePrimaryAngle: (landmarks: Landmark[]): number => {
      const side = getVisibleSide(landmarks);
      const shoulder = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_SHOULDER] : landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
      const elbow = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_ELBOW] : landmarks[LANDMARK_INDEX.RIGHT_ELBOW];
      const wrist = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_WRIST] : landmarks[LANDMARK_INDEX.RIGHT_WRIST];
      return calculateAngle(shoulder, elbow, wrist);
    },
    calculateSecondaryAngle: (landmarks: Landmark[]): number => {
      const side = getVisibleSide(landmarks);
      const shoulder = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_SHOULDER] : landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];
      const ankle = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_ANKLE] : landmarks[LANDMARK_INDEX.RIGHT_ANKLE];
      return calculateAngle(shoulder, hip, ankle);
    },
    evaluateForm: (landmarks: Landmark[], elbowAngle: number) => {
      let score = 92;
      const issues: string[] = [];
      let feedback = 'Good repetition';

      const side = getVisibleSide(landmarks);
      const shoulder = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_SHOULDER] : landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];
      const ankle = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_ANKLE] : landmarks[LANDMARK_INDEX.RIGHT_ANKLE];

      // Hip sag or pike detection
      const spineLine = calculateAngle(shoulder, hip, ankle);
      if (spineLine < 150) {
        score -= 20;
        issues.push('Hip sag / pike');
        feedback = 'Keep your body straight · engage your core';
      }

      if (elbowAngle > 90 && elbowAngle < 115) {
        score -= 10;
        issues.push('Incomplete arm flexion');
        feedback = 'Lower with control to full depth';
      }

      return { score: Math.max(50, score), feedback, issues };
    }
  },

  situp: {
    id: 'situp',
    name: 'Sit-up',
    category: 'Core & Abdominals',
    description: 'Abdominal flexion exercise developing trunk strength and hip flexor stability.',
    instructions: [
      'Lie face up with knees bent at 90° and feet flat on the floor.',
      'Place hands gently beside ears or across chest without pulling on the neck.',
      'Flex abdominals to raise torso until elbows touch or pass knees (hip angle < 75°).',
      'Lower torso smoothly back to the floor under control.'
    ],
    primaryJoint: 'Hip Flexion Angle',
    secondaryJoint: 'Neck Neutrality',
    targetMuscles: ['Rectus Abdominis', 'Iliopsoas', 'Obliques'],
    thresholds: {
      upThreshold: 135, // lying down (larger angle between torso and legs)
      downThreshold: 75,  // sitting up (smaller angle)
      hysteresis: 12,
      minTransitionDurationMs: 450,
      debounceMs: 500,
      minConfidence: 0.5,
    },
    requiredLandmarks: [
      LANDMARK_INDEX.LEFT_SHOULDER,
      LANDMARK_INDEX.LEFT_HIP,
      LANDMARK_INDEX.LEFT_KNEE,
    ],
    calculatePrimaryAngle: (landmarks: Landmark[]): number => {
      const side = getVisibleSide(landmarks);
      const shoulder = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_SHOULDER] : landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];
      const knee = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_KNEE] : landmarks[LANDMARK_INDEX.RIGHT_KNEE];
      return calculateAngle(shoulder, hip, knee);
    },
    evaluateForm: (landmarks: Landmark[], hipAngle: number) => {
      let score = 90;
      const issues: string[] = [];
      let feedback = 'Strong core contraction';

      if (hipAngle > 75 && hipAngle < 90) {
        score -= 15;
        issues.push('Partial range of motion');
        feedback = 'Bring torso fully up towards knees';
      }

      return { score: Math.max(50, score), feedback, issues };
    }
  },

  lunge: {
    id: 'lunge',
    name: 'Lunge',
    category: 'Unilateral Lower Body',
    description: 'Unilateral movement targeting single-leg strength, balance, and hip mobility.',
    instructions: [
      'Take a large step forward into a split stance.',
      'Lower back knee straight toward the ground until front thigh is parallel (front knee ~90°).',
      'Ensure front knee remains stacked over ankle without caving inward.',
      'Drive through front heel to step back to starting position.'
    ],
    primaryJoint: 'Front Knee Angle',
    secondaryJoint: 'Trunk Alignment',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    thresholds: {
      upThreshold: 155,
      downThreshold: 95,
      hysteresis: 15,
      minTransitionDurationMs: 400,
      debounceMs: 500,
      minConfidence: 0.5,
    },
    requiredLandmarks: [
      LANDMARK_INDEX.LEFT_HIP,
      LANDMARK_INDEX.LEFT_KNEE,
      LANDMARK_INDEX.LEFT_ANKLE,
      LANDMARK_INDEX.RIGHT_HIP,
      LANDMARK_INDEX.RIGHT_KNEE,
      LANDMARK_INDEX.RIGHT_ANKLE,
    ],
    calculatePrimaryAngle: (landmarks: Landmark[]): number => {
      const side = getVisibleSide(landmarks);
      const hip = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_HIP] : landmarks[LANDMARK_INDEX.RIGHT_HIP];
      const knee = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_KNEE] : landmarks[LANDMARK_INDEX.RIGHT_KNEE];
      const ankle = side === 'left' ? landmarks[LANDMARK_INDEX.LEFT_ANKLE] : landmarks[LANDMARK_INDEX.RIGHT_ANKLE];
      return calculateAngle(hip, knee, ankle);
    },
    evaluateForm: (landmarks: Landmark[], kneeAngle: number) => {
      let score = 92;
      const issues: string[] = [];
      let feedback = 'Balanced lunge';

      if (kneeAngle > 95 && kneeAngle < 120) {
        score -= 12;
        issues.push('Insufficient lunge depth');
        feedback = 'Lower back knee closer to floor';
      }

      return { score: Math.max(50, score), feedback, issues };
    }
  }
};
