import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm">
              ✦
            </div>
            <div>
              <p className="font-display font-bold text-slate-100 text-sm">
                MoveGuard <span className="text-slate-400">AI</span>
              </p>
              <p className="text-xs text-slate-400">Move better. Train smarter.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck className="w-4 h-4" /> 100% Local Video Inference
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-4 h-4 text-cyan-400" /> HealthTech Hackathon
            </span>
            <span className="text-slate-400">
              Zero Raw Video Stored
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right">
            © {new Date().getFullYear()} MoveGuard AI. Built for wellness & fitness optimization.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-850 text-center text-[11px] text-slate-400 max-w-3xl mx-auto leading-relaxed">
          <strong className="text-slate-400">Notice:</strong> MoveGuard AI provides biomechanical motion feedback and ergonomic posture analysis for general wellness, fitness education, and self-improvement purposes only. It does not provide medical diagnosis, clinical evaluation, or treatment for any musculoskeletal pathology. Consult a physician or physical therapist for clinical conditions.
        </div>
      </div>
    </footer>
  );
};
