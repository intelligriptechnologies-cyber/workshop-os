import { useEffect, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { ProductionNavigation } from "./ProductionNavigation";
import {
  createRemainingScreensApi,
  type RemainingAuth,
} from "./production-remaining-screens-api";
import "./production-work-items.css";
import { PageHeader, Surface } from "./production-ui";

export default function ProductionHomeApp() {
  const [session, setSession] = useState<any>();
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        if (config.mode === "local") {
          if (!config.allowDemo) throw new Error();
          const auth: RemainingAuth = {
            mode: "local",
            identity: "north-admin",
          };
          setSession(await createRemainingScreensApi(auth).session());
        } else {
          const value = await loadWorkshopSession(config);
          if (!value) throw new Error();
          setSession(value);
        }
      } catch {
        setError(
          "WorkshopOS could not establish an authenticated production session.",
        );
      }
    })();
  }, []);

  if (error)
    return (
      <main>
        <h1>WorkshopOS</h1>
        <p role="alert">{error}</p>
      </main>
    );
  if (!session)
    return (
      <main>
        <p>Loading WorkshopOS…</p>
      </main>
    );

  return (
    <main className="v12-work-items">
      <PageHeader>
        <h1>WorkshopOS</h1>
        <p>
          Production workspace. PostgreSQL is authoritative for every route
          below.
        </p>
        <ProductionNavigation permissions={session.membership.permissions} />
      </PageHeader>
      <Surface>
        <h2>Welcome, {session.membership.displayName}</h2>
        <p>
          Select an authorized production workspace. The browser-only reference
          demo is isolated from this route graph and is not linked from
          production navigation.
        </p>
      </Surface>
    </main>
  );
}
