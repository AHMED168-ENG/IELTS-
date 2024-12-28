const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  scores: [
    { 
      section: { type: String, enum: ['Reading', 'Writing', 'Listening', 'Speaking'], required: true },
      score: { type: Number, required: true },  // الدرجة المحصل عليها في القسم
    }
  ],
  overallScore: { type: Number, required: true },  // المعدل العام للامتحان
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserResult = mongoose.model('UserResult', userResultSchema);
module.exports = UserResult;
