import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { speechService } from '../services/speechService';
import { Bell, Camera, Lock, ShieldCheck, Volume2, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [voiceEnabled, setVoiceEnabled] = useState(speechService.isEnabled());
  const [mirrorVideo, setMirrorVideo] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleVoiceToggle = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    speechService.setEnabled(next);
    toast(next ? 'Audio coaching enabled' : 'Audio coaching muted', 'info');
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to reset demo logs in local storage?')) {
      localStorage.removeItem('mg_workout_sessions');
      localStorage.removeItem('mg_rep_events');
      localStorage.removeItem('mg_posture_sessions');
      toast('Local session cache cleared.', 'success');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Preferences
        </span>
        <h1 className="text-3xl font-extrabold font-display text-white">
          Application Settings
        </h1>
      </div>

      <div className="space-y-4">
        {/* Audio settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Audible Rep & Form Coaching</h3>
                <p className="text-xs text-slate-400">
                  Speaks counted reps and correctional cues aloud during workouts.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={handleVoiceToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </Card>

        {/* Video Camera settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Mirror Camera Feed</h3>
                <p className="text-xs text-slate-400">
                  Horizontally flips camera preview so movement feels like a workout mirror.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mirrorVideo}
                onChange={() => setMirrorVideo(!mirrorVideo)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </Card>

        {/* Local Storage & Cache */}
        <Card className="p-6 space-y-4 border-rose-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Local Database & Cache</h3>
                <p className="text-xs text-slate-400">
                  Clears offline simulated workouts, rep logs, and restores clean state.
                </p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={handleClearCache} className="text-xs">
              Clear Cache
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
