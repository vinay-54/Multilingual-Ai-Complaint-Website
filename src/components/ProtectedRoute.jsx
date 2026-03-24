import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader message="Loading Authentication..." />;
  }

  // If user is absent, forcibly redirect to the /login page, preserving intended routing logic securely.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
