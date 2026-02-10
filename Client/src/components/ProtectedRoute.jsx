import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authApi';

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!user) {
    // Not logged in? Go to Login
    return <Navigate to="/login" replace />;
  }

  // Logged in? Show the page
  return children;
};

export default ProtectedRoute;