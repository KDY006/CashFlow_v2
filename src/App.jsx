import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import GlobalAddModal from './components/GlobalAddModal';
import ToastContainer from './components/ToastContainer';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Calendar from './pages/Calendar';
import AIAdvisor from './pages/AIAdvisor';
import Profile from './pages/Profile';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SetupPassword from './pages/SetupPassword';

// Layout wrapper for authenticated pages
function AppLayout() {
  const { currentUser } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.is_first_login === 1 && location.pathname !== '/setup-password') {
    return <Navigate to="/setup-password" replace />;
  }

  return (
    <>
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />
      
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/ai" element={<AIAdvisor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <MobileNav onOpenAddModal={() => setIsAddModalOpen(true)} />
      
      <GlobalAddModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <ToastContainer />
    </>
  );
}

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/setup-password" element={<SetupPassword />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />

      {/* Authenticated Dashboard Pages */}
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}
