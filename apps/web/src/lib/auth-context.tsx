import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthResponse, User } from '@fullstack/types';
import { api, setAuthToken } from './api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  register: (payload: { email: string; name: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'fullstack-auth';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw) as { user: User; token: string };
    setUser(data.user);
    setToken(data.token);
    setAuthToken(data.token);
  }, []);

  const persistAuth = (response: AuthResponse) => {
    setUser(response.user);
    setToken(response.token);
    setAuthToken(response.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  };

  const register = async (payload: { email: string; name: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    persistAuth(response.data);
  };

  const login = async (payload: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    persistAuth(response.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ user, token, register, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
