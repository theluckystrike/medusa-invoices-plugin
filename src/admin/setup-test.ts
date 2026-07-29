import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window properties if needed
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollTo
window.Element.prototype.scrollTo = () => {};

// Mock requestAnimationFrame
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60);
