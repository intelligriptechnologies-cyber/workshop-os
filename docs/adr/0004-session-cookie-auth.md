# Session-cookie auth via Frappe login replaces Cognito

The frontend authenticates against Frappe's native `/api/method/login` using session cookies (CORS configured for the frontend origin), rather than static API-key/secret tokens or keeping Cognito in front of Frappe. Reason: WorkshopOS's existing UX is password login against a small set of named demo users per role — session-cookie auth matches that flow directly, while Cognito is being retired with the rest of `production/` (ADR-0001) and static API keys don't model a per-user login/logout flow.

## Considered options

- Static API-key/secret tokens per user: rejected — works well for service-to-service calls, but doesn't naturally support a login/logout UX or session expiry the way cookie auth does.
- Keep Cognito in front, bridge to Frappe: rejected — reintroduces the exact external auth dependency ADR-0001 is removing, for a demo/dev-stage app with no compliance requirement forcing it.
