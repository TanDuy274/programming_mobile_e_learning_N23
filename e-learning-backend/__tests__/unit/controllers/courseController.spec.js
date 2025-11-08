const courseController = require('../../../controllers/courseController');

describe('courseController (basic)', () => {
  it('should export controller object or function', () => {
    expect(courseController).toBeDefined();
    const t = typeof courseController;
    expect(t === 'object' || t === 'function').toBe(true);
  });

  it('should have at least one handler function', () => {
    const keys = Object.keys(courseController || {});
    expect(keys.length).toBeGreaterThan(0);
  });
});
