# Bolt's Journal

## 2026-06-12 - Node 24+ Global Storage Shadowing in JSDOM Tests
**Learning:** In Node 24+, native `localStorage` and `sessionStorage` getters exist on `globalThis`. When testing with Vitest/Jest and the `jsdom` environment, accessing the unconfigured native `globalThis.localStorage` causes `TypeError` or warnings instead of correctly falling back to JSDOM's mock storage.
**Action:** Unconditionally delete the native properties and define JSDOM-safe or custom `MockStorage` instances on `globalThis` within `setupTests.ts` to ensure compatibility across Node versions.
