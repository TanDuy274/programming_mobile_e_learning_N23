// Auto-generated on 2025-11-06 14:11:25
jest.mock("dotenv", () => ({ config: () => ({ parsed: {} }) }));
jest.mock("../config/db", () => jest.fn());
afterEach(() => {
  jest.clearAllMocks();
});
