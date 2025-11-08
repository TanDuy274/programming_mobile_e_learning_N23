const Review = require('../../models/ReviewModel');

describe('Review Model unit tests', () => {
  it('should require user, course, and rating', () => {
    const r = new Review({});
    const err = r.validateSync();
    expect(err.errors.user).toBeDefined();
    expect(err.errors.course).toBeDefined();
    expect(err.errors.rating).toBeDefined();
  });

  it('should enforce rating bounds (1-5)', () => {
    const r = new Review({ user: 'u', course: 'c', rating: 6 });
    const err = r.validateSync();
    expect(err.errors.rating).toBeDefined();
  });
});
