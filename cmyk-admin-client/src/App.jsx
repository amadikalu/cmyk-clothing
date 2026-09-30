import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
// Import your Login component here (assuming it exists as Login.jsx)
// import Login from './Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        {/* Redirect root to dashboard for the admin client */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
