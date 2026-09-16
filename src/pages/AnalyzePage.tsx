import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIStatusBadge } from '../components/ui/Badge';
import { AIStatus, ExerciseConfig, Landmark, RepCounterResult, RepState } from '../types/exercises';
import { ExerciseType, RepEvent, WorkoutSession } from '../types/database';
import { EXERCISE_CONFIGS } from '../ai/exerciseConfigs';
import { RepStateMachine } from '../ai/repStateMachine';
import { MoveGuardPoseDetector } from '../ai/poseDetector';
import { renderSkeleton } from '../ai/skeletonRenderer';
import { PoseSimulator } from '../ai/simulator';
import { speechService } from '../services/speechService';
import { dbService } from '../services/db';
import confetti from 'canvas-confetti';
import {
  Camera,
  CameraOff,
  CheckCircle,
  Clock,
  Dumbbell,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const initialExercise = (searchParams.get('exercise') as ExerciseType) || 'squat';
  const forceDemo = searchParams.get('demo') === 'true';

  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>(
    EXERCISE_CONFIGS[initialExercise] ? initialExercise : 'squat'
  );
  const [isCameraLive, setIsCameraLive] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(forceDemo);
  const [aiStatus, setAiStatus] = useState<AIStatus>('Loading AI');
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);

  // High-frequency UI metrics (throttled to avoid frame-rate state thrashing)
  const [liveReps, setLiveReps] = useState<number>(0);
  const [liveScore, setLiveScore] = useState<number>(90);
  const [liveAngle, setLiveAngle] = useState<number>(165);
  const [liveFeedback, setLiveFeedback] = useState<string>('Stand in frame to begin');
  const [movementState, setMovementState] = useState<RepState>('UP');
  const [repProgress, setRepProgress] = useState<number>(0);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [completedRepsHistory, setCompletedRepsHistory] = useState<RepEvent[]>([]);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Logic Refs (avoid stale closures in requestAnimationFrame)
  const poseDetectorRef = useRef<MoveGuardPoseDetector | null>(null);
  const repMachineRef = useRef<RepStateMachine>(
    new RepStateMachine(EXERCISE_CONFIGS[initialExercise].thresholds)
  );
  const simulatorRef = useRef<PoseSimulator>(new PoseSimulator());
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const lastUiUpdateRef = useRef<number>(0);

  const activeConfig: ExerciseConfig = EXERCISE_CONFIGS[selectedExercise];

  // Initialize MediaPipe detector and speech settings
  useEffect(() => {
    const detector = new MoveGuardPoseDetector((status) => setAiStatus(status));
    poseDetectorRef.current = detector;
    detector.initialize();

    simulatorRef.current.setExercise(selectedExercise);

    return () => {
      stopCamera();
      detector.dispose();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Timer for session duration
  useEffect(() => {
    if (!isCameraLive && !isDemoMode) return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCameraLive, isDemoMode]);

  // Handle exercise mode switch
  const handleSelectExercise = (type: ExerciseType) => {
    setSelectedExercise(type);
    const config = EXERCISE_CONFIGS[type];
    repMachineRef.current.setThresholds(config.thresholds);
    repMachineRef.current.reset();
    simulatorRef.current.setExercise(type);

    setLiveReps(0);
    setLiveScore(90);
    setLiveFeedback(`Ready for ${config.name}`);
    setMovementState('UP');
    setRepProgress(0);
    setCompletedRepsHistory([]);

    speechService.speak(`${config.name} selected`, true);
    toast(`${config.name} selected`, 'info');
  };

  // Start Real Camera
  const startCamera = async () => {
    setIsDemoMode(false);
    try {
      setAiStatus('Loading AI');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraLive(true);
      setAiStatus('AI Ready');
      toast('Camera connected. On-device analysis running.', 'success');
      startInferenceLoop();
    } catch (err: any) {
      console.warn('Camera error, offering Demo Mode:', err);
      setAiStatus('Camera Error');
      toast('Camera permission denied or unavailable. Starting Demo Mode.', 'error');
      startDemoMode();
    }
  };

  // Stop Real Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraLive(false);
    setAiStatus('AI Ready');
  };

  // Start Demo Mode
  const startDemoMode = () => {
    stopCamera();
    setIsDemoMode(true);
    setAiStatus('Demo Active');
    simulatorRef.current.setExercise(selectedExercise);
    toast('Running DEMO MODE with simulated biomechanics.', 'info');
    startInferenceLoop();
  };

  // Toggle voice
  const toggleVoice = () => {
    const next = !voiceMuted;
    setVoiceMuted(next);
    speechService.setEnabled(!next);
    toast(next ? 'Voice cues muted' : 'Voice cues unmuted', 'info');
  };

  // Complete and save workout
  const handleFinishWorkout = async () => {
    if (liveReps === 0 && sessionSeconds < 5) {
      toast('No workout reps recorded yet.', 'info');
      return;
    }

    const sessionId = `ws-${Date.now()}`;
    const now = new Date().toISOString();

    const session: WorkoutSession = {
      id: sessionId,
      user_id: user?.id || 'usr-demo-001',
      exercise_type: selectedExercise,
      repetitions: liveReps,
      form_score: liveScore,
      duration_seconds: sessionSeconds,
      feedback_summary: [
        `Completed ${liveReps} repetitions with ${liveScore}% average form score.`,
        `Movement tempo: ${(sessionSeconds / (liveReps || 1)).toFixed(1)}s per rep.`,
      ],
      is_demo: isDemoMode,
      started_at: new Date(sessionStartTimeRef.current).toISOString(),
      completed_at: now,
      created_at: now,
    };

    try {
      await dbService.saveWorkoutSession(session, completedRepsHistory);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast(`Workout saved! ${liveReps} reps recorded.`, 'success');
      navigate('/history');
    } catch (e) {
      toast('Saved session locally.', 'success');
      navigate('/history');
    }
  };

  // Main high-performance Animation Frame Loop
  const startInferenceLoop = useCallback(() => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    const loop = (timestamp: number) => {
      let landmarks: Landmark[] | null = null;
      let primaryAngle = 180;
      let confidence = 1.0;

      if (isDemoMode) {
        // Generate simulated pose frame
        const simResult = simulatorRef.current.getNextLandmarks();
        landmarks = simResult.landmarks;
        primaryAngle = simResult.primaryAngle;
        confidence = 0.98;
      } else if (videoRef.current && poseDetectorRef.current && isCameraLive) {
        // Run MediaPipe inference
        const detection = poseDetectorRef.current.detectForVideo(videoRef.current, timestamp);
        landmarks = detection.landmarks;

        if (landmarks) {
          primaryAngle = activeConfig.calculatePrimaryAngle(landmarks);
          confidence = 0.95;
        }
      }

      // Render Skeleton on Canvas
      if (canvasRef.current && landmarks) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Sync internal canvas resolution
          if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
          }

          renderSkeleton(ctx, landmarks, canvas.width, canvas.height, {
            displayAngle: {
              jointIndex: activeConfig.requiredLandmarks[1] || 25,
              angle: primaryAngle,
              label: activeConfig.name,
            },
          });
        }
      }

      // Feed into Repetition State Machine
      if (landmarks) {
        const formEval = activeConfig.evaluateForm(landmarks, primaryAngle);
        const result: RepCounterResult = repMachineRef.current.update(
          primaryAngle,
          confidence,
          Date.now(),
          formEval
        );

        // Handle rep completion event
        if (result.isNewRep) {
          setLiveReps(result.repCount);
          speechService.speak(`${result.repCount}`, true);

          // Save rep event
          const newRepEvent: RepEvent = {
            id: `rep-${Date.now()}-${result.repCount}`,
            session_id: `ws-${sessionStartTimeRef.current}`,
            user_id: user?.id || 'usr-demo-001',
            exercise_type: selectedExercise,
            rep_number: result.repCount,
            form_score: result.formScore,
            feedback: result.feedback,
            metrics: {
              primaryAngle,
              durationMs: 1500,
            },
            created_at: new Date().toISOString(),
          };
          setCompletedRepsHistory((prev) => [...prev, newRepEvent]);

          // Small celebration particle burst
          confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
        }

        // Throttle UI React state updates to 20 FPS (every 50ms) to preserve 60FPS canvas inference
        if (timestamp - lastUiUpdateRef.current > 50) {
          setLiveAngle(Math.round(result.currentAngle));
          setLiveScore(result.formScore);
          setLiveFeedback(result.feedback);
          setMovementState(result.state);
          setRepProgress(result.repProgress);
          lastUiUpdateRef.current = timestamp;
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
  }, [isDemoMode, isCameraLive, selectedExercise, activeConfig, user]);

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-cyan-400 tracking-wider uppercase">
            AI Movement Coach
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Live Form & Repetition Analysis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <AIStatusBadge status={aiStatus} isDemo={isDemoMode} />

          <button
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl border transition ${
              voiceMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-navy-900 border-slate-700 text-cyan-400'
            }`}
            title={voiceMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
          >
            {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {(isCameraLive || isDemoMode) && (
            <Button variant="primary" size="sm" onClick={handleFinishWorkout} className="gap-1.5">
              <CheckCircle className="w-4 h-4" /> Finish Workout
            </Button>
          )}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Feed & Canvas Overlay */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden bg-navy-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                isCameraLive ? 'block' : 'hidden'
              }`}
            />

            {/* Skeleton Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
                isCameraLive ? 'transform -scale-x-100' : ''
              }`}
            />

            {/* Demo Mode Background Glow Grid when camera is off */}
            {!isCameraLive && (
              <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-950 to-navy-950 flex flex-col items-center justify-center p-6 text-center">
                {!isDemoMode && (
                  <div className="max-w-md space-y-4 z-20">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-2xl shadow-glow-cyan">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Camera Analysis Ready</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Enable your camera for live on-device joint tracking, or launch Demo Mode to evaluate the repetition state machine with simulated pose data.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <Button onClick={startCamera} className="gap-2 text-xs">
                        <Camera className="w-4 h-4" /> Start Camera
                      </Button>
                      <Button variant="secondary" onClick={startDemoMode} className="gap-2 text-xs">
                        <Play className="w-4 h-4 text-cyan-400" /> Run Demo Mode
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Floating Banner for Demo Mode Alert */}
            {isDemoMode && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold backdrop-blur-md">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>DEMO MODE — SIMULATED: Biomechanical data is synthetic</span>
              </div>
            )}

            {/* Bottom Camera Floating Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                {isCameraLive ? (
                  <Button variant="danger" size="sm" onClick={stopCamera} className="gap-1.5 text-xs">
                    <CameraOff className="w-3.5 h-3.5" /> Stop Camera
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={startCamera} className="gap-1.5 text-xs bg-navy-900/90">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" /> Use Camera
                  </Button>
                )}

                <Button
                  variant={isDemoMode ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={isDemoMode ? () => setIsDemoMode(false) : startDemoMode}
                  className="gap-1.5 text-xs bg-navy-900/90"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  {isDemoMode ? 'Stop Demo' : 'Demo Mode'}
                </Button>
              </div>

              <div className="flex items-center gap-2 bg-navy-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{Math.floor(sessionSeconds / 60)}:{(sessionSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Real-time Progress Gauge */}
          <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Repetition Range of Motion
              </span>
              <span className="font-mono text-cyan-300">{repProgress}%</span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150 rounded-full"
                style={{ width: `${repProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Exercise Controls & Live Biomechanical Metrics */}
        <div className="lg:col-span-4 space-y-4">
          {/* Exercise Switcher Tabs */}
          <div className="bg-navy-900/80 border border-slate-800 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5">
            {[
              { id: 'squat', label: 'Squat', icon: '🏋️' },
              { id: 'pushup', label: 'Push-up', icon: '💪' },
              { id: 'situp', label: 'Sit-up', icon: '🧘' },
              { id: 'lunge', label: 'Lunge', icon: '🦵' },
            ].map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelectExercise(ex.id as ExerciseType)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedExercise === ex.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{ex.icon}</span>
                <span>{ex.label}</span>
              </button>
            ))}
          </div>

          {/* Big Live Form Score Card */}
          <Card className="text-center p-6 border-cyan-500/30">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
              Live Form Quality Score
            </span>
            <div className="text-6xl font-extrabold font-display text-white tracking-tight my-2">
              {liveScore}
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                liveScore >= 90
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : liveScore >= 75
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {liveScore >= 90 ? 'Excellent' : liveScore >= 75 ? 'Good' : 'Needs Improvement'}
            </span>
          </Card>

          {/* Actionable Feedback Box */}
          <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                Form Guidance
              </h4>
              <p className="text-sm font-semibold text-emerald-300">{liveFeedback}</p>
            </div>
          </div>

          {/* 3-Box Metrics Readout */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-navy-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">
                Joint Angle
              </span>
              <strong className="text-lg font-mono font-bold text-cyan-300 block mt-1">
                {liveAngle}°
              </strong>
            </div>

            <div className="bg-navy-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">
                State
              </span>
              <strong className="text-xs font-bold text-slate-200 block mt-2">
                {movementState}
              </strong>
            </div>

            <div className="bg-navy-900/80 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">
                Target Depth
              </span>
              <strong className="text-lg font-mono font-bold text-slate-300 block mt-1">
                &lt;{activeConfig.thresholds.downThreshold}°
              </strong>
            </div>
          </div>

          {/* Rep Box Grid */}
          <div className="grid grid-cols-3 gap-1 bg-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden text-center p-1">
            <div className="bg-navy-950 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">REPETITIONS</span>
              <strong className="text-3xl font-black text-cyan-400 block mt-1">{liveReps}</strong>
            </div>
            <div className="bg-navy-950 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">TARGET</span>
              <strong className="text-3xl font-black text-slate-300 block mt-1">15</strong>
            </div>
            <div className="bg-navy-950 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">ISSUES</span>
              <strong className="text-3xl font-black text-amber-400 block mt-1">
                {completedRepsHistory.filter((r) => r.form_score < 75).length}
              </strong>
            </div>
          </div>

          {/* Quick Instructions Accordion */}
          <Card className="p-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
              {activeConfig.name} Key Points
            </h4>
            <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
              {activeConfig.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
