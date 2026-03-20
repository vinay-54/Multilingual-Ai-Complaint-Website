import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg-main)' }}>
        <p style={{ color: 'var(--color-text-dark)', fontSize: '1.2rem' }}>Authenticating Access...</p>
      </div>
    );
  }

  // Strictly enforce role-based access
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />;
}
