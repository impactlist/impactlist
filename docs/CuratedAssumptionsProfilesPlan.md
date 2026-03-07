# Curated Assumptions Profiles Plan

## Context

The app currently has three assumptions concepts:

- `Default` assumptions derived from generated content data
- `Local` saved assumptions stored in `localStorage`
- `Imported` assumptions created from shared links and also stored locally

What is missing is a set of project-owned, hard-coded assumption profiles that:

- live in the repository, not in browser storage
- are editable through content files
- automatically appear in the Assumptions Library
- can be loaded like any other library entry
- remain distinct from both local and remote/shared assumptions

## Goals

1. Add a content-backed source of curated assumptions profiles.
2. Make curated profiles automatically appear in the Assumptions Library.
3. Keep curated profiles separate from local and imported entries in both data model and UI.
4. Reuse the app's existing normalized `userAssumptions` override shape so loading a curated profile works exactly like loading any other assumptions set.
5. Make curated profiles forkable: once loaded, users can modify them and save a local copy without mutating the curated definition.

## Naming

Use `Curated Assumptions Profiles` in planning and implementation language.

Initial curated profile names:

- `AI X-Risk Skeptic`
- `Animal Welfarist + AI X-Risk Skeptic`
- `Longtermist`

Note: use the spelling `Welfarist`, not `Welfareist`.

## Product Behavior

### Assumptions Library

The Assumptions Library should contain four kinds of entries:

- `Default`
- `Curated`
- `Local`
- `Remote` or `Imported`

Curated entries should:

- appear automatically without any browser save/import step
- be loadable the same way as other entries
- show a `Curated` source badge
- optionally show a read-only description/rationale
- not be renamable
- not be deletable
- not count against local storage limits

### Loading Behavior

Loading a curated profile should:

1. replace the current `userAssumptions` state with the curated profile's assumptions payload
2. set the active assumptions library entry to that curated profile
3. leave the curated source definition untouched

If the user edits a loaded curated profile, the current state becomes a modified fork of that curated baseline.

Implications:

- the library should show unsaved changes when current assumptions differ from the active curated entry
- `Save to Library` should create a new local entry
- `Update Current Library Entry` should not be available for curated entries

### Description Behavior

Curated entries may have content-backed descriptions or rationale text.

That content should be:

- viewable from the library
- read-only in the UI
- stored in the repository alongside the profile definition

## Data Model

### Recommended Content Location

Add a new directory:

- `content/assumptions/profiles/`

This keeps curated profiles near the existing assumptions-related content while avoiding collision with the current `content/assumptions/*.md` assumption-article files used by `AssumptionDetail`.

### File Format

Each curated profile should be a markdown file with YAML frontmatter.

Recommended schema:

```yaml
---
id: ai-risk-skeptic
name: 'AI Risk Skeptic'
description: 'Disables AI existential risk and the AGI development doom penalty.'
sortOrder: 10
assumptions:
  categories:
    ai-risk:
      effects:
        - effectId: population
          disabled: true
    ai-capabilities:
      effects:
        - effectId: population-doom
          disabled: true
---
```

Markdown body:

- optional long-form rationale shown read-only in the library

### Assumptions Payload Shape

Store `assumptions` in the exact same shape as normalized `userAssumptions`:

- `globalParameters`
- `categories`
- `recipients`

This is important because the app already knows how to:

- normalize that payload
- merge it into defaults
- compute fingerprints from it
- load it into the editor via `setAllUserAssumptions`

Curated profiles should store only diffs from default assumptions, not full copies of all assumptions.

## Generated Data Integration

### Generator Changes

Extend `scripts/generate-data-from-markdown.js` to load curated profile files from:

- `content/assumptions/profiles/*.md`

Export a new generated object:

- `curatedAssumptionProfilesById`

Recommended generated shape:

```js
export const curatedAssumptionProfilesById = {
  'ai-risk-skeptic': {
    id: 'ai-risk-skeptic',
    name: 'AI Risk Skeptic',
    description: 'Disables AI existential risk and the AGI development doom penalty.',
    sortOrder: 10,
    assumptions: {
      categories: {
        'ai-risk': {
          effects: [{ effectId: 'population', disabled: true }],
        },
      },
    },
    content: 'Optional markdown rationale...',
  },
};
```

### Validation Rules

The generator should fail fast if a curated profile:

- is missing `id`
- is missing `name`
- is missing `assumptions`
- references a category that does not exist
- references a recipient that does not exist
- references an effect ID that does not exist for the target category/recipient
- includes invalid assumptions payload structure

The generator should also normalize assumptions against defaults so content authors cannot accidentally store default-equivalent no-op overrides.

## Runtime Integration

### Separate Curated Source From Local Storage

Do not insert curated entries into `savedAssumptionsStore`.

Reasoning:

- curated entries are repository data, not user data
- they should not consume localStorage quota
- they should not be evicted by library storage limits
- they should not participate in rename/delete/update flows meant for user-managed entries

Instead:

1. keep `savedAssumptionsStore` responsible only for `local` and `imported` entries
2. add a small adapter that maps generated curated profiles into the same library entry shape used by the page
3. merge curated entries with saved entries at the page level

### Library Entry Shape

Curated entries should adapt to the existing library item shape with:

```js
{
  id: 'curated:ai-risk-skeptic',
  label: 'AI Risk Skeptic',
  description: 'Disables AI existential risk and the AGI development doom penalty.',
  source: 'curated',
  reference: null,
  assumptions: { ...normalizedOverrides },
  fingerprint: '...',
  shareUrl: null,
  content: 'Optional markdown rationale',
}
```

Using a namespaced ID avoids collisions with local/imported UUIDs.

### Assumptions Page Changes

Update the assumptions page to compose the library from:

1. built-in `Default`
2. generated curated entries
3. stored local/imported entries

The page should:

- identify whether the active entry is curated
- allow `Load` for curated entries
- block rename/delete/update actions for curated entries
- allow viewing curated descriptions/content

## Initial Curated Profiles

### 1. AI X-Risk Skeptic

Intent:

- remove value assigned to AI existential risk
- remove the negative existential-risk component from AGI development

Recommended payload:

```yaml
assumptions:
  categories:
    ai-risk:
      effects:
        - effectId: population
          disabled: true
    ai-capabilities:
      effects:
        - effectId: population-doom
          disabled: true
```

### 2. Animal Welfarist + AI X-Risk Skeptic

Intent:

- value animal welfare using human-equivalent weighting rather than the current chicken discount
- remove value assigned to AI existential risk
- remove the negative existential-risk component from AGI development

Recommended payload:

```yaml
assumptions:
  categories:
    ai-risk:
      effects:
        - effectId: population
          disabled: true
    ai-capabilities:
      effects:
        - effectId: population-doom
          disabled: true
    animal-welfare:
      effects:
        - effectId: standard
          costPerQALY: 0.8
```

Rationale:

- the current default is `8`
- the category writeup says this is based on chickens having roughly 10% of human welfare range
- removing that discount implies a first-pass 10x improvement, so `0.8` is the natural starting point

This should be treated as a product choice, not an implementation constraint. If the underlying moral-weight interpretation changes, the curated profile can be adjusted in content without code changes.

### 3. Longtermist

Intent:

- show results over a very long horizon

Recommended payload:

```yaml
assumptions:
  globalParameters:
    timeLimit: 10000000000
```

This profile changes only the time horizon and otherwise preserves default assumptions.

## UI Implications

### SavedAssumptionsPanel

Update the library panel so it can render `curated` entries with:

- `Curated` badge
- `Load` button
- description/view action if content exists
- no rename action
- no delete action
- no copy-link action unless a future product requirement adds one

### Save Modal

When the active entry is curated and the user has unsaved changes:

- allow `Save as New`
- do not allow `Update Current Library Entry`

### Active Entry and Dirty State

Dirty-state logic should compare the current assumptions fingerprint against the active curated entry fingerprint exactly the same way it does for local/imported entries.

## Implementation Phases

### Phase 1: Content and Generator

- add `content/assumptions/profiles/`
- define profile frontmatter schema
- extend generator to load curated profiles
- validate references and effect IDs
- export `curatedAssumptionProfilesById`

### Phase 2: Runtime Adapters

- add helper(s) to map generated curated profiles into assumptions library entries
- reuse existing fingerprint utilities
- keep curated data separate from `savedAssumptionsStore`

### Phase 3: Assumptions Page Integration

- merge curated entries into the library list
- support loading curated entries
- track active curated entry IDs
- preserve existing replace-confirmation behavior when overwriting unsaved custom assumptions

### Phase 4: Library UI Rules

- add `Curated` badge/state
- hide rename/delete/update-current actions for curated entries
- allow read-only description/rationale viewing

### Phase 5: Seed Initial Profiles

- add `AI Risk Skeptic`
- add `Animal Welfarist`
- add `Longtermist`

### Phase 6: Tests

- generator tests for curated profile parsing and validation
- assumptions page tests for curated entries appearing in the library
- load-flow tests for applying curated profiles
- dirty-state tests after modifying a loaded curated profile
- UI tests confirming curated entries cannot be renamed or deleted

## Non-Goals

- creating a backend API for curated profiles
- making curated profiles user-editable in place
- syncing curated profiles into localStorage
- allowing users to publish curated profiles as shared links automatically

## Open Questions

1. Should curated profiles sort above or below local/imported entries in the library? Recommendation: place curated entries immediately below `Default`, then show saved entries below them.
2. Should the library badge say `Curated` or `Built-in`? Recommendation: `Curated`, because it better explains why these are opinionated presets.
3. Should long-form rationale content open in the existing assumptions description modal or in a dedicated modal? Recommendation: reuse the existing modal first if it can cleanly support read-only rich text.
