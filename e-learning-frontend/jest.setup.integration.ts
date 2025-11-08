/* eslint-disable */
import "@testing-library/jest-native/extend-expect";
import "whatwg-fetch";

// Use same manual mocks as unit (resolved from __mocks__ directory)
jest.mock("expo-router");
jest.mock("react-native-reanimated");
jest.mock("react-native-safe-area-context");

// Increase timeout for slower integration tests
jest.setTimeout(20000);

// Polyfill TextEncoder/TextDecoder for Node environment (MSW requirement)
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as any;
}

// Mock fetch for integration tests (simple fallback if MSW not used)
// This allows tests to run even if MSW has issues
const originalFetch = global.fetch;
if (!originalFetch || typeof originalFetch !== "function") {
  global.fetch = (async () => {
    return {
      ok: true,
      status: 200,
      json: async () => ({ docs: [] }),
      text: async () => "{}",
    } as Response;
  }) as any;
}
