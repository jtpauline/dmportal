import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock browser APIs
vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
});

// Add any global mocks or setup needed for testing
