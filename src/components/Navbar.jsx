import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import Dropdown from './Dropdown';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [imgError, setImgError] = React.useState(false);

  const langOptions = [
    { value: 'en', label: t('eng_label') },
    { value: 'hi', label: t('hin_label') },
    { value: 'te', label: t('tel_label') }
  ];

  // Reset image error state when user changes
  React.useEffect(() => {
    if (user?.picture) {
      setImgError(false);
    }
  }, [user?.picture]);

  return (
    <header className="dashboard-navbar">
      <div className="navbar-brand">
      </div>
      
      <div className="navbar-actions">
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dropdown 
            variant="language" 
            value={i18n.language} 
            options={langOptions} 
            onChange={(val) => i18n.changeLanguage(val)} 
          />
        </div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '1rem', borderLeft: '1px solid #E5E7EB' }}>
          {user?.picture && !imgError ? (
            <img 
              src={user.picture} 
              alt="Profile" 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '1rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-status-red)', cursor: 'pointer', fontWeight: '500' }} onClick={logout}>
              {t('logout')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
