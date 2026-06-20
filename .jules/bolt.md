# Bolt's Journal - Critical Learnings Only

## 2026-06-20 - [Calendar Grid Rendering Optimization via Precomputation]
**Learning:** In grid-based calendar layouts, inline operations (like string formatting, Date calculations, Map lookups, and CSS class conditional building) executed 365+ times per render can noticeably lag rendering, especially when theme toggles trigger component updates.
**Action:** Lift all rendering attributes (including conditional styling, today markers, and holiday lookups) into a single unified `useMemo` that processes when data dependencies change, and wrap the component in React's `memo` to bypass visual rendering during theme-only state changes.

## 2026-06-18 - [API Promise Caching & Calendar Memoization]
**Learning:** In applications showing year-bound static data (like holidays), redundant network requests on user toggles and redundant Date object instantiations / Array creations in layout components during theme shifts are significant bottlenecks.
**Action:** Cache the API request Promises in-memory by key to handle concurrent and sequential loads instantly (0ms), and memoize layout grid parameters (Date/Array constructs) using `useMemo` to keep renders lightning-fast during theme/state toggles.

## 2026-06-12 - Node 24+ Global Storage Shadowing in JSDOM Tests
**Learning:** In Node 24+, native `localStorage` and `sessionStorage` getters exist on `globalThis`. When testing with Vitest/Jest and the `jsdom` environment, accessing the unconfigured native `globalThis.localStorage` causes `TypeError` or warnings instead of correctly falling back to JSDOM's mock storage.
**Action:** Unconditionally delete the native properties and define JSDOM-safe or custom `MockStorage` instances on `globalThis` within `setupTests.ts` to ensure compatibility across Node versions.
