import { createHash } from "node:crypto";

export type ActionNotificationMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  roles: string[];
  permissions: string[];
};

export type NotificationTemplate = {
  tenantId: string;
  key: string;
  version: number;
  channel: NotificationChannel;
  body: string;
  maxAttempts?: number;
};

export type NotificationRecipient = {
  id: string;
  tenantId: string;
  branchId: string;
  kind: "STAFF" | "CUSTOMER";
  membershipId?: string;
  destinations: Partial<Record<Exclude<NotificationChannel, "IN_APP">, string>>;
  consent: Partial<Record<NotificationChannel, boolean>>;
  optedOut: NotificationChannel[];
};

export type NotificationChannel = "IN_APP" | "PUSH" | "WHATSAPP" | "SMS";
type Priority = "URGENT" | "HIGH" | "NORMAL" | "LOW";

export type ActionRequest = {
  key: string;
  roles: string[];
  ownerMembershipId?: string;
  priority: Priority;
  title: string;
  blocker?: string;
  nextAction: string;
  dueAt?: string;
  href: string;
};

export type NotificationRequest = {
  recipientId: string;
  templateKey: string;
  templateVersion: number;
  channels: readonly NotificationChannel[];
  variables?: Record<string, string>;
  whatsappFallbackToSms?: boolean;
};

export type NotificationDomainEvent = {
  id: string;
  tenantId: string;
  branchId: string;
  type: string;
  occurredAt: string;
  action?: ActionRequest;
  notification?: NotificationRequest;
};

type Action = ActionRequest & {
  id: string;
  tenantId: string;
  branchId: string;
  sourceEventId: string;
  status: "OPEN" | "COMPLETED";
  createdAt: string;
  dueState?: "OVERDUE" | "DUE_TODAY" | "UPCOMING" | "NO_DUE" | "COMPLETED";
};

type ApiBody = { code?: string; actions?: Action[]; notifications?: InAppNotification[]; [key: string]: unknown };
type ApiResponse = { status: number; body: ApiBody };

type DeliveryStatus = "PENDING" | "RETRY_SCHEDULED" | "PROVIDER_ACCEPTED" | "DELIVERED" | "SKIPPED_NO_CONSENT" | "SKIPPED_OPT_OUT" | "SKIPPED_NO_DESTINATION" | "DEAD_LETTER";
type Delivery = {
  id: string;
  tenantId: string;
  branchId: string;
  sourceEventId: string;
  recipientId: string;
  channel: NotificationChannel;
  templateKey: string;
  templateVersion: number;
  renderedBody: string;
  variables: Record<string, string>;
  status: DeliveryStatus;
  attemptCount: number;
  maxAttempts: number;
  createdAt: string;
  nextAttemptAt: string;
  providerMessageId?: string;
  failureReason?: string;
  whatsappFallbackToSms: boolean;
  fallbackOfDeliveryId?: string;
};
type InAppNotification = {
  id: string;
  tenantId: string;
  branchId: string;
  membershipId: string;
  sourceEventId: string;
  deliveryId: string;
  body: string;
  templateKey: string;
  templateVersion: number;
  createdAt: string;
  readAt?: string;
};
type ProviderCall = {
  deliveryId: string;
  idempotencyKey: string;
  channel: Exclude<NotificationChannel, "IN_APP">;
  body: string;
  attempt: number;
};
type ProviderOutcome = { kind: "ACCEPTED" } | { kind: "TRANSIENT_FAILURE" | "PERMANENT_FAILURE"; reason: string };
type PreferenceHistory = {
  tenantId: string;
  recipientId: string;
  channel: NotificationChannel;
  action: "OPT_OUT";
  occurredAt: string;
  source: string;
};
type ProviderStatusEvent = {
  id: string;
  tenantId: string;
  channel: Exclude<NotificationChannel, "IN_APP">;
  providerMessageId: string;
  status: "SENT" | "DELIVERED" | "FAILED";
  reason?: string;
  occurredAt: string;
};
type ReplayEvidence = { deliveryId: string; occurredAt: string; reason: string };

const clone = <T>(value: T): T => structuredClone(value);
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const priorities: Record<Priority, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };

function dueState(dueAt: string | undefined, asOf: string): Action["dueState"] {
  if (!dueAt) return "NO_DUE";
  if (Date.parse(dueAt) < Date.parse(asOf)) return "OVERDUE";
  return dueAt.slice(0, 10) === asOf.slice(0, 10) ? "DUE_TODAY" : "UPCOMING";
}

export function createLocalActionNotificationApi(input: {
  memberships: Record<string, ActionNotificationMembership>;
  templates: NotificationTemplate[];
  recipients: NotificationRecipient[];
}) {
  const events = new Map<string, { digest: string; response: ApiResponse }>();
  const actions: Action[] = [];
  const recipients = new Map(input.recipients.map((recipient) => [`${recipient.tenantId}:${recipient.id}`, clone(recipient)]));
  const templates = new Map(input.templates.map((template) => [`${template.tenantId}:${template.key}:${template.version}:${template.channel}`, clone(template)]));
  const deliveries: Delivery[] = [];
  const inAppNotifications: InAppNotification[] = [];
  const providerCalls: ProviderCall[] = [];
  const providerOutcomes = new Map<Exclude<NotificationChannel, "IN_APP">, ProviderOutcome[]>();
  const preferenceHistory: PreferenceHistory[] = [];
  const providerStatusEvents = new Map<string, { digest: string; response: ApiResponse }>();
  const providerStatusHistory: ProviderStatusEvent[] = [];
  const replayHistory: ReplayEvidence[] = [];
  let actionSequence = 0;
  let deliverySequence = 0;
  let notificationSequence = 0;

  const render = (body: string, variables: Record<string, string> = {}) =>
    body.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_whole, name: string) => variables[name] ?? `{{${name}}}`);

  const enqueueSmsFallback = (delivery: Delivery, now: string) => {
    if (delivery.channel !== "WHATSAPP" || !delivery.whatsappFallbackToSms ||
        deliveries.some((candidate) => candidate.fallbackOfDeliveryId === delivery.id)) return;
    const template = templates.get(`${delivery.tenantId}:${delivery.templateKey}:${delivery.templateVersion}:SMS`);
    if (!template) return;
    deliveries.push({ id: `delivery-${++deliverySequence}`, tenantId: delivery.tenantId, branchId: delivery.branchId,
      sourceEventId: delivery.sourceEventId, recipientId: delivery.recipientId, channel: "SMS", templateKey: template.key,
      templateVersion: template.version, renderedBody: render(template.body, delivery.variables), status: "PENDING", attemptCount: 0,
      variables: clone(delivery.variables),
      maxAttempts: template.maxAttempts ?? 3, createdAt: now, nextAttemptAt: now, whatsappFallbackToSms: false,
      fallbackOfDeliveryId: delivery.id });
  };

  const ingest = (event: NotificationDomainEvent): ApiResponse => {
    const key = `${event.tenantId}:${event.id}`;
    const digest = fingerprint(event);
    const prior = events.get(key);
    if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } : { status: 409, body: { code: "DOMAIN_EVENT_ID_REUSED" } };
    let notificationPlan: { recipient: NotificationRecipient; templates: NotificationTemplate[] } | undefined;
    if (event.notification) {
      const recipient = recipients.get(`${event.tenantId}:${event.notification.recipientId}`);
      if (!recipient || recipient.branchId !== event.branchId) return { status: 422, body: { code: "NOTIFICATION_RECIPIENT_NOT_FOUND" } };
      const plannedTemplates = event.notification.channels.map((channel) =>
        templates.get(`${event.tenantId}:${event.notification!.templateKey}:${event.notification!.templateVersion}:${channel}`),
      );
      if (plannedTemplates.some((template) => !template)) return { status: 422, body: { code: "NOTIFICATION_TEMPLATE_NOT_FOUND" } };
      if (new Set(event.notification.channels).size !== event.notification.channels.length) {
        return { status: 422, body: { code: "DUPLICATE_NOTIFICATION_CHANNEL" } };
      }
      if (event.notification.whatsappFallbackToSms && event.notification.channels.includes("WHATSAPP") &&
          !templates.has(`${event.tenantId}:${event.notification.templateKey}:${event.notification.templateVersion}:SMS`)) {
        return { status: 422, body: { code: "SMS_FALLBACK_TEMPLATE_NOT_FOUND" } };
      }
      const missingVariables = plannedTemplates.flatMap((template) =>
        [...template!.body.matchAll(/\{\{([A-Za-z0-9_]+)\}\}/g)].map((match) => match[1]),
      ).filter((name) => event.notification!.variables?.[name] === undefined);
      if (missingVariables.length > 0) return { status: 422, body: { code: "TEMPLATE_VARIABLES_MISSING", missingVariables: [...new Set(missingVariables)] } };
      notificationPlan = { recipient, templates: plannedTemplates as NotificationTemplate[] };
    }
    if (event.action) {
      actions.push({
        ...clone(event.action), id: `action-${++actionSequence}`, tenantId: event.tenantId, branchId: event.branchId,
        sourceEventId: event.id, status: "OPEN", createdAt: event.occurredAt,
      });
    }
    if (notificationPlan && event.notification) {
      for (const template of notificationPlan.templates) {
        deliveries.push({
          id: `delivery-${++deliverySequence}`, tenantId: event.tenantId, branchId: event.branchId,
          sourceEventId: event.id, recipientId: notificationPlan.recipient.id, channel: template.channel,
          templateKey: template.key, templateVersion: template.version,
          renderedBody: render(template.body, event.notification.variables), variables: clone(event.notification.variables ?? {}),
          status: "PENDING", attemptCount: 0,
          maxAttempts: template.maxAttempts ?? 3, createdAt: event.occurredAt, nextAttemptAt: event.occurredAt,
          whatsappFallbackToSms: event.notification.whatsappFallbackToSms === true,
        });
      }
    }
    const response: ApiResponse = { status: 201, body: {} };
    events.set(key, { digest, response: clone(response) });
    return response;
  };

  return {
    domainEvents: { ingest },
    providerStatuses: {
      ingest(event: ProviderStatusEvent): ApiResponse {
        const key = `${event.tenantId}:${event.id}`;
        const digest = fingerprint(event);
        const prior = providerStatusEvents.get(key);
        if (prior) return prior.digest === digest ? { status: 200, body: clone(prior.response.body) } :
          { status: 409, body: { code: "PROVIDER_STATUS_ID_REUSED" } };
        const delivery = deliveries.find((candidate) => candidate.tenantId === event.tenantId &&
          candidate.channel === event.channel && candidate.providerMessageId === event.providerMessageId);
        if (!delivery) return { status: 404, body: { code: "DELIVERY_NOT_FOUND" } };
        if (delivery.status !== "PROVIDER_ACCEPTED" && delivery.status !== "DELIVERED") {
          return { status: 409, body: { code: "PROVIDER_STATUS_NOT_APPLICABLE" } };
        }
        if (event.status === "FAILED") {
          delivery.status = "DEAD_LETTER";
          delivery.failureReason = event.reason ?? "Provider reported terminal failure.";
          enqueueSmsFallback(delivery, event.occurredAt);
        } else if (event.status === "DELIVERED") {
          delivery.status = "DELIVERED";
          delivery.failureReason = undefined;
        }
        providerStatusHistory.push(clone(event));
        const response: ApiResponse = { status: 201, body: {} };
        providerStatusEvents.set(key, { digest, response: clone(response) });
        return response;
      },
    },
    recipientPreferences: {
      recordOptOut(change: Omit<PreferenceHistory, "action">): ApiResponse {
        const recipient = recipients.get(`${change.tenantId}:${change.recipientId}`);
        if (!recipient) return { status: 404, body: { code: "NOTIFICATION_RECIPIENT_NOT_FOUND" } };
        const duplicate = preferenceHistory.some((entry) => entry.tenantId === change.tenantId &&
          entry.recipientId === change.recipientId && entry.channel === change.channel &&
          entry.occurredAt === change.occurredAt && entry.source === change.source);
        if (duplicate) return { status: 200, body: {} };
        if (!recipient.optedOut.includes(change.channel)) recipient.optedOut.push(change.channel);
        preferenceHistory.push({ ...change, action: "OPT_OUT" });
        return { status: 201, body: {} };
      },
    },
    worker: {
      async drain(now: string) {
        let processed = 0;
        let externalCalls = 0;
        for (const delivery of [...deliveries]) {
          if (!(delivery.status === "PENDING" || delivery.status === "RETRY_SCHEDULED") || Date.parse(delivery.nextAttemptAt) > Date.parse(now)) continue;
          const recipient = recipients.get(`${delivery.tenantId}:${delivery.recipientId}`)!;
          processed += 1;
          if (recipient.optedOut.includes(delivery.channel)) {
            delivery.status = "SKIPPED_OPT_OUT";
            delivery.failureReason = "Recipient opted out of this channel.";
            continue;
          }
          if (recipient.consent[delivery.channel] !== true) {
            delivery.status = "SKIPPED_NO_CONSENT";
            delivery.failureReason = "Consent is not recorded for this channel.";
            continue;
          }
          if (delivery.channel === "IN_APP") {
            if (!recipient.membershipId) {
              delivery.status = "SKIPPED_NO_DESTINATION";
              delivery.failureReason = "No staff membership is linked to the in-app recipient.";
              continue;
            }
            if (!inAppNotifications.some((notification) => notification.deliveryId === delivery.id)) {
              inAppNotifications.push({ id: `notification-${++notificationSequence}`, tenantId: delivery.tenantId,
                branchId: delivery.branchId, membershipId: recipient.membershipId, sourceEventId: delivery.sourceEventId,
                deliveryId: delivery.id, body: delivery.renderedBody, templateKey: delivery.templateKey,
                templateVersion: delivery.templateVersion, createdAt: now });
            }
            delivery.attemptCount += 1;
            delivery.status = "DELIVERED";
            continue;
          }
          if (!recipient.destinations[delivery.channel]) {
            delivery.status = "SKIPPED_NO_DESTINATION";
            delivery.failureReason = "No destination is registered for this channel.";
            continue;
          }
          delivery.attemptCount += 1;
          externalCalls += 1;
          providerCalls.push({ deliveryId: delivery.id, idempotencyKey: delivery.id, channel: delivery.channel,
            body: delivery.renderedBody, attempt: delivery.attemptCount });
          const outcome = providerOutcomes.get(delivery.channel)?.shift() ?? { kind: "ACCEPTED" as const };
          if (outcome.kind === "ACCEPTED") {
            delivery.providerMessageId = `local-${delivery.channel.toLowerCase()}-${delivery.id}`;
            delivery.status = "PROVIDER_ACCEPTED";
            delivery.failureReason = undefined;
          } else {
            delivery.failureReason = outcome.reason;
            if (outcome.kind === "TRANSIENT_FAILURE" && delivery.attemptCount < delivery.maxAttempts) {
              delivery.status = "RETRY_SCHEDULED";
              delivery.nextAttemptAt = new Date(Date.parse(now) + 60_000 * (2 ** (delivery.attemptCount - 1))).toISOString();
            } else {
              delivery.status = "DEAD_LETTER";
              enqueueSmsFallback(delivery, now);
            }
          }
        }
        return { processed, providerCalls: externalCalls };
      },
      replayDeadLetter(deliveryId: string, occurredAt: string, reason: string): ApiResponse {
        const delivery = deliveries.find((candidate) => candidate.id === deliveryId);
        if (!delivery) return { status: 404, body: { code: "DELIVERY_NOT_FOUND" } };
        if (delivery.status !== "DEAD_LETTER") return { status: 409, body: { code: "DELIVERY_NOT_DEAD_LETTER" } };
        if (!reason.trim()) return { status: 422, body: { code: "REPLAY_REASON_REQUIRED" } };
        delivery.status = "PENDING";
        delivery.attemptCount = 0;
        delivery.nextAttemptAt = occurredAt;
        delivery.providerMessageId = undefined;
        delivery.failureReason = undefined;
        replayHistory.push({ deliveryId, occurredAt, reason });
        return { status: 202, body: {} };
      },
    },
    testing: {
      actions: () => clone(actions),
      deliveries: () => clone(deliveries),
      providerCalls: () => clone(providerCalls),
      preferenceHistory: () => clone(preferenceHistory),
      providerStatusHistory: () => clone(providerStatusHistory),
      replayHistory: () => clone(replayHistory),
      queueProviderOutcomes(channel: Exclude<NotificationChannel, "IN_APP">, outcomes: ProviderOutcome[]) {
        providerOutcomes.set(channel, [...(providerOutcomes.get(channel) ?? []), ...clone(outcomes)]);
      },
    },
    signIn(token: string) {
      const member = input.memberships[token];
      return {
        async get(path: string): Promise<ApiResponse> {
          if (!member) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const url = new URL(path, "https://local.workshopos.test");
          if (url.pathname === "/api/v1/notifications") {
            if (!member.permissions.includes("notification.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
            const branchId = url.searchParams.get("branchId");
            if (!branchId || !member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
            return { status: 200, body: { notifications: clone(inAppNotifications.filter((notification) =>
              notification.tenantId === member.tenantId && notification.branchId === branchId && notification.membershipId === member.membershipId)) } };
          }
          if (url.pathname !== "/api/v1/actions") return { status: 404, body: { code: "NOT_FOUND" } };
          if (!member.permissions.includes("action.read")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          const branchId = url.searchParams.get("branchId");
          if (!branchId || !member.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          const asOf = url.searchParams.get("asOf") ?? new Date().toISOString();
          const owner = url.searchParams.get("owner");
          const requestedRole = url.searchParams.get("role");
          if (requestedRole && !member.roles.includes(requestedRole)) return { status: 403, body: { code: "ROLE_FORBIDDEN" } };
          const requestedPriority = url.searchParams.get("priority");
          const requestedDueState = url.searchParams.get("dueState");
          const requestedStatus = url.searchParams.get("status");
          const visible = actions
            .filter((action) => action.tenantId === member.tenantId && action.branchId === branchId)
            .filter((action) => action.roles.some((role) => member.roles.includes(role)))
            .filter((action) => !requestedRole || action.roles.includes(requestedRole))
            .filter((action) => {
              if (owner === "me") return action.ownerMembershipId === member.membershipId;
              if (owner === "all" && member.permissions.includes("action.team.read")) return true;
              return !action.ownerMembershipId || action.ownerMembershipId === member.membershipId;
            })
            .map((action) => ({ ...clone(action), dueState: action.status === "COMPLETED" ? "COMPLETED" : dueState(action.dueAt, asOf) }))
            .filter((action) => !requestedPriority || action.priority === requestedPriority)
            .filter((action) => !requestedDueState || action.dueState === requestedDueState)
            .filter((action) => !requestedStatus || action.status === requestedStatus)
            .sort((left, right) => priorities[left.priority] - priorities[right.priority] || Date.parse(left.dueAt ?? "9999-12-31") - Date.parse(right.dueAt ?? "9999-12-31") || left.createdAt.localeCompare(right.createdAt));
          return { status: 200, body: { actions: visible } };
        },
      };
    },
  };
}
