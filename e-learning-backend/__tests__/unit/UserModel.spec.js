const User = require('../../models/UserModel');

describe('User Model unit tests', () => {
  it('should require name, email and password', () => {
    const u = new User({});
    const err = u.validateSync();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should validate email format', () => {
    const u = new User({ name: 'A', email: 'bad-email', password: 'secret' });
    const err = u.validateSync();
    expect(err.errors.email).toBeDefined();
  });

  it('should set default role and avatar', () => {
    const u = new User({ name: 'A', email: 'a@test.com', password: 'secret' });
    expect(u.role).toBe('student');
    expect(u.avatar).toBeDefined();
  });
});
