import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function History() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/complaints`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setComplaints(data);
          if (data.length > 0) {
            setSelectedId(data[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load generic complaint history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'resolved': return { text: 'Resolved', color: 'green' };
      case 'in_progress': return { text: 'In Progress', color: 'blue' };
      default: return { text: 'Pending', color: 'yellow' }; 
    }
  };

  const selectedComplaint = complaints.find(c => c._id === selectedId);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Complaint History...</div>;

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      {/* Left List Pane */}
      <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ marginBottom: '10px' }}>{t('history_title')}</h2>
        {complaints.length === 0 && (
          <p style={{ color: 'var(--color-text-light)' }}>You have no filed complaints.</p>
        )}
        {complaints.map(c => {
          const statusInfo = getStatusInfo(c.status);
          const shortId = "FIR-" + c._id.substring(c._id.length - 6).toUpperCase();
          return (
            <div 
              key={c._id} 
              onClick={() => setSelectedId(c._id)}
              style={{ 
                padding: '16px', borderRadius: '12px', cursor: 'pointer',
                backgroundColor: 'var(--color-bg-card)', 
                border: selectedId === c._id ? '2px solid var(--color-primary)' : '1px solid #E5E7EB',
                boxShadow: selectedId === c._id ? '0 4px 6px rgba(34,197,94,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{shortId}</span>
                <span className={`status-badge ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.type}</span>
                <span>{new Date(c.date).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Details Pane */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedComplaint ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Case Details</h2>
              <span className={`status-badge ${getStatusInfo(selectedComplaint.status).color}`}>
                {getStatusInfo(selectedComplaint.status).text}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>{t('form_incident_type')}</p>
                <p style={{ fontWeight: '500' }}>{selectedComplaint.type}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>{t('form_date')}</p>
                <p style={{ fontWeight: '500' }}>{new Date(selectedComplaint.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>{t('form_location')}</p>
                <p style={{ fontWeight: '500' }}>{selectedComplaint.address}</p>
              </div>
              <div>
                 <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>{t('form_suspect')}</p>
                 <p style={{ fontWeight: '500' }}>{selectedComplaint.suspect || 'None Disclosed'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>{t('form_description')}</p>
                <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  {selectedComplaint.description}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ margin: 'auto', color: 'var(--color-text-light)' }}>
            Select a complaint to view details
          </div>
        )}
      </div>
    </div>
  );
}
