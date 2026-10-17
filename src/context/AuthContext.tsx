import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; role?: User['role'] }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    termsAccepted: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  redirectIntent: string | null;
  setRedirectIntent: (path: string | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('omd_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [redirectIntent, setRedirectIntent] = useState<string | null>(() => sessionStorage.getItem('omd_intent'));

  const saveIntent = (path: string | null) => {
    setRedirectIntent(path);
    if (path) {
      sessionStorage.setItem('omd_intent', path);
    } else {
      sessionStorage.removeItem('omd_intent');
    }
  };

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('omd_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('omd_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    termsAccepted: boolean;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      localStorage.setItem('omd_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during registration.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('omd_token');
    setToken(null);
    setUser(null);
    saveIntent(null);
  };

  const refreshUser = async () => {
    if (token) await fetchCurrentUser(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        redirectIntent,
        setRedirectIntent: saveIntent,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
