import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const syncCurrentAuth = async () => {
    try {
      const res = await axiosInstance.get('/api/auth/me');
      const { token, role, userId } = res.data;
      const oldRole = localStorage.getItem('role');
      
      if (oldRole && oldRole !== role) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        window.location.reload();
      }
    } catch (err) {
      console.warn('/auth/me sync ignored. Please restart backend.');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axiosInstance.patch(`/api/users/${id}/role`, { role: newRole });
      await syncCurrentAuth();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update role');
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      await axiosInstance.patch(`/api/users/${id}/status`, { isActive });
      await syncCurrentAuth();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  const getRoleBadgeStyle = (role) => {
    let bg = '#eee';
    let color = '#333';
    
    if (role === 'ADMIN') { bg = '#f3e5f5'; color = '#8e24aa'; }
    if (role === 'ANALYST') { bg = '#e3f2fd'; color = '#1976d2'; }
    if (role === 'VIEWER') { bg = '#f5f5f5'; color = '#616161'; }
    
    return {
      backgroundColor: bg,
      color: color,
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 'bold'
    };
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>User Management</h2>
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading users...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: user.isActive ? '#2e7d32' : '#c62828',
                          fontWeight: 'bold'
                        }}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {user.email === 'admin@gmail.com' ? (
                          <span style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9rem' }}>Protected</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <select 
                              value={user.role} 
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                              <option value="VIEWER">VIEWER</option>
                              <option value="ANALYST">ANALYST</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                            
                            <div 
                              onClick={() => handleStatusChange(user.id, !user.isActive)}
                              style={{ 
                                cursor: 'pointer', 
                                color: user.isActive ? '#c62828' : '#2e7d32',
                                textDecoration: 'underline',
                                fontSize: '0.9rem'
                              }}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
