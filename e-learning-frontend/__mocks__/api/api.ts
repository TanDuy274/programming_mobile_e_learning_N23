// Mock for api/api.ts
const mockApi = {
  defaults: {
    headers: {
      common: {} as Record<string, string>,
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

export default mockApi;
