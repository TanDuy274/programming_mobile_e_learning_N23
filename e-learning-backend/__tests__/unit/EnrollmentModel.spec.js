const Enrollment = require('../../models/EnrollmentModel');

describe('Enrollment Model unit tests', () => {
  it('should require user and course', () => {
    const e = new Enrollment({});
    const err = e.validateSync();
    expect(err.errors.user).toBeDefined();
    expect(err.errors.course).toBeDefined();
  });

  it('should enforce progress min/max', () => {
    const e = new Enrollment({ user: 'u', course: 'c', progress: 150 });
    const err = e.validateSync();
    expect(err.errors.progress).toBeDefined();
  });
});
