jest.mock('../../../models/UserModel');
jest.mock('../../../models/CourseModel');

const User = require('../../../models/UserModel');
const Course = require('../../../models/CourseModel');
const {
  updateUserProfile,
  getTeacherDetails,
  getTopTeachers,
  toggleSaveCourse,
  addToCart,
  getCartItems,
  removeFromCart,
  toggleFollowTeacher,
} = require('../../../controllers/userController');

const makeReq = (opts = {}) => ({ params: opts.params || {}, body: opts.body || {}, user: opts.user || {} });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('userController', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('updateUserProfile', () => {
    it('returns 404 when user not found', async () => {
      const req = makeReq({ user: { _id: 'u1' }, body: { name: 'X' } });
      const res = makeRes();
      User.findById.mockResolvedValue(null);

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('updates and returns profile', async () => {
      const user = { _id: 'u1', name: 'A', save: jest.fn().mockResolvedValue({ _id: 'u1', name: 'X', email: 'e', avatar: 'a', headline: 'h', role: 'student' }) };
      const req = makeReq({ user: { _id: 'u1' }, body: { name: 'X' } });
      const res = makeRes();
      User.findById.mockResolvedValue(user);

      await updateUserProfile(req, res);

      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'X' }));
    });
  });

  describe('getTeacherDetails', () => {
    it('returns 404 when teacher not found or not teacher', async () => {
      const req = makeReq({ params: { id: 't1' } });
      const res = makeRes();
      // Controller calls User.findById(...).select(...) and Course.find(...).populate(...)
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      Course.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });

      await getTeacherDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns teacher and courses when found', async () => {
      const teacher = { _id: 't1', role: 'teacher' };
      const courses = [{ _id: 'c1' }];
      const req = makeReq({ params: { id: 't1' } });
      const res = makeRes();
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(teacher) });
      Course.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(courses) });

      await getTeacherDetails(req, res);

      expect(res.json).toHaveBeenCalledWith({ teacher, courses });
    });
  });

  describe('getTopTeachers', () => {
    it('returns list of teachers', async () => {
      const req = makeReq();
      const res = makeRes();
      // Controller calls User.find(...).limit(4)
      User.find.mockReturnValue({ limit: jest.fn().mockResolvedValue([{ _id: 't1' }]) });

      await getTopTeachers(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'teacher' });
      expect(res.json).toHaveBeenCalledWith([{ _id: 't1' }]);
    });
  });

  describe('toggleSaveCourse', () => {
    it('returns 404 when user not found', async () => {
      const req = makeReq({ user: { _id: 'u1' }, body: { courseId: 'c1' } });
      const res = makeRes();
      User.findById.mockResolvedValue(null);

      await toggleSaveCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('adds course when not saved and returns savedCourses', async () => {
      const user = { _id: 'u1', savedCourses: [], save: jest.fn().mockResolvedValue({ savedCourses: ['c1'] }) };
      const req = makeReq({ user: { _id: 'u1' }, body: { courseId: 'c1' } });
      const res = makeRes();
      User.findById.mockResolvedValue(user);

      await toggleSaveCourse(req, res);

      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('addToCart / getCartItems / removeFromCart', () => {
    it('addToCart returns 404 when user not found', async () => {
      const req = makeReq({ user: { _id: 'u1' }, body: { courseId: 'c1' } });
      const res = makeRes();
      User.findById.mockResolvedValue(null);

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('addToCart adds when not present', async () => {
      const user = { _id: 'u1', cart: [], save: jest.fn() };
      const req = makeReq({ user: { _id: 'u1' }, body: { courseId: 'c1' } });
      const res = makeRes();
      User.findById.mockResolvedValue(user);

      await addToCart(req, res);

      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('getCartItems returns 404 when user missing', async () => {
      const req = makeReq({ user: { _id: 'u1' } });
      const res = makeRes();
      // Controller calls User.findById(...).populate(...)
      User.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

      await getCartItems(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('removeFromCart removes and returns cart', async () => {
      const cart = [];
      cart.pull = jest.fn();
      const user = { _id: 'u1', cart, save: jest.fn() };
      const req = makeReq({ user: { _id: 'u1' }, params: { courseId: 'c1' } });
      const res = makeRes();
      User.findById.mockResolvedValue(user);

      await removeFromCart(req, res);

      expect(user.cart.pull).toHaveBeenCalledWith('c1');
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('toggleFollowTeacher', () => {
    it('returns 400 when self-follow attempted', async () => {
      const req = makeReq({ user: { _id: 'u1' }, params: { teacherId: 'u1' } });
      const res = makeRes();

      await toggleFollowTeacher(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 404 when current user not found', async () => {
      const req = makeReq({ user: { _id: 'u1' }, params: { teacherId: 't1' } });
      const res = makeRes();
      User.findById.mockResolvedValueOnce(null);

      await toggleFollowTeacher(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 404 when target not teacher', async () => {
      const req = makeReq({ user: { _id: 'u1' }, params: { teacherId: 't1' } });
      const res = makeRes();
      User.findById.mockResolvedValueOnce({ _id: 'u1' });
      User.findById.mockResolvedValueOnce({ _id: 't1', role: 'student' });

      await toggleFollowTeacher(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('follows and unfollows correctly', async () => {
      const currentUser = { _id: 'u1', following: { includes: () => false, push: jest.fn(), pull: jest.fn() }, save: jest.fn() };
      const targetUser = { _id: 't1', role: 'teacher', followers: { push: jest.fn(), pull: jest.fn() }, save: jest.fn() };
      const req = makeReq({ user: { _id: 'u1' }, params: { teacherId: 't1' } });
      const res = makeRes();
      // Mock Promise.all behavior: first call returns currentUser, second returns targetUser
      User.findById.mockResolvedValueOnce(currentUser);
      User.findById.mockResolvedValueOnce(targetUser);

      // Simulate not following then follow
      currentUser.following.includes = jest.fn().mockReturnValue(false);

      await toggleFollowTeacher(req, res);

      expect(currentUser.following.push).toHaveBeenCalledWith('t1');
      expect(targetUser.followers.push).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
