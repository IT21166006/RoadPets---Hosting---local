import mongoose from 'mongoose';

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
  websiteLink: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/ // basic email validation
  },
  phone: {
    type: String,
    required: true,

  },
  address: {
    type: String,
    required: true
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
  logo: [{
    type: String,  // This will store base64 strings
    required: true
  }],
  proof: [{
    type: String,  // This will store base64 strings
    required: true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('Charity', charitySchema);
