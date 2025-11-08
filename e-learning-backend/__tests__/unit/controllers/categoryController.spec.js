const categoryController = require('../../../controllers/categoryController');

describe('categoryController (basic)', () => {
  it('should export controller object or function', () => {
    expect(categoryController).toBeDefined();
    const t = typeof categoryController;
    expect(t === 'object' || t === 'function').toBe(true);
  });

  it('should have at least one handler function', () => {
    const keys = Object.keys(categoryController || {});
    expect(keys.length).toBeGreaterThan(0);
  });
});
