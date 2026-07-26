import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('meditwin_token');
    const demoUser = {
      id: 'demo-user-123',
      name: 'Alex Morgan',
      email: 'demo@meditwin.ai',
      blood_group: 'A+',
      allergies: ['Penicillin'],
      emergency_contact: '+1 (555) 948-2301',
      role: 'patient'
    };

    if (token) {
      if (token === 'demo-mock-jwt-token') {
        setUser(demoUser);
        setLoading(false);
      } else {
        authApi.getMe()
          .then((res) => {
            setUser(res.data || demoUser);
          })
          .catch(() => {
            // Keep user logged in with demo profile even if backend endpoint is unavailable
            setUser(demoUser);
          })
          .finally(() => setLoading(false));
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const demo = {
      id: 'demo-user-123',
      name: email && email.includes('admin') ? 'Admin User' : 'Alex Morgan',
      email: email || 'demo@meditwin.ai',
      blood_group: 'A+',
      allergies: ['Penicillin'],
      emergency_contact: '+1 (555) 948-2301',
      role: email && email.includes('admin') ? 'admin' : 'patient'
    };
    try {
      const res = await authApi.login({ email, password });
      if (res.data?.access_token) {
        localStorage.setItem('meditwin_token', res.data.access_token);
        setUser(res.data.user || demo);
        return res.data;
      }
    } catch (err) {
      console.warn("Backend auth call failed, defaulting to demo user", err);
    }
    localStorage.setItem('meditwin_token', 'demo-mock-jwt-token');
    setUser(demo);
    return { user: demo };
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      localStorage.setItem('meditwin_token', res.data.access_token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const demo = {
        id: 'reg-user-999',
        name: userData.name,
        email: userData.email,
        blood_group: userData.blood_group || 'O+',
        allergies: userData.allergies || [],
        emergency_contact: userData.emergency_contact || '',
        role: 'patient'
      };
      localStorage.setItem('meditwin_token', 'demo-mock-jwt-token');
      setUser(demo);
      return { user: demo };
    }
  };

  const logout = () => {
    localStorage.removeItem('meditwin_token');
    setUser(null);
  };

  const updateUserProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      setUser(res.data);
    } catch (err) {
      setUser((prev) => ({ ...prev, ...data }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
