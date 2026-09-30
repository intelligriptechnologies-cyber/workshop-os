# Issue tracker: GitHub

Issues and specifications for WorkshopOS live in GitHub Issues for `intelligriptechnologies-cyber/workshop-os`. Use the `gh` CLI for operations.

## Conventions

- Create an issue: `gh issue create --title "..." --body "..."`.
- Read an issue: `gh issue view <number> --comments`.
- List issues: `gh issue list --state open` with the appropriate labels.
- Comment: `gh issue comment <number> --body "..."`.
- Close: `gh issue close <number> --comment "..."`.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Wayfinding operations

Wayfinder maps are GitHub issues labelled `wayfinder:map`; their decision tickets are child issues labelled `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`.

Use GitHub sub-issues and native issue dependencies where enabled. A claimed ticket is assigned to the driving developer. Resolution consists of a comment, closure, and a linked one-line entry in the map's **Decisions so far** section. If sub-issues or dependencies are unavailable, record `Part of #<map>` and `Blocked by: #<issue>` in the child issue body.
