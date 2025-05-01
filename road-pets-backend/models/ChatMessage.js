import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for anonymous users
  },
  username: {
    type: String,
    required: true // Will be "Anonymous User" for non-registered users
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500 // Add a reasonable maximum length
  },
  isAnonymous: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for better query performance
chatMessageSchema.index({ createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage; 