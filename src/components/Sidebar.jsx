import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Clock, 
  FileCheck, 
  LayoutDashboard, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo" style={{ flexDirection: 'column', padding: '32px 16px', borderBottom: '1px solid rgba(249, 186, 161, 0.4)' }}>
        <img 
          src="/ap_police_logo.png" 
          alt="AP Police Logo" 
          style={{ width: '80px', height: 'auto', marginBottom: '12px' }} 
          onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }}
        />
        <span style={{ fontSize: '1.1rem', textAlign: 'center', color: '#1F100F' }}>
          {t('app_name')}
        </span>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        <NavLink to="/home" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          {t('sidebar_home')}
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <MessageSquare size={20} />
          {t('sidebar_chat')}
        </NavLink>
        <NavLink to="/form" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          {t('sidebar_form')}
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Clock size={20} />
          {t('sidebar_history')}
        </NavLink>
        <NavLink to="/fir" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileCheck size={20} />
          {t('sidebar_fir')}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          {t('sidebar_settings')}
        </NavLink>
      </nav>
    </aside>
  );
}
