import { Landmark } from '../types/exercises';

export const POSE_CONNECTIONS: [number, number][] = [
  // Torso
  [11, 12], // Left shoulder to right shoulder
  [11, 23], // Left shoulder to left hip
  [12, 24], // Right shoulder to right hip
  [23, 24], // Left hip to right hip
  // Left arm
  [11, 13], // Left shoulder to left elbow
  [13, 15], // Left elbow to left wrist
  // Right arm
  [12, 14], // Right shoulder to right elbow
  [14, 16], // Right elbow to right wrist
  // Left leg
  [23, 25], // Left hip to left knee
  [25, 27], // Left knee to left ankle
  // Right leg
  [24, 26], // Right hip to right knee
  [26, 28], // Right knee to right ankle
  // Head / face points
  [0, 11],
  [0, 12],
];

export interface RenderOptions {
  highlightJointIndex?: number;
  highlightColor?: string;
  displayAngle?: { jointIndex: number; angle: number; label?: string };
  statusColor?: string;
}

export function renderSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  canvasWidth: number,
  canvasHeight: number,
  options?: RenderOptions
) {
  if (!landmarks || landmarks.length === 0) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw connections (limbs)
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const [startIndex, endIndex] of POSE_CONNECTIONS) {
    const p1 = landmarks[startIndex];
    const p2 = landmarks[endIndex];

    if (!p1 || !p2) continue;
    const vis1 = p1.visibility ?? 1.0;
    const vis2 = p2.visibility ?? 1.0;
    if (vis1 < 0.4 || vis2 < 0.4) continue;

    const x1 = p1.x * canvasWidth;
    const y1 = p1.y * canvasHeight;
    const x2 = p2.x * canvasWidth;
    const y2 = p2.y * canvasHeight;

    // Glowing electric gradient line
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, '#00f0ff');
    grad.addColorStop(1, '#3b82f6');

    ctx.strokeStyle = grad;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Draw joint keypoints
  ctx.shadowBlur = 14;
  for (let i = 0; i < landmarks.length; i++) {
    const p = landmarks[i];
    if (!p) continue;
    if ((p.visibility ?? 1.0) < 0.4) continue;

    // Only render major body joints (exclude detailed face mesh points > 10 except nose 0)
    if (i > 0 && i < 11) continue;
    if (i > 28) continue;

    const x = p.x * canvasWidth;
    const y = p.y * canvasHeight;

    const isHighlighted = options?.highlightJointIndex === i;
    const radius = isHighlighted ? 8 : 5;

    ctx.fillStyle = isHighlighted ? (options?.highlightColor || '#22c55e') : '#ffffff';
    ctx.shadowColor = isHighlighted ? (options?.highlightColor || '#22c55e') : '#00f0ff';

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Outer ring
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();
  }

  // Reset shadow for text rendering
  ctx.shadowBlur = 0;

  // Display angle callout badge if requested
  if (options?.displayAngle) {
    const { jointIndex, angle, label } = options.displayAngle;
    const p = landmarks[jointIndex];
    if (p && (p.visibility ?? 1.0) >= 0.4) {
      const x = p.x * canvasWidth + 18;
      const y = p.y * canvasHeight - 12;

      // Badge background
      const text = `${label ? label + ': ' : ''}${Math.round(angle)}°`;
      ctx.font = 'bold 13px Inter, sans-serif';
      const textMetrics = ctx.measureText(text);
      const bgWidth = textMetrics.width + 16;
      const bgHeight = 24;

      ctx.fillStyle = 'rgba(8, 14, 26, 0.85)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y - 16, bgWidth, bgHeight, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.fillText(text, x + 8, y + 1);
    }
  }
}
