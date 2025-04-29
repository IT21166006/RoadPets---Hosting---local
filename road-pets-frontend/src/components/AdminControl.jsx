import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom CSS for dashboard enhancements
const dashboardStyles = `
.dashboard-sidebar {
  min-height: 100vh;
  background: #23272b;
  color: #fff;
  padding-top: 1rem;
  position: sticky;
  top: 0;
}
.dashboard-sidebar .nav-link {
  color: #adb5bd;
  font-weight: 500;
  padding: 1rem 1.5rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s, color 0.2s;
}
.dashboard-sidebar .nav-link.active,
.dashboard-sidebar .nav-link:hover {
  background: #343a40;
  color: #fff;
}
.dashboard-navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(44,62,80,0.03);
  padding: 0.75rem 2rem;
  margin-bottom: 2rem;
}
.dashboard-content {
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}
.dashboard-card {
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(44,62,80,0.04);
  background: #fff;
  padding: 2rem;
  margin-bottom: 2rem;
}
.table thead th {
  background: #f1f3f4;
}
.dashboard-footer {
  background: #fff;
  padding: 1rem 2rem;
  text-align: center;
  color: #adb5bd;
  font-size: 0.95rem;
  border-top: 1px solid #e9ecef;
}
`;

const AdminControl = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    images: []
  });
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/protected/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const updateActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/protected/update-activity', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };

    // Initial fetch
    fetchPosts();
    fetchUsers();
    updateActivity();

    // Set up periodic updates
    const activityInterval = setInterval(updateActivity, 60000); // Update activity every minute
    const usersInterval = setInterval(fetchUsers, 30000); // Refresh users every 30 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(activityInterval);
      clearInterval(usersInterval);
    };
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPosts(posts.filter(post => post._id !== id));
        alert('Post deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert(error.response?.data?.error || 'Failed to delete post. Please try again.');
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setFormData({
      name: post.name,
      phoneNumber: post.phoneNumber,
      location: post.location,
      description: post.description,
      images: post.images
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/posts/${editingPost}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setPosts(posts.map(post => 
          post._id === editingPost ? { ...post, ...response.data } : post
        ));
        setEditingPost(null);
        alert('Post updated successfully!');
        setFormData({ 
          name: '', 
          phoneNumber: '', 
          location: '', 
          description: '',
          images: [] 
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert(error.response?.data?.error || 'Failed to update post. Please try again.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/protected/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      {/* Inject custom CSS */}
      <style>{dashboardStyles}</style>
      {/* Navbar */}
      <nav className="dashboard-navbar navbar navbar-expand navbar-light rounded-3">
        <span className="navbar-brand fw-bold" style={{ fontSize: '1.3rem', letterSpacing: '.03em' }}>
          <i className="bi bi-speedometer2 me-2"></i>
          Admin Dashboard
        </span>
        <div className="ms-auto">
          <span className="text-muted me-3">Welcome Admin, {user.username || 'Admin'}</span>
        
        </div>
      </nav>
      {/* Main Layout */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="dashboard-sidebar col-md-2 d-none d-md-block">
            <ul className="nav flex-column">
              <li className="nav-item">
                <button
                  className={`nav-link w-100 text-start ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  <i className="bi bi-card-list me-2"></i>
                  Posts
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link w-100 text-start ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="bi bi-people me-2"></i>
                  Users
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link w-100 text-start ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </button>
              </li>
            </ul>
          </nav>
          {/* Main Content */}
          <main className="dashboard-content col-md-10 ms-sm-auto">
            {activeTab === 'posts' && (
              <div className="dashboard-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0">Posts Management</h3>
                </div>
                {editingPost && (
                  <form onSubmit={handleEditSubmit} className="mb-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <button type="submit" className="btn btn-primary me-2">Update Post</button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingPost(null)}>Cancel</button>
                    </div>
                  </form>
                )}
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
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
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {post.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Post ${idx + 1}`}
                                  className="rounded"
                                  style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover',
                                    border: '1px solid #dee2e6'
                                  }}
                                />
                              ))}
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(post)}>
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post._id)}>
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div className="dashboard-card">
                <h3 className="fw-bold mb-3">User Management</h3>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${user.isOnline ? 'bg-success' : 'bg-secondary'}`}>
                              {user.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={user.role === 'admin'}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="dashboard-card">
                <h3 className="fw-bold mb-3">Settings</h3>
                <p className="text-muted">Settings content goes here.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Footer */}
      <footer className="dashboard-footer">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
      {/* Optionally load Bootstrap Icons CDN for icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </>
  );
};

export default AdminControl;
