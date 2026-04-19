import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';

import ChatView from './views/ChatView';
import TrendingPanel from './views/TrendingPanel';
import AnalyticsView from './views/AnalyticsView';
import HistoryPanel from './views/HistoryPanel';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

// Root Redirector
const RootRedirect = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ChatView />} />
        <Route path="trending" element={<TrendingPanel />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="history" element={<HistoryPanel />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import { NewsProvider } from './context/NewsContext';

const App = () => {
  return (
    <AuthProvider>
      <NewsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NewsProvider>
    </AuthProvider>
  );
};

export default App;
