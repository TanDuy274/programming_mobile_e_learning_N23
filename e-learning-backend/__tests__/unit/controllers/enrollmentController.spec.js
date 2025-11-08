jest.mock('../../../models/EnrollmentModel');
jest.mock('../../../models/CourseModel');
jest.mock('../../../models/UserModel');

const Enrollment = require('../../../models/EnrollmentModel');
const Course = require('../../../models/CourseModel');
const UserModel = require('../../../models/UserModel');
const {
  enrollInCourse,
  getMyCourses,
  updateEnrollmentProgress,
  enrollFromCart,
} = require('../../../controllers/enrollmentController');

const makeReq = (opts = {}) => ({ params: opts.params || {}, body: opts.body || {}, user: opts.user || {} });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('enrollmentController', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('enrollInCourse', () => {
    it('returns 404 when course not found', async () => {
      const req = makeReq({ params: { courseId: 'c1' }, user: { _id: 'u1' } });
      const res = makeRes();
      Course.findById.mockResolvedValue(null);

      await enrollInCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith('c1');
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('creates enrollment and returns 201', async () => {
      const req = makeReq({ params: { courseId: 'c1' }, user: { _id: 'u1' } });
      const res = makeRes();
      Course.findById.mockResolvedValue({ _id: 'c1' });
      Enrollment.create.mockResolvedValue({ _id: 'e1', user: 'u1', course: 'c1' });

      await enrollInCourse(req, res);

      expect(Enrollment.create).toHaveBeenCalledWith({ user: 'u1', course: 'c1' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: 'e1' }));
    });

    it('handles duplicate enrollment error code 11000', async () => {
      const req = makeReq({ params: { courseId: 'c1' }, user: { _id: 'u1' } });
      const res = makeRes();
      Course.findById.mockResolvedValue({ _id: 'c1' });
      Enrollment.create.mockRejectedValue({ code: 11000 });

      await enrollInCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getMyCourses', () => {
    it('returns enrollments with computed duration', async () => {
      const lesson = { duration: 10 };
      const fakeEnrollment = {
        toObject: () => ({ course: { lessons: [lesson] } }),
      };
      const req = makeReq({ user: { _id: 'u1' } });
      const res = makeRes();
  // Controller calls Enrollment.find(...).populate(...)
  Enrollment.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([fakeEnrollment]) });

      await getMyCourses(req, res);

      expect(Enrollment.find).toHaveBeenCalledWith({ user: 'u1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('updateEnrollmentProgress', () => {
    it('returns 404 when enrollment not found', async () => {
      const req = makeReq({ params: { enrollmentId: 'e1' }, body: { progress: 10 }, user: { _id: 'u1' } });
      const res = makeRes();
      Enrollment.findById.mockResolvedValue(null);

      await updateEnrollmentProgress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 401 when not owner', async () => {
      const enrollment = { user: 'other', save: jest.fn() };
      const req = makeReq({ params: { enrollmentId: 'e1' }, body: { progress: 10 }, user: { _id: 'u1' } });
      const res = makeRes();
      Enrollment.findById.mockResolvedValue(enrollment);

      await updateEnrollmentProgress(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('updates and returns enrollment when owner', async () => {
      const enrollment = { user: 'u1', save: jest.fn().mockResolvedValue({ _id: 'e1', progress: 10 }) };
      const req = makeReq({ params: { enrollmentId: 'e1' }, body: { progress: 10 }, user: { _id: 'u1' } });
      const res = makeRes();
      Enrollment.findById.mockResolvedValue(enrollment);

      await updateEnrollmentProgress(req, res);

      expect(enrollment.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ progress: 10 }));
    });
  });

  describe('enrollFromCart', () => {
    it('returns 400 when courseIds invalid', async () => {
      const req = makeReq({ body: { courseIds: [] }, user: { _id: 'u1' } });
      const res = makeRes();

      await enrollFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 404 when user not found', async () => {
      const req = makeReq({ body: { courseIds: ['c1'] }, user: { _id: 'u1' } });
      const res = makeRes();
      UserModel.findById.mockResolvedValue(null);

      await enrollFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 400 when no valid selected ids', async () => {
  const user = { _id: 'u1', cart: [], save: jest.fn() };
      const req = makeReq({ body: { courseIds: ['c1'] }, user: { _id: 'u1' } });
      const res = makeRes();
      UserModel.findById.mockResolvedValue(user);

      await enrollFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 200 when all selected already enrolled (no new enrollments)', async () => {
  const cart1 = ['c1'];
  cart1.pull = jest.fn();
  const user = { _id: 'u1', cart: cart1, save: jest.fn() };
      const req = makeReq({ body: { courseIds: ['c1'] }, user: { _id: 'u1' } });
      const res = makeRes();
      UserModel.findById.mockResolvedValue(user);
      Enrollment.find.mockResolvedValue([{ course: 'c1' }]);

      await enrollFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('creates enrollments and returns 201 on success', async () => {
  const cart2 = ['c1', 'c2'];
  cart2.pull = jest.fn();
  const user = { _id: 'u1', cart: cart2, save: jest.fn() };
      const req = makeReq({ body: { courseIds: ['c1', 'c2'] }, user: { _id: 'u1' } });
      const res = makeRes();
      UserModel.findById.mockResolvedValue(user);
      Enrollment.find.mockResolvedValue([]);
      Enrollment.insertMany.mockResolvedValue([{ _id: 'e1' }, { _id: 'e2' }]);

      await enrollFromCart(req, res);

      expect(Enrollment.insertMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ enrolledCourses: expect.any(Array) }));
    });
  });
});
