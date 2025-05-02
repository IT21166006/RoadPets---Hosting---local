const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  charityName: {
    type: String,
    required: true,
    trim: true
  },
  charityType: {
    type: String, 
    required: true,
    enum: ["Animal Welfare", "Animal Health", "Environmental", "Education", "Health", "Other"]
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  websiteLinks: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  contactPersonName: {
    type: String,
    required: true
  },
  designation: {
    type: String
  },
  description: {
    type: String
  },
  logo: {
    type: String // URL to stored image
  },
  proof: {
    type: String // URL to stored document
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Charity', charitySchema); 