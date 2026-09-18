import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { dbService } from '../services/db';
import { ExerciseType, RepEvent, WorkoutSession } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatDate, formatTime, getFormScoreCategory } from '../lib/utils';
import {
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Filter,
  History,
  Info,
  Sparkles,
  X,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<ExerciseType | 'all'>('all');
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);
  const [sessionReps, setSessionReps] = useState<RepEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        const data = await dbService.getWorkoutSessions(user.id, filter);
        setWorkouts(data);
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user, filter]);

  const handleOpenDetail = async (session: WorkoutSession) => {
    setSelectedWorkout(session);
    const reps = await dbService.getRepEventsBySession(session.id);
    setSessionReps(reps);
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Audit Trail
          </span>
          <h1 className="text-3xl font-extrabold font-display text-white">
            Workout Session History
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-navy-900/80 p-1.5 rounded-2xl border border-slate-800">
          {(['all', 'squat', 'pushup', 'situp', 'lunge'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${filter === type
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {workouts.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No workout records found</h3>
          <p className="text-xs text-slate-400">
            {filter !== 'all'
              ? `No sessions recorded for ${filter}. Try selecting another filter or complete a workout.`
              : 'Complete an exercise in the Analyze page to record verified repetitions.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => {
            const cat = getFormScoreCategory(w.form_score);
            return (
              <div
                key={w.id}
                onClick={() => handleOpenDetail(w)}
                className="bg-navy-900/70 hover:bg-navy-800/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer shadow-glass group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
                    {w.exercise_type === 'squat' && '🏋️'}
                    {w.exercise_type === 'pushup' && '💪'}
                    {w.exercise_type === 'situp' && '🧘'}
                    {w.exercise_type === 'lunge' && '🦵'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white capitalize">
                        {w.exercise_type}
                      </h3>
                      {w.is_demo && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(w.created_at)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {formatTime(w.duration_seconds)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 font-medium block">Reps</span>
                    <strong className="text-xl font-bold text-white">{w.repetitions}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium block">Form Score</span>
                    <strong className={`text-xl font-bold ${cat.color}`}>{w.form_score}%</strong>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedWorkout(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-navy-950/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Workout Details
              </span>
              <h3 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
                {selectedWorkout.exercise_type} Session
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Logged on {formatDate(selectedWorkout.created_at)} · {formatTime(selectedWorkout.duration_seconds)}
              </p>
            </div>

            {/* Top Stat Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-navy-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Repetitions</span>
                <strong className="text-2xl font-extrabold text-cyan-400 block mt-1">
                  {selectedWorkout.repetitions}
                </strong>
              </div>
              <div className="p-3.5 bg-navy-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Form Score</span>
                <strong className="text-2xl font-extrabold text-emerald-400 block mt-1">
                  {selectedWorkout.form_score}%
                </strong>
              </div>
              <div className="p-3.5 bg-navy-950 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                <strong className="text-lg font-bold text-slate-200 block mt-1.5">
                  {formatTime(selectedWorkout.duration_seconds)}
                </strong>
              </div>
            </div>

            {/* Feedback Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Session Biomechanical Notes
              </h4>
              <div className="bg-navy-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                {selectedWorkout.feedback_summary && selectedWorkout.feedback_summary.length > 0 ? (
                  selectedWorkout.feedback_summary.map((note, i) => (
                    <p key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{note}</span>
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Standard form completed without critical faults.</p>
                )}
              </div>
            </div>

            {/* Individual Reps Breakdown if logged */}
            {sessionReps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Verified Reps Breakdown
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {sessionReps.map((rep) => (
                    <div
                      key={rep.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-slate-800/80 text-xs"
                    >
                      <span className="font-bold text-white">Rep #{rep.rep_number}</span>
                      <span className="text-slate-400 truncate max-w-[200px]">{rep.feedback}</span>
                      <span className="font-bold text-cyan-400">{rep.form_score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={() => setSelectedWorkout(null)} className="w-full text-xs">
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
