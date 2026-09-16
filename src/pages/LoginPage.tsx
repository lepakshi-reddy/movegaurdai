import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lock, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleDemoUser = async () => {
    setLoading(true);
    await loginAsDemoUser();
    setLoading(false);
    navigate(from, { replace: true });
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    await loginAsDemoAdmin();
    setLoading(false);
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-black text-2xl shadow-glow-cyan mb-2">
            ✦
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400">Sign in to your MoveGuard AI account</p>
        </div>

        {/* Quick Demo Login Bar for Judges */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Hackathon Quick-Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoUser}
              className="text-xs py-2 bg-navy-900/80 border-cyan-500/40 text-cyan-200"
            >
              Demo Athlete
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoAdmin}
              className="text-xs py-2 bg-navy-900/80 border-cyan-500/40 text-cyan-200"
            >
              Demo Admin
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="athlete@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-400 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
