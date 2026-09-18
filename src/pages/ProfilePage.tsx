import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { FitnessLevel, Language } from '../types/database';
import {
  Globe,
  Heart,
  Lock,
  LogOut,
  Save,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';

interface ProfilePageProps {
  onLanguageChange: (lang: Language) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLanguageChange }) => {
  const { profile, user, logout, updateProfile, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [age, setAge] = useState<number | ''>(profile?.age || 27);
  const [height, setHeight] = useState<number | ''>(profile?.height || 178);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(profile?.fitness_level || 'intermediate');
  const [language, setLanguage] = useState<Language>(profile?.preferred_language || 'en');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      full_name: fullName,
      age: age === '' ? undefined : Number(age),
      height: height === '' ? undefined : Number(height),
      fitness_level: fitnessLevel,
      preferred_language: language,
    });
    onLanguageChange(language);
    setSaving(false);
    toast('Profile updated successfully!', 'success');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Account & Bio
        </span>
        <h1 className="text-3xl font-extrabold font-display text-white">
          Athlete Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Personalize your biomechanical biometric thresholds and application settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Bio card */}
        <Card className="md:col-span-4 p-6 text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-white text-black font-black text-2xl flex items-center justify-center shadow-glow-cyan mx-auto">
              {fullName.charAt(0) || 'A'}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{fullName || 'Athlete'}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">{fitnessLevel} Tier</span>
            </div>
          </div>

          <div className="w-full pt-6 border-t border-slate-800 space-y-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="w-full gap-2 text-xs"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </Button>
          </div>
        </Card>

        {/* Right: Editable Form */}
        <Card className="md:col-span-8 p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-navy-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min={100}
                  max={250}
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Fitness Experience
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="beginner">Beginner (Building Base)</option>
                  <option value="intermediate">Intermediate (Regular Training)</option>
                  <option value="advanced">Advanced (High Performance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="en">English</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            <Button type="submit" isLoading={saving} className="w-full sm:w-auto gap-2 text-xs">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
