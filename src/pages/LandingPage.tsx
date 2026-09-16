import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Brain,
  Camera,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Eye,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Track 03 · HealthTech AI Innovation</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Move better.<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                Train smarter.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              AI-powered movement and posture guidance that helps you understand how you move through your laptop or mobile camera with real-time on-device biomechanical feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/analyze?demo=true" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 border-slate-700 hover:border-cyan-500/50">
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20" /> Try Demo
                </Button>
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Lock className="w-4 h-4 text-cyan-400" /> 100% On-Device Privacy
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Zap className="w-4 h-4 text-cyan-400" /> Real-time Joint Analysis
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Eye className="w-4 h-4 text-cyan-400" /> No Wearables Required
              </span>
            </div>
          </div>

          {/* Hero Visual Card: Live Skeleton Simulation Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-slate-900/60 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
              <div className="relative rounded-2xl overflow-hidden bg-navy-950/90 aspect-[4/5] flex flex-col justify-between p-6 border border-slate-800">
                {/* Scanner beam */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-scan pointer-events-none" />

                {/* Status top badge */}
                <div className="flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-navy-900/90 border border-slate-700 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI Camera Ready
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    60 FPS
                  </span>
                </div>

                {/* Animated Futuristic Body Mesh representation */}
                <div className="relative flex-1 flex items-center justify-center my-4">
                  <svg className="w-64 h-80 text-cyan-400" viewBox="0 0 200 260" fill="none">
                    {/* Head */}
                    <circle cx="100" cy="35" r="16" stroke="currentColor" strokeWidth="2.5" fill="rgba(0,240,255,0.05)" />
                    <circle cx="100" cy="35" r="4" fill="#00f0ff" />
                    {/* Spine */}
                    <line x1="100" y1="51" x2="100" y2="135" stroke="currentColor" strokeWidth="2.5" />
                    {/* Shoulders */}
                    <line x1="65" y1="70" x2="135" y2="70" stroke="currentColor" strokeWidth="3" />
                    {/* Left Arm */}
                    <line x1="65" y1="70" x2="45" y2="105" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="45" y1="105" x2="35" y2="140" stroke="currentColor" strokeWidth="2.5" />
                    {/* Right Arm */}
                    <line x1="135" y1="70" x2="155" y2="105" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="155" y1="105" x2="165" y2="140" stroke="currentColor" strokeWidth="2.5" />
                    {/* Hips */}
                    <line x1="75" y1="135" x2="125" y2="135" stroke="currentColor" strokeWidth="3" />
                    {/* Left Leg */}
                    <line x1="75" y1="135" x2="68" y2="190" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="68" y1="190" x2="65" y2="245" stroke="currentColor" strokeWidth="2.5" />
                    {/* Right Leg */}
                    <line x1="125" y1="135" x2="132" y2="190" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="132" y1="190" x2="135" y2="245" stroke="currentColor" strokeWidth="2.5" />

                    {/* Joint Highlights */}
                    <circle cx="65" cy="70" r="4.5" fill="#fff" stroke="#00f0ff" strokeWidth="2" />
                    <circle cx="135" cy="70" r="4.5" fill="#fff" stroke="#00f0ff" strokeWidth="2" />
                    <circle cx="45" cy="105" r="4" fill="#22c55e" />
                    <circle cx="155" cy="105" r="4" fill="#22c55e" />
                    <circle cx="75" cy="135" r="4.5" fill="#fff" stroke="#00f0ff" strokeWidth="2" />
                    <circle cx="125" cy="135" r="4.5" fill="#fff" stroke="#00f0ff" strokeWidth="2" />
                    <circle cx="68" cy="190" r="5" fill="#00f0ff" className="animate-pulse" />
                    <circle cx="132" cy="190" r="5" fill="#00f0ff" className="animate-pulse" />
                  </svg>

                  {/* Knee Angle Overlay Callout */}
                  <div className="absolute right-4 top-1/2 bg-navy-900/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-right shadow-lg">
                    <span className="text-[10px] text-slate-400 block font-bold">KNEE FLEXION</span>
                    <strong className="text-cyan-300 text-lg font-mono">92.4°</strong>
                  </div>
                </div>

                {/* Score floating banner */}
                <div className="bg-navy-900/95 border border-slate-700/90 rounded-xl p-4 flex items-center justify-between z-10 shadow-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Real-Time Form Score
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold font-display text-white">92</span>
                      <span className="text-xs font-bold text-emerald-400">Excellent Depth</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3">
            Why MoveGuard AI
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Movement training is broken. We fixed it with computer vision.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-navy-900/60 p-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 font-bold text-xl">
              ✕
            </div>
            <h4 className="text-xl font-bold text-white mb-3">The Common Fitness Problem</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Workout apps just show videos without knowing whether your form is safe.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Incorrect posture and joint compensation cause chronic spine and knee strain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Personal coaches are expensive, while fitness trackers only count arm swings.</span>
              </li>
            </ul>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-navy-900/60 p-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 font-bold text-xl">
              ✓
            </div>
            <h4 className="text-xl font-bold text-white mb-3">The MoveGuard AI Solution</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Computer vision maps 33 joints directly in your browser at 60 frames per second.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>State machines accurately count reps and reject shallow or cheated repetitions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>100% on-device processing guarantees zero webcam images ever leave your browser.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3">
            Technology Pipeline
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            5 Simple Steps from Camera to Biomechanical Intelligence
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: '01', title: 'Camera Stream', desc: 'Use your phone, tablet, or laptop webcam. Zero specialized hardware needed.' },
            { step: '02', title: 'Pose Landmarking', desc: 'Extracts 33 high-fidelity 3D anatomical body coordinates via MediaPipe.' },
            { step: '03', title: 'Vector Geometry', desc: 'Computes smoothed joint angles, spine linearity, and hip-to-ankle vectors.' },
            { step: '04', title: 'State Machine', desc: 'Validates full range of motion, counts verified reps, and rejects noise.' },
            { step: '05', title: 'Actionable Guidance', desc: 'Delivers real-time audio and visual cues, scores quality, and logs progress.' },
          ].map((item, idx) => (
            <Card key={idx} className="p-6 relative group hover:border-cyan-500/50 transition">
              <span className="text-xs font-extrabold text-cyan-400 font-mono tracking-widest block mb-4">
                STEP {item.step}
              </span>
              <h4 className="font-bold text-white text-lg mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. SUPPORTED EXERCISES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3">
            Exercise Library
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Engineered for Precision Biomechanics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 'squat',
              title: 'Squats',
              joint: 'Knee Angle < 95°',
              desc: 'Calculates hip-knee-ankle flexion, tracks torso uprightness, and verifies complete depth.',
              muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
            },
            {
              id: 'pushup',
              title: 'Push-ups',
              joint: 'Elbow Angle < 90°',
              desc: 'Monitors shoulder-elbow-wrist angle and checks for hip sag or pike along the spine line.',
              muscles: ['Chest', 'Triceps', 'Core'],
            },
            {
              id: 'situp',
              title: 'Sit-ups',
              joint: 'Hip Angle < 75°',
              desc: 'Measures torso-to-thigh angle to ensure full core contraction without neck pulling.',
              muscles: ['Abs', 'Obliques', 'Hip Flexors'],
            },
            {
              id: 'lunge',
              title: 'Lunges',
              joint: 'Front Knee < 95°',
              desc: 'Ensures proper knee tracking and unilateral balance throughout each repetition.',
              muscles: ['Glutes', 'Quads', 'Calves'],
            },
          ].map((ex) => (
            <Card key={ex.id} className="p-6 flex flex-col justify-between hover:border-cyan-500/40 transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white">{ex.title}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {ex.joint}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">{ex.desc}</p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ex.muscles.map((m) => (
                    <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {m}
                    </span>
                  ))}
                </div>
                <Link to={`/analyze?exercise=${ex.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Start {ex.title} →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. PRIVACY & SECURITY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" /> 100% Privacy by Design
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Your camera never leaves your device. Period.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              MoveGuard AI executes machine learning models directly inside client-side WebAssembly and WebGL. Video frames are analyzed locally in browser memory and immediately discarded. Only anonymized derived telemetry (rep count, form score, session duration) is stored in your secure account.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold font-display text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Do I need a special camera or smart watch?',
              a: 'No wearables or special cameras are required. Any standard smartphone, tablet, or laptop webcam works seamlessly.',
            },
            {
              q: 'Does MoveGuard AI record or save my video footage?',
              a: 'Never. Video processing occurs locally inside your web browser. Neither raw video nor camera frames are transmitted or stored on any server.',
            },
            {
              q: 'How does MoveGuard prevent false rep counting?',
              a: 'We built a state machine with angle smoothing, hysteresis thresholds, minimum transition times, and landmark confidence checks. Incomplete depth or rapid twitching will not count.',
            },
            {
              q: 'Can I test it if I do not have a camera available?',
              a: 'Yes! MoveGuard AI includes a dedicated "DEMO MODE — SIMULATED" that generates realistic biomechanical pose data for testing and presentations.',
            },
          ].map((faq, i) => (
            <Card key={i} className="p-6">
              <h4 className="font-bold text-white text-base mb-2">{faq.q}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-cyan-950/40 via-navy-900 to-navy-950 border border-cyan-500/30 max-w-4xl mx-auto space-y-6 shadow-glow-cyan">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            Ready to experience the future of movement?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join MoveGuard AI today. Analyze your workouts, correct posture, and level up your daily wellness.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Get Started Free
              </Button>
            </Link>
            <Link to="/analyze?demo=true">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Try Demo Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
