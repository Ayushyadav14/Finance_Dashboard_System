import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await axiosInstance.get('/api/dashboard/summary');
                setSummary(data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError('Access Denied: Analyst or Admin role required.');
                } else {
                    setError('Failed to fetch dashboard data.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (user?.role !== 'VIEWER') {
            fetchSummary();
        } else {
            setLoading(false);
            setError('Dashboard summary is only accessible by Analysts and Admins.');
        }
    }, [user?.role]);

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    if (error) {
        return (
            <div className="error-container">
                <AlertTriangle size={48} className="text-warning mb-4" />
                <h2 className="text-2xl font-600 mb-2">Insufficient Permissions</h2>
                <p className="text-gray-muted text-center max-w-md">{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page page-container animate-fade-in">
            <header className="page-header">
                <div className="header-content">
                    <h1>Executive Overview</h1>
                    <p className="subtitle">Real-time financial performance and analytics</p>
                </div>
                <div className="header-badge bg-primary-soft text-primary-dark">
                    <Clock size={16} /> <span>Updated just now</span>
                </div>
            </header>

            <section className="stats-grid grid-3">
                <div className="stat-card glassmorphism hover-lift">
                    <div className="stat-icon bg-success-soft text-success"><TrendingUp size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Total Income</p>
                        <h2 className="stat-value text-success">${summary.totalIncome.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="stat-card glassmorphism hover-lift">
                    <div className="stat-icon bg-error-soft text-error"><TrendingDown size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Total Expenses</p>
                        <h2 className="stat-value text-error">${summary.totalExpenses.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="stat-card glassmorphism hover-lift highlight">
                    <div className="stat-icon bg-primary-soft text-primary"><DollarSign size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Net Balance</p>
                        <h2 className="stat-value text-primary">${summary.netBalance.toLocaleString()}</h2>
                    </div>
                </div>
            </section>

            <div className="dashboard-content-grid grid-2">
                <section className="content-section glassmorphism">
                    <div className="section-header">
                        <PieChart size={20} className="text-primary" />
                        <h2>Category Distribution</h2>
                    </div>
                    <div className="category-list">
                        {summary.byCategory.map((cat, i) => (
                            <div key={i} className="category-item">
                                <div className="category-info">
                                    <span className="category-name">{cat.category || 'Uncategorized'}</span>
                                    <span className="category-percentage">
                                        {((cat.total / summary.totalIncome) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill bg-gradient-primary"
                                        style={{ width: `${Math.min(100, (cat.total / summary.totalIncome) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="category-amount">${cat.total.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="content-section glassmorphism">
                    <div className="section-header">
                        <div className="tab-title active">Recently Recorded Transactions</div>
                    </div>
                    <div className="recent-list">
                        {summary.recentRecords.map((record) => (
                            <div key={record.id} className="record-item-small">
                                <div className={`type-dot ${record.type}`}></div>
                                <div className="record-main-info">
                                    <p className="record-category-small">{record.category}</p>
                                    <p className="record-date-small">{record.date}</p>
                                </div>
                                <p className={`record-amount-small ${record.type === 'income' ? 'text-success' : 'text-error'}`}>
                                    {record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
