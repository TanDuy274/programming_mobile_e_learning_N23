jest.mock('../../../models/ProjectModel');

const Project = require('../../../models/ProjectModel');
const { getProjectsForCourse, createProject } = require('../../../controllers/projectController');

const makeReq = (opts = {}) => ({ params: opts.params || {}, body: opts.body || {}, user: opts.user || {} });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('projectController', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getProjectsForCourse', () => {
    it('returns projects list', async () => {
      const req = makeReq({ params: { courseId: 'c1' } });
      const res = makeRes();
      // Controller calls Project.find(...).populate(...).sort(...)
      Project.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: 'p1' }]) }) });

      await getProjectsForCourse(req, res);

      expect(Project.find).toHaveBeenCalledWith({ course: 'c1' });
      expect(res.json).toHaveBeenCalledWith([{ _id: 'p1' }]);
    });
  });

  describe('createProject', () => {
    it('creates project and returns populated', async () => {
      const req = makeReq({ body: { courseId: 'c1', description: 'D' }, user: { _id: 'u1' } });
      const res = makeRes();
      const created = { _id: 'p1' };
      const populated = { _id: 'p1', user: { name: 'U' } };
      Project.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(created) }));
      Project.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(populated) });

      await createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(populated);
    });
  });
});
