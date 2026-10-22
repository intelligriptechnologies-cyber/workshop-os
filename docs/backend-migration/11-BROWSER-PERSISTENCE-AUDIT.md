# 11 — Browser persistence audit

Audit date: 2026-10-21. **Source behavior VERIFIED; actual existing browser contents UNVERIFIED.** Storage IDs below complement the entity and operation IDs in documents 05 and 06.

## Storage ownership and precedence

| ID | Mechanism / key | Contents | Initialization, reads, writes and precedence |
|---|---|---|---|
| STORE-01 | localStorage `workshopos.sqlite.v2`, fallback `workshopos.sqlite.v1` | Base64 SQL.js database: workshop customers, jobs, estimates, invoices, payments, inventory, procurement, bookings, leads and other tables inventoried in 05 | `src/db.ts:156–186`: v2 wins by null-coalescing, then v1; only absent saved bytes cause fetch of `workshopos-demo.sqlite`. SQL.js loads bytes into memory, creates/migrates schema, seeds if users are empty, ensures demo staff, then persists v2. This is not a merge with the shipped fixture. An invalid present v2 is not equivalent to an absent value. |
| STORE-02 | localStorage `workshopos.delivery-dates.2026-10-09.v1` | Initialization marker | For an existing saved database without the marker, delivery-date fixture updates apply to qualifying NEW/IN_PROGRESS/HOLD jobs. Marker is then written. Preserving bytes without marker can change the result on next initialization. |
| STORE-03 | sessionStorage `workshopos.admin-demo.v2`, fallback `.v1` | Role grants, company settings/assets, theme, templates and active selections, logs, import batches, session inventory | `src/admin-demo-state.ts:493–585`: load parses and hydrates defaults, repairs version-dependent template/default invariants; save writes retained state. Tab/origin-specific business configuration, not merely visual preferences. Reset is a mutation and was not invoked. |
| STORE-04 | sessionStorage `workshopos.documentSnapshots.v1` plus module memory cache | Frozen document HTML, values, lines, template identity, job/number, frozen/void timestamps | `src/document-snapshots.ts`, snapshot synchronization in App: estimates approved, invoices cleared, receipts/gate passes created and voids can freeze documents. Later template/company edits must not rewrite history. Storage failures can leave memory-only snapshots. |
| STORE-05 | sessionStorage `workshopos.developer-control-plane.v1` | Demo tenants, charges/payments and simulated communications | `src/developer-control-plane.ts:85–90`: parse/validate stored state or create defaults; mutations save JSON. Separate from workshop SQL tables; simulation is not evidence of actual billing transactions. |
| STORE-06 | Browser authentication storage: `workshopos.cognito.tokens.v1`, `workshopos.cognito.oauth.v1` | Tokens and OAuth flow state | Auth client controls these; do not export tokens/cookies into migration documentation or business-data packages. Authentication state is not a demo dataset. |
| STORE-07 | Cache Storage / service worker `workshopos-static-v3` | Shell, manifest/icons, static assets | `public/sw.js`: same-origin GET handling, network-first navigation, cache-first `/assets`; `/api` excluded. No explicit standalone demo-SQLite cache rule. Cache is not the authoritative business database; a fresh offline initialization is not guaranteed. |
| STORE-08 | React/module memory | Draft forms, selected rows, open dialogs; live SQL.js contents including uploaded image bytes | Not uniformly durable. The live database and exported storage database are intentionally different for images. |
| STORE-09 | IndexedDB / other client databases | No application IndexedDB persistence found in the indexed source audit | This is a source finding, not proof that a user's browser has no older/third-party database. Actual origin inventory remains UNVERIFIED. |

Exact storage matches: [storage source evidence](stage15-storage-source.md). Full initialization, persistence, hydration and snapshot function contracts: [exported operations](evidence-operation-contracts.md), [private helpers](evidence-private-data-contracts.md). Full types/default settings remain in [05](05-CURRENT-DATA-AND-DEMO-DATA.md) and [type evidence](evidence-types-and-constants.md).

## Persistence is not a single atomic store

`persist` (`src/db.ts:188–199`) exports a clone through `exportPersistableDatabase` (`201–217`), encodes it and replaces the entire localStorage value. The clone strips uploaded image rows identified by nonempty MIME type or `data:image` content and resets photo evidence before vacuuming. Uploaded bytes may remain in the live database but do not survive this persistence path. File/media durability must therefore be specified explicitly; copying only localStorage does not capture everything visible in the current session.

`App` mutation orchestration (`src/App.ts:840–891`) invokes commands, persists and refreshes state, and synchronizes document snapshots. Persistence occurs outside the command error handler. A quota/storage exception can follow an otherwise completed in-memory command. SQL savepoints cannot make localStorage plus sessionStorage atomic. Two tabs can overwrite entire snapshots without detecting each other's business edits. Session settings and document history can diverge between tabs even when localStorage is shared.

Remote mode still initializes the local database and snapshot machinery. Selecting remote authentication does not by itself eliminate browser persistence. Frontend/API routing is assessed in [12](12-EXISTING-BACKEND-ASSESSMENT.md).

**Yes: browser data can contain records absent from every shipped SQLite file.** Ordinary local commands insert/update business records; subsequent launches prefer stored bytes over the public fixture. Session-only templates, configuration and frozen documents are separate datasets. Whether such records exist in the client's current profile is UNVERIFIED.

## Access limitations in this stage

The available browser inventory contained only `about:blank`; the computer-use inventory exposed no browser or native-app surfaces. No approved application origin/profile/tab with existing records was available. No app was loaded to inspect storage, because initialization itself performs schema/default/persistence writes. Stage-1 screenshots show earlier tested states, not a present-day storage export. DB-02's filename is not evidence that it captures the current client session.

Unverified: current origins and profiles, key existence and byte hashes, current row counts, unsaved/live records, current image bytes, per-tab settings/documents, IndexedDB databases, cache contents, storage quotas and real offline behavior. No claim is made that the currently running PostgreSQL database matches any browser dataset.

## Safe export procedure for later approval — EXPORT-01

1. Obtain approval for the specific profile, origin and existing tab, destination directory and data handling. Record scheme/host/port, profile, tab identity and timestamp. Do not reload, navigate, reset, import fixtures or call `openWorkshopDb`.
2. In that existing tab's storage inspector, read only the whitelisted business keys STORE-01–05, including both legacy/current keys and the migration marker. Record absence separately from an empty value. Read sessionStorage separately for each relevant tab. Exclude authentication keys, cookies and all token values.
3. Prepare an export object in memory using only `getItem`; after approval, save a new uniquely named file outside application persistence. Do not call `setItem`, `removeItem`, `clear`, seeding or migration helpers. Preserve original values before parsing; attach hashes and origin metadata.
4. Decode SQLite base64 into a **new** approved evidence file outside the live application. Hash it; inspect using a read-only connection. Do not feed it back through application startup. Compare all tables/keys against DB-01 and record conflicts without merging.
5. Read IndexedDB database names/versions using `indexedDB.databases()` where supported. If unsupported, use the browser storage inspector. Never open a guessed database: opening a nonexistent name creates it. For confirmed existing databases, a separately approved export may read stores in readonly transactions, with no upgrade handler. List Cache Storage names/entries without adding or deleting entries.
6. Ask whether current in-memory images/drafts must be retained. The React-held SQL.js instance may not be externally accessible. A debugger-assisted export of an already-existing live instance needs a separately reviewed procedure; do not reinitialize the database or inject app changes to obtain it. Until obtained, live-only images remain UNVERIFIED and potentially absent from the export.
7. Validate hashes, counts and provenance, then request an explicit reconciliation decision for overlapping IDs, browser-only records, document snapshots and settings. Approval to export is not approval to merge or migrate.

This procedure is documented only; it was not executed.
