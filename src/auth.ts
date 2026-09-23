export type AuthConfig = { mode: "frappe" } | { mode: "local"; allowDemo: boolean };

export type WorkshopSession = { email: string; fullName: string; roles: string[] };

// Fixed dev constant: Task 1's bench serves exactly one site (workshop_os.localhost) on this
// origin, and its CORS + session cookie are scoped to the Vite dev server's default origin.
const FRAPPE_BASE_URL = "http://localhost:8000";

export async function loadAuthConfig(): Promise<AuthConfig> {
  if (import.meta.env.VITE_AUTH_MODE === "local") {
    const localDemo = import.meta.env.DEV || location.hostname === "localhost" || location.hostname === "127.0.0.1";
    return { mode: "local", allowDemo: localDemo };
  }
  return { mode: "frappe" };
}

export async function frappeFetch(path: string, init: RequestInit = {}): Promise<Response> {
  // Headers (not a plain object spread) so a caller-supplied "Accept"/"Content-Type" in any
  // casing correctly overrides the default instead of coexisting as a second, ignored key.
  const headers = new Headers(init.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");
  return fetch(`${FRAPPE_BASE_URL}${path}`, { ...init, credentials: "include", headers });
}

const INVALID_CREDENTIALS = "Invalid email or password.";

export async function frappeLogin(email: string, password: string): Promise<WorkshopSession> {
  const response = await frappeFetch("/api/method/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ usr: email, pwd: password }),
  });
  if (!response.ok) throw new Error(INVALID_CREDENTIALS);
  const session = await loadFrappeSession();
  if (!session) throw new Error(INVALID_CREDENTIALS);
  return session;
}

export async function frappeLogout(): Promise<void> {
  await frappeFetch("/api/method/logout", { method: "POST" });
}

export async function loadFrappeSession(): Promise<WorkshopSession | undefined> {
  const whoami = await frappeFetch("/api/method/frappe.auth.get_logged_user");
  if (!whoami.ok) return undefined;
  const { message: email } = await whoami.json() as { message?: string };
  if (!email || email === "Guest") return undefined;

  const [nameResponse, rolesResponse] = await Promise.all([
    frappeFetch(`/api/method/frappe.client.get_value?${new URLSearchParams({
      doctype: "User", filters: JSON.stringify({ name: email }), fieldname: "full_name",
    })}`),
    frappeFetch(`/api/method/frappe.client.get_list?${new URLSearchParams({
      doctype: "Has Role", parent: "User", limit_page_length: "0",
      filters: JSON.stringify([["parent", "=", email], ["parenttype", "=", "User"]]),
      fields: JSON.stringify(["role"]),
    })}`),
  ]);
  if (!nameResponse.ok || !rolesResponse.ok) return undefined;
  const namePayload = await nameResponse.json() as { message?: { full_name?: string } };
  const rolesPayload = await rolesResponse.json() as { message?: Array<{ role: string }> };
  return {
    email,
    fullName: namePayload.message?.full_name ?? email,
    roles: (rolesPayload.message ?? []).map((item) => item.role),
  };
}
