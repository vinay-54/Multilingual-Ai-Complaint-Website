import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token on initial app load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin-login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
  };

  const googleLogin = async (token) => {
    // Send the Google credential token securely to backend for verification
    const res = await api.post('/auth/google', { token });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updatePicture = async (base64Image) => {
    try {
      const res = await api.put('/auth/profile/picture', { picture: base64Image });
      setUser(prev => ({ ...prev, picture: res.data.picture }));
      return res.data;
    } catch (error) {
      console.error("Failed to update picture:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, adminLogin, register, googleLogin, logout, updatePicture, loading }}>
        {children}
    </AuthContext.Provider>
  );
};
