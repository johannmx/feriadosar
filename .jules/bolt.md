# Bolt's Journal - Critical Learnings Only

# Bolt's Journal - Critical Learnings Only

## 2026-06-18 - [API Promise Caching & Calendar Memoization]
**Learning:** In applications showing year-bound static data (like holidays), redundant network requests on user toggles and redundant Date object instantiations / Array creations in layout components during theme shifts are significant bottlenecks.
**Action:** Cache the API request Promises in-memory by key to handle concurrent and sequential loads instantly (0ms), and memoize layout grid parameters (Date/Array constructs) using `useMemo` to keep renders lightning-fast during theme/state toggles.
