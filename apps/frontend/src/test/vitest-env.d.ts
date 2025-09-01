/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: Required for testing library integration
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    // biome-ignore lint/suspicious/noExplicitAny: Required for testing library integration
    extends TestingLibraryMatchers<any, void> {}
}
