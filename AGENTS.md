Before making UI changes, read `DESIGN.md` and follow its tokens and rationale. Do not invent colors, spacing, typography, or component variants unless the design file is missing the needed token.
Before planning or implementing project work, read `docs/project/current-focus.md` and `docs/project/milestones.md`. Treat those files as the local source of truth for milestone order, scope, and current priorities. Do not query external systems unless the local project docs are missing or explicitly stale.
If you update Linear project structure, milestones, issue scope, or priorities, or if you detect that the local project docs are outdated, sync `docs/project/current-focus.md`, `docs/project/milestones.md`, `docs/project/timeline.md`, and any affected milestone files in the same work session so the local planning layer stays authoritative.
If you change the site's routes, product positioning, B2B flow, commerce boundary, or other externally visible project facts, update `public/llms.txt` in the same work session so LLM-facing project guidance stays accurate.
After completing work tied to Linear issues or milestones, update the relevant Linear tickets with current progress, verification evidence, and any remaining blockers before reporting completion.

<claude-mem-context>
# Memory Context

# [ghenortrs] recent context, 2026-05-13 11:17pm GMT-3

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (17,047t read) | 160,840t work | 89% savings

### May 12, 2026
S41 Observer session monitoring autonomous gnhf iteration 14 finalizing GHENO MTB landing page mobile improvements (May 12 at 6:23 PM)
S40 Iteration 11: Design fidelity improvements to GHENO MTB landing page — mobile-menu.png reviewed, hero headline and proof bar upgraded to match design reference (May 12 at 6:23 PM)
S42 GHENO MTB Landing Page — Autonomous Implementation Observer (Iterations 1–43, M0–M6 Complete) (May 12 at 6:27 PM)
S43 GHENO MTB landing page — iteration 21 design fidelity audit and B2B CTA correction (May 12 at 7:02 PM)
S44 GHENO M2 Landing Page - Mobile hamburger navigation implemented in iteration 11 (May 12 at 7:02 PM)
S45 Observer session monitoring GHENO MTB landing page implementation — iteration 19 design fidelity review and fixes (May 12 at 7:03 PM)
### May 13, 2026
567 5:18a 🔵 Complete Component Directory Structure After Refactor
568 " 🔄 App.tsx Updated to Import Card Components from section-cards.tsx
569 " 🔵 Iteration 23 Entry State: Only ComponentsPage Remains as >=80-Line Hotspot
570 " 🔵 AppShell and B2BPage Structure in App.tsx
571 " 🔄 App.tsx Reduced from 1971 to 1835 Lines After First Extraction
572 " 🔄 Final src/App.tsx: 30-Line Pure Route Wiring
573 " 🔵 Remaining Large Functions in App.tsx After Iteration 5
574 " 🔵 Current >=80-Line Function Hotspots in src/components (Iteration 20 Baseline)
575 " 🔵 Code Review Graph Shows Stale Line Numbers vs Actual App.tsx
576 " 🔄 ComponentsPage Product Data Extracted to Dedicated Data Module
577 " 🔵 Iteration 12 Has No Uncommitted Code Changes
578 " 🔵 Architecture Graph: 6 Clean Communities, Zero Cross-Community Coupling
579 " 🔵 Code Review Graph Last Updated Before Iteration 7 Changes
580 " 🔵 Six Components Still Exceed 80-Line Threshold at Iteration 18 Start
581 " 🔵 App.tsx Uses React Router DOM (Not Wouter) and @/ Path Aliases
582 " 🔵 AppShell Structure: 322-Line Navigation Shell with Inline Desktop Nav
583 " 🔴 Test Failure: cn Import Removed from App.tsx But Still Used at Line 410
584 " 🔵 Remaining Large Function Hotspots in src/components (>=40 lines)
585 " 🔵 Remaining Size Hotspots After 14 Iterations
586 " 🔴 ESLint Error: CardContent Import Unused After Extraction
587 " 🔵 ComponentsPage Structure: PRODUCT_FAMILIES Data Array + Inline Article Grid
588 " 🔵 App.tsx Uses React Router DOM, Not Query-String Navigation
589 " 🔵 AppShell Contains Footer and Additional Inline Sections Beyond Header
590 " 🔵 Project Status: All Milestones M0-M6 Verified, Launch-Ready
591 " 🔵 cn Used at 3 Locations in App.tsx After Extraction, Not Just Line 410
592 " 🔵 b2b-page.tsx Interface Mismatch: Notes vs Actual Code
593 " 🔵 Component Directory Structure: No pages/ Subdirectory Exists Yet
594 " 🔄 components-page.tsx Slimmed by Removing Inline Product Arrays
595 " 🔄 Extracted MobileMenuActions from mobile-menu-overlay.tsx into Dedicated Module
596 " 🔵 HomePage Structure: Hero Carousel + Highlights Grid + Section Composition
597 " 🔵 App.tsx Structure Diverged from Iteration 1 Notes: Imports and Component Signatures Changed
598 " 🔵 B2BPage Contains Full Inline Lead Form Logic - Primary Extraction Target
599 " 🔴 Fixed App.tsx Imports: Removed CardContent, Restored cn
600 " 🔵 ComponentsPage Structure Analyzed: Already Well-Decomposed Despite 109-Line Count
601 5:19a 🔵 AppHeader Structure Analysis - Iteration 20 Target
602 " 🔵 Post-Data-Extraction Large Function Hotspot Snapshot
603 " 🔵 MobileMenuOverlay Renders QUICK_ACTIONS and AppShell Owns Menu State
604 " 🔵 App.tsx Large Function Inventory After Iteration 2
605 " 🔵 Architecture Graph: 6 Communities, Zero Cross-Community Coupling
606 " 🔵 AppFooter Structure Analysis - SVG Icons Drive Line Count
607 " 🔵 Architecture Graph Updated: MobileMenuActions Adds 2 Nodes, 6 Communities Maintained
608 " 🔵 Component Directory Structure: UI Primitives Extracted, Landing Has One File
609 " 🔄 All 19 Tests Pass After Import Fix — Extraction Iteration 1 Complete
610 " 🔄 mobile-menu-overlay.tsx Reduced from 332 to 120 Lines After MobileMenuActions Extraction
611 " 🔵 AppHeader Structure Analysis - Inline SVGs and Dropdown Drive Line Count
612 " 🔄 Extracted CompetitionProofSection into Dedicated Module
613 " 🔄 Iteration 18: ComponentsPage Catalog Section Extracted into Dedicated Module
614 " 🔵 App.tsx Hook and State Usage Map: B2BPage Owns Most Form Complexity
615 " 🔵 Git Status Shows No New Changes Staged After Data Extraction
616 " 🔵 PRODUCT_FAMILIES Data Differs Between App.tsx and Extracted components-page.tsx

Access 161k tokens of past work via get_observations([IDs]) or mem-search skill.
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
