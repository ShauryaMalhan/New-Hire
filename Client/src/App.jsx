import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RequiredTrainings from './pages/RequiredTrainings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        {/* Placeholder pages for the other tabs */}
        <Route path="setup" element={<div className="p-10">Setup Guides Page</div>} />
        <Route path="learning" element={<RequiredTrainings />} />
        <Route path="learning" element={<div className="p-10">Learning Path Page</div>} />
      </Route>
    </Routes>
  );
}

export default App;