function bypassAuth(mockRole = "admin") {
  jest.mock("../../middlewares/authMiddleware", () => ({
    protect: (req, res, next) => {
      req.user = { _id: "u1", role: mockRole }; // role hợp lệ
      next();
    },
    isAdminOrStaff: (req, res, next) => next(),
    adminOnly: (req, res, next) => next(),
  }));
}

module.exports = { bypassAuth };
