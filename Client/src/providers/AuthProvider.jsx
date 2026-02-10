import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import * as authService from '../services/authApi';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Initialize Auth State
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
        localStorage.removeItem('user'); // Clear corrupted data
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. Login Action
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      navigate('/');
      return { success: true };
    } catch (error) {
      throw error; // Let the Login component handle the UI error
    }
  };

  // 3. Logout Action
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;