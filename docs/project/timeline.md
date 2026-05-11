# GHENO Timeline

Source: Linear milestone targets
Last synced: 2026-05-11

## Sequence

| Phase             | Target     | Milestone                                 | Notes                                                                                                                        |
| ----------------- | ---------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Discovery         | 2026-05-01 | `M0: Discovery And Project Definition`    | Lock references, content structure, and destination mapping before implementation spreads. Verified locally on `2026-05-11`. |
| Foundation        | 2026-05-08 | `M1: Vite Architecture Setup`             | Establish the app shell, tooling, tokens, and routing baseline. Implemented and re-verified locally on `2026-05-11`.         |
| UI Build          | 2026-05-15 | `M2: Landing Page MVP`                    | Implement the core landing page experience using the locked content architecture and CTA contract.                           |
| Lead Capture      | 2026-05-22 | `M3: B2B Lead Capture`                    | Add the commercial conversion path.                                                                                          |
| Commerce Bridge   | 2026-05-29 | `M4: Nuvemshop Commerce Bridge`           | Connect the marketing surface to the store.                                                                                  |
| Launch Hardening  | 2026-06-05 | `M5: SEO, Analytics, Performance, And QA` | Validate, instrument, and optimize for launch.                                                                               |
| Deferred Research | 2026-06-12 | `M6: Deferred Integration Research`       | Keep non-critical R&D outside the main delivery path.                                                                        |

## Operating Rules

- Treat the timeline as ordered, not parallel by default.
- `M2` can now proceed because `M0` and `M1` both have usable local inputs.
- Treat the current app shell as the approved technical baseline for `M2`, and use the restored content-architecture doc as the narrative contract for homepage work.
- Keep `M6` out of active implementation unless explicitly requested.
- If work starts to span multiple milestones, split it and record the dependency in the relevant milestone file.
