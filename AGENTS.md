Before making UI changes, read `DESIGN.md` and follow its tokens and rationale. Do not invent colors, spacing, typography, or component variants unless the design file is missing the needed token.
Before planning or implementing project work, read `docs/project/current-focus.md` and `docs/project/milestones.md`. Treat those files as the local source of truth for milestone order, scope, and current priorities. Do not query external systems unless the local project docs are missing or explicitly stale.
If you update Linear project structure, milestones, issue scope, or priorities, or if you detect that the local project docs are outdated, sync `docs/project/current-focus.md`, `docs/project/milestones.md`, `docs/project/timeline.md`, and any affected milestone files in the same work session so the local planning layer stays authoritative.
After completing work tied to Linear issues or milestones, update the relevant Linear tickets with current progress, verification evidence, and any remaining blockers before reporting completion.

<claude-mem-context>
# Memory Context

# [ghenortrs] recent context, 2026-05-12 3:21pm GMT-3

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 12 obs (3,643t read) | 82,217t work | 96% savings

### May 11, 2026
243 11:42a ✅ code-review-graph MCP and AGENTS.md setup for ghenortrs
244 11:58a 🔵 code-review-graph does not support --tools flag on serve
245 11:59a 🔵 ghenortrs project structure and design identity
246 12:00p 🔵 ghenortrs has 7 HTML prototype iterations in temp/
247 " ✅ AGENTS.md enriched with project context and graph update instructions
248 12:01p ✅ AGENTS.md committed to ghenortrs main branch
### May 12, 2026
342 1:18p 🚨 TanStack Supply Chain Compromise Check + Renovate Policy Hardening
343 " 🔵 ghenortrs Has No TanStack Dependencies
344 " 🔵 ghenortrs Confirmed Clear of All TanStack Compromise Indicators
345 1:19p 🔵 pnpm Not Installed; Corepack Fails Due to No Network Access
346 " 🔵 pnpm 11.1.1 Available via Corepack with Network Access
347 1:20p ✅ pnpm Migration Started: packageManager Pinned and pnpm-workspace.yaml Created

Access 82k tokens of past work via get_observations([IDs]) or mem-search skill.
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
