// Test setup is imported separately via vitest.config.ts
// import './setup';

// Render utilities
export {
  render,
  renderWithProviders,
  screen,
  waitFor,
  within,
  fireEvent,
  userEvent,
  type CustomRenderOptions,
  type WrapperOptions,
} from './render';

// Test utilities
export {
  waitFor as wait,
  createMockFn,
  mockFetch,
  mockFetchError,
  mockFetchSequence,
  mockLocalStorage,
  useFakeTimers,
  generateTestId,
  generateTestEmail,
  generateTestUser,
  expectToBeInDocument,
  expectNotToBeInDocument,
  fillForm,
  getAccessibleName,
  hasAccessibleName,
} from './utils';

// Re-export vitest utilities for convenience
export { vi, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
