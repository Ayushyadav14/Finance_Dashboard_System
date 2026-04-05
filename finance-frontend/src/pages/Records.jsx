import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const Records = () => {
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Modal/Form state
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Form fields
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('INCOME');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterCategory) params.append('category', filterCategory);
      if (filterStartDate) params.append('startDate', filterStartDate);
      if (filterEndDate) params.append('endDate', filterEndDate);

      const res = await axiosInstance.get(`/api/records?${params.toString()}`);
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchRecords();
  };

  const handleClearFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    // Trigger fresh fetch
    setTimeout(() => {
      axiosInstance.get(`/api/records`)
        .then(res => setRecords(res.data))
        .catch(err => setError('Failed to fetch records'));
    }, 0);
  };

  const handleOpenForm = (record = null) => {
    setFormError('');
    if (record) {
      setEditingId(record.id);
      setAmount(record.amount);
      setType(record.type);
      setCategory(record.category);
      setDate(new Date(record.date).toISOString().split('T')[0]);
      setNotes(record.notes || '');
    } else {
      setEditingId(null);
      setAmount('');
      setType('INCOME');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setShowForm(true);
  };

  const handleSaveRecord = async () => {
    setFormError('');
    if (!amount || !type || !category || !date) {
      setFormError('Amount, Type, Category, and Date are required');
      return;
    }

    const payload = {
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/api/records/${editingId}`, payload);
      } else {
        await axiosInstance.post('/api/records', payload);
      }
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save record');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axiosInstance.delete(`/api/records/${id}`);
        fetchRecords();
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete record');
      }
    }
  };

  const containerStyle = { padding: '2rem', maxWidth: '1200px', margin: '0 auto' };
  
  const filterBarStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };

  const btnStyle = (bg, customConfig = {}) => ({
    padding: '0.5rem 1rem',
    backgroundColor: bg,
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'center',
    ...customConfig
  });

  const formModalStyle = {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Financial Records</h2>
          {isAdmin && !showForm && (
            <div style={btnStyle('#1976d2')} onClick={() => handleOpenForm()}>+ Add Record</div>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {showForm && (
          <div style={formModalStyle}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Record' : 'Add New Record'}</h3>
            {formError && <div style={{ color: '#c62828', fontSize: '0.9rem' }}>{formError}</div>}
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Amount</label>
                <input style={inputStyle} type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Type</label>
                <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Category</label>
                <input style={inputStyle} type="text" placeholder="Salary, Rent, Food..." value={category} onChange={e => setCategory(e.target.value)} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Date</label>
                <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Notes</label>
              <input style={inputStyle} type="text" placeholder="Optional notes" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <div style={btnStyle('#666')} onClick={() => setShowForm(false)}>Cancel</div>
              <div style={btnStyle('#2e7d32')} onClick={handleSaveRecord}>Save</div>
            </div>
          </div>
        )}

        <div style={filterBarStyle}>
          <select style={inputStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          
          <input 
            style={inputStyle} 
            type="text" 
            placeholder="Filter by category" 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)} 
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>From:</span>
            <input style={inputStyle} type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>To:</span>
            <input style={inputStyle} type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
          </div>

          <div style={btnStyle('#1976d2')} onClick={handleApplyFilters}>Apply Filters</div>
          <div style={btnStyle('#666')} onClick={handleClearFilters}>Clear</div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading records...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem' }}>Notes</th>
                    {isAdmin && <th style={{ padding: '1rem' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{new Date(record.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          backgroundColor: record.type.toLowerCase() === 'income' ? '#e8f5e9' : '#ffebee', 
                          color: record.type.toLowerCase() === 'income' ? '#2e7d32' : '#c62828',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase'
                        }}>
                          {record.type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{record.category}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatCurrency(record.amount)}</td>
                      <td style={{ padding: '1rem', color: '#666' }}>{record.notes || '-'}</td>
                      {isAdmin && (
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div 
                              style={btnStyle('#1976d2', { padding: '0.25rem 0.5rem', fontSize: '0.85rem' })}
                              onClick={() => handleOpenForm(record)}
                            >
                              Edit
                            </div>
                            <div 
                              style={btnStyle('#c62828', { padding: '0.25rem 0.5rem', fontSize: '0.85rem' })}
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              Delete
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr><td colSpan={isAdmin ? "6" : "5"} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No records found matching criteria</td></tr>
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

export default Records;
