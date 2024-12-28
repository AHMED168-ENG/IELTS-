const mongoose = require('mongoose');

// تعريف Schema الخاص بـ usersResult
const usersResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // مرجع إلى مجموعة `User`
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Testing', // مرجع إلى مجموعة `Testing`
    required: true,
  },
  audio: {
    type: String,
    required: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
});

// إنشاء النموذج Model
const UsersResult = mongoose.model('UsersResult', usersResultSchema);

module.exports = UsersResult;
