const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Charity = require('../models/Charity');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/charity';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "logo") {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload an image file'));
      }
    } else if (file.fieldname === "proof") {
      if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload a PDF or image file'));
      }
    }
    cb(null, true);
  }
});

// Submit charity registration request
router.post('/register', auth, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'proof', maxCount: 1 }
]), async (req, res) => {
  try {
    const charityData = {
      ...req.body,
      userId: req.user._id,
      logo: req.files?.logo ? `/uploads/charity/${req.files.logo[0].filename}` : null,
      proof: req.files?.proof ? `/uploads/charity/${req.files.proof[0].filename}` : null
    };

    const charity = new Charity(charityData);
    await charity.save();

    res.status(201).json({
      message: 'Charity registration request submitted successfully',
      charity
    });
  } catch (error) {
    console.error('Error in charity registration:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all charities (public)
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find({ status: 'approved' })
      .select('-proof'); // Don't send proof document to client
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single charity details (public)
router.get('/:id', async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id)
      .select('-proof');
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Get all charity requests
router.get('/admin/requests', adminAuth, async (req, res) => {
  try {
    const requests = await Charity.find()
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve charity request
router.post('/admin/requests/:id/approve', adminAuth, async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: 'Charity request not found' });
    }

    charity.status = 'approved';
    charity.updatedAt = Date.now();
    await charity.save();

    res.json({ message: 'Charity request approved successfully', charity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject charity request
router.post('/admin/requests/:id/reject', adminAuth, async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: 'Charity request not found' });
    }

    charity.status = 'rejected';
    charity.updatedAt = Date.now();
    await charity.save();

    res.json({ message: 'Charity request rejected successfully', charity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's charity
router.get('/user/charity', auth, async (req, res) => {
  try {
    const charity = await Charity.findOne({ userId: req.user._id });
    if (!charity) {
      return res.status(404).json({ message: 'No charity found for this user' });
    }
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 