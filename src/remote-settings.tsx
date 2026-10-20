import { useEffect, useState, type FormEvent } from "react";
import type { CognitoConfig } from "./auth";
import { REPORT_CATEGORY_LABELS, seedReportTemplates, type ReportCategory, type ReportTemplate } from "./report-templates";
import { tenantSettingsApi, type TenantSettings } from "./tenant-settings-api";

type Mode = "business" | "company" | "templates";
const BUSINESS_FIELDS = ["businessName", "legalName", "phone", "email", "address", "gstin", "footer"] as const;
const LABELS: Record<(typeof BUSINESS_FIELDS)[number], string> = {
  businessName: "Business name", legalName: "Legal name", phone: "Phone", email: "Email",
  address: "Address", gstin: "GSTIN", footer: "Document footer",
};

export function RemoteSettings({ config, mode }: { config: CognitoConfig; mode: Mode }) {
  const [settings, setSettings] = useState<TenantSettings>({});
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const refresh = async () => {
    const next = await tenantSettingsApi.read(config);
    setSettings(next);
    const nextTemplates = Array.isArray(next.reportTemplates) ? next.reportTemplates : seedReportTemplates();
    setTemplates(nextTemplates);
    setSelectedId((id) => nextTemplates.some((item) => item.id === id) ? id : nextTemplates[0]?.id ?? "");
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "Settings could not be loaded.")); }, [config]);
  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const otherSettings = { ...settings };
      delete otherSettings.appTheme;
      const persisted = await tenantSettingsApi.save(config, { ...otherSettings, reportTemplates: templates });
      setSettings(persisted); setNotice("Settings saved for this workshop.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Settings could not be saved."); }
    finally { setBusy(false); }
  };
  const selected = templates.find((item) => item.id === selectedId);
  const changeTemplate = (update: Partial<ReportTemplate>) => setTemplates((current) => current.map((item) => item.id === selectedId ? { ...item, ...update, updatedAt: new Date().toISOString() } : item));
  const addTemplate = () => {
    const category: ReportCategory = "quotation";
    const now = new Date().toISOString();
    const item: ReportTemplate = { id: crypto.randomUUID(), category, name: "New quotation template", html: "<main><h1>Quotation</h1></main>", active: false, createdAt: now, updatedAt: now };
    setTemplates((current) => [...current, item]); setSelectedId(item.id); setNotice("");
  };
  const uploadAsset = (key: "logo" | "stamp" | "authorizedSignature", file?: File) => {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 1_000_000) {
      setError("Choose a PNG or JPEG image under 1 MB."); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSettings((current) => ({ ...current, companyAssets: { ...current.companyAssets, [key]: reader.result as string } }));
        setError(""); setNotice("");
      }
    };
    reader.onerror = () => setError("Image could not be read.");
    reader.readAsDataURL(file);
  };
  return <section className="admin-tab"><form onSubmit={save}>
    <h3>{mode === "templates" ? "Report Templates" : mode === "company" ? "Company Settings" : "Business Settings"}</h3>
    {error && <p className="api-error" role="alert">{error} <button type="button" onClick={() => void refresh()}>Retry</button></p>}
    {notice && <p role="status">{notice}</p>}
    {mode === "templates" ? <>
      <div className="form-grid"><label>Template<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{templates.map((item) => <option key={item.id} value={item.id}>{item.name} · {REPORT_CATEGORY_LABELS[item.category]}</option>)}</select></label>
      <button type="button" onClick={addTemplate}>Add template</button></div>
      {selected && <div className="form-grid"><label>Name<input required value={selected.name} onChange={(event) => changeTemplate({ name: event.target.value })} /></label>
        <label>Category<select value={selected.category} onChange={(event) => changeTemplate({ category: event.target.value as ReportCategory })}>{(Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => <option key={category} value={category}>{REPORT_CATEGORY_LABELS[category]}</option>)}</select></label>
        <label><input type="checkbox" checked={selected.active} onChange={(event) => changeTemplate({ active: event.target.checked })} /> Active</label>
        <label>HTML<textarea rows={14} value={selected.html} onChange={(event) => changeTemplate({ html: event.target.value })} /></label></div>}
    </> : <><div className="form-grid">{BUSINESS_FIELDS.map((field) => <label key={field}>{LABELS[field]}<input value={String(settings[field] ?? "")} onChange={(event) => setSettings((current) => ({ ...current, [field]: event.target.value }))} /></label>)}</div>
      {mode === "company" && <div className="company-assets-grid">{(["logo", "stamp", "authorizedSignature"] as const).map((key) => <div key={key} className="company-image-field">
        <strong>{key === "authorizedSignature" ? "Authorized signature" : `Company ${key}`}</strong>
        {settings.companyAssets?.[key] && <img src={settings.companyAssets[key] ?? ""} alt={`${key} preview`} style={{ maxWidth: 180, maxHeight: 100 }} />}
        <input type="file" accept="image/png,image/jpeg" onChange={(event) => uploadAsset(key, event.target.files?.[0])} />
        {settings.companyAssets?.[key] && <button type="button" onClick={() => setSettings((current) => ({ ...current, companyAssets: { ...current.companyAssets, [key]: null } }))}>Remove</button>}
      </div>)}</div>}
    </>}
    <button className="primary-action" disabled={busy}>Save changes</button>
  </form></section>;
}
