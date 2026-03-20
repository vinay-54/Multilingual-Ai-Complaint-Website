import React, { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Citizens Data...</div>;

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Manage Citizens</h2>
      <div className="card" style={{ overflowX: 'auto', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email Address</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  No registered citizens found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {user.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-light)' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                      backgroundColor: '#E1EFFE', color: '#1E429F', textTransform: 'capitalize' 
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
