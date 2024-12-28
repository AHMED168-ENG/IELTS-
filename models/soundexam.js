const mongoose = require('mongoose');

// تعريف Schema الخاص بـ soundExam
const soundExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  pdf: {
    type: String,
    required: false,
  },
  disability: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disability', // مرجع إلى مجموعة `Disability`
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  isOther: {
    type: Boolean,
    default: false,
  },
  otherDisabilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disability', // مرجع لمجموعة `Disability`
    },
  ],
});

// إنشاء النموذج Model
const SoundExam = mongoose.model('SoundExam', soundExamSchema);

module.exports = SoundExam;
