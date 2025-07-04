const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  learningPath: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath' }],
  figther: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mastery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mastery' }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
