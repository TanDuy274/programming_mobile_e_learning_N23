/** @type {import('jest').Config} */
const commonIgnore = [
  // Allow listed packages to be transformed by Babel/Jest (ESM code)
  "node_modules/(?!(react-native|react-native-reanimated|react-native-toast-message|react-native-css-interop|react-native-tab-view|react-native-pager-view|react-native-popup-menu|@react-native|@react-navigation|expo(nent)?|@expo|expo-router|expo-modules-core|expo-font|expo-secure-store|expo-asset|expo-constants|expo-linking|msw)/)",
];

module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "jest-expo",
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.unit.ts"],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
      transformIgnorePatterns: commonIgnore,
      testMatch: ["**/__tests__/unit/**/*.(spec|test).(ts|tsx|js)"],
      coverageDirectory: "coverage/unit",
    },
    {
      displayName: "integration",
      preset: "jest-expo",
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.integration.ts"],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
      transformIgnorePatterns: commonIgnore,
      testMatch: ["**/__tests__/integration/**/*.(spec|test).(ts|tsx|js)"],
      coverageDirectory: "coverage/integration",
    },
  ],
};
