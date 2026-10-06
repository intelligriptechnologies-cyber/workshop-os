import type { WorkshopBusinessSettings } from "./admin-demo-state";
import type { JobView } from "./types";

export type JobCardNotificationEvent = "created" | "closed";

export interface JobCardNotificationPayload {
  event: JobCardNotificationEvent;
  whatsapp: string;
  email: string;
}

type TemplateValues = {
  jobCardNo: string;
  vehicleRegistrationNo: string;
  serviceAdvisorName: string;
  workshopName: string;
};

/** Replaces the supported customer-message placeholders with the job's current values. */
export function renderJobCardNotificationTemplate(
  template: string,
  values: TemplateValues,
) {
  return template.replace(
    /{{(jobCardNo|vehicleRegistrationNo|serviceAdvisorName|workshopName)}}/g,
    (_, key: keyof TemplateValues) => values[key],
  );
}

export function renderJobCardNotification(
  event: JobCardNotificationEvent,
  view: JobView,
  settings: WorkshopBusinessSettings,
): JobCardNotificationPayload {
  const values: TemplateValues = {
    jobCardNo: view.job.job_no,
    vehicleRegistrationNo: view.vehicle.number,
    serviceAdvisorName: view.advisor.name,
    workshopName: settings.profile.businessName,
  };
  const templates = settings.notifications;
  return {
    event,
    whatsapp: renderJobCardNotificationTemplate(
      event === "created"
        ? templates.jobCardCreatedWhatsAppTemplate
        : templates.jobCardClosedWhatsAppTemplate,
      values,
    ),
    email: renderJobCardNotificationTemplate(
      event === "created"
        ? templates.jobCardCreatedEmailTemplate
        : templates.jobCardClosedEmailTemplate,
      values,
    ),
  };
}

/** Interim transport: payloads are deliberately not sent until providers are integrated. */
export function deliverJobCardNotificationStub(
  _payload: JobCardNotificationPayload,
  notify: (message: string) => void,
) {
  notify("whatsapp and email note sent");
}
