import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminControl from './AdminControl';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminAccess = async () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user || user.role !== 'admin') {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/protected/admin', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setMessage(response.data.message);
            } catch (error) {
                console.error('Admin access error:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    navigate('/profile');
                }
            }
        };

        checkAdminAccess();
    }, [navigate]);

    return (
        <div className="container mt-5">
            <AdminControl />
            {message && <p>{message}</p>}
        </div>
    );
}

export default AdminDashboard;
