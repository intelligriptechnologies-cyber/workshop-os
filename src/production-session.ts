import { endCognitoSession, loadAuthConfig, loadWorkshopSession, type AuthConfig, type WorkshopSession } from "./auth";

export type ProductionSession = { auth: AuthConfig; session: WorkshopSession };

const localPresentationSession: WorkshopSession = {
  tenant: { id: "local", name: "WorkshopOS" },
  membership: {
    id: "north-admin", displayName: "Local administrator", email: "",
    status: "ACTIVE", roleIds: [], roles: [], branchIds: [], branches: [],
    permissions: [], version: 1,
  },
};

export async function loadProductionSession(): Promise<ProductionSession> {
  const auth = await loadAuthConfig();
  if (auth.mode === "cognito") {
    const session = await loadWorkshopSession(auth);
    if (!session) throw new Error("Sign in required");
    return { auth, session };
  }
  if (!auth.allowDemo) throw new Error("Local demo authentication is disabled.");
  const response = await fetch("/api/v1/session", { headers: { accept: "application/json", "x-workshopos-identity": "north-admin" } });
  if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) return { auth, session: localPresentationSession };
  try { return { auth, session: await response.json() as WorkshopSession }; }
  catch { return { auth, session: localPresentationSession }; }
}

export function logoutProductionSession(auth: AuthConfig) {
  if (auth.mode === "cognito") return endCognitoSession(auth);
  sessionStorage.setItem("workshopos.local.signed-out.v1", "true");
}
export const hasLocalSignedOut = () => sessionStorage.getItem("workshopos.local.signed-out.v1") === "true";
export const resumeLocalSession = () => sessionStorage.removeItem("workshopos.local.signed-out.v1");
