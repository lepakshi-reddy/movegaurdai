import React from 'react';
import { Link } from 'react-router-dom';
import { EXERCISE_CONFIGS } from '../ai/exerciseConfigs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, Dumbbell, ShieldCheck, Target } from 'lucide-react';

export const ExercisesPage: React.FC = () => {
  const exercises = Object.values(EXERCISE_CONFIGS);

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Movement Standards
        </span>
        <h1 className="text-3xl font-extrabold font-display text-white">
          Exercise Biomechanics Library
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          MoveGuard AI measures exact anatomical joint flexion, spine linearity, and tempo across all supported movements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((ex) => (
          <Card key={ex.id} className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {ex.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">{ex.name}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl">
                  {ex.id === 'squat' && '🏋️'}
                  {ex.id === 'pushup' && '💪'}
                  {ex.id === 'situp' && '🧘'}
                  {ex.id === 'lunge' && '🦵'}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ex.description}</p>

              {/* Target Joint Angles */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-navy-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Primary Joint</span>
                  <strong className="text-xs font-bold text-cyan-300 block mt-0.5">{ex.primaryJoint}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Inflection Depth</span>
                  <strong className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">
                    &lt; {ex.thresholds.downThreshold}°
                  </strong>
                </div>
              </div>

              {/* Muscles Targeted */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Target Muscle Groups
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ex.targetMuscles.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-lg bg-navy-950 border border-slate-800 text-[11px] font-medium text-slate-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Form Cues & Execution
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {ex.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link to={`/analyze?exercise=${ex.id}`}>
              <Button className="w-full gap-2 text-xs">
                Launch {ex.name} Coach <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
