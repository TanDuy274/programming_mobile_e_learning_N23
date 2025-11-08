const mongoose = require('mongoose');
const Question = require('../../models/QuestionModel');

describe('Question Model unit tests', () => {
  it('should require user, course and text', () => {
    const q = new Question({});
    const err = q.validateSync();
    expect(err.errors.user).toBeDefined();
    expect(err.errors.course).toBeDefined();
    expect(err.errors.text).toBeDefined();
  });

  it('should validate when valid objectIds and text provided', () => {
    const userId = new mongoose.Types.ObjectId();
    const courseId = new mongoose.Types.ObjectId();
    const q = new Question({ user: userId, course: courseId, text: 'What is X?' });
    const err = q.validateSync();
    expect(err).toBeUndefined();
  });
});
