import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

export default function AdminRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader message="Authenticating Access..." />;
  }

  // Strictly enforce role-based access
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/home" replace />;
}
