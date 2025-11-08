jest.mock('../../../models/CategoryModel');
jest.mock('../../../models/CourseModel');

const Category = require('../../../models/CategoryModel');
const Course = require('../../../models/CourseModel');
const { createCourse } = require('../../../controllers/courseController');

const makeReq = (user, body) => ({ user, body });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('courseController.createCourse', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 403 if user is not teacher', async () => {
    const req = makeReq({ _id: 'u1', role: 'student' }, {});
    const res = makeRes();

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'User is not a teacher' });
  });

  it('should return 400 if category not found', async () => {
    const req = makeReq({ _id: 't1', role: 'teacher' }, { title: 'T', description: 'D', price: 10, category: 'c1' });
    const res = makeRes();
    Category.findById.mockResolvedValue(null);

    await createCourse(req, res);

    expect(Category.findById).toHaveBeenCalledWith('c1');
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should create course and return 201 on success', async () => {
    const req = makeReq({ _id: 't1', role: 'teacher' }, { title: 'T', description: 'D', price: 10, category: 'c1', lessons: [] });
    const res = makeRes();
    Category.findById.mockResolvedValue({ _id: 'c1' });

    // Mock Course constructor to return object with save
    const savedCourse = { _id: 'course1', title: 'T' };
    Course.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(savedCourse) }));

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedCourse);
  });
});
