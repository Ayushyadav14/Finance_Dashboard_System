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

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const isViewer = role === 'VIEWER';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!isViewer);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isViewer) return;
    
    const fetchSummary = async () => {
      try {
        const res = await axiosInstance.get('/api/dashboard/summary');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [isViewer]);

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  };

  const cardContainerStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  };

  const getCardStyle = (bgColor) => ({
    flex: 1,
    minWidth: '250px',
    padding: '1.5rem',
    borderRadius: '8px',
    backgroundColor: bgColor,
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  });

  const sectionStyle = {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={containerStyle}>
        <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
        
        {isViewer && (
          <div style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #e65100' }}>
            Dashboard access requires Analyst or Admin role.
          </div>
        )}
        
        {loading && <div>Loading dashboard data...</div>}
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        {data && !isViewer && (
          <>
            <div style={cardContainerStyle}>
              <div style={getCardStyle('#2e7d32')}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'normal', fontSize: '1.1rem' }}>Total Income</h3>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{formatCurrency(data.totalIncome)}</h2>
              </div>
              <div style={getCardStyle('#c62828')}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'normal', fontSize: '1.1rem' }}>Total Expenses</h3>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{formatCurrency(data.totalExpense)}</h2>
              </div>
              <div style={getCardStyle('#1976d2')}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'normal', fontSize: '1.1rem' }}>Net Balance</h3>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{formatCurrency(data.netBalance)}</h2>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ ...sectionStyle, flex: 1, minWidth: '300px' }}>
                <h3 style={{ marginTop: 0 }}>Category Breakdown</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Object.entries(data.categoryBreakdown || {}).map(([category, amount]) => (
                    <div key={category} style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '0.5rem 1rem', borderRadius: '16px', fontSize: '0.9rem' }}>
                      {category}: <strong>{formatCurrency(amount)}</strong>
                    </div>
                  ))}
                  {Object.keys(data.categoryBreakdown || {}).length === 0 && (
                    <div style={{ color: '#666' }}>No category data available</div>
                  )}
                </div>
              </div>
              
              <div style={{ ...sectionStyle, flex: 1, minWidth: '300px' }}>
                <h3 style={{ marginTop: 0 }}>Monthly Trend</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Month</th>
                      <th style={{ padding: '0.5rem' }}>Income</th>
                      <th style={{ padding: '0.5rem' }}>Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.monthlyTrend || {}).map(([month, stats]) => (
                      <tr key={month} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.5rem' }}>{month}</td>
                        <td style={{ padding: '0.5rem', color: '#2e7d32' }}>{formatCurrency(stats.income)}</td>
                        <td style={{ padding: '0.5rem', color: '#c62828' }}>{formatCurrency(stats.expense)}</td>
                      </tr>
                    ))}
                    {Object.keys(data.monthlyTrend || {}).length === 0 && (
                      <tr><td colSpan="3" style={{ padding: '0.5rem', color: '#666', textAlign: 'center' }}>No monthly data available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div style={sectionStyle}>
              <h3 style={{ marginTop: 0 }}>Recent Records</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Type</th>
                      <th style={{ padding: '1rem' }}>Category</th>
                      <th style={{ padding: '1rem' }}>Amount</th>
                      <th style={{ padding: '1rem' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentRecords?.map((record) => (
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
                      </tr>
                    ))}
                    {(!data.recentRecords || data.recentRecords.length === 0) && (
                      <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No recent records found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
