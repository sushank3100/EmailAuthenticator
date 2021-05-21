const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
    unique: true,
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  date: {
    type: 'Date',
    default: Date.now,
  },
  resetLink: {
    data: String,
    default: '',
  },
});

module.exports = User = mongoose.model('user', UserSchema);
