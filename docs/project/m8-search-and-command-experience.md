# M8: Search And Command Experience

Status: planned
Target: 2026-06-26
Depends on: `M7: Design Polish And Navigation Corrections`
Linear milestone: `M8: Search And Command Experience`

## Goal

Specify and build a command/search experience without guessing the search algorithm or content source.

## Linear Issues

- `LUA-49` Specify search content sources, ranking, and algorithm
- `LUA-50` Make command shortcut hints device-aware — **Done** (2026-05-13)
- `LUA-51` Open keyboard shortcuts from the command palette dialog — **Done** (2026-05-13)
- `LUA-52` Add polished opening animation for search command UI — **Done** (2026-05-13)
- `LUA-53` Implement first working search behavior after spec approval — blocked by `LUA-49`

## Deliverables

- Search behavior specification
- Device-aware `Cmd + K` / `Ctrl + K` shortcut hinting
- No shortcut helper text on mobile
- Keyboard shortcuts dialog
- Search opening animation with reduced-motion support
- First functional search implementation after spec approval

## Included Scope

- Search source and ranking decision
- Command palette usability
- Keyboard and focus behavior
- Empty states and no-results states
- Search animation polish

## Excluded Scope

- Search implementation before the source/ranking spec is approved
- Native product inventory sync unless selected in the spec
- Heavy animation runtime unless explicitly justified
- B2B authenticated search

## Progress

2026-05-13:

- `LUA-50` completed: desktop command shortcut hints detect Mac versus non-Mac systems and mobile no longer shows shortcut helper text.
- `LUA-51` completed: the command palette `Atalhos` row opens an accessible keyboard shortcuts dialog.
- `LUA-52` completed: the command panel opens with a short CSS animation that respects the global reduced-motion rule.
- `LUA-49` and `LUA-53` remain open because the search source, algorithm, and ranking rules are still unspecified.

## Exit Criteria

- Search source, algorithm, and ranking rules are documented.
- Desktop shortcuts show the right modifier for the user's system.
- Mobile does not show keyboard shortcut helper text.
- `Atalhos` opens an accessible dialog listing only implemented shortcuts.
- Search opens smoothly and respects reduced-motion preferences.
- Functional search matches the approved specification.

## Recommended Order

1. Specify search source, ranking, and algorithm.
2. Implement device-aware shortcut display.
3. Add keyboard shortcuts dialog.
4. Add search opening animation.
5. Implement functional search after the spec is approved.

## Risks

- Implementing search before source-of-truth decisions can create throwaway work.
- Nuvemshop product data may require a different search strategy than static site content.
- Shortcut hints can become misleading if mobile or platform detection is too broad.
