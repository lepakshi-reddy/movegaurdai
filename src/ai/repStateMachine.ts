import { ExerciseThresholds, RepCounterResult, RepState } from '../types/exercises';
import { AngleSmoother } from './mathAngles';

export class RepStateMachine {
  private state: RepState = 'UP';
  private repCount: number = 0;
  private smoother: AngleSmoother;
  private thresholds: ExerciseThresholds;
  private lastStateChangeTime: number = 0;
  private lastRepCompleteTime: number = 0;
  private maxDepthAchieved: number = 180;
  private repFormDeductions: number = 0;
  private currentFeedback: string = 'Ready';
  private currentIssues: string[] = [];

  constructor(thresholds: ExerciseThresholds, smoothingAlpha: number = 0.75) {
    this.thresholds = thresholds;
    this.smoother = new AngleSmoother(smoothingAlpha);
  }

  public reset(): void {
    this.state = 'UP';
    this.repCount = 0;
    this.smoother.reset();
    this.lastStateChangeTime = 0;
    this.lastRepCompleteTime = 0;
    this.maxDepthAchieved = 180;
    this.repFormDeductions = 0;
    this.currentFeedback = 'Ready';
    this.currentIssues = [];
  }

  public update(
    rawAngle: number,
    confidence: number = 1.0,
    timestamp: number = Date.now(),
    formEvaluation?: { score: number; feedback: string; issues: string[] }
  ): RepCounterResult {
    // Landmark confidence check
    if (confidence < this.thresholds.minConfidence) {
      return {
        state: this.state,
        repCount: this.repCount,
        formScore: Math.max(50, 100 - this.repFormDeductions),
        feedback: 'Low tracking confidence - keep joints visible',
        currentAngle: this.smoother.current ?? rawAngle,
        confidence,
        repProgress: this.calculateProgress(this.smoother.current ?? rawAngle),
        isNewRep: false,
        issues: ['Low landmark confidence'],
      };
    }

    const smoothedAngle = this.smoother.smooth(rawAngle);
    const { upThreshold, downThreshold, hysteresis, minTransitionDurationMs, debounceMs } = this.thresholds;
    const timeSinceLastState = timestamp - this.lastStateChangeTime;
    const timeSinceLastRep = timestamp - this.lastRepCompleteTime;

    let isNewRep = false;

    // Track maximum depth achieved
    if (this.state === 'DESCENDING' || this.state === 'DOWN') {
      if (smoothedAngle < this.maxDepthAchieved) {
        this.maxDepthAchieved = smoothedAngle;
      }
    }

    // Accumulate form feedback
    if (formEvaluation && (this.state === 'DESCENDING' || this.state === 'DOWN')) {
      if (formEvaluation.issues.length > 0) {
        this.repFormDeductions = Math.max(this.repFormDeductions, 100 - formEvaluation.score);
        this.currentIssues = Array.from(new Set([...this.currentIssues, ...formEvaluation.issues]));
      }
    }

    switch (this.state) {
      case 'UP': {
        // Enforce debounce lock-out
        if (timeSinceLastRep >= debounceMs) {
          if (smoothedAngle <= downThreshold) {
            // Direct drop into down
            this.state = 'DOWN';
            this.lastStateChangeTime = timestamp;
            this.maxDepthAchieved = smoothedAngle;
            this.repFormDeductions = 0;
            this.currentIssues = [];
            this.currentFeedback = 'Good depth achieved!';
          } else if (smoothedAngle <= upThreshold - hysteresis) {
            this.state = 'DESCENDING';
            this.lastStateChangeTime = timestamp;
            this.maxDepthAchieved = smoothedAngle;
            this.repFormDeductions = 0;
            this.currentIssues = [];
            this.currentFeedback = 'Lower with control';
          } else {
            this.currentFeedback = 'In position · begin movement';
          }
        }
        break;
      }

      case 'DESCENDING': {
        if (smoothedAngle <= downThreshold) {
          this.state = 'DOWN';
          this.lastStateChangeTime = timestamp;
          this.currentFeedback = 'Good depth achieved!';
        } else if (smoothedAngle >= upThreshold - hysteresis && timeSinceLastState >= minTransitionDurationMs) {
          // Incomplete/shallow rep rejection
          this.state = 'UP';
          this.lastStateChangeTime = timestamp;
          this.currentFeedback = 'Go slightly deeper';
          this.currentIssues.push('Incomplete depth');
        } else {
          this.currentFeedback = 'Lower deeper...';
        }
        break;
      }

      case 'DOWN': {
        if (smoothedAngle >= upThreshold && timeSinceLastState >= minTransitionDurationMs) {
          // Completed full rep from DOWN directly to UP
          this.state = 'UP';
          this.lastStateChangeTime = timestamp;
          this.lastRepCompleteTime = timestamp;
          this.repCount += 1;
          isNewRep = true;

          const calculatedScore = Math.max(60, 100 - this.repFormDeductions);
          this.currentFeedback = calculatedScore >= 85 ? 'Excellent repetition!' : 'Good repetition · keep form tight';
        } else if (smoothedAngle >= downThreshold + hysteresis && timeSinceLastState >= minTransitionDurationMs) {
          this.state = 'ASCENDING';
          this.lastStateChangeTime = timestamp;
          this.currentFeedback = 'Drive up with power';
        } else {
          this.currentFeedback = 'Good depth · hold and return';
        }
        break;
      }

      case 'ASCENDING': {
        if (smoothedAngle >= upThreshold) {
          this.state = 'UP';
          this.lastStateChangeTime = timestamp;
          this.lastRepCompleteTime = timestamp;
          this.repCount += 1;
          isNewRep = true;

          const calculatedScore = Math.max(60, 100 - this.repFormDeductions);
          this.currentFeedback = calculatedScore >= 85 ? 'Excellent repetition!' : 'Good repetition · keep form tight';
        } else if (smoothedAngle <= downThreshold && timeSinceLastState >= minTransitionDurationMs) {
          this.state = 'DOWN';
          this.lastStateChangeTime = timestamp;
        } else {
          this.currentFeedback = 'Return all the way to standing';
        }
        break;
      }

      default:
        this.state = 'UP';
        break;
    }

    const finalScore = Math.max(50, 100 - this.repFormDeductions);

    return {
      state: this.state,
      repCount: this.repCount,
      formScore: finalScore,
      feedback: this.currentFeedback,
      currentAngle: smoothedAngle,
      confidence,
      repProgress: this.calculateProgress(smoothedAngle),
      isNewRep,
      issues: [...this.currentIssues],
    };
  }

  private calculateProgress(angle: number): number {
    const { upThreshold, downThreshold } = this.thresholds;
    const totalRange = upThreshold - downThreshold;
    if (totalRange <= 0) return 0;

    const diff = upThreshold - angle;
    const progress = Math.max(0, Math.min(100, Math.round((diff / totalRange) * 100)));
    return progress;
  }

  public getCount(): number {
    return this.repCount;
  }

  public getState(): RepState {
    return this.state;
  }

  public setThresholds(thresholds: ExerciseThresholds) {
    this.thresholds = thresholds;
  }
}
