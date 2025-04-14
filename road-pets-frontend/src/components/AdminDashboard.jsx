import React, { useState, useEffect } from 'react';
import axios from 'axios';
import admincontrol from './AdminControl';

function AdminDashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        } else {
            axios.get('http://localhost:5000/api/protected/admin', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error(error);
                window.location.href = '/profile';
            });
        }
    }, []);

    return (
        <div className="container mt-5">
            <admincontrol />
            <p>{message}</p>
        </div>
    );
}

export default AdminDashboard;
