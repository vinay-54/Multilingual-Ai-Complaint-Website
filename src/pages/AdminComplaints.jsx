import React, { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];

  // Fetch all complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        // Update local state to reflect change
        setComplaints(prev => prev.map(c => 
          c._id === id ? { ...c, status: newStatus } : c
        ));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Complaints...</div>;

  return (
    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <h2 style={{ marginBottom: '1.5rem', flexShrink: 0 }}>Manage Complaints</h2>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, minHeight: 0 }}>
        <div style={{ overflowY: 'auto', overflowX: 'auto', flex: 1, padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>User</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Location</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  No complaints found in the database.
                </td>
              </tr>
            ) : (
              complaints.map(complaint => (
                <tr key={complaint._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px' }}>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{complaint.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '12px 16px' }}>{complaint.type}</td>
                  <td style={{ padding: '12px 16px' }}>
                     <span style={{ display: 'block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {complaint.address}
                     </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Dropdown 
                      variant="status" 
                      value={complaint.status} 
                      options={statusOptions} 
                      onChange={(val) => handleStatusChange(complaint._id, val)} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
