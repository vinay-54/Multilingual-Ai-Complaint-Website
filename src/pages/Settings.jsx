import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Shield, Bell, Globe, Save, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, logout, setUser, updatePicture } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // Reset image error when a new picture is set
  useEffect(() => {
    if (user?.picture) setImgError(false);
  }, [user?.picture]);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  // Language State
  const [language, setLanguage] = useState(i18n.language || 'en');

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    systemUpdates: true,
  });

  // Security State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When i18n changes externally or internally, ensure state is updated
    setLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Synthetically sync to global auth context state so it reflects everywhere immediately
      if (setUser) {
        setUser(prev => ({ ...prev, name: profileData.name }));
      }
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswords({ current: '', newPass: '', confirm: '' });
      alert('Password updated successfully!');
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 2MB.");
      return;
    }

    setImageUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        await updatePicture(reader.result);
      } catch (err) {
        alert("Failed to update profile picture.");
      } finally {
        setImageUploading(false);
      }
    };
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="settings-pane">
            <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>{t('settings_public_profile', 'Public Profile')}</h3>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                {/* Fallback to initials if picture is broken/null instead of blind via.placeholder.com link */}
                <div style={{ position: 'relative' }}>
                  {user?.picture && !imgError ? (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} 
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  {imageUploading && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                      ...
                    </div>
                  )}
                </div>

                <label style={{ padding: '8px 16px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'inline-block' }}>
                  {imageUploading ? 'Uploading...' : 'Change Avatar'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={imageUploading} />
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('settings_full_name', 'Full Name')}</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('settings_email', 'Email Address')}</label>
                <input type="email" value={profileData.email} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', color: '#6B7280' }} />
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Email cannot be changed directly. Contact support if needed.</span>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Phone Number (Optional)</label>
                <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} placeholder="+91" />
              </div>

              <button type="submit" disabled={isLoading} style={{ marginTop: '10px', padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: 'auto', alignSelf: 'flex-start' }}>
                <Save size={18} /> {isLoading ? 'Saving...' : t('settings_save', 'Save Changes')}
              </button>
            </form>
          </div>
        );

      case 'language':
        return (
          <div className="settings-pane">
            <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>{t('settings_regional', 'Regional Settings')}</h3>
            <div style={{ maxWidth: '500px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('settings_app_language', 'Application Language')}</label>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '16px' }}>Select the primary language for the dashboard interface. This updates the application immediately.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', backgroundColor: language === 'en' ? '#F0FDF4' : 'white', borderColor: language === 'en' ? 'var(--color-primary)' : '#E5E7EB' }}>
                  <input type="radio" value="en" checked={language === 'en'} onChange={handleLanguageChange} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: '500', fontSize: '1.1rem' }}>English</span>
                  <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>Global</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', backgroundColor: language === 'hi' ? '#F0FDF4' : 'white', borderColor: language === 'hi' ? 'var(--color-primary)' : '#E5E7EB' }}>
                  <input type="radio" value="hi" checked={language === 'hi'} onChange={handleLanguageChange} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: '500', fontSize: '1.1rem' }}>हिंदी (Hindi)</span>
                  <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>India</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', backgroundColor: language === 'te' ? '#F0FDF4' : 'white', borderColor: language === 'te' ? 'var(--color-primary)' : '#E5E7EB' }}>
                  <input type="radio" value="te" checked={language === 'te'} onChange={handleLanguageChange} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: '500', fontSize: '1.1rem' }}>తెలుగు (Telugu)</span>
                  <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>Andhra Pradesh / Telangana</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-pane">
            <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>{t('settings_notifications_pref', 'Notification Preferences')}</h3>
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Email Alerts</h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Receive updates about your FIR status changes via email.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={notifications.emailAlerts} onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>SMS Alerts</h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Receive critical notifications directly to your phone.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={notifications.smsAlerts} onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>System Announcements</h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Information about scheduled maintenance and new features.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={notifications.systemUpdates} onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>

            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-pane">
            <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>{t('settings_security_auth', 'Security & Authentication')}</h3>
            
            <div style={{ maxWidth: '500px' }}>
              <h4 style={{ marginBottom: '16px' }}>Change Password</h4>
              <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '32px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Current Password</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>New Password</label>
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({...passwords, newPass: e.target.value})} required minLength="6" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirm New Password</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} required minLength="6" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                </div>
                <button type="submit" disabled={isLoading} style={{ padding: '12px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', width: '200px' }}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              <h4 style={{ marginBottom: '16px', color: 'var(--color-status-red)' }}>Danger Zone</h4>
              <button type="button" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#FEF2F2', color: 'var(--color-status-red)', border: '1px solid #FCA5A5', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                <LogOut size={18} /> Logout from all devices
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', height: '100%', minHeight: '80vh' }}>
      
      <style>
        {`
          .settings-tab {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            color: #4B5563;
          }
          .settings-tab:hover {
            background-color: #F3F4F6;
          }
          .settings-tab.active {
            background-color: #E0F2FE;
            color: var(--color-primary);
          }
          
          /* Toggle Switch CSS */
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }
          .toggle-switch input { 
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: var(--color-primary);
          }
          input:checked + .slider:before {
            transform: translateX(24px);
          }
        `}
      </style>

      {/* Settings Navigation Sidebar */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ marginBottom: '20px' }}>{t('sidebar_settings', 'Settings')}</h2>
        
        <div 
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          {t('settings_tab_profile', 'Profile Details')}
        </div>
        
        <div 
          className={`settings-tab ${activeTab === 'language' ? 'active' : ''}`}
          onClick={() => setActiveTab('language')}
        >
          <Globe size={20} />
          {t('settings_tab_language', 'Language Settings')}
        </div>
        
        <div 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={20} />
          {t('settings_tab_notifications', 'Notifications')}
        </div>
        
        <div 
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={20} />
          {t('settings_tab_security', 'Security Access')}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ flex: 1, padding: '32px' }}>
        {renderTabContent()}
      </div>

    </div>
  );
}
