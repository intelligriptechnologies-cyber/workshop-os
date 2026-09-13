# Use accessible production resource dialogs

Status: Planned  
Implements: V12-R003, V12-R004  
Blocked by: V12-01

## Outcome

Create shared accessible create/edit and reason-command dialogs and demonstrate them on the production-backed tracer resource.

## Acceptance criteria

- [ ] Keyboard and screen-reader users can open, complete, validate, cancel, and save create/edit dialogs with focus trapped and restored.
- [ ] Attempting to close a dirty dialog requires an explicit discard decision; a clean dialog closes directly.
- [ ] A policy-marked exceptional command cannot submit without a valid reason and records that reason; ordinary save does not request one.
- [ ] Automated accessibility/component and end-to-end tests exercise the public dialog behavior.

## Evidence

Pending.

