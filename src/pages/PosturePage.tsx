import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIStatusBadge } from '../components/ui/Badge';
import { evaluatePosture, PostureEvaluation } from '../ai/postureAnalyzer';
import { MoveGuardPoseDetector } from '../ai/poseDetector';
import { renderSkeleton } from '../ai/skeletonRenderer';
import { PoseSimulator } from '../ai/simulator';
import { AIStatus, Landmark } from '../types/exercises';
import { dbService } from '../services/db';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/ui/Toast';
import {
  Activity,
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const PosturePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isCameraLive, setIsCameraLive] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>('Loading AI');
  const [duration, setDuration] = useState(0);

  const [postureResult, setPostureResult] = useState<PostureEvaluation>({
    overallScore: 86,
    neckScore: 84,
    shoulderScore: 90,
    backScore: 85,
    forwardHeadAngle: 8.2,
    shoulderTiltAngle: 1.4,
    trunkLeanAngle: 3.1,
    issues: [],
    feedback: ['Spine alignment is neutral and balanced.'],
    status: 'good',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<MoveGuardPoseDetector | null>(null);
  const simulatorRef = useRef<PoseSimulator>(new PoseSimulator());
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const detector = new MoveGuardPoseDetector((status) => setAiStatus(status));
    detectorRef.current = detector;
    detector.initialize();
    simulatorRef.current.setExercise('posture');

    return () => {
      stopCamera();
      detector.dispose();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    if (!isCameraLive && !isDemoMode) return;
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [isCameraLive, isDemoMode]);

  const startCamera = async () => {
    setIsDemoMode(false);
    try {
      setAiStatus('Loading AI');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraLive(true);
      setAiStatus('AI Ready');
      startLoop();
      toast('Camera connected for ergonomic posture check.', 'success');
    } catch (e) {
      setAiStatus('Camera Error');
      startDemo();
      toast('Camera unavailable, launched Demo Mode.', 'info');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraLive(false);
  };

  const startDemo = () => {
    stopCamera();
    setIsDemoMode(true);
    setAiStatus('Demo Active');
    simulatorRef.current.setExercise('posture');
    startLoop();
    toast('Running Posture Demo with simulated landmarks.', 'info');
  };

  const handleSavePostureCheck = async () => {
    const now = new Date().toISOString();
    await dbService.savePostureSession({
      id: `post-${Date.now()}`,
      user_id: user?.id || 'usr-demo-001',
      overall_score: postureResult.overallScore,
      neck_score: postureResult.neckScore,
      shoulder_score: postureResult.shoulderScore,
      back_score: postureResult.backScore,
      duration_seconds: duration,
      detected_issues: postureResult.issues,
      feedback_summary: postureResult.feedback,
      created_at: now,
    });
    toast('Posture check saved to your wellness profile!', 'success');
  };

  const startLoop = () => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    const loop = (timestamp: number) => {
      let landmarks: Landmark[] | null = null;

      if (isDemoMode) {
        const sim = simulatorRef.current.getNextLandmarks();
        landmarks = sim.landmarks;
      } else if (videoRef.current && detectorRef.current && isCameraLive) {
        const res = detectorRef.current.detectForVideo(videoRef.current, timestamp);
        landmarks = res.landmarks;
      }

      if (canvasRef.current && landmarks) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
          }
          renderSkeleton(ctx, landmarks, canvas.width, canvas.height);
        }

        const evalResult = evaluatePosture(landmarks);
        setPostureResult(evalResult);
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-cyan-400 tracking-wider uppercase">
            Ergonomic Biomechanics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Posture Analysis & Spine Health
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <AIStatusBadge status={aiStatus} isDemo={isDemoMode} />
          {(isCameraLive || isDemoMode) && (
            <Button variant="primary" size="sm" onClick={handleSavePostureCheck}>
              Log Posture Check
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera / Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-navy-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                isCameraLive ? 'block' : 'hidden'
              }`}
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
                isCameraLive ? 'transform -scale-x-100' : ''
              }`}
            />

            {!isCameraLive && !isDemoMode && (
              <div className="max-w-md text-center p-6 space-y-4 z-20">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-glow-cyan">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Sit Upright Facing Camera</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  MoveGuard assesses forward head tilt, shoulder symmetry, and spine tilt in real-time.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button onClick={startCamera} className="gap-2 text-xs">
                    <Camera className="w-4 h-4" /> Start Check
                  </Button>
                  <Button variant="secondary" onClick={startDemo} className="gap-2 text-xs">
                    <Play className="w-4 h-4 text-cyan-400" /> Demo Check
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                {isCameraLive ? (
                  <Button variant="danger" size="sm" onClick={stopCamera} className="gap-1.5 text-xs">
                    <CameraOff className="w-3.5 h-3.5" /> Stop
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={startCamera} className="gap-1.5 text-xs bg-navy-900/90">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" /> Start Camera
                  </Button>
                )}
                <Button
                  variant={isDemoMode ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={isDemoMode ? () => setIsDemoMode(false) : startDemo}
                  className="gap-1.5 text-xs bg-navy-900/90"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  {isDemoMode ? 'Stop Demo' : 'Run Demo'}
                </Button>
              </div>

              <div className="flex items-center gap-2 bg-navy-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{duration}s</span>
              </div>
            </div>
          </div>

          {/* Safe Wellness Disclaimer Banner */}
          <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Wellness Guidance:</strong> MoveGuard posture scoring reflects relative alignment and daily habits. It is not intended to diagnose medical conditions such as scoliosis or cervical disc pathology.
            </p>
          </div>
        </div>

        {/* Right: Scores & Cues */}
        <div className="lg:col-span-4 space-y-4">
          {/* Posture Score Card */}
          <Card className="text-center p-6 border-cyan-500/30">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
              Overall Posture Score
            </span>
            <div className="text-6xl font-extrabold font-display text-white tracking-tight my-2">
              {postureResult.overallScore}
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {postureResult.overallScore >= 85 ? 'Optimal Alignment' : 'Moderate Alignment'}
            </span>
          </Card>

          {/* Alignment Sub-scores */}
          <div className="space-y-3">
            {[
              { label: 'Neck Alignment', score: postureResult.neckScore, sub: `${postureResult.forwardHeadAngle}° tilt` },
              { label: 'Shoulder Balance', score: postureResult.shoulderScore, sub: `${postureResult.shoulderTiltAngle}° delta` },
              { label: 'Spine Uprightness', score: postureResult.backScore, sub: `${postureResult.trunkLeanAngle}° lean` },
            ].map((item, idx) => (
              <div key={idx} className="bg-navy-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-200">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">{item.sub}</span>
                    <strong className="text-sm font-bold text-cyan-400">{item.score}%</strong>
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Ergonomic Cues Box */}
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Actionable Ergonomic Cues
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {postureResult.feedback.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
