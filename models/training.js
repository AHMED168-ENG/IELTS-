const mongoose = require('mongoose');

// تعريف Schema الخاص بـ training
const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  disability: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disability', // مرجع إلى مجموعة `Disability`
    required: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isOther: {
    type: Boolean,
    default: false,
  },
  otherDisabilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disability', // مرجع إلى مجموعة `Disability`
    },
  ],
});

// إنشاء النموذج Model
const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
