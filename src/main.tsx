import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import ProductionHomeApp from "./ProductionHomeApp";
import ProductionWorkItemsApp from "./ProductionWorkItemsApp";
import ProductionUsersApp from "./ProductionUsersApp";
import ProductionRolesApp from "./ProductionRolesApp";
import ProductionSearchApp from "./ProductionSearchApp";
import ProductionBusinessSettingsApp from "./ProductionBusinessSettingsApp";
import ProductionCustomersVehiclesApp from "./ProductionCustomersVehiclesApp";
import ProductionInventoryApp from "./ProductionInventoryApp";
import ProductionJobsApp from "./ProductionJobsApp";
import ProductionDataFlowApp from "./ProductionDataFlowApp";
import ProductionMediaApp from "./ProductionMediaApp";
import ProductionEstimatesTasksQcApp from "./ProductionEstimatesTasksQcApp";
import ProductionBillingApp from "./ProductionBillingApp";
import ProductionRemainingScreensApp from "./ProductionRemainingScreensApp";
import PlatformAdminApp from "./PlatformAdminApp";
import { installPlatformEmulationFetch } from "./platform-emulation-fetch";
import "./styles.css";

installPlatformEmulationFetch();

const LegacyDemoApp = lazy(() => import("./App"));
const remainingRoutes = ["/production/appointments","/production/follow-ups","/production/action-inbox","/production/materials","/production/reports","/production/masters"];
const RootApp = location.pathname === "/demo" ? LegacyDemoApp : location.pathname === "/platform" ? PlatformAdminApp : location.pathname === "/production/work-items" ? ProductionWorkItemsApp : location.pathname === "/production/users" ? ProductionUsersApp : location.pathname === "/production/roles" ? ProductionRolesApp : location.pathname === "/production/search" ? ProductionSearchApp : location.pathname === "/production/settings" ? ProductionBusinessSettingsApp : ["/production/customers", "/production/vehicles"].includes(location.pathname) ? ProductionCustomersVehiclesApp : location.pathname === "/production/inventory" ? ProductionInventoryApp : location.pathname === "/production/jobs" ? ProductionJobsApp : location.pathname === "/production/data-flow" ? ProductionDataFlowApp : location.pathname === "/production/media" ? ProductionMediaApp : ["/production/estimates","/production/tasks","/production/qc"].includes(location.pathname) ? ProductionEstimatesTasksQcApp : location.pathname === "/production/billing" ? ProductionBillingApp : remainingRoutes.includes(location.pathname) ? ProductionRemainingScreensApp : ProductionHomeApp;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<main><p>Loading WorkshopOS…</p></main>}><RootApp /></Suspense>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  const hadServiceWorkerController = navigator.serviceWorker.controller !== null;
  let reloadingForServiceWorkerUpdate = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadServiceWorkerController || reloadingForServiceWorkerUpdate) return;
    reloadingForServiceWorkerUpdate = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => undefined);
  });
}
