jest.mock('../../../models/QuestionModel');

const Question = require('../../../models/QuestionModel');
const { getQuestionsForCourse, createQuestion } = require('../../../controllers/questionController');

const makeReq = (opts = {}) => ({ params: opts.params || {}, body: opts.body || {}, user: opts.user || {} });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('questionController', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getQuestionsForCourse', () => {
    it('returns list of questions', async () => {
      const req = makeReq({ params: { courseId: 'c1' } });
      const res = makeRes();
      // Controller calls Question.find(...).populate(...).sort(...)
      Question.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: 'q1' }]) }) });

      await getQuestionsForCourse(req, res);

      expect(Question.find).toHaveBeenCalledWith({ course: 'c1' });
      expect(res.json).toHaveBeenCalledWith([{ _id: 'q1' }]);
    });
  });

  describe('createQuestion', () => {
    it('returns 400 when text missing', async () => {
      const req = makeReq({ body: { courseId: 'c1', text: '' }, user: { _id: 'u1' } });
      const res = makeRes();

      await createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('creates and returns populated question', async () => {
      const req = makeReq({ body: { courseId: 'c1', text: 'Q?' }, user: { _id: 'u1' } });
      const res = makeRes();
      const created = { _id: 'q1' };
      const populated = { _id: 'q1', user: { name: 'U' } };
      // Mock constructor to return object with save()
      Question.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(created) }));
      // Mock findById(...).populate(...) chain to return populated document
      Question.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(populated) });

      await createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(populated);
    });
  });
});
