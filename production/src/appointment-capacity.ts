import { createHash } from "node:crypto";

export type AppointmentMembership = {
  identityId: string;
  membershipId: string;
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

export type CapacityResource = { id: string; skills: string[]; active?: boolean };
export type BranchCapacity = {
  tenantId: string;
  branchId: string;
  configurationVersionId: string;
  defaultBufferBeforeMinutes: number;
  defaultBufferAfterMinutes: number;
  bays: CapacityResource[];
  staff: CapacityResource[];
  closures: Array<{ startsAt: string; endsAt: string; reason: string }>;
};

type AppointmentStatus = "BOOKED" | "ARRIVED" | "CANCELLED" | "NO_SHOW" | "CONVERTED";
type Schedule = {
  scheduledStart: string;
  scheduledEnd: string;
  reservedStart: string;
  reservedEnd: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  requiredSkills: string[];
  requiredBaySkills: string[];
  assignedBayId: string;
  assignedStaffId: string;
  overbooked: boolean;
};
type AppointmentHistory = {
  sequence: number;
  action: "CREATED" | "RESCHEDULED" | "CANCELLED" | "NO_SHOW" | "ARRIVED" | "CONVERTED";
  fromStatus: AppointmentStatus | null;
  toStatus: AppointmentStatus;
  occurredAt: string;
  actorIdentityId: string;
  membershipId: string;
  reason: string;
  evidence: string[];
  auditReference: string;
  oldSchedule?: Schedule;
  newSchedule?: Schedule;
};
type Appointment = Schedule & {
  id: string;
  tenantId: string;
  branchId: string;
  customerId: string;
  vehicleId: string;
  status: AppointmentStatus;
  capacityConfigurationVersionId: string;
  resourceVersion: number;
  history: AppointmentHistory[];
  overbooking?: { reason: string; evidence: string[]; authorizedByMembershipId: string };
};
type ReceptionRequest = {
  id: string;
  tenantId: string;
  branchId: string;
  appointmentId: string;
  appointmentVersion: number;
  customerId: string;
  vehicleId: string;
  assignedBayId: string;
  assignedStaffId: string;
  requestedAt: string;
  auditReference: string;
  eventType: "RECEPTION_CHECK_IN_REQUESTED";
};
type AuditEntry = {
  auditReference: string;
  tenantId: string;
  branchId: string;
  appointmentId: string;
  action: string;
  actorIdentityId: string;
  membershipId: string;
  occurredAt: string;
  reason: string;
  evidence: string[];
  requestId?: string;
  resourceVersion: number;
};
type Availability = {
  available: boolean;
  code?: "BRANCH_CLOSED" | "NO_QUALIFIED_BAY" | "NO_QUALIFIED_STAFF" | "CAPACITY_UNAVAILABLE";
  message?: string;
  capacityConfigurationVersionId: string;
  qualifiedBayIds: string[];
  qualifiedStaffIds: string[];
  availableBayIds: string[];
  availableStaffIds: string[];
  closureReason?: string;
};
type ApiBody = {
  code?: string;
  message?: string;
  appointment?: Appointment;
  appointments?: Appointment[];
  availability?: Availability;
  receptionRequest?: ReceptionRequest;
  receptionRequests?: ReceptionRequest[];
  auditEntries?: AuditEntry[];
  resourceVersion?: number;
  auditReference?: string;
};
type ApiResponse = { status: number; body: ApiBody };
type CommandOptions = { idempotencyKey?: string; ifMatch?: number; now?: string; requestId?: string };

const clone = <T>(value: T): T => structuredClone(value);
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const uniqueStrings = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string" && item.trim())) return undefined;
  const result = [...new Set(value.map((item) => item.trim().toUpperCase()))];
  return result.length === value.length ? result.sort() : undefined;
};
const validInstant = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value));
const overlaps = (leftStart: string, leftEnd: string, rightStart: string, rightEnd: string) =>
  Date.parse(leftStart) < Date.parse(rightEnd) && Date.parse(rightStart) < Date.parse(leftEnd);
const hasAllSkills = (resource: CapacityResource, required: string[]) => {
  const skills = new Set(resource.skills.map((skill) => skill.toUpperCase()));
  return required.every((skill) => skills.has(skill));
};

export function createLocalAppointmentCapacityApi(input: {
  memberships: Record<string, AppointmentMembership>;
  branchCapacities: BranchCapacity[];
}) {
  const appointments = new Map<string, Appointment>();
  const audits: AuditEntry[] = [];
  const receptionRequests: ReceptionRequest[] = [];
  const commandResults = new Map<string, { fingerprint: string; response: ApiResponse }>();
  let appointmentSequence = 0;
  let auditSequence = 0;
  let receptionSequence = 0;

  const authorize = (token: string, branchId: unknown, permission: string): AppointmentMembership | ApiResponse => {
    const membership = input.memberships[token];
    if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
    if (typeof branchId !== "string" || !membership.branchIds.includes(branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
    if (!membership.permissions.includes(permission)) return { status: 403, body: { code: "PERMISSION_DENIED" } };
    return membership;
  };
  const capacityFor = (membership: AppointmentMembership, branchId: string) =>
    input.branchCapacities.find((capacity) => capacity.tenantId === membership.tenantId && capacity.branchId === branchId);
  const visible = (membership: AppointmentMembership, branchId: string, appointmentId: string) => {
    const appointment = appointments.get(`${membership.tenantId}:${appointmentId}`);
    return appointment?.branchId === branchId ? appointment : undefined;
  };
  const execute = (membership: AppointmentMembership, path: string, body: Record<string, unknown>, options: CommandOptions, work: () => ApiResponse): ApiResponse => {
    if (!options.idempotencyKey?.trim()) return { status: 400, body: { code: "IDEMPOTENCY_KEY_REQUIRED" } };
    const commandKey = `${membership.tenantId}:${options.idempotencyKey}`;
    const fingerprint = hash({ path, body, ifMatch: options.ifMatch });
    const prior = commandResults.get(commandKey);
    if (prior) return prior.fingerprint === fingerprint
      ? clone({ ...prior.response, status: prior.response.status === 201 || prior.response.status === 202 ? 200 : prior.response.status })
      : { status: 409, body: { code: "IDEMPOTENCY_KEY_REUSED" } };
    const response = work();
    if (response.status >= 200 && response.status < 300) commandResults.set(commandKey, { fingerprint, response: clone(response) });
    return clone(response);
  };
  const activeAppointments = (membership: AppointmentMembership, branchId: string, excludingId?: string) => [...appointments.values()].filter((appointment) =>
    appointment.tenantId === membership.tenantId && appointment.branchId === branchId && appointment.id !== excludingId &&
    (appointment.status === "BOOKED" || appointment.status === "ARRIVED"));

  const evaluate = (membership: AppointmentMembership, branchId: string, schedule: {
    scheduledStart: string; durationMinutes: number; bufferBeforeMinutes: number; bufferAfterMinutes: number;
    requiredSkills: string[]; requiredBaySkills: string[];
  }, excludingId?: string): { result: Availability; schedule?: Schedule } => {
    const capacity = capacityFor(membership, branchId);
    if (!capacity) return { result: { available: false, code: "CAPACITY_UNAVAILABLE", message: "Configure branch capacity before booking.", capacityConfigurationVersionId: "", qualifiedBayIds: [], qualifiedStaffIds: [], availableBayIds: [], availableStaffIds: [] } };
    const startMs = Date.parse(schedule.scheduledStart);
    const endMs = startMs + schedule.durationMinutes * 60_000;
    const reservedStartMs = startMs - schedule.bufferBeforeMinutes * 60_000;
    const reservedEndMs = endMs + schedule.bufferAfterMinutes * 60_000;
    const reservedStart = new Date(reservedStartMs).toISOString();
    const reservedEnd = new Date(reservedEndMs).toISOString();
    const closure = capacity.closures.find((item) => overlaps(reservedStart, reservedEnd, item.startsAt, item.endsAt));
    const qualifiedBays = capacity.bays.filter((item) => item.active !== false && hasAllSkills(item, schedule.requiredBaySkills)).map((item) => item.id).sort();
    const qualifiedStaff = capacity.staff.filter((item) => item.active !== false && hasAllSkills(item, schedule.requiredSkills)).map((item) => item.id).sort();
    const occupied = activeAppointments(membership, branchId, excludingId).filter((item) => overlaps(reservedStart, reservedEnd, item.reservedStart, item.reservedEnd));
    const occupiedBays = new Set(occupied.map((item) => item.assignedBayId));
    const occupiedStaff = new Set(occupied.map((item) => item.assignedStaffId));
    const availableBays = qualifiedBays.filter((id) => !occupiedBays.has(id));
    const availableStaff = qualifiedStaff.filter((id) => !occupiedStaff.has(id));
    let code: Availability["code"];
    let message: string | undefined;
    if (closure) { code = "BRANCH_CLOSED"; message = `Branch is closed: ${closure.reason}`; }
    else if (!qualifiedBays.length) { code = "NO_QUALIFIED_BAY"; message = "No active bay has all required capabilities."; }
    else if (!qualifiedStaff.length) { code = "NO_QUALIFIED_STAFF"; message = "No active staff member has all required skills."; }
    else if (!availableBays.length || !availableStaff.length) { code = "CAPACITY_UNAVAILABLE"; message = "Qualified capacity is already reserved for this time, including buffers."; }
    const result: Availability = {
      available: !code, ...(code ? { code, message } : {}), capacityConfigurationVersionId: capacity.configurationVersionId,
      qualifiedBayIds: qualifiedBays, qualifiedStaffIds: qualifiedStaff, availableBayIds: availableBays, availableStaffIds: availableStaff,
      ...(closure ? { closureReason: closure.reason } : {}),
    };
    return { result, ...((!closure && qualifiedBays.length && qualifiedStaff.length) ? { schedule: {
      ...schedule, scheduledEnd: new Date(endMs).toISOString(), reservedStart, reservedEnd,
      assignedBayId: availableBays[0] ?? qualifiedBays[0], assignedStaffId: availableStaff[0] ?? qualifiedStaff[0], overbooked: false,
    } } : {}) };
  };

  const parseSchedule = (body: Record<string, unknown>, capacity: BranchCapacity): Omit<Schedule, "scheduledEnd" | "reservedStart" | "reservedEnd" | "assignedBayId" | "assignedStaffId" | "overbooked"> | undefined => {
    const durationMinutes = Number(body.durationMinutes);
    const bufferBeforeMinutes = body.bufferBeforeMinutes === undefined ? capacity.defaultBufferBeforeMinutes : Number(body.bufferBeforeMinutes);
    const bufferAfterMinutes = body.bufferAfterMinutes === undefined ? capacity.defaultBufferAfterMinutes : Number(body.bufferAfterMinutes);
    const requiredSkills = uniqueStrings(body.requiredSkills);
    const requiredBaySkills = uniqueStrings(body.requiredBaySkills);
    if (!validInstant(body.scheduledStart) || !Number.isSafeInteger(durationMinutes) || durationMinutes <= 0 || durationMinutes > 24 * 60 ||
        !Number.isSafeInteger(bufferBeforeMinutes) || bufferBeforeMinutes < 0 || !Number.isSafeInteger(bufferAfterMinutes) || bufferAfterMinutes < 0 ||
        !requiredSkills || !requiredBaySkills) return undefined;
    return { scheduledStart: new Date(String(body.scheduledStart)).toISOString(), durationMinutes, bufferBeforeMinutes, bufferAfterMinutes, requiredSkills, requiredBaySkills };
  };

  const recordAudit = (membership: AppointmentMembership, appointment: Appointment, action: string, now: string, reason: string, evidence: string[], requestId?: string) => {
    const auditReference = `audit-appointment-${++auditSequence}`;
    audits.push({ auditReference, tenantId: membership.tenantId, branchId: appointment.branchId, appointmentId: appointment.id, action,
      actorIdentityId: membership.identityId, membershipId: membership.membershipId, occurredAt: now, reason, evidence: [...evidence], requestId, resourceVersion: appointment.resourceVersion });
    return auditReference;
  };
  const scheduleOf = (appointment: Appointment): Schedule => ({
    scheduledStart: appointment.scheduledStart, scheduledEnd: appointment.scheduledEnd,
    reservedStart: appointment.reservedStart, reservedEnd: appointment.reservedEnd,
    durationMinutes: appointment.durationMinutes, bufferBeforeMinutes: appointment.bufferBeforeMinutes,
    bufferAfterMinutes: appointment.bufferAfterMinutes, requiredSkills: [...appointment.requiredSkills],
    requiredBaySkills: [...appointment.requiredBaySkills], assignedBayId: appointment.assignedBayId,
    assignedStaffId: appointment.assignedStaffId, overbooked: appointment.overbooked,
  });
  const reasonEvidence = (body: Record<string, unknown>) => {
    const reason = String(body.reason ?? "").trim();
    const evidence = Array.isArray(body.evidence) && body.evidence.every((item) => typeof item === "string" && item.trim())
      ? body.evidence.map((item) => String(item).trim()) : undefined;
    return reason && evidence ? { reason, evidence } : undefined;
  };
  const requestedOverbooking = (body: Record<string, unknown>) => body.overbooking && typeof body.overbooking === "object"
    ? body.overbooking as Record<string, unknown> : undefined;
  const validOverbooking = (body: Record<string, unknown>) => {
    const requested = requestedOverbooking(body);
    if (!requested) return undefined;
    const reason = String(requested.reason ?? "").trim();
    const evidence = Array.isArray(requested.evidence) && requested.evidence.length > 0 && requested.evidence.every((item) => typeof item === "string" && item.trim())
      ? requested.evidence.map((item) => String(item).trim()) : undefined;
    return reason && evidence ? { reason, evidence } : undefined;
  };

  class Session {
    constructor(private readonly token: string) {}

    async post(path: string, body: Record<string, unknown>, options: CommandOptions = {}): Promise<ApiResponse> {
      const rescheduleMatch = path.match(/^\/api\/v1\/appointments\/([^/]+)\/reschedules$/);
      if (rescheduleMatch) {
        const auth = authorize(this.token, body.branchId, "appointment.manage");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const capacity = capacityFor(auth, branchId);
        const scheduleInput = capacity ? parseSchedule(body, capacity) : undefined;
        const context = reasonEvidence(body);
        if (!capacity) return { status: 422, body: { code: "BRANCH_CAPACITY_NOT_CONFIGURED" } };
        if (!scheduleInput || !context) return { status: 422, body: { code: "INVALID_RESCHEDULE" } };
        return execute(auth, path, body, options, () => {
          const appointment = visible(auth, branchId, rescheduleMatch[1]);
          if (!appointment) return { status: 404, body: { code: "APPOINTMENT_NOT_FOUND" } };
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== appointment.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: appointment.resourceVersion } };
          if (appointment.status !== "BOOKED") return { status: 409, body: { code: "APPOINTMENT_NOT_RESCHEDULABLE" } };
          const evaluation = evaluate(auth, branchId, scheduleInput, appointment.id);
          const overbookingRequest = requestedOverbooking(body);
          const overbooking = validOverbooking(body);
          if (!evaluation.result.available) {
            if (evaluation.result.code !== "CAPACITY_UNAVAILABLE" || !evaluation.schedule) return { status: 409, body: { code: evaluation.result.code, message: evaluation.result.message, availability: evaluation.result } };
            if (!overbookingRequest) return { status: 409, body: { code: evaluation.result.code, message: evaluation.result.message, availability: evaluation.result } };
            if (!auth.permissions.includes("appointment.overbook")) return { status: 403, body: { code: "OVERBOOK_PERMISSION_REQUIRED" } };
            if (!overbooking) return { status: 422, body: { code: "OVERBOOK_REASON_AND_EVIDENCE_REQUIRED" } };
            evaluation.schedule.overbooked = true;
          } else if (overbookingRequest) return { status: 422, body: { code: "OVERBOOKING_NOT_REQUIRED" } };
          if (!evaluation.schedule) return { status: 409, body: { code: evaluation.result.code, message: evaluation.result.message, availability: evaluation.result } };
          const oldSchedule = scheduleOf(appointment);
          const now = options.now ?? new Date().toISOString();
          appointment.resourceVersion += 1;
          Object.assign(appointment, evaluation.schedule, { capacityConfigurationVersionId: capacity.configurationVersionId,
            ...(overbooking ? { overbooking: { ...overbooking, authorizedByMembershipId: auth.membershipId } } : { overbooking: undefined }) });
          const auditReference = recordAudit(auth, appointment, overbooking ? "appointment.rescheduled-overbooked" : "appointment.rescheduled", now,
            overbooking?.reason ?? context.reason, overbooking?.evidence ?? context.evidence, options.requestId);
          appointment.history.push({ sequence: appointment.history.length + 1, action: "RESCHEDULED", fromStatus: "BOOKED", toStatus: "BOOKED",
            occurredAt: now, actorIdentityId: auth.identityId, membershipId: auth.membershipId, reason: context.reason,
            evidence: overbooking?.evidence ?? context.evidence, auditReference, oldSchedule, newSchedule: scheduleOf(appointment) });
          return { status: 200, body: { appointment: clone(appointment), resourceVersion: appointment.resourceVersion, auditReference } };
        });
      }

      const transitionMatch = path.match(/^\/api\/v1\/appointments\/([^/]+)\/transitions$/);
      if (transitionMatch) {
        const auth = authorize(this.token, body.branchId, "appointment.manage");
        if ("status" in auth) return auth;
        const branchId = String(body.branchId);
        const context = reasonEvidence(body);
        const action = String(body.action ?? "") as "CANCEL" | "MARK_NO_SHOW" | "ARRIVE" | "CONVERT";
        if (!context || !["CANCEL", "MARK_NO_SHOW", "ARRIVE", "CONVERT"].includes(action)) return { status: 422, body: { code: "INVALID_APPOINTMENT_TRANSITION" } };
        return execute(auth, path, body, options, () => {
          const appointment = visible(auth, branchId, transitionMatch[1]);
          if (!appointment) return { status: 404, body: { code: "APPOINTMENT_NOT_FOUND" } };
          if (options.ifMatch === undefined) return { status: 428, body: { code: "IF_MATCH_REQUIRED" } };
          if (options.ifMatch !== appointment.resourceVersion) return { status: 412, body: { code: "VERSION_CONFLICT", resourceVersion: appointment.resourceVersion } };
          const transitions: Record<typeof action, { from: AppointmentStatus; to: AppointmentStatus; historyAction: AppointmentHistory["action"] }> = {
            CANCEL: { from: "BOOKED", to: "CANCELLED", historyAction: "CANCELLED" },
            MARK_NO_SHOW: { from: "BOOKED", to: "NO_SHOW", historyAction: "NO_SHOW" },
            ARRIVE: { from: "BOOKED", to: "ARRIVED", historyAction: "ARRIVED" },
            CONVERT: { from: "ARRIVED", to: "CONVERTED", historyAction: "CONVERTED" },
          };
          const transition = transitions[action];
          if (appointment.status !== transition.from) return { status: 409, body: { code: "APPOINTMENT_TRANSITION_NOT_ALLOWED" } };
          const now = options.now ?? new Date().toISOString();
          if (action === "MARK_NO_SHOW" && Date.parse(now) < Date.parse(appointment.scheduledStart)) return { status: 409, body: { code: "NO_SHOW_BEFORE_APPOINTMENT" } };
          appointment.resourceVersion += 1;
          appointment.status = transition.to;
          const auditReference = recordAudit(auth, appointment, `appointment.${action.toLowerCase().replace("mark_", "")}`, now, context.reason, context.evidence, options.requestId);
          appointment.history.push({ sequence: appointment.history.length + 1, action: transition.historyAction, fromStatus: transition.from, toStatus: transition.to,
            occurredAt: now, actorIdentityId: auth.identityId, membershipId: auth.membershipId, reason: context.reason,
            evidence: context.evidence, auditReference });
          let receptionRequest: ReceptionRequest | undefined;
          if (action === "CONVERT") {
            receptionRequest = { id: `reception-request-${++receptionSequence}`, tenantId: auth.tenantId, branchId,
              appointmentId: appointment.id, appointmentVersion: appointment.resourceVersion, customerId: appointment.customerId,
              vehicleId: appointment.vehicleId, assignedBayId: appointment.assignedBayId, assignedStaffId: appointment.assignedStaffId,
              requestedAt: now, auditReference, eventType: "RECEPTION_CHECK_IN_REQUESTED" };
            receptionRequests.push(receptionRequest);
          }
          return { status: action === "CONVERT" ? 202 : 200, body: { appointment: clone(appointment), resourceVersion: appointment.resourceVersion,
            auditReference, ...(receptionRequest ? { receptionRequest: clone(receptionRequest) } : {}) } };
        });
      }

      if (path !== "/api/v1/appointments") return { status: 404, body: { code: "ROUTE_NOT_FOUND" } };
      const auth = authorize(this.token, body.branchId, "appointment.manage");
      if ("status" in auth) return auth;
      const branchId = String(body.branchId);
      const capacity = capacityFor(auth, branchId);
      if (!capacity) return { status: 422, body: { code: "BRANCH_CAPACITY_NOT_CONFIGURED" } };
      const scheduleInput = parseSchedule(body, capacity);
      const customerId = String(body.customerId ?? "").trim();
      const vehicleId = String(body.vehicleId ?? "").trim();
      const reason = String(body.reason ?? "").trim();
      if (!scheduleInput || !customerId || !vehicleId || !reason) return { status: 422, body: { code: "INVALID_APPOINTMENT" } };
      return execute(auth, path, body, options, () => {
        const evaluation = evaluate(auth, branchId, scheduleInput);
        const overbookingRequest = requestedOverbooking(body);
        const overbooking = validOverbooking(body);
        if (!evaluation.result.available) {
          if (evaluation.result.code !== "CAPACITY_UNAVAILABLE" || !evaluation.schedule) return { status: 409, body: { code: evaluation.result.code, message: evaluation.result.message, availability: evaluation.result } };
          if (!overbookingRequest) return { status: 409, body: { code: evaluation.result.code, message: evaluation.result.message, availability: evaluation.result } };
          if (!auth.permissions.includes("appointment.overbook")) return { status: 403, body: { code: "OVERBOOK_PERMISSION_REQUIRED" } };
          if (!overbooking) return { status: 422, body: { code: "OVERBOOK_REASON_AND_EVIDENCE_REQUIRED" } };
          evaluation.schedule.overbooked = true;
        } else if (overbookingRequest) return { status: 422, body: { code: "OVERBOOKING_NOT_REQUIRED" } };
        if (!evaluation.schedule) return { status: 409, body: { code: evaluation.result.code, message: evaluation.result.message, availability: evaluation.result } };
        const now = options.now ?? new Date().toISOString();
        const appointment: Appointment = {
          id: `appointment-${++appointmentSequence}`, tenantId: auth.tenantId, branchId, customerId, vehicleId, status: "BOOKED",
          capacityConfigurationVersionId: capacity.configurationVersionId, resourceVersion: 1, history: [], ...evaluation.schedule,
          ...(overbooking ? { overbooking: { ...overbooking, authorizedByMembershipId: auth.membershipId } } : {}),
        };
        const auditReference = recordAudit(auth, appointment, overbooking ? "appointment.overbooked" : "appointment.created", now,
          overbooking?.reason ?? reason, overbooking?.evidence ?? [], options.requestId);
        appointment.history.push({ sequence: 1, action: "CREATED", fromStatus: null, toStatus: "BOOKED", occurredAt: now,
          actorIdentityId: auth.identityId, membershipId: auth.membershipId, reason, evidence: overbooking?.evidence ?? [], auditReference, newSchedule: clone(evaluation.schedule) });
        appointments.set(`${auth.tenantId}:${appointment.id}`, appointment);
        return { status: 201, body: { appointment: clone(appointment), resourceVersion: 1, auditReference } };
      });
    }

    async get(path: string): Promise<ApiResponse> {
      const url = new URL(path, "http://local");
      const branchId = url.searchParams.get("branchId") ?? "";
      const auth = authorize(this.token, branchId, "appointment.read");
      if ("status" in auth) return auth;
      if (url.pathname === "/api/v1/appointments/availability") {
        const capacity = capacityFor(auth, branchId);
        if (!capacity) return { status: 422, body: { code: "BRANCH_CAPACITY_NOT_CONFIGURED" } };
        const csv = (name: string) => (url.searchParams.get(name) ?? "").split(",").map((item) => item.trim()).filter(Boolean);
        const scheduleInput = parseSchedule({
          scheduledStart: url.searchParams.get("scheduledStart"), durationMinutes: url.searchParams.get("durationMinutes"),
          ...(url.searchParams.has("bufferBeforeMinutes") ? { bufferBeforeMinutes: url.searchParams.get("bufferBeforeMinutes") } : {}),
          ...(url.searchParams.has("bufferAfterMinutes") ? { bufferAfterMinutes: url.searchParams.get("bufferAfterMinutes") } : {}),
          requiredSkills: csv("requiredSkills"), requiredBaySkills: csv("requiredBaySkills"),
        }, capacity);
        if (!scheduleInput) return { status: 422, body: { code: "INVALID_AVAILABILITY_QUERY" } };
        return { status: 200, body: { availability: evaluate(auth, branchId, scheduleInput).result } };
      }
      if (url.pathname === "/api/v1/appointments/reception-requests") {
        return { status: 200, body: { receptionRequests: clone(receptionRequests.filter((request) =>
          request.tenantId === auth.tenantId && request.branchId === branchId)) } };
      }
      const match = url.pathname.match(/^\/api\/v1\/appointments\/([^/]+)$/);
      if (match) {
        const appointment = visible(auth, branchId, match[1]);
        return appointment ? { status: 200, body: { appointment: clone(appointment), resourceVersion: appointment.resourceVersion,
          auditEntries: clone(audits.filter((entry) => entry.tenantId === auth.tenantId && entry.branchId === branchId && entry.appointmentId === appointment.id)) } }
          : { status: 404, body: { code: "APPOINTMENT_NOT_FOUND" } };
      }
      return { status: 404, body: { code: "ROUTE_NOT_FOUND" } };
    }
  }

  return { signIn(token: string) { return new Session(token); } };
}
