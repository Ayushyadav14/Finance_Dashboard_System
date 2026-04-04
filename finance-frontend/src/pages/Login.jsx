import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Lock, Mail, UserPlus, LogIn, TrendingUp } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

        try {
            const { data } = await axiosInstance.post(endpoint, payload);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role
            }));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glassmorphism animate-fade-in">
                <div className="brand-header">
                    <div className="brand-logo bg-gradient-brand">
                        <TrendingUp size={32} color="white" />
                    </div>
                    <h1>FinanceDash</h1>
                    <p>{isLogin ? 'Welcome Back!' : 'Create New Account'}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="input-group">
                            <label><UserPlus size={16} /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && <div className="error-message animate-shake">{error}</div>}

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
                        {loading ? 'Processing...' : (isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Register</>)}
                    </button>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-muted">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="toggle-auth-btn font-600"
                            >
                                {isLogin ? 'Register now' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
