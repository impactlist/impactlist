# src/contexts/ — global state

## AssumptionsContext

The app's central state. Holds `userAssumptions` (minimal diff from defaults, or null) and exposes the memoized `combinedAssumptions` everything calculates from, plus mutators (`replaceCategoryEffects`, `replaceRecipientCategoryEffects`, `setAllUserAssumptions`, resets, `getNormalizedUserAssumptionsForSharing`).

- Persistence: `userAssumptions` round-trips through sessionStorage (`CUSTOM_EFFECTS_DATA_KEY`). The initializer parses inside try/catch and discards corrupted/incompatible data (with a console.error) — refresh can't clear storage, so throwing here would brick the tab permanently. Keep that guard.
- All mutators normalize through `apiHelpers.normalizeUserAssumptions`, which **throws** on data the current schema doesn't know. Editor-produced data always passes; external data (saved library entries, shared links) is caught at the call sites in `AssumptionsSelector`, `AssumptionsPage`, and `GlobalSharedAssumptionsImport` — any new load path must catch and notify too.
- The context value is memoized: mutators are one stable `useMemo` object (they close over only the setter and module-scope defaults — safe in consumer dependency arrays), and `getNormalizedUserAssumptionsForSharing` returns a value memoized per `userAssumptions` change. Keep new context fields inside the value memo, and don't add mutators that close over render-scope state (that would break the stable-identity contract consumers rely on).

## NotificationContext

The pattern to copy: split state/actions contexts, memoized action callbacks, stale-timeout guard on auto-dismiss. `showNotification(type, text, options)` — type first (`'success' | 'error' | 'info'`).
