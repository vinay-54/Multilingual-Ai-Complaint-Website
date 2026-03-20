import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading Dashboard Metrics...</div>;
  }

  const { totalComplaints = 0, resolutionRate = 0, activeInvestigations = 0, categoryDistribution = [] } = stats || {};

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>{t('admin_dashboard_title')}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', margin: 0 }}>Total Complaints</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0 0' }}>{totalComplaints}</p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', margin: 0 }}>Resolution Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0 0', color: 'var(--color-primary)' }}>{resolutionRate}%</p>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-light)', margin: 0 }}>Active Investigations</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0 0', color: '#3B82F6' }}>{activeInvestigations}</p>
        </div>
      </div>

      <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '20px' }}>Complaint Type Distribution</h3>
        <div style={{ flex: 1, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryDistribution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-light)'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-light)'}} />
              <Tooltip 
                cursor={{fill: '#F3F4F6'}} 
                contentStyle={{ backgroundColor: 'white', borderColor: '#E5E7EB', color: 'var(--color-text-dark)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-primary)' }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
