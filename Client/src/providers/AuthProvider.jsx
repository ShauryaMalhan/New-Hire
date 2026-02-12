import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import * as authService from '../services/authApi';
import apiClient from '../services/apiClient';

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Initialize State from Session Storage (Fixes Refresh Issue)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      // If we found a user, immediately set the Axios header
      if (parsedUser && parsedUser.token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }

      return parsedUser;
    } catch (error) {
      console.error("Failed to parse session user", error);
      return null;
    }
  });

  // 2. Login Action
  const login = async (email, password) => {
    try {
      // Call your API service
      const data = await authService.login({ email, password });
      
      // A. Save to React State & Session Storage
      setUser(data);
      sessionStorage.setItem('user', JSON.stringify(data));
      
      // B. Inject Token into Axios Defaults
      if (data.token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      // C. Redirect to Dashboard
      navigate('/');
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Pass error to UI
    }
  };

  // 3. Logout Action
  const logout = () => {
    // A. Clear User State & Storage
    setUser(null);
    sessionStorage.removeItem('user');
    
    // B. Remove Token from Axios
    delete apiClient.defaults.headers.common['Authorization'];
    
    // C. Redirect to Login
    navigate('/login');
  };

  // 4. Sync Logout across Tabs (Optional but recommended)
  // If the user logs out in another tab, this tab will also log out.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user' && !event.newValue) {
        logout();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;