# New backend forks hyperflow_forge and runs as a new site in the existing bench

Rather than building a fresh Frappe app from zero, the new WorkshopOS backend is forked from hyperflow_forge — reusing its proven state-machine pattern, role gating, and stock-flow plumbing — and deployed as a new site (e.g. `workshop_os.localhost`) inside the same running Docker/bench setup at `~/hyperflow-forge/frappe_docker`, rather than a separate frappe_docker stack. Reason: that infrastructure is already proven working (confirmed via `docker ps`/bench exec), and a new site gives full DB isolation from hyperflow_forge's own site without the setup cost of a second container stack. The trade-off accepted: the two projects now share host infrastructure (container, bench, Docker Desktop/WSL2 backend), so an infra-level incident (e.g. bench upgrade, container restart) can affect both.

## Consequences

- WorkshopOS's Frappe app is a distinct app installed into a distinct site, not a fork of the hyperflow_forge app's doctypes in place — see ADR-0003 for why the domain doctypes themselves are new, not repurposed.
- Environment note: this bench only runs via Docker Desktop's WSL2 backend, since Hyper-V is unavailable on this machine's Windows 11 Home edition — a constraint on where this stack can be developed, not just deployed.
