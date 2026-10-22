# Private helper and callback contracts
Source evidence for validations, calculations and guards not represented by exported operations.

## src/admin-console.tsx commit

src/admin-console.tsx:143

~~~typescript
commit = (
    mutator: (current: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => {
    try {
      let next = mutator(adminState);
      if (entry) next = appendDemoLog(next, entry);
      const saved = saveAdminDemoState(next);
      setAdminState(saved);
      onStateSaved?.();
      setStorageError("");
      return true;
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? error.message
          : "Unable to save this session. Your previous settings are unchanged.",
      );
      return false;
    }
  }
~~~

## src/admin-console.tsx refresh

src/admin-console.tsx:165

~~~typescript
refresh = () => setAdminState(loadAdminDemoState())
~~~

## src/admin-console.tsx refreshRemote

src/admin-console.tsx:293

~~~typescript
refreshRemote = async () => {
    if (!cognitoConfig) return;
    try { setRemote(await adminUsersApi.list(cognitoConfig)); setError(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "TEAM_STRUCTURE_API_FAILED"); }
  }
~~~

## src/admin-console.tsx create

src/admin-console.tsx:322

~~~typescript
create = (event: React.FormEvent) => {
    event.preventDefault();
    let departmentId = 0;
    if (mutate((db) => { departmentId = createServiceDepartment(db, name); })) {
      setName("");
      setSelectedId(departmentId);
    }
  }
~~~

## src/admin-console.tsx names

src/admin-console.tsx:344

~~~typescript
names = (ids: number[]) => ids.map((id) => users.find((user) => user.id === id)?.name).filter(Boolean).join(", ")
~~~

## src/admin-console.tsx run

src/admin-console.tsx:362

~~~typescript
run = async (action: () => Promise<unknown>) => { try { setError(""); await action(); await onChanged(); } catch (caught) { setError(caught instanceof Error ? caught.message : "TEAM_STRUCTURE_API_FAILED"); } }
~~~

## src/admin-console.tsx clearFilters

src/admin-console.tsx:414

~~~typescript
clearFilters = () => { setQuery(""); setDepartmentId(0); setBrandId(0); setSegmentId(0); }
~~~

## src/admin-console.tsx save

src/admin-console.tsx:608

~~~typescript
save = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const saved = mutate(
      (db) =>
        item
          ? updateServiceCatalogItemForActor(db, actor.id, item.id, {
              name,
              base_rate: rate,
              gst_rate: gstRate,
              service_department_id: departmentId,
              brand_id: brandId || null,
              car_segment_id: segmentId || null,
            })
          : createServiceCatalogItemForActor(db, actor.id, {
              name,
              base_rate: rate,
              gst_rate: gstRate,
              service_department_id: departmentId,
              brand_id: brandId || null,
              car_segment_id: segmentId || null,
            }),
      setError,
    );
    if (saved) onClose();
  }
~~~

## src/admin-console.tsx save

src/admin-console.tsx:725

~~~typescript
save = (event: React.FormEvent) => { event.preventDefault(); let id = item?.id ?? 0; const ok = mutate((db) => { id = item ? (updateServiceCatalogMaster(db, table, item.id, name, item.status), item.id) : createServiceCatalogMaster(db, table, name); }, setError); if (ok) { onCreated?.(id); if (!onCreated) onClose(); } }
~~~

## src/admin-console.tsx togglePage

src/admin-console.tsx:789

~~~typescript
togglePage = (key: AdminPageKey) => {
    if (isOwnerRole && key === "admin-console") return;
    setDraftPages((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }
~~~

## src/admin-console.tsx toggleGroup

src/admin-console.tsx:795

~~~typescript
toggleGroup = (keys: AdminPageKey[], checked: boolean) => {
    setDraftPages((prev) => {
      const withoutGroup = prev.filter((item) => !keys.includes(item));
      const next = checked ? [...withoutGroup, ...keys] : withoutGroup;
      return isOwnerRole
        ? Array.from(new Set([...next, "admin-console" as AdminPageKey]))
        : next;
    });
  }
~~~

## src/admin-console.tsx save

src/admin-console.tsx:1298

~~~typescript
save = () => {
    const saved = commit((current) => updateAppTheme(current, draft), {
      stream: "feature",
      level: "info",
      area: "Administration",
      feature: "App Theme",
      message: `App theme saved: ${font.label} / ${palette.label}`,
      userId: String(actingUser.id),
      userName: actingUser.name,
    });
    if (!saved) return;
    onThemeSaved?.(draft);
    setJustSaved(true);
  }
~~~

## src/admin-console.tsx setField

src/admin-console.tsx:1504

~~~typescript
setField = <G extends keyof WorkshopBusinessSettings>(
    group: G,
    field: keyof WorkshopBusinessSettings[G],
    value: WorkshopBusinessSettings[G][keyof WorkshopBusinessSettings[G]],
  ) => {
    setJustSaved(false);
    setDraft((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  }
~~~

## src/admin-console.tsx toggleListValue

src/admin-console.tsx:1515

~~~typescript
toggleListValue = <G extends keyof WorkshopBusinessSettings>(
    group: G,
    field: keyof WorkshopBusinessSettings[G],
    value: string,
  ) => {
    setJustSaved(false);
    setDraft((prev) => {
      const current = prev[group][field] as unknown as string[];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [group]: { ...prev[group], [field]: next } };
    });
  }
~~~

## src/admin-console.tsx save

src/admin-console.tsx:1530

~~~typescript
save = () => {
    const normalized = normalizeBusinessSettings(draft);
    const validationErrors = validateBusinessSettings(normalized);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;
    const saved = commit(
      (current) => updateBusinessSettings(current, normalized),
      {
        stream: "feature",
        level: "info",
        area: "Administration",
        feature: "Business Settings",
        message: "Business settings saved",
        userId: String(actingUser.id),
        userName: actingUser.name,
      },
    );
    if (!saved) return;
    setDraft(normalized);
    setJustSaved(true);
  }
~~~

## src/admin-console.tsx reset

src/admin-console.tsx:1551

~~~typescript
reset = () => {
    if (
      !window.confirm(
        "Reset unsaved changes back to the saved business settings?",
      )
    )
      return;
    setDraft(adminState.businessSettings);
    setErrors([]);
    setJustSaved(false);
  }
~~~

## src/admin-console.tsx fitImage

src/admin-console.tsx:2175

~~~typescript
function fitImage(file: File, dataUrl: string): Promise<string> {
  const withinBudget = (url: string) =>
    Math.ceil((url.length - url.indexOf(",") - 1) * 0.75) <=
    MAX_COMPANY_IMAGE_BYTES;
  if (file.size <= MAX_COMPANY_IMAGE_BYTES) return Promise.resolve(dataUrl);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error("could not be read"));
    image.onload = () => {
      const scale = Math.min(
        1,
        MAX_IMAGE_EDGE / Math.max(image.width, image.height),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas
        .getContext("2d")
        ?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const out = canvas.toDataURL(file.type, 0.85);
      if (withinBudget(out)) resolve(out);
      else reject(new Error("is too large even after downscaling"));
    };
    image.src = dataUrl;
  });
}
~~~

## src/admin-console.tsx withinBudget

src/admin-console.tsx:2176

~~~typescript
withinBudget = (url: string) =>
    Math.ceil((url.length - url.indexOf(",") - 1) * 0.75) <=
    MAX_COMPANY_IMAGE_BYTES
~~~

## src/admin-console.tsx choose

src/admin-console.tsx:2214

~~~typescript
choose = (file?: File) => {
    if (!file) return;
    if (!IMAGE_TYPES.has(file.type)) {
      onError(`${label} must be a PNG or JPEG image.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => onError(`${label} could not be read.`);
    reader.onload = () => {
      if (typeof reader.result === "string")
        fitImage(file, reader.result).then(
          (url) => {
            onError("");
            onChange(url);
          },
          (error: Error) => onError(`${label} ${error.message}.`),
        );
    };
    reader.readAsDataURL(file);
  }
~~~

## src/admin-console.tsx changeAsset

src/admin-console.tsx:2313

~~~typescript
changeAsset = (key: keyof CompanyAssets, next: string | null) => {
    setSavedMessage(false);
    setAssets((current) => ({ ...current, [key]: next }));
  }
~~~

## src/admin-console.tsx save

src/admin-console.tsx:2317

~~~typescript
save = () => {
    if (!companyName.trim()) {
      setError("Company name is required.");
      return;
    }
    const ok = commit(
      (current) => saveCompanyIdentity(current, companyName, assets, details),
      {
        stream: "feature",
        level: "info",
        area: "Administration",
        feature: "Company Settings",
        message: "Company identity and report assets saved",
        userId: String(actingUser.id),
        userName: actingUser.name,
      },
    );
    if (ok) {
      setError("");
      setSavedMessage(true);
    }
  }
~~~

## src/admin-console.tsx reset

src/admin-console.tsx:2339

~~~typescript
reset = () => {
    if (dirty && !window.confirm("Reset unsaved company settings?")) return;
    setCompanyName(saved.companyName);
    setAssets(saved.assets);
    setDetails(saved.details);
    setError("");
    setSavedMessage(false);
  }
~~~

## src/admin-console.tsx setDetail

src/admin-console.tsx:2347

~~~typescript
setDetail = (key: keyof CompanyDetails, next: string) => {
    setSavedMessage(false);
    setDetails((current) => ({ ...current, [key]: next }));
  }
~~~

## src/admin-console.tsx guard

src/admin-console.tsx:2510

~~~typescript
guard = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    }
~~~

## src/admin-console.tsx load

src/admin-console.tsx:2517

~~~typescript
load = (id: string | null, nextCategory = category) => {
    const template = id
      ? adminState.reportTemplates.find((item) => item.id === id)
      : undefined;
    setSelectedId(id);
    setDraft({
      name: template?.name ?? "",
      html: template?.html ?? "",
      active: template?.active ?? false,
    });
    setErrors([]);
    setJustSaved(false);
    setCategory(nextCategory);
  }
~~~

## src/admin-console.tsx confirmDiscard

src/admin-console.tsx:2531

~~~typescript
confirmDiscard = () =>
    !dirty || window.confirm("Discard unsaved template changes?")
~~~

## src/admin-console.tsx changeCategory

src/admin-console.tsx:2533

~~~typescript
changeCategory = (next: ReportCategory) => {
    if (!confirmDiscard()) return;
    const templates = adminState.reportTemplates.filter(
      (item) => item.category === next,
    );
    const template = templates.find((item) => item.active) ?? templates[0];
    setCategory(next);
    load(template?.id ?? null, next);
  }
~~~

## src/admin-console.tsx save

src/admin-console.tsx:2542

~~~typescript
save = () => {
    const validation: string[] = [];
    if (!draft.name.trim()) validation.push("Template name is required.");
    if (!draft.html.trim()) validation.push("Template HTML is required.");
    if (unsupported.length)
      validation.push(`Unsupported placeholders: ${unsupported.join(", ")}`);
    if (validation.length) {
      setErrors(validation);
      return;
    }
    let nextId = selectedId;
    const ok = commit(
      (current) => {
        const next = selectedId
          ? updateReportTemplate(current, selectedId, draft)
          : createReportTemplate(current, { category, ...draft });
        if (!selectedId) nextId = next.reportTemplates.at(-1)?.id ?? null;
        return next;
      },
      {
        stream: "feature",
        level: "info",
        area: "Administration",
        feature: "Report Templates",
        message: `${REPORT_CATEGORY_LABELS[category]} template ${selectedId ? "updated" : "created"}`,
        userId: String(actingUser.id),
        userName: actingUser.name,
      },
    );
    if (ok) {
      setSelectedId(nextId);
      setErrors([]);
      setJustSaved(true);
    }
  }
~~~

## src/admin-console.tsx remove

src/admin-console.tsx:2589

~~~typescript
remove = () => {
    if (!selectedId || !selected) return;
    if (!window.confirm(`Delete template "${selected.name}"?`)) return;
    const ok = commit((current) => deleteReportTemplate(current, selectedId), {
      stream: "feature",
      level: "info",
      area: "Administration",
      feature: "Report Templates",
      message: `${REPORT_CATEGORY_LABELS[category]} template deleted`,
      userId: String(actingUser.id),
      userName: actingUser.name,
    });
    if (ok) {
      const rest = adminState.reportTemplates.filter(
        (item) => item.category === category && item.id !== selectedId,
      );
      const next = rest.find((item) => item.active) ?? rest[0];
      setSelectedId(next?.id ?? null);
      setDraft({
        name: next?.name ?? "",
        html: next?.html ?? "",
        active: next?.active ?? false,
      });
      setJustSaved(false);
      setErrors([]);
    }
  }
~~~

## src/admin-console.tsx downloadTemplate

src/admin-console.tsx:2793

~~~typescript
function downloadTemplate() {
  const buffer = buildInventoryTemplateBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "workshopos-inventory-import-template.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}
~~~

## src/admin-console.tsx resetWizard

src/admin-console.tsx:2844

~~~typescript
resetWizard = () => {
    setStep(1);
    setFileName("");
    setParsed(undefined);
    setMapping({});
    setPreview(undefined);
    setUploadError("");
    setResult(undefined);
  }
~~~

## src/admin-console.tsx onFileChosen

src/admin-console.tsx:2854

~~~typescript
onFileChosen = async (file: File) => {
    setUploadError("");
    try {
      const buffer = await file.arrayBuffer();
      const workbook = parseInventoryWorkbook(buffer);
      setFileName(file.name);
      setParsed(workbook);
      setMapping(suggestInventoryColumnMapping(workbook.headers));
      setStep(2);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Could not read this file.",
      );
    }
  }
~~~

## src/admin-console.tsx runValidation

src/admin-console.tsx:2870

~~~typescript
runValidation = () => {
    if (!parsed) return;
    const nextPreview = buildInventoryImportPreview({
      headers: parsed.headers,
      rows: parsed.rows,
      mapping,
      existingInventory,
    });
    setPreview(nextPreview);
    setStep(3);
  }
~~~

## src/admin-console.tsx confirmImport

src/admin-console.tsx:2882

~~~typescript
confirmImport = () => {
    if (!preview || preview.validRows.length === 0) return;
    const validRows = preview.validRows.map((row) => ({
      sku: row.item.sku,
      name: row.item.name,
      category: row.item.category,
      unit: row.item.unit,
      stockQty: row.item.stock_qty,
      lowStockQty: row.item.low_stock_qty,
      sellingPrice: row.item.selling_price,
    }));
    let batchId = "";
    commit(
      (current) => {
        const before = current.importBatches.length;
        const next = confirmInventoryImport(current, {
          fileName,
          columnMapping: mapping as Record<string, string>,
          totalRows: preview.totalRows,
          validRows,
          rejectedRows: preview.rejectedRows.length,
        });
        batchId = next.importBatches[before]?.id ?? "";
        return next;
      },
      {
        stream: "feature",
        level: "info",
        area: "Inventory",
        feature: "Inventory Import",
        message: `Imported ${validRows.length} of ${preview.totalRows} rows from "${fileName}"`,
        userId: String(actingUser.id),
        userName: actingUser.name,
      },
    );
    setResult({
      accepted: validRows.length,
      rejected: preview.rejectedRows.length,
      total: preview.totalRows,
      batchId,
    });
    setStep(4);
  }
~~~

## src/admin-console.tsx clearFilters

src/admin-console.tsx:3247

~~~typescript
clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setLevel("ALL");
    setArea("ALL");
    setPage(1);
  }
~~~

## src/admin-console.tsx clear

src/admin-console.tsx:3267

~~~typescript
clear = () => {
    if (
      !window.confirm(
        `Clear all ${stream} logs for this session? This cannot be undone.`,
      )
    )
      return;
    commit((current) => clearDemoLogs(current, stream));
  }
~~~

## src/admin-demo-state.ts builtInRoles

src/admin-demo-state.ts:440

~~~typescript
function builtInRoles(timestamp: string): DemoRole[] {
  return (Object.entries(BUILT_IN_ROLE_LABELS) as Array<[Role, string]>).map(([id, label]) => ({
    id,
    label,
    description: `${label} workspace access`,
    systemRole: id,
    isBuiltIn: true,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}
~~~

## src/admin-demo-state.ts defaultLogs

src/admin-demo-state.ts:453

~~~typescript
function defaultLogs(timestamp: string): DemoLogEntry[] {
  const at = new Date(timestamp).getTime();
  const isoBefore = (minutes: number) => new Date(at - minutes * 60_000).toISOString();
  return [
    { id: "log-default-1", stream: "operational", timestamp: isoBefore(5), level: "info", area: "Jobs", feature: "Job Card", message: "Job card JC-2026-002144 opened", userId: "service", userName: "Service Advisor", referenceId: "JC-2026-002144" },
    { id: "log-default-2", stream: "operational", timestamp: isoBefore(18), level: "warning", area: "Inventory", feature: "Stock", message: "Gloss PPF roll reached its low-stock threshold", userId: "store", userName: "Store", referenceId: "PPF-ROLL" },
    { id: "log-default-3", stream: "operational", timestamp: isoBefore(31), level: "info", area: "Accounts", feature: "Payment", message: "Payment recorded for a completed job", userId: "accounts", userName: "Accounts" },
    { id: "log-default-4", stream: "feature", timestamp: isoBefore(45), level: "info", area: "Administration", feature: "Business Settings", message: "Demo business settings reviewed", userId: "admin", userName: "Owner/Admin" },
    { id: "log-default-5", stream: "feature", timestamp: isoBefore(60), level: "info", area: "Authentication", feature: "Login", message: "Owner/Admin signed in", userId: "admin", userName: "Owner/Admin" },
  ];
}
~~~

## src/admin-demo-state.ts isoBefore

src/admin-demo-state.ts:455

~~~typescript
isoBefore = (minutes: number) => new Date(at - minutes * 60_000).toISOString()
~~~

## src/admin-demo-state.ts clone

src/admin-demo-state.ts:465

~~~typescript
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
~~~

## src/admin-demo-state.ts browserSessionStorage

src/admin-demo-state.ts:493

~~~typescript
function browserSessionStorage(): SessionStorageLike | undefined {
  return typeof sessionStorage === "undefined" ? undefined : sessionStorage;
}
~~~

## src/admin-demo-state.ts mergeSettings

src/admin-demo-state.ts:497

~~~typescript
function mergeSettings(
  saved?: DeepPartial<WorkshopBusinessSettings>,
  base: WorkshopBusinessSettings = DEFAULT_SETTINGS,
): WorkshopBusinessSettings {
  if (!saved) return clone(base);
  const legacy = saved as DeepPartial<WorkshopBusinessSettings> & { profile?: { gstin?: string } };
  const { gstin: _legacyGstin, ...savedProfile } = legacy.profile ?? {};
  const migratedGstin = saved.billing?.gstin === undefined && legacy.profile?.gstin !== undefined
    ? legacy.profile.gstin
    : saved.billing?.gstin;
  return {
    profile: { ...base.profile, ...savedProfile },
    branch: { ...base.branch, ...saved.branch },
    jobs: { ...base.jobs, ...saved.jobs },
    pricing: { ...base.pricing, ...saved.pricing },
    billing: { ...base.billing, ...saved.billing, ...(migratedGstin === undefined ? {} : { gstin: migratedGstin }) },
    inventory: { ...base.inventory, ...saved.inventory },
    notifications: { ...base.notifications, ...saved.notifications },
    logRetention: { ...base.logRetention, ...saved.logRetention },
  };
}
~~~

## src/admin-demo-state.ts hydrateState

src/admin-demo-state.ts:519

~~~typescript
function hydrateState(value: unknown): AdminDemoState | undefined {
  if (!value || typeof value !== "object") return undefined;
  const saved = value as PersistedAdminDemoState;
  if ((saved.version !== ADMIN_DEMO_STATE_VERSION && saved.version !== 1) || !Array.isArray(saved.roles) || !saved.rolePageAccess || !Array.isArray(saved.logs)) return undefined;
  const base = createDefaultAdminDemoState();
  const access = Object.fromEntries(Object.entries(saved.rolePageAccess).map(([roleId, pages]) => [roleId, sanitizePages(pages)]));
  // Version 1 showed Sales CRM outside Page Access. Preserve that effective
  // Owner/Admin access while moving it into the catalogue in version 2.
  if (saved.version === 1) {
    access[OWNER_ROLE_ID] = [...new Set([...(access[OWNER_ROLE_ID] ?? []), ...SALES_CRM_PAGES.map((page) => page.key)])];
  }
  access[OWNER_ROLE_ID] = protectOwnerAccess(access[OWNER_ROLE_ID] ?? []);
  const categories: ReportCategory[] = ["estimate", "quotation", "invoice", "gate-pass", "job-card", "payment-receipt"];
  const storedTemplates = Array.isArray(saved.reportTemplates) ? saved.reportTemplates : [];
  const reportTemplates = categories.flatMap((category) => {
    const candidates = storedTemplates.filter((template): template is ReportTemplate => Boolean(template && typeof template === "object" && template.category === category && template.id && template.name && template.html));
    const seeded = base.reportTemplates.filter((template) => template.category === category);
    // A stale seeded default (older design, never edited) is replaced by the current one; edited or custom templates are kept.
    const upgraded = candidates.map((template) => {
      const fresh = seeded.find((item) => item.id === template.id);
      const stale = fresh && (template.seedVersion ?? 0) < DEFAULT_TEMPLATE_VERSION && template.createdAt === template.updatedAt;
      return stale ? { ...fresh, active: template.active, createdAt: template.createdAt } : template;
    });
    // Add newly introduced seeded options without discarding a user's custom
    // templates or their currently selected active template.
    const templates = upgraded.length
      ? [...upgraded, ...seeded.filter((template) => !upgraded.some((candidate) => candidate.id === template.id))]
      : seeded;
    const activeId = templates.find((template) => template.active)?.id ?? templates[0].id;
    return templates.map((template) => ({ ...template, active: template.id === activeId }));
  });
  return {
    version: ADMIN_DEMO_STATE_VERSION,
    roles: saved.roles,
    rolePageAccess: access,
    businessSettings: mergeSettings(saved.businessSettings),
    appTheme: normalizeAppTheme(saved.appTheme),
    logs: saved.logs,
    importBatches: Array.isArray(saved.importBatches) ? saved.importBatches : base.importBatches,
    sessionInventory: Array.isArray(saved.sessionInventory) ? saved.sessionInventory : base.sessionInventory,
    reportTemplates,
    companyAssets: saved.companyAssets && typeof saved.companyAssets === "object" ? { ...base.companyAssets, ...saved.companyAssets } : base.companyAssets,
  };
}
~~~

## src/admin-demo-state.ts normalizedRoleLabel

src/admin-demo-state.ts:587

~~~typescript
function normalizedRoleLabel(label: string): string {
  const normalized = label.trim().replace(/\s+/g, " ");
  if (!normalized) throw new Error("Role name is required.");
  return normalized;
}
~~~

## src/admin-demo-state.ts assertUniqueRoleLabel

src/admin-demo-state.ts:593

~~~typescript
function assertUniqueRoleLabel(state: AdminDemoState, label: string, exceptId?: string): void {
  if (state.roles.some((role) => role.id !== exceptId && role.label.toLowerCase() === label.toLowerCase())) {
    throw new Error("A role with this name already exists.");
  }
}
~~~

## src/admin-demo-state.ts sanitizePages

src/admin-demo-state.ts:658

~~~typescript
function sanitizePages(pages: readonly unknown[]): AdminPageKey[] {
  return [...new Set(pages.filter((page): page is AdminPageKey => typeof page === "string" && ALL_PAGE_KEYS.has(page as AdminPageKey)))];
}
~~~

## src/admin-demo-state.ts protectOwnerAccess

src/admin-demo-state.ts:662

~~~typescript
function protectOwnerAccess(pages: readonly AdminPageKey[]): AdminPageKey[] {
  const clean = sanitizePages(pages);
  return clean.includes(PROTECTED_OWNER_PAGE) ? clean : [...clean, PROTECTED_OWNER_PAGE];
}
~~~

## src/admin-demo-state.ts trim

src/admin-demo-state.ts:689

~~~typescript
trim = (value: string) => value.trim()
~~~

## src/admin-demo-state.ts normalizeTemplateName

src/admin-demo-state.ts:765

~~~typescript
normalizeTemplateName = (name: string) => name.trim().toLocaleLowerCase()
~~~

## src/admin-demo-state.ts assertTemplateInput

src/admin-demo-state.ts:767

~~~typescript
function assertTemplateInput(state: AdminDemoState, category: ReportCategory, name: string, html: string, exceptId?: string) {
  if (!name.trim()) throw new Error("Template name is required.");
  if (!html.trim()) throw new Error("Template HTML is required.");
  const unsupported = findUnsupportedPlaceholders(html, category);
  if (unsupported.length) throw new Error(`Unsupported placeholders: ${unsupported.join(", ")}`);
  if (state.reportTemplates.some((template) => template.category === category && template.id !== exceptId && normalizeTemplateName(template.name) === normalizeTemplateName(name))) {
    throw new Error("Template names must be unique within a category.");
  }
}
~~~

## src/admin-demo-state.ts nextTemplateId

src/admin-demo-state.ts:777

~~~typescript
function nextTemplateId(state: AdminDemoState, category: ReportCategory) {
  const prefix = `template-${category}-`;
  const next = state.reportTemplates.reduce((highest, template) => {
    const match = template.id.startsWith(prefix) ? /([0-9]+)$/.exec(template.id) : null;
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0) + 1;
  return `${prefix}${next}`;
}
~~~

## src/admin-demo-state.ts nextLogId

src/admin-demo-state.ts:845

~~~typescript
function nextLogId(logs: readonly DemoLogEntry[]): string {
  const next = logs.reduce((max, log) => {
    const match = /^log-(\d+)$/.exec(log.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `log-${next}`;
}
~~~

## src/admin-demo-state.ts nextImportBatchId

src/admin-demo-state.ts:901

~~~typescript
function nextImportBatchId(batches: readonly DemoImportBatch[]): string {
  const next = batches.reduce((max, batch) => {
    const match = /^import-(\d+)$/.exec(batch.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `import-${next}`;
}
~~~

## src/admin-demo-state.ts nextSessionInventoryId

src/admin-demo-state.ts:909

~~~typescript
function nextSessionInventoryId(items: readonly SessionInventoryItem[]): string {
  const next = items.reduce((max, item) => {
    const match = /^session-inv-(\d+)$/.exec(item.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `session-inv-${next}`;
}
~~~

## src/admin-demo-state.ts retentionMs

src/admin-demo-state.ts:972

~~~typescript
retentionMs = (stream: DemoLogStream) => Math.max(0, stream === "operational" ? operationalDays : featureDays) * 86_400_000
~~~

## src/admin-users-api.ts request

src/admin-users-api.ts:22

~~~typescript
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  const payload = await response.json() as T & { code?: string };
  if (!response.ok) throw new AdminApiError(payload.code ?? "API_FAILED");
  return payload;
}
~~~

## src/advance-booking-range.ts pad

src/advance-booking-range.ts:3

~~~typescript
pad = (value: number) => String(value).padStart(2, "0")
~~~

## src/advance-booking-range.ts parseMonth

src/advance-booking-range.ts:5

~~~typescript
function parseMonth(month: string) {
  const [year, value] = month.split("-").map(Number);
  return { year, month: value };
}
~~~

## src/advance-booking-range.ts daysInMonth

src/advance-booking-range.ts:17

~~~typescript
function daysInMonth(month: string) {
  const { year, month: monthNumber } = parseMonth(month);
  if (monthNumber === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(monthNumber) ? 30 : 31;
}
~~~

## src/App.tsx searchCategoriesFor

src/App.tsx:462

~~~typescript
function searchCategoriesFor(
  actor: Pick<User, "role">,
  permittedPages: readonly AdminPageKey[],
): SearchCategorySelection[] {
  // Service Advisors can always search the records they need to advise on, even
  // when those underlying workspace pages have not been granted.
  const baseCategories =
    actor.role === "service"
      ? (["job", "customer", "vehicle", "invoice"] as SearchTableCategory[])
      : (Object.keys(CATEGORY_PAGE_KEYS) as SearchTableCategory[]).filter(
          (item) =>
            item !== "payment" &&
            CATEGORY_PAGE_KEYS[item].some((key) => permittedPages.includes(key)),
        );

  // Customer and Vehicle remain Admin-granted pages even though they are
  // intentionally absent from the Admin rail; Search is their Admin entry point.
  return actor.role === "admin"
    ? [
        ...Array.from(
          new Set([
            ...baseCategories.filter((item) => item !== "stock"),
            "customer" as const,
            "vehicle" as const,
            "payment" as const,
          ]),
        ),
        ...ADMIN_OPERATIONAL_SEARCH_CATEGORIES,
      ]
    : baseCategories;
}
~~~

## src/App.tsx paymentRowHighlight

src/App.tsx:521

~~~typescript
function paymentRowHighlight(mode: PaymentMode) {
  const classes: Record<PaymentMode, string> = {
    Cash: "billing-row-payment-cash",
    UPI: "billing-row-payment-upi",
    Card: "billing-row-payment-card",
    "Bank transfer": "billing-row-payment-bank-transfer",
    Other: "billing-row-payment-other",
  };
  return classes[mode];
}
~~~

## src/App.tsx findMenuLabelForPage

src/App.tsx:532

~~~typescript
function findMenuLabelForPage(
  role: Role,
  key: AdminPageKey,
  permittedPages: readonly AdminPageKey[],
): string | undefined {
  return menuItemsForRole(role, permittedPages).find((item) => item.key === key)
    ?.label;
}
~~~

## src/App.tsx workshopRole

src/App.tsx:541

~~~typescript
function workshopRole(names: string[]): Role {
  const value = names.join(" ").toLowerCase();
  if (value.includes("admin") || value.includes("owner")) return "admin";
  if (value.includes("reception")) return "reception";
  if (value.includes("technician")) return "tech";
  if (value.includes("store")) return "store";
  if (value.includes("accounts") || value.includes("cashier"))
    return "accounts";
  return "service";
}
~~~

## src/App.tsx apiErrorMessage

src/App.tsx:566

~~~typescript
function apiErrorMessage(error: unknown) {
  const code =
    error instanceof AdminApiError
      ? error.code
      : error instanceof Error
        ? error.message
        : "API_FAILED";
  return (
    apiErrors[code] ?? "WorkshopOS could not complete the request. Try again."
  );
}
~~~

## src/App.tsx moveRailToggle

src/App.tsx:721

~~~typescript
moveRailToggle = (clientY: number) => {
      if (Math.abs(clientY - railToggleStartY.current) > 4)
        railToggleMoved.current = true;
      const nextTop = Math.min(
        Math.max(clientY - 22, 82),
        window.innerHeight - 92,
      );
      setRailToggleTop(nextTop);
    }
~~~

## src/App.tsx handlePointerMove

src/App.tsx:730

~~~typescript
handlePointerMove = (event: PointerEvent) => {
      if (!railToggleDragging.current) return;
      moveRailToggle(event.clientY);
    }
~~~

## src/App.tsx handlePointerUp

src/App.tsx:734

~~~typescript
handlePointerUp = () => {
      if (!railToggleDragging.current) return;
      railToggleDragging.current = false;
      if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
    }
~~~

## src/App.tsx handleMouseMove

src/App.tsx:739

~~~typescript
handleMouseMove = (event: MouseEvent) => {
      if (!railToggleDragging.current) return;
      moveRailToggle(event.clientY);
    }
~~~

## src/App.tsx handleMouseUp

src/App.tsx:743

~~~typescript
handleMouseUp = () => {
      if (!railToggleDragging.current) return;
      railToggleDragging.current = false;
      if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
    }
~~~

## src/App.tsx mutate

src/App.tsx:840

~~~typescript
mutate: Mutate = (action, onError) => {
    if (!db) return false;
    try {
      action(db);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action failed";
      if (onError) onError(message);
      else window.alert(message);
      return false;
    }
    persist(db);
    const next = readState(db);
    if (action === loadLargeDemoDataset) clearDocumentSnapshots();
    syncDocumentSnapshots(
      action === loadLargeDemoDataset ? undefined : state?.jobs,
      next.jobs,
      loadAdminDemoState(),
    );
    setState(next);
    if (!selectedJobId && next.jobs[0]) setSelectedJobId(next.jobs[0].job.id);
    if (action !== loadLargeDemoDataset) {
      const previousJobs = state?.jobs ?? [];
      const previousById = new Map(
        previousJobs.map((view) => [view.job.id, view]),
      );
      const created = next.jobs.filter(
        (view) => !previousById.has(view.job.id),
      );
      const closed = next.jobs.filter(
        (view) =>
          view.job.main_status === "CLOSED" &&
          previousById.get(view.job.id)?.job.main_status !== "CLOSED",
      );
      const event =
        created.length === 1
          ? { type: "created" as const, view: created[0] }
          : closed.length === 1
            ? { type: "closed" as const, view: closed[0] }
            : undefined;
      if (event) {
        const payload = renderJobCardNotification(
          event.type,
          event.view,
          loadAdminDemoState().businessSettings,
        );
        deliverJobCardNotificationStub(payload, (deliveryMessage) =>
          setJobCardNotification({ payload, deliveryMessage }),
        );
      }
    }
    return true;
  }
~~~

## src/App.tsx handleLogin

src/App.tsx:893

~~~typescript
handleLogin = (email: string, password: string) => {
    if (!state) return;
    if (
      authConfig?.mode === "local" &&
      email.trim().toLowerCase() === DEVELOPER_EMAIL &&
      password === DEVELOPER_PASSWORD
    ) {
      setDeveloperMode(true);
      setDeveloperEmulation(undefined);
      setLoginError("");
      return;
    }
    const found = login(state, email, password);
    if (!found) {
      setLoginError("Use one of the demo emails with password admin123.");
      return;
    }
    setUser(found);
    const items = menuItemsForRole(
      found.role,
      resolvePermittedPages(loadAdminDemoState(), found.role),
    );
    setActiveMenuItem(items[0]?.label ?? "");
    setLoginError("");
  }
~~~

## src/App.tsx handleLogout

src/App.tsx:919

~~~typescript
handleLogout = () => {
    if (authConfig?.mode === "cognito") {
      endCognitoSession(authConfig);
      return;
    }
    setUser(undefined);
    setDeveloperMode(false);
    setDeveloperEmulation(undefined);
    setActiveMenuItem("");
    setQuery("");
    setSearchCategory("");
    setSearchStatus("ALL");
    setSearchDateFilter("");
    setSearchMonthFilter("");
    setSearchPaymentMode("ALL");
  }
~~~

## src/App.tsx handleRailTogglePointerDown

src/App.tsx:936

~~~typescript
handleRailTogglePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
~~~

## src/App.tsx handleRailTogglePointerMove

src/App.tsx:945

~~~typescript
handleRailTogglePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!railToggleDragging.current) return;
    if (Math.abs(event.clientY - railToggleStartY.current) > 4)
      railToggleMoved.current = true;
    const nextTop = Math.min(
      Math.max(event.clientY - 22, 82),
      window.innerHeight - 92,
    );
    setRailToggleTop(nextTop);
  }
~~~

## src/App.tsx handleRailTogglePointerUp

src/App.tsx:958

~~~typescript
handleRailTogglePointerUp = () => {
    if (!railToggleDragging.current) return;
    railToggleDragging.current = false;
    if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
  }
~~~

## src/App.tsx handleRailToggleMouseDown

src/App.tsx:964

~~~typescript
handleRailToggleMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
  }
~~~

## src/App.tsx returnToDeveloper

src/App.tsx:974

~~~typescript
returnToDeveloper = () => {
    setUser(undefined);
    setDeveloperEmulation(undefined);
    setDeveloperMode(true);
    setActiveMenuItem("");
  }
~~~

## src/App.tsx leaveSearch

src/App.tsx:1025

~~~typescript
leaveSearch = () => {
    setQuery("");
    setSearchCategory("");
    setSearchStatus("ALL");
    setSearchDateFilter("");
    setSearchMonthFilter("");
    setSearchPaymentMode("ALL");
  }
~~~

## src/App.tsx openStockSearchRecord

src/App.tsx:1033

~~~typescript
openStockSearchRecord = (item: InventoryItem) => {
    if (user.role === "admin") {
      setQuery("");
      setSearchCategory("stock");
      setSearchStatus("ALL");
      setSearchDateFilter("");
      setSearchMonthFilter("");
      setSearchPaymentMode("ALL");
      setActiveMenuItem("Search");
      return;
    }
    const label = findMenuLabelForPage(user.role, "stock", permittedPages);
    if (label) {
      setStockSearchNavigate(item.sku);
      leaveSearch();
      setActiveMenuItem(label);
    }
  }
~~~

## src/App.tsx openSearchRecord

src/App.tsx:1051

~~~typescript
openSearchRecord = (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock">,
  ) => {
    if (category === "customer") {
      const label = findMenuLabelForPage(
        user.role,
        "customers",
        permittedPages,
      );
      if (label) {
        setSearchNavigate({ kind: "customers", id: view.customer.id });
        setActiveMenuItem(label);
      }
      return;
    }
    if (category === "vehicle") {
      const label = findMenuLabelForPage(user.role, "vehicles", permittedPages);
      if (label) {
        setSearchNavigate({ kind: "vehicles", id: view.vehicle.id });
        setActiveMenuItem(label);
      }
      return;
    }
    if (category === "job") {
      const label =
        findMenuLabelForPage(user.role, "jobs", permittedPages) ??
        findMenuLabelForPage(user.role, "my-queue", permittedPages);
      if (label) {
        setSearchNavigate({ kind: "jobs", id: view.job.id });
        setActiveMenuItem(label);
      }
      return;
    }
    // invoice: prefer the role's own dedicated Invoice workflow page (Accounts) when granted;
    // otherwise fall back to the Jobs/My Queue record workspace, which also surfaces invoice status.
    const invoiceLabel = permittedPages.includes("invoice")
      ? findMenuLabelForPage(user.role, "invoice", permittedPages)
      : undefined;
    if (invoiceLabel) {
      setSelectedJobId(view.job.id);
      leaveSearch();
      setActiveMenuItem(invoiceLabel);
      return;
    }
    const jobsLabel =
      findMenuLabelForPage(user.role, "jobs", permittedPages) ??
      findMenuLabelForPage(user.role, "my-queue", permittedPages);
    if (jobsLabel) {
      setSearchNavigate({ kind: "jobs", id: view.job.id });
      leaveSearch();
      setActiveMenuItem(jobsLabel);
    }
  }
~~~

## src/App.tsx openDashboardDrilldown

src/App.tsx:1105

~~~typescript
openDashboardDrilldown = (drilldown: DashboardDrilldown) => {
    setDashboardDrilldown(drilldown);
    if (drilldown.destination === "Search") {
      setQuery("");
      setSearchCategory(drilldown.category ?? "");
      setSearchStatus("ALL");
      setSearchDateFilter(drilldown.date ?? "");
      setSearchMonthFilter(
        drilldown.category === "job"
          ? drilldown.month ?? localCalendarDate().slice(0, 7)
          : drilldown.month ?? "",
      );
      setSearchPaymentMode("ALL");
      setSearchLowStockOnly(drilldown.category === "stock");
    }
    setActiveMenuItem(drilldown.destination);
  }
~~~

## src/App.tsx changeFilters

src/App.tsx:1870

~~~typescript
changeFilters = (change: () => void) => {
    change();
    setPage(1);
  }
~~~

## src/App.tsx clearFilters

src/App.tsx:1874

~~~typescript
clearFilters = () => {
    setQuery("");
    setCategory(category === "stock" ? "stock" : "");
    setStatus("ALL");
    setDateFilter("");
    setMonthFilter("");
    setPaymentMode("ALL");
    setLowStockOnly(false);
    setActiveLowStockOnly(false);
    setJobWorkflow("ALL"); setJobAdvisor("ALL"); setJobSort("newest"); setJobArchivedOnly(false);
    setPage(1);
  }
~~~

## src/App.tsx clearJobCardFilters

src/App.tsx:1886

~~~typescript
clearJobCardFilters = () => {
    setQuery("");
    setStatus("ALL");
    setDateFilter("");
    setMonthFilter("");
    setJobWorkflow("ALL");
    setJobAdvisor("ALL");
    setJobSort("newest");
    setJobArchivedOnly(false);
    setPage(1);
  }
~~~

## src/App.tsx reset

src/App.tsx:2922

~~~typescript
reset = () => {
    setSearch("");
    setStatus("ALL");
  }
~~~

## src/App.tsx receptionAgeLabel

src/App.tsx:3044

~~~typescript
function receptionAgeLabel(receivedDate: string, today: string) {
  const age = Math.max(
    1,
    Math.round(
      (Date.parse(`${today}T00:00:00Z`) -
        Date.parse(`${receivedDate}T00:00:00Z`)) /
        86_400_000,
    ),
  );
  return `${age} day${age === 1 ? "" : "s"} old`;
}
~~~

## src/App.tsx clearCustomer

src/App.tsx:3098

~~~typescript
clearCustomer = () =>
    setForm((current) => ({
      ...current,
      customerId: 0,
      vehicleId: 0,
      customerName: "",
      mobile: "",
      customerType: "Individual",
      vehicleNo: "",
      make: "",
      model: "",
      color: "",
      odoReading: "",
    }))
~~~

## src/App.tsx clearVehicle

src/App.tsx:3112

~~~typescript
clearVehicle = () =>
    setForm((current) => ({
      ...current,
      vehicleId: 0,
      vehicleNo: "",
      make: "",
      model: "",
      color: "",
      odoReading: "",
    }))
~~~

## src/App.tsx selectCustomer

src/App.tsx:3122

~~~typescript
selectCustomer = (id: number) => {
    if (!id) {
      clearCustomer();
      return;
    }
    const customer = state.customers.find((item) => item.id === id);
    const vehicle = state.vehicles.find((item) => item.customer_id === id);
    if (!customer) return;
    setForm((current) => ({
      ...current,
      customerId: id,
      vehicleId: vehicle?.id ?? 0,
      customerName: customer.name,
      mobile: customer.mobile,
      customerType: customer.type,
      vehicleNo: vehicle?.number ?? current.vehicleNo,
      make: vehicle?.make ?? current.make,
      model: vehicle?.model ?? current.model,
      color: vehicle?.color ?? current.color,
      odoReading: String(vehicle?.km ?? current.odoReading),
    }));
  }
~~~

## src/App.tsx selectVehicle

src/App.tsx:3144

~~~typescript
selectVehicle = (id: number) => {
    if (!id) {
      clearVehicle();
      return;
    }
    const vehicle = state.vehicles.find((item) => item.id === id);
    const customer = state.customers.find(
      (item) => item.id === vehicle?.customer_id,
    );
    if (!vehicle) return;
    setForm((current) => ({
      ...current,
      vehicleId: id,
      customerId: customer?.id ?? current.customerId,
      customerName: customer?.name ?? current.customerName,
      mobile: customer?.mobile ?? current.mobile,
      customerType: customer?.type ?? current.customerType,
      vehicleNo: vehicle.number,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      odoReading: String(vehicle.km),
    }));
  }
~~~

## src/App.tsx submit

src/App.tsx:3168

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      ![
        form.customerName,
        form.mobile,
        form.vehicleNo,
        form.make,
        form.model,
        form.odoReading,
        form.fuelLevelValue,
        form.requestedWork,
      ].every((value) => value.trim())
    ) {
      setTab("details");
      setError(
        "Complete all required visit details before creating the visit.",
      );
      return;
    }
    const odoReading = Number(form.odoReading);
    if (!Number.isFinite(odoReading) || odoReading < 0) {
      setTab("details");
      setError("Enter the ODO meter reading in km.");
      return;
    }
    const fuel =
      form.fuelLevelUnit === "Other"
        ? form.fuelLevelValue
        : `${form.fuelLevelValue} ${form.fuelLevelUnit}`;
    let jobId = 0;
    let jobNo = "";
    if (
      mutate((db) => {
        jobId = receiveVehicle(db, {
          customerId: form.customerId || undefined,
          vehicleId: form.vehicleId || undefined,
          customerName: form.customerName,
          mobile: form.mobile,
          customerType: form.customerType,
          vehicleNo: form.vehicleNo,
          make: form.make,
          model: form.model,
          color: form.color,
          km: odoReading,
          odoReading,
          fuel,
          fuelLevelValue: form.fuelLevelValue,
          fuelLevelUnit: form.fuelLevelUnit,
          keys: form.keys,
          accessories: form.accessories,
          requestedWork: form.requestedWork,
          advisorId: form.advisorId || undefined,
          receptionId: actor.id,
          damageMarks: serializeDamageMarks(marks),
        });
        jobNo = String(
          db.exec("select job_no from job_cards where id=?", [jobId])[0]
            ?.values[0]?.[0] ?? "",
        );
      }, setError)
    )
      onCreated(jobId, jobNo);
  }
~~~

## src/App.tsx tabId

src/App.tsx:3267

~~~typescript
tabId = (name: "details" | "body-mark") => `create-visit-${name}-tab`
~~~

## src/App.tsx panelId

src/App.tsx:3268

~~~typescript
panelId = (name: "details" | "body-mark") =>
    `create-visit-${name}-panel`
~~~

## src/App.tsx clear

src/App.tsx:3738

~~~typescript
clear = () => {
    setSearch("");
    setDate("");
    setMonth("");
    setMainStatus("ALL"); setWorkflow("ALL"); setCustomer(""); setAdvisor("ALL"); setSort("newest");
    setPage(1);
  }
~~~

## src/App.tsx open

src/App.tsx:3745

~~~typescript
open = (
    row: JobView,
    next: "job" | "edit" | "estimate" | "followup",
  ) => {
    setSelected(row);
    setDialog(next);
  }
~~~

## src/App.tsx followupTone

src/App.tsx:3768

~~~typescript
followupTone = (status: string) =>
    status.startsWith("Done(") ? "done" : "pending"
~~~

## src/App.tsx monthYearLabel

src/App.tsx:3770

~~~typescript
monthYearLabel = (value: string) => {
    const dateValue = new Date(`${value}-01T00:00:00`);
    return Number.isNaN(dateValue.valueOf())
      ? value
      : dateValue.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });
  }
~~~

## src/App.tsx resetComposer

src/App.tsx:4187

~~~typescript
resetComposer = () => {
    setNote("");
    setOutcome("");
    setDone(false);
    setEditingId(undefined);
  }
~~~

## src/App.tsx editOpen

src/App.tsx:4193

~~~typescript
editOpen = (item: Followup) => {
    setEditingId(item.id);
    setNote(item.note);
    setOutcome(item.outcome ?? "");
    setDone(false);
  }
~~~

## src/App.tsx save

src/App.tsx:4199

~~~typescript
save = (event: FormEvent, keepOpen = false) => {
    event.preventDefault();
    if (!note.trim()) return;
    const timestamp = new Date().toISOString();
    const current = history.find((item) => item.id === editingId);
    let createdId = -Date.now();
    const saved =
      editingId && current
        ? {
            ...current,
            note: note.trim(),
            outcome: outcome.trim(),
            done: done ? 1 : 0,
            updated_at: timestamp,
          }
        : {
            id: createdId,
            job_card_id: view.job.id,
            note: note.trim(),
            due_at: localCalendarDate(),
            done: done ? 1 : 0,
            outcome: outcome.trim(),
            created_at: timestamp,
            updated_at: timestamp,
          };
    if (
      mutate((db) =>
        editingId && current
          ? updateFollowup(db, editingId, {
              ...current,
              note: note.trim(),
              done: done ? 1 : 0,
              outcome: outcome.trim(),
            })
          : (createdId = (done ? createResolvedFollowup : createFollowup)(db, {
              job_card_id: view.job.id,
              note: note.trim(),
              due_at: localCalendarDate(),
              done: done ? 1 : 0,
              outcome: outcome.trim(),
            })),
      )
    ) {
      if (!editingId) saved.id = createdId;
      setHistory((items) => [
        saved,
        ...items
          .filter((item) => item.id !== saved.id)
          .map((item) =>
            done && !editingId && !item.done
              ? { ...item, done: 1, updated_at: timestamp }
              : item,
          ),
      ]);
      if (keepOpen) resetComposer();
      else onClose();
    }
  }
~~~

## src/App.tsx materialName

src/App.tsx:4257

~~~typescript
materialName = (itemId: number) =>
    view.inventory.find((item) => item.id === itemId)?.name ??
    `Item #${itemId}`
~~~

## src/App.tsx openJob

src/App.tsx:4669

~~~typescript
openJob = (id: number) => {
    setSelectedJobId(id);
    setViewJobId(id);
  }
~~~

## src/App.tsx save

src/App.tsx:4957

~~~typescript
save = (event: FormEvent) => {
    event.preventDefault();
    if (!requestId) {
      setError("Choose a pending request.");
      return;
    }
    setError("");
    if (
      mutate(
        () => {
          throw new Error("Direct purchase, stock and issue is unavailable. Create a Purchase Request instead.");
        },
        setError,
      )
    ) {
      setVendor("");
      setBillReference("");
      setNote("");
      setItemId(0);
    }
  }
~~~

## src/App.tsx supplierName

src/App.tsx:5148

~~~typescript
supplierName = (id: number) =>
    supplierNameForPurchaseOrder(state.suppliers, id)
~~~

## src/App.tsx deliveredFor

src/App.tsx:5170

~~~typescript
deliveredFor = (line: PurchaseOrderLine) => {
    const receiptIds = new Set(state.purchase_order_receipts.map((receipt) => receipt.id));
    return state.purchase_order_receipt_lines
      .filter((receiptLine) => receiptIds.has(receiptLine.purchase_order_receipt_id) && receiptLine.purchase_order_line_id === line.id)
      .reduce((sum, receiptLine) => sum + receiptLine.delivered_qty, 0);
  }
~~~

## src/App.tsx confirmationFor

src/App.tsx:5176

~~~typescript
confirmationFor = (line: PurchaseOrderLine) =>
    state.purchase_order_confirmations.find((confirmation) => confirmation.purchase_order_line_id === line.id)
~~~

## src/App.tsx downloadClosedAudit

src/App.tsx:5178

~~~typescript
downloadClosedAudit = (order: PurchaseOrder, orderLines: PurchaseOrderLine[]) => {
    const confirmationByLine = new Map(
      state.purchase_order_confirmations
        .filter((confirmation) => confirmation.purchase_order_id === order.id)
        .map((confirmation) => [confirmation.purchase_order_line_id, confirmation]),
    );
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ["Purchase Order", order.po_number],
      ["Status", "PO Closed"],
      ["Order date", order.order_date],
      ["Supplier", supplierName(order.supplier_id)],
      [],
      ["SKU", "Item", "Ordered", "Accepted", "Returned", "Damaged", "Wasted", "Pre-GST unit cost"],
      ...orderLines.map((line) => {
        const item = state.inventory.find((candidate) => candidate.id === line.item_id);
        const confirmation = confirmationByLine.get(line.id);
        return [item?.sku ?? "", item?.name ?? line.item_name, line.ordered_qty, confirmation?.accepted_qty ?? 0, confirmation?.returned_qty ?? 0, confirmation?.damaged_qty ?? 0, confirmation?.wasted_qty ?? 0, line.unit_cost];
      }),
    ];
    const blob = new Blob([rows.map((row) => row.map(quote).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${order.po_number}-closed-audit.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
~~~

## src/App.tsx quote

src/App.tsx:5184

~~~typescript
quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
~~~

## src/App.tsx close

src/App.tsx:5206

~~~typescript
close = () => {
    setDialog(undefined);
    setSelectedId(undefined);
  }
~~~

## src/App.tsx openNew

src/App.tsx:5210

~~~typescript
openNew = () => {
    setSelectedId(undefined);
    setOrderDate(new Date().toISOString().slice(0, 10));
    setNotes("");
    setLines(
      state.inventory[0]
        ? [
            {
              key: crypto.randomUUID(),
              item_id: state.inventory[0].id,
              new_item: false,
              ordered_qty: 1,
            },
          ]
        : [],
    );
    setDialog("form");
  }
~~~

## src/App.tsx openEdit

src/App.tsx:5228

~~~typescript
openEdit = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setOrderDate(order.order_date);
    setNotes(order.notes);
    setLines(
      state.purchase_order_lines
        .filter((line) => line.purchase_order_id === order.id)
        .map((line) => ({
          key: String(line.id),
          item_id: line.item_id || undefined,
          item_name: line.item_name,
          unit: line.unit,
          new_item: line.item_id === 0,
          ordered_qty: line.ordered_qty,
        })),
    );
    setDialog("form");
  }
~~~

## src/App.tsx openView

src/App.tsx:5246

~~~typescript
openView = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setDialog("view");
  }
~~~

## src/App.tsx beginReceipt

src/App.tsx:5250

~~~typescript
beginReceipt = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setReceiptLines(state.purchase_order_lines.filter((line) => line.purchase_order_id === order.id).map((line) => ({ purchase_order_line_id: line.id, delivered_qty: 0 })));
    setDialog("receipt");
  }
~~~

## src/App.tsx beginConfirmation

src/App.tsx:5255

~~~typescript
beginConfirmation = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setConfirmationLines(state.purchase_order_lines.filter((line) => line.purchase_order_id === order.id).map((line) => ({ purchase_order_line_id: line.id, accepted_qty: deliveredFor(line), returned_qty: 0, damaged_qty: 0, wasted_qty: 0 })));
    setDialog("confirm");
  }
~~~

## src/App.tsx beginApproval

src/App.tsx:5260

~~~typescript
beginApproval = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setApprovalLines(
      state.purchase_order_lines
        .filter((line) => line.purchase_order_id === order.id)
        .map((line) => ({
          purchase_order_line_id: line.id,
          supplier_id: state.suppliers.find((supplier) => supplier.status === "Active")?.id ?? 0,
          unit_cost: 0,
          sku: "",
          category: "",
          name: line.item_name,
          unit: line.unit,
          low_stock_qty: 0,
          selling_price: 0,
        })),
    );
    setDialog("approve");
  }
~~~

## src/App.tsx approveRequest

src/App.tsx:5279

~~~typescript
approveRequest = () => {
    if (!selected) return;
    const input: PurchaseRequestApprovalInput = {
      lines: approvalLines.map((line) => ({
        purchase_order_line_id: line.purchase_order_line_id,
        supplier_id: line.supplier_id,
        unit_cost: line.unit_cost,
        inventory_item: selectedLines.find((candidate) => candidate.id === line.purchase_order_line_id)?.item_id
          ? undefined
          : { sku: line.sku, category: line.category, name: line.name, unit: line.unit, low_stock_qty: line.low_stock_qty, selling_price: line.selling_price },
      })),
    };
    if (mutate((db) => approvePurchaseRequestForActor(db, selected.id, actor.id, input))) setDialog("view");
  }
~~~

## src/App.tsx save

src/App.tsx:5303

~~~typescript
save = () => {
    const input: PurchaseRequestInput = {
      order_date: orderDate,
      notes,
      lines: lines.map((line) =>
        line.new_item
          ? {
              item_name: line.item_name?.trim() ?? "",
              unit: line.unit?.trim() ?? "",
              ordered_qty: line.ordered_qty,
            }
          : { item_id: line.item_id ?? 0, ordered_qty: line.ordered_qty },
      ),
    };
    let id = selectedId;
    if (
      mutate((db) => {
        if (id) updatePurchaseRequestForActor(db, id, actor.id, input);
        else id = createPurchaseRequestForActor(db, actor.id, input);
      })
    ) {
      setSelectedId(id);
      setDialog("view");
    }
  }
~~~

## src/App.tsx update

src/App.tsx:5921

~~~typescript
update = (patch: Partial<typeof formLine>) => setConfirmationLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, ...patch } : candidate))
~~~

## src/App.tsx update

src/App.tsx:5949

~~~typescript
update = (patch: Partial<PurchaseRequestApprovalFormLine>) => setApprovalLines((current) => current.map((line) => line.purchase_order_line_id === requestLine.id ? { ...line, ...patch } : line))
~~~

## src/App.tsx historyFor

src/App.tsx:6037

~~~typescript
historyFor = (itemId: number) => state.purchase_order_lines.filter((line) => line.item_id === itemId).map((line) => ({ line, order: state.purchase_orders.find((candidate) => candidate.id === line.purchase_order_id) })).filter((entry): entry is { line: PurchaseOrderLine; order: PurchaseOrder } => entry.order?.status === "Closed").sort((left, right) => right.order.order_date.localeCompare(left.order.order_date) || right.order.id - left.order.id || right.line.id - left.line.id).slice(0, 3)
~~~

## src/App.tsx quotesFor

src/App.tsx:6038

~~~typescript
quotesFor = (lineId: number) => state.purchase_order_quotations.filter((quote) => quote.purchase_order_line_id === lineId).sort((left, right) => right.quote_date.localeCompare(left.quote_date) || right.id - left.id)
~~~

## src/App.tsx beginQuotation

src/App.tsx:6039

~~~typescript
beginQuotation = (line: PurchaseOrderLine) => {
    setQuotationLineId(line.id); setSupplierName(""); setQuoteDate(new Date().toISOString().slice(0, 10)); setQuotedQty(line.ordered_qty); setUnitCost(0); setNotes("");
  }
~~~

## src/App.tsx reset

src/App.tsx:6137

~~~typescript
reset = () => {
    setSelectedId(undefined);
    setComposerOpen(true);
    setSupplierId(0);
    setInvoiceNo("");
    setInvoiceDate(new Date().toISOString().slice(0, 10));
    setPoNumber("");
    setLines(
      state.inventory[0]
        ? [
            {
              key: crypto.randomUUID(),
              item_id: state.inventory[0].id,
              received_qty: 1,
              unit_cost: 0,
              discount: 0,
              gst_rate: 0,
            },
          ]
        : [],
    );
    setAttachments([]);
    setRevisionReason("");
  }
~~~

## src/App.tsx draftInput

src/App.tsx:6161

~~~typescript
draftInput = () => ({
    supplier_id: supplierId || undefined,
    supplier_invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    po_number: poNumber,
    lines: lines.map(({ key: _key, ...line }) => line),
    attachments,
  })
~~~

## src/App.tsx saveDraft

src/App.tsx:6169

~~~typescript
saveDraft = () => {
    let newId = selectedId;
    if (
      mutate((db) => {
        if (selectedId)
          updateInwardPurchaseDraftForActor(
            db,
            selectedId,
            actor.id,
            draftInput(),
          );
        else newId = createInwardPurchaseDraft(db, actor.id, draftInput());
      })
    )
      setSelectedId(newId);
  }
~~~

## src/App.tsx addLine

src/App.tsx:6185

~~~typescript
addLine = () => {
    if (state.inventory[0])
      setLines((current) => [
        ...current,
        {
          key: crypto.randomUUID(),
          item_id: state.inventory[0].id,
          received_qty: 1,
          unit_cost: 0,
          discount: 0,
          gst_rate: 0,
        },
      ]);
  }
~~~

## src/App.tsx updateLine

src/App.tsx:6199

~~~typescript
updateLine = (key: string, patch: Partial<InwardPurchaseLineInput>) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    )
~~~

## src/App.tsx selectFile

src/App.tsx:6203

~~~typescript
selectFile = async (file?: File) => {
    if (!file) return;
    if (
      !(file.type === "application/pdf" || file.type === "image/jpeg") ||
      file.size > 10 * 1024 * 1024
    ) {
      window.alert("Use a PDF or JPG invoice scan no larger than 10 MB.");
      return;
    }
    const document_url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setAttachments((current) => [
      ...current,
      {
        original_name: file.name,
        mime_type: file.type,
        byte_size: file.size,
        document_url,
      },
    ]);
  }
~~~

## src/App.tsx supplierName

src/App.tsx:6228

~~~typescript
supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier"
~~~

## src/App.tsx projectedQuantity

src/App.tsx:6244

~~~typescript
projectedQuantity = (itemId: number) =>
    (state.inventory.find((item) => item.id === itemId)?.stock_qty ?? 0) +
    lines
      .filter((line) => line.item_id === itemId)
      .reduce(
        (sum, line) =>
          sum + (Number.isFinite(line.received_qty) ? line.received_qty : 0),
        0,
      )
~~~

## src/App.tsx lineTotal

src/App.tsx:6277

~~~typescript
lineTotal = (line: PurchaseFormLine) => {
    const base = line.received_qty * line.unit_cost - (line.discount ?? 0);
    return base * (1 + (line.gst_rate ?? 0) / 100);
  }
~~~

## src/App.tsx supplierName

src/App.tsx:6803

~~~typescript
supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier"
~~~

## src/App.tsx freshLine

src/App.tsx:6806

~~~typescript
freshLine = (): PurchaseFormLine | undefined =>
    state.inventory[0] && {
      key: crypto.randomUUID(),
      item_id: state.inventory[0].id,
      received_qty: 1,
      unit_cost: 0,
      discount: 0,
      gst_rate: 0,
    }
~~~

## src/App.tsx open

src/App.tsx:6815

~~~typescript
open = (next: NonNullable<typeof dialog>, id?: number) => {
    setRecordId(id);
    setDialog(next);
    setError("");
    setAttachments([]);
    setRevisionReason("");
  }
~~~

## src/App.tsx close

src/App.tsx:6822

~~~typescript
close = () => {
    setDialog(undefined);
    setRecordId(undefined);
  }
~~~

## src/App.tsx updateLine

src/App.tsx:6859

~~~typescript
updateLine = (key: string, patch: Partial<InwardPurchaseLineInput>) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    )
~~~

## src/App.tsx draftInput

src/App.tsx:6863

~~~typescript
draftInput = () => ({
    supplier_id: supplierId || undefined,
    supplier_invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    po_number: poNumber,
    lines: lines.map(({ key: _key, ...line }) => line),
    attachments,
  })
~~~

## src/App.tsx lineTotal

src/App.tsx:6871

~~~typescript
lineTotal = (line: PurchaseFormLine) =>
    (line.received_qty * line.unit_cost - (line.discount ?? 0)) *
    (1 + (line.gst_rate ?? 0) / 100)
~~~

## src/App.tsx selectFile

src/App.tsx:6901

~~~typescript
selectFile = async (file?: File) => {
    if (!file) return;
    if (
      !(file.type === "application/pdf" || file.type === "image/jpeg") ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Use a PDF or JPG invoice scan no larger than 10 MB.");
      return;
    }
    const document_url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setAttachments((current) => [
      ...current,
      {
        original_name: file.name,
        mime_type: file.type,
        byte_size: file.size,
        document_url,
      },
    ]);
  }
~~~

## src/App.tsx saveDraft

src/App.tsx:6926

~~~typescript
saveDraft = () => {
    let newId = recordId;
    if (
      mutate((db) => {
        if (recordId)
          updateInwardPurchaseDraftForActor(
            db,
            recordId,
            actor.id,
            draftInput(),
          );
        else newId = createInwardPurchaseDraft(db, actor.id, draftInput());
      }, setError)
    ) {
      setRecordId(newId);
      setDialog("edit");
    }
  }
~~~

## src/App.tsx sendForApproval

src/App.tsx:6944

~~~typescript
sendForApproval = () => {
    if (!recordId) {
      setError("Save the purchase draft before sending it for PO approval.");
      return;
    }
    if (
      mutate(
        (db) => sendInwardPurchaseForPoApprovalForActor(db, recordId, actor.id),
        setError,
      )
    )
      close();
  }
~~~

## src/App.tsx receive

src/App.tsx:6957

~~~typescript
receive = () => {
    if (
      recordId &&
      mutate(
        (db) =>
          receiveAndPostInwardPurchaseForActor(
            db,
            recordId,
            actor.id,
            draftInput(),
          ),
        setError,
      )
    )
      close();
  }
~~~

## src/App.tsx approve

src/App.tsx:6973

~~~typescript
approve = () => {
    if (
      recordId &&
      mutate(
        (db) => approveInwardPurchaseForActor(db, recordId, actor.id),
        setError,
      )
    )
      close();
  }
~~~

## src/App.tsx revise

src/App.tsx:6983

~~~typescript
revise = () => {
    if (
      recordId &&
      mutate(
        (db) =>
          reviseInwardPurchaseForActor(db, recordId, actor.id, {
            reason: revisionReason,
            lines: lines.map(
              ({ key: _key, purchase_order_line_id: _poLine, ...line }) => line,
            ),
          }),
        setError,
      )
    )
      close();
  }
~~~

## src/App.tsx reset

src/App.tsx:7743

~~~typescript
reset = () => {
    setSelectedId(undefined);
    setDraft({
      name: "",
      contact_name: "",
      phone: "",
      email: "",
      gstin: "",
      status: "Active",
    });
  }
~~~

## src/App.tsx closeDialog

src/App.tsx:7754

~~~typescript
closeDialog = () => {
    setDialogOpen(false);
    reset();
  }
~~~

## src/App.tsx openNew

src/App.tsx:7758

~~~typescript
openNew = () => {
    reset();
    setDialogOpen(true);
  }
~~~

## src/App.tsx openEdit

src/App.tsx:7762

~~~typescript
openEdit = (supplier: Supplier) => {
    setSelectedId(supplier.id);
    setDialogOpen(true);
  }
~~~

## src/App.tsx save

src/App.tsx:7766

~~~typescript
save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const saved = selected
      ? mutate((db) => updateSupplierForActor(db, selected.id, actor.id, draft))
      : mutate((db) => {
          createSupplierForActor(db, actor.id, draft);
        });
    if (saved) closeDialog();
  }
~~~

## src/App.tsx clearFilters

src/App.tsx:7966

~~~typescript
clearFilters = () => {
    setSearch("");
    setDate("");
    setMonth("");
    setDirection("ALL");
    setPage(1);
  }
~~~

## src/App.tsx isLocalPurchase

src/App.tsx:8132

~~~typescript
function isLocalPurchase(row: StoreHistoryRow): row is StorePurchaseRow {
  return "purchase" in row;
}
~~~

## src/App.tsx requestState

src/App.tsx:8136

~~~typescript
function requestState(row: StoreRequestRow) {
  const { request } = row;
  const reconciled =
    request.used_qty + request.returned_qty + request.wasted_qty;
  if (
    request.issued_qty > 0 &&
    Math.abs(reconciled - request.issued_qty) < 0.001
  )
    return "Reconciled";
  if (request.issued_qty >= request.requested_qty) return "Issued";
  if (request.issued_qty > 0) return "Partially issued";
  return "Pending";
}
~~~

## src/App.tsx reconciliationState

src/App.tsx:8150

~~~typescript
function reconciliationState(row: StoreRequestRow) {
  const { request } = row;
  return request.issued_qty > 0 &&
    Math.abs(
      request.issued_qty -
        request.used_qty -
        request.returned_qty -
        request.wasted_qty,
    ) < 0.001
    ? "Matched"
    : "Open";
}
~~~

## src/App.tsx storeMaterialStatusClass

src/App.tsx:8163

~~~typescript
function storeMaterialStatusClass(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}
~~~

## src/App.tsx clearFilters

src/App.tsx:8217

~~~typescript
clearFilters = () => {
    setSearch("");
    setPrimary("ALL");
    setJob("ALL");
    setItem("ALL");
    setUnit("ALL");
    if (isMaterialRecordList) {
      setRecordDate("");
      setRecordMonth("");
    }
    setPage(1);
  }
~~~

## src/App.tsx matchesRecordDate

src/App.tsx:8256

~~~typescript
matchesRecordDate = (createdAt?: string) =>
    !isMaterialRecordList ||
    ((!recordDate || createdAt?.slice(0, 10) === recordDate) &&
      (!recordMonth || createdAt?.slice(0, 7) === recordMonth))
~~~

## src/App.tsx decide

src/App.tsx:9150

~~~typescript
decide = (decision: "Approved" | "Rejected") => {
    if (!reviewing) return;
    setError("");
    if (
      mutate(
        (db) =>
          decideMaterialApprovalForActor(
            db,
            reviewing.job.id,
            actor.id,
            decision,
            reason,
          ),
        setError,
      )
    ) {
      setReviewing(undefined);
      setReason("");
    }
  }
~~~

## src/App.tsx vehicleCount

src/App.tsx:10030

~~~typescript
vehicleCount = (customer: Customer) =>
    state.vehicles.filter((vehicle) => vehicle.customer_id === customer.id)
      .length
~~~

## src/App.tsx openJobCount

src/App.tsx:10033

~~~typescript
openJobCount = (customer: Customer) =>
    state.jobs.filter(
      (view) =>
        view.customer.id === customer.id && view.job.main_status !== "CLOSED",
    ).length
~~~

## src/App.tsx ownerName

src/App.tsx:10255

~~~typescript
ownerName = (vehicle: Vehicle) =>
    owners.find((customer) => customer.id === vehicle.customer_id)?.name ?? "—"
~~~

## src/App.tsx clearSearch

src/App.tsx:10803

~~~typescript
clearSearch = () => {
    setSearch("");
    setPage(1);
  }
~~~

## src/App.tsx managerDepartments

src/App.tsx:11265

~~~typescript
managerDepartments = (membershipId: string) => directory.serviceDepartments
    .filter((department) => department.managers.some((manager) => manager.membershipId === membershipId))
    .map((department) => department.name)
~~~

## src/App.tsx clearSearch

src/App.tsx:11268

~~~typescript
clearSearch = () => {
    setSearch("");
    setPage(1);
  }
~~~

## src/App.tsx refresh

src/App.tsx:11273

~~~typescript
refresh = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      setDirectory(await adminUsersApi.list(config));
      setError("");
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      if (!quiet) setLoading(false);
    }
  }
~~~

## src/App.tsx onFocus

src/App.tsx:11288

~~~typescript
onFocus = () => void refresh(true)
~~~

## src/App.tsx run

src/App.tsx:11296

~~~typescript
run = async (action: () => Promise<unknown>, closeEditor = false) => {
    setBusy(true);
    setError("");
    try {
      await action();
      if (closeEditor) setEditing(false);
      await refresh(true);
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
      if (
        nextError instanceof AdminApiError &&
        nextError.code === "VERSION_CONFLICT"
      )
        await refresh(true);
    } finally {
      setBusy(false);
    }
  }
~~~

## src/App.tsx toggle

src/App.tsx:11315

~~~typescript
toggle = (kind: "roleIds" | "branchIds", id: string) => {
    const current = draft[kind];
    setDraft({
      ...draft,
      [kind]: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  }
~~~

## src/App.tsx startNew

src/App.tsx:11325

~~~typescript
startNew = () => {
    setDraft({
      id: "",
      name: "",
      email: "",
      roleIds: directory.roles[0] ? [directory.roles[0].id] : [],
      branchIds: directory.branches[0] ? [directory.branches[0].id] : [],
      version: 0,
    });
    setEditing(true);
    setError("");
  }
~~~

## src/App.tsx useJobDetailsSaveNotice

src/App.tsx:11978

~~~typescript
function useJobDetailsSaveNotice() {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  const onSaveResult = (ok: boolean) => {
    if (timer.current !== null) clearTimeout(timer.current);
    setSaved(ok);
    timer.current = ok
      ? setTimeout(() => {
          setSaved(false);
          timer.current = null;
        }, 3000)
      : null;
  };

  return { saved, onSaveResult };
}
~~~

## src/App.tsx onSaveResult

src/App.tsx:11986

~~~typescript
onSaveResult = (ok: boolean) => {
    if (timer.current !== null) clearTimeout(timer.current);
    setSaved(ok);
    timer.current = ok
      ? setTimeout(() => {
          setSaved(false);
          timer.current = null;
        }, 3000)
      : null;
  }
~~~

## src/App.tsx toggleNotApplicable

src/App.tsx:12314

~~~typescript
toggleNotApplicable = (item: ChecklistItem, notApplicable: boolean) => {
    setError("");
    mutate(
      (db) =>
        setChecklistItemNotApplicableForActor(
          db,
          item.id,
          actor.id,
          notApplicable,
        ),
      setError,
    );
  }
~~~

## src/App.tsx toggle

src/App.tsx:12327

~~~typescript
toggle = (item: ChecklistItem, checked: boolean) => {
    setError("");
    mutate(
      (db) => setChecklistItemCheckedForActor(db, item.id, actor.id, checked),
      setError,
    );
  }
~~~

## src/App.tsx confirm

src/App.tsx:12334

~~~typescript
confirm = (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim()) {
      setError("A confirmation note is required.");
      return;
    }
    if (
      target &&
      mutate(
        (db) =>
          transitionJobStatusForActor(db, view.job.id, actor.id, target, note),
        setError,
      )
    ) {
      setTarget(undefined);
      setNote("");
      setError("");
    }
  }
~~~

## src/App.tsx submit

src/App.tsx:12598

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      mutate(
        (db) => approveEstimateForActor(db, view.job.id, actor.id, note),
        setError,
      )
    )
      onClose();
  }
~~~

## src/App.tsx lifecycleActionLabel

src/App.tsx:12643

~~~typescript
function lifecycleActionLabel(from: MainStatus, to: MainStatus) {
  if (to === "CANCELLED") return "Cancel Job";
  if (to === "HOLD") return "Put On Hold";
  if (from === "HOLD") return "Resume Work";
  if (from === "COMPLETED" && to === "IN_PROGRESS") return "Start Rework";
  if (to === "IN_PROGRESS") return "Start Work";
  if (to === "COMPLETED") return "Complete Work";
  return "Close Job";
}
~~~

## src/App.tsx formatTimestamp

src/App.tsx:12653

~~~typescript
function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
~~~

## src/App.tsx updateItem

src/App.tsx:12766

~~~typescript
updateItem = (key: string, patch: Partial<EstimateDraftRow>) =>
    setItems((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    )
~~~

## src/App.tsx save

src/App.tsx:12770

~~~typescript
save = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      mutate(
        (db) =>
          saveEstimateForActor(db, view.job.id, actor.id, {
            discount,
            gst_rate: view.estimate?.gst_rate ?? 18,
            notes,
            items,
          }),
        setError,
      )
    )
      onClose();
  }
~~~

## src/App.tsx phaseStatusAllowed

src/App.tsx:13084

~~~typescript
phaseStatusAllowed = (phase: JobMediaCategory) =>
    phase === "Before Work"
      ? view.job.main_status === "NEW"
      : view.job.main_status === "IN_PROGRESS" ||
        view.job.main_status === "COMPLETED"
~~~

## src/App.tsx canMutatePhoto

src/App.tsx:13091

~~~typescript
canMutatePhoto = (photo: Photo) =>
    canMutateJobLifecycle(actor, view.job) &&
    phaseStatusAllowed(
      photo.category === "After Work" ? "After Work" : "Before Work",
    )
~~~

## src/App.tsx mediaLockMessage

src/App.tsx:13096

~~~typescript
mediaLockMessage = (phase: JobMediaCategory) =>
    phase === "Before Work"
      ? "Before Photos are locked after the job leaves NEW."
      : view.job.main_status === "HOLD" ||
          view.job.main_status === "CLOSED" ||
          view.job.main_status === "CANCELLED"
        ? "After Photos are locked while this job is on hold, closed, or cancelled."
        : "After Photos can be added or changed only while the job is IN_PROGRESS or COMPLETED."
~~~

## src/App.tsx chooseFile

src/App.tsx:13115

~~~typescript
chooseFile = async (file?: File) => {
    setPrepared(undefined);
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      const next = await compressMediaFile(file);
      setPrepared(next);
      if (!label.trim()) setLabel(file.name.replace(/\.[^.]+$/, ""));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not prepare this image.",
      );
    } finally {
      setBusy(false);
    }
  }
~~~

## src/App.tsx upload

src/App.tsx:13134

~~~typescript
upload = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!prepared) {
      setError("Choose an image to upload.");
      return;
    }
    if (
      mutate(
        (db) =>
          saveJobPhotoForActor(db, view.job.id, actor.id, {
            label,
            category: uploadPhase,
            ...prepared,
          }),
        setError,
      )
    ) {
      setLabel("");
      setPrepared(undefined);
      const input = document.getElementById(
        `job-media-file-${view.job.id}`,
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    }
  }
~~~

## src/App.tsx emptyRequest

src/App.tsx:13474

~~~typescript
emptyRequest = (): MaterialRequest => ({
    id: 0,
    job_card_id: store ? 0 : (state.jobs[0]?.job.id ?? 0),
    item_id: state.inventory[0]?.id ?? 0,
    requested_qty: 1,
    issued_qty: 0,
    used_qty: 0,
    returned_qty: 0,
    wasted_qty: 0,
  })
~~~

## src/App.tsx emptyPurchase

src/App.tsx:13484

~~~typescript
emptyPurchase = (): LocalPurchase => ({
    id: 0,
    job_card_id: 0,
    item_description: "",
    quantity: 1,
    unit: "piece",
    unit_cost: 0,
    vendor: "",
    bill_reference: "",
    note: "",
  })
~~~

## src/App.tsx setJob

src/App.tsx:13508

~~~typescript
setJob = (id?: number) =>
    source === "inventory"
      ? setDraft({ ...draft, job_card_id: id ?? 0 })
      : setPurchase({ ...purchase, job_card_id: id ?? 0 })
~~~

## src/App.tsx setPeriodForJob

src/App.tsx:13512

~~~typescript
setPeriodForJob = (jobId: number) => {
    const received = state.jobs.find((view) => view.job.id === jobId)?.visit
      .received_at;
    if (!received) return;
    setPeriod({ monthYear: received.slice(0, 7) });
  }
~~~

## src/App.tsx selectRequest

src/App.tsx:13518

~~~typescript
selectRequest = (id: number) => {
    const next = requests.find((item) => item.id === id);
    setDraft(next ?? emptyRequest());
    if (next) setPeriodForJob(next.job_card_id);
  }
~~~

## src/App.tsx selectPurchase

src/App.tsx:13523

~~~typescript
selectPurchase = (id: number) => {
    const next = purchases.find((item) => item.id === id);
    setPurchase(next ?? emptyPurchase());
    if (next) setPeriodForJob(next.job_card_id);
  }
~~~

## src/App.tsx save

src/App.tsx:13528

~~~typescript
save = () => {
    setError("");
    if (!current.job_card_id) {
      setError("Choose a matching job before saving.");
      return;
    }
    if (source === "inventory") {
      if (
        mutate(
          (db) =>
            draft.id
              ? updateMaterialRequest(db, draft.id, draft)
              : createMaterialRequest(db, draft),
          setError,
        ) &&
        !draft.id
      )
        setDraft(emptyRequest());
    } else if (
      mutate(
        (db) =>
          purchase.id
            ? updateLocalPurchase(db, purchase.id, purchase)
            : createLocalPurchase(db, purchase),
        setError,
      ) &&
      !purchase.id
    )
      setPurchase(emptyPurchase());
  }
~~~

## src/App.tsx confirm

src/App.tsx:13877

~~~typescript
confirm = () => {
    setError("");
    if (
      mutate(
        (db) => releaseMaterialRowForActor(db, row.request.id, actor.id),
        setError,
      )
    )
      onClose();
  }
~~~

## src/App.tsx submit

src/App.tsx:13945

~~~typescript
submit = () => {
    setError("");
    if (
      mutate(
        (db) => submitMaterialApprovalForActor(db, row.request.id, actor.id),
        setError,
      )
    )
      onClose();
  }
~~~

## src/App.tsx changeQuantity

src/App.tsx:14014

~~~typescript
changeQuantity =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setZeroRecordedAcknowledged(false);
      setError("");
    }
~~~

## src/App.tsx submit

src/App.tsx:14021

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!quantitiesValid) {
      setError("Enter finite, non-negative quantities.");
      return;
    }
    if (!withinIssued) {
      setError(
        `Reconciliation total cannot exceed the ${request.issued_qty} issued.`,
      );
      return;
    }
    if (needsZeroAcknowledgement && !zeroRecordedAcknowledged) {
      setError(
        "Confirm that neither returned material nor wastage is being recorded.",
      );
      return;
    }
    if (
      mutate(
        (db) =>
          reconcileMaterialQty(db, request.id, usedQty, returnedQty, wastedQty),
        setError,
      )
    )
      onClose();
  }
~~~

## src/App.tsx emptyInventoryItem

src/App.tsx:14176

~~~typescript
emptyInventoryItem = (): InventoryItem => ({
  id: 0,
  sku: "",
  category: "",
  name: "",
  unit: "piece",
  stock_qty: 0,
  low_stock_qty: 0,
  selling_price: 0,
})
~~~

## src/App.tsx submit

src/App.tsx:14210

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const saved = mutate(
      (db) =>
        addingNew
          ? (() => {
              const id = createInventoryItem(db, { ...draft, stock_qty: 0 });
              if (inwardQty > 0)
                recordStockInwardForActor(db, actor.id, {
                  item_id: id,
                  qty: inwardQty,
                  note: "Initial inward",
                });
            })()
          : recordStockInwardForActor(db, actor.id, {
              item_id: selectedId,
              qty: inwardQty,
              note: "Quick inward",
              purchase_order_line_id: purchaseOrderLineId || undefined,
            }),
      setError,
    );
    if (saved) {
      setInwardQty(1);
      if (addingNew) {
        setAddingNew(false);
        setDraft(emptyInventoryItem());
      } else {
        setPurchaseOrderId(0);
        setPurchaseOrderLineId(0);
      }
      onSaved?.();
    }
  }
~~~

## src/App.tsx save

src/App.tsx:14480

~~~typescript
save = (event: FormEvent) => {
    event.preventDefault();
    if (mutate((db) => updateInventoryItem(db, item.id, draft))) onClose();
  }
~~~

## src/App.tsx archive

src/App.tsx:14484

~~~typescript
archive = () => {
    if (!confirmingArchive) {
      setConfirmingArchive(true);
      return;
    }
    if (
      mutate((db) =>
        archiveInventoryItem(db, item.id, "Archived from stock details"),
      )
    )
      onClose();
  }
~~~

## src/App.tsx choose

src/App.tsx:15070

~~~typescript
choose = (view: JobView) => {
    setSelectedId(view.job.id);
    setQuery(view.job.job_no);
    setOpen(false);
  }
~~~

## src/App.tsx clear

src/App.tsx:15075

~~~typescript
clear = () => {
    setMonth("");
    setDate("");
    setQuery("");
    setSelectedId(undefined);
    setOpen(false);
    setActiveIndex(-1);
  }
~~~

## src/App.tsx onKeyDown

src/App.tsx:15083

~~~typescript
onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        event.key === "ArrowDown"
          ? Math.min(index + 1, options.length - 1)
          : index < 0
            ? options.length - 1
            : Math.max(index - 1, 0),
      );
    } else if (event.key === "Enter" && options.length > 0) {
      event.preventDefault();
      choose(options[Math.max(0, activeIndex)]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }
~~~

## src/App.tsx resolve

src/App.tsx:15255

~~~typescript
resolve = (): RenderedDocument => {
    const snapshots = loadDocumentSnapshots();
    const snap = snapshotId
      ? snapshots.find((item) => item.id === snapshotId)
      : undefined;
    return snap
      ? renderSnapshotDocument(snap)
      : renderJobDocument(kind, view, loadAdminDemoState(), snapshots);
  }
~~~

## src/App.tsx print

src/App.tsx:15264

~~~typescript
print = () => {
    setErrorMessage("");
    try {
      const result = printRenderedDocument(resolve());
      if (!result.ok) throw new Error(result.error);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The document could not be printed.",
      );
      setStatus("error");
    }
  }
~~~

## src/App.tsx download

src/App.tsx:15278

~~~typescript
download = async () => {
    setStatus("preparing");
    setErrorMessage("");
    let doc: RenderedDocument;
    try {
      doc = resolve();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Document is not available.",
      );
      setStatus("error");
      return;
    }
    try {
      await new Promise<void>((done) => window.setTimeout(done, 30));
      await renderHtmlToPdf(doc.html, doc.filename);
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      // PDF generation failed: fall back to the browser print dialog (Save as PDF).
      const result = printRenderedDocument(doc);
      if (result.ok) setStatus("idle");
      else {
        setErrorMessage(result.error ?? "Document generation failed.");
        setStatus("error");
      }
    }
  }
~~~

## src/App.tsx pdf

src/App.tsx:15349

~~~typescript
pdf = (event: DataFlowEvent) => {
    if (!event.document) return null;
    const snap = event.document.void
      ? snapshots.find(
          (item) =>
            item.jobId === view.job.id &&
            item.kind === event.document!.kind &&
            item.number === event.document!.number &&
            item.state === "void",
        )
      : undefined;
    if (event.document.void && !snap) return null;
    return (
      <DocumentDownloadButton
        kind={event.document.kind}
        view={view}
        snapshotId={snap?.id}
        label="PDF"
        showPrint={false}
        className="workflow-action action-document document-download data-flow-document-action"
      />
    );
  }
~~~

## src/App.tsx submit

src/App.tsx:15702

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!customer || !vehicle) {
      setError("Select a customer and a vehicle.");
      return;
    }
    if (!advisorId) {
      setError("Assign a service advisor.");
      return;
    }
    const odoReading = Number(form.odoReading);
    if (!Number.isFinite(odoReading) || odoReading < 0) {
      setError("Enter the ODO meter reading in km.");
      return;
    }
    if (!form.fuelLevelValue.trim()) {
      setError("Enter the fuel or battery level.");
      return;
    }
    const fuel =
      form.fuelLevelUnit === "Other"
        ? form.fuelLevelValue
        : `${form.fuelLevelValue} ${form.fuelLevelUnit}`;
    if (
      mutate(
        (db) =>
          receiveVehicle(db, {
            customerId: customer.id,
            vehicleId: vehicle.id,
            customerName: customer.name,
            mobile: customer.mobile,
            customerType: customer.type,
            vehicleNo: vehicle.number,
            make: vehicle.make,
            model: vehicle.model,
            color: vehicle.color,
            km: odoReading,
            odoReading,
            fuel,
            fuelLevelValue: form.fuelLevelValue,
            fuelLevelUnit: form.fuelLevelUnit,
            keys: form.keys,
            accessories: form.accessories,
            requestedWork: form.requestedWork,
            advisorId,
            receptionId: actor.id,
          }),
        setError,
      )
    )
      onClose();
  }
~~~

## src/App.tsx save

src/App.tsx:15965

~~~typescript
save = () => {
    setError("");
    if (
      mutate(
        (db) => setDamageMarksForActor(db, view.job.id, actor.id, marks),
        setError,
      )
    )
      setSaved(true);
  }
~~~

## src/App.tsx archive

src/App.tsx:16038

~~~typescript
archive = () => {
    if (
      !onAdminArchive ||
      !window.confirm(
        `Archive Job ${view.job.job_no}? This will cancel the job card.`,
      )
    )
      return;
    if (onAdminArchive()) onClose();
  }
~~~

## src/App.tsx run

src/App.tsx:16283

~~~typescript
run = (action: (db: Database) => unknown) => mutate(action, setError)
~~~

## src/App.tsx jobDeliveryMonths

src/App.tsx:17555

~~~typescript
jobDeliveryMonths = (jobs: JobView[], selectedMonth: string) =>
  [...new Set([localCalendarDate().slice(0, 7), selectedMonth, ...jobs.map((view) => view.job.estimated_delivery?.slice(0, 7) ?? "")].filter((month) => /^\d{4}-\d{2}$/.test(month)))].sort().reverse()
~~~

## src/App.tsx updateFilters

src/App.tsx:17651

~~~typescript
updateFilters = (patch: Partial<EntityFilters>) => {
    setFilters((current) => ({
      ...current,
      ...patch,
      ...(kind === "jobs" && patch.date ? { month: "" } : {}),
      ...(kind === "jobs" && patch.month ? { date: "" } : {}),
    }));
    setPage(1);
  }
~~~

## src/App.tsx updateSearch

src/App.tsx:17660

~~~typescript
updateSearch = (value: string) => {
    if (onExternalSearchChange) onExternalSearchChange(value);
    else updateFilters({ search: value });
    setPage(1);
  }
~~~

## src/App.tsx clearFilters

src/App.tsx:17665

~~~typescript
clearFilters = () => {
    setFilters(emptyFilters);
    onExternalSearchChange?.("");
    setPage(1);
  }
~~~

## src/App.tsx changePage

src/App.tsx:17901

~~~typescript
changePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => resultHeading.current?.focus());
  }
~~~

## src/App.tsx openRecord

src/App.tsx:17906

~~~typescript
openRecord = (id: number, mode: "view" | "edit" = "view") => {
    scrollPosition.current = window.scrollY;
    setRecordMode(mode);
    setSelectedId(id);
  }
~~~

## src/App.tsx closeRecord

src/App.tsx:17911

~~~typescript
closeRecord = () => {
    setSelectedId(undefined);
    requestAnimationFrame(() => window.scrollTo(0, scrollPosition.current));
  }
~~~

## src/App.tsx entityTitle

src/App.tsx:18620

~~~typescript
function entityTitle(kind: EntityKind) {
  return {
    jobs: "Jobs",
    customers: "Customers",
    vehicles: "Vehicles",
    media: "Media",
  }[kind];
}
~~~

## src/App.tsx searchPlaceholder

src/App.tsx:18628

~~~typescript
function searchPlaceholder(kind: EntityKind) {
  return {
    jobs: "Job, vehicle or customer",
    customers: "Name or mobile",
    vehicles: "Registration, make, model or customer",
    media: "Label, job or vehicle",
  }[kind];
}
~~~

## src/App.tsx jobTotal

src/App.tsx:18636

~~~typescript
function jobTotal(view: JobView) {
  return (
    view.invoice?.total ?? invoiceItemsTotal(view.estimate_items, view.estimate)
  );
}
~~~

## src/App.tsx canManageJob

src/App.tsx:18731

~~~typescript
canManageJob = (row: JobView) =>
    !historical && canMutateJobLifecycle(actor, row.job)
~~~

## src/App.tsx archive

src/App.tsx:18733

~~~typescript
archive = (id: number) => {
    if (
      !window.confirm(
        `Archive this ${kind === "media" ? "media record" : kind.slice(0, -1)}? It remains recoverable in the local database.`,
      )
    )
      return;
    mutate((db) =>
      kind === "jobs"
        ? archiveJobCardForActor(db, id, actor.id, "Archived from list")
        : kind === "customers"
          ? archiveCustomer(db, id, "Archived from list")
          : kind === "vehicles"
            ? archiveVehicle(db, id, "Archived from list")
            : archiveJobPhotoForActor(
                db,
                id,
                actor.id,
                "Archived from media list",
              ),
    );
  }
~~~

## src/App.tsx cardFor

src/App.tsx:18755

~~~typescript
cardFor = (raw: unknown): ReactNode => {
    if (kind === "jobs") {
      const row = raw as JobView;
      const manageable = canManageJob(row);
      return (
        <article
          className={`record-card job-card job-status-${row.job.main_status.toLowerCase()} ${jobDeliveryClass(row.job, today)}`}
          key={row.job.id}
        >
          <div className="record-identity">
            <strong>{row.vehicle.number}</strong>
            <span>
              {row.vehicle.make} {row.vehicle.model}
            </span>
          </div>
          <h3>{row.job.job_no}</h3>
          <p>
            {row.customer.name} · {row.customer.mobile}
          </p>
          <Status status={row.job.main_status} sub={row.job.sub_status} />
          <DocumentChips view={row} />
          <Info label="Total" value={money(jobTotal(row))} />
          <Info label="Estimated Delivery Date" value={row.job.estimated_delivery || "—"} />
          <RecordActions
            onView={() => openRecord(row.job.id, "view")}
            onEdit={
              manageable ? () => openRecord(row.job.id, "edit") : undefined
            }
            onArchive={manageable ? () => archive(row.job.id) : undefined}
          />
        </article>
      );
    }
    if (kind === "customers") {
      const row = raw as Customer;
      const vehicles = state.vehicles.filter(
        (item) => item.customer_id === row.id,
      );
      const jobs = state.jobs.filter((item) => item.customer.id === row.id);
      return (
        <article className="record-card" key={row.id}>
          <div className="record-identity">
            <strong>{row.name}</strong>
            <span>{row.mobile}</span>
          </div>
          <span className="category-badge">{row.type}</span>
          <Info label="Vehicles" value={vehicles.length} />
          <Info
            label="Open jobs"
            value={
              jobs.filter((job) => job.job.main_status !== "CLOSED").length
            }
          />
          <Info
            label="Last visit"
            value={jobs[0]?.visit.received_at?.slice(0, 10) || "—"}
          />
          <RecordActions
            onView={() => openRecord(row.id, "view")}
            onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined}
            onArchive={canArchive ? () => archive(row.id) : undefined}
          />
        </article>
      );
    }
    if (kind === "vehicles") {
      const row = raw as Vehicle;
      const customer = state.customers.find(
        (item) => item.id === row.customer_id,
      );
      return (
        <article className="record-card" key={row.id}>
          <div className="record-identity">
            <strong>{row.number}</strong>
            <span>
              {row.make} {row.model}
            </span>
          </div>
          <p>
            <i className="color-swatch" style={{ background: row.color }} />
            {row.color}
          </p>
          <Info label="Customer" value={customer?.name ?? "—"} />
          <Info label="KM" value={row.km.toLocaleString("en-IN")} />
          <RecordActions
            onView={() => openRecord(row.id, "view")}
            onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined}
            onArchive={canArchive ? () => archive(row.id) : undefined}
          />
        </article>
      );
    }
    const { photo, job } = raw as { photo: Photo; job: JobView };
    return (
      <article className="record-card media-card" key={photo.id}>
        <div className="media-preview">
          <img src={photo.src || "/media-placeholder.svg"} alt={photo.label} />
          <span>{photo.category || "General"}</span>
        </div>
        <h3>{job.vehicle.number}</h3>
        <p>
          {job.job.job_no} · {photo.label}
        </p>
        <RecordActions
          onView={() => openRecord(photo.id)}
          onArchive={canArchive ? () => archive(photo.id) : undefined}
        />
      </article>
    );
  }
~~~

## src/App.tsx tableHeaders

src/App.tsx:18967

~~~typescript
function tableHeaders(kind: EntityKind) {
  return kind === "jobs"
    ? ["Job", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Total", "Actions"]
    : kind === "customers"
      ? ["Customer", "Mobile", "Type", "Vehicles", "Open Jobs", "Actions"]
      : kind === "vehicles"
        ? ["Registration", "Make / Model", "Color", "Customer", "KM", "Actions"]
        : ["Preview", "Label", "Category", "Vehicle / Job", "Actions"];
}
~~~

## src/App.tsx rowId

src/App.tsx:18976

~~~typescript
function rowId(kind: EntityKind, raw: unknown) {
  return kind === "jobs"
    ? (raw as JobView).job.id
    : kind === "media"
      ? (raw as { photo: Photo }).photo.id
      : (raw as Customer | Vehicle).id;
}
~~~

## src/App.tsx clearFilters

src/App.tsx:19232

~~~typescript
clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setReceivedDate("");
    setReceivedMonth("");
    setPage(1);
  }
~~~

## src/App.tsx headlineFor

src/App.tsx:19554

~~~typescript
function headlineFor(role: Role) {
  return {
    admin: "Control room for linked workflow, blockers and cash.",
    service: "Command queue for estimates, approvals and customer updates.",
    service_manager: "Department queue for routing and advisor handoffs.",
    reception: "Intake desk for visits, customers and new job cards.",
    accounts: "Closure desk for invoice, payment, receipt and gate pass.",
    store: "Issue counter for accountable material movement.",
    tech: "Task board for work updates, washing and QC handoff.",
  }[role];
}
~~~

## src/App.tsx textFields

src/App.tsx:19566

~~~typescript
function textFields<T extends Record<string, unknown>>(
  form: T,
  setForm: (value: T) => void,
) {
  void setForm;
  return [
    ["customerName", "Customer Name"],
    ["mobile", "Mobile"],
    ["customerType", "Customer Type"],
    ["vehicleNo", "Vehicle Number"],
    ["make", "Make"],
    ["model", "Model"],
    ["color", "Color"],
    ["km", "KM"],
    ["fuel", "Fuel"],
    ["keys", "Keys"],
    ["accessories", "Accessories"],
    ["requestedWork", "Requested Work"],
    ["address", "Address"],
    ["engineNo", "Engine Number"],
    ["serviceType", "Service Type"],
    ["pickupDrop", "Pickup / Drop"],
    ["estimatedDelivery", "Estimated Delivery"],
  ] as [keyof T, string][];
}
~~~

## src/auth.ts base64Url

src/auth.ts:33

~~~typescript
base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
~~~

## src/auth.ts sha256

src/auth.ts:36

~~~typescript
async function sha256(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}
~~~

## src/auth.ts randomValue

src/auth.ts:40

~~~typescript
function randomValue() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}
~~~

## src/auth.ts exchange

src/auth.ts:74

~~~typescript
async function exchange(config: CognitoConfig, values: URLSearchParams): Promise<Tokens> {
  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: values,
  });
  if (!response.ok) throw new Error("Cognito sign-in could not be completed.");
  const payload = await response.json() as { access_token: string; refresh_token?: string; expires_in: number };
  return { accessToken: payload.access_token, refreshToken: payload.refresh_token, expiresAt: Date.now() + payload.expires_in * 1000 };
}
~~~

## src/auth.ts tokens

src/auth.ts:85

~~~typescript
async function tokens(config: CognitoConfig): Promise<Tokens | undefined> {
  const saved = sessionStorage.getItem(TOKEN_KEY);
  if (!saved) return undefined;
  const current = JSON.parse(saved) as Tokens;
  if (current.expiresAt > Date.now() + 30_000) return current;
  if (!current.refreshToken) return undefined;
  const refreshed = await exchange(config, new URLSearchParams({
    grant_type: "refresh_token", client_id: config.clientId, refresh_token: current.refreshToken,
  }));
  refreshed.refreshToken = current.refreshToken;
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(refreshed));
  return refreshed;
}
~~~

## src/billing-manager.tsx money

src/billing-manager.tsx:28

~~~typescript
function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
~~~

## src/billing-manager.tsx timestamp

src/billing-manager.tsx:32

~~~typescript
function timestamp(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
~~~

## src/billing-manager.tsx delivered

src/billing-manager.tsx:38

~~~typescript
function delivered(view: JobView) {
  return Boolean(view.checklist_items.find((item) => item.stage === "CLOSED" && item.label === "Delivered" && item.checked_at));
}
~~~

## src/billing-manager.tsx recordCreatedAt

src/billing-manager.tsx:42

~~~typescript
function recordCreatedAt(mode: BillingMode, record: BillingRecord) {
  return mode === "Invoices" ? record.view.invoice?.created_at
    : mode === "Payments" ? record.payment?.created_at
      : record.view.gate_pass?.created_at;
}
~~~

## src/billing-manager.tsx recordDate

src/billing-manager.tsx:48

~~~typescript
function recordDate(mode: BillingMode, record: BillingRecord) {
  return recordCreatedAt(mode, record)?.slice(0, 10) ?? "";
}
~~~

## src/billing-manager.tsx monthYearLabel

src/billing-manager.tsx:52

~~~typescript
function monthYearLabel(month: string) {
  const date = new Date(`${month}-01T00:00:00`);
  return Number.isNaN(date.valueOf()) ? month : date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}
~~~

## src/billing-manager.tsx newestFirst

src/billing-manager.tsx:57

~~~typescript
function newestFirst(mode: BillingMode, left: BillingRecord, right: BillingRecord) {
  const leftTime = recordCreatedAt(mode, left) ?? "";
  const rightTime = recordCreatedAt(mode, right) ?? "";
  return rightTime.localeCompare(leftTime) || right.key.localeCompare(left.key);
}
~~~

## src/billing-manager.tsx recordsFor

src/billing-manager.tsx:63

~~~typescript
function recordsFor(mode: BillingMode, jobs: JobView[], voidedOnly = false): BillingRecord[] {
  if (mode === "Invoices") {
    if (voidedOnly) return jobs.flatMap((view) => (view.invoice_history ?? []).filter((invoice) => invoice.voided_at).map((invoice) => ({
      key: `void-invoice-${invoice.id}`,
      view: { ...view, invoice, invoice_items: view.invoice_items.filter((item) => item.invoice_id === invoice.id), payments: view.payment_history?.filter((payment) => payment.invoice_id === invoice.id) ?? [] },
    })));
    return jobs.filter((view) => view.invoice && !view.invoice.voided_at).map((view) => ({ key: `invoice-${view.job.id}`, view }));
  }
  // Payments is a receipt register, not a work queue. Only show completed, active
  // payments so unpaid jobs and voided history never appear alongside receipts.
  if (mode === "Payments") return mixedPaymentRows(jobs, { includeUnpaid: false }).filter((record) => {
    const payment = record.payment;
    const receipt = record.view.receipt;
    if (!payment) return false;
    return record.kind === "received"
      && payment.invoice_id === record.view.invoice?.id
      && record.view.invoice?.status === "Cleared"
      && receipt?.invoice_id === payment.invoice_id
      && !receipt.voided_at;
  });
  return jobs.filter((view) => view.gate_pass && !view.gate_pass.voided_at).map((view) => ({ key: `delivery-${view.job.id}`, view }));
}
~~~

## src/billing-manager.tsx invoiceStatus

src/billing-manager.tsx:86

~~~typescript
function invoiceStatus(view: JobView) {
  return view.invoice ? (view.invoice.voided_at ? "Void" : view.invoice.status) : "Not created";
}
~~~

## src/billing-manager.tsx paymentStatus

src/billing-manager.tsx:90

~~~typescript
function paymentStatus(record: BillingRecord) {
  return record.kind === "unpaid" ? "Unpaid" : record.kind === "void" ? "Void" : "Paid";
}
~~~

## src/billing-manager.tsx accountsRowHighlight

src/billing-manager.tsx:94

~~~typescript
function accountsRowHighlight(mode: BillingMode, record: BillingRecord, enabled: boolean) {
  if (!enabled || record.kind === "void") return "";
  if (mode === "Invoices") {
    const status = invoiceStatus(record.view);
    return status === "Pending" ? "billing-row-invoice-pending" : status === "Cleared" ? "billing-row-invoice-cleared" : "";
  }
  if (mode !== "Payments" || !record.payment) return "";
  const paymentModeClass: Record<PaymentMode, string> = {
    Cash: "billing-row-payment-cash",
    UPI: "billing-row-payment-upi",
    Card: "billing-row-payment-card",
    "Bank transfer": "billing-row-payment-bank-transfer",
    Other: "billing-row-payment-other",
  };
  return paymentModeClass[record.payment.mode];
}
~~~

## src/billing-manager.tsx searchText

src/billing-manager.tsx:111

~~~typescript
function searchText(record: BillingRecord) {
  const { view, payment } = record;
  return normalizeSearch([view.job.job_no, view.customer.name, view.customer.mobile, view.vehicle.number, view.invoice?.invoice_no, view.invoice?.tally_invoice_no, view.invoice?.status, payment?.amount, payment?.mode, payment?.other_detail, payment?.reference, view.gate_pass?.gate_pass_no, delivered(view) ? "delivered" : "pending", record.kind ? paymentStatus(record) : ""].join(" "));
}
~~~

## src/billing-manager.tsx recordStatus

src/billing-manager.tsx:130

~~~typescript
recordStatus = (record: BillingRecord) => mode === "Invoices" ? invoiceStatus(record.view) : mode === "Payments" ? paymentStatus(record) : delivered(record.view) ? "Delivered" : "Pending"
~~~

## src/billing-manager.tsx clear

src/billing-manager.tsx:144

~~~typescript
clear = () => { setSearch(""); setStatus("ALL"); setPaymentMode("ALL"); setEventMonth("ALL"); setJobId(undefined); setPage(1); }
~~~

## src/billing-manager.tsx toggle

src/billing-manager.tsx:151

~~~typescript
toggle = (key: string) => { setExpanded((current) => current === key ? undefined : key); const hit = allRecords.find((record) => record.key === key); if (manage && hit) setJobId(hit.view.job.id); }
~~~

## src/billing-manager.tsx submit

src/billing-manager.tsx:237

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!reason.trim()) { setError("A reason is required."); return; }
    mutate((db) => onVoid(db, reason), setError);
  }
~~~

## src/billing-manager.tsx record

src/billing-manager.tsx:258

~~~typescript
record = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    mutate((db) => { recordPaymentForActor(db, invoice.id, actor.id, { mode, otherDetail, reference, notes }); }, setError);
  }
~~~

## src/billing-manager.tsx draftFor

src/billing-manager.tsx:283

~~~typescript
draftFor = (source: JobView) => buildInvoiceDraft(source)
~~~

## src/billing-manager.tsx toDrafts

src/billing-manager.tsx:284

~~~typescript
toDrafts = (source: JobView): InvoiceItemDraft[] => source.invoice
    ? source.invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_type: item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST"), gst_rate: item.gst_rate ?? source.invoice!.gst_rate, material_row_id: item.material_row_id ?? undefined }))
    : draftFor(source).lines
~~~

## src/billing-manager.tsx chooseJob

src/billing-manager.tsx:299

~~~typescript
chooseJob = (jobId: number) => {
    const next = candidates.find((candidate) => candidate.job.id === jobId);
    if (!next) return;
    setSelected(next);
    setTally("");
    setDiscount(draftFor(next).discount);
    setNotes("");
    setItems(toDrafts(next));
  }
~~~

## src/billing-manager.tsx updateItem

src/billing-manager.tsx:308

~~~typescript
updateItem = (index: number, patch: Partial<InvoiceItemDraft>) => setItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row))
~~~

## src/billing-manager.tsx submit

src/billing-manager.tsx:309

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const ok = mutate((db) => action === "create"
      ? createInvoiceForActor(db, selected.job.id, actor.id, { tallyInvoiceNo: tally, discount, notes, items })
      : saveInvoiceForActor(db, invoice!.id, actor.id, { tallyInvoiceNo: tally, discount, notes, items, note: editNote }), setError);
    if (ok) onClose();
  }
~~~

## src/billing-manager.tsx submit

src/billing-manager.tsx:368

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!reason.trim()) { setError("A reason is required."); return; }
    if (mutate((db) => action(db, reason), setError)) onClose();
  }
~~~

## src/body-mark.tsx formatRecordedAt

src/body-mark.tsx:13

~~~typescript
function formatRecordedAt(recordedAt?: string | null) {
  if (!recordedAt) return "Not recorded";
  const date = new Date(recordedAt);
  return Number.isNaN(date.valueOf()) ? recordedAt : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
~~~

## src/body-mark.tsx download

src/body-mark.tsx:62

~~~typescript
download = () => { setError(""); downloadBodyMarkImage(marks, meta).catch((err) => setError(err instanceof Error ? err.message : "Download failed.")); }
~~~

## src/booking-calendar.tsx quotaKey

src/booking-calendar.tsx:13

~~~typescript
quotaKey = (type: BookingServiceType) => type === "Service Work" ? "serviceWork" : "generalCheckupFollowup"
~~~

## src/booking-calendar.tsx dateLabel

src/booking-calendar.tsx:14

~~~typescript
function dateLabel(date: string) { return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
~~~

## src/booking-calendar.tsx monthLabel

src/booking-calendar.tsx:15

~~~typescript
function monthLabel(month: string) { return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" }); }
~~~

## src/booking-calendar.tsx capacityFor

src/booking-calendar.tsx:16

~~~typescript
function capacityFor(state: WorkshopState, bookingDate: string) {
  const configured = state.booking_capacity_limits.find((row) => row.booking_date === bookingDate);
  const quota = (serviceType: BookingServiceType) => {
    const limit = serviceType === "Service Work" ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
    const count = state.bookings.filter((b) => b.booking_date === bookingDate && b.service_type === serviceType && active.has(b.status)).length;
    return { limit, count, remaining: Math.max(0, limit - count) };
  };
  return { serviceWork: quota("Service Work"), generalCheckupFollowup: quota("General Checkup / Follow-up") };
}
~~~

## src/booking-calendar.tsx quota

src/booking-calendar.tsx:18

~~~typescript
quota = (serviceType: BookingServiceType) => {
    const limit = serviceType === "Service Work" ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
    const count = state.bookings.filter((b) => b.booking_date === bookingDate && b.service_type === serviceType && active.has(b.status)).length;
    return { limit, count, remaining: Math.max(0, limit - count) };
  }
~~~

## src/booking-calendar.tsx draftFor

src/booking-calendar.tsx:26

~~~typescript
draftFor = (bookingDate: string): BookingDraft => ({ customerName: "", mobile: "", customerType: "Individual", vehicleNo: "", make: "", model: "", color: "", requestedWork: "", serviceType: "Service Work", bookingDate, arrivalWindow: "", capacityOverrideReason: "" })
~~~

## src/booking-calendar.tsx draftCapacity

src/booking-calendar.tsx:30

~~~typescript
draftCapacity = (date: string) => { const c = capacityFor(state, date); return { serviceWork: String(c.serviceWork.limit), generalCheckupFollowup: String(c.generalCheckupFollowup.limit) }; }
~~~

## src/booking-calendar.tsx quota

src/booking-calendar.tsx:32

~~~typescript
quota = (date: string, type: BookingServiceType) => capacityFor(state, date)[quotaKey(type)]
~~~

## src/booking-calendar.tsx selectDate

src/booking-calendar.tsx:35

~~~typescript
selectDate = (date: string) => { setSelectedDate(date); setCapacityDraft(draftCapacity(date)); }
~~~

## src/booking-calendar.tsx changeMonth

src/booking-calendar.tsx:36

~~~typescript
changeMonth = (delta: -1 | 1) => { const next = shiftCalendarMonth(month, delta); if (next < range.firstMonth || next > range.lastMonth) return; setMonth(next); selectDate(clampAdvanceBookingDate(`${next}-01`, range)); }
~~~

## src/booking-calendar.tsx submit

src/booking-calendar.tsx:37

~~~typescript
submit = (event: FormEvent) => { event.preventDefault(); if (mutate((db) => createBooking(db, actor.id, form), setError)) setCreating(false); }
~~~

## src/booking-calendar.tsx saveLimits

src/booking-calendar.tsx:38

~~~typescript
saveLimits = (event: FormEvent) => { event.preventDefault(); if (mutate((db) => setBookingCapacityForDate(db, actor.id, selectedDate, { serviceWork: Number(capacityDraft.serviceWork), generalCheckupFollowup: Number(capacityDraft.generalCheckupFollowup) }), setError)) setEditingCapacity(false); }
~~~

## src/booking-check-in.tsx submit

src/booking-check-in.tsx:27

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    const odo = Number(odoReading);
    if (!Number.isFinite(odo) || odo < 0) return setError("Enter the ODO meter reading in km.");
    let jobId = 0;
    let jobNo = "";
    if (mutate((db) => { jobId = checkInBooking(db, booking.id, actor.id, { odoReading: odo, fuelLevelValue, fuelLevelUnit, keys, accessories, requestedWork, damageMarks: serializeDamageMarks(marks) }).jobId; jobNo = String(db.exec("select job_no from job_cards where id=?", [jobId])[0]?.values[0]?.[0] ?? ""); }, setError)) onCreated(jobId, jobNo);
  }
~~~

## src/booking-expected-today.tsx openAction

src/booking-expected-today.tsx:42

~~~typescript
openAction = (booking: Booking, action: Action) => {
    setSelected({ booking, action });
    setError("");
    setNote("");
    setCapacityOverrideReason("");
    setRescheduleDate(clampAdvanceBookingDate(booking.booking_date, range));
    setArrivalWindow(booking.arrival_window);
  }
~~~

## src/booking-expected-today.tsx closeAction

src/booking-expected-today.tsx:50

~~~typescript
closeAction = () => { setSelected(undefined); setError(""); }
~~~

## src/booking-expected-today.tsx submit

src/booking-expected-today.tsx:51

~~~typescript
submit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || selected.action === "check-in") return;
    const success = mutate((db) => {
      if (selected.action === "call") recordBookingCall(db, selected.booking.id, actor.id, note);
      if (selected.action === "reschedule") rescheduleBooking(db, selected.booking.id, actor.id, rescheduleDate, note, arrivalWindow, new Date().toISOString(), capacityOverrideReason);
      if (selected.action === "cancel") cancelBooking(db, selected.booking.id, actor.id, note);
      if (selected.action === "no-show") markBookingNoShow(db, selected.booking.id, actor.id, note);
    }, setError);
    if (success) closeAction();
  }
~~~

## src/dashboard-metrics.ts inMonth

src/dashboard-metrics.ts:28

~~~typescript
inMonth = (value: string | undefined, month: string) => Boolean(value && value.slice(0, 7) === month)
~~~

## src/data-flow.ts visitDate

src/data-flow.ts:12

~~~typescript
visitDate = (view: JobView) => view.visit.received_at.slice(0, 10)
~~~

## src/data-flow.ts visitMonth

src/data-flow.ts:13

~~~typescript
visitMonth = (view: JobView) => visitDate(view).slice(0, 7)
~~~

## src/data-flow.ts actorName

src/data-flow.ts:58

~~~typescript
actorName = (actorId: number | null | undefined, users: User[]) => actorId === 0 ? "System" : users.find((user) => user.id === actorId)?.name ?? (actorId ? `User ${actorId}` : undefined)
~~~

## src/data-flow.ts hasTime

src/data-flow.ts:59

~~~typescript
hasTime = (timestamp: string | null | undefined): timestamp is string => Boolean(timestamp?.trim())
~~~

## src/data-flow.ts sameTime

src/data-flow.ts:60

~~~typescript
sameTime = (left?: string | null, right?: string | null) => Boolean(left && right && left === right)
~~~

## src/data-flow.ts documentNumber

src/data-flow.ts:77

~~~typescript
documentNumber = (kind: DocumentKind, view: JobView) => documentInfo(kind, view)?.number ?? ""
~~~

## src/data-flow.ts checklistEvents

src/data-flow.ts:79

~~~typescript
function checklistEvents(item: ChecklistItem, users: User[]): DataFlowEvent[] {
  const actor = actorName(item.checked_by, users);
  const cycle = `${item.stage} cycle ${item.cycle_number}`;
  const events: DataFlowEvent[] = [];
  if (hasTime(item.started_at)) events.push({ id: `checklist-start-${item.id}`, kind: "checklist", timestamp: item.started_at, title: `${item.label} started`, detail: cycle, actor });
  if (hasTime(item.completed_at ?? item.checked_at)) events.push({ id: `checklist-complete-${item.id}`, kind: "checklist", timestamp: (item.completed_at ?? item.checked_at)!, title: `${item.label} completed`, detail: cycle, actor });
  return events;
}
~~~

## src/data-flow.ts item

src/data-flow.ts:136

~~~typescript
item = (id: number | null) => view.inventory.find((candidate) => candidate.id === id)?.name ?? `Item ${id}`
~~~

## src/db.ts checklistStageForSubStatus

src/db.ts:143

~~~typescript
function checklistStageForSubStatus(subStatus: SubStatus): ChecklistStage {
  return (
    (
      Object.entries(LIFECYCLE_CHECKLIST) as [
        ChecklistStage,
        readonly SubStatus[],
      ][]
    ).find(([, labels]) => labels.includes(subStatus))?.[0] ?? "NEW"
  );
}
~~~

## src/db.ts byId

src/db.ts:331

~~~typescript
byId = <T extends { id: number }>(rows: T[]) =>
    new Map(rows.map((row) => [row.id, row]))
~~~

## src/db.ts groupBy

src/db.ts:333

~~~typescript
groupBy = <T>(rows: T[], key: (row: T) => number) => {
    const grouped = new Map<number, T[]>();
    rows.forEach((row) =>
      grouped.set(key(row), [...(grouped.get(key(row)) ?? []), row]),
    );
    return grouped;
  }
~~~

## src/db.ts jobViews

src/db.ts:475

~~~typescript
jobViews = (rows: JobCard[]): JobView[] =>
    rows.map((job) => {
      const visit = allVisits.get(job.visit_id)!;
      const customer = allCustomers.get(visit.customer_id)!;
      const vehicle = allVehicles.get(visit.vehicle_id)!;
      const advisor = allUsers.get(job.advisor_id) ?? UNASSIGNED_ADVISOR;
      const technician = allUsers.get(job.technician_id)!;
      const jobEstimates = estimatesByJob.get(job.id) ?? [];
      const estimate = jobEstimates.at(-1);
      const estimate_items = estimate
        ? (estimateItemsByEstimate.get(estimate.id) ?? [])
        : [];
      const material_requests = materialByJob.get(job.id) ?? [];
      const jobMaterialEvents = materialEventsByJob.get(job.id) ?? [];
      const materialItemIds = new Set([
        ...material_requests.map((request) => request.item_id),
        ...jobMaterialEvents.flatMap((event) => [
          event.old_item_id,
          event.new_item_id,
        ]),
      ]);
      const materialInventory = [...materialItemIds]
        .map((id) => allInventory.get(id as number))
        .filter(Boolean) as InventoryItem[];
      const invoice = (invoicesByJob.get(job.id) ?? []).at(-1);
      return {
        job,
        visit,
        customer,
        vehicle,
        advisor,
        technician,
        estimate,
        estimate_items,
        task_list_items: taskListByJob.get(job.id) ?? [],
        material_requests,
        local_purchases: localPurchasesByJob.get(job.id) ?? [],
        material_purchase_requests: purchaseRequestsByJob.get(job.id) ?? [],
        material_approval: [...approvalsByJob.values()].find(
          (approval) => approval.job_card_id === job.id,
        ),
        material_approval_history: approvalEventsByJob.get(job.id) ?? [],
        material_events: jobMaterialEvents,
        invoice_events: invoiceEventsByJob.get(job.id) ?? [],
        inventory: materialInventory,
        tasks: tasksByJob.get(job.id) ?? [],
        invoice,
        invoice_items: invoice
          ? (invoiceItemsByInvoice.get(invoice.id) ?? [])
          : [],
        payments: paymentsByJob.get(job.id) ?? [],
        receipt: (receiptsByJob.get(job.id) ?? []).at(-1),
        gate_pass: (passesByJob.get(job.id) ?? []).at(-1),
        photos: photosByJob.get(job.id) ?? [],
        followups: followupsByJob.get(job.id) ?? [],
        qc_checks: qcByJob.get(job.id) ?? [],
        status_history: historyByJob.get(job.id) ?? [],
        checklist_cycles: cyclesByJob.get(job.id) ?? [],
        checklist_items: checklistByJob.get(job.id) ?? [],
        material_movements: [
          ...(movementsByJob.get(job.id) ?? []),
          ...globalMovements,
        ],
        estimate_history: estimateHistoryByJob.get(job.id) ?? [],
        invoice_history: invoiceHistoryByJob.get(job.id) ?? [],
        payment_history: paymentHistoryByJob.get(job.id) ?? [],
        receipt_history: receiptHistoryByJob.get(job.id) ?? [],
        gate_pass_history: passHistoryByJob.get(job.id) ?? [],
        photo_history: photoHistoryByJob.get(job.id) ?? [],
      };
    })
~~~

## src/db.ts todayKey

src/db.ts:614

~~~typescript
todayKey = () => new Date().toISOString().slice(0, 10)
~~~

## src/db.ts isPreloadedServiceManager

src/db.ts:765

~~~typescript
function isPreloadedServiceManager(user: Pick<User, "email">) {
  return user.email === "general.service.manager@example.com" || user.email === "ppf.paint.manager@example.com";
}
~~~

## src/db.ts validateLargeDemoDataset

src/db.ts:1085

~~~typescript
function validateLargeDemoDataset(db: Database) {
  const expected: [string, number][] = [
    ["customers", 120],
    ["vehicles", 132],
    ["job_cards", 144],
    ["photos", 288],
  ];
  expected.forEach(([table, count]) => {
    if (scalar<number>(db, `select count(*) from ${table}`) !== count)
      throw new Error(`Large demo validation failed for ${table}.`);
  });
  const uniquenessChecks = [
    "select count(*)-count(distinct mobile) from customers",
    "select count(*)-count(distinct number) from vehicles",
    "select count(*)-count(distinct job_no) from job_cards",
    "select count(*)-count(distinct invoice_no) from invoices",
  ];
  if (uniquenessChecks.some((sql) => scalar<number>(db, sql) !== 0))
    throw new Error("Large demo identifiers are not unique.");
  const orphanCount = scalar<number>(
    db,
    `select
    (select count(*) from vehicles v left join customers c on c.id=v.customer_id where c.id is null) +
    (select count(*) from visits v left join customers c on c.id=v.customer_id left join vehicles x on x.id=v.vehicle_id where c.id is null or x.id is null) +
    (select count(*) from job_cards j left join visits v on v.id=j.visit_id where v.id is null) +
    (select count(*) from photos p left join job_cards j on j.id=p.job_card_id where j.id is null)`,
  );
  if (orphanCount !== 0)
    throw new Error("Large demo contains invalid relationships.");
  const incompleteClosures = scalar<number>(
    db,
    `select count(*) from job_cards j where j.main_status='CLOSED' and (
    j.closed_at='' or not exists(select 1 from invoices i where i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from payments p join invoices i on i.id=p.invoice_id where p.job_card_id=j.id and p.voided_at is null and i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from receipts r join invoices i on i.id=r.invoice_id where r.job_card_id=j.id and i.job_card_id=j.id and i.voided_at is null) or
    not exists(select 1 from gate_passes g join invoices i on i.id=g.invoice_id where g.job_card_id=j.id and i.job_card_id=j.id and i.voided_at is null) or
    trim(coalesce(j.delivery_by,''))='' or trim(coalesce(j.acknowledgement,''))='')`,
  );
  if (
    incompleteClosures !== 0 ||
    scalar<number>(db, "select count(distinct main_status) from job_cards") !==
      5 ||
    scalar<number>(db, "select count(distinct sub_status) from job_cards") !==
      16
  ) {
    throw new Error("Large demo lifecycle records are incomplete.");
  }
}
~~~

## src/db.ts validateUser

src/db.ts:1217

~~~typescript
function validateUser(
  db: Database,
  payload: Pick<User, "email" | "name" | "role" | "password">,
  existingId = 0,
) {
  if (!payload.name.trim()) throw new Error("User name is required.");
  if (!/^\S+@\S+\.\S+$/.test(payload.email.trim()))
    throw new Error("Enter a valid user email.");
  if (!roles.includes(payload.role))
    throw new Error("Select a valid user role.");
  if (!payload.password || payload.password.length < 6)
    throw new Error("User password must contain at least 6 characters.");
  const duplicate = maybe<{ id: number }>(
    db,
    "select id from users where lower(email)=lower(?) and archived_at is null and id<>?",
    [payload.email.trim(), existingId],
  );
  if (duplicate) throw new Error("A user with this email already exists.");
}
~~~

## src/db.ts quota

src/db.ts:1400

~~~typescript
quota = (serviceType: BookingServiceType) => {
    const limit = serviceType === "Service Work"
      ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY
      : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
    const count = scalar<number>(
      db,
      "select count(*) from bookings where booking_date=? and service_type=? and status in ('Booked','Confirmed','Rescheduled')",
      [bookingDate, serviceType],
    );
    return { limit, count, remaining: Math.max(0, limit - count) };
  }
~~~

## src/db.ts assertBookingCapacity

src/db.ts:1440

~~~typescript
function assertBookingCapacity(
  db: Database,
  actorId: number,
  bookingDate: string,
  serviceType: BookingServiceType,
  overrideReason: string | undefined,
  excludingBookingId?: number,
) {
  const configured = all<BookingCapacityLimit>(db, "select * from booking_capacity_limits where booking_date=?", [bookingDate])[0];
  const capacity = serviceType === "Service Work"
    ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY
    : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
  const count = scalar<number>(
    db,
    `select count(*) from bookings where booking_date=? and service_type=? and status in ('Booked','Confirmed','Rescheduled')${excludingBookingId ? " and id<>?" : ""}`,
    excludingBookingId ? [bookingDate, serviceType, excludingBookingId] : [bookingDate, serviceType],
  );
  if (count < capacity) return false;
  const actor = one<User>(db, "select * from users where id=?", [actorId]);
  if (actor.role !== "admin")
    throw new Error(`${serviceType} is fully booked (${capacity} advance bookings).`);
  if (!overrideReason?.trim())
    throw new Error("An Admin override reason is required for a full booking service type.");
  return true;
}
~~~

## src/db.ts recordBookingCapacityOverride

src/db.ts:1466

~~~typescript
function recordBookingCapacityOverride(
  db: Database,
  bookingId: number,
  bookingDate: string,
  actorId: number,
  reason: string,
  timestamp: string,
) {
  insert(
    db,
    "insert into booking_capacity_overrides(booking_id,booking_date,reason,approved_by,approved_at) values(?,?,?,?,?)",
    [bookingId, bookingDate, reason.trim(), actorId, timestamp],
  );
}
~~~

## src/db.ts assertBookingInput

src/db.ts:1481

~~~typescript
function assertBookingInput(input: BookingInput, earliestDate?: string) {
  if (
    ![
      input.customerName,
      input.mobile,
      input.vehicleNo,
      input.make,
      input.model,
      input.requestedWork,
    ].every((value) => value.trim())
  ) {
    throw new Error(
      "Customer, vehicle, and requested work are required for a booking.",
    );
  }
  const parsedDate = new Date(`${input.bookingDate}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.bookingDate) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== input.bookingDate
  ) {
    throw new Error("Enter a valid booking date.");
  }
  if (earliestDate && input.bookingDate < earliestDate)
    throw new Error("A booking date cannot be in the past.");
  if (!BOOKING_WINDOWS.includes(input.arrivalWindow ?? ""))
    throw new Error("Choose a valid arrival window.");
  if (!["Service Work", "General Checkup / Follow-up"].includes(input.serviceType))
    throw new Error("Choose a valid booking service type.");
}
~~~

## src/db.ts bookingEvent

src/db.ts:1512

~~~typescript
function bookingEvent(
  db: Database,
  booking: Booking,
  kind: BookingStatus,
  actorId: number,
  timestamp: string,
  note = "",
  previousBookingDate?: string,
) {
  insert(
    db,
    "insert into booking_events(booking_id,kind,actor_id,at,note,previous_booking_date,booking_date) values(?,?,?,?,?,?,?)",
    [
      booking.id,
      kind,
      actorId,
      timestamp,
      note,
      previousBookingDate ?? null,
      booking.booking_date,
    ],
  );
}
~~~

## src/db.ts operationalBooking

src/db.ts:1536

~~~typescript
function operationalBooking(db: Database, bookingId: number) {
  const booking = one<Booking>(db, "select * from bookings where id=?", [
    bookingId,
  ]);
  if (TERMINAL_BOOKING_STATUSES.includes(booking.status))
    throw new Error(`A ${booking.status} booking cannot be changed.`);
  return booking;
}
~~~

## src/db.ts assertAdminAccess

src/db.ts:2102

~~~typescript
function assertAdminAccess(db: Database, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (actor.role !== "admin")
    throw new Error("Only Owner/Admin may manage the Service Task Catalog.");
}
~~~

## src/db.ts assertTaskListMutationAccess

src/db.ts:2112

~~~typescript
function assertTaskListMutationAccess(
  db: Database,
  jobId: number,
  actorId: number,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (job.main_status !== "NEW" && job.main_status !== "IN_PROGRESS")
    throw new Error(
      "Task List can only be changed while a job is NEW or IN_PROGRESS.",
    );
}
~~~

## src/db.ts assertCatalogAssignments

src/db.ts:2192

~~~typescript
function assertCatalogAssignments(db: Database, input: Pick<ServiceCatalogItem, "service_department_id" | "brand_id" | "car_segment_id">) {
  if (!input.service_department_id) throw new Error("Service department is required.");
  if (!scalar<number>(db, "select count(*) from service_departments where id=? and status='ACTIVE'", [input.service_department_id])) throw new Error("Choose an active service department.");
  if (input.brand_id != null && !scalar<number>(db, "select count(*) from service_brands where id=? and status='ACTIVE'", [input.brand_id])) throw new Error("Choose an active brand name.");
  if (input.car_segment_id != null && !scalar<number>(db, "select count(*) from car_segments where id=? and status='ACTIVE'", [input.car_segment_id])) throw new Error("Choose an active car segment.");
}
~~~

## src/db.ts normalizeAndValidateGst

src/db.ts:2403

~~~typescript
function normalizeAndValidateGst(
  gst_type: GstType | null | undefined,
  gst_rate: number | null | undefined,
  fallbackRate: number,
) {
  if (
    gst_type !== undefined &&
    gst_type !== null &&
    !GST_TYPES.includes(gst_type)
  )
    throw new Error("GST type must be CGST+SGST, IGST, or No GST.");
  const normalized = normalizeGstLine(gst_type, gst_rate, fallbackRate);
  if (
    normalized.gst_type !== "No GST" &&
    !GST_RATES.includes(normalized.gst_rate as (typeof GST_RATES)[number])
  )
    throw new Error("GST rate must be 5%, 9%, 12%, 18%, or 28%.");
  return normalized;
}
~~~

## src/db.ts assertValidMainStatusTransition

src/db.ts:2494

~~~typescript
function assertValidMainStatusTransition(from: MainStatus, to: MainStatus) {
  if (from === to) return;
  if (!MAIN_STATUS_TRANSITIONS[from].includes(to)) {
    throw new Error(`Cannot move a job card from ${from} to ${to}.`);
  }
}
~~~

## src/db.ts assertLocalPurchaseInput

src/db.ts:2961

~~~typescript
function assertLocalPurchaseInput(db: Database, payload: LocalPurchaseInput) {
  if (!Number.isInteger(payload.job_card_id) || payload.job_card_id <= 0)
    throw new Error("A selected job is required.");
  one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [payload.job_card_id],
  );
  if (!payload.item_description.trim())
    throw new Error("A local purchase item description is required.");
  if (!payload.unit.trim())
    throw new Error("A local purchase unit is required.");
  if (!payload.vendor.trim()) throw new Error("A vendor or shop is required.");
  if (!payload.bill_reference.trim())
    throw new Error("A bill or reference is required.");
  if (!Number.isFinite(payload.quantity) || payload.quantity <= 0)
    throw new Error("Local purchase quantity must be greater than zero.");
  if (!Number.isFinite(payload.unit_cost) || payload.unit_cost < 0)
    throw new Error("Local purchase unit cost cannot be negative.");
}
~~~

## src/db.ts assertPurchaseActor

src/db.ts:3119

~~~typescript
function assertPurchaseActor(db: Database, actorId: number, adminOnly = false) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (
    adminOnly
      ? actor.role !== "admin"
      : actor.role !== "admin" && actor.role !== "store"
  ) {
    throw new Error(
      adminOnly
        ? "Only Admin can manage suppliers or revise submitted purchases."
        : "Only Store or Admin can manage inward purchases.",
    );
  }
  return actor;
}
~~~

## src/db.ts assertSupplierInput

src/db.ts:3139

~~~typescript
function assertSupplierInput(input: SupplierInput) {
  if (!input.name?.trim()) throw new Error("Supplier name is required.");
  if (input.status && !["Active", "On hold", "Archived"].includes(input.status))
    throw new Error("Invalid supplier status.");
}
~~~

## src/db.ts totalsForPurchaseLine

src/db.ts:3202

~~~typescript
function totalsForPurchaseLine(line: InwardPurchaseLineInput) {
  const qty = Number(line.received_qty),
    unitCost = Number(line.unit_cost),
    discount = Number(line.discount ?? 0),
    gstRate = Number(line.gst_rate ?? 0);
  const subtotal = qty * unitCost - discount;
  return {
    qty,
    unitCost,
    discount,
    gstRate,
    subtotal,
    gstAmount: (subtotal * gstRate) / 100,
    total: subtotal * (1 + gstRate / 100),
  };
}
~~~

## src/db.ts assertPurchaseLine

src/db.ts:3219

~~~typescript
function assertPurchaseLine(db: Database, line: InwardPurchaseLineInput) {
  one<InventoryItem>(
    db,
    "select * from inventory where id=? and archived_at is null",
    [line.item_id],
  );
  const total = totalsForPurchaseLine(line);
  if (!Number.isFinite(total.qty) || total.qty <= 0)
    throw new Error("Received quantity must be greater than zero.");
  if (!Number.isFinite(total.unitCost) || total.unitCost < 0)
    throw new Error("Unit cost before GST cannot be negative.");
  if (
    !Number.isFinite(total.discount) ||
    total.discount < 0 ||
    total.discount > total.qty * total.unitCost
  )
    throw new Error("Discount must be between zero and the line value.");
  if (
    !Number.isFinite(total.gstRate) ||
    total.gstRate < 0 ||
    total.gstRate > 100
  )
    throw new Error("GST must be between 0 and 100.");
  return total;
}
~~~

## src/db.ts assertAttachment

src/db.ts:3245

~~~typescript
function assertAttachment(attachment: InwardPurchaseAttachmentInput) {
  if (!attachment.original_name?.trim() || !attachment.document_url)
    throw new Error("An invoice scan is required.");
  if (!["application/pdf", "image/jpeg"].includes(attachment.mime_type))
    throw new Error("Invoice scans must be PDF or JPG files.");
  if (
    !Number.isFinite(attachment.byte_size) ||
    attachment.byte_size <= 0 ||
    attachment.byte_size > 10 * 1024 * 1024
  )
    throw new Error("Invoice scans must be no more than 10 MB.");
}
~~~

## src/db.ts replacePurchaseLines

src/db.ts:3258

~~~typescript
function replacePurchaseLines(
  db: Database,
  purchaseId: number,
  lines: readonly InwardPurchaseLineInput[],
) {
  db.run("delete from inward_purchase_lines where purchase_id=?", [purchaseId]);
  let subtotal = 0,
    discountTotal = 0,
    gstTotal = 0,
    total = 0;
  for (const line of lines) {
    const values = assertPurchaseLine(db, line);
    insert(
      db,
      "insert into inward_purchase_lines(purchase_id,item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)",
      [
        purchaseId,
        line.item_id,
        values.qty,
        values.unitCost,
        values.discount,
        values.gstRate,
        values.subtotal,
        values.gstAmount,
        values.total,
      ],
    );
    subtotal += values.qty * values.unitCost;
    discountTotal += values.discount;
    gstTotal += values.gstAmount;
    total += values.total;
  }
  db.run(
    "update inward_purchases set subtotal=?,discount_total=?,gst_total=?,total=?,updated_at=datetime('now') where id=?",
    [subtotal, discountTotal, gstTotal, total, purchaseId],
  );
}
~~~

## src/db.ts addPurchaseAttachments

src/db.ts:3296

~~~typescript
function addPurchaseAttachments(
  db: Database,
  purchaseId: number,
  actorId: number,
  attachments: readonly InwardPurchaseAttachmentInput[],
) {
  for (const attachment of attachments) {
    assertAttachment(attachment);
    insert(
      db,
      "insert into inward_purchase_attachments(purchase_id,original_name,mime_type,byte_size,storage_key,document_url,uploaded_by,uploaded_at) values(?,?,?,?,?,?,?,datetime('now'))",
      [
        purchaseId,
        attachment.original_name.trim(),
        attachment.mime_type,
        attachment.byte_size,
        `private/inward/${purchaseId}/${Date.now()}-${attachment.original_name.trim()}`,
        attachment.document_url,
        actorId,
      ],
    );
  }
}
~~~

## src/db.ts submitPurchaseValidation

src/db.ts:3380

~~~typescript
function submitPurchaseValidation(db: Database, purchase: InwardPurchase) {
  if (!purchase.supplier_id)
    throw new Error("Supplier is required before submission.");
  const supplier = one<Supplier>(db, "select * from suppliers where id=?", [
    purchase.supplier_id,
  ]);
  if (supplier.status !== "Active")
    throw new Error("Select an active supplier before submission.");
  if (!purchase.supplier_invoice_no.trim())
    throw new Error("Supplier invoice number is required before submission.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(purchase.invoice_date))
    throw new Error("A valid invoice date is required before submission.");
  const duplicate = maybe<InwardPurchase>(
    db,
    "select * from inward_purchases where supplier_id=? and supplier_invoice_no=? and status in ('Submitted','Received') and id<>?",
    [purchase.supplier_id, purchase.supplier_invoice_no.trim(), purchase.id],
  );
  if (duplicate)
    throw new Error("This supplier invoice number has already been submitted.");
  const lines = all<InwardPurchaseLine>(
    db,
    "select * from inward_purchase_lines where purchase_id=?",
    [purchase.id],
  );
  if (!lines.length)
    throw new Error(
      "At least one inventory line is required before submission.",
    );
  lines.forEach((line) => assertPurchaseLine(db, line));
  const attachments = all<InwardPurchaseAttachment>(
    db,
    "select * from inward_purchase_attachments where purchase_id=?",
    [purchase.id],
  );
  if (!attachments.length)
    throw new Error(
      "At least one PDF or JPG invoice scan is required before submission.",
    );
  attachments.forEach((attachment) => assertAttachment(attachment));
  return lines;
}
~~~

## src/db.ts poSubmissionValidation

src/db.ts:3423

~~~typescript
function poSubmissionValidation(db: Database, purchase: InwardPurchase) {
  if (!purchase.supplier_id)
    throw new Error("Supplier is required before sending for PO approval.");
  const supplier = one<Supplier>(db, "select * from suppliers where id=?", [
    purchase.supplier_id,
  ]);
  if (supplier.status !== "Active")
    throw new Error(
      "Select an active supplier before sending for PO approval.",
    );
  const lines = all<InwardPurchaseLine>(
    db,
    "select * from inward_purchase_lines where purchase_id=?",
    [purchase.id],
  );
  if (!lines.length)
    throw new Error(
      "At least one inventory line is required before sending for PO approval.",
    );
  lines.forEach((line) => assertPurchaseLine(db, line));
  return lines;
}
~~~

## src/db.ts nextPurchaseRequestNumber

src/db.ts:3937

~~~typescript
function nextPurchaseRequestNumber(db: Database) {
  return nextPurchaseRequestNumberForOrders(
    all<Pick<PurchaseOrder, "po_number">>(
      db,
      "select po_number from purchase_orders where po_number like 'PO-WOS-%'",
    ),
  );
}
~~~

## src/db.ts assertPurchaseRequestInput

src/db.ts:3946

~~~typescript
function assertPurchaseRequestInput(db: Database, input: PurchaseRequestInput) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.order_date))
    throw new Error("A valid order date is required.");
  if (!input.lines?.length)
    throw new Error("A Purchase Request needs at least one item line.");
  for (const line of input.lines) {
    if (!Number.isFinite(line.ordered_qty) || line.ordered_qty <= 0)
      throw new Error("Requested quantity must be greater than zero.");
    if ("item_id" in line) {
      if (!Number.isInteger(line.item_id) || line.item_id <= 0)
        throw new Error("An existing inventory SKU is required.");
      one<InventoryItem>(db, "select * from inventory where id=?", [line.item_id]);
    } else if (!line.item_name.trim() || !line.unit.trim()) {
      throw new Error("A new item request needs an item name.");
    }
  }
}
~~~

## src/db.ts replacePurchaseRequestLines

src/db.ts:3964

~~~typescript
function replacePurchaseRequestLines(
  db: Database,
  purchaseOrderId: number,
  lines: readonly PurchaseRequestLineInput[],
) {
  db.run("delete from purchase_order_lines where purchase_order_id=?", [
    purchaseOrderId,
  ]);
  for (const line of lines) {
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,0,0,0,0,0,0)",
      [
        purchaseOrderId,
        "item_id" in line ? line.item_id : 0,
        "item_name" in line ? line.item_name.trim() : "",
        "unit" in line ? line.unit.trim() : "",
        line.ordered_qty,
      ],
    );
  }
  db.run(
    "update purchase_orders set subtotal=0,discount_total=0,gst_total=0,total=0,updated_at=datetime('now') where id=?",
    [purchaseOrderId],
  );
}
~~~

## src/db.ts assertMutablePurchaseRequestAccess

src/db.ts:3991

~~~typescript
function assertMutablePurchaseRequestAccess(
  db: Database,
  id: number,
  actorId: number,
) {
  const actor = assertPurchaseActor(db, actorId);
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [id],
  );
  if (order.status !== "PO Request")
    throw new Error("Only unreviewed Purchase Requests can be changed.");
  if (actor.role !== "store" || order.created_by !== actor.id)
    throw new Error("Only the requesting Store user can change this Purchase Request.");
}
~~~

## src/db.ts writeLine

src/db.ts:4138

~~~typescript
writeLine = (targetOrderId: number, entry: typeof resolved[number], sourceLineId: number | null) => {
      const values = totalsForPurchaseLine({ item_id: entry.itemId, received_qty: entry.requestLine.ordered_qty, unit_cost: entry.approval.unit_cost, discount: 0, gst_rate: 0 });
      if (sourceLineId === null) {
        db.run("update purchase_order_lines set item_id=?,unit_cost=?,discount=0,gst_rate=0,subtotal=?,gst_amount=?,total=? where id=?", [entry.itemId, values.unitCost, values.subtotal, values.gstAmount, values.total, entry.requestLine.id]);
      } else {
        insert(db, "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,source_purchase_order_line_id) values(?,?,?,?,?,?,?,?,?,?,?,?)", [targetOrderId, entry.itemId, entry.requestLine.item_name, entry.requestLine.unit, entry.requestLine.ordered_qty, values.unitCost, 0, 0, values.subtotal, values.gstAmount, values.total, sourceLineId]);
      }
      return values.total;
    }
~~~

## src/db.ts assertPurchaseOrderLine

src/db.ts:4372

~~~typescript
function assertPurchaseOrderLine(db: Database, line: PurchaseOrderLineInput) {
  return assertPurchaseLine(db, { ...line, received_qty: line.ordered_qty });
}
~~~

## src/db.ts replacePurchaseOrderLines

src/db.ts:4375

~~~typescript
function replacePurchaseOrderLines(
  db: Database,
  purchaseOrderId: number,
  lines: readonly PurchaseOrderLineInput[],
) {
  if (!lines.length)
    throw new Error("A purchase order needs at least one item line.");
  db.run("delete from purchase_order_lines where purchase_order_id=?", [
    purchaseOrderId,
  ]);
  let subtotal = 0,
    discountTotal = 0,
    gstTotal = 0,
    total = 0;
  for (const line of lines) {
    const values = assertPurchaseOrderLine(db, line);
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)",
      [
        purchaseOrderId,
        line.item_id,
        values.qty,
        values.unitCost,
        values.discount,
        values.gstRate,
        values.subtotal,
        values.gstAmount,
        values.total,
      ],
    );
    subtotal += values.qty * values.unitCost;
    discountTotal += values.discount;
    gstTotal += values.gstAmount;
    total += values.total;
  }
  db.run(
    "update purchase_orders set subtotal=?,discount_total=?,gst_total=?,total=?,updated_at=datetime('now') where id=?",
    [subtotal, discountTotal, gstTotal, total, purchaseOrderId],
  );
}
~~~

## src/db.ts assertPurchaseOrderInput

src/db.ts:4416

~~~typescript
function assertPurchaseOrderInput(db: Database, input: PurchaseOrderInput) {
  const supplier = one<Supplier>(db, "select * from suppliers where id=?", [
    input.supplier_id,
  ]);
  if (supplier.status !== "Active")
    throw new Error("Select an active supplier.");
  if (!input.po_number?.trim()) throw new Error("PO number is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.order_date))
    throw new Error("A valid order date is required.");
  if (!input.lines?.length)
    throw new Error("A purchase order needs at least one item line.");
}
~~~

## src/db.ts reconcilePurchaseOrder

src/db.ts:4513

~~~typescript
function reconcilePurchaseOrder(db: Database, purchaseOrderId: number) {
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [purchaseOrderId],
  );
  if (["Draft", "Cancelled", "Closed"].includes(order.status)) return;
  const lines = all<PurchaseOrderLine>(
    db,
    "select * from purchase_order_lines where purchase_order_id=?",
    [purchaseOrderId],
  );
  const fullyReceived = lines.every(
    (line) =>
      scalar<number>(
        db,
        "select coalesce(sum(qty),0) from stock_inwards where purchase_order_line_id=?",
        [line.id],
      ) >= line.ordered_qty,
  );
  const receivedAny = lines.some(
    (line) =>
      scalar<number>(
        db,
        "select coalesce(sum(qty),0) from stock_inwards where purchase_order_line_id=?",
        [line.id],
      ) > 0,
  );
  db.run(
    "update purchase_orders set status=?,updated_at=datetime('now') where id=?",
    [
      fullyReceived
        ? "Ready to Close"
        : receivedAny
          ? "Partially Received"
          : "Sent",
      purchaseOrderId,
    ],
  );
}
~~~

## src/db.ts materialApprovalForJob

src/db.ts:4875

~~~typescript
function materialApprovalForJob(db: Database, jobId: number) {
  return maybe<MaterialApproval>(
    db,
    "select * from material_approvals where job_card_id=?",
    [jobId],
  );
}
~~~

## src/db.ts outstandingMaterialRows

src/db.ts:4890

~~~typescript
function outstandingMaterialRows(db: Database, jobId: number) {
  return all<MaterialRequest>(
    db,
    "select * from material_requests where job_card_id=? and archived_at is null and invoiced_in is null and status in ('Requested','Re-requested')",
    [jobId],
  );
}
~~~

## src/db.ts approvalEvent

src/db.ts:4898

~~~typescript
function approvalEvent(
  db: Database,
  approval: MaterialApproval,
  action: MaterialApprovalEvent["action"],
  actorId: number,
  note: string,
) {
  insert(
    db,
    "insert into material_approval_events(approval_id,job_card_id,action,actor_id,at,note,revision) values(?,?,?,?,?,?,?)",
    [
      approval.id,
      approval.job_card_id,
      action,
      actorId,
      new Date().toISOString(),
      note,
      approval.revision,
    ],
  );
}
~~~

## src/db.ts assertMaterialManager

src/db.ts:5096

~~~typescript
function assertMaterialManager(db: Database, jobId: number, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  const approval = materialApprovalForJob(db, jobId);
  const rejectedAdvisorCorrection =
    approval?.status === "Rejected" &&
    job.main_status === "HOLD" &&
    actor.role === "service" &&
    actor.id === job.advisor_id;
  if (approval?.status === "Pending")
    throw new Error("Material activity is frozen while approval is pending.");
  if (!canManageMaterialRows(actor, job) && !rejectedAdvisorCorrection) {
    throw new Error(
      job.main_status === "IN_PROGRESS"
        ? "Only the Owner or the linked Service Advisor can change material rows."
        : "Material rows can only change while the job card is IN_PROGRESS.",
    );
  }
}
~~~

## src/db.ts materialRowFor

src/db.ts:5124

~~~typescript
function materialRowFor(
  db: Database,
  rowId: number,
  actorId: number,
  action: MaterialRowAction,
) {
  const row = one<MaterialRequest>(
    db,
    "select * from material_requests where id=? and archived_at is null",
    [rowId],
  );
  assertMaterialManager(db, row.job_card_id, actorId);
  if (!materialRowActions(row).includes(action))
    throw new Error(
      `A ${materialRowStatus(row)} material row cannot be ${MATERIAL_ACTION_VERB[action]}.`,
    );
  return row;
}
~~~

## src/db.ts assertMaterialInput

src/db.ts:5143

~~~typescript
function assertMaterialInput(db: Database, itemId: number, qty: number) {
  if (!(qty > 0))
    throw new Error("Material quantity must be greater than zero.");
  one<InventoryItem>(
    db,
    "select * from inventory where id=? and archived_at is null",
    [itemId],
  );
}
~~~

## src/db.ts untickMaterialsIssued

src/db.ts:5202

~~~typescript
function untickMaterialsIssued(db: Database, jobId: number) {
  const item = maybe<ChecklistItem>(
    db,
    "select ci.* from checklist_items ci where ci.job_card_id=? and ci.label='Material Issued' and ci.checked_at is not null and ci.na_at is null and ci.checklist_cycle_id=(select id from checklist_cycles where job_card_id=? order by id desc limit 1)",
    [jobId, jobId],
  );
  if (!item) return;
  db.run(
    "update checklist_items set checked_by=null, checked_at=null, completed_at=null where id=?",
    [item.id],
  );
  db.run("update checklist_cycles set completed_at=null where id=?", [
    item.checklist_cycle_id,
  ]);
  syncSubStatusFromChecklist(db, jobId);
}
~~~

## src/db.ts afterMaterialRequest

src/db.ts:5219

~~~typescript
function afterMaterialRequest(
  db: Database,
  row: MaterialRequest,
  actorId: number,
) {
  const onHand = materialStockOnHand(db, row.item_id);
  untickMaterialsIssued(db, row.job_card_id);
  reconcileArtifactChecklist(db, row.job_card_id, actorId);
  return { onHand, warning: overStockWarning(row.requested_qty, onHand) };
}
~~~

## src/db.ts ledger

src/db.ts:5267

~~~typescript
function ledger(
  db: Database,
  jobId: number,
  rowId: number,
  itemId: number,
  qty: number,
  type: "issue" | "adjustment",
  actorId: number,
  note: string,
) {
  db.run(
    "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(?,?,?,?,?,?,?,?)",
    [jobId, rowId, itemId, qty, type, actorId, new Date().toISOString(), note],
  );
}
~~~

## src/db.ts actorAndJob

src/db.ts:5283

~~~typescript
function actorAndJob(db: Database, rowId: number, actorId: number) {
  const row = one<MaterialRequest>(
    db,
    "select * from material_requests where id=? and archived_at is null",
    [rowId],
  );
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [row.job_card_id],
  );
  return { row, actor, job };
}
~~~

## src/db.ts assertBillingMutationAccess

src/db.ts:5681

~~~typescript
function assertBillingMutationAccess(db: Database, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (!canMutateBilling(actor))
    throw new Error(
      "Only Owner/Admin and Accounts may change billing or delivery records.",
    );
}
~~~

## src/db.ts assertAdminBillingAccess

src/db.ts:5693

~~~typescript
function assertAdminBillingAccess(db: Database, actorId: number) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (actor.role !== "admin")
    throw new Error(
      "Only Owner/Admin may void or manually edit delivery records.",
    );
}
~~~

## src/db.ts assertInvoiceFinancialsEditable

src/db.ts:5705

~~~typescript
function assertInvoiceFinancialsEditable(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  if (invoice.status !== "Pending")
    throw new Error("Only a Pending invoice can be edited.");
  if (
    scalar<number>(
      db,
      "select count(*) from payments where invoice_id=? and voided_at is null",
      [invoiceId],
    ) > 0
  ) {
    throw new Error(
      "Invoice financial fields are locked after the first active payment.",
    );
  }
}
~~~

## src/db.ts validateInvoiceItem

src/db.ts:5726

~~~typescript
function validateInvoiceItem(input: InvoiceItemInput) {
  if (!input.description.trim())
    throw new Error("Invoice item description is required.");
  if (!Number.isFinite(input.qty) || input.qty <= 0)
    throw new Error("Invoice item quantity must be greater than zero.");
  if (!Number.isFinite(input.rate) || input.rate < 0)
    throw new Error("Invoice item rate cannot be negative.");
  normalizeAndValidateGst(
    input.gst_type,
    input.gst_rate,
    DEFAULT_GST_BY_KIND[input.kind],
  );
}
~~~

## src/db.ts activeInvoiceItems

src/db.ts:5740

~~~typescript
function activeInvoiceItems(db: Database, invoiceId: number) {
  return all<InvoiceItem>(
    db,
    "select * from invoice_items where invoice_id=? and archived_at is null order by id",
    [invoiceId],
  );
}
~~~

## src/db.ts recalculateInvoice

src/db.ts:5748

~~~typescript
function recalculateInvoice(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  const totals = invoiceTotals(
    activeInvoiceItems(db, invoiceId).map((item) => ({
      qty: item.qty,
      rate: item.rate,
      ...normalizeGstLine(item.gst_type, item.gst_rate, invoice.gst_rate),
    })),
    invoice.discount,
  );
  db.run(
    "update invoices set subtotal=?,gst_amount=?,total=?,updated_at=datetime('now') where id=?",
    [totals.subtotal, totals.gst, totals.total, invoiceId],
  );
}
~~~

## src/db.ts invoiceEvent

src/db.ts:5768

~~~typescript
function invoiceEvent(
  db: Database,
  invoice: Pick<Invoice, "id" | "job_card_id">,
  kind: "create" | "edit" | "void",
  actorId: number,
  note: string,
  oldTotal: number | null,
  newTotal: number | null,
  detail: string,
) {
  db.run(
    "insert into invoice_events(job_card_id,invoice_id,kind,by_user,at,note,old_total,new_total,detail) values(?,?,?,?,?,?,?,?,?)",
    [
      invoice.job_card_id,
      invoice.id,
      kind,
      actorId,
      new Date().toISOString(),
      note,
      oldTotal,
      newTotal,
      detail,
    ],
  );
}
~~~

## src/db.ts pickUpMaterialRow

src/db.ts:5795

~~~typescript
function pickUpMaterialRow(
  db: Database,
  jobId: number,
  rowId: number,
  invoiceId: number,
) {
  const row = maybe<MaterialRequest>(
    db,
    "select * from material_requests where id=? and job_card_id=? and archived_at is null",
    [rowId, jobId],
  );
  if (!row) throw new Error("Material row does not belong to this job card.");
  if (materialRowStatus(row) !== "Issued")
    throw new Error("Only Issued material rows can be invoiced.");
  if (row.invoiced_in && row.invoiced_in !== invoiceId)
    throw new Error("This material row is already on another invoice.");
  db.run(
    "update material_requests set invoiced_in=?,updated_at=datetime('now') where id=?",
    [invoiceId, rowId],
  );
}
~~~

## src/db.ts changeSummary

src/db.ts:6127

~~~typescript
function changeSummary(
  old: InvoiceItem[],
  next: Array<InvoiceItemInput & { id?: number }>,
  oldDiscount: number,
  newDiscount: number,
  fallbackGst: number,
) {
  const parts: string[] = [];
  const oldById = new Map(old.map((item) => [item.id, item]));
  for (const item of next) {
    const saved = item.id ? oldById.get(item.id) : undefined;
    if (!saved)
      parts.push(
        `added ${item.description.trim()} x ${item.qty}${item.material_row_id ? " (late material)" : ""}`,
      );
    else if (
      saved.qty !== item.qty ||
      saved.rate !== item.rate ||
      (item.gst_rate ?? saved.gst_rate ?? fallbackGst) !==
        (saved.gst_rate ?? fallbackGst) ||
      (item.gst_type ?? "CGST+SGST") !== (saved.gst_type ?? "CGST+SGST") ||
      saved.description !== item.description.trim() ||
      saved.kind !== item.kind
    )
      parts.push(
        `changed ${saved.description}: ${saved.qty} x ${saved.rate} @${saved.gst_type ?? "CGST+SGST"} ${saved.gst_rate ?? fallbackGst}% -> ${item.qty} x ${item.rate} @${item.gst_type ?? saved.gst_type ?? "CGST+SGST"} ${item.gst_rate ?? saved.gst_rate ?? fallbackGst}%`,
      );
  }
  const kept = new Set(next.flatMap((item) => (item.id ? [item.id] : [])));
  for (const item of old)
    if (!kept.has(item.id)) parts.push(`removed ${item.description}`);
  if (oldDiscount !== newDiscount)
    parts.push(`discount ${oldDiscount} -> ${newDiscount}`);
  return parts.join("; ");
}
~~~

## src/db.ts validatePaymentInput

src/db.ts:6318

~~~typescript
function validatePaymentInput(input: PaymentInput) {
  if (!PAYMENT_MODES.includes(input.mode))
    throw new Error(
      "Payment mode must be UPI, Cash, Card, Bank transfer, or Other.",
    );
  if (input.mode === "Other" && !input.otherDetail.trim())
    throw new Error("Other payment detail is required.");
}
~~~

## src/db.ts activePaidAmount

src/db.ts:6327

~~~typescript
function activePaidAmount(
  db: Database,
  invoiceId: number,
  excludingPaymentId = 0,
) {
  return scalar<number>(
    db,
    "select coalesce(sum(amount),0) from payments where invoice_id=? and voided_at is null and id<>?",
    [invoiceId, excludingPaymentId],
  );
}
~~~

## src/db.ts syncInvoicePaymentStatus

src/db.ts:6339

~~~typescript
function syncInvoicePaymentStatus(db: Database, invoiceId: number) {
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  const paid = activePaidAmount(db, invoiceId);
  const status =
    paid <= 0
      ? "Pending"
      : paid + 0.001 < invoice.total
        ? "Partial"
        : "Cleared";
  db.run("update invoices set status=?,updated_at=datetime('now') where id=?", [
    status,
    invoiceId,
  ]);
  reconcileArtifactChecklist(db, invoice.job_card_id);
}
~~~

## src/db.ts nextDocumentNumber

src/db.ts:6360

~~~typescript
function nextDocumentNumber(
  db: Database,
  table: string,
  column: string,
  prefix: string,
  preferred: number,
  width: number,
) {
  const format = (n: number) => `${prefix}${String(n).padStart(width, "0")}`;
  if (
    scalar<number>(db, `select count(*) from ${table} where ${column}=?`, [
      format(preferred),
    ]) === 0
  )
    return format(preferred);
  const highest = all<{ v: string }>(
    db,
    `select ${column} as v from ${table} where ${column} like ?`,
    [`${prefix}%`],
  ).reduce(
    (max, row) =>
      Math.max(max, Number(String(row.v).slice(prefix.length)) || 0),
    preferred,
  );
  return format(highest + 1);
}
~~~

## src/db.ts format

src/db.ts:6368

~~~typescript
format = (n: number) => `${prefix}${String(n).padStart(width, "0")}`
~~~

## src/db.ts ensureGatePassOnClose

src/db.ts:6587

~~~typescript
function ensureGatePassOnClose(db: Database, jobId: number) {
  const invoice = maybe<Invoice>(
    db,
    "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
    [jobId],
  );
  if (
    !invoice ||
    maybe<GatePass>(
      db,
      "select * from gate_passes where invoice_id=? and voided_at is null",
      [invoice.id],
    )
  )
    return;
  insert(
    db,
    "insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values (?,?,?,datetime('now'))",
    [
      jobId,
      invoice.id,
      nextDocumentNumber(
        db,
        "gate_passes",
        "gate_pass_no",
        "GP-",
        3100 + invoice.id,
        5,
      ),
    ],
  );
}
~~~

## src/db.ts assertJobMediaMutationAccess

src/db.ts:6836

~~~typescript
function assertJobMediaMutationAccess(
  db: Database,
  jobId: number,
  actorId: number,
  category: JobMediaCategory,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  if (!canMutateJobLifecycle(actor, job))
    throw new Error(
      "Only the Owner or the linked Service Advisor can change job media.",
    );
  const allowed =
    category === "Before Work"
      ? job.main_status === "NEW"
      : job.main_status === "IN_PROGRESS" || job.main_status === "COMPLETED";
  if (!allowed) {
    const phase =
      category === "Before Work"
        ? "Before photos can only be changed while the job is NEW."
        : "After photos can only be changed while the job is IN_PROGRESS or COMPLETED.";
    throw new Error(phase);
  }
}
~~~

## src/db.ts validatePhotoMetadata

src/db.ts:6869

~~~typescript
function validatePhotoMetadata(label: string, category: string) {
  const cleanLabel = label.trim();
  if (!cleanLabel) throw new Error("Photo label is required.");
  if (category !== "Before Work" && category !== "After Work")
    throw new Error("Choose Before Work or After Work.");
  return { label: cleanLabel, category: category as JobMediaCategory };
}
~~~

## src/db.ts validateCustomer

src/db.ts:7032

~~~typescript
function validateCustomer(
  db: Database,
  payload: Pick<Customer, "name" | "mobile" | "type">,
  existingId = 0,
) {
  if (!payload.name.trim()) throw new Error("Customer name is required.");
  if (!payload.mobile.trim()) throw new Error("Customer mobile is required.");
  if (!payload.type.trim()) throw new Error("Customer type is required.");
  if (
    maybe<{ id: number }>(
      db,
      "select id from customers where mobile=? and archived_at is null and id<>?",
      [payload.mobile.trim(), existingId],
    )
  ) {
    throw new Error("A customer with this mobile already exists.");
  }
}
~~~

## src/db.ts validateVehicle

src/db.ts:7051

~~~typescript
function validateVehicle(
  db: Database,
  payload: Omit<Vehicle, "id">,
  existingId = 0,
) {
  if (!payload.customer_id) throw new Error("Vehicle customer is required.");
  if (!payload.number.trim()) throw new Error("Vehicle number is required.");
  if (!payload.make.trim() || !payload.model.trim())
    throw new Error("Vehicle make and model are required.");
  if (
    maybe<{ id: number }>(
      db,
      "select id from vehicles where upper(number)=upper(?) and archived_at is null and id<>?",
      [payload.number.trim(), existingId],
    )
  ) {
    throw new Error("A vehicle with this number already exists.");
  }
}
~~~

## src/db.ts backfillGoogleReviewReminder

src/db.ts:7523

~~~typescript
function backfillGoogleReviewReminder(db: Database) {
  const reminder = "Remind Customer for Sharing Google Review/Feedback";
  const cycles = all<{ id: number; job_card_id: number; cycle_number: number }>(
    db,
    `select c.id,c.job_card_id,c.cycle_number
       from checklist_cycles c join job_cards j on j.id=c.job_card_id
      where c.stage='COMPLETED' and j.main_status='COMPLETED'
        and not exists(select 1 from checklist_items i where i.checklist_cycle_id=c.id and i.label=?)`,
    [reminder],
  );
  for (const cycle of cycles) {
    const payment = maybe<ChecklistItem>(
      db,
      "select * from checklist_items where checklist_cycle_id=? and label='Payment Received'",
      [cycle.id],
    );
    if (!payment) continue;
    db.run(
      "update checklist_items set sort_order=sort_order+1 where checklist_cycle_id=? and sort_order>=?",
      [cycle.id, payment.sort_order],
    );
    db.run(
      "update checklist_items set item_key=? where id=?",
      [`completed.${payment.sort_order + 1}`, payment.id],
    );
    insert(
      db,
      "insert into checklist_items(checklist_cycle_id,job_card_id,stage,cycle_number,item_key,label,sort_order,checked_by,checked_at,started_at,completed_at,required) values(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        cycle.id,
        cycle.job_card_id,
        "COMPLETED",
        cycle.cycle_number,
        `completed.${payment.sort_order}`,
        reminder,
        payment.sort_order,
        null,
        null,
        payment.checked_at ? payment.checked_at : null,
        null,
        1,
      ],
    );
    db.run("update checklist_cycles set completed_at=null where id=?", [cycle.id]);
    syncSubStatusFromChecklist(db, cycle.job_card_id);
  }
}
~~~

## src/db.ts createLifecycleCycle

src/db.ts:7600

~~~typescript
function createLifecycleCycle(
  db: Database,
  jobId: number,
  stage: ChecklistStage,
  timestamp: string,
  through?: SubStatus,
  completeThrough = false,
) {
  const cycleNumber =
    (scalar<number>(
      db,
      "select coalesce(max(cycle_number), 0) from checklist_cycles where job_card_id=? and stage=?",
      [jobId, stage],
    ) ?? 0) + 1;
  const labels = LIFECYCLE_CHECKLIST[stage];
  const throughIndex =
    through && labels.includes(through) ? labels.indexOf(through) : -1;
  const cycleId = insert(
    db,
    "insert into checklist_cycles(job_card_id,stage,cycle_number,started_at,completed_at) values(?,?,?,?,?)",
    [jobId, stage, cycleNumber, timestamp, completeThrough ? timestamp : null],
  );
  labels.forEach((label, index) => {
    const checked =
      index < throughIndex || (completeThrough && index === throughIndex);
    const started = index === 0 || index <= throughIndex;
    insert(
      db,
      "insert into checklist_items(checklist_cycle_id,job_card_id,stage,cycle_number,item_key,label,sort_order,checked_by,checked_at,started_at,completed_at,required) values(?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        cycleId,
        jobId,
        stage,
        cycleNumber,
        `${stage.toLowerCase()}.${index + 1}`,
        label,
        index + 1,
        null,
        checked ? timestamp : null,
        started ? timestamp : null,
        checked ? timestamp : null,
        OPTIONAL_CHECKLIST_ITEMS.includes(label) ? 0 : 1,
      ],
    );
  });
  return cycleId;
}
~~~

## src/db.ts writeChecklistItemState

src/db.ts:7777

~~~typescript
function writeChecklistItemState(
  db: Database,
  item: ChecklistItem,
  actorId: number,
  resolved: boolean,
  notApplicable: boolean,
  timestamp: string,
) {
  db.run(
    "update checklist_items set checked_by=?, checked_at=?, started_at=coalesce(started_at, ?), completed_at=?, na_at=?, na_by=? where id=?",
    [
      resolved && !notApplicable ? actorId : null,
      resolved ? timestamp : null,
      timestamp,
      resolved ? timestamp : null,
      notApplicable ? timestamp : null,
      notApplicable ? actorId : null,
      item.id,
    ],
  );
  const remaining = scalar<number>(
    db,
    "select count(*) from checklist_items where checklist_cycle_id=? and required=1 and checked_at is null",
    [item.checklist_cycle_id],
  );
  db.run("update checklist_cycles set completed_at=? where id=?", [
    remaining === 0 ? timestamp : null,
    item.checklist_cycle_id,
  ]);
  if (resolved)
    db.run(
      "update checklist_items set started_at=coalesce(started_at, ?) where checklist_cycle_id=? and sort_order=?",
      [timestamp, item.checklist_cycle_id, item.sort_order + 1],
    );
  syncSubStatusFromChecklist(db, item.job_card_id);
}
~~~

## src/db.ts assertChecklistItemEditable

src/db.ts:7814

~~~typescript
function assertChecklistItemEditable(
  db: Database,
  item: ChecklistItem,
  resolving: boolean,
) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [
    item.job_card_id,
  ]);
  const latest = maybe<{ id: number }>(
    db,
    "select id from checklist_cycles where job_card_id=? order by id desc limit 1",
    [item.job_card_id],
  );
  if (
    job.main_status !== item.stage ||
    latest?.id !== item.checklist_cycle_id
  ) {
    throw new Error(
      `The ${item.stage} checklist is read-only while the job card is ${job.main_status}.`,
    );
  }
  const gate = DOCUMENT_GATED_ITEMS[item.label];
  if (
    resolving &&
    gate &&
    scalar<number>(
      db,
      `select count(*) from ${gate.table} where job_card_id=? and ${gate.live}`,
      [item.job_card_id],
    ) === 0
  ) {
    throw new Error(`Save the ${gate.noun} before completing "${item.label}".`);
  }
}
~~~

## src/db.ts setPaymentReceivedForActor

src/db.ts:7850

~~~typescript
function setPaymentReceivedForActor(
  db: Database,
  item: ChecklistItem,
  actorId: number,
  checked: boolean,
  timestamp: string,
  payment?: PaymentInput,
) {
  assertBillingMutationAccess(db, actorId);
  assertChecklistItemEditable(db, item, checked);
  const invoice = maybe<Invoice>(
    db,
    "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
    [item.job_card_id],
  );
  const paid = invoice ? activePaidAmount(db, invoice.id) > 0 : false;
  if (!checked) {
    if (paid)
      throw new Error(
        "Void the payment (with a reason) to untick Payment Received.",
      );
    return setChecklistItemChecked(db, item.id, actorId, false, timestamp);
  }
  if (!invoice) throw new Error("Create an Invoice before recording payment.");
  db.run("savepoint tick_payment_received");
  try {
    if (!paid)
      recordPayment(
        db,
        invoice.id,
        payment ?? {
          mode: "Cash",
          otherDetail: "",
          reference: "",
          notes: "Recorded by ticking Payment Received",
        },
        actorId,
      );
    const current = one<ChecklistItem>(
      db,
      "select * from checklist_items where id=?",
      [item.id],
    );
    if (!current.checked_at)
      setChecklistItemChecked(db, item.id, actorId, true, timestamp);
    db.run("release savepoint tick_payment_received");
  } catch (error) {
    db.run("rollback to savepoint tick_payment_received");
    db.run("release savepoint tick_payment_received");
    throw error;
  }
}
~~~

## src/db.ts ensureColumn

src/db.ts:7951

~~~typescript
function ensureColumn(
  db: Database,
  table: string,
  column: string,
  definition: string,
) {
  const exists = all<{ name: string }>(db, `pragma table_info(${table})`).some(
    (item) => item.name === column,
  );
  if (!exists)
    db.run(`alter table ${table} add column ${column} ${definition}`);
}
~~~

## src/db.ts seed

src/db.ts:7964

~~~typescript
function seed(db: Database) {
  [
    ["admin@example.com", "Owner/Admin", "admin"],
    ["service@example.com", "Service Advisor", "service"],
    ["reception@example.com", "Reception Desk", "reception"],
    ["accounts@example.com", "Accounts Desk", "accounts"],
    ["store@example.com", "Store Counter", "store"],
    ["tech@example.com", "Technician Bay", "tech"],
  ].forEach(([email, name, role]) =>
    db.run(
      "insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))",
      [email, name, role, "admin123"],
    ),
  );

  db.run(
    "insert into customers(name, mobile, type, created_at, updated_at) values ('Rahul Sharma','9876543210','Individual',datetime('now'),datetime('now')),('Datya Motors','9777711022','Dealer',datetime('now'),datetime('now')),('Anita Patra','9123488990','Individual',datetime('now'),datetime('now'))",
  );
  db.run(
    "insert into vehicles(customer_id, number, make, model, color, km, created_at, updated_at) values (1,'OD02AB1234','Hyundai','Creta','White',18420,datetime('now'),datetime('now')),(2,'OD02CD5678','Mahindra','Thar','Black',9200,datetime('now'),datetime('now')),(3,'OD05EF9001','BMW','X1','Blue',31100,datetime('now'),datetime('now'))",
  );
  WORKBOOK_INVENTORY_SEED.forEach((row) =>
    db.run(
      "insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [...row],
    ),
  );
  seedProcurementHistoryDemo(db);

  makeSeedJob(
    db,
    1,
    1,
    "JC-2026-001245",
    "IN_PROGRESS",
    "Work Started",
    "Full body PPF, paint correction, interior detailing",
    94400,
    30000,
  );
  makeSeedJob(
    db,
    2,
    2,
    "JC-2026-001246",
    "IN_PROGRESS",
    "Material Requested",
    "Bonnet PPF, ceramic coating",
    42480,
    0,
  );
  makeSeedJob(
    db,
    3,
    3,
    "JC-2026-001247",
    "COMPLETED",
    "Invoice Ready",
    "Paint correction",
    12000,
    0,
  );
}
~~~

## src/db.ts seedProcurementHistoryDemo

src/db.ts:8029

~~~typescript
function seedProcurementHistoryDemo(db: Database) {
  const supplierIds = [
    ["Apex Protection Films", "Karan Mehta"],
    ["Detail Supply Co.", "Riya Shah"],
    ["Prime Auto Materials", "Arjun Nair"],
  ].map(([name, contact]) =>
    insert(
      db,
      "insert into suppliers(name,contact_name,phone,email,gstin,status,created_by,created_at,updated_at) values(?,?,?,?,?,'Active',1,datetime('now'),datetime('now'))",
      [name, contact, "9000000000", `${name.toLowerCase().replaceAll(/[^a-z]+/g, ".")}@example.test`, ""],
    ),
  );
  const items = new Map(
    all<Pick<InventoryItem, "id" | "sku" | "name" | "unit">>(
      db,
      "select id,sku,name,unit from inventory where sku in ('PPF-001','PPF-002','PPF-003')",
    ).map((item) => [item.sku, item]),
  );
  const item = (sku: string) => {
    const found = items.get(sku);
    if (!found) throw new Error(`Missing seeded inventory item: ${sku}`);
    return found;
  };
  const addClosedOrder = (
    poNumber: string,
    supplierId: number,
    orderDate: string,
    sku: string,
    quantity: number,
    unitCost: number,
  ) => {
    const inventory = item(sku);
    const subtotal = quantity * unitCost;
    const orderId = insert(
      db,
      "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(?,?,?,?, 'Closed',?,0,0,?,1,datetime('now'),datetime('now'))",
      [supplierId, poNumber, orderDate, "Seeded completed purchase for price comparison.", subtotal, subtotal],
    );
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,0,0,?,0,?)",
      [orderId, inventory.id, inventory.name, inventory.unit, quantity, unitCost, subtotal, subtotal],
    );
  };

  addClosedOrder("DEMO-HIST-001", supplierIds[0], "2026-04-12", "PPF-001", 4, 15800);
  addClosedOrder("DEMO-HIST-002", supplierIds[1], "2026-06-24", "PPF-001", 6, 15150);
  addClosedOrder("DEMO-HIST-003", supplierIds[2], "2026-09-08", "PPF-001", 3, 16200);
  addClosedOrder("DEMO-HIST-004", supplierIds[1], "2026-05-17", "PPF-002", 5, 14400);
  addClosedOrder("DEMO-HIST-005", supplierIds[0], "2026-08-29", "PPF-002", 2, 14750);

  const requestId = insert(
    db,
    "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(0,'DEMO-PR-0001','2026-10-01','Demo request: compare recent supplier prices before approval.','PO Request',0,0,0,0,5,datetime('now'),datetime('now'))",
    [],
  );
  const requestLines: Array<[string, number]> = [
    ["PPF-001", 2],
    ["PPF-002", 3],
    ["PPF-003", 1],
  ];
  requestLines.forEach(([sku, quantity]) => {
    const inventory = item(sku);
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,0,0,0,0,0,0)",
      [requestId, inventory.id, inventory.name, inventory.unit, quantity],
    );
  });
}
~~~

## src/db.ts item

src/db.ts:8047

~~~typescript
item = (sku: string) => {
    const found = items.get(sku);
    if (!found) throw new Error(`Missing seeded inventory item: ${sku}`);
    return found;
  }
~~~

## src/db.ts addClosedOrder

src/db.ts:8052

~~~typescript
addClosedOrder = (
    poNumber: string,
    supplierId: number,
    orderDate: string,
    sku: string,
    quantity: number,
    unitCost: number,
  ) => {
    const inventory = item(sku);
    const subtotal = quantity * unitCost;
    const orderId = insert(
      db,
      "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(?,?,?,?, 'Closed',?,0,0,?,1,datetime('now'),datetime('now'))",
      [supplierId, poNumber, orderDate, "Seeded completed purchase for price comparison.", subtotal, subtotal],
    );
    insert(
      db,
      "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,0,0,?,0,?)",
      [orderId, inventory.id, inventory.name, inventory.unit, quantity, unitCost, subtotal, subtotal],
    );
  }
~~~

## src/db.ts makeSeedJob

src/db.ts:8100

~~~typescript
function makeSeedJob(
  db: Database,
  customerId: number,
  vehicleId: number,
  jobNo: string,
  main: MainStatus,
  sub: SubStatus,
  work: string,
  total: number,
  paid: number,
) {
  const visitId = insert(
    db,
    "insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, 2, 3, datetime('now'), 'Half', '2 keys', 'Mats, charger', ?, 'Sample document placeholder', datetime('now'), datetime('now'))",
    [customerId, vehicleId, work],
  );
  const jobId = insert(
    db,
    "insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, 2, 6, ?, ?, ?, 'Today 6:00 PM', ?, 0, '', 'Seed advisor note', ?, '', datetime('now'), datetime('now'))",
    [
      jobNo,
      visitId,
      main,
      sub,
      work,
      main === "COMPLETED" ? "Pass" : "Pending",
      work,
    ],
  );
  ensureLifecycleChecklist(db, jobId, main, sub, "2026-01-01T08:00:00.000Z");
  const estimateId = insert(
    db,
    "insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, 'Approved', 1000, 18, 'Seed approval', datetime('now'), datetime('now'))",
    [jobId],
  );
  insert(
    db,
    "insert into estimate_items(estimate_id, kind, description, qty, rate, created_at, updated_at) values (?, 'Service', ?, 1, ?, datetime('now'), datetime('now'))",
    [estimateId, work, Math.round(total / 1.18)],
  );
  const itemId = jobNo.endsWith("1246") ? 16 : 1;
  const issued = jobNo.endsWith("1246") ? 0 : 6;
  createMaterialRequest(db, {
    job_card_id: jobId,
    item_id: itemId,
    requested_qty: 6,
    issued_qty: issued,
    used_qty: jobNo.endsWith("1246") ? 0 : 5,
    returned_qty: jobNo.endsWith("1246") ? 0 : 0.8,
    wasted_qty: jobNo.endsWith("1246") ? 0 : 0.2,
  });
  if (issued > 0) movement(db, jobId, itemId, "ISSUE", issued, "Seed issue");
  createTask(db, {
    job_card_id: jobId,
    technician_id: 6,
    title: work.split(",")[0],
    status: main === "COMPLETED" ? "Completed" : "Started",
    notes: "Seed task from workbook flow.",
  });
  ["Edges checked", "Surface cleaned", "Customer items verified"].forEach(
    (label) =>
      insert(
        db,
        "insert into qc_checks(job_card_id, label, passed) values (?, ?, ?)",
        [jobId, label, main === "COMPLETED" ? 1 : 0],
      ),
  );
  let invoiceId = 0;
  if (main === "COMPLETED") {
    const seedRate = Math.round(total / 1.18);
    const taxable = Math.max(0, seedRate - 1000);
    const gstAmount = Math.round(taxable * 18) / 100;
    const invoiceTotal = Math.round((taxable + gstAmount) * 100) / 100;
    invoiceId = insert(
      db,
      "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,'INV-08947','TLY-4451',1000,18,?,?,?,'Pending','Seed invoice',1,datetime('now'),datetime('now'))",
      [jobId, seedRate, gstAmount, invoiceTotal],
    );
    insert(
      db,
      "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,datetime('now'),datetime('now'))",
      [invoiceId, work, seedRate],
    );
  }
  if (paid > 0 && invoiceId) {
    insert(
      db,
      "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,'UPI','','ADV-SEED','Seed advance',datetime('now'),datetime('now'))",
      [jobId, invoiceId, paid],
    );
    syncInvoicePaymentStatus(db, invoiceId);
  }
  createPhoto(db, {
    job_card_id: jobId,
    label: "Job sheet placeholder",
    src: "",
    category: "Job Sheet",
  });
  history(db, jobId, main, sub, "Seeded demo workflow");
}
~~~

## src/db.ts transitionJobStatusInternal

src/db.ts:8211

~~~typescript
function transitionJobStatusInternal(
  db: Database,
  jobId: number,
  to: MainStatus,
  note: string,
  timestamp = new Date().toISOString(),
  closingViaPayment = false,
) {
  const confirmation = note.trim();
  if (!confirmation)
    throw new Error(
      "A confirmation note is required for every status transition.",
    );
  if (to === "CLOSED" && !closingViaPayment)
    throw new Error(
      "A completed job can only close when a valid payment is recorded.",
    );
  db.run("savepoint job_status_transition");
  try {
    const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
    if (job.main_status === to) throw new Error(`Job card is already ${to}.`);
    if (!closingViaPayment)
      assertValidMainStatusTransition(job.main_status, to);

    const gated =
      to !== "CANCELLED" && to !== "HOLD" && job.main_status !== "HOLD";
    if (gated) {
      const active = maybe<ChecklistCycle>(
        db,
        "select * from checklist_cycles where job_card_id=? order by id desc limit 1",
        [jobId],
      );
      if (!active || active.stage !== job.main_status || !active.completed_at) {
        const remaining = active
          ? all<{ label: SubStatus }>(
              db,
              "select label from checklist_items where checklist_cycle_id=? and required=1 and checked_at is null order by sort_order",
              [active.id],
            ).map((item) => item.label)
          : [];
        throw new Error(
          `Complete the ${job.main_status} checklist before moving to ${to}${remaining.length ? `: ${remaining.join(", ")}` : "."}`,
        );
      }
    }

    const keepsChecklist = to === "CANCELLED" || to === "HOLD";
    const resumesCycle = job.main_status === "HOLD" && to === "IN_PROGRESS";
    const nextSub =
      keepsChecklist || resumesCycle
        ? checklistSubStatus(db, jobId, job.sub_status)
        : LIFECYCLE_CHECKLIST[to][0];
    db.run(
      "update job_cards set main_status=?, sub_status=?, closed_at=case when ?='CLOSED' then coalesce(closed_at, ?) else closed_at end, updated_at=? where id=?",
      [to, nextSub, to, timestamp, timestamp, jobId],
    );
    if (!keepsChecklist && !resumesCycle)
      createLifecycleCycle(db, jobId, to, timestamp);
    history(db, jobId, to, nextSub, confirmation, timestamp);
    if (to === "CLOSED") ensureGatePassOnClose(db, jobId);
    if (!keepsChecklist) reconcileArtifactChecklist(db, jobId, 0, timestamp);
    db.run("release savepoint job_status_transition");
  } catch (error) {
    db.run("rollback to savepoint job_status_transition");
    db.run("release savepoint job_status_transition");
    throw error;
  }
}
~~~

## src/db.ts resetMissingPhotoEvidence

src/db.ts:8307

~~~typescript
function resetMissingPhotoEvidence(db: Database, onlyJobId?: number) {
  const jobs = all<{ id: number }>(
    db,
    `select j.id from job_cards j
    where j.main_status='IN_PROGRESS' ${onlyJobId === undefined ? "" : "and j.id=?"}
    and not exists(select 1 from photos p where p.job_card_id=j.id and p.archived_at is null and trim(coalesce(p.src,''))<>'')`,
    onlyJobId === undefined ? [] : [onlyJobId],
  );
  for (const job of jobs) {
    const cycle = maybe<ChecklistCycle>(
      db,
      "select * from checklist_cycles where job_card_id=? and stage='IN_PROGRESS' order by cycle_number desc,id desc limit 1",
      [job.id],
    );
    if (!cycle) continue;
    const photoItem = maybe<ChecklistItem>(
      db,
      "select * from checklist_items where checklist_cycle_id=? and label='Photos Shared'",
      [cycle.id],
    );
    if (!photoItem?.checked_at) continue;
    db.run(
      "update checklist_items set checked_by=null,checked_at=null,completed_at=null where checklist_cycle_id=? and sort_order>=?",
      [cycle.id, photoItem.sort_order],
    );
    syncSubStatusFromChecklist(db, job.id);
  }
}
~~~

## src/db.ts artifactExistsForChecklistItem

src/db.ts:8336

~~~typescript
function artifactExistsForChecklistItem(
  db: Database,
  jobId: number,
  label: SubStatus,
) {
  switch (label) {
    case "Gather Requirements":
      return (
        scalar<number>(
          db,
          "select count(*) from job_cards j join visits v on v.id=j.visit_id where j.id=? and trim(coalesce(v.requested_work,''))<>''",
          [jobId],
        ) > 0
      );
    case "Create Estimate":
      return (
        scalar<number>(
          db,
          "select count(*) from estimates where job_card_id=? and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Get Confirmation":
      return (
        scalar<number>(
          db,
          "select count(*) from estimates where job_card_id=? and status='Approved' and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Material Requested":
      return (
        scalar<number>(
          db,
          "select count(*) from material_requests where job_card_id=? and archived_at is null and status<>'Draft'",
          [jobId],
        ) > 0
      );
    case "Material Issued":
      return (
        scalar<number>(
          db,
          "select count(*) from material_requests where job_card_id=? and archived_at is null and status='Issued'",
          [jobId],
        ) > 0 &&
        scalar<number>(
          db,
          "select count(*) from material_requests where job_card_id=? and archived_at is null and status not in ('Issued','Cancelled')",
          [jobId],
        ) === 0
      );
    case "Washing Needed":
      return (
        scalar<number>(
          db,
          "select count(*) from job_cards where id=? and washing_needed=1",
          [jobId],
        ) > 0
      );
    case "Work Started":
      return (
        scalar<number>(
          db,
          "select count(*) from tasks where job_card_id=? and status in ('Started','Paused','Completed') and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Follow-up Needed":
      return (
        scalar<number>(
          db,
          "select count(*) from followups where job_card_id=? and archived_at is null",
          [jobId],
        ) > 0
      );
    case "Photos Shared":
      return (
        scalar<number>(
          db,
          "select count(*) from photos where job_card_id=? and archived_at is null and trim(coalesce(src,''))<>''",
          [jobId],
        ) > 0
      );
    case "QC Pending":
      return (
        scalar<number>(
          db,
          "select count(*) from tasks where job_card_id=? and status<>'Completed' and archived_at is null",
          [jobId],
        ) === 0
      );
    case "Customer Verification":
      return (
        scalar<number>(
          db,
          "select count(*) from job_cards where id=? and qc_status='Pass'",
          [jobId],
        ) > 0
      );
    case "Invoice Ready":
      return (
        scalar<number>(
          db,
          "select count(*) from invoices where job_card_id=? and voided_at is null",
          [jobId],
        ) > 0
      );
    case "Payment Received": {
      const invoice = maybe<Invoice>(
        db,
        "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
        [jobId],
      );
      return Boolean(
        invoice &&
        invoice.total > 0 &&
        scalar<number>(
          db,
          "select coalesce(sum(amount),0) from payments where invoice_id=? and voided_at is null",
          [invoice.id],
        ) >= invoice.total,
      );
    }
    case "Receipt Generated":
      return (
        scalar<number>(
          db,
          "select count(*) from receipts where job_card_id=? and voided_at is null",
          [jobId],
        ) > 0
      );
    case "Gate Pass Generated":
      return (
        scalar<number>(
          db,
          "select count(*) from gate_passes where job_card_id=? and voided_at is null",
          [jobId],
        ) > 0
      );
    case "Delivered":
      return false;
  }
}
~~~

## src/db.ts checklistSubStatus

src/db.ts:8480

~~~typescript
function checklistSubStatus(db: Database, jobId: number, fallback: SubStatus) {
  const cycle = maybe<ChecklistCycle>(
    db,
    "select * from checklist_cycles where job_card_id=? order by id desc limit 1",
    [jobId],
  );
  if (!cycle) return fallback;
  const items = all<ChecklistItem>(
    db,
    "select * from checklist_items where checklist_cycle_id=? order by sort_order",
    [cycle.id],
  );
  return items.length ? deriveChecklistSubStatus(items) : fallback;
}
~~~

## src/db.ts history

src/db.ts:8495

~~~typescript
function history(
  db: Database,
  jobId: number,
  main: MainStatus,
  sub: SubStatus,
  note: string,
  timestamp?: string,
) {
  db.run(
    "insert into status_history(job_card_id, main_status, sub_status, note, created_at) values (?, ?, ?, ?, coalesce(?, datetime('now')))",
    [jobId, main, sub, note, timestamp ?? null],
  );
}
~~~

## src/db.ts auditEvidence

src/db.ts:8509

~~~typescript
function auditEvidence(db: Database, jobId: number, note: string) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  history(
    db,
    jobId,
    job.main_status,
    checklistSubStatus(db, jobId, job.sub_status),
    note,
  );
}
~~~

## src/db.ts movement

src/db.ts:8520

~~~typescript
function movement(
  db: Database,
  jobId: number,
  itemId: number,
  direction: string,
  qty: number,
  note: string,
) {
  db.run(
    "insert into material_movements(job_card_id, item_id, direction, qty, note, created_at) values (?, ?, ?, ?, ?, datetime('now'))",
    [jobId, itemId, direction, qty, note],
  );
}
~~~

## src/db.ts archive

src/db.ts:8534

~~~typescript
function archive(db: Database, table: string, id: number, reason: string) {
  db.run(
    `update ${table} set archived_at=datetime('now'), archived_reason=?, updated_at=datetime('now') where id=?`,
    [reason || "Archived", id],
  );
}
~~~

## src/db.ts invoiceTotal

src/db.ts:8541

~~~typescript
function invoiceTotal(db: Database, jobId: number) {
  const estimate = maybe<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  const items = estimate
    ? all<EstimateItem>(
        db,
        "select * from estimate_items where estimate_id=? and archived_at is null",
        [estimate.id],
      )
    : [];
  return invoiceItemsTotal(items, estimate);
}
~~~

## src/db.ts insert

src/db.ts:8674

~~~typescript
function insert(db: Database, sql: string, params: DbValue[]) {
  db.run(sql, params);
  return scalar<number>(db, "select last_insert_rowid()");
}
~~~

## src/db.ts scalar

src/db.ts:8679

~~~typescript
function scalar<T>(db: Database, sql: string, params: DbValue[] = []) {
  return db.exec(sql, params)[0]?.values[0]?.[0] as T;
}
~~~

## src/db.ts all

src/db.ts:8683

~~~typescript
function all<T>(db: Database, sql: string, params: DbValue[] = []) {
  const result = db.exec(sql, params)[0];
  if (!result) return [] as T[];
  return result.values.map((row) =>
    Object.fromEntries(
      result.columns.map((column, index) => [column, row[index]]),
    ),
  ) as T[];
}
~~~

## src/db.ts one

src/db.ts:8693

~~~typescript
function one<T>(db: Database, sql: string, params: DbValue[] = []) {
  const row = maybe<T>(db, sql, params);
  if (!row) throw new Error(`Expected row for query: ${sql}`);
  return row;
}
~~~

## src/db.ts maybe

src/db.ts:8699

~~~typescript
function maybe<T>(db: Database, sql: string, params: DbValue[] = []) {
  return all<T>(db, sql, params)[0];
}
~~~

## src/developer-console.tsx test

src/developer-console.tsx:10

~~~typescript
test = (channel: "email" | "whatsapp") => { commit((current) => simulateCommunicationTest(current, channel, tenant.id, tenant.profile.email)); setNotice(`${channel === "email" ? "Email" : "WhatsApp"} test queued as a simulated delivery.`); }
~~~

## src/developer-console.tsx submit

src/developer-console.tsx:21

~~~typescript
submit = (event: FormEvent) => { event.preventDefault(); if (!name.trim()) return; onCreate({ name, brandName: name, address: "", contactName: "", email: "", phone: "", gstin: "", timezone: "Asia/Kolkata", currency: "INR", invoicePrefix: name.slice(0, 4).toUpperCase() }); setName(""); }
~~~

## src/developer-console.tsx change

src/developer-console.tsx:22

~~~typescript
change = (key: keyof TenantProfile, value: string) => setDraft({ ...draft, [key]: value })
~~~

## src/developer-control-plane.ts browserStorage

src/developer-control-plane.ts:66

~~~typescript
browserStorage = (): SessionStorageLike | undefined => typeof sessionStorage === "undefined" ? undefined : sessionStorage
~~~

## src/developer-control-plane.ts iso

src/developer-control-plane.ts:67

~~~typescript
iso = (now: Date | string) => new Date(now).toISOString()
~~~

## src/developer-control-plane.ts valid

src/developer-control-plane.ts:82

~~~typescript
function valid(value: unknown): value is DeveloperControlPlaneState {
  return !!value && typeof value === "object" && (value as DeveloperControlPlaneState).version === DEVELOPER_CONTROL_PLANE_VERSION && Array.isArray((value as DeveloperControlPlaneState).tenants);
}
~~~

## src/document-download.tsx resolve

src/document-download.tsx:12

~~~typescript
resolve = (): RenderedDocument => {
    const snapshots = loadDocumentSnapshots();
    const snap = snapshotId ? snapshots.find((item) => item.id === snapshotId) : undefined;
    return snap ? renderSnapshotDocument(snap) : renderJobDocument(kind, view, loadAdminDemoState(), snapshots);
  }
~~~

## src/document-download.tsx print

src/document-download.tsx:17

~~~typescript
print = () => {
    try { const result = printRenderedDocument(resolve()); if (!result.ok) throw new Error(result.error); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "The document could not be printed."); setStatus("error"); }
  }
~~~

## src/document-download.tsx download

src/document-download.tsx:21

~~~typescript
download = async () => {
    setStatus("preparing"); setErrorMessage("");
    try { const doc = resolve(); await renderHtmlToPdf(doc.html, doc.filename); setStatus("done"); window.setTimeout(() => setStatus("idle"), 2500); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Document generation failed."); setStatus("error"); }
  }
~~~

## src/document-snapshots.ts browserStorage

src/document-snapshots.ts:29

~~~typescript
browserStorage = (): SnapshotStorage | undefined => { try { return typeof sessionStorage === "undefined" ? undefined : sessionStorage; } catch { return undefined; } }
~~~

## src/document-snapshots.ts freeze

src/document-snapshots.ts:50

~~~typescript
function freeze(kind: DocumentKind, view: JobView, number: string, admin: Templates, now: string): DocumentSnapshot {
  const category = kind as ReportCategory;
  return {
    id: `${view.job.id}:${kind}:${number}:${now}`, jobId: view.job.id, jobNo: view.job.job_no, kind, number, state: "frozen",
    templateId: admin.reportTemplates.find((template) => template.category === category && template.active)?.id ?? "",
    html: renderLive(kind, view, admin), values: buildReportValues(category, view, admin.businessSettings, admin.companyAssets), lines: buildReportLines(category, view), frozenAt: now,
  };
}
~~~

## src/document-snapshots.ts live

src/document-snapshots.ts:66

~~~typescript
live = (jobId: number, jobNo: string, kind: DocumentKind, number: string) => snapshots.findIndex((item) => item.jobId === jobId && item.jobNo === jobNo && item.kind === kind && item.number === number && item.state === "frozen")
~~~

## src/export-utils.ts fileStem

src/export-utils.ts:28

~~~typescript
function fileStem(title: string) {
  return title.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workshop-report";
}
~~~

## src/export-utils.ts header

src/export-utils.ts:52

~~~typescript
header = () => {
    document.setFont("helvetica", "bold");
    document.setFontSize(15);
    document.text(report.title, margin, y);
    y += 18;
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.text(`Generated: ${generatedAt.toLocaleString("en-IN")}`, margin, y);
    y += 12;
    document.text(`Active filters: ${report.filters.length ? report.filters.join("; ") : "None"}`, margin, y, { maxWidth: width });
    y += 20;
    document.setFont("helvetica", "bold");
    report.columns.forEach((column, index) => document.text(column.header, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 }));
    document.line(margin, y + 4, margin + width, y + 4);
    y += lineHeight;
    document.setFont("helvetica", "normal");
  }
~~~

## src/finance-api.ts request

src/finance-api.ts:14

~~~typescript
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new FinanceApiError(body.code ?? body.detail?.code ?? "FINANCE_API_FAILED");
  }
  return response.json() as Promise<T>;
}
~~~

## src/finance-api.ts json

src/finance-api.ts:23

~~~typescript
json = (body: unknown, requestKey?: string): RequestInit => ({ method: "POST", headers: { "content-type": "application/json", ...(requestKey ? { "idempotency-key": requestKey } : {}) }, body: JSON.stringify(body) })
~~~

## src/followups-api.ts request

src/followups-api.ts:16

~~~typescript
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new FollowupsApiError(body.code ?? body.detail?.code ?? "FOLLOWUPS_API_FAILED");
  }
  return response.json() as Promise<T>;
}
~~~

## src/followups-api.ts json

src/followups-api.ts:25

~~~typescript
json = (method: "POST" | "PUT", body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
~~~

## src/inventory-import.ts headerKey

src/inventory-import.ts:67

~~~typescript
function headerKey(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}
~~~

## src/inventory-import.ts displayHeader

src/inventory-import.ts:71

~~~typescript
function displayHeader(value: unknown, columnIndex: number) {
  const header = String(value ?? "").trim();
  return header || `Column ${columnIndex + 1}`;
}
~~~

## src/inventory-import.ts uniqueHeaders

src/inventory-import.ts:76

~~~typescript
function uniqueHeaders(values: unknown[]) {
  const counts = new Map<string, number>();
  return values.map((value, index) => {
    const base = displayHeader(value, index);
    const key = base.toLocaleLowerCase();
    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);
    return count === 1 ? base : `${base} (${count})`;
  });
}
~~~

## src/inventory-import.ts isBlankRow

src/inventory-import.ts:87

~~~typescript
function isBlankRow(row: unknown[]) {
  return row.every((value) => value === undefined || value === null || String(value).trim() === "");
}
~~~

## src/inventory-import.ts inferUnit

src/inventory-import.ts:99

~~~typescript
function inferUnit(name: string) {
  return UNIT_PATTERNS.find(([pattern]) => pattern.test(name))?.[1] ?? "pcs";
}
~~~

## src/inventory-import.ts sheetMatrix

src/inventory-import.ts:103

~~~typescript
function sheetMatrix(sheet: XLSX.WorkSheet) {
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", blankrows: false, raw: true });
}
~~~

## src/inventory-import.ts parseCategorySheets

src/inventory-import.ts:112

~~~typescript
function parseCategorySheets(workbook: XLSX.WorkBook): ParsedInventoryWorkbook | null {
  const rows: InventoryImportSourceRow[] = [];
  for (const sheetName of workbook.SheetNames) {
    const matrix = sheetMatrix(workbook.Sheets[sheetName]);
    if (matrix.length === 0 || isBlankRow(matrix[0])) continue;
    const keys = matrix[0].map((value) => headerKey(String(value ?? "")));
    const nameIndex = keys.findIndex((key) => FIELD_ALIASES.name.includes(key));
    if (nameIndex < 0) continue;
    const brandIndex = keys.indexOf("brand");
    const balanceIndex = keys.findIndex((key) => key === "ob" || FIELD_ALIASES.stock_qty.includes(key));
    const prefix = sheetName.trim().toLocaleUpperCase().replace(/[^A-Z0-9]+/g, "") || "ITEM";
    let serial = 0;
    for (const row of matrix.slice(1)) {
      const name = normalizedText(row[nameIndex]);
      if (!name) continue;
      serial += 1;
      const brand = brandIndex >= 0 ? normalizedText(row[brandIndex]) : "";
      const balance = balanceIndex >= 0 ? row[balanceIndex] : "";
      rows.push({
        SKU: `${prefix}-${String(serial).padStart(3, "0")}`,
        Name: brand ? `${name} (${brand})` : name,
        Category: sheetName.trim(),
        Unit: inferUnit(name),
        "Stock Qty": normalizedText(balance) === "" ? 0 : balance,
        "Low Stock Qty": 0,
      });
    }
  }
  if (rows.length === 0) return null;
  return { sheetName: "All sheets", headers: ["SKU", "Name", "Category", "Unit", "Stock Qty", "Low Stock Qty"], rows };
}
~~~

## src/inventory-import.ts normalizedText

src/inventory-import.ts:184

~~~typescript
function normalizedText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}
~~~

## src/inventory-import.ts normalizedSku

src/inventory-import.ts:188

~~~typescript
function normalizedSku(value: unknown) {
  return normalizedText(value).toLocaleUpperCase();
}
~~~

## src/inventory-import.ts parseQuantity

src/inventory-import.ts:192

~~~typescript
function parseQuantity(value: unknown) {
  if (typeof value === "number") return value;
  const text = normalizedText(value);
  return text === "" ? Number.NaN : Number(text.replace(/,/g, ""));
}
~~~

## src/inventory-import.ts deterministicId

src/inventory-import.ts:198

~~~typescript
function deterministicId(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return -(hash >>> 0 || 1);
}
~~~

## src/inventory-import.ts mappingIssues

src/inventory-import.ts:207

~~~typescript
function mappingIssues(headers: string[], mapping: InventoryColumnMapping) {
  const issues: InventoryImportIssue[] = [];
  for (const field of INVENTORY_IMPORT_FIELDS) {
    const column = mapping[field];
    if (!column) {
      issues.push({ code: "MISSING_MAPPING", field, message: `Map a source column to ${field}.` });
    } else if (!headers.includes(column)) {
      issues.push({ code: "UNKNOWN_COLUMN", field, message: `The mapped column “${column}” is not present in the file.` });
    }
  }
  return issues;
}
~~~

## src/invoice-math.ts round2

src/invoice-math.ts:23

~~~typescript
round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100
~~~

## src/job-delivery-highlight.ts calendarDay

src/job-delivery-highlight.ts:4

~~~typescript
function calendarDay(value: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day)
    return undefined;
  return date.getTime() / 86_400_000;
}
~~~

## src/job-delivery-highlight.ts refresh

src/job-delivery-highlight.ts:45

~~~typescript
refresh = () => {
      setToday(localDeliveryDate());
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, Math.max(1, nextMidnight.getTime() - now.getTime() + 50));
    }
~~~

## src/job-delivery-highlight.ts onVisible

src/job-delivery-highlight.ts:51

~~~typescript
onVisible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        refresh();
      }
    }
~~~

## src/job-documents.ts currentInvoicePayment

src/job-documents.ts:31

~~~typescript
currentInvoicePayment = (view: JobView) => Boolean(view.invoice && view.payments.some((payment) => payment.invoice_id === view.invoice!.id))
~~~

## src/job-documents.ts recordExists

src/job-documents.ts:32

~~~typescript
recordExists = (kind: DocumentKind, view: JobView) => kind === "estimate" ? Boolean(view.estimate && !view.estimate.archived_at)
  : kind === "invoice" ? Boolean(view.invoice && !view.invoice.voided_at)
    : kind === "gate-pass" ? Boolean(view.gate_pass && view.invoice && view.gate_pass.invoice_id === view.invoice.id && !view.gate_pass.voided_at)
      : kind === "payment-receipt" ? Boolean(view.receipt && view.invoice && view.receipt.invoice_id === view.invoice.id && !view.receipt.voided_at && currentInvoicePayment(view))
        : Boolean(view.job)
~~~

## src/job-documents.ts missingReason

src/job-documents.ts:62

~~~typescript
function missingReason(kind: DocumentKind, view: JobView): string {
  if (view.job.main_status === "CANCELLED") return `${labels[kind]} not created - job cancelled`;
  if (kind === "estimate") return "Estimate not created";
  if (kind === "invoice") return view.estimate?.status === "Approved" && !view.estimate.archived_at ? "Invoice not created" : "Invoice not created - approve an estimate first";
  if (kind === "payment-receipt") return "Payment Receipt not created - created when a payment is recorded";
  return "Gate Pass not created - created when the job is closed";
}
~~~

## src/job-media.ts decodedBytes

src/job-media.ts:14

~~~typescript
function decodedBytes(base64: string) {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length % 4 !== 0) throw new Error("The compressed image data is invalid.");
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(base64, "base64"));
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}
~~~

## src/job-picker.tsx monthYearLabel

src/job-picker.tsx:13

~~~typescript
function monthYearLabel(month: string) { const date = new Date(`${month}-01T00:00:00`); return Number.isNaN(date.valueOf()) ? month : date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }); }
~~~

## src/job-picker.tsx setPeriod

src/job-picker.tsx:16

~~~typescript
setPeriod = (next: JobPeriod) => { if (!selectedJobRemainsInPeriod(jobs, selectedJobId, next)) onSelect(undefined); if (controlledPeriod) onPeriodChange?.(next); else setLocalPeriod(next); }
~~~

## src/job-picker.tsx reset

src/job-picker.tsx:17

~~~typescript
reset = () => { const next = { monthYear: "ALL" }; setQuery(""); onSelect(undefined); if (controlledPeriod) onPeriodChange?.(next); else setLocalPeriod(next); onClear?.(); }
~~~

## src/job-sheet-ui.tsx set

src/job-sheet-ui.tsx:84

~~~typescript
set = (key: keyof typeof draft) => (event: { target: { value: string } }) => setDraft({ ...draft, [key]: event.target.value })
~~~

## src/job-sheet.ts isBodyView

src/job-sheet.ts:19

~~~typescript
isBodyView = (value: unknown): value is BodyView => BODY_VIEWS.some((item) => item.key === value)
~~~

## src/job-sheet.ts clamp

src/job-sheet.ts:25

~~~typescript
clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value * 10) / 10))
~~~

## src/jobs-api.ts request

src/jobs-api.ts:12

~~~typescript
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { code?: string; detail?: { code?: string } };
    throw new JobsApiError(body.code ?? body.detail?.code ?? "JOBS_API_FAILED");
  }
  return response.json() as Promise<T>;
}
~~~

## src/jobs-api.ts json

src/jobs-api.ts:21

~~~typescript
json = (body: unknown): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
~~~

## src/local-sales.tsx localLeadInput

src/local-sales.tsx:14

~~~typescript
localLeadInput = (lead: LeadFormDraft) => ({ display_name: lead.displayName, phone: lead.phone, company: lead.company, company_not_entered: Number(lead.companyNotEntered), email: lead.email, email_not_entered: Number(lead.emailNotEntered), address: lead.address, service_interest: lead.serviceInterest, notes: lead.notes, stage: lead.stage, temperature: lead.temperature, follow_up_due: lead.followUpDue, site_visit_completed: Number(lead.siteVisitCompleted), site_visit_date: lead.siteVisitDate })
~~~

## src/local-sales.tsx remoteLead

src/local-sales.tsx:15

~~~typescript
remoteLead = (lead: SalesLead): Lead => ({ id: lead.id, branchId: "local", displayName: lead.display_name, phone: lead.phone, company: lead.company, companyNotEntered: Boolean(lead.company_not_entered), email: lead.email, emailNotEntered: Boolean(lead.email_not_entered), address: lead.address, serviceInterest: lead.service_interest, notes: lead.notes, stage: lead.stage, temperature: lead.temperature, followUpDue: lead.follow_up_due, siteVisitCompleted: Boolean(lead.site_visit_completed), siteVisitDate: lead.site_visit_date, createdAt: lead.created_at, updatedAt: lead.updated_at })
~~~

## src/local-sales.tsx remoteQuotation

src/local-sales.tsx:16

~~~typescript
remoteQuotation = (quotation: SalesQuotation): Quotation => ({ id: quotation.id, branchId: "local", leadId: quotation.lead_id, quotationNo: quotation.quotation_no, status: quotation.status, validUntil: quotation.valid_until, customerNotes: quotation.customer_notes, discount: quotation.discount, subtotal: quotation.subtotal, gstAmount: quotation.gst_amount, total: quotation.total, templateId: quotation.template_id, templateHtml: quotation.template_html, createdAt: quotation.created_at, updatedAt: quotation.updated_at, lines: quotation.lines.map((line) => ({ id: line.id, kind: line.kind, description: line.description, quantity: line.quantity, rate: line.rate, gstRate: line.gst_rate })) })
~~~

## src/local-sales.tsx localInput

src/local-sales.tsx:17

~~~typescript
localInput = (input: QuotationInput) => ({ lead_id: input.leadId, valid_until: input.validUntil ?? null, customer_notes: input.customerNotes, discount: input.discount, template_id: input.templateId, template_html: input.templateHtml, lines: input.lines.map((line) => ({ kind: line.kind, description: line.description, quantity: line.quantity, rate: line.rate, gst_rate: line.gstRate })) })
~~~

## src/local-sales.tsx localDocument

src/local-sales.tsx:18

~~~typescript
localDocument = (quotation: Quotation, lead?: Lead): QuotationDocument => ({ quotationNo: quotation.quotationNo, createdAt: quotation.createdAt, templateHtml: quotation.templateHtml ?? "", snapshot: { leadName: lead?.displayName, phone: lead?.phone, validUntil: quotation.validUntil, customerNotes: quotation.customerNotes, discount: quotation.discount, subtotal: quotation.subtotal, gstAmount: quotation.gstAmount, total: quotation.total, lines: quotation.lines } })
~~~

## src/local-sales.tsx currentMonthYear

src/local-sales.tsx:19

~~~typescript
currentMonthYear = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
~~~

## src/local-sales.tsx closeLeadDialog

src/local-sales.tsx:26

~~~typescript
closeLeadDialog = () => { setLeadDialog(null); setSelectedLead(null); }
~~~

## src/local-sales.tsx saveLead

src/local-sales.tsx:26

~~~typescript
saveLead = (draft: LeadFormDraft) => { const ok = leadDialog === "edit" && selectedLead ? mutate((db) => updateSalesLead(db, selectedLead.id, localLeadInput(draft)), setError) : mutate((db) => createSalesLead(db, localLeadInput(draft)), setError); if (ok) closeLeadDialog(); }
~~~

## src/local-sales.tsx saveInlineLead

src/local-sales.tsx:27

~~~typescript
saveInlineLead = async (lead: Lead, draft: LeadFormDraft) => mutate((db) => updateSalesLead(db, lead.id, localLeadInput(draft)), setError)
~~~

## src/local-sales.tsx saveQuotation

src/local-sales.tsx:29

~~~typescript
saveQuotation = (input: QuotationInput) => { const target = editor; const ok = mutate((db) => target && target !== "new" ? updateSalesQuotation(db, target.id, localInput(input)) : createSalesQuotation(db, localInput(input)), setError); if (ok) setEditor(null); }
~~~

## src/local-sales.tsx setQuotationStatus

src/local-sales.tsx:30

~~~typescript
setQuotationStatus = (_status: string) => undefined
~~~

## src/materials-ui.tsx choose

src/materials-ui.tsx:18

~~~typescript
choose = (item: InventoryItem) => { onChange(item.id); setQuery(item.name); setOpen(false); }
~~~

## src/materials-ui.tsx chooseOption

src/materials-ui.tsx:19

~~~typescript
chooseOption = (option: InventoryItem | undefined) => { if (option) choose(option); else if (onSelectAll) { onSelectAll(); setQuery(allOptionLabel ?? ""); setOpen(false); } }
~~~

## src/materials-ui.tsx run

src/materials-ui.tsx:28

~~~typescript
run = (action: (db: Database) => unknown) => mutate((db) => action(db), setError)
~~~

## src/materials-ui.tsx add

src/materials-ui.tsx:39

~~~typescript
add = () => { if (itemId === undefined) { setError("Choose an item."); return; } if (mutate((db) => addMaterialRowForActor(db, view.job.id, actor.id, itemId, qty), setError)) { setItemId(undefined); setQty(1); } }
~~~

## src/materials-ui.tsx requestNew

src/materials-ui.tsx:40

~~~typescript
requestNew = () => { if (mutate((db) => createMaterialPurchaseRequestForActor(db, view.job.id, actor.id, newItem), setError)) setNewItem({ item_name: "", quantity: 1, unit: "piece" }); }
~~~

## src/quotation-dialog.tsx emptyLine

src/quotation-dialog.tsx:12

~~~typescript
emptyLine = (): QuotationLine => ({ kind: "Service", description: "", quantity: 1, rate: 0, gstRate: 18 })
~~~

## src/quotation-dialog.tsx money

src/quotation-dialog.tsx:13

~~~typescript
money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)
~~~

## src/quotation-dialog.tsx totals

src/quotation-dialog.tsx:14

~~~typescript
totals = (lines: QuotationLine[], discount: number) => { const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.rate, 0); const gst = lines.reduce((sum, line) => sum + Math.max(0, line.quantity * line.rate - (subtotal ? discount * (line.quantity * line.rate / subtotal) : 0)) * line.gstRate / 100, 0); return { subtotal, gst, total: Math.max(0, subtotal - discount) + gst }; }
~~~

## src/quotation-dialog.tsx choose

src/quotation-dialog.tsx:24

~~~typescript
choose = (task: ServiceTask) => { onSelect(task); setOpen(false); }
~~~

## src/quotation-dialog.tsx openOptions

src/quotation-dialog.tsx:25

~~~typescript
openOptions = () => { setOpen(true); setActiveIndex(0); }
~~~

## src/quotation-dialog.tsx changeLine

src/quotation-dialog.tsx:37

~~~typescript
changeLine = (index: number, patch: Partial<QuotationLine>) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line))
~~~

## src/quotation-dialog.tsx selectTask

src/quotation-dialog.tsx:38

~~~typescript
selectTask = (index: number, task: ServiceTask) => changeLine(index, { kind: "Service", description: task.description || task.name, rate: task.rate, gstRate: task.gstRate })
~~~

## src/quotation-dialog.tsx selectTemplate

src/quotation-dialog.tsx:39

~~~typescript
selectTemplate = (id: string) => setTemplateId(id)
~~~

## src/quotation-dialog.tsx submit

src/quotation-dialog.tsx:40

~~~typescript
submit = (event: FormEvent) => { event.preventDefault(); const cleanLines = lines.filter((line) => line.description.trim()); const templateHtml = templates.find((template) => template.id === templateId)?.html ?? ""; if (!leadId || !templateId || !templateHtml.trim() || !cleanLines.length) return; onSave({ leadId, validUntil: validUntil || undefined, customerNotes: notes, discount: Number(discount) || 0, templateId, templateHtml, lines: cleanLines }); }
~~~

## src/quotation-dialog.tsx run

src/quotation-dialog.tsx:51

~~~typescript
run = async (action: "download" | "print") => { setBusy(action); onError?.(""); try { const document = await loadDocument(); const html = quotationDocumentHtml(document); if (action === "download") await renderHtmlToPdf(html, `${document.quotationNo}.pdf`); else { const result = printRenderedDocument({ html, title: `Quotation ${document.quotationNo}` }); if (!result.ok) throw new Error(result.error); } } catch (error) { onError?.(error instanceof Error ? error.message : "QUOTATION_OUTPUT_FAILED"); } finally { setBusy(""); } }
~~~

## src/remote-finance.tsx rupeesToPaise

src/remote-finance.tsx:8

~~~typescript
rupeesToPaise = (value: string) => Math.round(Number(value) * 100)
~~~

## src/remote-finance.tsx money

src/remote-finance.tsx:9

~~~typescript
money = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100)
~~~

## src/remote-finance.tsx refresh

src/remote-finance.tsx:22

~~~typescript
refresh = async () => {
    const nextJobs = await jobsApi.list(config); setJobs(nextJobs);
    const job = nextJobs.find((item) => item.id === (selectedId && nextJobs.some((candidate) => candidate.id === selectedId) ? selectedId : nextJobs[0]?.id));
    setSelectedId(job?.id);
    if (!job) { setInvoices([]); setPayments([]); setDelivery(undefined); return; }
    const nextInvoices = await financeApi.invoices(config, job.id); setInvoices(nextInvoices);
    const current = nextInvoices.find(isActiveRemoteInvoice);
    setPayments(current ? await financeApi.payments(config, current.id) : []);
    setDelivery(await financeApi.delivery(config, job.id));
  }
~~~

## src/remote-finance.tsx run

src/remote-finance.tsx:34

~~~typescript
run = (action: () => Promise<unknown>, afterSuccess?: () => void) => { setBusy(true); setError(""); void action().then(() => { afterSuccess?.(); return refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")).finally(() => setBusy(false)); }
~~~

## src/remote-finance.tsx issue

src/remote-finance.tsx:35

~~~typescript
issue = () => {
    if (!selected) return;
    run(() => financeApi.issueInvoice(config, selected.id, { ...(replacesInvoiceId ? { replacesInvoiceId } : {}) }, crypto.randomUUID()), () => setReplacesInvoiceId(undefined));
  }
~~~

## src/remote-finance.tsx voidInvoice

src/remote-finance.tsx:39

~~~typescript
voidInvoice = (invoice: RemoteInvoice) => {
    const reason = window.prompt(`Why should ${invoice.number} be voided?`, "") ?? "";
    if (reason.trim()) run(() => financeApi.voidInvoice(config, invoice.id, reason.trim(), crypto.randomUUID()));
  }
~~~

## src/remote-finance.tsx prepareReplacement

src/remote-finance.tsx:43

~~~typescript
prepareReplacement = (invoice: RemoteInvoice) => {
    setReplacesInvoiceId(invoice.id);
  }
~~~

## src/remote-finance.tsx creditAndRefund

src/remote-finance.tsx:46

~~~typescript
creditAndRefund = (invoice: RemoteInvoice) => {
    const amount = Number(window.prompt(`Credit/refund amount for ${invoice.number} (₹):`, ""));
    const reason = window.prompt("Credit note reason:", "") ?? "";
    if (!(amount > 0) || !reason.trim()) return;
    run(async () => {
      const note = await financeApi.issueCreditNote(config, invoice.id, { amountPaise: rupeesToPaise(String(amount)), reason: reason.trim() }, crypto.randomUUID());
      await financeApi.recordRefund(config, note.id, { amountPaise: rupeesToPaise(String(amount)), method: "upi" }, crypto.randomUUID());
    });
  }
~~~

## src/remote-finance.tsx download

src/remote-finance.tsx:55

~~~typescript
download = async (path: string, number: string) => {
    try {
      const response = await authenticatedFetch(config, path);
      if (!response.ok) throw new Error("FINANCIAL_DOCUMENT_DOWNLOAD_FAILED");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = remoteDocumentFilename(number); link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "FINANCIAL_DOCUMENT_DOWNLOAD_FAILED"); }
  }
~~~

## src/remote-finance.tsx pay

src/remote-finance.tsx:64

~~~typescript
pay = () => {
    if (!active || !(Number(payAmount) > 0)) return;
    run(() => financeApi.recordPayment(config, active.id, { amountPaise: rupeesToPaise(payAmount), method, reference }, crypto.randomUUID()));
  }
~~~

## src/remote-finance.tsx handover

src/remote-finance.tsx:68

~~~typescript
handover = () => {
    if (!selected || !deliveredBy.trim() || !(Number(finalOdometer) >= 0) || !acknowledgement.trim()) return;
    run(() => financeApi.completeHandover(config, selected.id, { deliveredBy, finalOdometer: Number(finalOdometer), acknowledgement }, crypto.randomUUID()));
  }
~~~

## src/remote-followups.tsx dateInput

src/remote-followups.tsx:6

~~~typescript
dateInput = (value: string | null) => value?.slice(0, 10) ?? ""
~~~

## src/remote-followups.tsx refresh

src/remote-followups.tsx:22

~~~typescript
refresh = async () => {
    const [nextFollowups, nextJobs] = await Promise.all([followupsApi.list(config), followupsApi.jobs(config)]);
    setFollowups(nextFollowups); setJobs(nextJobs);
    setJobId((current) => current || nextJobs[0]?.id || 0);
  }
~~~

## src/remote-followups.tsx run

src/remote-followups.tsx:29

~~~typescript
run = (action: () => Promise<unknown>, after?: () => void) => {
    setBusy(true); setError("");
    void action().then(async () => { after?.(); await refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "FOLLOWUPS_API_FAILED")).finally(() => setBusy(false));
  }
~~~

## src/remote-followups.tsx create

src/remote-followups.tsx:33

~~~typescript
create = (event: FormEvent) => {
    event.preventDefault(); if (!jobId || !note.trim()) return;
    run(() => followupsApi.create(config, { jobId, note: note.trim(), ...(dueAt ? { dueAt } : {}) }), () => { setNote(""); setDueAt(""); });
  }
~~~

## src/remote-followups.tsx beginEdit

src/remote-followups.tsx:37

~~~typescript
beginEdit = (item: RemoteFollowup) => { setEditing(item); setNote(item.note); setDueAt(dateInput(item.dueAt)); setOutcome(item.outcome); }
~~~

## src/remote-followups.tsx saveEdit

src/remote-followups.tsx:38

~~~typescript
saveEdit = (event: FormEvent) => {
    event.preventDefault(); if (!editing || !note.trim()) return;
    run(() => followupsApi.update(config, editing.id, { note: note.trim(), ...(dueAt ? { dueAt } : {}), outcome: outcome.trim() }), () => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); });
  }
~~~

## src/remote-followups.tsx complete

src/remote-followups.tsx:42

~~~typescript
complete = (item: RemoteFollowup) => run(() => followupsApi.complete(config, item.id, window.prompt("Completion outcome:", item.outcome) ?? item.outcome))
~~~

## src/remote-followups.tsx archive

src/remote-followups.tsx:43

~~~typescript
archive = (item: RemoteFollowup) => {
    const reason = window.prompt(`Why archive follow-up #${item.id}?`, "");
    if (reason?.trim()) run(() => followupsApi.archive(config, item.id, reason.trim()));
  }
~~~

## src/remote-followups.tsx search

src/remote-followups.tsx:47

~~~typescript
search = (event: FormEvent) => {
    event.preventDefault(); if (query.trim().length < 2) { setError("Enter at least 2 characters to search."); return; }
    setBusy(true); setError("");
    void followupsApi.search(config, query.trim()).then((payload) => setResults(payload.results)).catch((caught) => setError(caught instanceof Error ? caught.message : "SEARCH_API_FAILED")).finally(() => setBusy(false));
  }
~~~

## src/remote-sales.tsx currentMonthYear

src/remote-sales.tsx:13

~~~typescript
currentMonthYear = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
~~~

## src/remote-sales.tsx refresh

src/remote-sales.tsx:22

~~~typescript
refresh = async () => { const leadFilter = mode === "leads" ? leadFilterQuery(query, stage, createdMonth) : ""; const [nextLeads, nextQuotations] = await Promise.all([salesApi.leads(config, leadFilter), salesApi.quotations(config, mode === "quotations" ? quotationFilters : "")]); setLeads(nextLeads); setQuotations(nextQuotations); }
~~~

## src/remote-sales.tsx run

src/remote-sales.tsx:24

~~~typescript
run = (action: () => Promise<unknown>, after?: () => void) => { setBusy(true); setError(""); void action().then(async () => { after?.(); await refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "SALES_CRM_API_FAILED")).finally(() => setBusy(false)); }
~~~

## src/remote-sales.tsx closeLeadDialog

src/remote-sales.tsx:25

~~~typescript
closeLeadDialog = () => { setLeadDialog(null); setSelectedLead(null); }
~~~

## src/remote-sales.tsx saveLead

src/remote-sales.tsx:26

~~~typescript
saveLead = (draft: LeadFormDraft) => { const input: LeadInput = draft; run(() => leadDialog === "edit" && selectedLead ? salesApi.updateLead(config, selectedLead.id, input) : salesApi.createLead(config, input), closeLeadDialog); }
~~~

## src/remote-sales.tsx saveInlineLead

src/remote-sales.tsx:27

~~~typescript
saveInlineLead = async (lead: Lead, draft: LeadFormDraft) => { setBusy(true); setError(""); try { await salesApi.updateLead(config, lead.id, draft); await refresh(); return true; } catch (caught) { setError(caught instanceof Error ? caught.message : "SALES_CRM_API_FAILED"); return false; } finally { setBusy(false); } }
~~~

## src/remote-sales.tsx clearFilters

src/remote-sales.tsx:39

~~~typescript
clearFilters = () => { onQueryChange(""); onCreatedDateChange(""); onCreatedMonthChange(""); }
~~~

## src/report-templates.ts th

src/report-templates.ts:73

~~~typescript
th = (align: "left" | "right", label: string) => `<th style="background:${ACCENT};color:#fff;padding:7px 9px;text-align:${align};font-size:11px;font-weight:700">${label}</th>`
~~~

## src/report-templates.ts td

src/report-templates.ts:74

~~~typescript
td = (align: "left" | "right", body: string) => `<td style="border-bottom:1px solid ${LINE};padding:7px 9px;text-align:${align};vertical-align:top">${body}</td>`
~~~

## src/report-templates.ts heading

src/report-templates.ts:75

~~~typescript
heading = (label: string) => `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${MUTED};margin-bottom:4px">${label}</div>`
~~~

## src/report-templates.ts card

src/report-templates.ts:76

~~~typescript
card = (label: string, body: string) => `<div style="flex:1;min-width:0;background:#f4f6f8;border-radius:6px;padding:9px 12px">${heading(label)}${body}</div>`
~~~

## src/report-templates.ts cards

src/report-templates.ts:77

~~~typescript
cards = (...cells: string[]) => `<div style="display:flex;gap:16px;margin-bottom:14px">${cells.join("")}</div>`
~~~

## src/report-templates.ts parties

src/report-templates.ts:78

~~~typescript
parties = (customerHeading: string) => cards(
  card(customerHeading, "<strong>{{customer.name}}</strong><br>{{customer.mobile}}"),
  card("Vehicle", "<strong>{{vehicle.registration}}</strong> · {{vehicle.description}}<br>{{vehicle.km}} km · Job {{job.number}}"),
)
~~~

## src/report-templates.ts totalRow

src/report-templates.ts:83

~~~typescript
totalRow = (label: string, key: string) => `<div style="display:flex;justify-content:space-between;padding:3px 0"><span>${label}</span><span>{{${key}}}</span></div>`
~~~

## src/report-templates.ts totals

src/report-templates.ts:84

~~~typescript
totals = (totalKey: string) => `<div style="width:270px;margin-left:auto;margin-bottom:10px">${totalRow("Subtotal", "report.subtotal")}${totalRow("Discount", "report.discount")}${totalRow("GST", "report.gst")}<div style="display:flex;justify-content:space-between;border-top:2px solid ${INK};font-weight:700;font-size:14px;margin-top:4px;padding-top:6px"><span>Total</span><span>{{${totalKey}}}</span></div></div>`
~~~

## src/report-templates.ts section

src/report-templates.ts:88

~~~typescript
section = (label: string, body: string) => `<div style="margin-bottom:6px">${heading(label)}${body}</div>`
~~~

## src/report-templates.ts layout

src/report-templates.ts:91

~~~typescript
function layout(title: string, meta: string, body: string) {
  const company = `<div style="display:flex;align-items:center;gap:14px;min-width:0;flex:1">{{blocks.company_logo}}<div style="min-width:0"><div style="font-size:16px;font-weight:700">{{company.name}}</div><div style="font-size:10.5px;line-height:1.5">{{company.address}}<br>{{company.phone}} · {{company.email}} · GSTIN {{company.gstin}}</div></div></div>`;
  const right = `<div style="text-align:right;flex:none"><h1 style="margin:0;font-size:24px;letter-spacing:.04em">${title}</h1><div style="font-size:11.5px;margin-top:3px">${meta}</div></div>`;
  return `<main style="box-sizing:border-box;margin:0;padding:0;width:100%;min-height:1090px;font-family:Arial,sans-serif;font-size:12px;line-height:1.45;color:${INK};display:flex;flex-direction:column"><header style="box-sizing:border-box;background:${ACCENT};color:#fff;padding:22px 32px;display:flex;justify-content:space-between;align-items:center;gap:20px">${company}${right}</header><div style="box-sizing:border-box;flex:1;padding:20px 32px 26px;display:flex;flex-direction:column"><div style="flex:1">${body}</div>${signOff}${footer}</div></main>`;
}
~~~

## src/report-templates.ts namesIn

src/report-templates.ts:133

~~~typescript
namesIn = (html: string) => [...html.matchAll(/{{\s*([^{}]+?)\s*}}/g)].map((match) => match[1].trim())
~~~

## src/report-templates.ts escapeHtml

src/report-templates.ts:145

~~~typescript
escapeHtml = (value: unknown) => String(value ?? "—").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!)
~~~

## src/report-templates.ts value

src/report-templates.ts:146

~~~typescript
value = (input: string | number | null | undefined) => input === null || input === undefined || String(input).trim() === "" ? "—" : String(input)
~~~

## src/report-templates.ts below100

src/report-templates.ts:150

~~~typescript
below100 = (n: number) => n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`
~~~

## src/report-templates.ts below1000

src/report-templates.ts:151

~~~typescript
below1000 = (n: number) => `${n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " " : ""}` : ""}${below100(n % 100)}`
~~~

## src/report-templates.ts money

src/report-templates.ts:163

~~~typescript
money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)
~~~

## src/report-templates.ts date

src/report-templates.ts:164

~~~typescript
date = (input?: string) => {
  if (!input?.trim()) return "—";
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? input : parsed.toLocaleDateString("en-IN");
}
~~~

## src/report-templates.ts imageBlock

src/report-templates.ts:170

~~~typescript
imageBlock = (src: string | null, alt: string) => src && IMAGE_SRC.test(src) ? `<img src="${src}" alt="${escapeHtml(alt)}" style="display:block;max-width:150px;max-height:78px;object-fit:contain">` : ""
~~~

## src/report-templates.ts table

src/report-templates.ts:172

~~~typescript
function table(headers: string[], rows: Array<Array<string | number>>) {
  if (!rows.length) return "<p>—</p>";
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr>${headers.map((header) => `<th style="border:1px solid ${ACCENT};background:${ACCENT};color:#fff;padding:7px;text-align:left">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid ${LINE};padding:7px">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
~~~

## src/report-templates.ts paymentDetailsBlock

src/report-templates.ts:177

~~~typescript
function paymentDetailsBlock(settings: WorkshopBusinessSettings) {
  const rows = [
    ["GSTIN", settings.billing.gstin],
    ["Account holder", settings.billing.bankAccountHolder],
    ["Bank", settings.billing.bankName],
    ["Account number", settings.billing.bankAccountNumber],
    ["IFSC", settings.billing.bankIfsc],
    ["Branch", settings.billing.bankBranch],
    ["UPI ID", settings.billing.upiId],
  ].filter((row) => row[1].trim());
  if (!rows.length) return "";
  return `<section style="margin-top:20px"><h3 style="margin:0 0 4px;font-size:12px">Tax &amp; Payment Details</h3>${table(["Detail", "Value"], rows)}</section>`;
}
~~~

## src/report-templates.ts scalar

src/report-templates.ts:300

~~~typescript
scalar = (text: string) => text.replace(/{{\s*([^{}]+?)\s*}}/g, (_match, rawName: string) => {
    const name = rawName.trim();
    const replacement = values[name] ?? "—";
    return blockNames.has(name) ? replacement : escapeHtml(replacement);
  })
~~~

## src/sales-api.ts request

src/sales-api.ts:12

~~~typescript
async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> { const response = await authenticatedFetch(config, path, init); if (!response.ok) { const body = await response.json().catch(() => ({})) as { code?: string }; throw new Error(body.code ?? "SALES_CRM_API_FAILED"); } return response.json() as Promise<T>; }
~~~

## src/sales-api.ts json

src/sales-api.ts:13

~~~typescript
json = (method: "POST" | "PUT", body: unknown): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
~~~

## src/sales-lead-dialog.tsx save

src/sales-lead-dialog.tsx:34

~~~typescript
save = (event: FormEvent) => { event.preventDefault(); onSave(draft); }
~~~

## src/sales-lead-dialog.tsx update

src/sales-lead-dialog.tsx:35

~~~typescript
update = (patch: Partial<LeadFormDraft>) => setDraft((current) => ({ ...current, ...patch }))
~~~

## src/sales-lead-register.tsx leadDraft

src/sales-lead-register.tsx:14

~~~typescript
leadDraft = (lead: Lead): LeadFormDraft => ({
  displayName: lead.displayName, phone: lead.phone, company: lead.company,
  companyNotEntered: lead.companyNotEntered, email: lead.email,
  emailNotEntered: lead.emailNotEntered, address: lead.address,
  serviceInterest: lead.serviceInterest, notes: lead.notes, stage: lead.stage,
  temperature: lead.temperature, followUpDue: lead.followUpDue,
  siteVisitCompleted: lead.siteVisitCompleted, siteVisitDate: lead.siteVisitDate,
})
~~~

## src/sales-lead-register.tsx monthYearLabel

src/sales-lead-register.tsx:41

~~~typescript
function monthYearLabel(month: string) {
  const date = new Date(`${month}-01T00:00:00`);
  return Number.isNaN(date.valueOf()) ? month : date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}
~~~

## src/sales-lead-register.tsx update

src/sales-lead-register.tsx:105

~~~typescript
update = (lead: Lead, patch: Partial<LeadFormDraft>) => {
    setDrafts((current) => ({ ...current, [lead.id]: { ...(current[lead.id] ?? leadDraft(lead)), ...patch } }));
    setDirtyIds((current) => new Set(current).add(lead.id));
  }
~~~

## src/sales-lead-register.tsx cancel

src/sales-lead-register.tsx:109

~~~typescript
cancel = (id: number) => {
    setDrafts((current) => { const next = { ...current }; delete next[id]; return next; });
    setDirtyIds((current) => { const next = new Set(current); next.delete(id); return next; });
  }
~~~

## src/sales-lead-register.tsx save

src/sales-lead-register.tsx:113

~~~typescript
save = async (lead: Lead) => {
    const draft = drafts[lead.id] ?? leadDraft(lead);
    setSavingIds((current) => new Set(current).add(lead.id));
    try {
      if (await onSave(lead, draft)) cancel(lead.id);
    } finally {
      setSavingIds((current) => { const next = new Set(current); next.delete(lead.id); return next; });
    }
  }
~~~

## src/ui-kit.tsx onClickAway

src/ui-kit.tsx:30

~~~typescript
onClickAway = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }
~~~

## src/ui-kit.tsx onEscape

src/ui-kit.tsx:31

~~~typescript
onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }
~~~

## src/ui-kit.tsx run

src/ui-kit.tsx:35

~~~typescript
run = (action: (report: ExportReport<T>) => void) => { action(report); setOpen(false); }
~~~

## src/ui-kit.tsx focusable

src/ui-kit.tsx:65

~~~typescript
focusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])
~~~

## src/ui-kit.tsx onEscape

src/ui-kit.tsx:66

~~~typescript
onEscape = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== stackId) return;
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === 'Tab') { const items = focusable(); if (!items.length) { event.preventDefault(); panelRef.current?.focus(); return; } const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    }
~~~

## src/ui-kit.tsx dismissIfOutside

src/ui-kit.tsx:94

~~~typescript
dismissIfOutside = (event: PointerEvent | FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onDismissRef.current();
    }
~~~