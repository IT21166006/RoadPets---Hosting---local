import express from 'express';
import jwt from 'jsonwebtoken';
import { authorizeRole } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

// Dashboard route
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching user data for ID:', req.user.userId);

        const user = await User.findById(req.user.userId)
            .select('-password')
            .lean();

        if (!user) {
            console.log('No user found for ID:', req.user.userId);
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = {
            username: user.username,
            email: user.email,
            role: user.role
        };

        console.log('Sending user data:', userData); // Debug log
        res.json(userData);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Example of a route restricted to admin users only
router.get('/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
    res.status(200).json({ message: 'This is the admin portal and only admin in authorized to modify any changes in this page! If You a admin welcome wormly...' });
});

// Get all users (admin only)
router.get('/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .lean();
        
        // Add online status to each user based on lastActive timestamp
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const usersWithStatus = users.map(user => ({
            ...user,
            isOnline: new Date(user.lastActive) > fiveMinutesAgo
        }));

        res.json(usersWithStatus);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Update user's last active timestamp
router.post('/update-activity', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.userId, {
            lastActive: Date.now()
        });
        res.json({ message: 'Activity updated' });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'Error updating activity' });
    }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.userId) {
            return res.status(403).json({ error: 'Cannot delete your own admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

export default router;



