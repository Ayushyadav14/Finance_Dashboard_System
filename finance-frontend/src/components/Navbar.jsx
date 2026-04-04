import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, LogOut, TrendingUp } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="nav-container">
            <div className="nav-content">
                <div className="nav-brand-section">
                    <div className="nav-brand">
                        <TrendingUp size={24} className="text-primary" />
                        <span className="brand-text">Finance Insight</span>
                    </div>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                    </span>
                </div>

                <div className="nav-center-identity">
                    <div className="user-email-badge">
                        <span className="online-indicator"></span>
                        <span className="email-text">{user.email || user.name}</span>
                    </div>
                </div>

                <div className="nav-actions">
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            <LayoutDashboard size={18} />
                            <span>Insight</span>
                        </Link>
                        <Link to="/records" className="nav-link">
                            <ReceiptText size={18} />
                            <span>Records</span>
                        </Link>
                    </div>
                    <button onClick={handleLogout} className="logout-btn-simple">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
