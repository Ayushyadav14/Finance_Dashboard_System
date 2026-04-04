import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Plus, Edit, Trash, Filter, Search, X, Check, Save } from 'lucide-react';

const Records = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [recordForm, setRecordForm] = useState({
        amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], notes: ''
    });
    const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchRecords();
    }, [filters]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.category) params.append('category', filters.category);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const { data } = await axiosInstance.get(`/api/records?${params.toString()}`);
            setRecords(data);
        } catch (err) {
            setError('Failed to fetch records.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setRecordForm({ ...record });
        } else {
            setEditingRecord(null);
            setRecordForm({ amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await axiosInstance.put(`/api/records/${editingRecord.id}`, recordForm);
            } else {
                await axiosInstance.post('/api/records', recordForm);
            }
            setShowModal(false);
            fetchRecords();
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await axiosInstance.delete(`/api/records/${id}`);
            fetchRecords();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    if (loading && records.length === 0) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="records-page page-container animate-fade-in">
            <header className="page-header justify-between">
                <div>
                    <h1>Financial Records</h1>
                    <p className="subtitle">Track and manage all transactions efficiently</p>
                </div>
                {isAdmin && (
                    <button onClick={() => handleOpenModal()} className="btn-primary hover-lift">
                        <Plus size={18} /> <span>New Entry</span>
                    </button>
                )}
            </header>

            <section className="filters-bar glassmorphism mb-8">
                <div className="filter-group">
                    <Filter size={16} className="text-gray-muted" />
                    <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="filter-group">
                    <Search size={16} className="text-gray-muted" />
                    <input
                        type="text"
                        placeholder="Filter category..."
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <span className="text-xs text-gray-muted">From:</span>
                    <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                </div>
                <div className="filter-group">
                    <span className="text-xs text-gray-muted">To:</span>
                    <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                </div>
                <button
                    onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '' })}
                    className="btn-text"
                >Clear All</button>
            </section>

            <div className="glassmorphism table-overflow animate-slide-up">
                <table className="record-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th className="hide-mobile">Notes</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id} className="table-row">
                                <td className="font-medium">{record.date}</td>
                                <td><span className="badge category-badge">{record.category}</span></td>
                                <td>
                                    <span className={`badge type-badge ${record.type}`}>
                                        {record.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className={`font-bold ${record.type === 'income' ? 'text-success' : 'text-error'}`}>
                                    ${record.amount.toLocaleString()}
                                </td>
                                <td className="hide-mobile text-gray-muted italic max-w-xs truncate">{record.notes}</td>
                                {isAdmin && (
                                    <td className="actions-cell">
                                        <button onClick={() => handleOpenModal(record)} className="btn-icon">
                                            <Edit size={16} color="#6366f1" />
                                        </button>
                                        <button onClick={() => handleDelete(record.id)} className="btn-icon">
                                            <Trash size={16} color="#ef4444" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay animate-fade-in">
                    <div className="modal-content glassmorphism animate-scale-up">
                        <div className="modal-header">
                            <h2>{editingRecord ? 'Edit Record' : 'Create Record'}</h2>
                            <button onClick={() => setShowModal(false)} className="btn-icon">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Amount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={recordForm.amount}
                                        onChange={(e) => setRecordForm({ ...recordForm, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Type</label>
                                    <select
                                        value={recordForm.type}
                                        onChange={(e) => setRecordForm({ ...recordForm, type: e.target.value })}
                                        required
                                    >
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={recordForm.category}
                                        onChange={(e) => setRecordForm({ ...recordForm, category: e.target.value })}
                                        placeholder="e.g. Salary, Rent, Food"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={recordForm.date}
                                        onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group mt-4">
                                <label>Notes</label>
                                <textarea
                                    className="p-3 bg-opacity-10"
                                    value={recordForm.notes}
                                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {editingRecord ? <><Check size={18} /> Update</> : <><Save size={18} /> Save Record</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Records;
