import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import ChatLayout from './pages/ChatLayout';
import RequiredTrainings from './pages/RequiredTrainings';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import SetupGuides from './pages/SetupGuides';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ask" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><RequiredTrainings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/setup" element={<ProtectedRoute><SetupGuides /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

// THIS IS THE LINE YOU ARE MISSING:
export default App;