const Course = require('../../models/CourseModel');
const mongoose = require('mongoose');

describe('Course Model unit tests', () => {
  it('should require title, description, price, instructor and category', () => {
    const c = new Course({});
    const err = c.validateSync();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.description).toBeDefined();
    expect(err.errors.price).toBeDefined();
    expect(err.errors.instructor).toBeDefined();
    expect(err.errors.category).toBeDefined();
  });

  it('should validate lesson subdocs when provided', () => {
    const c = new Course({
      title: 'T',
      description: 'D',
      price: 10,
      instructor: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      lessons: [{ title: 'L' }], // missing duration & youtubeVideoId
    });
    const err = c.validateSync();
    expect(err.errors['lessons.0.duration']).toBeDefined();
    expect(err.errors['lessons.0.youtubeVideoId']).toBeDefined();
  });
});
