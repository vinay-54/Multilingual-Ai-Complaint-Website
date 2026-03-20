import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading Authentication...
      </div>
    );
  }

  // If user is absent, forcibly redirect to the /login page, preserving intended routing logic securely.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
