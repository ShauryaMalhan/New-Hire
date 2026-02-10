import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RequiredTrainings from './pages/RequiredTrainings';
import UserProfile from './pages/UserProfile'; // <--- Import this

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Dashboard (Home) */}
        <Route index element={<Dashboard />} />
        
        {/* Trainings Page */}
        <Route path="learning" element={<RequiredTrainings />} />
        
        {/* NEW: Profile Page */}
        <Route path="profile" element={<UserProfile />} />
        
        {/* Placeholder */}
        <Route path="setup" element={<div className="p-10">Setup Guides Coming Soon...</div>} />
      </Route>
    </Routes>
  );
}

export default App;