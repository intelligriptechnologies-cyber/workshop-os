export type CognitoConfig = {
  mode: "cognito";
  clientId: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  logoutEndpoint: string;
  callbackUri: string;
  logoutUri: string;
  scopes: string[];
};

export type AuthConfig = CognitoConfig | { mode: "local"; allowDemo: boolean };

export type SessionMembership = {
  id: string;
  displayName: string;
  email: string;
  status: "INVITED" | "ACTIVE" | "ARCHIVED";
  roleIds: string[];
  roles: Array<{ id: string; name: string; permissions: string[] }>;
  branchIds: string[];
  branches: Array<{ id: string; name: string }>;
  permissions: string[];
  version: number;
};

export type WorkshopSession = { membership: SessionMembership; tenant: { id: string; name: string } };

type Tokens = { accessToken: string; refreshToken?: string; expiresAt: number };
const TOKEN_KEY = "workshopos.cognito.tokens.v1";
const OAUTH_KEY = "workshopos.cognito.oauth.v1";
const READ_CACHE_KEY = "workshopos.auth.read-cache.v1";
const READ_CACHE_VERSION = 1;

export type AuthenticatedApiReachability = {
  status: "online" | "offline";
  lastSuccessfulAt?: string;
};

type CachedRead = { body: string; contentType: string; savedAt: string };
type ReadCache = { version: number; scope: string; entries: Record<string, CachedRead> };

let cacheScope: string | undefined;
let apiReachability: AuthenticatedApiReachability = { status: "online" };
const reachabilityListeners = new Set<(value: AuthenticatedApiReachability) => void>();

function safeSessionStorage() {
  try { return sessionStorage; } catch { return undefined; }
}

function emitReachability(next: AuthenticatedApiReachability) {
  apiReachability = next;
  reachabilityListeners.forEach((listener) => listener(next));
}

function markOnline() {
  emitReachability({ status: "online", lastSuccessfulAt: new Date().toISOString() });
}

function markOffline() {
  emitReachability({ status: "offline", lastSuccessfulAt: apiReachability.lastSuccessfulAt });
}

function cacheKey(path: string) {
  return `GET ${path}`;
}

function readCache() {
  const storage = safeSessionStorage();
  if (!storage || !cacheScope) return undefined;
  try {
    const saved = storage.getItem(READ_CACHE_KEY);
    if (!saved) return undefined;
    const parsed = JSON.parse(saved) as ReadCache;
    return parsed.version === READ_CACHE_VERSION && parsed.scope === cacheScope ? parsed : undefined;
  } catch { return undefined; }
}

function writeCache(cache: ReadCache) {
  try { safeSessionStorage()?.setItem(READ_CACHE_KEY, JSON.stringify(cache)); } catch { /* Caching is optional. */ }
}

function cacheRead(path: string, response: Response, scopeAtRequest: string | undefined) {
  if (!scopeAtRequest || !response.headers.get("content-type")?.includes("application/json")) return;
  response.clone().text().then((body) => {
    // Never let a late response from a previous tenant/membership populate the new scope.
    if (cacheScope !== scopeAtRequest) return;
    const existing = readCache() ?? { version: READ_CACHE_VERSION, scope: scopeAtRequest, entries: {} };
    existing.entries[cacheKey(path)] = { body, contentType: response.headers.get("content-type") ?? "application/json", savedAt: new Date().toISOString() };
    writeCache(existing);
  }).catch(() => { /* A failed clone is never cached. */ });
}

function cachedRead(path: string) {
  const entry = readCache()?.entries[cacheKey(path)];
  return entry ? new Response(entry.body, { status: 200, headers: { "content-type": entry.contentType, "x-workshopos-cache": "stale", "x-workshopos-cache-saved-at": entry.savedAt } }) : undefined;
}

function invalidateAuthenticatedSession() {
  try { safeSessionStorage()?.removeItem(TOKEN_KEY); } catch { /* Session storage may be unavailable. */ }
  clearAuthenticatedReadCache();
  cacheScope = undefined;
}

function sessionScope(session: WorkshopSession) {
  const membership = session.membership;
  return JSON.stringify({
    tenant: session.tenant.id,
    membership: membership.id,
    version: membership.version,
    roles: membership.roleIds.slice().sort(),
    branches: membership.branchIds.slice().sort(),
    permissions: membership.permissions.slice().sort(),
  });
}

/** Sets the only cache namespace allowed for authenticated API reads. */
export function setAuthenticatedCacheScope(session: WorkshopSession) {
  const nextScope = sessionScope(session);
  if (cacheScope === nextScope) return;
  cacheScope = nextScope;
  clearAuthenticatedReadCache();
  // clearAuthenticatedReadCache intentionally removes prior scopes, then restore this empty scope.
  writeCache({ version: READ_CACHE_VERSION, scope: nextScope, entries: {} });
}

/** Removes every cached authenticated response, including another tenant's old namespace. */
export function clearAuthenticatedReadCache() {
  try { safeSessionStorage()?.removeItem(READ_CACHE_KEY); } catch { /* Storage may be unavailable. */ }
}

export function getAuthenticatedApiReachability() {
  return apiReachability;
}

export function subscribeAuthenticatedApiReachability(listener: (value: AuthenticatedApiReachability) => void) {
  reachabilityListeners.add(listener);
  return () => reachabilityListeners.delete(listener);
}

const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function sha256(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function randomValue() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export async function loadAuthConfig(): Promise<AuthConfig> {
  const localDemo = import.meta.env.DEV || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  try {
    const response = await fetch("/api/v1/auth/config", { headers: { accept: "application/json" } });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) return { mode: "local", allowDemo: localDemo };
    return await response.json() as AuthConfig;
  } catch {
    return { mode: "local", allowDemo: localDemo };
  }
}

export async function beginCognitoLogin(config: CognitoConfig) {
  const verifier = randomValue();
  const state = randomValue();
  sessionStorage.setItem(OAUTH_KEY, JSON.stringify({ verifier, state }));
  const url = new URL(config.authorizationEndpoint);
  url.search = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.callbackUri,
    scope: config.scopes.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: base64Url(await sha256(verifier)),
  }).toString();
  location.assign(url);
}

async function exchange(config: CognitoConfig, values: URLSearchParams): Promise<Tokens> {
  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: values,
  });
  if (!response.ok) throw new Error("Cognito sign-in could not be completed.");
  const payload = await response.json() as { access_token: string; refresh_token?: string; expires_in: number };
  return { accessToken: payload.access_token, refreshToken: payload.refresh_token, expiresAt: Date.now() + payload.expires_in * 1000 };
}

async function tokens(config: CognitoConfig): Promise<Tokens | undefined> {
  const saved = sessionStorage.getItem(TOKEN_KEY);
  if (!saved) return undefined;
  const current = JSON.parse(saved) as Tokens;
  if (current.expiresAt > Date.now() + 30_000) return current;
  if (!current.refreshToken) return undefined;
  const refreshed = await exchange(config, new URLSearchParams({
    grant_type: "refresh_token", client_id: config.clientId, refresh_token: current.refreshToken,
  }));
  refreshed.refreshToken = current.refreshToken;
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(refreshed));
  return refreshed;
}

export async function completeCognitoCallback(config: CognitoConfig) {
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  if (!code) return;
  const saved = sessionStorage.getItem(OAUTH_KEY);
  const oauth = saved ? JSON.parse(saved) as { verifier: string; state: string } : undefined;
  if (!oauth || params.get("state") !== oauth.state) throw new Error("Cognito sign-in state was invalid.");
  const result = await exchange(config, new URLSearchParams({
    grant_type: "authorization_code", client_id: config.clientId, code,
    redirect_uri: config.callbackUri, code_verifier: oauth.verifier,
  }));
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(result));
  sessionStorage.removeItem(OAUTH_KEY);
  history.replaceState({}, document.title, `${location.pathname}${location.hash}`);
}

export async function authenticatedFetch(config: CognitoConfig, path: string, init: RequestInit = {}) {
  const current = await tokens(config);
  if (!current) throw new Error("AUTHENTICATION_REQUIRED");
  const method = (init.method ?? "GET").toUpperCase();
  const scopeAtRequest = cacheScope;
  if (method !== "GET" && apiReachability.status === "offline") throw new Error("OFFLINE_READ_ONLY");
  try {
    const response = await fetch(path, { ...init, headers: { ...init.headers, authorization: `Bearer ${current.accessToken}`, accept: "application/json" } });
    if (response.status === 401 || response.status === 403) {
      invalidateAuthenticatedSession();
      return response;
    }
    if (response.status >= 500) throw new Error("API_UNREACHABLE");
    markOnline();
    if (method === "GET" && init.cache !== "no-store" && response.ok) cacheRead(path, response, scopeAtRequest);
    return response;
  } catch (error) {
    markOffline();
    if (method === "GET" && init.cache !== "no-store") {
      const cached = cachedRead(path);
      if (cached) return cached;
    }
    throw error instanceof Error && error.message === "API_UNREACHABLE" ? error : new Error("API_UNREACHABLE");
  }
}

export async function loadWorkshopSession(config: CognitoConfig): Promise<WorkshopSession | undefined> {
  await completeCognitoCallback(config);
  const current = await tokens(config);
  if (!current) return undefined;
  const response = await authenticatedFetch(config, "/api/v1/session");
  if (response.status === 401 || response.status === 403) return undefined;
  if (!response.ok) throw new Error((await response.json() as { code?: string }).code ?? "SESSION_FAILED");
  const session = await response.json() as WorkshopSession;
  setAuthenticatedCacheScope(session);
  return session;
}

/** A no-cache authenticated probe used by the app shell at startup and on reconnect. */
export async function checkAuthenticatedApiReachability(config: CognitoConfig) {
  const response = await authenticatedFetch(config, "/api/v1/session", { cache: "no-store" });
  if (response.status === 401 || response.status === 403) throw new Error("AUTHENTICATION_REQUIRED");
  if (!response.ok) throw new Error("API_UNREACHABLE");
  const session = await response.json() as WorkshopSession;
  setAuthenticatedCacheScope(session);
  return getAuthenticatedApiReachability();
}

export function endCognitoSession(config: CognitoConfig) {
  invalidateAuthenticatedSession();
  const url = new URL(config.logoutEndpoint);
  url.search = new URLSearchParams({ client_id: config.clientId, logout_uri: config.logoutUri }).toString();
  location.assign(url);
}
