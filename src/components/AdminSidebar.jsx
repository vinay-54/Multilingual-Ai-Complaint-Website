import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, LayoutDashboard, Users, AlertCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminSidebar() {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo" style={{ flexDirection: 'column', padding: '32px 16px', borderBottom: '1px solid #E5E7EB' }}>
        <img 
          src="/ap_police_logo.png" 
          alt="AP Police Logo" 
          style={{ width: '80px', height: 'auto', marginBottom: '12px' }} 
          onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }}
        />
        <span style={{ fontSize: '1.1rem', textAlign: 'center', color: 'var(--color-text-dark)', fontWeight: '600' }}>
          Admin Portal
        </span>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
            <NavLink to="/admin" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <LayoutDashboard size={20} />
              Overview
            </NavLink>
          </li>
          <li style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
            <NavLink to="/admin/complaints" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={20} />
              Manage Complaints
            </NavLink>
          </li>
          <li style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
            <NavLink to="/admin/users" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              Manage Citizens
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB' }}>
        <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.target.style.background = '#EF4444'; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; e.target.style.color = '#EF4444'; }}
        >
          <LogOut size={18} /> Exit Admin
        </button>
      </div>
    </aside>
  );
}
