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
                <div className="nav-brand">
                    <TrendingUp className="text-primary-400" size={24} />
                    <span className="brand-text">FinanceDash</span>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/records" className="nav-link">
                        <ReceiptText size={18} />
                        <span>Records</span>
                    </Link>
                </div>

                <div className="nav-center">
                    <div className="current-user-badge">
                        <span className="user-dot"></span>
                        <span className="user-identity">{user.email || user.name}</span>
                    </div>
                </div>

                <div className="nav-user">
                    <div className="user-info">
                        <p className="user-name">{user.name}</p>
                        <p className="user-role">{user.role}</p>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
