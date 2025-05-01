import React, { useState, useEffect, useRef } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetchingMessages, setIsFetchingMessages] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);

  // Function to get current user from token
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setCurrentUser(JSON.parse(jsonPayload));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  // Function to check if user is near bottom of chat
  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    setShouldScrollToBottom(isNearBottom());
  };

  // Function to fetch and shuffle random posts
  const fetchRandomPosts = async () => {
    try {
      setIsLoadingPosts(true);
      setPostsError(null);
      const response = await axios.get('http://localhost:5000/api/posts');
      const allPosts = response.data;
      const shuffled = allPosts.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setPopularPosts(selected);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPostsError('Failed to load popular posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Function to fetch chat messages
  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:5000/api/chat/messages');
      setMessages(response.data);
      // Only scroll if we're already near the bottom
      if (!isFetchingMessages && shouldScrollToBottom) {
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load messages. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsFetchingMessages(false);
    }
  };

  // Function to send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    
    if (!trimmedMessage) {
      setError('Message cannot be empty');
      return;
    }

    if (trimmedMessage.length > 500) {
      setError('Message is too long (maximum 500 characters)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShouldScrollToBottom(true); // Always scroll when sending a new message
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };

      const response = await axios.post('http://localhost:5000/api/chat/messages', {
        message: trimmedMessage
      }, config);

      if (response.data) {
        setNewMessage('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchMessages();
    fetchRandomPosts(); // Initial fetch of popular posts

    // Set up polling for new messages and daily posts update
    const messageInterval = setInterval(fetchMessages, 5000);
    const postsInterval = setInterval(fetchRandomPosts, 24 * 60 * 60 * 1000); // 24 hours

    return () => {
      clearInterval(messageInterval);
      clearInterval(postsInterval);
    };
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Function to handle post click and scroll to position
  const handlePostClick = (postId) => {
    const postElement = document.getElementById(`post-${postId}`);
    if (postElement) {
      postElement.scrollIntoView({ behavior: 'smooth' });
      // Add highlight effect
      postElement.classList.add('highlight-post');
      setTimeout(() => {
        postElement.classList.remove('highlight-post');
      }, 2000);
    }
  };

  return (
    <div className="sidebar p-4">
      {/* Get in Touch Section */}
      <div className="mb-5">
        <h4 className="border-bottom pb-2">Get in Touch</h4>
        <div className="d-flex flex-wrap gap-3 mt-3">
          <a href="#" className="text-primary text-decoration-none">
            <FacebookIcon /> Facebook
          </a>
          <a href="#" className="text-info text-decoration-none">
            <TwitterIcon /> Twitter
          </a>
          <a href="#" className="text-danger text-decoration-none">
            <InstagramIcon /> Instagram
          </a>
          <a href="#" className="text-danger text-decoration-none">
            <YouTubeIcon /> Youtube
          </a>
        </div>
      </div>

      {/* Popular Posts Section */}
      <div className="mb-5">
        <h4 className="border-bottom pb-2">Popular Posts</h4>
        <div className="popular-posts">
          {isLoadingPosts ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading posts...</span>
              </div>
            </div>
          ) : postsError ? (
            <div className="alert alert-danger p-2" role="alert">
              {postsError}
            </div>
          ) : popularPosts.length === 0 ? (
            <div className="text-center text-muted py-3">
              No posts available
            </div>
          ) : (
            popularPosts.map((post) => (
              <div 
                key={post._id} 
                className="card mb-3 cursor-pointer hover-effect"
                onClick={() => handlePostClick(post._id)}
                role="button"
              >
                <div className="row g-0">
                  <div className="col-4 popular-post-image-container">
                    <img
                      src={post.images && post.images.length > 0 
                        ? post.images[0] 
                        : 'https://via.placeholder.com/100?text=No+Image'}
                      alt={`${post.name}'s post`}
                      className="popular-post-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                      }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body py-1">
                      <h6 className="card-title mb-1">{post.name}</h6>
                      <small className="text-muted">{post.description}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Public Chat Section */}
      <div className="mb-5">
        <h4 className="border-bottom pb-2 " >
          Public Chat
          {currentUser && (
            <small className="text-muted ms-2">
              (Chatting as {currentUser.username || currentUser.name})
            </small>
          )}
        </h4>
        <div className="chat-box border rounded p-3" style={{ height: '1000px' }}>
          <div 
            ref={messagesContainerRef}
            className="messages-container" 
            style={{ height: '220px', overflowY: 'auto', marginBottom: '10px' }}
          >
            {isFetchingMessages ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger p-2" role="alert">
                {error}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted py-3">
                No messages yet. Be the first to chat!
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div 
                    key={msg._id || index} 
                    className={`message mb-2 p-2 rounded ${msg.isAnonymous ? 'anonymous' : 'registered'}`}
                    style={{
                      backgroundColor: msg.isAnonymous ? '#f8f9fa' : '#e3f2fd',
                      borderLeft: msg.userId === currentUser?.userId ? '3px solid #1976d2' : 'none'
                    }}
                  >
                    <strong style={{ 
                      color: msg.isAnonymous ? '#6c757d' : '#1976d2'
                    }}>
                      {msg.username}
                    </strong>
                    <span className="ms-2">{msg.message}</span>
                    <small className="text-muted d-block">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </small>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <form onSubmit={sendMessage} className="mt-2">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={currentUser ? "Type your message..." : "Type your message (as Anonymous)..."}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={500}
                disabled={isLoading}
              />
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={isLoading || !newMessage.trim()}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>
            {error && (
              <div className="text-danger small mt-1">
                {error}
              </div>
            )}
            <small className="text-muted d-block mt-1">
              {newMessage.length}/500 characters
            </small>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 