const mongoose = require('mongoose');

// تعريف Schema الخاص بـ users
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: Boolean, // true = male, false = female
    required: true,
  },
  Disability: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disability', // مرجع إلى مجموعة `Disability`
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// تعريف سكوب مخصص (استعلام نشط)
userSchema.statics.isActive = function () {
  return this.find({ active: true });
};

// إنشاء النموذج Model
const User = mongoose.model('User', userSchema);

module.exports = User;
