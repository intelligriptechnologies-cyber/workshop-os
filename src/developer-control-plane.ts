import type { Role } from "./types";

export const DEVELOPER_EMAIL = "developer@admin.com";
export const DEVELOPER_PASSWORD = "admin123";
export const DEVELOPER_CONTROL_PLANE_VERSION = 1;
export const DEVELOPER_CONTROL_PLANE_STORAGE_KEY = `workshopos.developer-control-plane.v${DEVELOPER_CONTROL_PLANE_VERSION}`;

export type TenantLifecycle = "active" | "disabled";
export type EmulationRole = "admin" | "service" | "reception" | "accounts" | "tech";

export interface TenantProfile {
  name: string;
  brandName: string;
  address: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  timezone: string;
  currency: string;
  invoicePrefix: string;
}

export interface DemoTenant {
  id: string;
  lifecycle: TenantLifecycle;
  profile: TenantProfile;
  createdAt: string;
}

export interface CommunicationChannel {
  active: boolean;
  sender: string;
}

export interface CommunicationLog {
  id: string;
  channel: "email" | "whatsapp";
  tenantId: string;
  recipient: string;
  result: "simulated" | "blocked";
  createdAt: string;
}

export interface PlatformChargePayment { id: string; amount: number; paidAt: string; note: string; }
export interface PlatformCharge {
  id: string;
  tenantId: string;
  description: string;
  amount: number;
  dueDate: string;
  payments: PlatformChargePayment[];
  createdAt: string;
}

export interface DeveloperControlPlaneState {
  version: number;
  tenants: DemoTenant[];
  selectedTenantId: string;
  communications: { email: CommunicationChannel; whatsapp: CommunicationChannel };
  communicationLogs: CommunicationLog[];
  charges: PlatformCharge[];
}

export interface SessionStorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
const browserStorage = (): SessionStorageLike | undefined => typeof sessionStorage === "undefined" ? undefined : sessionStorage;
const iso = (now: Date | string) => new Date(now).toISOString();

export const EMULATION_ROLE_LABELS: Record<EmulationRole, string> = {
  admin: "Owner/Admin", service: "Service", reception: "Reception", accounts: "Accounts", tech: "Technician",
};

export function createDefaultDeveloperControlPlane(now: Date | string = new Date()): DeveloperControlPlaneState {
  const createdAt = iso(now);
  const tenant: DemoTenant = {
    id: "tenant-demo-1", lifecycle: "active", createdAt,
    profile: { name: "Apex Auto Studio", brandName: "Apex", address: "14 Workshop Lane, Bengaluru", contactName: "Demo Owner", email: "owner@apex.demo", phone: "+91 90000 00000", gstin: "29ABCDE1234F1Z5", timezone: "Asia/Kolkata", currency: "INR", invoicePrefix: "APEX" },
  };
  return { version: DEVELOPER_CONTROL_PLANE_VERSION, tenants: [tenant], selectedTenantId: tenant.id, communications: { email: { active: true, sender: "WorkshopOS Demo <demo@workshopos.local>" }, whatsapp: { active: true, sender: "WorkshopOS Demo" } }, communicationLogs: [], charges: [] };
}

function valid(value: unknown): value is DeveloperControlPlaneState {
  return !!value && typeof value === "object" && (value as DeveloperControlPlaneState).version === DEVELOPER_CONTROL_PLANE_VERSION && Array.isArray((value as DeveloperControlPlaneState).tenants);
}
export function loadDeveloperControlPlane(storage: SessionStorageLike | undefined = browserStorage(), now: Date | string = new Date()): DeveloperControlPlaneState {
  try { const raw = storage?.getItem(DEVELOPER_CONTROL_PLANE_STORAGE_KEY); const parsed = raw ? JSON.parse(raw) : undefined; return valid(parsed) ? parsed : createDefaultDeveloperControlPlane(now); } catch { return createDefaultDeveloperControlPlane(now); }
}
export function saveDeveloperControlPlane(state: DeveloperControlPlaneState, storage: SessionStorageLike | undefined = browserStorage()): DeveloperControlPlaneState {
  storage?.setItem(DEVELOPER_CONTROL_PLANE_STORAGE_KEY, JSON.stringify(state)); return state;
}
export function resetDeveloperControlPlane(storage: SessionStorageLike | undefined = browserStorage(), now: Date | string = new Date()): DeveloperControlPlaneState {
  const state = createDefaultDeveloperControlPlane(now); return saveDeveloperControlPlane(state, storage);
}
export function selectedTenant(state: DeveloperControlPlaneState): DemoTenant {
  return state.tenants.find((tenant) => tenant.id === state.selectedTenantId) ?? state.tenants[0];
}
export function createTenant(state: DeveloperControlPlaneState, profile: TenantProfile, now: Date | string = new Date()): DeveloperControlPlaneState {
  if (!profile.name.trim()) throw new Error("Tenant name is required.");
  const tenant = { id: `tenant-${state.tenants.length + 1}`, lifecycle: "active" as const, profile: { ...profile, name: profile.name.trim() }, createdAt: iso(now) };
  return { ...state, tenants: [...state.tenants, tenant], selectedTenantId: tenant.id };
}
export function selectTenant(state: DeveloperControlPlaneState, tenantId: string): DeveloperControlPlaneState {
  if (!state.tenants.some((tenant) => tenant.id === tenantId)) throw new Error("Tenant not found.");
  return { ...state, selectedTenantId: tenantId };
}
export function setTenantLifecycle(state: DeveloperControlPlaneState, tenantId: string, lifecycle: TenantLifecycle): DeveloperControlPlaneState {
  return { ...state, tenants: state.tenants.map((tenant) => tenant.id === tenantId ? { ...tenant, lifecycle } : tenant) };
}
export function updateTenantProfile(state: DeveloperControlPlaneState, tenantId: string, profile: Partial<TenantProfile>): DeveloperControlPlaneState {
  return { ...state, tenants: state.tenants.map((tenant) => tenant.id === tenantId ? { ...tenant, profile: { ...tenant.profile, ...profile } } : tenant) };
}
export function updateCommunication(state: DeveloperControlPlaneState, channel: "email" | "whatsapp", updates: Partial<CommunicationChannel>): DeveloperControlPlaneState {
  return { ...state, communications: { ...state.communications, [channel]: { ...state.communications[channel], ...updates } } };
}
export function simulateCommunicationTest(state: DeveloperControlPlaneState, channel: "email" | "whatsapp", tenantId: string, recipient: string, now: Date | string = new Date()): DeveloperControlPlaneState {
  const tenant = state.tenants.find((item) => item.id === tenantId);
  if (!tenant) throw new Error("Tenant not found.");
  const result = state.communications[channel].active && tenant.lifecycle === "active" ? "simulated" : "blocked";
  const entry: CommunicationLog = { id: `message-${state.communicationLogs.length + 1}`, channel, tenantId, recipient: recipient.trim() || tenant.profile.email, result, createdAt: iso(now) };
  return { ...state, communicationLogs: [entry, ...state.communicationLogs] };
}
export function createPlatformCharge(state: DeveloperControlPlaneState, input: { tenantId: string; description: string; amount: number; dueDate: string }, now: Date | string = new Date()): DeveloperControlPlaneState {
  if (!input.description.trim() || !(input.amount > 0) || !input.dueDate) throw new Error("Description, a positive amount, and due date are required.");
  const charge: PlatformCharge = { id: `charge-${state.charges.length + 1}`, tenantId: input.tenantId, description: input.description.trim(), amount: input.amount, dueDate: input.dueDate, payments: [], createdAt: iso(now) };
  return { ...state, charges: [charge, ...state.charges] };
}
export function recordPlatformPayment(state: DeveloperControlPlaneState, chargeId: string, amount: number, note = "", now: Date | string = new Date()): DeveloperControlPlaneState {
  if (!(amount > 0)) throw new Error("Payment amount must be positive.");
  return { ...state, charges: state.charges.map((charge) => charge.id === chargeId ? { ...charge, payments: [...charge.payments, { id: `${charge.id}-payment-${charge.payments.length + 1}`, amount, note, paidAt: iso(now) }] } : charge) };
}
export function chargeStatus(charge: PlatformCharge): "Unpaid" | "Partial" | "Paid" { const paid = charge.payments.reduce((sum, payment) => sum + payment.amount, 0); return paid >= charge.amount ? "Paid" : paid > 0 ? "Partial" : "Unpaid"; }
export function roleForEmulation(role: EmulationRole): Role { return role; }
