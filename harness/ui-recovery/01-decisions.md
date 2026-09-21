# UI Recovery Decisions

- D-1 | Reuse existing production APIs and dialog primitives | Reject backend rewrites and parallel browser persistence | Preserve PostgreSQL authority.
- D-2 | Introduce one shared tenant workspace | Reject repeated per-page navigation | Centralize identity, navigation, and responsive behavior.
- D-3 | Keep demo, tenant, and platform workspaces explicitly scoped | Reject ambient shared navigation | Preserve security and CSS isolation.
- D-4 | Migrate route families incrementally with observable contracts | Reject a single rewrite | Enable tracer-bullet verification and atomic commits.
- D-5 | Record absent server mutations as deferred | Reject frontend-only fake CRUD | Preserve truthfulness and authority.
- D-6 | Use Playwright fixtures and real local PostgreSQL gates | Reject screenshot-only acceptance | Protect behavior and presentation.
