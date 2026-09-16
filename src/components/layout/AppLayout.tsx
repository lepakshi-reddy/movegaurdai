import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Language } from '../../types/database';

interface AppLayoutProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-cyan-500 selection:text-navy-950">
      <Navbar currentLang={currentLang} onLanguageChange={onLanguageChange} />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
