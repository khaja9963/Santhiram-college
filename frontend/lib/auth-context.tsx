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

export const DEMO_USERS: Record<UserRole, User> = {
  STUDENT: {
    id: 'demo-student-01',
    user_code: '22X51A0501',
    email: 'student@srecnandyal.edu.in',
    full_name: 'Sai Teja Reddy',
    name: 'Sai Teja Reddy',
    role: 'STUDENT',
    status: 'ACTIVE',
    department_name: 'Computer Science & Engineering',
    is_active: true,
  },
  FACULTY: {
    id: 'demo-faculty-01',
    user_code: 'SREC-FAC-0104',
    email: 'faculty@srecnandyal.edu.in',
    full_name: 'Dr. K. Subba Reddy',
    name: 'Dr. K. Subba Reddy',
    role: 'FACULTY',
    status: 'ACTIVE',
    department_name: 'Computer Science & Engineering',
    is_active: true,
  },
  ADMIN: {
    id: 'demo-admin-01',
    user_code: 'SREC-ADM-001',
    email: 'admin@srecnandyal.edu.in',
    full_name: 'Dr. M. Santhiramudu',
    name: 'Dr. M. Santhiramudu',
    role: 'ADMIN',
    status: 'ACTIVE',
    department_name: 'Central Administration',
    is_active: true,
  },
};

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<LoginResult>;
  quickLogin: (asRole: UserRole) => Promise<LoginResult>;
  demoLogin: (asRole: UserRole) => LoginResult;
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

  const demoLogin = (asRole: UserRole): LoginResult => {
    setIsLoading(true);
    const demoUser = DEMO_USERS[asRole];
    const demoToken = `demo_jwt_token_${asRole.toLowerCase()}_${Date.now()}`;

    localStorage.setItem('srec_token', demoToken);
    localStorage.setItem('srec_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setRole(asRole);
    setToken(demoToken);
    setIsLoading(false);

    const dest = asRole === 'ADMIN' ? '/admin/dashboard/' : asRole === 'STUDENT' ? '/student/dashboard/' : '/faculty/dashboard/';
    router.push(dest);
    return { success: true };
  };

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

      if (res.first_login) {
        return { success: true, first_login: true };
      }

      // Redirect based on role
      const dest = res.role === 'ADMIN' ? '/admin/dashboard/' : res.role === 'STUDENT' ? '/student/dashboard/' : '/faculty/dashboard/';
      router.push(dest);

      return { success: true, first_login: res.first_login };
    } catch (err: any) {
      // Check UserStore for registered / admin-issued accounts
      const { UserStore } = await import('@/lib/user-store');
      const verify = UserStore.verifyCredentials(identifier, pass);
      if (verify.user) {
        const u = verify.user;
        const userObj: User = {
          id: u.id,
          user_code: u.user_code,
          email: u.email,
          full_name: u.full_name,
          name: u.name,
          role: u.role,
          status: u.status,
          first_login: u.mustChangePassword,
          is_active: true,
          department_name: u.department_name,
        };

        const localToken = `srec_token_${u.role.toLowerCase()}_${Date.now()}`;
        localStorage.setItem('srec_token', localToken);
        localStorage.setItem('srec_user', JSON.stringify(userObj));
        setUser(userObj);
        setRole(u.role);
        setToken(localToken);

        if (u.mustChangePassword) {
          return { success: true, first_login: true };
        }

        const dest = u.role === 'ADMIN' ? '/admin/dashboard/' : u.role === 'STUDENT' ? '/student/dashboard/' : '/faculty/dashboard/';
        router.push(dest);
        return { success: true, first_login: false };
      }

      return {
        success: false,
        error: verify.error || 'Invalid User ID or Password. If you are a new student or faculty, please submit an Access Request below.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (asRole: UserRole): Promise<LoginResult> => {
    return demoLogin(asRole);
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
    <AuthContext.Provider value={{ user, role, token, isLoading, login, quickLogin, demoLogin, logout, refreshUser }}>
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
