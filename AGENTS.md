Before making UI changes, read `DESIGN.md` and follow its tokens and rationale. Do not invent colors, spacing, typography, or component variants unless the design file is missing the needed token.
Before planning or implementing project work, read `docs/project/current-focus.md` and `docs/project/milestones.md`. Treat those files as the local source of truth for milestone order, scope, and current priorities. Do not query external systems unless the local project docs are missing or explicitly stale.
If you update Linear project structure, milestones, issue scope, or priorities, or if you detect that the local project docs are outdated, sync `docs/project/current-focus.md`, `docs/project/milestones.md`, `docs/project/timeline.md`, and any affected milestone files in the same work session so the local planning layer stays authoritative.
If you change the site's routes, product positioning, B2B flow, commerce boundary, or other externally visible project facts, update `public/llms.txt` in the same work session so LLM-facing project guidance stays accurate.
After completing work tied to Linear issues or milestones, update the relevant Linear tickets with current progress, verification evidence, and any remaining blockers before reporting completion.

<claude-mem-context>
# Memory Context

# [ghenortrs] recent context, 2026-05-13 1:47am GMT-3

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (19,881t read) | 1,412,982t work | 99% savings

### May 12, 2026
450 6:17p 🔵 UI Component Library — 9 Components Available for M3 Form
452 6:21p 🔵 M2 Landing Page Complete - Linear MCP Unavailable in Autonomous Sessions
453 " 🔵 Project Document Architecture for ghenortrs Landing Page
454 " 🔵 Design Assets Inventory in tmp/ Directory
455 " 🔵 ghenortrs Source Tree Structure
456 6:22p 🔵 Full App.tsx Architecture - All M2 Landing Page Sections Implemented
457 " 🔵 Mobile Homepage Design Reference Loaded for Implementation Comparison
S41 Observer session monitoring autonomous gnhf iteration 14 finalizing GHENO MTB landing page mobile improvements (May 12 at 6:23 PM)
S40 Iteration 11: Design fidelity improvements to GHENO MTB landing page — mobile-menu.png reviewed, hero headline and proof bar upgraded to match design reference (May 12 at 6:23 PM)
459 6:24p 🔵 GHENO M2 Landing Page - Complete Implementation State (Iterations 1-13)
460 " 🔵 Linear MCP Confirmed Absent in Iteration 14 Session
461 6:26p 🔵 GHENO Project File Structure - src/ is Single-File App
462 " 🔵 Design Reference tmp/mobile-homepage.png Reviewed in Iteration 14
S42 GHENO MTB Landing Page — Autonomous Implementation Observer (Iterations 1–43, M0–M6 Complete) (May 12 at 6:27 PM)
469 7:00p 🔵 M2 Landing Page Complete - Linear MCP Unavailable in Autonomous Sessions
470 " 🔵 GHENO Landing Page - Complete M2 Implementation State After 21 Iterations
471 " 🔵 Linear MCP Confirmed Absent in Iteration 10 Autonomous Session
472 " 🔵 GHENO M2 Landing Page - Complete Implementation State (Iterations 1-18)
473 " 🔵 GHENO Landing Page M2 - Complete Implementation History (Iterations 1-20)
474 " 🔵 GHENO M2 Landing Page: Full Iteration History and Current State
475 " 🔵 Linear MCP OAuth Unavailable in Autonomous gnhf Sessions
476 " 🔵 Component Directory Structure Only Has ui/ Subdirectory
477 " 🔵 Landing Page Has Flat Component Architecture - All Sections in App.tsx
478 7:01p 🔵 Project Structure: Monolithic App.tsx with All Components Inlined
479 " 🟣 GHENO Landing Page Full Implementation - src/App.tsx Architecture
480 " 🔵 tmp/ Directory Contains Unused Reference Images Not Yet Used in Implementation
481 " 🔵 App.tsx is 1,271 Lines with All Components Defined Inline
482 " 🔵 App.tsx Full Structure Mapped - 1335 Lines, All Sections Inline
483 " 🔵 GHENO Landing Page Project: Full Iteration History (M0–M6 Complete)
484 " 🔵 Linear MCP Unavailable in All Autonomous gnhf Sessions
485 " 🟣 Vercel Edge Function for B2B Lead Capture (LUA-29)
486 " 🟣 Outbound Click Tracking and Form Analytics (M4/M5)
487 " 🟣 Performance and Accessibility Hardening (M5 LUA-36/37/38)
488 " 🔵 Production Build Clean at 301KB JS / 38KB CSS
489 " 🔵 GHENO Landing Page - Complete src/App.tsx Architecture
490 " 🔵 GHENO Landing Page: Complete Component Architecture in src/App.tsx
491 " 🔵 Optimized Reference Image Inventory in public/reference-images/
492 " 🔵 Public Asset Inventory - 14 Reference Images + 1 Logo Serving Landing Page
493 " 🔵 Design Reference Loaded: mobile-homepage.png Shows Complete Layout Requirements
494 " 🔵 Linear MCP Confirmed Unavailable in Iteration 20
495 " 🔵 Design Reference - Mobile Homepage PNG Analyzed for Iteration 21
496 " 🔵 Unused Reference Images Remaining in tmp/reference_images/
497 " 🔵 Mobile Homepage Design Mockup Reviewed - Implementation Matches Design Intent
498 " 🔵 Production Build Clean at 303KB JS / 39KB CSS at Start of Iteration 22
499 " 🔵 Linear MCP Confirmed Absent in Iteration 43
500 " 🔵 Production Build Verified Clean at Iteration 43 Baseline
501 " 🔵 Mobile Menu Design Reference Inspected in Iteration 20
502 7:02p 🔵 Public Reference Images Inventory - 14 Optimized Assets Currently Deployed
503 " 🔵 Iteration 43 Halted: Project Complete, Linear MCP Blocks Final Ticket Closure
504 " 🔵 Design Reference Files Confirmed - 4 PNG Design Specs in tmp/
S43 GHENO MTB landing page — iteration 21 design fidelity audit and B2B CTA correction (May 12 at 7:02 PM)
S44 GHENO M2 Landing Page - Mobile hamburger navigation implemented in iteration 11 (May 12 at 7:02 PM)
S45 Observer session monitoring GHENO MTB landing page implementation — iteration 19 design fidelity review and fixes (May 12 at 7:03 PM)
### May 13, 2026
505 1:03a 🔵 App.tsx Refactor Progress: 3 Iterations Complete, ~540 Lines Removed
506 1:04a 🔵 App.tsx Architecture: Remaining Extraction Candidates Identified
507 1:05a 🔵 Two Different CompetitionProofSection Versions Exist in App.tsx

Access 1413k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>

<!-- code-review-graph MCP tools -->

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool                        | Use when                                               |
| --------------------------- | ------------------------------------------------------ |
| `detect_changes`            | Reviewing code changes — gives risk-scored analysis    |
| `get_review_context`        | Need source snippets for review — token-efficient      |
| `get_impact_radius`         | Understanding blast radius of a change                 |
| `get_affected_flows`        | Finding which execution paths are impacted             |
| `query_graph`               | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes`     | Finding functions/classes by name or keyword           |
| `get_architecture_overview` | Understanding high-level codebase structure            |
| `refactor_tool`             | Planning renames, finding dead code                    |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. If the graph looks stale, after switching branches, or after larger edits, run `code-review-graph update` from the repo root.
3. If incremental updates seem wrong or you are initializing the repo, run `code-review-graph build`.
4. Use `detect_changes` for code review.
5. Use `get_affected_flows` to understand impact.
6. Use `query_graph` pattern="tests_for" to check coverage.
