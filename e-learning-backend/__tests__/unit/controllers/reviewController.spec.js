jest.mock('../../../models/ReviewModel');
jest.mock('../../../models/CourseModel');
jest.mock('../../../models/EnrollmentModel');

const Review = require('../../../models/ReviewModel');
const Course = require('../../../models/CourseModel');
const Enrollment = require('../../../models/EnrollmentModel');
const { createCourseReview, getCourseReviews } = require('../../../controllers/reviewController');

const makeReq = (opts = {}) => ({ params: opts.params || {}, body: opts.body || {}, user: opts.user || {} });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('reviewController', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createCourseReview', () => {
    it('returns 403 when not enrolled', async () => {
      const req = makeReq({ params: { courseId: 'c1' }, body: { rating: 5 }, user: { _id: 'u1' } });
      const res = makeRes();
      Enrollment.findOne.mockResolvedValue(null);

      await createCourseReview(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('creates review and updates course stats', async () => {
      const req = makeReq({ params: { courseId: 'c1' }, body: { rating: 5, comment: 'ok' }, user: { _id: 'u1' } });
      const res = makeRes();
      Enrollment.findOne.mockResolvedValue({ _id: 'e1' });
      Review.create.mockResolvedValue({ _id: 'r1', rating: 5 });
      Course.findById.mockResolvedValue({ save: jest.fn(), reviewCount: 0, rating: 0 });
      Review.find.mockResolvedValue([{ rating: 5 }]);

      await createCourseReview(req, res);

      expect(Review.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: 'r1' }));
    });
  });

  describe('getCourseReviews', () => {
    it('returns reviews array', async () => {
      const req = makeReq({ params: { courseId: 'c1' } });
      const res = makeRes();
      // Controller calls Review.find(...).populate(...)
      Review.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([{ _id: 'r1' }]) });

      await getCourseReviews(req, res);

      expect(Review.find).toHaveBeenCalledWith({ course: 'c1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ _id: 'r1' }]);
    });
  });
});
