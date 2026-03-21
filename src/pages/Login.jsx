import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed Check credentials.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Google Server Login Processing Failed');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Complaint Portal</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginBottom: '24px' }}>Sign in to continue</p>
        
        {error && <div style={{ color: 'white', backgroundColor: 'var(--color-status-red)', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
            Login
          </button>
        </form>

        <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--color-text-light)', position: 'relative' }}>
          <div style={{ borderBottom: '1px solid #E5E7EB', position: 'absolute', width: '100%', top: '50%', zIndex: 1 }}></div>
          <span style={{ backgroundColor: 'white', padding: '0 10px', position: 'relative', zIndex: 2 }}>OR</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Authentication Failed')}
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-text-light)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
