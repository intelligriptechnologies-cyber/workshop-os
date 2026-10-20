import { authenticatedFetch, type CognitoConfig } from "./auth";
import type { ReportTemplate } from "./report-templates";

export type TenantSettings = {
  businessName?: string;
  legalName?: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  footer?: string;
  companyAssets?: { logo?: string | null; stamp?: string | null; authorizedSignature?: string | null };
  reportTemplates?: ReportTemplate[];
  [key: string]: unknown;
};

async function request(config: CognitoConfig, method: "GET" | "PUT", settings?: TenantSettings): Promise<TenantSettings> {
  const response = await authenticatedFetch(config, "/api/v1/tenant/settings", {
    method, cache: "no-store",
    ...(method === "PUT" ? { headers: { "content-type": "application/json" }, body: JSON.stringify({ settings }) } : {}),
  });
  const payload = await response.json() as { settings?: TenantSettings; code?: string };
  if (!response.ok) throw new Error(payload.code ?? "SETTINGS_API_FAILED");
  return payload.settings ?? {};
}

export const tenantSettingsApi = {
  read: (config: CognitoConfig) => request(config, "GET"),
  save: (config: CognitoConfig, settings: TenantSettings) => request(config, "PUT", settings),
};
