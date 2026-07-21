# src/contexts/ — global state

## AssumptionsContext

The app's central state. Holds `userAssumptions` (minimal diff from defaults, or null) and exposes the memoized `combinedAssumptions` everything calculates from, plus mutators (`replaceCategoryEffects`, `replaceRecipientCategoryEffects`, `setAllUserAssumptions`, resets, `getNormalizedUserAssumptionsForSharing`).

- Persistence: applied `userAssumptions` round-trip through versioned localStorage (`activeAppliedAssumptions:v1`) so they survive closing the tab. `customEffectsData` remains as a sessionStorage compatibility/fallback mirror: the initializer prefers the durable value, falls back to the session value for migration or blocked localStorage, validates both, and discards corrupted/incompatible data with a console error. Resetting to defaults writes an explicit JSON `null` tombstone to the durable key and clears the session mirror. An absent durable key means "never had state" and permits session-mirror migration, so do not simplify the tombstone back to key removal. Keep these guards and precedence rules.
- All mutators normalize through `apiHelpers.normalizeUserAssumptions`, which **throws** on data the current schema doesn't know. Editor-produced data always passes; external data (saved library entries, shared links) is caught at the call sites in `AssumptionsSelector`, `AssumptionsPage`, and `GlobalSharedAssumptionsImport` — any new load path must catch and notify too.
- The context value is memoized: mutators are one stable `useMemo` object (they close over only the setter and module-scope defaults — safe in consumer dependency arrays), and `getNormalizedUserAssumptionsForSharing` returns a value memoized per `userAssumptions` change. Keep new context fields inside the value memo, and don't add mutators that close over render-scope state (that would break the stable-identity contract consumers rely on).

## NotificationContext

The pattern to copy: split state/actions contexts, memoized action callbacks, stale-timeout guard on auto-dismiss. `showNotification(type, text, options)` — type first (`'success' | 'error' | 'info'`).
