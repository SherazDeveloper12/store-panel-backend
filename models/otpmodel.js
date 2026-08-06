const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    
    required: true,
    // index: true
  },
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // TTL: doc auto-deletes 5 min after creation
  }
});

module.exports = mongoose.model('Otp', otpSchema);