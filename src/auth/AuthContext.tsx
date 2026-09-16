import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '../types/auth';
import { Profile, UserRole } from '../types/database';
import { dbService } from '../services/db';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load session from storage on boot
  useEffect(() => {
    async function restoreSession() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            const prof = await dbService.getProfile(session.user.id);
            if (prof) setProfile(prof);
            setLoading(false);
            return;
          }
        }

        // Local storage fallback session
        const savedSession = localStorage.getItem('mg_auth_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password?: string): Promise<{ error?: string }> => {
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        if (data.user) {
          const prof = await dbService.getProfile(data.user.id);
          setUser({ id: data.user.id, email: data.user.email || email });
          if (prof) setProfile(prof);
          return {};
        }
      }

      // Check local profiles
      const profile = await dbService.getProfile(email === 'admin@moveguard.ai' ? 'usr-admin-001' : 'usr-demo-001');
      if (profile) {
        const sessionUser = { id: profile.user_id, email: profile.email };
        setUser(sessionUser);
        setProfile(profile);
        localStorage.setItem('mg_auth_session', JSON.stringify({ user: sessionUser, profile }));
        return {};
      }

      return { error: 'Invalid email or password' };
    } catch (e: any) {
      return { error: e.message || 'Authentication failed' };
    }
  };

  const signup = async (email: string, fullName: string, password?: string): Promise<{ error?: string }> => {
    try {
      const newUserId = `usr-${Date.now()}`;
      const newProfile: Profile = {
        id: `p-${Date.now()}`,
        user_id: newUserId,
        full_name: fullName,
        email,
        fitness_level: 'intermediate',
        preferred_language: 'en',
        role: 'user', // Default role is always user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) return { error: error.message };
        if (data.user) {
          newProfile.user_id = data.user.id;
        }
      }

      await dbService.saveProfile(newProfile);
      const sessionUser = { id: newProfile.user_id, email: newProfile.email };
      setUser(sessionUser);
      setProfile(newProfile);
      localStorage.setItem('mg_auth_session', JSON.stringify({ user: sessionUser, profile: newProfile }));
      return {};
    } catch (e: any) {
      return { error: e.message || 'Signup failed' };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('mg_auth_session');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    if (!profile) return;
    const updated: Profile = {
      ...profile,
      ...updates,
      role: profile.role, // Disallow self-assignment of admin role
      updated_at: new Date().toISOString(),
    };
    await dbService.saveProfile(updated);
    setProfile(updated);
    localStorage.setItem('mg_auth_session', JSON.stringify({ user, profile: updated }));
  };

  const loginAsDemoUser = async (): Promise<void> => {
    const prof = await dbService.getProfile('usr-demo-001');
    if (prof) {
      const u = { id: prof.user_id, email: prof.email };
      setUser(u);
      setProfile(prof);
      localStorage.setItem('mg_auth_session', JSON.stringify({ user: u, profile: prof }));
    }
  };

  const loginAsDemoAdmin = async (): Promise<void> => {
    const prof = await dbService.getProfile('usr-admin-001');
    if (prof) {
      const u = { id: prof.user_id, email: prof.email };
      setUser(u);
      setProfile(prof);
      localStorage.setItem('mg_auth_session', JSON.stringify({ user: u, profile: prof }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || null,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        loginAsDemoUser,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
