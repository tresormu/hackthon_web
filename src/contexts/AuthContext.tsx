import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import authService from '../services/authService';
import type { ActivatePatientResponse } from '../services/authService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'chw';
  phone?: string;
  hospitalName?: string;
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, hospitalName: string) => Promise<void>;
  activatePatient: (phone: string, pinCode: string, password: string) => Promise<ActivatePatientResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Omit<AuthUser, 'id' | 'role'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));

    const handleForceLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user as AuthUser);
  };

  const register = async (name: string, email: string, password: string, hospitalName: string) => {
    const result = await authService.register({ name, email, password, hospitalName });
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user as AuthUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const activatePatient = async (phone: string, pinCode: string, password: string) => {
    return authService.activatePatient({ phone, pinCode, password });
  };

  const updateProfile = async (data: Partial<Omit<AuthUser, 'id' | 'role'>>) => {
    const response = await api.patch('/auth/profile', data);
    setUser(response.data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, activatePatient, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
