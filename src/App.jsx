import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Chat from './pages/Chat';
import Form from './pages/Form';
import History from './pages/History';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import FIRViewer from './pages/FIRViewer';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import AdminComplaints from './pages/AdminComplaints';
import AdminUsers from './pages/AdminUsers';

function App() {
  // Using a fallback client ID so UI renders locally without crashing, though auth will fail verification
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "26026387140-pimmbf2brff7vvhg6ag3cc4strl0qi9f.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Portal Routes utilizing Restricted Admin Layout Wrapper */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Admin />} />
                <Route path="complaints" element={<AdminComplaints />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>

            {/* Protected Routes utilizing Layout Wrapper */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="chat" element={<Chat />} />
                <Route path="form" element={<Form />} />
                <Route path="history" element={<History />} />
                <Route path="fir" element={<FIRViewer />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Default Catch */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
