import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/admin/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/admin/posts/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      status: post.status
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.put(`/api/admin/posts/${editingPost._id}`, formData);
      } else {
        await axios.post('/api/admin/posts', formData);
      }
      fetchPosts();
      setEditingPost(null);
      setFormData({ title: '', content: '', status: 'published' });
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="posts-management">
      <h2>Posts Management</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit">
          {editingPost ? 'Update Post' : 'Create Post'}
        </button>
      </form>

      <div className="posts-list">
        {filteredPosts.map(post => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <p>Status: {post.status}</p>
            <div className="actions">
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsManagement; 