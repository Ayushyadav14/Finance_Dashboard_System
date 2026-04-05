import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  };

  const getLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#1976d2' : '#333',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
  });

  return (
    <div style={navStyle}>
      <div style={linkContainerStyle}>
        <h2 style={{ margin: 0, color: '#1976d2' }}>Finance Dashboard</h2>
        <Link style={getLinkStyle('/dashboard')} to="/dashboard">Dashboard</Link>
        <Link style={getLinkStyle('/records')} to="/records">Records</Link>
        {role === 'ADMIN' && (
          <Link style={getLinkStyle('/users')} to="/users">Users</Link>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.85rem' }}>
          {userEmail && <span style={{ color: '#666', marginBottom: '0.2rem' }}>{userEmail}</span>}
          <span style={{ color: '#666' }}>Role: <strong>{role}</strong></span>
        </div>
        <div 
          onClick={handleLogout}
          style={{
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            backgroundColor: '#c62828',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Navbar;
