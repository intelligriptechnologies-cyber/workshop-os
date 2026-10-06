import assert from "node:assert/strict";
import test from "node:test";
import {
  ADMIN_DEMO_STORAGE_KEY,
  createDefaultAdminDemoState,
  loadAdminDemoState,
  normalizeBusinessSettings,
  validateBusinessSettings,
} from "../src/admin-demo-state";
import {
  deliverJobCardNotificationStub,
  renderJobCardNotification,
} from "../src/job-card-notifications";
import type { JobView } from "../src/types";

const view = {
  job: { id: 7, job_no: "JC-2026-001245" },
  vehicle: { number: "OD 02 AB 1234" },
  advisor: { name: "Amit" },
} as JobView;

class MemorySessionStorage {
  value: string | null = null;

  getItem() {
    return this.value;
  }

  setItem(_key: string, value: string) {
    this.value = value;
  }

  removeItem() {
    this.value = null;
  }
}

test("job-card notification templates interpolate the saved workshop profile", () => {
  const settings = createDefaultAdminDemoState().businessSettings;
  const created = renderJobCardNotification("created", view, {
    ...settings,
    profile: { ...settings.profile, businessName: "Apex Auto" },
    notifications: {
      ...settings.notifications,
      jobCardCreatedWhatsAppTemplate:
        "Created {{jobCardNo}} / {{vehicleRegistrationNo}} / {{serviceAdvisorName}} / {{workshopName}}",
      jobCardCreatedEmailTemplate: "Email {{jobCardNo}} at {{workshopName}}",
    },
  });
  const closed = renderJobCardNotification("closed", view, settings);

  assert.equal(
    created.whatsapp,
    "Created JC-2026-001245 / OD 02 AB 1234 / Amit / Apex Auto",
  );
  assert.equal(created.email, "Email JC-2026-001245 at Apex Auto");
  assert.match(closed.whatsapp, /has been closed/);
  assert.doesNotMatch(closed.whatsapp, /Amit/);
});

test("notification template settings trim, validate, and retain defaults for legacy settings", () => {
  const settings = createDefaultAdminDemoState().businessSettings;
  const normalized = normalizeBusinessSettings({
    ...settings,
    notifications: {
      ...settings.notifications,
      jobCardCreatedWhatsAppTemplate: "  Created {{jobCardNo}}  ",
      jobCardClosedEmailTemplate: "   ",
    },
  });
  assert.equal(normalized.notifications.jobCardCreatedWhatsAppTemplate, "Created {{jobCardNo}}");
  assert.equal(
    validateBusinessSettings(normalized).includes(
      "Job-card closure email template is required.",
    ),
    true,
  );
  assert.match(settings.notifications.jobCardCreatedEmailTemplate, /{{jobCardNo}}/);

  const storage = new MemorySessionStorage();
  const legacy = createDefaultAdminDemoState() as unknown as {
    businessSettings: { notifications: Record<string, unknown> };
  };
  delete legacy.businessSettings.notifications.jobCardCreatedWhatsAppTemplate;
  delete legacy.businessSettings.notifications.jobCardCreatedEmailTemplate;
  delete legacy.businessSettings.notifications.jobCardClosedWhatsAppTemplate;
  delete legacy.businessSettings.notifications.jobCardClosedEmailTemplate;
  storage.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(legacy));
  const hydrated = loadAdminDemoState(storage);
  assert.match(
    hydrated.businessSettings.notifications.jobCardClosedWhatsAppTemplate,
    /{{jobCardNo}}/,
  );
});

test("interim delivery stub only reports its native confirmation", () => {
  const messages: string[] = [];
  deliverJobCardNotificationStub(
    { event: "created", whatsapp: "WhatsApp payload", email: "Email payload" },
    (message) => messages.push(message),
  );
  assert.deepEqual(messages, ["whatsapp and email note sent"]);
});
