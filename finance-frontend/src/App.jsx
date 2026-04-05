import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from './api/axiosInstance';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';

const AuthPoller = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Do not poll if the user isn't logged in
    const token = localStorage.getItem('token');
    if (!token || location.pathname === '/login') return;
    
    const interval = setInterval(async () => {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        const { token: newToken, role: newRole, userId } = res.data;
        const oldRole = localStorage.getItem('role');
        
        // If the database has given us a completely new role
        if (oldRole && oldRole !== newRole) {
          localStorage.clear();
          alert('Your role has been modified by an administrator. Please log in again to refresh your permissions.');
          window.location.href = '/login';
        }
      } catch (err) {
        // Only force logout if the backend explicitly confirms the account is deactivated
        const message = err.response?.data?.message || err.response?.data || '';
        if (typeof message === 'string' && message.includes('Account is deactivated')) {
          localStorage.clear();
          alert('Your account has been deactivated by an administrator.');
          window.location.href = '/login';
        }
        // If it's a 404, 500, or Network Error, we IGNORE it completely so we don't cause infinite logouts!
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  return null;
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthPoller />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/records" element={
          <PrivateRoute>
            <Records />
          </PrivateRoute>
        } />
        
        <Route path="/users" element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
