// Minimal mock for expo-router
module.exports = {
  useRouter: () => ({ push: () => {}, back: () => {}, replace: () => {} }),
  useSegments: () => [],
  Link: ({ children }) => children || null,
};
