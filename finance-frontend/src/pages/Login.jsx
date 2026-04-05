import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await axiosInstance.post('/api/auth/login', { email, password });
        const { token, role, userId } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        navigate('/dashboard');
      } else {
        const res = await axiosInstance.post('/api/auth/register', { name, email, password });
        const { token, role, userId } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  const btnStyle = {
    padding: '0.75rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    textAlign: 'center',
    opacity: loading ? 0.7 : 1
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', margin: '0 0 1rem 0' }}>
          {isLogin ? 'Login to Dashboard' : 'Create an Account'}
        </h2>
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {!isLogin && (
          <input 
            style={inputStyle}
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        )}
        
        <input 
          style={inputStyle}
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <input 
          style={inputStyle}
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <div style={btnStyle} onClick={!loading ? handleSubmit : undefined}>
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </div>
        
        <div 
          style={{ textAlign: 'center', color: '#1976d2', cursor: 'pointer', marginTop: '1rem' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </div>
      </div>
    </div>
  );
};

export default Login;
