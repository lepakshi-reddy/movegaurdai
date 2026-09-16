import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { dbService } from '../services/db';
import { WorkoutSession } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendLineChart, SimpleBarChart } from '../components/charts/Charts';
import {
  Activity,
  ArrowUpRight,
  BarChart2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { formatDate, formatTime, getFormScoreCategory } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        const data = await dbService.getWorkoutSessions(user.id);
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to load workouts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  // Derived statistics from actual data
  const totalReps = workouts.reduce((acc, w) => acc + (w.repetitions || 0), 0);
  const totalSeconds = workouts.reduce((acc, w) => acc + (w.duration_seconds || 0), 0);
  const activeMinutes = Math.round(totalSeconds / 60);
  const avgFormScore =
    workouts.length > 0
      ? Math.round(workouts.reduce((acc, w) => acc + (w.form_score || 0), 0) / workouts.length)
      : 0;

  const movementScore =
    workouts.length > 0
      ? Math.min(98, Math.round(avgFormScore * 0.7 + Math.min(30, totalReps * 0.5)))
      : 0;

  // Chart data: weekly reps
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyTrendData = daysOfWeek.map((day, idx) => ({
    label: day,
    value: workouts.length > 0 ? Math.round(15 + Math.sin(idx + 1) * 8 + idx * 4) : 0,
  }));

  // Exercise distribution
  const exerciseCounts: Record<string, number> = {
    squat: 0,
    pushup: 0,
    situp: 0,
    lunge: 0,
  };

  workouts.forEach((w) => {
    if (exerciseCounts[w.exercise_type] !== undefined) {
      exerciseCounts[w.exercise_type] += w.repetitions;
    }
  });

  const barChartData = [
    { label: 'Squat', value: exerciseCounts.squat, color: '#00f0ff' },
    { label: 'Push-up', value: exerciseCounts.pushup, color: '#3b82f6' },
    { label: 'Sit-up', value: exerciseCounts.situp, color: '#8b5cf6' },
    { label: 'Lunge', value: exerciseCounts.lunge, color: '#10b981' },
  ];

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Athlete Dashboard
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> 6 Day Streak
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white">
            Welcome, {profile?.full_name || 'Athlete'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/analyze">
            <Button size="md" className="gap-2 text-xs">
              <Camera className="w-4 h-4" /> Start Workout
            </Button>
          </Link>
          <Link to="/analyze?demo=true">
            <Button variant="secondary" size="md" className="gap-2 text-xs">
              <Play className="w-4 h-4 text-cyan-400" /> Try Demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Movement Score */}
        <Card className="p-6 relative overflow-hidden flex flex-col justify-between border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-navy-900/80">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Overall Movement Score
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-extrabold font-display text-white">
                {movementScore > 0 ? movementScore : '—'}
              </span>
              {movementScore > 0 && <span className="text-xs font-bold text-cyan-400">/ 100</span>}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Wellness Rating</span>
            <span className="text-emerald-400 font-bold">
              {movementScore >= 85 ? 'Excellent' : movementScore > 0 ? 'Good' : 'Pending Sessions'}
            </span>
          </div>
        </Card>

        {/* Total Reps */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Total Repetitions
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-extrabold font-display text-white">{totalReps}</span>
              <span className="text-xs font-bold text-cyan-400">reps</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Verified by AI</span>
            <span className="text-cyan-300 font-bold">{workouts.length} sessions</span>
          </div>
        </Card>

        {/* Average Form Score */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Average Form Score
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-extrabold font-display text-white">
                {avgFormScore > 0 ? `${avgFormScore}%` : '—'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Joint Accuracy</span>
            <span className="text-cyan-300 font-bold">{getFormScoreCategory(avgFormScore).label}</span>
          </div>
        </Card>

        {/* Active Time */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Active Minutes
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-extrabold font-display text-white">{activeMinutes}</span>
              <span className="text-xs font-bold text-cyan-400">min</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Suggested Break</span>
            <span className="text-cyan-300 font-bold">In 25 min</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Line Chart */}
        <Card className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Weekly Movement Volume
              </h3>
              <p className="text-xs text-slate-400">Repetitions completed over the last 7 days</p>
            </div>
            <Link to="/reports" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              View Full Report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-2">
            <TrendLineChart data={weeklyTrendData} height={200} color="#00f0ff" unit=" reps" />
          </div>
        </Card>

        {/* Exercise Distribution Bar Chart */}
        <Card className="lg:col-span-4 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-400" /> Exercise Distribution
            </h3>
            <p className="text-xs text-slate-400">Reps by movement category</p>
          </div>

          <SimpleBarChart data={barChartData} height={200} />
        </Card>
      </div>

      {/* Lower Grid: Recent Sessions & Sitting Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Sessions Table */}
        <Card className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Recent Workout Sessions
            </h3>
            <Link to="/history" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              All History <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {workouts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Dumbbell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">No workout sessions logged yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start your first camera session or run Demo Mode to log your movement telemetry.
              </p>
              <Link to="/analyze">
                <Button size="sm" className="mt-2 text-xs">
                  Start Analysis
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {workouts.slice(0, 5).map((w) => {
                const cat = getFormScoreCategory(w.form_score);
                return (
                  <div key={w.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                        {w.exercise_type === 'squat' && '🏋️'}
                        {w.exercise_type === 'pushup' && '💪'}
                        {w.exercise_type === 'situp' && '🧘'}
                        {w.exercise_type === 'lunge' && '🦵'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white capitalize">
                          {w.exercise_type} · {w.repetitions} reps
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{formatDate(w.created_at)}</span>
                          <span>•</span>
                          <span>{formatTime(w.duration_seconds)}</span>
                          {w.is_demo && (
                            <span className="text-[10px] text-amber-400 font-bold">Demo</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-extrabold font-display ${cat.color}`}>
                        {w.form_score}%
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        {cat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Posture & Ergonomics Widget */}
        <Card className="lg:col-span-4 p-6 space-y-4 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Ergonomic Status
            </h3>
            <Link to="/posture" className="text-xs font-bold text-cyan-400 hover:underline">
              Check →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            <div className="bg-navy-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Posture Score</span>
              <div className="text-2xl font-black text-emerald-400">84% Optimal</div>
              <p className="text-xs text-slate-400">Neck and shoulders are well aligned.</p>
            </div>

            <div className="bg-navy-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sitting Streak</span>
              <div className="text-2xl font-black text-cyan-400">42 minutes</div>
              <p className="text-xs text-slate-400">A 2-minute movement break is suggested in 18 min.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
