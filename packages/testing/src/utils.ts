import { vi } from 'vitest';

// Wait for async operations
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create a mock function with typed return
export function createMockFn<T extends (...args: unknown[]) => unknown>(
  implementation?: T
) {
  return vi.fn(implementation);
}

// Mock fetch responses
export interface MockFetchResponse {
  ok?: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
  headers?: Headers;
}

export function mockFetch(response: MockFetchResponse | unknown): void {
  const mockResponse: MockFetchResponse =
    typeof response === 'object' && response !== null && 'ok' in response
      ? (response as MockFetchResponse)
      : {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: () => Promise.resolve(response),
          text: () => Promise.resolve(JSON.stringify(response)),
          headers: new Headers(),
        };

  global.fetch = vi.fn().mockResolvedValue(mockResponse);
}

export function mockFetchError(error: Error | string): void {
  const err = typeof error === 'string' ? new Error(error) : error;
  global.fetch = vi.fn().mockRejectedValue(err);
}

export function mockFetchSequence(responses: (MockFetchResponse | unknown)[]): void {
  const mockFn = vi.fn();
  responses.forEach((response, index) => {
    const mockResponse: MockFetchResponse =
      typeof response === 'object' && response !== null && 'ok' in response
        ? (response as MockFetchResponse)
        : {
            ok: true,
            status: 200,
            json: () => Promise.resolve(response),
          };
    mockFn.mockResolvedValueOnce(mockResponse);
  });
  global.fetch = mockFn;
}

// Mock localStorage
export function mockLocalStorage(initialData: Record<string, string> = {}): {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
} {
  const store: Record<string, string> = { ...initialData };

  const mock = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };

  Object.defineProperty(window, 'localStorage', {
    value: mock,
    writable: true,
  });

  return mock;
}

// Mock timers helper
export function useFakeTimers() {
  vi.useFakeTimers();
  return {
    advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
    runAllTimers: () => vi.runAllTimers(),
    restore: () => vi.useRealTimers(),
  };
}

// Generate test data
export function generateTestId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function generateTestEmail(): string {
  return `test-${generateTestId()}@example.com`;
}

export function generateTestUser() {
  const id = generateTestId();
  return {
    id,
    email: `user-${id}@example.com`,
    name: `Test User ${id}`,
    avatar: `https://example.com/avatars/${id}.png`,
  };
}

// Assert helpers
export function expectToBeInDocument(element: HTMLElement | null): asserts element is HTMLElement {
  if (!element) {
    throw new Error('Expected element to be in the document');
  }
}

export function expectNotToBeInDocument(element: HTMLElement | null): void {
  if (element) {
    throw new Error('Expected element not to be in the document');
  }
}

// Form testing helpers
export async function fillForm(
  getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement,
  getByLabelText: (text: string | RegExp) => HTMLElement,
  fields: Record<string, string>,
  userEvent: { type: (element: HTMLElement, text: string) => Promise<void> }
): Promise<void> {
  for (const [label, value] of Object.entries(fields)) {
    const input = getByLabelText(new RegExp(label, 'i'));
    await userEvent.type(input, value);
  }
}

// Accessibility helpers
export function getAccessibleName(element: HTMLElement): string | null {
  return element.getAttribute('aria-label') || element.textContent;
}

export function hasAccessibleName(element: HTMLElement, name: string | RegExp): boolean {
  const accessibleName = getAccessibleName(element);
  if (!accessibleName) return false;
  if (typeof name === 'string') return accessibleName === name;
  return name.test(accessibleName);
}
