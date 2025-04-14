import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../CSS/signup.css';
import Logo from "../asserts/logo.png";
import api from '../config/api';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        // Check if token exists
        if (!token) {
            setTokenValid(false);
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        // Validate password strength
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.post(`/api/auth/reset-password/${token}`, { password });
            setMessage('Your password has been reset successfully. You can now login with your new password.');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow" style={{ borderColor: '#ff914d' }}>
                            <div className="card-body text-center">
                                <div className="d-flex justify-content-center">
                                    <img src={Logo} width="200" alt="Logo" />
                                </div>
                                <h2 className="mx-auto mb-4" style={{ color: '#ff914d' }}>Invalid Reset Link</h2>
                                <p>The password reset link is invalid or has expired.</p>
                                <a href="/forgot-password" className="btn" style={{ backgroundColor: '#ff914d', color: '#fff' }}>
                                    Request New Reset Link
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow" style={{ borderColor: '#ff914d' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <img src={Logo} width="200" alt="Logo" />
                            </div>
                            <h2 className="mx-auto mb-4" style={{ color: '#ff914d' }}>Reset Password</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000' }}>New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        style={{
                                            borderColor: '#ff914d',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                        }}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000' }}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        style={{
                                            borderColor: '#ff914d',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                        }}
                                    />
                                </div>
                                
                                {message && (
                                    <div className="alert alert-success" role="alert">
                                        {message}
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    className="btn btn-block w-100"
                                    disabled={isLoading}
                                    style={{
                                        backgroundColor: '#ff914d',
                                        borderColor: '#ff914d',
                                        color: '#fff',
                                    }}
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword; 