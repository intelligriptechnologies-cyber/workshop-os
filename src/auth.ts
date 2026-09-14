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
  status: "INVITED" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
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
  return fetch(path, { ...init, headers: { ...init.headers, authorization: `Bearer ${current.accessToken}`, accept: "application/json" } });
}

export async function loadWorkshopSession(config: CognitoConfig): Promise<WorkshopSession | undefined> {
  await completeCognitoCallback(config);
  const current = await tokens(config);
  if (!current) return undefined;
  const response = await authenticatedFetch(config, "/api/v1/session");
  if (response.status === 401) { sessionStorage.removeItem(TOKEN_KEY); return undefined; }
  if (!response.ok) throw new Error((await response.json() as { code?: string }).code ?? "SESSION_FAILED");
  return response.json() as Promise<WorkshopSession>;
}

export function endCognitoSession(config: CognitoConfig) {
  sessionStorage.removeItem(TOKEN_KEY);
  const url = new URL(config.logoutEndpoint);
  url.search = new URLSearchParams({ client_id: config.clientId, logout_uri: config.logoutUri }).toString();
  location.assign(url);
}
