function bypassAuth() {
  jest.doMock("../middlewares/authMiddleware", () => ({
    protect: (req, _res, next) => { req.user = { _id: "u1" }; next(); },
  }));
}
module.exports = { bypassAuth };
