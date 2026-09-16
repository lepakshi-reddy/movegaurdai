import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Language } from '../../types/database';
import { getTranslation } from '../../lib/i18n';
import {
  Activity,
  BarChart3,
  Camera,
  Compass,
  Dumbbell,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Shield,
  User,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange }) => {
  const { user, profile, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(currentLang);

  const navLinks = [
    { to: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/analyze', label: t.nav.analyze, icon: Camera },
    { to: '/posture', label: t.nav.posture, icon: Activity },
    { to: '/exercises', label: t.nav.exercises, icon: Dumbbell },
    { to: '/reports', label: t.nav.reports, icon: BarChart3 },
    { to: '/history', label: t.nav.history, icon: History },
    { to: '/chat', label: t.nav.chat, icon: MessageSquare },
  ];

  if (role === 'admin') {
    navLinks.push({ to: '/admin', label: t.nav.admin, icon: Shield });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-cyan-300 flex items-center justify-center text-white shadow-glow-cyan shadow-sm transition-transform duration-300 group-hover:scale-105">
            <span className="text-xl font-black">✦</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              MoveGuard <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
              Biomechanical Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden lg:flex items-center gap-1.5 bg-navy-900/60 p-1.5 rounded-full border border-slate-800/80">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Actions: Language Switcher, Profile & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="flex items-center gap-1 bg-navy-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-navy-900 text-slate-200">English</option>
              <option value="te" className="bg-navy-900 text-slate-200">తెలుగు</option>
              <option value="hi" className="bg-navy-900 text-slate-200">हिन्दी</option>
            </select>
          </div>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-slate-800 transition"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate">
                  {profile?.full_name || 'User'}
                </span>
                {role === 'admin' && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    Admin
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-lg bg-navy-900 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-800 text-slate-400 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                {t.nav.login}
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-glow-cyan transition duration-200"
              >
                {t.nav.signup}
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden bg-navy-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-slate-300"
            >
              <User className="w-4 h-4 text-cyan-400" />
              {profile?.full_name || 'Profile'}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
