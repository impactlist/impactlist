# Saved Assumptions Feature Plan

## Context

The app already supports link-based sharing of custom assumptions:

- Users can create a share link from the assumptions page.
- Shared links open on the main rankings route (`/?shared=<reference>`).
- Shared assumptions are imported globally and can replace current assumptions after confirmation.

What is missing is durable, local, user-managed storage of assumption sets for quick switching.

## Feature Name and UI Naming

Use **Saved Assumptions** consistently across product and code:

- Feature: `Saved Assumptions`
- Primary local-save button: `Save Assumptions`
- List/panel title: `Saved Assumptions`

Do not use `Scenario` terminology in UI copy.

## Goals

1. Users can save the current assumptions locally without generating a link.
2. Users can quickly switch between saved assumptions without reopening links.
3. Shared imports are auto-captured in the same local library.
4. Users can manage library entries (load, rename, delete, bulk cleanup for imported items).
5. The system is robust under localStorage limits/failures and does not silently lose data.

## Product Behavior

### Top-Level Actions on `/assumptions`

- `Save Assumptions` (local-only save)
- `Share Assumptions` (create public link via existing backend)

### Saved Assumptions Panel Placement

Render a `Saved Assumptions` panel **above the assumptions editor** (not below), so it is visible without long scrolling:

- Desktop: expanded by default.
- Mobile: collapsed by default with clear toggle.

### Saved Assumptions Panel Content

List entries newest-first with:

- Label
- Source badge: `Local` or `Imported`
- Last loaded / last updated timestamp
- Active indicator
- Unsaved changes indicator (when current assumptions differ from active saved entry)
- Actions:
  - `Load`
  - `Rename`
  - `Delete`
  - `Copy Link` (only when `reference` exists)

Additional cleanup control:

- `Delete All Imported` (one click, with confirmation)

### Shared Import Auto-Capture

Every successful shared import is automatically upserted into `Saved Assumptions`.

- No opt-out on import.
- Imported entries are clearly marked and easy to remove.
- After successful import + upsert, set `activeSavedAssumptionsId` to that imported entry.

### Save Assumptions Flow

When user clicks `Save Assumptions`:

1. Call editor method `commitPendingAssumptionsEdits()`.
2. If method returns `{ ok: false, message }`, show message and stop.
3. If there is an active saved entry and assumptions are dirty relative to it:
   - Modal presents two explicit actions:
     - `Update Current Saved Assumptions`
     - `Save as New`
   - Modal pre-fills label with active entry label.
4. If no active entry, normal save modal creates a new entry.

## Data Model

LocalStorage keys:

- `savedAssumptions:v1`
- `activeSavedAssumptionsId:v1`
- `savedAssumptionsMigration:v1`

Entry schema:

```json
{
  "id": "uuid-v4",
  "label": "Conservative longtermist model",
  "source": "local",
  "reference": null,
  "assumptions": {
    "globalParameters": {},
    "categories": {},
    "recipients": {}
  },
  "fingerprint": "canonical-json-string",
  "createdAt": "2026-02-25T...Z",
  "updatedAt": "2026-02-25T...Z",
  "lastLoadedAt": null,
  "userRenamed": false
}
```

For imported entries:

- `source: "imported"`
- `reference: "slug-or-id"`

Notes:

- `shareUrl` is not stored (derive from `reference`).
- IDs generated with browser-native `crypto.randomUUID()`.
- `lastLoadedAt` is retained and used by eviction policy.

## Identity / Fingerprint Strategy (Final System)

Use a synchronous canonical normalized JSON string as fingerprint.

Why:

- Avoid async complexity from `crypto.subtle.digest()` in render-time dirty checks.
- Payload sizes are small enough for string comparison.
- Deterministic and testable.

Fingerprint rules:

1. Normalize assumptions to schema-safe JSON.
2. Canonicalize key ordering deterministically.
3. Store canonical string as `fingerprint`.
4. Equality checks compare fingerprint strings directly.

This replaces `stableStringify` usage for identity checks in the Saved Assumptions system.

## LocalStorage Limits and Failure Handling

Assume localStorage is quota-constrained and shared across origin.

Hard limits:

- Max entries: `25`
- Max serialized size for `savedAssumptions:v1`: `250 KB`

Write strategy:

1. Build candidate dataset in memory.
2. Apply pre-write compaction/eviction.
3. Attempt `setItem` in `try/catch`.
4. On failure, retry once with stricter imported-entry pruning.
5. If still failing, abort save and show error.

No silent failures. No silent destructive writes.

User-facing error copy (example):

- `Could not save assumptions locally. Delete some saved assumptions and try again.`

## Eviction Policy (Non-Silent)

Eviction happens **before write**, deterministically.

Order:

1. Imported entries not loaded recently (`source=imported`, oldest `lastLoadedAt` then `updatedAt`)
2. Local entries oldest `lastLoadedAt`
3. Local entries oldest `updatedAt`

If any eviction occurs, show notification:

- `Removed N old imported assumptions to make room.`

If still over limit after allowable eviction, fail save with explicit message.

## Import Upsert Policy (Avoid Data Loss)

Upsert by `reference` for imported entries, with preservation rules:

- Preserve `label` if `userRenamed === true`.
- Preserve user-managed metadata fields.
- Update assumptions payload + fingerprint + timestamps.

Repeated imports of the same link should not clobber user labels.

## Active Saved Assumptions Semantics

- `activeSavedAssumptionsId` indicates the entry currently loaded.
- If current fingerprint differs from active entry fingerprint, show `Unsaved changes`.
- Loading from shared link updates active ID to the upserted imported entry.

## Migration Story

Existing users may have active assumptions in `customEffectsData` but no Saved Assumptions library.

On first launch after release:

1. If `customEffectsData` exists and `savedAssumptions:v1` is empty, show one-time prompt:
   - `Save current assumptions to Saved Assumptions?`
2. If accepted:
   - Create initial local entry (default label: `My Current Assumptions`).
   - Set `activeSavedAssumptionsId` to that entry.
3. If declined:
   - Do not create entry.
   - Leave `activeSavedAssumptionsId` null.
4. In both cases, set `savedAssumptionsMigration:v1` so prompt is truly one-time.

## Editor Ref Contract

Refactor `prepareForShare` into generic editor method:

- `commitPendingAssumptionsEdits()`

Contract is explicit and unchanged in style:

```ts
{ ok: true }
{ ok: false, message: string }
```

Use this same method for both `Save Assumptions` and `Share Assumptions`.

## Implementation Phases

### Phase 1: Storage Layer and Contracts

Create `src/utils/savedAssumptionsStore.js` with:

- `getSavedAssumptions()`
- `saveNewAssumptions({ label, assumptions, source, reference })`
- `updateSavedAssumptions(id, updates)`
- `renameSavedAssumptions(id, label)`
- `deleteSavedAssumptions(id)`
- `deleteAllImportedAssumptions()`
- `loadSavedAssumptionsById(id)`
- `setActiveSavedAssumptionsId(id | null)`
- `getActiveSavedAssumptionsId()`
- canonical fingerprint helpers
- migration helpers

### Phase 2: UI and Assumptions Page Integration

- Add `Save Assumptions` button and modal.
- Add `Saved Assumptions` panel above editor.
- Add active-entry indicator and unsaved-change badge.
- Wire `Load` with replace confirmation.
- Implement `Update Current Saved Assumptions` vs `Save as New` flows.

### Phase 3: Shared Import Auto-Capture Integration

Update `GlobalSharedAssumptionsImport` to auto-upsert imported entries and set active ID to imported entry after successful apply.

### Phase 4: Hardening and Polish

- Eviction notifications.
- Accessibility pass for panel/modals.
- Performance pass on canonical fingerprinting.
- Final copy polish.

## File Plan

New files:

- `src/utils/savedAssumptionsStore.js`
- `src/utils/savedAssumptionsStore.test.js`
- `src/components/SaveAssumptionsModal.jsx`
- `src/components/SavedAssumptionsPanel.jsx`
- `src/components/SavedAssumptionsPanel.test.jsx`

Modified files:

- `src/pages/AssumptionsPage.jsx`
- `src/components/AssumptionsEditor.jsx` (ref contract rename)
- `src/components/shared/GlobalSharedAssumptionsImport.jsx`

## Testing Strategy

### Unit Tests

- Store read/write under normal conditions.
- Hard limit enforcement (`25`, `250KB`).
- Quota exception handling and error paths.
- Eviction ordering and eviction notification triggers.
- Import upsert metadata preservation (`userRenamed`).
- Canonical fingerprint generation and equality semantics.
- Migration accept/decline behavior.

### Integration Tests

- Save assumptions creates local entry and shows in panel.
- Load assumptions applies values and updates active marker.
- Edit after load sets unsaved state.
- Save-over-active updates same entry.
- Save-as-new creates distinct entry.
- Shared import auto-captures and sets active imported entry.
- Delete imported and bulk delete imported behavior.

## Acceptance Criteria

1. User can save, load, rename, and delete local saved assumptions.
2. Shared imports are automatically captured and easy to remove.
3. Active saved assumptions state is visible and accurate.
4. Unsaved changes relative to active entry are detectable.
5. System handles localStorage limits/failures without silent data loss.
6. Labels and metadata are not accidentally overwritten by repeated imports.
