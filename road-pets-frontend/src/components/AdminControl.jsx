// src/components/AdminControl.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminControl = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        location: '',
        images: []
    });

    // Check if user is admin on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
    }, [navigate]);

    // Fetch all posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/posts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    navigate('/login');
                }
            }
        };
        fetchPosts();
    }, [navigate]);

    // Handle delete post
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(posts.filter(post => post._id !== id));
            alert('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
            }
            alert('Failed to delete post.');
        }
    };

    // Handle edit post
    const handleEdit = (post) => {
        setEditingPost(post._id);
        setFormData({
            name: post.name,
            phoneNumber: post.phoneNumber,
            location: post.location,
            images: [] // You may want to handle image uploads separately
        });
    };

    // Handle form submission for editing
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/posts/${editingPost}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(posts.map(post => (post._id === editingPost ? { ...post, ...formData } : post)));
            setEditingPost(null);
            alert('Post updated successfully!');
            setFormData({ name: '', phoneNumber: '', location: '', images: [] });
        } catch (error) {
            console.error('Error updating post:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
            }
            alert('Failed to update post.');
        }
    };

    // Check if user is admin before rendering
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div>
            <h2>Admin Control Panel</h2>
            
            {/* Edit Form */}
            {editingPost && (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <input type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
                    <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    {/* Implement image upload if needed */}
                    <button type="submit">Update Post</button>
                    <button type="button" onClick={() => setEditingPost(null)}>Cancel</button>
                </form>
            )}

            {/* Posts Table */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Location</th>
                        <th>Images</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post._id}>
                            <td>{post.name}</td>
                            <td>{post.phoneNumber}</td>
                            <td>{post.location}</td>
                            <td>{post.images.map((img, index) => (
                                <img key={index} src={`http://localhost:5000/${img}`} alt={`Post image ${index}`} width="50" />
                            ))}</td>
                            <td>
                                <button onClick={() => handleEdit(post)}>Edit</button>
                                <button onClick={() => handleDelete(post._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminControl;

