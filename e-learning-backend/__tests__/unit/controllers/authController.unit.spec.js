jest.mock('../../../models/UserModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const User = require('../../../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser, getMe } = require('../../../controllers/authController');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 when missing fields', async () => {
      const req = { body: { name: '', email: '', password: '' } };
      const res = makeRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 when user already exists', async () => {
      const req = { body: { name: 'A', email: 'a@test', password: 'pass' } };
      const res = makeRes();
      User.findOne.mockResolvedValue({ _id: 'existing' });

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'a@test' });
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create user and return 201 with token on success', async () => {
      const req = { body: { name: 'A', email: 'a@test', password: 'pass' } };
      const res = makeRes();

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashed');
      const createdUser = { _id: 'id1', name: 'A', email: 'a@test', role: 'student' };
      User.create.mockResolvedValue(createdUser);
      jwt.sign.mockReturnValue('token-123');

      await registerUser(req, res);

      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token-123' }));
    });
  });

  describe('loginUser', () => {
    it('should return 400 when missing fields', async () => {
      const req = { body: { email: '', password: '' } };
      const res = makeRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 when invalid credentials', async () => {
      const req = { body: { email: 'x@test', password: 'pw' } };
      const res = makeRes();

      User.findOne.mockResolvedValue(null);
      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 200 and token on success', async () => {
      const req = { body: { email: 'x@test', password: 'pw' } };
      const res = makeRes();
      const userRec = { _id: 'u1', name: 'U', email: 'x@test', password: 'hashed', role: 'student', avatar: 'a.jpg' };

      User.findOne.mockResolvedValue(userRec);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('tok-1');

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok-1' }));
    });
  });

  describe('getMe', () => {
    it('should return req.user', async () => {
      const req = { user: { _id: 'u1', name: 'U' } };
      const res = makeRes();

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.user);
    });
  });
});
