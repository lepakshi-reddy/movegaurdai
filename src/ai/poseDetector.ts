import { FilesetResolver, PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { AIStatus, Landmark } from '../types/exercises';

export class MoveGuardPoseDetector {
  private poseLandmarker: PoseLandmarker | null = null;
  private status: AIStatus = 'Loading AI';
  private onStatusChange?: (status: AIStatus) => void;
  private isInitializing: boolean = false;

  constructor(onStatusChange?: (status: AIStatus) => void) {
    this.onStatusChange = onStatusChange;
  }

  public async initialize(): Promise<boolean> {
    if (this.poseLandmarker) {
      this.setStatus('AI Ready');
      return true;
    }

    if (this.isInitializing) return false;
    this.isInitializing = true;
    this.setStatus('Loading AI');

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.setStatus('AI Ready');
      this.isInitializing = false;
      return true;
    } catch (error) {
      console.warn('GPU delegate or direct MediaPipe load failed, trying CPU fallback:', error);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        this.setStatus('AI Ready');
        this.isInitializing = false;
        return true;
      } catch (fallbackError) {
        console.error('Failed to initialize MediaPipe Pose Landmarker:', fallbackError);
        this.setStatus('Camera Error');
        this.isInitializing = false;
        return false;
      }
    }
  }

  public detectForVideo(
    videoElement: HTMLVideoElement,
    timestamp: number
  ): { landmarks: Landmark[] | null; status: AIStatus } {
    if (!this.poseLandmarker) {
      return { landmarks: null, status: this.status };
    }

    if (videoElement.readyState < 2) {
      return { landmarks: null, status: 'Loading AI' };
    }

    try {
      const result: PoseLandmarkerResult = this.poseLandmarker.detectForVideo(
        videoElement,
        timestamp
      );

      if (result.landmarks && result.landmarks.length > 0) {
        const detected = result.landmarks[0] as Landmark[];
        // Check confidence
        const avgVis =
          detected.reduce((acc, l) => acc + (l.visibility ?? 0.8), 0) /
          detected.length;

        if (avgVis < 0.4) {
          this.setStatus('Low Confidence');
          return { landmarks: detected, status: 'Low Confidence' };
        }

        this.setStatus('AI Live');
        return { landmarks: detected, status: 'AI Live' };
      } else {
        this.setStatus('No Person Detected');
        return { landmarks: null, status: 'No Person Detected' };
      }
    } catch (e) {
      console.error('Inference frame error:', e);
      return { landmarks: null, status: 'Low Confidence' };
    }
  }

  private setStatus(status: AIStatus) {
    if (this.status !== status) {
      this.status = status;
      this.onStatusChange?.(status);
    }
  }

  public getStatus(): AIStatus {
    return this.status;
  }

  public dispose() {
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
  }
}
