# Publish versioned inherited Business Settings

Status: Planned  
Implements: V12-R012, V12-R013  
Blocked by: V12-05

## Outcome

Deliver validated tabbed tenant settings, branch inheritance/override/reset, controlled publication, and stable effective snapshots for active work.

## Acceptance criteria

- [ ] Authorized users edit a draft across tabs, see validation and inherited/effective values, override a branch value, and reset it to inherited.
- [ ] Publishing creates an immutable version; a stale publication is rejected and the prior version remains available.
- [ ] A Job started under one settings version continues to use its immutable snapshot after a later publication.
- [ ] Unauthorized branches and users cannot view or mutate settings outside their scope.

## Evidence

Pending.

