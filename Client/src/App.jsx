import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RequiredTrainings from './pages/RequiredTrainings';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="learning" element={<RequiredTrainings />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="setup" element={<div className="p-10">Setup Guides...</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;