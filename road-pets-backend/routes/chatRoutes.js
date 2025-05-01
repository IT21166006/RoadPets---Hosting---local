import express from 'express';
import jwt from 'jsonwebtoken';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

// Get recent chat messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username name email')
      .lean();
    
    const transformedMessages = messages.map(msg => ({
      ...msg,
      username: msg.userId ? msg.userId.username || msg.userId.name : msg.username
    }));
    
    res.json(transformedMessages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a new message (works for both authenticated and anonymous users)
router.post('/messages', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    // Check if user is authenticated
    const isAuthenticated = req.headers.authorization;
    let messageData = {
      message: message.trim(),
      isAnonymous: true,
      username: 'Anonymous User'
    };

    if (isAuthenticated) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        messageData = {
          userId: decoded.userId,
          username: decoded.username || decoded.name,
          message: message.trim(),
          isAnonymous: false
        };
      } catch (error) {
        console.log('Token verification failed, proceeding as anonymous');
      }
    }

    const chatMessage = new ChatMessage(messageData);
    const savedMessage = await chatMessage.save();
    
    if (!savedMessage.isAnonymous && savedMessage.userId) {
      await savedMessage.populate('userId', 'username name email');
    }
    
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router; 