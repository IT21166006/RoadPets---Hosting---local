import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/signup.css';
import Logo from "../asserts/logo.png";
import api from '../config/api';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            console.log('Sending forgot password request for email:', email);
            const response = await api.post('/api/auth/forgot-password', { email });
            console.log('Forgot password response:', response.data);
            
            setMessage('Password reset instructions have been sent to your email. Please check your inbox.');
            
            // Clear email field for security
            setEmail('');
        } catch (error) {
            console.error('Forgot password error:', error);
            const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow" style={{ borderColor: '#ff914d' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-center">
                                <img src={Logo} width="200" alt="Logo" />
                            </div>
                            <h2 className="mx-auto mb-4" style={{ color: '#ff914d' }}>Forgot Password</h2>
                            <p className="text-center mb-4">Enter your email address and we'll send you instructions to reset your password.</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000' }}>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                                </button>
                                
                                <div className="d-flex justify-content-center mt-3">
                                    <p>Remember your password? <a href="/login">Login</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
