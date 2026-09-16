import { Profile, UserRole } from './database';

export interface UserSession {
  user: {
    id: string;
    email: string;
  };
  profile: Profile;
  token?: string;
}

export interface AuthContextType {
  user: UserSession['user'] | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  signup: (email: string, fullName: string, password?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}
