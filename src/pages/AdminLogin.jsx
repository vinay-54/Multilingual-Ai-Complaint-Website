import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied. Administrator privileges required.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', margin: '0 20px', padding: '40px' }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)' }}>
            <ShieldCheck size={56} strokeWidth={1.5} />
          </div>
          <h2 style={{ color: 'var(--color-text-dark)', marginBottom: '8px', fontSize: '1.75rem', fontWeight: '700' }}>Admin Portal</h2>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>Secure access for Police Administrators</p>
        </div>

        {error && <div style={{ backgroundColor: 'white', color: 'var(--color-status-red)', border: '1px solid var(--color-status-red)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--color-text-dark)', fontSize: '0.9rem', fontWeight: '500' }}>Official Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '12px', color: 'var(--color-text-light)' }}><Mail size={18} /></div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@police.gov.in"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--color-text-dark)', fontSize: '0.9rem', fontWeight: '500' }}>Secure Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '12px', color: 'var(--color-text-light)' }}><Lock size={18} /></div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <button type="submit" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
          >
            Authorize Login
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            Are you a citizen? <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', marginLeft: '5px' }}>Return to Portal</a>
          </p>
        </div>
      </div>
    </div>
  );
}
