'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';
import { AuthAPI } from '@/lib/api';

interface LoginResult {
  success: boolean;
  error?: string;
  first_login?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<LoginResult>;
  quickLogin: (asRole: UserRole) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const me = await AuthAPI.getMe();
      setUser(me);
      setRole(me.role);
      localStorage.setItem('srec_user', JSON.stringify(me));
    } catch (e) {
      console.warn('Failed to refresh user profile:', e);
    }
  };

  useEffect(() => {
    // Check saved session in local storage
    const savedToken = localStorage.getItem('srec_token');
    const savedUser = localStorage.getItem('srec_user');

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role);
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('srec_token');
        localStorage.removeItem('srec_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, pass: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      const res = await AuthAPI.login({ identifier, password: pass });
      const userData: User = {
        id: res.user_id,
        user_code: res.user_code,
        email: res.email,
        full_name: res.full_name,
        name: res.full_name,
        role: res.role,
        status: res.status,
        first_login: res.first_login,
        is_active: res.status === 'ACTIVE',
      };

      localStorage.setItem('srec_token', res.access_token);
      localStorage.setItem('srec_user', JSON.stringify(userData));
      setUser(userData);
      setRole(res.role);
      setToken(res.access_token);

      // Redirect based on role
      if (res.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (res.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (res.role === 'FACULTY') {
        router.push('/faculty/dashboard');
      } else {
        router.push('/');
      }

      return { success: true, first_login: res.first_login };
    } catch (err: any) {
      const msg = err.message || 'Unable to sign in. Please verify your credentials or try again later.';
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (asRole: UserRole): Promise<LoginResult> => {
    const creds: Record<UserRole, { identifier: string; pass: string }> = {
      STUDENT: { identifier: 'student@srec.local', pass: 'Student@Srec2026' },
      FACULTY: { identifier: 'faculty@srec.local', pass: 'Faculty@Srec2026' },
      ADMIN: { identifier: 'admin@srec.local', pass: 'Admin@Srec2026' },
    };

    const target = creds[asRole];
    return await login(target.identifier, target.pass);
  };

  const logout = async () => {
    try {
      await AuthAPI.logout().catch(() => {});
    } finally {
      localStorage.removeItem('srec_token');
      localStorage.removeItem('srec_user');
      setUser(null);
      setRole(null);
      setToken(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isLoading, login, quickLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
