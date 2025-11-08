const mongoose = require('mongoose');
const Project = require('../../models/ProjectModel');

describe('Project Model unit tests', () => {
  it('should require user, course and description', () => {
    const p = new Project({});
    const err = p.validateSync();
    expect(err.errors.user).toBeDefined();
    expect(err.errors.course).toBeDefined();
    expect(err.errors.description).toBeDefined();
  });

  it('should validate when required fields provided', () => {
    const userId = new mongoose.Types.ObjectId();
    const courseId = new mongoose.Types.ObjectId();
    const p = new Project({ user: userId, course: courseId, description: 'Build project' });
    const err = p.validateSync();
    expect(err).toBeUndefined();
  });
});
