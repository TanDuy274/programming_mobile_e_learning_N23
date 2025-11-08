jest.mock('../../../models/UserModel');
jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
const User = require('../../../models/UserModel');
const { protect } = require('../../../middlewares/authMiddleware');

const makeReq = (authHeader) => ({ headers: { authorization: authHeader } });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeNext = () => jest.fn();

describe('authMiddleware protect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next when token valid and user found', async () => {
    const token = 'tok';
    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();
    const next = makeNext();

  jwt.verify.mockReturnValue({ id: 'u1' });
  // findById(...).select(...) chain -> mock .select to return the user
  User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'u1', name: 'U' }) });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith('u1');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 when token invalid', async () => {
    const req = makeReq('Bearer bad');
    const res = makeRes();
    const next = makeNext();

    jwt.verify.mockImplementation(() => { throw new Error('bad'); });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when no token', async () => {
    const req = makeReq(null);
    const res = makeRes();
    const next = makeNext();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
  });
});
