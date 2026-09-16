import { Landmark } from '../types/exercises';
import { calculateAngle, calculateVerticalAngle } from './mathAngles';
import { LANDMARK_INDEX } from './exerciseConfigs';

export interface PostureEvaluation {
  overallScore: number; // 0 - 100
  neckScore: number;
  shoulderScore: number;
  backScore: number;
  forwardHeadAngle: number; // degrees deviation
  shoulderTiltAngle: number; // degrees deviation
  trunkLeanAngle: number; // degrees deviation
  issues: string[];
  feedback: string[];
  status: 'optimal' | 'good' | 'moderate' | 'needs_attention';
}

export function evaluatePosture(landmarks: Landmark[]): PostureEvaluation {
  if (!landmarks || landmarks.length < 25) {
    return {
      overallScore: 80,
      neckScore: 80,
      shoulderScore: 80,
      backScore: 80,
      forwardHeadAngle: 0,
      shoulderTiltAngle: 0,
      trunkLeanAngle: 0,
      issues: [],
      feedback: ['Position yourself facing the camera with shoulders visible.'],
      status: 'good',
    };
  }

  const nose = landmarks[LANDMARK_INDEX.NOSE];
  const leftShoulder = landmarks[LANDMARK_INDEX.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARK_INDEX.RIGHT_SHOULDER];
  const leftHip = landmarks[LANDMARK_INDEX.LEFT_HIP];
  const rightHip = landmarks[LANDMARK_INDEX.RIGHT_HIP];

  const midShoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
    z: ((leftShoulder.z ?? 0) + (rightShoulder.z ?? 0)) / 2,
  };

  const midHip = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
    z: ((leftHip.z ?? 0) + (rightHip.z ?? 0)) / 2,
  };

  // 1. Forward Head Tendency: Angle of nose relative to mid-shoulder vertical
  const forwardHeadAngle = calculateVerticalAngle(midShoulder, nose);
  let neckScore = 100;
  if (forwardHeadAngle > 18) {
    neckScore = Math.max(50, 100 - (forwardHeadAngle - 18) * 3);
  }

  // 2. Shoulder Horizontal Alignment: Delta Y between left and right shoulder
  const shoulderDy = Math.abs(leftShoulder.y - rightShoulder.y);
  const shoulderDx = Math.abs(leftShoulder.x - rightShoulder.x);
  const shoulderTiltAngle = Math.round((Math.atan2(shoulderDy, shoulderDx || 1) * 180 / Math.PI) * 10) / 10;
  let shoulderScore = 100;
  if (shoulderTiltAngle > 4) {
    shoulderScore = Math.max(50, 100 - (shoulderTiltAngle - 4) * 5);
  }

  // 3. Trunk / Spine Lean: Angle of spine (midHip to midShoulder) vs vertical
  const trunkLeanAngle = calculateVerticalAngle(midHip, midShoulder);
  let backScore = 100;
  if (trunkLeanAngle > 8) {
    backScore = Math.max(50, 100 - (trunkLeanAngle - 8) * 3.5);
  }

  const overallScore = Math.round((neckScore * 0.35) + (shoulderScore * 0.35) + (backScore * 0.30));

  const issues: string[] = [];
  const feedback: string[] = [];

  if (neckScore < 80) {
    issues.push('Forward head tilt detected');
    feedback.push('Gently bring your head back over your shoulders.');
  } else {
    feedback.push('Head and neck are well balanced.');
  }

  if (shoulderScore < 80) {
    issues.push('Uneven shoulder elevation');
    feedback.push('Relax your shoulders and keep them level.');
  } else {
    feedback.push('Shoulders are balanced.');
  }

  if (backScore < 80) {
    issues.push('Trunk slouch / lateral lean');
    feedback.push('Lengthen your spine and engage your core gently.');
  } else {
    feedback.push('Spine alignment looks natural and upright.');
  }

  let status: PostureEvaluation['status'] = 'optimal';
  if (overallScore < 70) status = 'needs_attention';
  else if (overallScore < 80) status = 'moderate';
  else if (overallScore < 90) status = 'good';

  return {
    overallScore,
    neckScore: Math.round(neckScore),
    shoulderScore: Math.round(shoulderScore),
    backScore: Math.round(backScore),
    forwardHeadAngle,
    shoulderTiltAngle,
    trunkLeanAngle,
    issues,
    feedback,
    status,
  };
}
