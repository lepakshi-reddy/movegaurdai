import { ExerciseType } from '../types/database';
import { Landmark } from '../types/exercises';
import { LANDMARK_INDEX } from './exerciseConfigs';

export class PoseSimulator {
  private frameCount: number = 0;
  private currentExercise: ExerciseType | 'posture' = 'squat';

  public setExercise(exercise: ExerciseType | 'posture') {
    this.currentExercise = exercise;
    this.frameCount = 0;
  }

  public getNextLandmarks(): { landmarks: Landmark[]; primaryAngle: number } {
    this.frameCount++;
    const t = this.frameCount * 0.05; // speed factor

    // Default base coordinates (standing upright facing forward)
    const landmarks: Landmark[] = Array.from({ length: 33 }, () => ({
      x: 0.5,
      y: 0.5,
      z: 0,
      visibility: 0.95,
    }));

    let primaryAngle = 165;

    // Head / Nose
    landmarks[LANDMARK_INDEX.NOSE] = { x: 0.5, y: 0.2, z: 0, visibility: 0.95 };

    // Shoulders
    landmarks[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.44, y: 0.28, z: 0, visibility: 0.95 };
    landmarks[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.56, y: 0.28, z: 0, visibility: 0.95 };

    // Hips
    landmarks[LANDMARK_INDEX.LEFT_HIP] = { x: 0.45, y: 0.52, z: 0, visibility: 0.95 };
    landmarks[LANDMARK_INDEX.RIGHT_HIP] = { x: 0.55, y: 0.52, z: 0, visibility: 0.95 };

    // Ankles
    landmarks[LANDMARK_INDEX.LEFT_ANKLE] = { x: 0.43, y: 0.9, z: 0, visibility: 0.95 };
    landmarks[LANDMARK_INDEX.RIGHT_ANKLE] = { x: 0.57, y: 0.9, z: 0, visibility: 0.95 };

    if (this.currentExercise === 'squat') {
      // Squat cycle: angle oscillates between ~85° (deep down) and 165° (up)
      // Sinusoidal oscillation: period roughly 3-4 seconds
      const cycle = Math.sin(t);
      // Normalized depth from 0 (standing) to 1 (full squat)
      const depth = (Math.sin(t) + 1) / 2;

      primaryAngle = Math.round(165 - depth * 80); // 165 down to 85

      const hipY = 0.52 + depth * 0.16;
      const kneeY = 0.72 + depth * 0.06;
      const kneeXOffset = depth * 0.04;

      landmarks[LANDMARK_INDEX.LEFT_HIP].y = hipY;
      landmarks[LANDMARK_INDEX.RIGHT_HIP].y = hipY;

      landmarks[LANDMARK_INDEX.LEFT_KNEE] = { x: 0.45 - kneeXOffset, y: kneeY, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_KNEE] = { x: 0.55 + kneeXOffset, y: kneeY, z: 0, visibility: 0.95 };

      // Arms reaching forward for balance
      landmarks[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.41, y: 0.38, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.59, y: 0.38, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.40, y: 0.42, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.60, y: 0.42, z: 0, visibility: 0.95 };

    } else if (this.currentExercise === 'pushup') {
      // Horizontal orientation for push-up
      const depth = (Math.sin(t) + 1) / 2;
      primaryAngle = Math.round(160 - depth * 75); // 160° down to 85°

      const bodyY = 0.55 + depth * 0.12;

      landmarks[LANDMARK_INDEX.NOSE] = { x: 0.28, y: bodyY - 0.05, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.34, y: bodyY, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.36, y: bodyY + 0.02, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_ELBOW] = { x: 0.32, y: bodyY + 0.08, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_ELBOW] = { x: 0.38, y: bodyY + 0.08, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_WRIST] = { x: 0.33, y: 0.72, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_WRIST] = { x: 0.37, y: 0.72, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_HIP] = { x: 0.56, y: bodyY + 0.02, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_HIP] = { x: 0.58, y: bodyY + 0.04, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_KNEE] = { x: 0.70, y: bodyY + 0.05, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_KNEE] = { x: 0.72, y: bodyY + 0.07, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_ANKLE] = { x: 0.84, y: 0.70, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_ANKLE] = { x: 0.86, y: 0.71, z: 0, visibility: 0.95 };

    } else if (this.currentExercise === 'situp') {
      const depth = (Math.sin(t) + 1) / 2;
      primaryAngle = Math.round(140 - depth * 70); // 140° down to 70°

      const torsoLift = depth * 0.18;

      landmarks[LANDMARK_INDEX.LEFT_HIP] = { x: 0.52, y: 0.65, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_HIP] = { x: 0.55, y: 0.65, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_SHOULDER] = { x: 0.36 + torsoLift * 0.5, y: 0.66 - torsoLift, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_SHOULDER] = { x: 0.38 + torsoLift * 0.5, y: 0.66 - torsoLift, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_KNEE] = { x: 0.65, y: 0.50, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_KNEE] = { x: 0.67, y: 0.50, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_ANKLE] = { x: 0.75, y: 0.68, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_ANKLE] = { x: 0.77, y: 0.68, z: 0, visibility: 0.95 };

    } else if (this.currentExercise === 'lunge') {
      const depth = (Math.sin(t) + 1) / 2;
      primaryAngle = Math.round(165 - depth * 75); // 165° down to 90°

      const lungeDrop = depth * 0.12;

      landmarks[LANDMARK_INDEX.LEFT_HIP].y = 0.52 + lungeDrop;
      landmarks[LANDMARK_INDEX.RIGHT_HIP].y = 0.52 + lungeDrop;

      landmarks[LANDMARK_INDEX.LEFT_KNEE] = { x: 0.42, y: 0.70 + lungeDrop * 0.5, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_KNEE] = { x: 0.62, y: 0.72 + lungeDrop, z: 0, visibility: 0.95 };

      landmarks[LANDMARK_INDEX.LEFT_ANKLE] = { x: 0.42, y: 0.90, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_ANKLE] = { x: 0.66, y: 0.88, z: 0, visibility: 0.95 };

    } else {
      // Posture check: subtle breathing and gentle micro-movements
      const drift = Math.sin(t * 0.5) * 0.01;
      primaryAngle = 88;

      landmarks[LANDMARK_INDEX.NOSE].x += drift;
      landmarks[LANDMARK_INDEX.LEFT_SHOULDER].y += drift * 0.5;
      landmarks[LANDMARK_INDEX.LEFT_KNEE] = { x: 0.45, y: 0.72, z: 0, visibility: 0.95 };
      landmarks[LANDMARK_INDEX.RIGHT_KNEE] = { x: 0.55, y: 0.72, z: 0, visibility: 0.95 };
    }

    return { landmarks, primaryAngle };
  }
}
