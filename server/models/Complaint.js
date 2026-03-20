const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  description: { type: String, required: true },
  suspect: { type: String },
  evidence: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
