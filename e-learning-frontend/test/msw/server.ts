/* eslint-disable */
import { handlers } from "./handlers";

// Use dynamic import for MSW to avoid ESM issues
let setupServer: any;
try {
  const msw = require("msw/node");
  setupServer = msw.setupServer;
} catch {
  // Fallback no-op server if msw/node cannot be resolved
  setupServer = () => ({
    listen: () => {},
    resetHandlers: () => {},
    close: () => {},
  });
}

export const server = setupServer(...handlers);
