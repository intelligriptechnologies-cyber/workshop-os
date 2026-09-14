import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ProductionWorkItemsApp from "./ProductionWorkItemsApp";
import ProductionUsersApp from "./ProductionUsersApp";
import "./styles.css";

const RootApp = location.pathname === "/production/work-items" ? ProductionWorkItemsApp : location.pathname === "/production/users" ? ProductionUsersApp : App;

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
