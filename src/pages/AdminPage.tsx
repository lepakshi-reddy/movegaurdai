import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Profile, WorkoutSession } from '../types/database';
import { Card } from '../components/ui/Card';
import { TrendLineChart, SimpleBarChart } from '../components/charts/Charts';
import { formatDate, formatTime, getFormScoreCategory } from '../lib/utils';
import {
  Activity,
  Dumbbell,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalReps: number;
    avgFormScore: number;
    exerciseDistribution: Record<string, number>;
    recentWorkouts: WorkoutSession[];
    recentUsers: Profile[];
  } | null>(null);

  useEffect(() => {
    async function loadAdminTelemetry() {
      const data = await dbService.getAdminStats();
      setStats(data);
    }
    loadAdminTelemetry();
  }, []);

  if (!stats) return null;

  // Chart data: registrations
  const registrationChart = [
    { label: 'Week 1', value: 2 },
    { label: 'Week 2', value: 5 },
    { label: 'Week 3', value: 12 },
    { label: 'Week 4', value: stats.totalUsers || 18 },
  ];

  // Most popular exercise
  const mostPopular =
    Object.entries(stats.exerciseDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'squat';

  const barData = [
    { label: 'Squat', value: stats.exerciseDistribution.squat || 0, color: '#00f0ff' },
    { label: 'Push-up', value: stats.exerciseDistribution.pushup || 0, color: '#3b82f6' },
    { label: 'Sit-up', value: stats.exerciseDistribution.situp || 0, color: '#8b5cf6' },
    { label: 'Lunge', value: stats.exerciseDistribution.lunge || 0, color: '#10b981' },
  ];

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Administrator Portal
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              High Privilege
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white">
            MoveGuard System Telemetry
          </h1>
        </div>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="bg-navy-900/90 border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Strict Zero-Video Telemetry:</strong> In compliance with the MoveGuard privacy architecture, administrators can only access aggregated motion metrics, rep logs, and accounts. Raw camera video is never transmitted to or accessible from this portal.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Registered', val: stats.totalUsers, unit: 'users', color: 'text-cyan-400' },
          { label: 'Active Users', val: stats.activeUsers, unit: 'athletes', color: 'text-emerald-400' },
          { label: 'Workout Sessions', val: stats.totalSessions, unit: 'sessions', color: 'text-blue-400' },
          { label: 'Total Repetitions', val: stats.totalReps, unit: 'reps counted', color: 'text-purple-400' },
          { label: 'Platform Avg Form', val: `${stats.avgFormScore}%`, unit: 'quality', color: 'text-amber-400' },
          { label: 'Most Popular', val: mostPopular.toUpperCase(), unit: 'exercise', color: 'text-cyan-300' },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              {item.label}
            </span>
            <div className="my-2">
              <span className={`text-2xl sm:text-3xl font-extrabold font-display ${item.color}`}>
                {item.val}
              </span>
              <span className="text-[10px] text-slate-400 block">{item.unit}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> User Registration Velocity
          </h3>
          <TrendLineChart data={registrationChart} height={200} color="#3b82f6" unit=" athletes" />
        </Card>

        <Card className="lg:col-span-6 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" /> Platform Exercise Distribution
          </h3>
          <SimpleBarChart data={barData} height={200} />
        </Card>
      </div>

      {/* Recent Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Workouts */}
        <Card className="lg:col-span-7 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Recent Platform Workouts</h3>
          <div className="divide-y divide-slate-800">
            {stats.recentWorkouts.map((w) => {
              const cat = getFormScoreCategory(w.form_score);
              return (
                <div key={w.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-white capitalize text-sm block">
                      {w.exercise_type} ({w.repetitions} reps)
                    </strong>
                    <span className="text-slate-400">
                      User: {w.user_id} • {formatDate(w.created_at)}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className={`font-bold ${cat.color}`}>{w.form_score}%</strong>
                    <span className="text-slate-400 block">{formatTime(w.duration_seconds)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">User Accounts</h3>
          <div className="divide-y divide-slate-800">
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white text-sm block">{u.full_name}</strong>
                  <span className="text-slate-400">{u.email}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {u.role}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 capitalize">
                    {u.fitness_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
