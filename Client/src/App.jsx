import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RequiredTrainings from './pages/RequiredTrainings';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login'; // <--- Import Login
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute'; // <--- Import Guard

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Everything inside MainLayout) */}
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