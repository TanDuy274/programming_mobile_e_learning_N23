const Category = require('../../models/CategoryModel');

describe('Category Model unit tests', () => {
  it('should require a name', () => {
    const c = new Category({});
    const err = c.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  it('should accept an optional description', () => {
    const c = new Category({ name: 'Test' });
    const err = c.validateSync();
    expect(err).toBeUndefined();
  });
});
