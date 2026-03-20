import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MessageSquare, LineChart, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* Hero Section */}
      <div className="card" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(249, 186, 161, 0.3) 0%, rgba(254, 250, 248, 0.8) 100%)',
        border: '1px solid rgba(249, 186, 161, 0.6)'
      }}>
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--color-primary-light)', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--color-primary)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }}></div>

        <img 
          src="/ap_police_logo.png" 
          alt="AP Police Logo" 
          style={{ width: '120px', height: 'auto', marginBottom: '24px', zIndex: 1 }} 
          onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }} 
        />
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '16px', maxWidth: '800px', zIndex: 1, lineHeight: '1.2' }}>
          AI-Powered Multilingual Complaint Portal
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', maxWidth: '600px', marginBottom: '32px', zIndex: 1 }}>
          A unified, transparent, and intelligent platform designed to bridge the gap between citizens and law enforcement through seamless multilingual reporting.
        </p>

        <div style={{ display: 'flex', gap: '16px', zIndex: 1 }}>
          <button 
            onClick={() => navigate('/form')}
            style={{ 
              padding: '14px 28px', backgroundColor: 'var(--color-primary)', color: 'white', 
              border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 14px rgba(245, 43, 9, 0.3)', transition: 'transform 0.2s, background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          >
            <FileText size={20} /> File Complaint
          </button>
          <button 
            onClick={() => navigate('/history')}
            style={{ 
              padding: '14px 28px', backgroundColor: 'white', color: 'var(--color-text-dark)', 
              border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Track Status <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Key Features Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', paddingLeft: '8px' }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 96, 8, 0.1)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Smart AI Chatbot</h3>
            <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Report incidents naturally in your native language. Our AI automatically extracts key details to structure formal complaints instantly.</p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 96, 8, 0.1)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Instant FIR Generation</h3>
            <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Verified complaints are instantly formatted into official printable FIR documents, ensuring legal standards are met rapidly.</p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 96, 8, 0.1)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LineChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Real-time Tracking</h3>
            <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Citizens receive live updates on their cases while administrative dashbards provide police with powerful trend analytics.</p>
          </div>

        </div>
      </div>

      {/* Beneficiaries Section */}
      <div className="card" style={{ padding: '40px', background: 'rgba(255, 255, 255, 0.6)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Who Benefits?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Citizens</h4>
            <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>Accessible 24/7 reporting without language barriers and completely transparent case tracking.</p>
          </div>
          <div style={{ borderLeft: '1px solid rgba(249, 186, 161, 0.4)', borderRight: '1px solid rgba(249, 186, 161, 0.4)', padding: '0 16px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Police Authorities</h4>
            <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>Receive pre-structured, verified data instead of raw accounts, accelerating response times.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Administrators</h4>
            <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>Access to high-level system analytics to monitor regional crime trends and optimize resource allocation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
