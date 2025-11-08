import "@testing-library/jest-native/extend-expect";
import "whatwg-fetch";

// Use manual mocks in __mocks__ to avoid out-of-scope references in factories
jest.mock("expo-router");
jest.mock("react-native-reanimated");
jest.mock("react-native-safe-area-context");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("expo-secure-store");

// Mock @expo/vector-icons to prevent Icon setState warnings
jest.mock("@expo/vector-icons");

// Suppress console errors in tests (except for actual test failures)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress specific React warnings that are expected in tests
    if (
      typeof args[0] === "string" &&
      (args[0].includes("An update to") ||
        args[0].includes("not wrapped in act") ||
        args[0].includes("Fetch data error"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
