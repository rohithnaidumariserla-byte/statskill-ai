import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: 'official' | 'admin';
  isLoading: boolean;
  loginAs: (role: 'official' | 'admin') => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { DEFAULT_OFFICIAL_USER, DEFAULT_ADMIN_USER } from '../services/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initUser = async () => {
    try {
      const savedUserId = localStorage.getItem('statskill_user_id');
      if (savedUserId) {
        const res = await api.getMe(savedUserId);
        if (res?.user) {
          setUser(res.user);
        } else {
          setUser(savedUserId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER);
        }
      }
    } catch (e) {
      console.warn('Init user fallback', e);
      const savedUserId = localStorage.getItem('statskill_user_id');
      if (savedUserId) {
        setUser(savedUserId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  const loginAs = async (role: 'official' | 'admin') => {
    setIsLoading(true);
    try {
      const res = await api.login(undefined, role);
      const targetUser = res?.user || (role === 'admin' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER);
      setUser(targetUser);
      localStorage.setItem('statskill_user_id', targetUser.id);
    } catch (e) {
      console.warn('Login fallback', e);
      const targetUser = role === 'admin' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER;
      setUser(targetUser);
      localStorage.setItem('statskill_user_id', targetUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await api.switchUser(userId);
      const targetUser = res?.user || (userId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER);
      setUser(targetUser);
      localStorage.setItem('statskill_user_id', targetUser.id);
    } catch (e) {
      console.warn('Switch user fallback', e);
      const targetUser = userId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER;
      setUser(targetUser);
      localStorage.setItem('statskill_user_id', targetUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('statskill_user_id');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await api.getMe(user.id);
      if (res?.user) setUser(res.user);
    } catch (e) {
      console.error('Refresh user error', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || 'official',
      isLoading,
      loginAs,
      switchUser,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
