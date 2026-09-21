import type { PlatformAuth } from "./platform-admin-api";

const STORAGE_KEY = "workshopos.platform.active-emulation.v1";
type StoredEmulation = { id: string; expiresAt: string; auth: PlatformAuth };

export function activatePlatformEmulation(auth: PlatformAuth, id: string, expiresAt: string) {
  if (!id || !Number.isFinite(Date.parse(expiresAt)) || Date.parse(expiresAt) <= Date.now()) {
    throw new Error("The approved emulation session is not active.");
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, expiresAt, auth } satisfies StoredEmulation));
}

export function clearPlatformEmulation() {
  sessionStorage.removeItem(STORAGE_KEY);
}

function activeEmulation(): StoredEmulation | undefined {
  const requestedId = new URLSearchParams(location.search).get("emulation");
  if (!requestedId) return undefined;
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as StoredEmulation | null;
    if (!value || value.id !== requestedId || Date.parse(value.expiresAt) <= Date.now()) {
      clearPlatformEmulation();
      return undefined;
    }
    return value;
  } catch {
    clearPlatformEmulation();
    return undefined;
  }
}

export function installPlatformEmulationFetch() {
  if (typeof window === "undefined" || (window as any).__workshoposPlatformFetchInstalled) return;
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const session = activeEmulation();
    const requestUrl = new URL(input instanceof Request ? input.url : String(input), location.origin);
    if (!session || requestUrl.origin !== location.origin || !requestUrl.pathname.startsWith("/api/v1/") || requestUrl.pathname.startsWith("/api/v1/platform/")) {
      return original(input, init);
    }
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
    headers.set("x-workshopos-emulation-id", session.id);
    if (session.auth.mode === "local") {
      headers.set("x-workshopos-platform-identity", session.auth.identity);
      headers.set("x-workshopos-platform-mfa-at", session.auth.mfaAuthenticatedAt);
    } else {
      headers.set("x-workshopos-platform-authorization", `Bearer ${session.auth.accessToken}`);
    }
    if (input instanceof Request) return original(new Request(input, { ...init, headers }));
    return original(input, { ...init, headers });
  };
  (window as any).__workshoposPlatformFetchInstalled = true;
}
