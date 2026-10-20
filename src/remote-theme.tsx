import { useEffect, useState, type FormEvent } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";
import { APP_THEME_FONTS, APP_THEME_PALETTES, DEFAULT_APP_THEME, type AppTheme } from "./admin-demo-state";

export async function loadRemoteTheme(config: CognitoConfig): Promise<AppTheme> {
  const response = await authenticatedFetch(config, "/api/v1/tenant/theme", { cache: "no-store" });
  if (!response.ok) throw new Error(`Theme could not be loaded (${response.status}).`);
  const value = await response.json() as AppTheme;
  return {
    fontId: APP_THEME_FONTS.some((item) => item.id === value.fontId) ? value.fontId : DEFAULT_APP_THEME.fontId,
    paletteId: APP_THEME_PALETTES.some((item) => item.id === value.paletteId) ? value.paletteId : DEFAULT_APP_THEME.paletteId,
  };
}

export function RemoteTheme({ config, onSaved }: { config: CognitoConfig; onSaved?: (theme: AppTheme) => void }) {
  const [theme, setTheme] = useState<AppTheme>({ ...DEFAULT_APP_THEME });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => { void loadRemoteTheme(config).then(setTheme).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Theme could not be loaded.")); }, [config]);
  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await authenticatedFetch(config, "/api/v1/tenant/theme", { method: "PUT",
        headers: { "content-type": "application/json" }, body: JSON.stringify(theme) });
      if (!response.ok) throw new Error(`Theme could not be saved (${response.status}).`);
      const persisted = await response.json() as AppTheme;
      setTheme(persisted); onSaved?.(persisted); setNotice("Theme saved for this workshop.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Theme could not be saved."); }
    finally { setBusy(false); }
  };
  return <section className="manager-panel" aria-label="App Theme"><form className="form-grid" onSubmit={(event) => void save(event)}>
    <h3>App Theme</h3>
    {error && <p role="alert" className="form-error">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <label>Font<select value={theme.fontId} onChange={(event) => setTheme((current) => ({ ...current, fontId: event.target.value as AppTheme["fontId"] }))}>
      {APP_THEME_FONTS.map((font) => <option key={font.id} value={font.id}>{font.label}</option>)}</select></label>
    <label>Palette<select value={theme.paletteId} onChange={(event) => setTheme((current) => ({ ...current, paletteId: event.target.value as AppTheme["paletteId"] }))}>
      {APP_THEME_PALETTES.map((palette) => <option key={palette.id} value={palette.id}>{palette.label}</option>)}</select></label>
    <button className="primary-action" disabled={busy}>Save theme</button>
  </form></section>;
}
