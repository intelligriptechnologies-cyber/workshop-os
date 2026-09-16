import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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
import "./styles.css";

const RootApp = location.pathname === "/production/work-items" ? ProductionWorkItemsApp : location.pathname === "/production/users" ? ProductionUsersApp : location.pathname === "/production/roles" ? ProductionRolesApp : location.pathname === "/production/search" ? ProductionSearchApp : location.pathname === "/production/settings" ? ProductionBusinessSettingsApp : ["/production/customers", "/production/vehicles"].includes(location.pathname) ? ProductionCustomersVehiclesApp : location.pathname === "/production/inventory" ? ProductionInventoryApp : location.pathname === "/production/jobs" ? ProductionJobsApp : location.pathname === "/production/data-flow" ? ProductionDataFlowApp : location.pathname === "/production/media" ? ProductionMediaApp : ["/production/estimates","/production/tasks","/production/qc"].includes(location.pathname) ? ProductionEstimatesTasksQcApp : location.pathname === "/production/billing" ? ProductionBillingApp : App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootApp />
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
