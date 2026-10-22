# Exact component implementations
Source evidence, not proof of execution. Includes private handlers, state defaults and render branches.

## CMP-admin-console-AdminConsole

src/admin-console.tsx:116-288

~~~tsx
export function AdminConsole({
  state,
  mutate,
  actingUser,
  cognitoConfig,
  onThemeSaved,
  onStateSaved,
  initialTab,
  initialReportCategory,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actingUser: User;
  cognitoConfig?: CognitoConfig;
  onThemeSaved?: (theme: AppTheme) => void;
  onStateSaved?: () => void;
  initialTab?: AdminTab;
  initialReportCategory?: ReportCategory;
}) {
  const [tab, setTab] = useState<AdminTab>(initialTab ?? "Users");
  const [adminState, setAdminState] = useState<AdminDemoState>(() =>
    loadAdminDemoState(),
  );
  const [templateDirty, setTemplateDirty] = useState(false);
  const [storageError, setStorageError] = useState("");

  /** Applies a pure admin-state change, optionally appends a log entry, then persists to sessionStorage. */
  const commit = (
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
  };

  const refresh = () => setAdminState(loadAdminDemoState());
  const managerDepartments = state.service_departments.reduce<Record<number, string[]>>((result, department) => {
    department.manager_ids.forEach((managerId) => { (result[managerId] ??= []).push(department.name); });
    return result;
  }, {});

  return (
    <section className="workspace single-panel admin-console">
      <div className="desk-panel">
        <PanelTitle
          icon={<ShieldCheck />}
          title="Admin Console"
          subtitle="Owner/Admin configuration for this demo session"
        />
        <div
          className="management-tabs"
          role="tablist"
          aria-label="Admin Console tabs"
        >
          {ADMIN_TABS.map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? "active" : ""}
              onClick={() => {
                if (item === tab) return;
                if (
                  tab === "Report Templates" &&
                  templateDirty &&
                  !window.confirm("Discard unsaved template changes?")
                )
                  return;
                setTemplateDirty(false);
                setTab(item);
              }}
            >
              {ADMIN_TAB_LABELS[item] ?? item}
            </button>
          ))}
        </div>
        {storageError && (
          <div className="api-error" role="alert">
            <p>{storageError}</p>
          </div>
        )}
        {tab === "Users" && (
          <UserManager
            users={state.users}
            mutate={mutate}
            actingUser={actingUser}
            cognitoConfig={cognitoConfig}
            managerDepartments={managerDepartments}
          />
        )}
        {tab === "Team Structure" && <TeamStructureTab state={state} mutate={mutate} cognitoConfig={cognitoConfig} />}
        {tab === "Service Task Catalog" && (
          <ServiceTaskCatalog
            items={state.service_catalog}
            departments={state.service_departments}
            brands={state.service_brands}
            segments={state.car_segments}
            mutate={mutate}
            actor={actingUser}
          />
        )}
        {tab === "Roles & Page Access" && (
          <RolesPageAccessTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
          />
        )}
        {tab === "Business Settings" && (
          <BusinessSettingsTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
          />
        )}
        {tab === "App Theme" && (
          <AppThemeTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
            onThemeSaved={onThemeSaved}
          />
        )}
        {tab === "Company Settings" && (
          <CompanySettingsTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
          />
        )}
        {tab === "Report Templates" && (
          <ReportTemplatesTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
            onDirtyChange={setTemplateDirty}
            initialCategory={initialReportCategory}
          />
        )}
        {tab === "Inventory Import" && (
          <InventoryImportTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
            state={state}
          />
        )}
        {tab === "Support & Logs" && (
          <SupportLogsTab
            adminState={adminState}
            commit={commit}
            refresh={refresh}
            actingUser={actingUser}
          />
        )}
      </div>
    </section>
  );
}
~~~

## CMP-admin-console-TeamStructureTab

src/admin-console.tsx:290-301

~~~tsx
function TeamStructureTab({ state, mutate, cognitoConfig }: { state: WorkshopState; mutate: Mutate; cognitoConfig?: CognitoConfig }) {
  const [remote, setRemote] = useState<AdminDirectory>();
  const [error, setError] = useState("");
  const refreshRemote = async () => {
    if (!cognitoConfig) return;
    try { setRemote(await adminUsersApi.list(cognitoConfig)); setError(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "TEAM_STRUCTURE_API_FAILED"); }
  };
  useEffect(() => { void refreshRemote(); }, [cognitoConfig]);
  if (cognitoConfig) return <section className="admin-tab team-structure"><TeamStructureHeader refresh={refreshRemote} /><p className="team-structure-intro">Departments, appointed service managers, and branch-qualified advisor teams.</p>{error && <p className="api-error" role="alert">{error}</p>}<RemoteTeamStructure directory={remote} config={cognitoConfig} onChanged={refreshRemote} /></section>;
  return <LocalTeamStructure state={state} mutate={mutate} />;
}
~~~

## CMP-admin-console-TeamStructureHeader

src/admin-console.tsx:303-305

~~~tsx
function TeamStructureHeader({ refresh }: { refresh?: () => void }) {
  return <div className="panel-actions"><div><h2>Team Structure</h2><p>Create departments, appoint managers, then build each manager's advisor team.</p></div>{refresh && <button type="button" className="secondary-action team-icon-action" onClick={refresh}><RefreshCw size={16} />Refresh</button>}</div>;
}
~~~

## CMP-admin-console-LocalTeamStructure

src/admin-console.tsx:307-336

~~~tsx
function LocalTeamStructure({ state, mutate }: { state: WorkshopState; mutate: Mutate }) {
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  const [appointmentManagerId, setAppointmentManagerId] = useState(0);
  const [teamManagerId, setTeamManagerId] = useState(0);
  const [advisorId, setAdvisorId] = useState(0);
  const [renameDepartment, setRenameDepartment] = useState<WorkshopState["service_departments"][number]>();
  const selected = state.service_departments.find((department) => department.id === selectedId);
  const managers = state.users.filter((user) => user.role === "service_manager" && !user.archived_at);
  const advisors = state.users.filter((user) => user.role === "service" && !user.archived_at);

  useEffect(() => { setAppointmentManagerId(0); setTeamManagerId(0); setAdvisorId(0); }, [selectedId]);
  useEffect(() => { if (teamManagerId && !selected?.manager_ids.includes(teamManagerId)) setTeamManagerId(0); }, [selected, teamManagerId]);
  useEffect(() => { if (selectedId && !selected) setSelectedId(undefined); }, [selected, selectedId]);

  const create = (event: React.FormEvent) => {
    event.preventDefault();
    let departmentId = 0;
    if (mutate((db) => { departmentId = createServiceDepartment(db, name); })) {
      setName("");
      setSelectedId(departmentId);
    }
  };
  return <section className="admin-tab team-structure"><TeamStructureHeader /><p className="team-structure-intro">Demo branch departments, manager appointments, and advisor teams.</p>
    <form className="team-create-form" onSubmit={create}><label>New department<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" /></label><button className="primary-action" type="submit"><Plus size={17} />Create department</button></form>
    <DepartmentTable departments={state.service_departments} selectedId={selectedId} users={state.users} onManage={setSelectedId} onRename={setRenameDepartment} onArchive={(department) => mutate((db) => updateServiceDepartment(db, department.id, department.name, "ARCHIVED"))} />
    {selected && <DepartmentTeamPanel departmentName={selected.name} managers={selected.manager_ids.map((id) => state.users.find((user) => user.id === id)).filter((user): user is User => Boolean(user))} advisorTeams={selected.advisor_teams.map((team) => ({ managerId: team.manager_id, advisor: state.users.find((user) => user.id === team.advisor_id) })).filter((team): team is { managerId: number; advisor: User } => Boolean(team.advisor))} appointmentManagerId={appointmentManagerId} teamManagerId={teamManagerId} advisorId={advisorId} eligibleManagers={managers.filter((user) => !selected.manager_ids.includes(user.id))} eligibleAdvisors={advisors} onAppointmentManagerChange={setAppointmentManagerId} onTeamManagerChange={setTeamManagerId} onAdvisorChange={setAdvisorId} onAppoint={() => { if (mutate((db) => appointServiceDepartmentManager(db, selected.id, appointmentManagerId))) { setTeamManagerId(appointmentManagerId); setAppointmentManagerId(0); } }} onRemoveManager={(managerId) => { if (mutate((db) => removeServiceDepartmentManager(db, selected.id, managerId)) && teamManagerId === managerId) setTeamManagerId(0); }} onAssignAdvisor={() => { if (mutate((db) => assignServiceAdvisorTeam(db, selected.id, teamManagerId, advisorId))) setAdvisorId(0); }} onRemoveAdvisor={(managerId, nextAdvisorId) => mutate((db) => removeServiceAdvisorTeam(db, selected.id, managerId, nextAdvisorId))} />}
    {renameDepartment && <DepartmentRenameDialog key={renameDepartment.id} departmentName={renameDepartment.name} onClose={() => setRenameDepartment(undefined)} onSave={(name) => { if (mutate((db) => updateServiceDepartment(db, renameDepartment.id, name, renameDepartment.status))) setRenameDepartment(undefined); }} />}
  </section>;
}
~~~

## CMP-admin-console-DepartmentRenameDialog

src/admin-console.tsx:338-341

~~~tsx
function DepartmentRenameDialog({ departmentName, onSave, onClose }: { departmentName: string; onSave: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState(departmentName);
  return <Dialog title="Rename department" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSave(name); }}><label>Department name<input aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)} /></label><div className="action-row"><button className="primary-action" type="submit"><Pencil size={17} />Save department</button><button type="button" onClick={onClose}>Cancel</button></div></form></Dialog>;
}
~~~

## CMP-admin-console-DepartmentTable

src/admin-console.tsx:343-346

~~~tsx
function DepartmentTable({ departments, selectedId, users, onManage, onRename, onArchive }: { departments: WorkshopState["service_departments"]; selectedId?: number; users: User[]; onManage: (id: number) => void; onRename: (department: WorkshopState["service_departments"][number]) => void; onArchive: (department: WorkshopState["service_departments"][number]) => void }) {
  const names = (ids: number[]) => ids.map((id) => users.find((user) => user.id === id)?.name).filter(Boolean).join(", ");
  return <div className="table-wrap team-department-table"><table aria-label="Service departments"><thead><tr><th>Department</th><th>Status</th><th>Managers</th><th>Advisor team</th><th>Actions</th></tr></thead><tbody>{departments.map((department) => <tr key={department.id} className={selectedId === department.id ? "team-department-selected" : undefined}><td>{department.name}</td><td>{department.status}</td><td>{names(department.manager_ids) || "Unappointed"}</td><td>{names(department.advisor_team_ids) || "—"}</td><td><div className="grid-actions"><button type="button" className="grid-action" onClick={() => onManage(department.id)}><UsersRound size={15} />Manage team</button><button type="button" className="grid-action" onClick={() => onRename(department)}><Pencil size={15} />Rename</button><button type="button" className="grid-action grid-action-danger" onClick={() => onArchive(department)} disabled={department.status === "ARCHIVED"}><Archive size={15} />Archive</button></div></td></tr>)}</tbody></table></div>;
}
~~~

## CMP-admin-console-DepartmentTeamPanel

src/admin-console.tsx:349-352

~~~tsx
function DepartmentTeamPanel({ departmentName, managers, advisorTeams, appointmentManagerId, teamManagerId, advisorId, eligibleManagers, eligibleAdvisors, onAppointmentManagerChange, onTeamManagerChange, onAdvisorChange, onAppoint, onRemoveManager, onAssignAdvisor, onRemoveAdvisor }: { departmentName: string; managers: User[]; advisorTeams: TeamAdvisor[]; appointmentManagerId: number; teamManagerId: number; advisorId: number; eligibleManagers: User[]; eligibleAdvisors: User[]; onAppointmentManagerChange: (id: number) => void; onTeamManagerChange: (id: number) => void; onAdvisorChange: (id: number) => void; onAppoint: () => void; onRemoveManager: (id: number) => void; onAssignAdvisor: () => void; onRemoveAdvisor: (managerId: number, advisorId: number) => void }) {
  const selectedManager = managers.find((manager) => manager.id === teamManagerId);
  return <section className="team-details" aria-label={`${departmentName} team management`}><div className="team-details-heading"><UsersRound size={20} /><div><h3>{departmentName}</h3><p>Eligible managers have the Service Department Manager role; eligible advisors have the Service Advisor role.</p></div></div><div className="team-details-grid"><section className="team-section"><h4>Managers</h4><div className="team-control-grid"><label>Eligible manager<select aria-label="Eligible manager" value={appointmentManagerId} onChange={(event) => onAppointmentManagerChange(Number(event.target.value))}><option value={0}>Select eligible manager</option>{eligibleManagers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}</select></label><button type="button" className="primary-action" disabled={!appointmentManagerId} onClick={onAppoint}><UserPlus size={17} />Appoint manager</button></div><div className="team-member-list">{managers.length ? managers.map((manager) => <div className="team-member" key={manager.id}><span>{manager.name}</span><button type="button" className="secondary-action" onClick={() => onRemoveManager(manager.id)}><UserMinus size={16} />Remove</button></div>) : <p className="empty-state">No managers appointed yet.</p>}</div></section><section className="team-section"><h4>Advisor team</h4><div className="team-control-grid"><label>Appointed manager<select aria-label="Appointed manager" value={teamManagerId} onChange={(event) => onTeamManagerChange(Number(event.target.value))}><option value={0}>Select appointed manager</option>{managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}</select></label><label>Eligible advisor<select aria-label="Eligible advisor" value={advisorId} disabled={!selectedManager} onChange={(event) => onAdvisorChange(Number(event.target.value))}><option value={0}>{selectedManager ? "Select eligible advisor" : "Choose a manager first"}</option>{eligibleAdvisors.map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}</select></label><button type="button" className="primary-action team-assign-action" disabled={!selectedManager || !advisorId} onClick={onAssignAdvisor}><UserPlus size={17} />Assign advisor</button></div>{!selectedManager ? <p className="permission-note team-disabled-note">Choose an appointed manager to add or view that advisor team.</p> : <div className="team-member-list"><p className="team-manager-label">{selectedManager.name}'s advisors</p>{advisorTeams.filter((team) => team.managerId === selectedManager.id).map((team) => <div className="team-member" key={team.advisor.id}><span>{team.advisor.name}</span><button type="button" className="secondary-action" onClick={() => onRemoveAdvisor(team.managerId, team.advisor.id)}><UserMinus size={16} />Remove</button></div>)}{!advisorTeams.some((team) => team.managerId === selectedManager.id) && <p className="empty-state">No advisors assigned to this manager.</p>}</div>}</section></div></section>;
}
~~~

## CMP-admin-console-RemoteTeamStructure

src/admin-console.tsx:354-364

~~~tsx
function RemoteTeamStructure({ directory, config, onChanged }: { directory?: AdminDirectory; config: CognitoConfig; onChanged: () => Promise<void> }) {
  const [name, setName] = useState(""); const [departmentId, setDepartmentId] = useState(""); const [appointmentManagerId, setAppointmentManagerId] = useState(""); const [teamManagerId, setTeamManagerId] = useState(""); const [advisorId, setAdvisorId] = useState(""); const [error, setError] = useState(""); const [renameDepartment, setRenameDepartment] = useState<AdminDirectory["serviceDepartments"][number]>();
  const department = directory?.serviceDepartments.find((item) => item.id === departmentId);
  const branchId = department?.branchId ?? directory?.branches[0]?.id ?? "";
  const managerUsers = directory?.users.filter((user) => user.status === "ACTIVE" && user.roles.some((role) => role.name === "Service Department Manager") && user.branchIds.includes(branchId)) ?? [];
  const advisorUsers = directory?.users.filter((user) => user.status === "ACTIVE" && user.roles.some((role) => role.name === "Service Advisor") && user.branchIds.includes(branchId)) ?? [];
  useEffect(() => { setAppointmentManagerId(""); setTeamManagerId(""); setAdvisorId(""); }, [departmentId]);
  useEffect(() => { if (teamManagerId && !department?.managers.some((manager) => manager.membershipId === teamManagerId)) setTeamManagerId(""); }, [department, teamManagerId]);
  const run = async (action: () => Promise<unknown>) => { try { setError(""); await action(); await onChanged(); } catch (caught) { setError(caught instanceof Error ? caught.message : "TEAM_STRUCTURE_API_FAILED"); } };
  return <><form className="team-create-form" onSubmit={(event) => { event.preventDefault(); if (branchId) void run(async () => { const result = await adminUsersApi.createServiceDepartment(config, { branchId, name }); setName(""); setDepartmentId(result.serviceDepartment.id); }); }}><label>New department<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" /></label><button className="primary-action" type="submit"><Plus size={17} />Create department</button></form>{error && <p className="api-error" role="alert">{error}</p>}<div className="table-wrap team-department-table"><table aria-label="Connected service departments"><thead><tr><th>Department</th><th>Branch</th><th>Managers</th><th>Advisor team</th><th>Actions</th></tr></thead><tbody>{directory?.serviceDepartments.map((item) => <tr key={item.id} className={departmentId === item.id ? "team-department-selected" : undefined}><td>{item.name}</td><td>{item.branchName}</td><td>{item.managers.map((manager) => manager.name).join(", ") || "Unappointed"}</td><td>{item.advisorTeams.map((advisor) => advisor.advisorName).join(", ") || "—"}</td><td><div className="grid-actions"><button type="button" className="grid-action" onClick={() => setDepartmentId(item.id)}><UsersRound size={15} />Manage team</button><button type="button" className="grid-action" onClick={() => setRenameDepartment(item)}><Pencil size={15} />Rename</button><button type="button" className="grid-action grid-action-danger" disabled={item.status === "ARCHIVED"} onClick={() => void run(() => adminUsersApi.updateServiceDepartment(config, item.id, { name: item.name, status: "ARCHIVED" }))}><Archive size={15} />Archive</button></div></td></tr>)}</tbody></table></div>{department && <RemoteDepartmentTeamPanel department={department} appointmentManagerId={appointmentManagerId} teamManagerId={teamManagerId} advisorId={advisorId} managerUsers={managerUsers} advisorUsers={advisorUsers} onAppointmentManagerChange={setAppointmentManagerId} onTeamManagerChange={setTeamManagerId} onAdvisorChange={setAdvisorId} onAppoint={() => void run(async () => { await adminUsersApi.appointManager(config, department.id, appointmentManagerId); setTeamManagerId(appointmentManagerId); setAppointmentManagerId(""); })} onRemoveManager={(managerId) => void run(() => adminUsersApi.removeManager(config, department.id, managerId))} onAssignAdvisor={() => void run(async () => { await adminUsersApi.assignAdvisorTeam(config, department.id, teamManagerId, advisorId); setAdvisorId(""); })} onRemoveAdvisor={(managerId, nextAdvisorId) => void run(() => adminUsersApi.removeAdvisorTeam(config, department.id, managerId, nextAdvisorId))} />}{renameDepartment && <DepartmentRenameDialog key={renameDepartment.id} departmentName={renameDepartment.name} onClose={() => setRenameDepartment(undefined)} onSave={(nextName) => void run(async () => { await adminUsersApi.updateServiceDepartment(config, renameDepartment.id, { name: nextName, status: renameDepartment.status }); setRenameDepartment(undefined); })} />}</>;
}
~~~

## CMP-admin-console-RemoteDepartmentTeamPanel

src/admin-console.tsx:366-370

~~~tsx
function RemoteDepartmentTeamPanel({ department, appointmentManagerId, teamManagerId, advisorId, managerUsers, advisorUsers, onAppointmentManagerChange, onTeamManagerChange, onAdvisorChange, onAppoint, onRemoveManager, onAssignAdvisor, onRemoveAdvisor }: { department: NonNullable<AdminDirectory["serviceDepartments"][number]>; appointmentManagerId: string; teamManagerId: string; advisorId: string; managerUsers: AdminDirectory["users"]; advisorUsers: AdminDirectory["users"]; onAppointmentManagerChange: (id: string) => void; onTeamManagerChange: (id: string) => void; onAdvisorChange: (id: string) => void; onAppoint: () => void; onRemoveManager: (id: string) => void; onAssignAdvisor: () => void; onRemoveAdvisor: (managerId: string, advisorId: string) => void }) {
  const managers = department.managers;
  const selectedManager = managers.find((manager) => manager.membershipId === teamManagerId);
  return <section className="team-details" aria-label={`${department.name} team management`}><div className="team-details-heading"><UsersRound size={20} /><div><h3>{department.name}</h3><p>Only active users with the matching role in this branch are shown.</p></div></div><div className="team-details-grid"><section className="team-section"><h4>Managers</h4><div className="team-control-grid"><label>Eligible manager<select aria-label="Eligible manager" value={appointmentManagerId} onChange={(event) => onAppointmentManagerChange(event.target.value)}><option value="">Select eligible manager</option>{managerUsers.filter((user) => !managers.some((manager) => manager.membershipId === user.id)).map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><button type="button" className="primary-action" disabled={!appointmentManagerId} onClick={onAppoint}><UserPlus size={17} />Appoint manager</button></div><div className="team-member-list">{managers.length ? managers.map((manager) => <div className="team-member" key={manager.membershipId}><span>{manager.name}</span><button type="button" className="secondary-action" onClick={() => onRemoveManager(manager.membershipId)}><UserMinus size={16} />Remove</button></div>) : <p className="empty-state">No managers appointed yet.</p>}</div></section><section className="team-section"><h4>Advisor team</h4><div className="team-control-grid"><label>Appointed manager<select aria-label="Appointed manager" value={teamManagerId} onChange={(event) => onTeamManagerChange(event.target.value)}><option value="">Select appointed manager</option>{managers.map((manager) => <option key={manager.membershipId} value={manager.membershipId}>{manager.name}</option>)}</select></label><label>Eligible advisor<select aria-label="Eligible advisor" value={advisorId} disabled={!selectedManager} onChange={(event) => onAdvisorChange(event.target.value)}><option value="">{selectedManager ? "Select eligible advisor" : "Choose a manager first"}</option>{advisorUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><button type="button" className="primary-action team-assign-action" disabled={!selectedManager || !advisorId} onClick={onAssignAdvisor}><UserPlus size={17} />Assign advisor</button></div>{!selectedManager ? <p className="permission-note team-disabled-note">Choose an appointed manager to add or view that advisor team.</p> : <div className="team-member-list"><p className="team-manager-label">{selectedManager.name}'s advisors</p>{department.advisorTeams.filter((team) => team.managerMembershipId === selectedManager.membershipId).map((team) => <div className="team-member" key={team.advisorMembershipId}><span>{team.advisorName}</span><button type="button" className="secondary-action" onClick={() => onRemoveAdvisor(team.managerMembershipId, team.advisorMembershipId)}><UserMinus size={16} />Remove</button></div>)}{!department.advisorTeams.some((team) => team.managerMembershipId === selectedManager.membershipId) && <p className="empty-state">No advisors assigned to this manager.</p>}</div>}</section></div></section>;
}
~~~

## CMP-admin-console-ServiceTaskCatalog

src/admin-console.tsx:380-527

~~~tsx
function ServiceTaskCatalog({
  items,
  departments,
  brands,
  segments,
  mutate,
  actor,
}: {
  items: WorkshopState["service_catalog"];
  departments: WorkshopState["service_departments"];
  brands: WorkshopState["service_brands"];
  segments: WorkshopState["car_segments"];
  mutate: Mutate;
  actor: User;
}) {
  const [subTab, setSubTab] = useState<ServiceTaskSubTab>("tasks");
  const [query, setQuery] = useState("");
  const [departmentId, setDepartmentId] = useState(0);
  const [brandId, setBrandId] = useState(0);
  const [segmentId, setSegmentId] = useState(0);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<
    { item?: WorkshopState["service_catalog"][number] } | undefined
  >();
  const visible = items.filter((item) =>
    normalizeSearch(item.name).includes(normalizeSearch(query)) &&
    (!departmentId || item.service_department_id === departmentId) &&
    (brandId === 0 ||
      (brandId === -1 ? item.brand_id == null : item.brand_id === brandId)) &&
    (segmentId === 0 ||
      (segmentId === -1
        ? item.car_segment_id == null
        : item.car_segment_id === segmentId)),
  );
  const clearFilters = () => { setQuery(""); setDepartmentId(0); setBrandId(0); setSegmentId(0); };
  return (
    <section className="manager-panel" aria-label="Service task management">
      <div className="sub-tabs" role="tablist" aria-label="Service task sections">
        <button
          id="service-tasks-tab"
          type="button"
          role="tab"
          aria-selected={subTab === "tasks"}
          aria-controls="service-tasks-panel"
          className={subTab === "tasks" ? "active" : ""}
          onClick={() => setSubTab("tasks")}
        >
          Service Tasks
        </button>
        <button
          id="catalogs-tab"
          type="button"
          role="tab"
          aria-selected={subTab === "catalogs"}
          aria-controls="catalogs-panel"
          className={subTab === "catalogs" ? "active" : ""}
          onClick={() => setSubTab("catalogs")}
        >
          Catalogs
        </button>
      </div>
      {subTab === "tasks" && <div id="service-tasks-panel" className="service-task-panel" role="tabpanel" aria-labelledby="service-tasks-tab" aria-label="Service Tasks">
      <div className="panel-actions">
        <div>
          <h3>Service Tasks</h3>
          <p>Service tasks by department, brand, and car segment.</p>
        </div>
        <button
          type="button"
          className="primary-action"
          onClick={() => setDialog({})}
        >
          Add Service Task
        </button>
      </div>
      <div className="store-filter-grid compact-management-toolbar">
        <label className="list-search">
          Search catalog
          <input
            type="search"
            aria-label="Search catalog services"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search service tasks"
          />
        </label>
        <label>Department<select aria-label="Filter department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}><option value={0}>All departments</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
        <label>Brand name<select aria-label="Filter brand name" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}><option value={0}>All brands</option><option value={-1}>- NA -</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
        <label>Car segment<select aria-label="Filter car segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}><option value={0}>All segments</option><option value={-1}>- NA -</option>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}</select></label>
        <ListSearchActions onClear={clearFilters} />
      </div>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <div className="table-wrap">
        <table aria-label="Service task catalog">
          <thead>
            <tr>
              <th>Department</th>
              <th>Brand name</th>
              <th>Car Segment</th>
              <th>Service task</th>
              <th>Pre-GST base rate</th>
              <th>Applicable GST</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <CatalogRow
                key={item.id}
                item={item}
                actor={actor}
                mutate={mutate}
                setError={setError}
                onEdit={() => setDialog({ item })}
              />
            ))}
          </tbody>
        </table>
      </div>
      {!visible.length && (
        <p className="empty-state">No active catalog services.</p>
      )}
      </div>}
      {subTab === "catalogs" && <div id="catalogs-panel" className="service-task-catalogs-panel" role="tabpanel" aria-labelledby="catalogs-tab" aria-label="Catalogs">
      <div className="team-details-grid">
        <CatalogMasterList title="Brand names" table="service_brands" items={brands} mutate={mutate} />
        <CatalogMasterList title="Car segments" table="car_segments" items={segments} mutate={mutate} />
      </div>
      </div>}
      {dialog && (
        <CatalogServiceTaskDialog
          key={dialog.item?.id ?? "new"}
          item={dialog.item}
          departments={departments}
          brands={brands}
          segments={segments}
          actor={actor}
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
    </section>
  );
}
~~~

## CMP-admin-console-CatalogRow

src/admin-console.tsx:529-576

~~~tsx
function CatalogRow({
  item,
  actor,
  mutate,
  setError,
  onEdit,
}: {
  item: WorkshopState["service_catalog"][number];
  actor: User;
  mutate: Mutate;
  setError: (value: string) => void;
  onEdit: () => void;
}) {
  return (
    <tr>
      <td>{item.department_name ?? "—"}</td>
      <td>{item.brand_name ?? "—"}</td>
      <td>{item.car_segment_name ?? "—"}</td>
      <td>{item.name}</td>
      <td>{money(item.base_rate)}</td>
      <td>{item.gst_rate === 0 ? "No GST (0%)" : `${item.gst_rate}%`}</td>
      <td>
        <div className="grid-actions">
          <button
            type="button"
            className="grid-action"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="grid-action grid-action-danger"
            onClick={() =>
              mutate(
                (db) =>
                  archiveServiceCatalogItemForActor(db, actor.id, item.id),
                setError,
              )
            }
          >
            Archive
          </button>
        </div>
      </td>
    </tr>
  );
}
~~~

## CMP-admin-console-CatalogServiceTaskDialog

src/admin-console.tsx:583-715

~~~tsx
function CatalogServiceTaskDialog({
  item,
  departments,
  brands,
  segments,
  actor,
  mutate,
  onClose,
}: {
  item?: WorkshopState["service_catalog"][number];
  departments: WorkshopState["service_departments"];
  brands: WorkshopState["service_brands"];
  segments: WorkshopState["car_segments"];
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [rate, setRate] = useState(item?.base_rate ?? 0);
  const [gstRate, setGstRate] = useState(item?.gst_rate ?? 18);
  const [departmentId, setDepartmentId] = useState(item?.service_department_id ?? 0);
  const [brandId, setBrandId] = useState(item?.brand_id ?? 0);
  const [segmentId, setSegmentId] = useState(item?.car_segment_id ?? 0);
  const [quickAdd, setQuickAdd] = useState<"service_brands" | "car_segments">();
  const [error, setError] = useState("");
  const save = (event: React.FormEvent) => {
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
  };
  return (
    <Dialog
      wide
      title={item ? "Edit Service Task" : "Add Service Task"}
      subtitle="Changes apply to future task-list selections only."
      onClose={onClose}
      footer={
        <button className="primary-action" type="submit" form="service-task-dialog-form">
          {item ? "Save changes" : "Add service task"}
        </button>
      }
    >
      <form
        id="service-task-dialog-form"
        className="service-task-dialog-form"
        onSubmit={save}
      >
        <div className="service-task-form-row">
          <label>
            Department
            <select data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}>
              <option value={0}>Select department</option>
              {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
            </select>
          </label>
          <div className="service-task-field">
            <div className="service-task-field-header">
              <label htmlFor="service-task-brand">Brand name</label>
              <button type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}>Quick add new Brand</button>
            </div>
            <select id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}>
              <option value={0}>- NA -</option>
              {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </div>
        </div>
        <div className="service-task-form-row">
          <div className="service-task-field">
            <div className="service-task-field-header">
              <label htmlFor="service-task-car-segment">Car segment</label>
              <button type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}>Quick add new Car Segment</button>
            </div>
            <select id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}>
              <option value={0}>- NA -</option>
              {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
            </select>
          </div>
          <label>
            Service name
            <input
              aria-label="Catalog service name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        </div>
        <div className="service-task-rate-grid">
          <label>
            Pre-GST base rate
            <input
              aria-label="Catalog base rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </label>
          <SearchSelect
            label="Applicable GST"
            options={CATALOG_GST_OPTIONS}
            value={gstRate}
            onChange={(value) => setGstRate(Number(value))}
            placeholder="Select GST rate"
          />
        </div>
        {error && <p className="error-text" role="alert">{error}</p>}
      </form>
      {quickAdd && <CatalogMasterDialog table={quickAdd} title={quickAdd === "service_brands" ? "Add Brand name" : "Add Car Segment"} mutate={mutate} onClose={() => setQuickAdd(undefined)} onCreated={(id) => { if (quickAdd === "service_brands") setBrandId(id); else setSegmentId(id); setQuickAdd(undefined); }} />}
    </Dialog>
  );
}
~~~

## CMP-admin-console-CatalogMasterList

src/admin-console.tsx:717-720

~~~tsx
function CatalogMasterList({ title, table, items, mutate }: { title: string; table: "service_brands" | "car_segments"; items: WorkshopState["service_brands"]; mutate: Mutate }) {
  const [dialog, setDialog] = useState<WorkshopState["service_brands"][number]>();
  return <section className="team-section"><div className="panel-actions"><h4>{title}</h4><button type="button" className="secondary-action" onClick={() => setDialog({ id: 0, name: "", status: "ACTIVE", created_at: "", updated_at: "" })}><Plus size={16} />Add</button></div><div className="table-wrap"><table aria-label={title}><thead><tr><th>Name</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.status}</td><td><div className="grid-actions"><button type="button" className="grid-action" onClick={() => setDialog(item)}>Rename</button><button type="button" className="grid-action grid-action-danger" disabled={item.status === "ARCHIVED"} onClick={() => mutate((db) => updateServiceCatalogMaster(db, table, item.id, item.name, "ARCHIVED"))}>Archive</button></div></td></tr>)}</tbody></table></div>{dialog && <CatalogMasterDialog table={table} title={dialog.id ? `Rename ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`} item={dialog.id ? dialog : undefined} mutate={mutate} onClose={() => setDialog(undefined)} />}</section>;
}
~~~

## CMP-admin-console-CatalogMasterDialog

src/admin-console.tsx:722-727

~~~tsx
function CatalogMasterDialog({ table, title, item, mutate, onClose, onCreated }: { table: "service_brands" | "car_segments"; title: string; item?: WorkshopState["service_brands"][number]; mutate: Mutate; onClose: () => void; onCreated?: (id: number) => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [error, setError] = useState("");
  const save = (event: React.FormEvent) => { event.preventDefault(); let id = item?.id ?? 0; const ok = mutate((db) => { id = item ? (updateServiceCatalogMaster(db, table, item.id, name, item.status), item.id) : createServiceCatalogMaster(db, table, name); }, setError); if (ok) { onCreated?.(id); if (!onCreated) onClose(); } };
  return <Dialog title={title} onClose={onClose} footer={<button className="primary-action" type="submit" form="catalog-master-dialog-form">Save</button>}><form id="catalog-master-dialog-form" onSubmit={save}><label>Name<input data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)} /></label>{error && <p className="error-text" role="alert">{error}</p>}</form></Dialog>;
}
~~~

## CMP-admin-console-RolesPageAccessTab

src/admin-console.tsx:729-1208

~~~tsx
function RolesPageAccessTab({
  adminState,
  commit,
  actingUser,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => void;
  actingUser: User;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "active" | "archived"
  >("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(
    adminState.roles[0]?.id,
  );
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState({ label: "", description: "" });
  const [editingRoleId, setEditingRoleId] = useState<string | undefined>();
  const [editDraft, setEditDraft] = useState({ label: "", description: "" });
  const [pageSearch, setPageSearch] = useState("");
  const [draftPages, setDraftPages] = useState<AdminPageKey[]>([]);
  const [formError, setFormError] = useState("");

  const needle = normalizeSearch(search);
  const roles = adminState.roles.filter(
    (role) =>
      (!needle ||
        normalizeSearch(`${role.label} ${role.description}`).includes(
          needle,
        )) &&
      (statusFilter === "ALL" || role.status === statusFilter),
  );
  const pagedRoles = paginate(roles, page, pageSize);
  const selectedRole = adminState.roles.find(
    (role) => role.id === selectedRoleId,
  );
  const savedPages = selectedRoleId
    ? resolvePermittedPages(adminState, selectedRoleId)
    : [];
  const isOwnerRole = selectedRoleId === "admin";
  const dirty =
    selectedRoleId !== undefined &&
    JSON.stringify([...draftPages].sort()) !==
      JSON.stringify([...savedPages].sort());

  useEffect(() => {
    setDraftPages(
      selectedRoleId ? resolvePermittedPages(adminState, selectedRoleId) : [],
    );
    // Only re-sync when the selected role changes (see effect note in BusinessSettingsTab for why
    // adminState itself isn't a dependency: this would clobber in-progress edits).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  const togglePage = (key: AdminPageKey) => {
    if (isOwnerRole && key === "admin-console") return;
    setDraftPages((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };
  const toggleGroup = (keys: AdminPageKey[], checked: boolean) => {
    setDraftPages((prev) => {
      const withoutGroup = prev.filter((item) => !keys.includes(item));
      const next = checked ? [...withoutGroup, ...keys] : withoutGroup;
      return isOwnerRole
        ? Array.from(new Set([...next, "admin-console" as AdminPageKey]))
        : next;
    });
  };
  const filteredGroups = ADMIN_PAGE_GROUPS.map((group) => ({
    ...group,
    pages: group.pages.filter(
      (page) =>
        !pageSearch.trim() ||
        normalizeSearch(page.label).includes(normalizeSearch(pageSearch)),
    ),
  })).filter((group) => group.pages.length > 0);

  const roleColumns: ExportColumn<DemoRole>[] = [
    { header: "Role", value: (row) => row.label },
    { header: "Description", value: (row) => row.description },
    { header: "Status", value: (row) => row.status },
    {
      header: "Pages granted",
      value: (row) => resolvePermittedPages(adminState, row.id).length,
    },
  ];

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Roles &amp; Page Access</h3>
        <button
          className="primary-action"
          onClick={() => {
            setNewRole({ label: "", description: "" });
            setFormError("");
            setCreating(true);
          }}
        >
          Add Role
        </button>
      </div>

      {creating && (
        <Dialog
          title="Add Role"
          subtitle="Session-only demo role"
          onClose={() => setCreating(false)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              try {
                commit((current) => addDemoRole(current, newRole), {
                  stream: "feature",
                  level: "info",
                  area: "Administration",
                  feature: "Roles & Page Access",
                  message: `Role "${newRole.label.trim()}" created`,
                  userId: String(actingUser.id),
                  userName: actingUser.name,
                });
                setCreating(false);
              } catch (error) {
                setFormError(
                  error instanceof Error
                    ? error.message
                    : "Could not create role.",
                );
              }
            }}
          >
            <label>
              Role name
              <input
                required
                value={newRole.label}
                onChange={(event) =>
                  setNewRole({ ...newRole, label: event.target.value })
                }
              />
            </label>
            <label>
              Description
              <input
                value={newRole.description}
                onChange={(event) =>
                  setNewRole({ ...newRole, description: event.target.value })
                }
              />
            </label>
            {formError && <p className="error-text">{formError}</p>}
            <div className="action-row">
              <button className="primary-action">Save Role</button>
              <button type="button" onClick={() => setCreating(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}

      <div className="store-filter-grid compact-management-toolbar">
        <label className="list-search">
          Search
          <input
            aria-label="Search roles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Role name or description"
          />
        </label>
        <label>
          Status
          <select
            aria-label="Filter roles by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setStatusFilter("ALL");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Roles",
              filters: activeFilterSummary({
                Search: search.trim(),
                Status: statusFilter,
              }),
              columns: roleColumns,
              rows: roles,
            }}
          />
        }
        from={pagedRoles.from}
        to={pagedRoles.to}
        totalCount={pagedRoles.totalCount}
        page={pagedRoles.page}
        pageCount={pagedRoles.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Role records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />

      <div className="role-access-layout">
        <div className="record-list role-list">
          {pagedRoles.items.map((role) => (
            <div
              className={`managed-record${selectedRoleId === role.id ? " active-record" : ""}`}
              key={role.id}
            >
              {editingRoleId === role.id ? (
                <form
                  className="inline-edit"
                  onSubmit={(event) => {
                    event.preventDefault();
                    try {
                      commit(
                        (current) =>
                          updateDemoRole(current, role.id, editDraft),
                        {
                          stream: "feature",
                          level: "info",
                          area: "Administration",
                          feature: "Roles & Page Access",
                          message: `Role "${role.label}" updated`,
                          userId: String(actingUser.id),
                          userName: actingUser.name,
                        },
                      );
                      setEditingRoleId(undefined);
                    } catch (error) {
                      window.alert(
                        error instanceof Error
                          ? error.message
                          : "Could not update role.",
                      );
                    }
                  }}
                >
                  <input
                    required
                    value={editDraft.label}
                    onChange={(event) =>
                      setEditDraft({ ...editDraft, label: event.target.value })
                    }
                  />
                  <input
                    value={editDraft.description}
                    onChange={(event) =>
                      setEditDraft({
                        ...editDraft,
                        description: event.target.value,
                      })
                    }
                    placeholder="Description"
                  />
                  <div className="action-row">
                    <button className="primary-action">Save</button>
                    <button
                      type="button"
                      onClick={() => setEditingRoleId(undefined)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="record-select"
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <strong>{role.label}</strong>
                  <span>
                    {role.description || "No description"} · {role.status}
                    {role.isBuiltIn ? " · built-in" : ""}
                  </span>
                </button>
              )}
              {editingRoleId !== role.id && (
                <div className="action-row">
                  <button
                    onClick={() => {
                      setEditingRoleId(role.id);
                      setEditDraft({
                        label: role.label,
                        description: role.description,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="danger-action"
                    disabled={role.id === "admin" || role.status === "archived"}
                    title={
                      role.id === "admin"
                        ? "Owner/Admin cannot be archived"
                        : undefined
                    }
                    onClick={() => {
                      if (!window.confirm(`Archive role "${role.label}"?`))
                        return;
                      commit((current) => archiveDemoRole(current, role.id), {
                        stream: "feature",
                        level: "warning",
                        area: "Administration",
                        feature: "Roles & Page Access",
                        message: `Role "${role.label}" archived`,
                        userId: String(actingUser.id),
                        userName: actingUser.name,
                      });
                      if (selectedRoleId === role.id)
                        setSelectedRoleId(undefined);
                    }}
                  >
                    Archive
                  </button>
                </div>
              )}
            </div>
          ))}
          {roles.length === 0 && (
            <div className="list-empty">
              <h3>No matching roles</h3>
              <FilterClearButton
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                label="Clear filters"
              />
            </div>
          )}
        </div>

        <div className="desk-panel page-access-panel">
          {!selectedRole ? (
            <p className="empty-state">Select a role to manage page access.</p>
          ) : (
            <>
              <PanelTitle
                icon={<Sliders />}
                title={`Page Access · ${selectedRole.label}`}
                subtitle={
                  isOwnerRole
                    ? "Admin Console access is always protected for Owner/Admin"
                    : "Grouped by navigation area"
                }
              />
              <div className="store-filter-grid">
                <label className="list-search">
                  Search pages
                  <input
                    value={pageSearch}
                    onChange={(event) => setPageSearch(event.target.value)}
                    placeholder="Page name"
                  />
                </label>
                <div className="action-row">
                  <button
                    onClick={() =>
                      setDraftPages(
                        isOwnerRole ? [...ALL_PAGE_KEYS] : [...ALL_PAGE_KEYS],
                      )
                    }
                  >
                    Select All
                  </button>
                  <button
                    onClick={() =>
                      setDraftPages(isOwnerRole ? ["admin-console"] : [])
                    }
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setDraftPages(savedPages)}
                    disabled={!dirty}
                  >
                    Reset to Saved
                  </button>
                  <button
                    className="primary-action"
                    disabled={!dirty}
                    onClick={() => {
                      commit(
                        (current) =>
                          updateRolePageAccess(
                            current,
                            selectedRole.id,
                            draftPages,
                          ),
                        {
                          stream: "feature",
                          level: "info",
                          area: "Administration",
                          feature: "Roles & Page Access",
                          message: `Page access saved for "${selectedRole.label}"`,
                          userId: String(actingUser.id),
                          userName: actingUser.name,
                          referenceId: selectedRole.id,
                        },
                      );
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="page-access-groups">
                {filteredGroups.map((group) => (
                  <GroupFieldset
                    key={group.key}
                    group={group}
                    draftPages={draftPages}
                    isOwnerRole={isOwnerRole}
                    onToggleGroup={toggleGroup}
                    onTogglePage={togglePage}
                  />
                ))}
              </div>
              <div className="nav-preview">
                <strong>Navigation preview</strong>
                <div className="nav-preview-pills">
                  {draftPages.length === 0 ? (
                    <span className="empty-state">No pages granted.</span>
                  ) : (
                    ADMIN_PAGE_GROUPS.flatMap((group) => group.pages)
                      .filter((page) => draftPages.includes(page.key))
                      .map((page) => (
                        <span className="category-badge" key={page.key}>
                          {page.label}
                        </span>
                      ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ResultPagination
        page={pagedRoles.page}
        pageCount={pagedRoles.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-admin-console-GroupFieldset

src/admin-console.tsx:1210-1268

~~~tsx
function GroupFieldset({
  group,
  draftPages,
  isOwnerRole,
  onToggleGroup,
  onTogglePage,
}: {
  group: (typeof ADMIN_PAGE_GROUPS)[number];
  draftPages: AdminPageKey[];
  isOwnerRole: boolean;
  onToggleGroup: (keys: AdminPageKey[], checked: boolean) => void;
  onTogglePage: (key: AdminPageKey) => void;
}) {
  const groupRef = useRef<HTMLInputElement>(null);
  const keys = group.pages.map((page) => page.key);
  const checkedCount = keys.filter((key) => draftPages.includes(key)).length;
  const allChecked = checkedCount === keys.length;
  const noneChecked = checkedCount === 0;
  useEffect(() => {
    if (groupRef.current)
      groupRef.current.indeterminate = !allChecked && !noneChecked;
  }, [allChecked, noneChecked]);
  return (
    <fieldset className="assignment-fieldset page-access-group">
      <legend>
        <label>
          <input
            ref={groupRef}
            type="checkbox"
            checked={allChecked}
            onChange={() => onToggleGroup(keys, !allChecked)}
          />{" "}
          {group.label}
        </label>
      </legend>
      {group.pages.map((page) => {
        const locked = isOwnerRole && page.key === "admin-console";
        return (
          <label
            key={page.key}
            title={
              locked
                ? "Owner/Admin always keeps Admin Console access"
                : undefined
            }
          >
            <input
              type="checkbox"
              checked={draftPages.includes(page.key)}
              disabled={locked}
              onChange={() => onTogglePage(page.key)}
            />{" "}
            {page.label}
          </label>
        );
      })}
    </fieldset>
  );
}
~~~

## CMP-admin-console-AppThemeTab

src/admin-console.tsx:1272-1449

~~~tsx
function AppThemeTab({
  adminState,
  commit,
  actingUser,
  onThemeSaved,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => boolean;
  actingUser: User;
  onThemeSaved?: (theme: AppTheme) => void;
}) {
  const [draft, setDraft] = useState<AppTheme>(adminState.appTheme);
  const [justSaved, setJustSaved] = useState(false);
  useEffect(() => setDraft(adminState.appTheme), [adminState.appTheme]);
  const dirty =
    draft.fontId !== adminState.appTheme.fontId ||
    draft.paletteId !== adminState.appTheme.paletteId;
  const font =
    APP_THEME_FONTS.find((item) => item.id === draft.fontId) ??
    APP_THEME_FONTS[0];
  const palette =
    APP_THEME_PALETTES.find((item) => item.id === draft.paletteId) ??
    APP_THEME_PALETTES[0];
  const save = () => {
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
  };
  return (
    <div className="manager-panel app-theme-tab" role="tabpanel">
      <div className="panel-actions">
        <div>
          <h3>App Theme</h3>
          <p>
            Changes apply to the live application after saving; generated
            documents keep their own template styling.
          </p>
        </div>
        <div className="action-row">
          <button
            onClick={() => {
              setDraft(adminState.appTheme);
              setJustSaved(false);
            }}
            disabled={!dirty}
          >
            Reset to Saved
          </button>
          <button
            onClick={() => {
              setDraft({ ...DEFAULT_APP_THEME });
              setJustSaved(false);
            }}
          >
            Set to Default
          </button>
          <button className="primary-action" onClick={save} disabled={!dirty}>
            Save App Theme
          </button>
        </div>
      </div>
      {justSaved && !dirty && (
        <p className="save-confirmation">App theme saved for this session.</p>
      )}
      {dirty && (
        <p className="unsaved-note">
          Previewing unsaved changes. Save App Theme to apply them globally.
        </p>
      )}
      <div className="app-theme-layout">
        <div className="app-theme-controls">
          <SearchSelect
            label="Application font"
            options={APP_THEME_FONTS.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            value={draft.fontId}
            onChange={(fontId) => {
              setDraft((current) => ({
                ...current,
                fontId: fontId as AppTheme["fontId"],
              }));
              setJustSaved(false);
            }}
            placeholder="Search fonts..."
          />
          <fieldset className="palette-picker">
            <legend>Color palette</legend>
            <div className="palette-options">
              {APP_THEME_PALETTES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`palette-option${draft.paletteId === item.id ? " selected" : ""}`}
                  aria-pressed={draft.paletteId === item.id}
                  onClick={() => {
                    setDraft((current) => ({ ...current, paletteId: item.id }));
                    setJustSaved(false);
                  }}
                >
                  <span
                    className="palette-swatch"
                    style={{
                      background: item.tokens.sidebar,
                      borderColor: item.tokens.sidebarBorder,
                    }}
                  >
                    <i style={{ background: item.tokens.active }} />
                    <i style={{ background: item.tokens.tableHeader }} />
                    <i style={{ background: item.tokens.accent }} />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <section
          className="app-theme-preview"
          style={{
            fontFamily: font.cssFamily,
            background: palette.tokens.background,
            ["--preview-sidebar" as string]: palette.tokens.sidebar,
            ["--preview-active" as string]: palette.tokens.active,
            ["--preview-accent" as string]: palette.tokens.accent,
            ["--preview-header" as string]: palette.tokens.tableHeader,
          }}
          aria-label="App theme preview"
        >
          <aside>
            <strong>WorkshopOS</strong>
            <span className="preview-menu-active">Dashboard</span>
            <span>Job Cards</span>
          </aside>
          <div>
            <h2>Theme preview</h2>
            <label>
              Customer name
              <input value="Aarav Motors" readOnly />
            </label>
            <div className="preview-tabs">
              <button className="active">Overview</button>
              <button>History</button>
            </div>
            <div className="preview-selected-row">Selected job row</div>
            <table>
              <thead>
                <tr>
                  <th>Job Card</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JC-2026-002144</td>
                  <td>In progress</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
~~~

## CMP-admin-console-BusinessSettingsTab

src/admin-console.tsx:1476-2166

~~~tsx
function BusinessSettingsTab({
  adminState,
  commit,
  actingUser,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => boolean;
  actingUser: User;
}) {
  const [subTab, setSubTab] = useState<SettingsGroupKey>("profile");
  const [draft, setDraft] = useState<WorkshopBusinessSettings>(
    adminState.businessSettings,
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    // Re-syncs the working draft only when the *saved* settings object changes (i.e. after this
    // tab's own Save/Reset commits, or on first mount) — not on every keystroke.
    setDraft(adminState.businessSettings);
  }, [adminState.businessSettings]);

  const dirty =
    JSON.stringify(draft) !== JSON.stringify(adminState.businessSettings);

  const setField = <G extends keyof WorkshopBusinessSettings>(
    group: G,
    field: keyof WorkshopBusinessSettings[G],
    value: WorkshopBusinessSettings[G][keyof WorkshopBusinessSettings[G]],
  ) => {
    setJustSaved(false);
    setDraft((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };
  const toggleListValue = <G extends keyof WorkshopBusinessSettings>(
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
  };

  const save = () => {
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
  };
  const reset = () => {
    if (
      !window.confirm(
        "Reset unsaved changes back to the saved business settings?",
      )
    )
      return;
    setDraft(adminState.businessSettings);
    setErrors([]);
    setJustSaved(false);
  };

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Business Settings</h3>
        <div className="action-row">
          <button onClick={reset} disabled={!dirty}>
            Reset to Saved
          </button>
          <button className="primary-action" onClick={save} disabled={!dirty}>
            Save Settings
          </button>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="api-error" role="alert">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
      {justSaved && !dirty && (
        <p className="save-confirmation">Settings saved for this session.</p>
      )}
      {dirty && <p className="unsaved-note">Unsaved changes.</p>}
      <div
        className="sub-tabs"
        role="tablist"
        aria-label="Business settings sections"
      >
        {SETTINGS_GROUPS.map((group) => (
          <button
            key={group.key}
            role="tab"
            aria-selected={subTab === group.key}
            className={subTab === group.key ? "active" : ""}
            onClick={() => setSubTab(group.key)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {subTab === "profile" && (
        <div className="form-grid">
          <label>
            Business name
            <input
              value={draft.profile.businessName}
              onChange={(event) =>
                setField("profile", "businessName", event.target.value)
              }
            />
          </label>
          <label>
            Legal name
            <input
              value={draft.profile.legalName}
              onChange={(event) =>
                setField("profile", "legalName", event.target.value)
              }
            />
          </label>
          <label>
            Phone
            <input
              value={draft.profile.phone}
              onChange={(event) =>
                setField("profile", "phone", event.target.value)
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={draft.profile.email}
              onChange={(event) =>
                setField("profile", "email", event.target.value)
              }
            />
          </label>
          <label>
            Address
            <input
              value={draft.profile.address}
              onChange={(event) =>
                setField("profile", "address", event.target.value)
              }
            />
          </label>
          <label>
            Timezone
            <input
              value={draft.profile.timezone}
              onChange={(event) =>
                setField("profile", "timezone", event.target.value)
              }
            />
          </label>
          <label>
            Currency
            <input
              value={draft.profile.currency}
              onChange={(event) =>
                setField("profile", "currency", event.target.value)
              }
            />
          </label>
        </div>
      )}
      {subTab === "branch" && (
        <>
          <div className="form-grid">
            <label>
              Branch name
              <input
                value={draft.branch.name}
                onChange={(event) =>
                  setField("branch", "name", event.target.value)
                }
              />
            </label>
            <label>
              Opening time
              <input
                type="time"
                value={draft.branch.openingTime}
                onChange={(event) =>
                  setField("branch", "openingTime", event.target.value)
                }
              />
            </label>
            <label>
              Closing time
              <input
                type="time"
                value={draft.branch.closingTime}
                onChange={(event) =>
                  setField("branch", "closingTime", event.target.value)
                }
              />
            </label>
            <label>
              Holiday behavior
              <select
                value={draft.branch.holidayBehavior}
                onChange={(event) =>
                  setField(
                    "branch",
                    "holidayBehavior",
                    event.target
                      .value as WorkshopBusinessSettings["branch"]["holidayBehavior"],
                  )
                }
              >
                <option value="closed">Closed</option>
                <option value="appointment-only">Appointment only</option>
              </select>
            </label>
          </div>
          <fieldset className="assignment-fieldset">
            <legend>Working days</legend>
            {WEEKDAYS.map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={draft.branch.workingDays.includes(day)}
                  onChange={() => toggleListValue("branch", "workingDays", day)}
                />
                {day}
              </label>
            ))}
          </fieldset>
        </>
      )}
      {subTab === "jobs" && (
        <div className="form-grid">
          <label>
            Job number prefix
            <input
              value={draft.jobs.jobNumberPrefix}
              onChange={(event) =>
                setField("jobs", "jobNumberPrefix", event.target.value)
              }
            />
          </label>
          <label>
            Default promised hours
            <input
              type="number"
              min={1}
              value={draft.jobs.defaultPromisedHours}
              onChange={(event) =>
                setField(
                  "jobs",
                  "defaultPromisedHours",
                  Number(event.target.value),
                )
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.jobs.requireQc}
              onChange={(event) =>
                setField("jobs", "requireQc", event.target.checked)
              }
            />{" "}
            Require QC before closure
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.jobs.washingDefault}
              onChange={(event) =>
                setField("jobs", "washingDefault", event.target.checked)
              }
            />{" "}
            Washing needed by default
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.jobs.autoCloseAfterDelivery}
              onChange={(event) =>
                setField("jobs", "autoCloseAfterDelivery", event.target.checked)
              }
            />{" "}
            Auto-close after delivery
          </label>
        </div>
      )}
      {subTab === "pricing" && (
        <div className="form-grid">
          <label>
            Estimate validity (days)
            <input
              type="number"
              min={1}
              value={draft.pricing.estimateValidityDays}
              onChange={(event) =>
                setField(
                  "pricing",
                  "estimateValidityDays",
                  Number(event.target.value),
                )
              }
            />
          </label>
          <label>
            Default labour rate
            <input
              type="number"
              min={0}
              value={draft.pricing.defaultLabourRate}
              onChange={(event) =>
                setField(
                  "pricing",
                  "defaultLabourRate",
                  Number(event.target.value),
                )
              }
            />
          </label>
          <label>
            Discount approval threshold (%)
            <input
              type="number"
              min={0}
              max={100}
              value={draft.pricing.discountApprovalPercent}
              onChange={(event) =>
                setField(
                  "pricing",
                  "discountApprovalPercent",
                  Number(event.target.value),
                )
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.pricing.requireEstimateApproval}
              onChange={(event) =>
                setField(
                  "pricing",
                  "requireEstimateApproval",
                  event.target.checked,
                )
              }
            />{" "}
            Require estimate approval
          </label>
        </div>
      )}
      {subTab === "billing" && (
        <>
          <div className="form-grid">
            <label>
              GSTIN
              <input
                aria-label="GSTIN"
                value={draft.billing.gstin}
                onChange={(event) =>
                  setField("billing", "gstin", event.target.value)
                }
              />
            </label>
            <label>
              Account holder
              <input
                aria-label="Account holder"
                value={draft.billing.bankAccountHolder}
                onChange={(event) =>
                  setField("billing", "bankAccountHolder", event.target.value)
                }
              />
            </label>
            <label>
              Bank name
              <input
                aria-label="Bank name"
                value={draft.billing.bankName}
                onChange={(event) =>
                  setField("billing", "bankName", event.target.value)
                }
              />
            </label>
            <label>
              Account number
              <input
                aria-label="Account number"
                inputMode="numeric"
                value={draft.billing.bankAccountNumber}
                onChange={(event) =>
                  setField("billing", "bankAccountNumber", event.target.value)
                }
              />
            </label>
            <label>
              IFSC
              <input
                aria-label="IFSC"
                value={draft.billing.bankIfsc}
                onChange={(event) =>
                  setField("billing", "bankIfsc", event.target.value)
                }
              />
            </label>
            <label>
              Branch
              <input
                aria-label="Bank branch"
                value={draft.billing.bankBranch}
                onChange={(event) =>
                  setField("billing", "bankBranch", event.target.value)
                }
              />
            </label>
            <label>
              UPI ID
              <input
                aria-label="UPI ID"
                value={draft.billing.upiId}
                onChange={(event) =>
                  setField("billing", "upiId", event.target.value)
                }
              />
            </label>
            <label>
              Default GST %
              <input
                type="number"
                min={0}
                max={100}
                value={draft.billing.defaultGstPercent}
                onChange={(event) =>
                  setField(
                    "billing",
                    "defaultGstPercent",
                    Number(event.target.value),
                  )
                }
              />
            </label>
            <label>
              Invoice prefix
              <input
                value={draft.billing.invoicePrefix}
                onChange={(event) =>
                  setField("billing", "invoicePrefix", event.target.value)
                }
              />
            </label>
            <label>
              Receipt prefix
              <input
                value={draft.billing.receiptPrefix}
                onChange={(event) =>
                  setField("billing", "receiptPrefix", event.target.value)
                }
              />
            </label>
            <label>
              Gate pass prefix
              <input
                value={draft.billing.gatePassPrefix}
                onChange={(event) =>
                  setField("billing", "gatePassPrefix", event.target.value)
                }
              />
            </label>
          </div>
          <fieldset className="assignment-fieldset">
            <legend>Accepted payment modes</legend>
            {PAYMENT_MODE_OPTIONS.map((mode) => (
              <label key={mode}>
                <input
                  type="checkbox"
                  checked={draft.billing.paymentModes.includes(mode)}
                  onChange={() =>
                    toggleListValue("billing", "paymentModes", mode)
                  }
                />
                {mode}
              </label>
            ))}
          </fieldset>
        </>
      )}
      {subTab === "inventory" && (
        <div className="form-grid">
          <label>
            Default unit
            <input
              value={draft.inventory.defaultUnit}
              onChange={(event) =>
                setField("inventory", "defaultUnit", event.target.value)
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.inventory.lowStockNotifications}
              onChange={(event) =>
                setField(
                  "inventory",
                  "lowStockNotifications",
                  event.target.checked,
                )
              }
            />{" "}
            Low-stock notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.inventory.requireAdjustmentReason}
              onChange={(event) =>
                setField(
                  "inventory",
                  "requireAdjustmentReason",
                  event.target.checked,
                )
              }
            />{" "}
            Require a reason for stock adjustments
          </label>
        </div>
      )}
      {subTab === "notifications" && (
        <>
          <fieldset className="assignment-fieldset">
            <legend>Customer update channels</legend>
            {NOTIFICATION_CHANNEL_OPTIONS.map((channel) => (
              <label key={channel}>
                <input
                  type="checkbox"
                  checked={draft.notifications.customerChannels.includes(
                    channel,
                  )}
                  onChange={() =>
                    toggleListValue(
                      "notifications",
                      "customerChannels",
                      channel,
                    )
                  }
                />
                {channel}
              </label>
            ))}
          </fieldset>
          <div className="form-grid">
            <label>
              Document header
              <input
                value={draft.notifications.documentHeader}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "documentHeader",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              Estimate template
              <input
                value={draft.notifications.estimateTemplate}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "estimateTemplate",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              Invoice template
              <input
                value={draft.notifications.invoiceTemplate}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "invoiceTemplate",
                    event.target.value,
                  )
                }
              />
            </label>
          </div>
          <p className="field-help">
            Available placeholders: {"{{jobCardNo}}"}, {"{{vehicleRegistrationNo}}"},
            {"{{serviceAdvisorName}}"}, and {"{{workshopName}}"}.
          </p>
          <div className="form-grid">
            <label>
              Job-card creation WhatsApp template
              <textarea
                rows={3}
                value={draft.notifications.jobCardCreatedWhatsAppTemplate}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "jobCardCreatedWhatsAppTemplate",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              Job-card creation email template
              <textarea
                rows={3}
                value={draft.notifications.jobCardCreatedEmailTemplate}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "jobCardCreatedEmailTemplate",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              Job-card closure WhatsApp template
              <textarea
                rows={3}
                value={draft.notifications.jobCardClosedWhatsAppTemplate}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "jobCardClosedWhatsAppTemplate",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              Job-card closure email template
              <textarea
                rows={3}
                value={draft.notifications.jobCardClosedEmailTemplate}
                onChange={(event) =>
                  setField(
                    "notifications",
                    "jobCardClosedEmailTemplate",
                    event.target.value,
                  )
                }
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
~~~

## CMP-admin-console-CompanyImageField

src/admin-console.tsx:2202-2271

~~~tsx
function CompanyImageField({
  label,
  value,
  onChange,
  onError,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const choose = (file?: File) => {
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
  };
  return (
    <div className="company-image-field">
      <strong>{label}</strong>
      <div className="company-image-preview">
        {value ? (
          <img src={value} alt={`${label} preview`} />
        ) : (
          <span>No image configured</span>
        )}
      </div>
      <div className="action-row">
        <label className="file-upload-button">
          Choose image
          <input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => choose(event.target.files?.[0])}
          />
        </label>
        <button
          type="button"
          disabled={!value}
          onClick={() => {
            onError("");
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          Clear
        </button>
      </div>
      <small>PNG or JPEG · downscaled to fit 500 KB</small>
    </div>
  );
}
~~~

## CMP-admin-console-CompanySettingsTab

src/admin-console.tsx:2273-2454

~~~tsx
function CompanySettingsTab({
  adminState,
  commit,
  actingUser,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => boolean;
  actingUser: User;
}) {
  const profile = adminState.businessSettings.profile;
  const savedDetails: CompanyDetails = {
    address: profile.address,
    phone: profile.phone,
    email: profile.email,
    gstin: adminState.businessSettings.billing.gstin,
    footer: profile.footer,
  };
  const saved = {
    companyName: profile.businessName,
    assets: adminState.companyAssets,
    details: savedDetails,
  };
  const [details, setDetails] = useState<CompanyDetails>(saved.details);
  const [companyName, setCompanyName] = useState(saved.companyName);
  const [assets, setAssets] = useState<CompanyAssets>(saved.assets);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const dirty =
    companyName !== saved.companyName ||
    JSON.stringify(assets) !== JSON.stringify(saved.assets) ||
    JSON.stringify(details) !== JSON.stringify(saved.details);

  useEffect(() => {
    setCompanyName(saved.companyName);
    setAssets(saved.assets);
    setDetails(savedDetails);
  }, [saved.companyName, saved.assets, JSON.stringify(savedDetails)]);
  const changeAsset = (key: keyof CompanyAssets, next: string | null) => {
    setSavedMessage(false);
    setAssets((current) => ({ ...current, [key]: next }));
  };
  const save = () => {
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
  };
  const reset = () => {
    if (dirty && !window.confirm("Reset unsaved company settings?")) return;
    setCompanyName(saved.companyName);
    setAssets(saved.assets);
    setDetails(saved.details);
    setError("");
    setSavedMessage(false);
  };
  const setDetail = (key: keyof CompanyDetails, next: string) => {
    setSavedMessage(false);
    setDetails((current) => ({ ...current, [key]: next }));
  };
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <div>
          <h3>Company Settings</h3>
          <p>
            Single company profile and images merged into every report template.
          </p>
        </div>
        <div className="action-row">
          <button type="button" disabled={!dirty} onClick={reset}>
            Reset to Saved
          </button>
          <button
            type="button"
            className="primary-action"
            disabled={!dirty}
            onClick={save}
          >
            Save Company Settings
          </button>
        </div>
      </div>
      {error && (
        <div className="api-error" role="alert">
          <p>{error}</p>
        </div>
      )}
      {savedMessage && !dirty && (
        <p className="save-confirmation">
          Company settings saved for this session.
        </p>
      )}
      {dirty && <p className="unsaved-note">Unsaved changes.</p>}
      <label>
        Company name
        <input
          value={companyName}
          onChange={(event) => {
            setCompanyName(event.target.value);
            setSavedMessage(false);
          }}
        />
      </label>
      <div className="form-grid">
        <label>
          Address
          <input
            value={details.address}
            onChange={(event) => setDetail("address", event.target.value)}
          />
        </label>
        <label>
          Phone
          <input
            value={details.phone}
            onChange={(event) => setDetail("phone", event.target.value)}
          />
        </label>
        <label>
          Email
          <input
            value={details.email}
            onChange={(event) => setDetail("email", event.target.value)}
          />
        </label>
        <label>
          GSTIN
          <input
            value={details.gstin}
            onChange={(event) => setDetail("gstin", event.target.value)}
          />
        </label>
        <label>
          Terms / footer
          <textarea
            value={details.footer}
            onChange={(event) => setDetail("footer", event.target.value)}
          />
        </label>
      </div>
      <div className="company-assets-grid">
        <CompanyImageField
          label="Company logo"
          value={assets.logo}
          onChange={(next) => changeAsset("logo", next)}
          onError={setError}
        />
        <CompanyImageField
          label="Company stamp"
          value={assets.stamp}
          onChange={(next) => changeAsset("stamp", next)}
          onError={setError}
        />
        <CompanyImageField
          label="Authorized signature"
          value={assets.authorizedSignature}
          onChange={(next) => changeAsset("authorizedSignature", next)}
          onError={setError}
        />
      </div>
    </div>
  );
}
~~~

## CMP-admin-console-ReportTemplatesTab

src/admin-console.tsx:2462-2787

~~~tsx
function ReportTemplatesTab({
  adminState,
  commit,
  actingUser,
  onDirtyChange,
  initialCategory = "invoice",
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => boolean;
  actingUser: User;
  onDirtyChange: (dirty: boolean) => void;
  initialCategory?: ReportCategory;
}) {
  const [category, setCategory] = useState<ReportCategory>(initialCategory);
  const categoryTemplates = adminState.reportTemplates.filter(
    (template) => template.category === category,
  );
  const initial =
    categoryTemplates.find((template) => template.active) ??
    categoryTemplates[0];
  const [selectedId, setSelectedId] = useState<string | null>(
    initial?.id ?? null,
  );
  const selected = adminState.reportTemplates.find(
    (template) => template.id === selectedId,
  );
  const [draft, setDraft] = useState({
    name: initial?.name ?? "",
    html: initial?.html ?? "",
    active: initial?.active ?? false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = selected
    ? draft.name !== selected.name ||
      draft.html !== selected.html ||
      draft.active !== selected.active
    : Boolean(draft.name || draft.html || draft.active);
  const unsupported = findUnsupportedPlaceholders(draft.html, category);

  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);

  const load = (id: string | null, nextCategory = category) => {
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
  };
  const confirmDiscard = () =>
    !dirty || window.confirm("Discard unsaved template changes?");
  const changeCategory = (next: ReportCategory) => {
    if (!confirmDiscard()) return;
    const templates = adminState.reportTemplates.filter(
      (item) => item.category === next,
    );
    const template = templates.find((item) => item.active) ?? templates[0];
    setCategory(next);
    load(template?.id ?? null, next);
  };
  const save = () => {
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
  };
  let preview = "";
  if (!unsupported.length && draft.html.trim()) {
    try {
      preview = renderReportTemplate(
        { category, html: draft.html },
        sampleReportValues(category),
        sampleReportLines(),
      );
    } catch {
      preview = "";
    }
  }
  const remove = () => {
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
  };
  return (
    <div className="manager-panel report-template-panel" role="tabpanel">
      <div className="panel-actions">
        <div>
          <h3>Report Templates</h3>
          <p>
            Design sanitized print layouts using the supported placeholders.
          </p>
        </div>
        <div className="action-row">
          <button
            type="button"
            onClick={() => {
              if (confirmDiscard()) load(null);
            }}
          >
            New Template
          </button>
          <button type="button" disabled={!selectedId} onClick={remove}>
            Delete Template
          </button>
          <button
            type="button"
            className="primary-action"
            disabled={!dirty}
            onClick={save}
          >
            {selectedId ? "Update Template" : "Create Template"}
          </button>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="api-error" role="alert">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
      {justSaved && !dirty && (
        <p className="save-confirmation">Template saved for this session.</p>
      )}
      {dirty && <p className="unsaved-note">Unsaved changes.</p>}
      <div className="template-selectors form-grid">
        <label>
          Report category
          <select
            aria-label="Report category"
            value={category}
            onChange={(event) =>
              changeCategory(event.target.value as ReportCategory)
            }
          >
            {REPORT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {REPORT_CATEGORY_LABELS[item]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Template
          <select
            aria-label="Report template"
            value={selectedId ?? ""}
            onChange={(event) => {
              if (confirmDiscard()) load(event.target.value || null);
            }}
          >
            <option value="">New unsaved template</option>
            {categoryTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
                {template.active ? " (Active)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Template name
          <input
            aria-label="Template name"
            value={draft.name}
            onChange={(event) => {
              setDraft({ ...draft, name: event.target.value });
              setJustSaved(false);
            }}
          />
        </label>
        <label className="template-active">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) => {
              if (draft.active && !event.target.checked) {
                setErrors([
                  "Activate another template before deactivating the current template.",
                ]);
                return;
              }
              setDraft({ ...draft, active: event.target.checked });
              setErrors([]);
              setJustSaved(false);
            }}
          />{" "}
          Active template
        </label>
      </div>
      <div className="template-workspace">
        <div className="template-editor-column">
          <strong>Template HTML</strong>
          <CodeMirror
            className="template-html-editor"
            value={draft.html}
            height="460px"
            basicSetup={{ lineNumbers: true, foldGutter: false }}
            extensions={[
              htmlLanguage(),
              EditorView.lineWrapping,
              EditorView.contentAttributes.of({
                "aria-label": "Template HTML",
              }),
            ]}
            onChange={(next) => {
              setDraft((current) => ({ ...current, html: next }));
              setJustSaved(false);
            }}
          />
        </div>
        <div className="template-preview-column">
          <strong>Live preview (sandboxed)</strong>
          {unsupported.length ? (
            <div className="api-error" role="alert">
              <p>
                Preview unavailable until unsupported placeholders are removed.
              </p>
            </div>
          ) : (
            <iframe
              className="template-preview"
              title={`${REPORT_CATEGORY_LABELS[category]} template preview`}
              sandbox=""
              srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}*{box-sizing:border-box}</style></head><body>${preview}</body></html>`}
            />
          )}
        </div>
        <aside className="placeholder-registry">
          <h4>Allowed placeholders</h4>
          <p>
            Insert a placeholder exactly as shown. Blocks generate safe report
            tables or configured images.
          </p>
          {REPORT_PLACEHOLDERS[category].map((name) => (
            <code key={name}>{`{{${name}}}`}</code>
          ))}
          <h4>Line loop</h4>
          <code>{"{{#lines}} ... {{/lines}}"}</code>
          {LINE_PLACEHOLDERS.map((name) => (
            <code key={name}>{`{{${name}}}`}</code>
          ))}
          {unsupported.length > 0 && (
            <div className="api-error" role="alert">
              <strong>Unsupported</strong>
              {unsupported.map((name) => (
                <p key={name}>{name}</p>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
~~~

## CMP-admin-console-InventoryImportTab

src/admin-console.tsx:2806-3151

~~~tsx
function InventoryImportTab({
  adminState,
  commit,
  actingUser,
  state,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => void;
  actingUser: User;
  state: WorkshopState;
}) {
  const [step, setStep] = useState<WizardStep>(1);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedInventoryWorkbook>();
  const [mapping, setMapping] = useState<InventoryColumnMapping>({});
  const [preview, setPreview] = useState<InventoryImportPreview>();
  const [uploadError, setUploadError] = useState("");
  const [result, setResult] = useState<{
    accepted: number;
    rejected: number;
    total: number;
    batchId: string;
  }>();

  const existingInventory = useMemo(
    () => [
      ...state.inventory.map((item) => ({ id: item.id, sku: item.sku })),
      ...adminState.sessionInventory.map((item, index) => ({
        id: -1_000_000 - index,
        sku: item.sku,
      })),
    ],
    [state.inventory, adminState.sessionInventory],
  );

  const resetWizard = () => {
    setStep(1);
    setFileName("");
    setParsed(undefined);
    setMapping({});
    setPreview(undefined);
    setUploadError("");
    setResult(undefined);
  };

  const onFileChosen = async (file: File) => {
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
  };

  const runValidation = () => {
    if (!parsed) return;
    const nextPreview = buildInventoryImportPreview({
      headers: parsed.headers,
      rows: parsed.rows,
      mapping,
      existingInventory,
    });
    setPreview(nextPreview);
    setStep(3);
  };

  const confirmImport = () => {
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
  };

  const rejectedColumns: ExportColumn<RejectedInventoryImportRow>[] = [
    { header: "Row", value: (row) => row.sourceRowNumber },
    { header: "SKU", value: (row) => row.normalized.sku ?? "" },
    { header: "Name", value: (row) => row.normalized.name ?? "" },
    {
      header: "Issues",
      value: (row) => row.issues.map((issue) => issue.message).join("; "),
    },
  ];

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Inventory Import</h3>
        <span>
          Step {step} of 4 · session-only, never touches the persisted inventory
        </span>
      </div>
      <div className="wizard-steps">
        {["Upload", "Map Columns", "Validate & Preview", "Confirm"].map(
          (label, index) => (
            <span
              key={label}
              className={`wizard-step${step === index + 1 ? " active" : ""}${step > index + 1 ? " done" : ""}`}
            >
              {index + 1}. {label}
            </span>
          ),
        )}
      </div>

      {step === 1 && (
        <div className="desk-panel">
          <p>
            Upload a CSV or XLSX file with your opening inventory, or start from
            the WorkshopOS template.
          </p>
          <div className="action-row">
            <label className="primary-action file-upload-button">
              Choose File
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onFileChosen(file);
                  event.target.value = "";
                }}
                hidden
              />
            </label>
            <button onClick={downloadTemplate}>Download Template</button>
          </div>
          {uploadError && <p className="error-text">{uploadError}</p>}
        </div>
      )}

      {step === 2 && parsed && (
        <div className="desk-panel">
          <p>
            Mapped from <strong>{fileName}</strong> ({parsed.rows.length} rows).
            Adjust any column below.
          </p>
          <div className="form-grid">
            {INVENTORY_IMPORT_FIELDS.map((field: InventoryImportField) => (
              <label key={field}>
                {INVENTORY_TEMPLATE_HEADERS[field]}
                <select
                  value={mapping[field] ?? ""}
                  onChange={(event) =>
                    setMapping((prev) => ({
                      ...prev,
                      [field]: event.target.value || undefined,
                    }))
                  }
                >
                  <option value="">Not mapped</option>
                  {parsed.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div className="action-row">
            <button onClick={() => setStep(1)}>Back</button>
            <button className="primary-action" onClick={runValidation}>
              Validate &amp; Preview
            </button>
          </div>
        </div>
      )}

      {step === 3 && preview && (
        <div className="desk-panel">
          {preview.mappingIssues.length > 0 ? (
            <>
              <p className="error-text">
                Fix the column mapping before continuing:
              </p>
              <ul>
                {preview.mappingIssues.map((issue) => (
                  <li key={`${issue.field}-${issue.code}`}>{issue.message}</li>
                ))}
              </ul>
              <button onClick={() => setStep(2)}>Back to Mapping</button>
            </>
          ) : (
            <>
              <div className="linked-grid">
                <Info label="Total rows" value={preview.totalRows} />
                <Info label="Valid rows" value={preview.validRows.length} />
                <Info
                  label="Rejected rows"
                  value={preview.rejectedRows.length}
                />
              </div>
              <h4>Valid rows (first 10)</h4>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Unit</th>
                      <th>Opening Qty</th>
                      <th>Low-stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.validRows.slice(0, 10).map((row) => (
                      <tr key={row.sourceRowNumber}>
                        <td>{row.item.sku}</td>
                        <td>{row.item.name}</td>
                        <td>{row.item.category}</td>
                        <td>{row.item.unit}</td>
                        <td>{row.item.stock_qty}</td>
                        <td>{row.item.low_stock_qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.rejectedRows.length > 0 && (
                <>
                  <div className="panel-actions">
                    <h4>Rejected rows</h4>
                    <DownloadMenu
                      report={{
                        title: "Rejected Inventory Import Rows",
                        filters: [`File: ${fileName}`],
                        columns: rejectedColumns,
                        rows: preview.rejectedRows,
                      }}
                    />
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Row</th>
                          <th>SKU</th>
                          <th>Name</th>
                          <th>Issues</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.rejectedRows.slice(0, 20).map((row) => (
                          <tr key={row.sourceRowNumber}>
                            <td>{row.sourceRowNumber}</td>
                            <td>{row.normalized.sku}</td>
                            <td>{row.normalized.name}</td>
                            <td>
                              {row.issues
                                .map((issue) => issue.message)
                                .join("; ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              <div className="action-row">
                <button onClick={() => setStep(2)}>Back</button>
                <button
                  className="primary-action"
                  disabled={preview.validRows.length === 0}
                  onClick={confirmImport}
                >
                  Confirm Import
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 4 && result && (
        <div className="desk-panel">
          <PanelTitle
            icon={<FileSpreadsheet />}
            title="Import complete"
            subtitle={`Batch ${result.batchId}`}
          />
          <div className="linked-grid">
            <Info label="Total rows" value={result.total} />
            <Info label="Imported" value={result.accepted} />
            <Info label="Rejected" value={result.rejected} />
          </div>
          <p>
            Imported rows are merged into Stock presentation data for this
            session only.
          </p>
          <button className="primary-action" onClick={resetWizard}>
            Start New Import
          </button>
        </div>
      )}
    </div>
  );
}
~~~

## CMP-admin-console-LogTable

src/admin-console.tsx:3163-3212

~~~tsx
function LogTable({
  logs,
  onSelect,
}: {
  logs: DemoLogEntry[];
  onSelect: (log: DemoLogEntry) => void;
}) {
  if (logs.length === 0)
    return (
      <div className="list-empty">
        <h3>No matching log entries</h3>
      </div>
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Area</th>
            <th>Feature</th>
            <th>Message</th>
            <th>User</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="clickable-row"
              onClick={() => onSelect(log)}
            >
              <td>{new Date(log.timestamp).toLocaleString("en-IN")}</td>
              <td>
                <span className={`status ${log.level}`}>{log.level}</span>
              </td>
              <td>{log.area}</td>
              <td>{log.feature}</td>
              <td>{log.message}</td>
              <td>{log.userName ?? "Unavailable"}</td>
              <td>{log.referenceId ?? "Unavailable"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
~~~

## CMP-admin-console-LogsPanel

src/admin-console.tsx:3214-3424

~~~tsx
function LogsPanel({
  adminState,
  stream,
  commit,
}: {
  adminState: AdminDemoState;
  stream: DemoLogStream;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => void;
}) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [level, setLevel] = useState("ALL");
  const [area, setArea] = useState("ALL");
  const [selected, setSelected] = useState<DemoLogEntry>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const streamLogs = adminState.logs.filter((log) => log.stream === stream);
  const areas = Array.from(new Set(streamLogs.map((log) => log.area))).sort();
  const filtered = filterDemoLogs(streamLogs, {
    stream,
    search,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    levels:
      level === "ALL" ? undefined : [level as (typeof LOG_LEVELS)[number]],
    area: area === "ALL" ? undefined : area,
  });
  const paged = paginate(filtered, page, pageSize);
  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setLevel("ALL");
    setArea("ALL");
    setPage(1);
  };
  const columns: ExportColumn<DemoLogEntry>[] = [
    {
      header: "Timestamp",
      value: (row) => new Date(row.timestamp).toLocaleString("en-IN"),
    },
    { header: "Level", value: (row) => row.level },
    { header: "Area", value: (row) => row.area },
    { header: "Feature", value: (row) => row.feature },
    { header: "Message", value: (row) => row.message },
    { header: "User", value: (row) => row.userName ?? "Unavailable" },
    { header: "Reference", value: (row) => row.referenceId ?? "Unavailable" },
  ];
  const clear = () => {
    if (
      !window.confirm(
        `Clear all ${stream} logs for this session? This cannot be undone.`,
      )
    )
      return;
    commit((current) => clearDemoLogs(current, stream));
  };

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search logs"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Message, area, feature, user or reference"
          />
        </label>
        <label>
          Date from
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Date to
          <input
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Level
          <select
            value={level}
            onChange={(event) => {
              setLevel(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All levels</option>
            {LOG_LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Area
          <select
            value={area}
            onChange={(event) => {
              setArea(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All areas</option>
            {areas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={
          <>
            <DownloadMenu
              report={{
                title:
                  stream === "operational"
                    ? "Daily Operational Logs"
                    : "Feature Activity",
                filters: activeFilterSummary({
                  Search: search.trim(),
                  Level: level,
                  Area: area,
                  "Date from": dateFrom,
                  "Date to": dateTo,
                }),
                columns,
                rows: filtered,
              }}
            />
            <button
              className="danger-action"
              onClick={clear}
              disabled={streamLogs.length === 0}
            >
              Clear Logs
            </button>
          </>
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Log records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      <LogTable logs={paged.items} onSelect={setSelected} />
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
      {selected && (
        <Dialog
          title="Log detail"
          subtitle={new Date(selected.timestamp).toLocaleString("en-IN")}
          onClose={() => setSelected(undefined)}
        >
          <div className="linked-grid">
            <Info label="Level" value={selected.level} />
            <Info label="Area" value={selected.area} />
            <Info label="Feature" value={selected.feature} />
            <Info label="User" value={selected.userName ?? "Unavailable"} />
            <Info
              label="Reference"
              value={selected.referenceId ?? "Unavailable"}
            />
          </div>
          <p>{selected.message}</p>
          {selected.details && (
            <pre className="log-details">
              {JSON.stringify(selected.details, null, 2)}
            </pre>
          )}
        </Dialog>
      )}
    </div>
  );
}
~~~

## CMP-admin-console-RetentionSettingsPanel

src/admin-console.tsx:3426-3521

~~~tsx
function RetentionSettingsPanel({
  adminState,
  commit,
  actingUser,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => void;
  actingUser: User;
}) {
  const [operationalDays, setOperationalDays] = useState(
    adminState.businessSettings.logRetention.operationalDays,
  );
  const [featureDays, setFeatureDays] = useState(
    adminState.businessSettings.logRetention.featureDays,
  );
  useEffect(() => {
    setOperationalDays(
      adminState.businessSettings.logRetention.operationalDays,
    );
    setFeatureDays(adminState.businessSettings.logRetention.featureDays);
  }, [adminState.businessSettings.logRetention]);
  const dirty =
    operationalDays !==
      adminState.businessSettings.logRetention.operationalDays ||
    featureDays !== adminState.businessSettings.logRetention.featureDays;

  return (
    <div className="manager-panel" role="tabpanel">
      <p>
        This is demo operational visibility, not a production observability or
        compliance audit trail.
      </p>
      <div className="form-grid">
        <label>
          Operational / error log retention (days)
          <input
            type="number"
            min={1}
            value={operationalDays}
            onChange={(event) => setOperationalDays(Number(event.target.value))}
          />
        </label>
        <label>
          Feature activity retention (days)
          <input
            type="number"
            min={1}
            value={featureDays}
            onChange={(event) => setFeatureDays(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="action-row">
        <button
          disabled={!dirty}
          onClick={() => {
            setOperationalDays(
              adminState.businessSettings.logRetention.operationalDays,
            );
            setFeatureDays(
              adminState.businessSettings.logRetention.featureDays,
            );
          }}
        >
          Reset to Saved
        </button>
        <button
          className="primary-action"
          disabled={!dirty || operationalDays < 1 || featureDays < 1}
          onClick={() =>
            commit(
              (current) =>
                updateBusinessSettings(current, {
                  logRetention: { operationalDays, featureDays },
                }),
              {
                stream: "feature",
                level: "info",
                area: "Administration",
                feature: "Support & Logs",
                message: "Log retention settings updated",
                userId: String(actingUser.id),
                userName: actingUser.name,
              },
            )
          }
        >
          Save Retention Settings
        </button>
      </div>
    </div>
  );
}
~~~

## CMP-admin-console-SupportLogsTab

src/admin-console.tsx:3523-3580

~~~tsx
function SupportLogsTab({
  adminState,
  commit,
  refresh,
  actingUser,
}: {
  adminState: AdminDemoState;
  commit: (
    mutator: (s: AdminDemoState) => AdminDemoState,
    entry?: LogEntryInput,
  ) => void;
  refresh: () => void;
  actingUser: User;
}) {
  const [subTab, setSubTab] = useState<SupportSubTab>("Daily Operational Logs");
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Support &amp; Logs</h3>
        <button onClick={refresh}>Refresh</button>
      </div>
      <div
        className="sub-tabs"
        role="tablist"
        aria-label="Support and logs sections"
      >
        {SUPPORT_SUB_TABS.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={subTab === item}
            className={subTab === item ? "active" : ""}
            onClick={() => setSubTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {subTab === "Daily Operational Logs" && (
        <LogsPanel
          adminState={adminState}
          stream="operational"
          commit={commit}
        />
      )}
      {subTab === "Feature Activity" && (
        <LogsPanel adminState={adminState} stream="feature" commit={commit} />
      )}
      {subTab === "Retention Settings" && (
        <RetentionSettingsPanel
          adminState={adminState}
          commit={commit}
          actingUser={actingUser}
        />
      )}
    </div>
  );
}
~~~

## CMP-App-App

src/App.tsx:578-1320

~~~tsx
function App() {
  const [db, setDb] = useState<Database>();
  const [state, setState] = useState<WorkshopState>();
  const [user, setUser] = useState<User>();
  const [selectedJobId, setSelectedJobId] = useState<number>();
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [railToggleTop, setRailToggleTop] = useState(118);
  const railToggleDragging = useRef(false);
  const railToggleMoved = useRef(false);
  const railToggleStartY = useRef(0);
  const [query, setQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<
    SearchCategorySelection | ""
  >("");
  const [searchStatus, setSearchStatus] =
    useState<SearchCriteria["status"]>("ALL");
  const [searchDateFilter, setSearchDateFilter] = useState("");
  const [searchMonthFilter, setSearchMonthFilter] = useState("");
  const [searchPaymentMode, setSearchPaymentMode] = useState<
    "ALL" | PaymentMode
  >("ALL");
  const [searchLowStockOnly, setSearchLowStockOnly] = useState(false);
  const [searchNavigate, setSearchNavigate] = useState<{
    kind: "jobs" | "customers" | "vehicles";
    id: number;
  }>();
  const [stockSearchNavigate, setStockSearchNavigate] = useState<string>();
  const [dashboardDrilldown, setDashboardDrilldown] =
    useState<DashboardDrilldown>();
  const [adminStateVersion, setAdminStateVersion] = useState(0);
  const [appTheme, setAppTheme] = useState<AppTheme>(
    () => loadAdminDemoState().appTheme,
  );
  const [loginError, setLoginError] = useState("");
  const [jobCardNotification, setJobCardNotification] = useState<{
    payload: JobCardNotificationPayload;
    deliveryMessage: string;
  }>();
  const [developerMode, setDeveloperMode] = useState(false);
  const [developerEmulation, setDeveloperEmulation] = useState<{
    tenantId: string;
    role: EmulationRole;
  }>();
  const [developerState, setDeveloperState] = useState<DeveloperControlPlaneState>(
    () => loadDeveloperControlPlane(),
  );
  const [authConfig, setAuthConfig] = useState<AuthConfig>();
  const [authLoading, setAuthLoading] = useState(true);
  const currentAdminState = useMemo(
    () => loadAdminDemoState(),
    [adminStateVersion],
  );

  useEffect(() => {
    if (!user) return;
    const items = menuItemsForRole(
      user.role,
      resolvePermittedPages(currentAdminState, user.role),
    );
    if (!items.some((item) => item.label === activeMenuItem))
      setActiveMenuItem(items[0]?.label ?? "");
  }, [activeMenuItem, currentAdminState, user]);

  useEffect(() => {
    openWorkshopDb().then((database) => {
      setDb(database);
      const next = readState(database);
      syncDocumentSnapshots(undefined, next.jobs, loadAdminDemoState());
      setState(next);
      setSelectedJobId(next.jobs[0]?.job.id);
    });
  }, []);

  useEffect(() => {
    const font =
      APP_THEME_FONTS.find((item) => item.id === appTheme.fontId) ??
      APP_THEME_FONTS[0];
    const palette =
      APP_THEME_PALETTES.find((item) => item.id === appTheme.paletteId) ??
      APP_THEME_PALETTES[0];
    const root = document.documentElement;
    root.style.setProperty("--app-font-family", font.cssFamily);
    root.style.setProperty("--app-theme-background", palette.tokens.background);
    root.style.setProperty("--app-theme-sidebar", palette.tokens.sidebar);
    root.style.setProperty(
      "--app-theme-sidebar-border",
      palette.tokens.sidebarBorder,
    );
    root.style.setProperty(
      "--app-theme-sidebar-text",
      palette.tokens.sidebarText,
    );
    root.style.setProperty("--app-theme-active", palette.tokens.active);
    root.style.setProperty(
      "--app-theme-active-border",
      palette.tokens.activeBorder,
    );
    root.style.setProperty("--app-theme-hover", palette.tokens.hover);
    root.style.setProperty("--app-theme-accent", palette.tokens.accent);
    root.style.setProperty("--app-theme-focus", palette.tokens.focus);
    root.style.setProperty(
      "--app-theme-table-header",
      palette.tokens.tableHeader,
    );
  }, [appTheme]);

  useEffect(() => {
    loadAuthConfig()
      .then(async (config) => {
        setAuthConfig(config);
        if (config.mode === "cognito") {
          try {
            const session = await loadWorkshopSession(config);
            if (session) {
              const role = workshopRole(
                session.membership.roles.map((item) => item.name),
              );
              const authenticatedUser: User = {
                id: -1,
                name: session.membership.displayName,
                email: session.membership.email,
                role,
                password: "",
                externalAuth: true,
                externalId: session.membership.id,
              };
              setUser(authenticatedUser);
              const items = menuItemsForRole(
                role,
                resolvePermittedPages(loadAdminDemoState(), role),
              );
              setActiveMenuItem(items[0]?.label ?? "");
            }
          } catch (error) {
            setLoginError(apiErrorMessage(error));
          }
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const moveRailToggle = (clientY: number) => {
      if (Math.abs(clientY - railToggleStartY.current) > 4)
        railToggleMoved.current = true;
      const nextTop = Math.min(
        Math.max(clientY - 22, 82),
        window.innerHeight - 92,
      );
      setRailToggleTop(nextTop);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!railToggleDragging.current) return;
      moveRailToggle(event.clientY);
    };
    const handlePointerUp = () => {
      if (!railToggleDragging.current) return;
      railToggleDragging.current = false;
      if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (!railToggleDragging.current) return;
      moveRailToggle(event.clientY);
    };
    const handleMouseUp = () => {
      if (!railToggleDragging.current) return;
      railToggleDragging.current = false;
      if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const searchCriteria = useMemo<SearchCriteria | undefined>(
    () =>
      searchCategory === "job" || searchCategory === "invoice"
        ? {
            query,
            category: searchCategory,
            status: searchCategory === "job" ? searchStatus : "ALL",
          }
        : undefined,
    [query, searchCategory, searchStatus],
  );
  const searchResults = useMemo(
    () => (state && searchCriteria ? searchJobs(state, searchCriteria) : []),
    [state, searchCriteria],
  );
  const jobs = useMemo(
    () =>
      searchResults
        .map((result) => result.view)
        .filter(
          (view) =>
            (!searchDateFilter ||
              (searchCategory === "job"
                ? view.job.estimated_delivery
                : view.visit.received_at.slice(0, 10)) === searchDateFilter) &&
            (searchDateFilter ||
              !searchMonthFilter ||
              (searchCategory === "job"
                ? view.job.estimated_delivery
                : view.visit.received_at.slice(0, 7)
              )?.slice(0, 7) === searchMonthFilter),
        ),
    [searchResults, searchCategory, searchDateFilter, searchMonthFilter],
  );
  const paymentRows = useMemo(() => {
    if (!state || searchCategory !== "payment") return [];
    const needle = normalizeSearch(query);
    return state.jobs
      .flatMap((view) => view.payments.map((payment) => ({ view, payment })))
      .filter(({ view, payment }) => {
        const paidAt = payment.created_at ?? "";
        const searchable = normalizeSearch(
          [
            view.job.job_no,
            view.invoice?.invoice_no,
            view.invoice?.tally_invoice_no,
            view.customer.name,
            view.customer.mobile,
            view.vehicle.number,
            view.vehicle.make,
            view.vehicle.model,
            payment.mode,
            payment.reference,
            payment.other_detail,
          ].join(" "),
        );
        return (
          !payment.voided_at &&
          (!needle || searchable.includes(needle)) &&
          (searchPaymentMode === "ALL" || payment.mode === searchPaymentMode) &&
          (!searchDateFilter || paidAt.slice(0, 10) === searchDateFilter) &&
          (!searchMonthFilter || paidAt.slice(0, 7) === searchMonthFilter)
        );
      })
      .sort((left, right) =>
        (right.payment.created_at ?? "").localeCompare(
          left.payment.created_at ?? "",
        ),
      );
  }, [
    state,
    searchCategory,
    query,
    searchPaymentMode,
    searchDateFilter,
    searchMonthFilter,
  ]);
  const selected =
    state?.jobs.find((item) => item.job.id === selectedJobId) ?? state?.jobs[0];

  const mutate: Mutate = (action, onError) => {
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
  };

  const handleLogin = (email: string, password: string) => {
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
  };

  const handleLogout = () => {
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
  };

  const handleRailTogglePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleRailTogglePointerMove = (
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
  };

  const handleRailTogglePointerUp = () => {
    if (!railToggleDragging.current) return;
    railToggleDragging.current = false;
    if (!railToggleMoved.current) setSidebarCollapsed((value) => !value);
  };

  const handleRailToggleMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    railToggleDragging.current = true;
    railToggleMoved.current = false;
    railToggleStartY.current = event.clientY;
  };

  if (!state || authLoading)
    return <div className="loading">Loading WorkshopOS...</div>;
  const returnToDeveloper = () => {
    setUser(undefined);
    setDeveloperEmulation(undefined);
    setDeveloperMode(true);
    setActiveMenuItem("");
  };

  if (developerMode) {
    return (
      <DeveloperConsole
        state={developerState}
        commit={(action) => {
          const next = saveDeveloperControlPlane(action(developerState));
          setDeveloperState(next);
        }}
        onEmulate={(role) => {
          const tenant = selectedDeveloperTenant(developerState);
          if (tenant.lifecycle !== "active") return;
          setDeveloperEmulation({ tenantId: tenant.id, role });
          setUser({
            id: -100,
            name: `Developer emulating ${tenant.profile.name}`,
            email: `developer+${role}@demo.local`,
            password: "",
            role: roleForEmulation(role),
          });
          setDeveloperMode(false);
        }}
        onReset={() => setDeveloperState(resetDeveloperControlPlane())}
      />
    );
  }

  if (!user)
    return (
      <LoginScreen
        onLogin={handleLogin}
        onCognitoLogin={() =>
          authConfig?.mode === "cognito" && beginCognitoLogin(authConfig)
        }
        config={authConfig}
        error={loginError}
      />
    );

  // Reads the (session-storage backed) Admin Console role/page-access state fresh on every
  // render so a role's permitted pages here reflect the latest Roles & Page Access save made
  // in the Admin Console during this session, without the two stores needing to be merged.
  const permittedPages = resolvePermittedPages(currentAdminState, user.role);
  const menuItems = menuItemsForRole(user.role, permittedPages);

  const leaveSearch = () => {
    setQuery("");
    setSearchCategory("");
    setSearchStatus("ALL");
    setSearchDateFilter("");
    setSearchMonthFilter("");
    setSearchPaymentMode("ALL");
  };
  const openStockSearchRecord = (item: InventoryItem) => {
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
  };
  const openSearchRecord = (
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
  };
  const openDashboardDrilldown = (drilldown: DashboardDrilldown) => {
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
  };

  return (
    <div
      className={`app-shell role-${user.role}${sidebarCollapsed ? " rail-collapsed" : ""}`}
    >
      <aside className="rail">
        <div className="brand">
          <Car size={30} />
          <div>
            <strong>WorkshopOS</strong>
            <span>{appTagline}</span>
          </div>
        </div>
        <button
          className="rail-toggle"
          onPointerDown={handleRailTogglePointerDown}
          onPointerMove={handleRailTogglePointerMove}
          onPointerUp={handleRailTogglePointerUp}
          onMouseDown={handleRailToggleMouseDown}
          aria-label={sidebarCollapsed ? "Show left menu" : "Hide left menu"}
          title={sidebarCollapsed ? "Show left menu" : "Hide left menu"}
          style={{ top: railToggleTop }}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
        <div className="rail-role">{roleLabels[user.role]}</div>
        <nav className="role-nav" aria-label={`${roleLabels[user.role]} menu`}>
          {menuItems.length === 0 ? (
            <p className="empty-state">No pages assigned.</p>
          ) : (
            <>
            {menuItems.filter((item) => !SALES_CRM_PAGES.some((page) => page.key === item.key)).map((item) => (
              <button
                key={item.label}
                className={activeMenuItem === item.label ? "active" : ""}
                onClick={() => {
                  if (activeMenuItem === "Search" && item.label !== "Search") {
                    setQuery("");
                    setSearchCategory("");
                    setSearchStatus("ALL");
                    setSearchDateFilter("");
                    setSearchMonthFilter("");
                    setSearchPaymentMode("ALL");
                  }
                  setDashboardDrilldown(undefined);
                  setActiveMenuItem(item.label);
                }}
                title={item.label}
              >
                {item.icon}
                <span>
                  {item.label === "Approvals"
                    ? `Approvals (${state.jobs.filter((view) => view.material_approval?.status === "Pending").length})`
                    : item.label}
                </span>
              </button>
            ))}
            {user.role === "admin" && <details className="sales-crm-nav"><summary>Sales CRM</summary>{menuItems.filter((item) => SALES_CRM_PAGES.some((page) => page.key === item.key)).map((item) => <button key={item.label} className={activeMenuItem === item.label ? "active" : ""} onClick={() => setActiveMenuItem(item.label)} title={item.label}>{item.icon}<span>{item.label}</span></button>)}</details>}
            </>
          )}
        </nav>
        <button className="logout" onClick={developerEmulation ? returnToDeveloper : handleLogout}>
          <LogOut size={18} />
          <span>{developerEmulation ? "Return to Developer" : "Logout"}</span>
        </button>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p>{roleLabels[user.role]}</p>
            <h1>{headlineFor(user.role)}</h1>
          </div>
          {activeMenuItem === "Search" && (
            <div className="search-topbar-controls">
              <label>
                Search category
                <select
                  aria-label="Search category"
                  value={searchCategory}
                  onChange={(event) => {
                    const nextCategory = event.target.value as
                      | SearchCategorySelection
                      | "";
                    setSearchCategory(nextCategory);
                    if (nextCategory === "job" && searchCategory !== "job") {
                      setSearchDateFilter("");
                      setSearchMonthFilter(localCalendarDate().slice(0, 7));
                    }
                    if (nextCategory !== "job") setSearchStatus("ALL");
                    if (nextCategory !== "payment") setSearchPaymentMode("ALL");
                    if (nextCategory !== "stock") {
                      setSearchLowStockOnly(false);
                    }
                  }}
                >
                  <option value="">Select a category</option>
                  {searchCategoriesFor(user, permittedPages).map((item) => (
                    <option key={item} value={item}>
                      {item in ADMIN_OPERATIONAL_SEARCH_LABELS
                        ? ADMIN_OPERATIONAL_SEARCH_LABELS[
                            item as AdminOperationalSearchCategory
                          ]
                        : SEARCH_CATEGORY_LABELS[item as SearchTableCategory]}
                    </option>
                  ))}
                </select>
              </label>
              <FilterClearButton
                label="Clear category"
                disabled={!searchCategory}
                onClick={() => setSearchCategory("")}
              />
            </div>
          )}
          <div className="user-pill">
            <UserRound size={18} />
            {user.email}
          </div>
          {developerEmulation && (
            <button className="secondary-action" onClick={returnToDeveloper}>
              Return to Developer
            </button>
          )}
          <button
            className="mobile-logout"
            onClick={developerEmulation ? returnToDeveloper : handleLogout}
            aria-label={developerEmulation ? "Return to Developer" : "Logout"}
          >
            <LogOut size={18} />
            {developerEmulation ? "Return" : "Logout"}
          </button>
        </header>

        {menuItems.length === 0 ? (
          <section className="workspace single-panel">
            <div className="list-empty">
              <h2>No pages assigned</h2>
              <p>
                Your role has no permitted workspace pages. Contact an
                Owner/Admin.
              </p>
            </div>
          </section>
        ) : (
          <RoleWorkspace
            activeMenuItem={activeMenuItem}
            jobs={jobs}
            mutate={mutate}
            query={query}
            searchCategory={searchCategory}
            searchStatus={searchStatus}
            searchDateFilter={searchDateFilter}
            searchMonthFilter={searchMonthFilter}
            searchPaymentMode={searchPaymentMode}
            searchLowStockOnly={searchLowStockOnly}
            paymentRows={paymentRows}
            searchNavigate={searchNavigate}
            permittedPages={permittedPages}
            selected={selected}
            selectedJobId={selectedJobId}
            setQuery={setQuery}
            setSearchCategory={setSearchCategory}
            setSearchStatus={setSearchStatus}
            setSearchDateFilter={setSearchDateFilter}
            setSearchMonthFilter={setSearchMonthFilter}
            setSearchPaymentMode={setSearchPaymentMode}
            setSearchLowStockOnly={setSearchLowStockOnly}
            setSelectedJobId={setSelectedJobId}
            onOpenSearchRecord={openSearchRecord}
            onOpenStockSearchRecord={openStockSearchRecord}
            onSearchNavigateConsumed={() => setSearchNavigate(undefined)}
            stockSearchNavigate={stockSearchNavigate}
            dashboardDrilldown={dashboardDrilldown}
            state={state}
            user={user}
            cognitoConfig={
              authConfig?.mode === "cognito" ? authConfig : undefined
            }
            onNavigate={setActiveMenuItem}
            onDashboardNavigate={openDashboardDrilldown}
            onThemeSaved={setAppTheme}
            onAdminStateSaved={() => setAdminStateVersion((value) => value + 1)}
          />
        )}
      </main>
      {jobCardNotification && (
        <JobCardNotificationDialog
          notification={jobCardNotification}
          onClose={() => setJobCardNotification(undefined)}
        />
      )}
    </div>
  );
}
~~~

## CMP-App-JobCardNotificationDialog

src/App.tsx:1322-1363

~~~tsx
function JobCardNotificationDialog({
  notification,
  onClose,
}: {
  notification: {
    payload: JobCardNotificationPayload;
    deliveryMessage: string;
  };
  onClose: () => void;
}) {
  const { payload, deliveryMessage } = notification;
  const eventLabel = payload.event === "created" ? "created" : "completed";
  return (
    <Dialog
      title={`Job card ${eventLabel}`}
      subtitle={deliveryMessage}
      onClose={onClose}
      footer={
        <button
          type="button"
          className="primary-action"
          data-dialog-initial-focus
          onClick={onClose}
        >
          Done
        </button>
      }
    >
      <p className="permission-note">
        The customer notification details are shown below.
      </p>
      <section className="notification-message" aria-label="WhatsApp message">
        <strong>WhatsApp</strong>
        <p>{payload.whatsapp}</p>
      </section>
      <section className="notification-message" aria-label="Email message">
        <strong>Email</strong>
        <p>{payload.email}</p>
      </section>
    </Dialog>
  );
}
~~~

## CMP-App-LoginScreen

src/App.tsx:1365-1452

~~~tsx
function LoginScreen({
  onLogin,
  onCognitoLogin,
  config,
  error,
}: {
  onLogin: (email: string, password: string) => void;
  onCognitoLogin: () => void;
  config?: AuthConfig;
  error: string;
}) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-mark">
          <ShieldCheck size={36} />
          <div>
            <span>WorkshopOS</span>
            <small>{appTagline}</small>
          </div>
        </div>
        <h1>Sign in to your workshop desk</h1>
        {config?.mode === "cognito" ? (
          <div className="cognito-login">
            <p>
              Use your business account to continue. New invitations require a
              password change at first sign-in.
            </p>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-action" onClick={onCognitoLogin}>
              Continue with Cognito
            </button>
          </div>
        ) : config?.mode === "local" && !config.allowDemo ? (
          <div className="cognito-login">
            <p className="error-text">
              Authentication is not configured for this deployment. Contact your
              WorkshopOS administrator.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(email, password);
            }}
          >
            <label>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="primary-action">Login</button>
          </form>
        )}
        {config?.mode === "local" && config.allowDemo && (
          <label className="demo-login-select">
            Emulate User:
            <select
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            >
              {demoLogins.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <span>Demo version now - use quick logins only.</span>
          </label>
        )}
      </section>
    </main>
  );
}
~~~

## CMP-App-RoleWorkspace

src/App.tsx:1459-1761

~~~tsx
function RoleWorkspace({
  activeMenuItem,
  jobs,
  mutate,
  query,
  searchCategory,
  searchStatus,
  searchDateFilter,
  searchMonthFilter,
  searchPaymentMode,
  searchLowStockOnly,
  paymentRows,
  searchNavigate,
  permittedPages,
  selected,
  selectedJobId,
  setQuery,
  setSearchCategory,
  setSearchStatus,
  setSearchDateFilter,
  setSearchMonthFilter,
  setSearchPaymentMode,
  setSearchLowStockOnly,
  setSelectedJobId,
  onOpenSearchRecord,
  onOpenStockSearchRecord,
  onSearchNavigateConsumed,
  stockSearchNavigate,
  dashboardDrilldown,
  state,
  user,
  cognitoConfig,
  onNavigate,
  onDashboardNavigate,
  onThemeSaved,
  onAdminStateSaved,
}: {
  activeMenuItem: string;
  jobs: JobView[];
  mutate: Mutate;
  query: string;
  searchCategory: SearchCategorySelection | "";
  searchStatus: SearchCriteria["status"];
  searchDateFilter: string;
  searchMonthFilter: string;
  searchPaymentMode: "ALL" | PaymentMode;
  searchLowStockOnly: boolean;
  paymentRows: PaymentSearchRow[];
  searchNavigate?: { kind: "jobs" | "customers" | "vehicles"; id: number };
  permittedPages: AdminPageKey[];
  selected?: JobView;
  selectedJobId?: number;
  setQuery: (value: string) => void;
  setSearchCategory: (value: SearchCategorySelection | "") => void;
  setSearchStatus: (value: SearchCriteria["status"]) => void;
  setSearchDateFilter: (value: string) => void;
  setSearchMonthFilter: (value: string) => void;
  setSearchPaymentMode: (value: "ALL" | PaymentMode) => void;
  setSearchLowStockOnly: (value: boolean) => void;
  setSelectedJobId: (value: number) => void;
  onOpenSearchRecord: (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock">,
  ) => void;
  onOpenStockSearchRecord: (item: InventoryItem) => void;
  onSearchNavigateConsumed: () => void;
  stockSearchNavigate?: string;
  dashboardDrilldown?: DashboardDrilldown;
  state: WorkshopState;
  user: User;
  cognitoConfig?: CognitoConfig;
  onNavigate: (label: string) => void;
  onDashboardNavigate: (drilldown: DashboardDrilldown) => void;
  onThemeSaved: (theme: AppTheme) => void;
  onAdminStateSaved: () => void;
}) {
  const [procurementDraft, setProcurementDraft] = useState<ProcurementDraft>();
  if (activeMenuItem === "Leads") return cognitoConfig ? <RemoteSalesWorkspace config={cognitoConfig} mode="leads" /> : <LocalSalesWorkspace state={state} mutate={mutate} mode="leads" />;
  if (activeMenuItem === "Quotations") return cognitoConfig ? <RemoteSalesWorkspace config={cognitoConfig} mode="quotations" /> : <LocalSalesWorkspace state={state} mutate={mutate} mode="quotations" />;
  if (activeMenuItem === "Quotation Settings") return <AdminConsole state={state} mutate={mutate} actingUser={user} cognitoConfig={cognitoConfig} onThemeSaved={onThemeSaved} onStateSaved={onAdminStateSaved} initialTab="Report Templates" initialReportCategory="quotation" />;
  if (cognitoConfig && activeMenuItem === "Follow-ups")
    return <RemoteFollowupsWorkspace config={cognitoConfig} mode="followups" />;
  if (cognitoConfig && activeMenuItem === "Search")
    return <RemoteFollowupsWorkspace config={cognitoConfig} mode="search" />;
  if (
    cognitoConfig &&
    ["Ready To Invoice", "Invoice"].includes(activeMenuItem)
  )
    return <RemoteFinanceWorkspace config={cognitoConfig} mode="invoice" />;
  if (cognitoConfig && activeMenuItem === "Payment")
    return <RemoteFinanceWorkspace config={cognitoConfig} mode="payment" />;
  if (cognitoConfig && activeMenuItem === "Delivery")
    return <RemoteFinanceWorkspace config={cognitoConfig} mode="delivery" />;
  if (activeMenuItem === "Search") {
    return (
      <SearchPortal
        jobs={jobs}
        state={state}
        mutate={mutate}
        query={query}
        category={searchCategory}
        status={searchStatus}
        dateFilter={searchDateFilter}
        monthFilter={searchMonthFilter}
        paymentMode={searchPaymentMode}
        lowStockOnly={searchLowStockOnly}
        initialLowStockOnly={
          dashboardDrilldown?.destination === "Search" &&
          dashboardDrilldown.category === "stock" &&
          Boolean(dashboardDrilldown.lowStockOnly)
        }
        paymentRows={paymentRows}
        permittedPages={permittedPages}
        actor={user}
        setQuery={setQuery}
        setCategory={setSearchCategory}
        setStatus={setSearchStatus}
        setDateFilter={setSearchDateFilter}
        setMonthFilter={setSearchMonthFilter}
        setPaymentMode={setSearchPaymentMode}
        setLowStockOnly={setSearchLowStockOnly}
        onOpenRecord={onOpenSearchRecord}
        onOpenStockRecord={onOpenStockSearchRecord}
      />
    );
  }

  if (
    (activeMenuItem === "Job Cards" && user.role !== "service") ||
    (activeMenuItem === "My Queue" && user.role !== "service")
  )
    return (
      <EntityList
        key={`jobs-${dashboardDrilldown?.month ?? ""}-${dashboardDrilldown?.date ?? ""}-${dashboardDrilldown?.status ?? ""}`}
        kind="jobs"
        state={state}
        mutate={mutate}
        actor={user}
        initialFilters={
          dashboardDrilldown?.destination === activeMenuItem
            ? {
                month: dashboardDrilldown.month,
                date: dashboardDrilldown.date,
                primary: dashboardDrilldown.status,
              }
            : undefined
        }
        initialSelectedId={
          searchNavigate?.kind === "jobs" ? searchNavigate.id : undefined
        }
        onInitialSelectionConsumed={onSearchNavigateConsumed}
      />
    );
  if (activeMenuItem === "Customers")
    return (
      <EntityList
        key={`customers-${dashboardDrilldown?.month ?? ""}`}
        kind="customers"
        state={state}
        mutate={mutate}
        actor={user}
        initialFilters={
          dashboardDrilldown?.served === "customers"
            ? { month: dashboardDrilldown.month }
            : undefined
        }
        initialSelectedId={
          searchNavigate?.kind === "customers" ? searchNavigate.id : undefined
        }
        onInitialSelectionConsumed={onSearchNavigateConsumed}
      />
    );
  if (activeMenuItem === "Vehicles")
    return (
      <EntityList
        key={`vehicles-${dashboardDrilldown?.month ?? ""}`}
        kind="vehicles"
        state={state}
        mutate={mutate}
        actor={user}
        initialFilters={
          dashboardDrilldown?.served === "vehicles"
            ? { month: dashboardDrilldown.month }
            : undefined
        }
        initialSelectedId={
          searchNavigate?.kind === "vehicles" ? searchNavigate.id : undefined
        }
        onInitialSelectionConsumed={onSearchNavigateConsumed}
      />
    );
  if (activeMenuItem === "Media")
    return (
      <EntityList kind="media" state={state} mutate={mutate} actor={user} />
    );
  if (
    activeMenuItem === "Purchase Orders" &&
    (user.role === "store" || user.role === "admin")
  )
    return (
      <PurchaseOrdersWorkspace state={state} actor={user} mutate={mutate} procurementDraft={procurementDraft} onProcurementDraftConsumed={() => setProcurementDraft(undefined)} />
    );

  if (user.role === "reception")
    return (
      <Reception
        activeMenuItem={activeMenuItem}
        state={state}
        mutate={mutate}
        user={user}
        selected={selected}
        setSelectedJobId={setSelectedJobId}
      />
    );
  if (user.role === "service" || user.role === "service_manager")
    return (
      <ServiceAdvisor
        activeMenuItem={activeMenuItem}
        state={state}
        view={
          selected?.job.advisor_id === user.id
            ? selected
            : state.jobs.find((item) => item.job.advisor_id === user.id)
        }
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        user={user}
      />
    );
  if (
    ["Stock", "Material Requests", "Issue Material", "Reconcile"].includes(
      activeMenuItem,
    ) &&
    (user.role === "store" || user.role === "admin")
  )
    return (
      <StoreDesk
        activeMenuItem={activeMenuItem}
        state={state}
        actor={user}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        onNavigate={onNavigate}
        onCreatePurchaseRequest={(draft) => {
          setProcurementDraft(draft);
          onNavigate("Purchase Orders");
        }}
        initialStockSearch={stockSearchNavigate}
        initialDrilldown={dashboardDrilldown}
      />
    );
  if (user.role === "store")
    return (
      <StoreDesk
        activeMenuItem={activeMenuItem}
        state={state}
        actor={user}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        onNavigate={onNavigate}
        onCreatePurchaseRequest={(draft) => {
          setProcurementDraft(draft);
          onNavigate("Purchase Orders");
        }}
      />
    );
  if (user.role === "tech")
    return (
      <Technician
        activeMenuItem={activeMenuItem}
        state={state}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
      />
    );
  if (user.role === "accounts")
    return (
      <Accounts
        activeMenuItem={activeMenuItem}
        state={state}
        view={selected}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        actor={user}
      />
    );
  return (
    <Admin
      activeMenuItem={activeMenuItem}
      state={state}
      selected={selected}
      mutate={mutate}
      setSelectedJobId={setSelectedJobId}
      user={user}
      cognitoConfig={cognitoConfig}
      onNavigate={onNavigate}
      onDashboardNavigate={onDashboardNavigate}
      dashboardDrilldown={dashboardDrilldown}
      onThemeSaved={onThemeSaved}
      onAdminStateSaved={onAdminStateSaved}
    />
  );
}
~~~

## CMP-App-SearchPortal

src/App.tsx:1772-2203

~~~tsx
function SearchPortal({
  jobs,
  state,
  mutate,
  query,
  category,
  status,
  dateFilter,
  monthFilter,
  paymentMode,
  lowStockOnly,
  initialLowStockOnly,
  paymentRows,
  permittedPages,
  actor,
  setQuery,
  setCategory,
  setStatus,
  setDateFilter,
  setMonthFilter,
  setPaymentMode,
  setLowStockOnly,
  onOpenRecord,
  onOpenStockRecord,
}: {
  jobs: JobView[];
  state: WorkshopState;
  mutate: Mutate;
  query: string;
  category: SearchCategorySelection | "";
  status: SearchCriteria["status"];
  dateFilter: string;
  monthFilter: string;
  paymentMode: "ALL" | PaymentMode;
  lowStockOnly: boolean;
  initialLowStockOnly: boolean;
  paymentRows: PaymentSearchRow[];
  permittedPages: AdminPageKey[];
  actor: User;
  setQuery: (value: string) => void;
  setCategory: (value: SearchCategorySelection | "") => void;
  setStatus: (value: SearchCriteria["status"]) => void;
  setDateFilter: (value: string) => void;
  setMonthFilter: (value: string) => void;
  setPaymentMode: (value: "ALL" | PaymentMode) => void;
  setLowStockOnly: (value: boolean) => void;
  onOpenRecord: (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock">,
  ) => void;
  onOpenStockRecord: (item: InventoryItem) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [jobWorkflow, setJobWorkflow] = useState("ALL");
  const [jobAdvisor, setJobAdvisor] = useState("ALL");
  const [jobSort, setJobSort] = useState("newest");
  const [jobArchivedOnly, setJobArchivedOnly] = useState(false);
  const [activeLowStockOnly, setActiveLowStockOnly] = useState(
    lowStockOnly || initialLowStockOnly,
  );
  useEffect(() => {
    if (lowStockOnly || initialLowStockOnly) setActiveLowStockOnly(true);
  }, [lowStockOnly, initialLowStockOnly]);
  const [record, setRecord] = useState<{
    view: JobView;
    category: Exclude<SearchTableCategory, "stock">;
    mode: "view" | "edit";
  }>();

  const operationalCategory =
    actor.role === "admin" &&
    category !== "stock" &&
    ADMIN_OPERATIONAL_SEARCH_CATEGORIES.includes(
      category as AdminOperationalSearchCategory,
    )
      ? (category as AdminOperationalSearchCategory)
      : undefined;
  const availableMonths = [
    ...new Set(
      (category === "payment"
        ? [
            monthFilter,
            ...state.jobs.flatMap((view) =>
              view.payments
                .filter((payment) => !payment.voided_at)
                .map((payment) => payment.created_at?.slice(0, 7) ?? ""),
            ),
          ]
        : state.jobs.map((view) =>
            category === "job"
              ? view.job.estimated_delivery?.slice(0, 7) ?? ""
              : view.visit.received_at.slice(0, 7),
          )
      ).filter((month) => /^\d{4}-\d{2}$/.test(month)),
    ),
  ].sort((left, right) => right.localeCompare(left));

  const changeFilters = (change: () => void) => {
    change();
    setPage(1);
  };
  const clearFilters = () => {
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
  };
  const clearJobCardFilters = () => {
    setQuery("");
    setStatus("ALL");
    setDateFilter("");
    setMonthFilter("");
    setJobWorkflow("ALL");
    setJobAdvisor("ALL");
    setJobSort("newest");
    setJobArchivedOnly(false);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [category]);

  const jobRows = useMemo(() => {
    const source = jobArchivedOnly && actor.role === "admin" ? state.archived_jobs : jobs;
    return source.filter((view) =>
      (!query || normalizeSearch(`${view.job.job_no} ${view.vehicle.number} ${view.vehicle.make} ${view.vehicle.model} ${view.customer.name} ${view.customer.mobile}`).includes(normalizeSearch(query))) &&
      (status === "ALL" || view.job.main_status === status) &&
      (!dateFilter || view.job.estimated_delivery === dateFilter) &&
      (!monthFilter || view.job.estimated_delivery?.slice(0, 7) === monthFilter) &&
      (jobWorkflow === "ALL" || view.job.sub_status === jobWorkflow) &&
      (jobAdvisor === "ALL" || String(view.advisor.id) === jobAdvisor),
    ).sort((a, b) => {
      if (jobSort === "oldest") return a.job.id - b.job.id;
      if (jobSort === "amount-high") return jobTotal(b) - jobTotal(a);
      if (jobSort === "amount-low") return jobTotal(a) - jobTotal(b);
      if (jobSort === "delivery-soonest") return (a.job.estimated_delivery || "9999-12-31").localeCompare(b.job.estimated_delivery || "9999-12-31");
      if (jobSort === "delivery-latest") return (b.job.estimated_delivery || "").localeCompare(a.job.estimated_delivery || "");
      return b.job.id - a.job.id;
    });
  }, [jobs, state.archived_jobs, actor.role, query, status, dateFilter, monthFilter, jobWorkflow, jobAdvisor, jobSort, jobArchivedOnly]);
  const paged = paginate(category === "job" ? jobRows : jobs, page, pageSize);
  const stockRows = useMemo(() => {
    const needle = normalizeSearch(query);
    return state.inventory.filter(
      (item) =>
        (!activeLowStockOnly || item.stock_qty < item.low_stock_qty) &&
        (!needle ||
          normalizeSearch(
            `${item.sku} ${item.name} ${item.category} ${item.unit}`,
          ).includes(needle)),
    );
  }, [state.inventory, query, activeLowStockOnly]);
  const pagedStock = paginate(stockRows, page, pageSize);
  const isStock = category === "stock";
  const isPayment = category === "payment";
  const entityListKind:
    Extract<EntityKind, "customers" | "vehicles"> | undefined =
    category === "customer"
      ? "customers"
      : category === "vehicle"
        ? "vehicles"
        : undefined;
  const pagedPayments = paginate(paymentRows, page, pageSize);
  const resultPage = isStock ? pagedStock : isPayment ? pagedPayments : paged;

  return (
    <section className="portal">
      {record?.category === "job" && (
        <JobRecordDialog
          view={record.view}
          state={state}
          mutate={mutate}
          actor={actor}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
      )}
      {record?.category === "invoice" && (
        <InvoiceDialog
          fixedJob
          action={record.mode}
          view={record.view}
          actor={actor}
          mutate={mutate}
          onClose={() => setRecord(undefined)}
        />
      )}
      {record?.category === "payment" && (
        <InvoiceDialog
          fixedJob
          action="view"
          view={record.view}
          actor={actor}
          mutate={mutate}
          onClose={() => setRecord(undefined)}
        />
      )}
      {!operationalCategory && !entityListKind && <div className="list-filter-bar">
        {!operationalCategory && category !== "job" && !entityListKind && (
          <label className="list-search">
            Search
            <input
              aria-label="Search records"
              value={query}
              placeholder="Search vehicle, mobile, customer, job card, invoice"
              onChange={(event) =>
                changeFilters(() => setQuery(event.target.value))
              }
            />
          </label>
        )}
          {category === "job" && (
            <JobCardFilterFields
              jobs={jobArchivedOnly && actor.role === "admin" ? state.archived_jobs : state.jobs}
              values={{ search: query, primary: status, secondary: jobWorkflow, date: dateFilter, month: monthFilter, customer: "", advisor: jobAdvisor, sort: jobSort, archivedOnly: jobArchivedOnly }}
              onChange={(patch) => changeFilters(() => {
                if (patch.search !== undefined) setQuery(patch.search);
                if (patch.primary !== undefined) setStatus(patch.primary as SearchCriteria["status"]);
                if (patch.secondary !== undefined) setJobWorkflow(patch.secondary);
                if (patch.date !== undefined) { setDateFilter(patch.date); if (patch.date) setMonthFilter(""); }
                if (patch.month !== undefined) { setMonthFilter(patch.month); if (patch.month) setDateFilter(""); }
                if (patch.advisor !== undefined) setJobAdvisor(patch.advisor);
                if (patch.sort !== undefined) setJobSort(patch.sort);
                if (patch.archivedOnly !== undefined) setJobArchivedOnly(patch.archivedOnly);
              })}
              onClear={clearJobCardFilters}
              showArchive={actor.role === "admin"}
              searchLabel="Search records"
              variant="search"
            />
          )}
        <div className="list-filter-fields open">
          {category === "stock" && activeLowStockOnly && (
            <span className="search-scope" role="status">
              Low stock only
            </span>
          )}
          {!operationalCategory &&
            category &&
            category !== "stock" &&
            !entityListKind && (
              <>
                {false && category === "job" && (
                  <label>
                    Status
                    <select
                      aria-label="Job status"
                      value={status}
                      onChange={(event) =>
                        changeFilters(() =>
                          setStatus(
                            event.target.value as SearchCriteria["status"],
                          ),
                        )
                      }
                    >
                      {SEARCH_STATUS_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item === "ALL" ? "All statuses" : item}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {category === "payment" && (
                  <label>
                    Payment mode
                    <select
                      aria-label="Payment mode filter"
                      value={paymentMode}
                      onChange={(event) =>
                        changeFilters(() =>
                          setPaymentMode(
                            event.target.value as "ALL" | PaymentMode,
                          ),
                        )
                      }
                    >
                      <option value="ALL">All</option>
                      {(
                        [
                          "UPI",
                          "Cash",
                          "Card",
                          "Bank transfer",
                          "Other",
                        ] as PaymentMode[]
                      ).map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {category !== "job" && <><label>
                  Date
                  <input
                    aria-label="Search date"
                    type="date"
                    value={dateFilter}
                    onChange={(event) =>
                      changeFilters(() => {
                        setDateFilter(event.target.value);
                        if (category === "payment") setMonthFilter("");
                      })
                    }
                  />
                </label>
                <label>
                  Month-Year
                  <select
                    aria-label="Search month-year"
                    value={monthFilter}
                    onChange={(event) =>
                      changeFilters(() => {
                        setMonthFilter(event.target.value);
                        if (category === "payment") setDateFilter("");
                      })
                    }
                  >
                    <option value="">All months</option>
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {SEARCH_MONTH_YEAR_FORMATTER.format(
                          new Date(`${month}-01T00:00:00Z`),
                        )}
                      </option>
                    ))}
                  </select>
                </label></>}
              </>
            )}
        </div>
      </div>}

      {operationalCategory ? (
        <AdminSearchOperationalWorkspace
          category={operationalCategory}
          state={state}
          actor={actor}
          mutate={mutate}
        />
      ) : !category ? (
        <div className="empty-state">
          <strong>Please select a category to activate search</strong>
          <span>
            Choose Job Card, Customer, Vehicle, Invoice or Stock above to see
            results.
          </span>
        </div>
      ) : entityListKind ? (
        <EntityList
          key={`search-${entityListKind}`}
          kind={entityListKind}
          state={state}
          mutate={mutate}
          actor={actor}
          externalSearch={query}
          onExternalSearchChange={(value) =>
            changeFilters(() => setQuery(value))
          }
          filterLayout="search"
        />
      ) : (
        <>
          <PaginationToolbar
            from={resultPage.from}
            to={resultPage.to}
            totalCount={resultPage.totalCount}
            page={resultPage.page}
            pageCount={resultPage.pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          />
          {resultPage.totalCount === 0 ? (
            <div className="list-empty">
              <h3>No matching records</h3>
              <p>Adjust the search or clear the filters.</p>
              <FilterClearButton onClick={clearFilters} label="Clear filters" />
            </div>
          ) : isStock ? (
            <StockSearchResultsTable
              rows={pagedStock.items}
              onOpenRecord={onOpenStockRecord}
            />
          ) : isPayment ? (
            <PaymentSearchResultsTable
              rows={pagedPayments.items}
              onOpenRecord={(view) =>
                setRecord({ view, category: "payment", mode: "view" })
              }
            />
          ) : (
            <SearchResultsTable
              category={
                category as Exclude<
                  SearchTableCategory,
                  "stock" | "customer" | "vehicle" | "payment"
                >
              }
              rows={paged.items}
              actor={actor}
              onOpenRecord={(view, itemCategory, mode) => {
                if (actor.role === "service" || itemCategory !== "invoice")
                  setRecord({ view, category: itemCategory, mode });
                else onOpenRecord(view, itemCategory);
              }}
            />
          )}
          <ResultPagination
            page={resultPage.page}
            pageCount={resultPage.pageCount}
            onChange={setPage}
          />
        </>
      )}
    </section>
  );
}
~~~

## CMP-App-AdminSearchOperationalWorkspace

src/App.tsx:2205-2259

~~~tsx
function AdminSearchOperationalWorkspace({
  category,
  state,
  actor,
  mutate,
}: {
  category: AdminOperationalSearchCategory;
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  if (category === "estimate")
    return (
      <ServiceAdvisorList
        key={category}
        kind="estimates"
        jobs={state.jobs}
        state={state}
        mutate={mutate}
        actor={actor}
        filterLayout="search"
      />
    );
  if (category === "follow-ups")
    return (
      <ServiceAdvisorList
        key={category}
        kind="followups"
        jobs={state.jobs}
        state={state}
        mutate={mutate}
        actor={actor}
        filterLayout="search"
      />
    );
  const activeMenuItem =
    category === "material-requests"
      ? "Material Requests"
      : category === "issue-material"
        ? "Issue Material"
        : category === "reconcile"
          ? "Reconcile"
          : "Stock";
  return (
    <StoreDesk
      key={category}
      activeMenuItem={activeMenuItem}
      state={state}
      actor={actor}
      mutate={mutate}
      setSelectedJobId={() => undefined}
      filterLayout="search"
    />
  );
}
~~~

## CMP-App-SearchResultsTable

src/App.tsx:2261-2369

~~~tsx
function SearchResultsTable({
  category,
  rows,
  actor,
  onOpenRecord,
}: {
  category: Exclude<SearchTableCategory, "stock" | "customer" | "vehicle">;
  rows: JobView[];
  actor: User;
  onOpenRecord: (
    view: JobView,
    category: Exclude<SearchTableCategory, "stock" | "customer" | "vehicle">,
    mode: "view" | "edit",
  ) => void;
}) {
  const today = useLocalDeliveryDate();
  const headers =
    category === "job"
      ? ["Job #", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Total", "Actions"]
      : ["Invoice #", "Job", "Customer", "Amount", "Status", "Actions"];
  return (
    <div className="table-wrap">
      <table aria-label={`${SEARCH_CATEGORY_LABELS[category]} search results`}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((view) => {
            const serviceJobEditable =
              actor.role === "service" &&
              canMutateJobLifecycle(actor, view.job) &&
              !isTerminalMainStatus(view.job.main_status);
            const serviceInvoiceEditable =
              actor.role === "service" &&
              Boolean(view.invoice) &&
              resolveJobDocumentActions("invoice", view, actor).includes(
                "edit-invoice",
              );
            const editable =
              actor.role === "service"
                ? category === "job"
                  ? serviceJobEditable
                  : category === "invoice"
                    ? serviceInvoiceEditable
                    : false
                : !(
                    actor.role === "accounts" ||
                    (category === "job" && actor.role === "reception") ||
                    category === "invoice"
                  );
            return (
              <tr
                key={view.job.id}
                className={`clickable-row ${category === "job" ? jobDeliveryClass(view.job, today) : ""}`}
                onClick={() => onOpenRecord(view, category, "view")}
              >
                {category === "job" && (
                  <>
                    <td>{view.job.job_no}</td>
                    <td>
                      {view.vehicle.number} · {view.vehicle.make}{" "}
                      {view.vehicle.model}
                    </td>
                    <td>{view.customer.name}</td>
                    <td>{view.job.estimated_delivery || "—"}</td>
                    <td>
                      <Status
                        status={view.job.main_status}
                        sub={view.job.sub_status}
                      />
                    </td>
                    <td>{money(jobTotal(view))}</td>
                  </>
                )}
                {category === "invoice" && (
                  <>
                    <td>{view.invoice?.invoice_no || "Not generated"}</td>
                    <td>{view.job.job_no}</td>
                    <td>{view.customer.name}</td>
                    <td>{money(view.invoice?.total ?? jobTotal(view))}</td>
                    <td>{view.invoice?.status ?? "Not generated"}</td>
                  </>
                )}
                <td>
                  <RecordActions
                    inGrid
                    onView={() => onOpenRecord(view, category, "view")}
                    onEdit={
                      editable
                        ? () => onOpenRecord(view, category, "edit")
                        : undefined
                    }
                    editLabel={
                      category === "invoice" ? "Edit Invoice" : undefined
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
~~~

## CMP-App-PaymentSearchResultsTable

src/App.tsx:2371-2423

~~~tsx
function PaymentSearchResultsTable({
  rows,
  onOpenRecord,
}: {
  rows: PaymentSearchRow[];
  onOpenRecord: (view: JobView) => void;
}) {
  const headers = [
    "Paid at",
    "Job",
    "Invoice",
    "Customer",
    "Amount",
    "Mode",
    "Status",
    "Actions",
  ];
  return (
    <div className="table-wrap">
      <table aria-label="Payments search results">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ view, payment }) => (
            <tr
              key={payment.id}
              className={`clickable-row ${paymentRowHighlight(payment.mode)}`}
              onClick={() => onOpenRecord(view)}
            >
              <td>
                {payment.created_at ? formatTimestamp(payment.created_at) : "—"}
              </td>
              <td>{view.job.job_no}</td>
              <td>{view.invoice?.invoice_no ?? "Not generated"}</td>
              <td>{view.customer.name}</td>
              <td>{money(payment.amount)}</td>
              <td>{payment.mode}</td>
              <td>Paid</td>
              <td>
                <RecordActions inGrid onView={() => onOpenRecord(view)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
~~~

## CMP-App-StockSearchResultsTable

src/App.tsx:2425-2504

~~~tsx
function StockSearchResultsTable({
  rows,
  onOpenRecord,
}: {
  rows: InventoryItem[];
  onOpenRecord: (item: InventoryItem) => void;
}) {
  const headers = [
    "SKU",
    "Item",
    "Category",
    "Quantity",
    "Unit",
    "Minimum quantity",
    "Stock status",
    "Actions",
  ];
  return (
    <div className="table-wrap">
      <table aria-label="Stock search results">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const stockStatus =
              item.stock_qty === 0
                ? "out-of-stock"
                : item.stock_qty <= item.low_stock_qty
                  ? "low-stock"
                  : "in-stock";
            const statusLabel =
              stockStatus === "out-of-stock"
                ? "Out of stock"
                : stockStatus === "low-stock"
                  ? "Low stock"
                  : "In stock";
            return (
              <tr
                key={item.id}
                className="clickable-row"
                onClick={() => onOpenRecord(item)}
              >
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.stock_qty}</td>
                <td>{item.unit}</td>
                <td>{item.low_stock_qty}</td>
                <td>
                  <span
                    className={`status stock-status stock-status-${stockStatus}`}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenRecord(item);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
~~~

## CMP-App-Kpis

src/App.tsx:2506-2550

~~~tsx
function Kpis({
  jobs,
  inventory,
}: {
  jobs: JobView[];
  inventory: WorkshopState["inventory"];
}) {
  const revenue = jobs.reduce(
    (sum, item) => sum + (item.invoice?.total ?? 0),
    0,
  );
  const paid = jobs
    .flatMap((item) => item.payments)
    .reduce((sum, payment) => sum + payment.amount, 0);
  return (
    <section className="kpi-strip">
      <Kpi
        icon={<Car />}
        label="Cars Inside"
        value={jobs.filter((item) => item.job.main_status !== "CLOSED").length}
      />
      <Kpi
        icon={<ClipboardList />}
        label="New"
        value={jobs.filter((item) => item.job.main_status === "NEW").length}
      />
      <Kpi
        icon={<Wrench />}
        label="In Progress"
        value={
          jobs.filter((item) => item.job.main_status === "IN_PROGRESS").length
        }
      />
      <Kpi icon={<ReceiptText />} label="Revenue" value={money(revenue)} />
      <Kpi icon={<Banknote />} label="Collected" value={money(paid)} />
      <Kpi
        icon={<Boxes />}
        label="Low Stock"
        value={
          inventory.filter((item) => item.stock_qty < item.low_stock_qty).length
        }
      />
    </section>
  );
}
~~~

## CMP-App-Kpi

src/App.tsx:2552-2568

~~~tsx
function Kpi({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="kpi">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
~~~

## CMP-App-Reception

src/App.tsx:2570-2715

~~~tsx
function Reception({
  activeMenuItem,
  state,
  mutate,
  user,
  selected,
  setSelectedJobId,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  mutate: Mutate;
  user: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
}) {
  const today = todayKey();
  const [creating, setCreating] = useState(false);
  const [createdJobNo, setCreatedJobNo] = useState("");
  const openQueue = state.jobs
    .filter(
      (item) =>
        item.job.main_status !== "CLOSED" &&
        item.job.main_status !== "CANCELLED",
    )
    .sort((left, right) => {
      const leftIsCarryForward = left.visit.received_at.slice(0, 10) !== today;
      const rightIsCarryForward =
        right.visit.received_at.slice(0, 10) !== today;
      if (leftIsCarryForward !== rightIsCarryForward)
        return leftIsCarryForward ? -1 : 1;
      return left.visit.received_at.localeCompare(right.visit.received_at);
    });
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<number>();
  if (activeMenuItem === "Advance Bookings") {
    return (
      <BookingOperations
        state={state}
        actor={user}
        mutate={mutate}
        onCheckedIn={(jobId) => setSelectedJobId(jobId)}
      />
    );
  }
  return (
    <>
    <section className="workspace two-panel reception-queue">
      <div className="desk-panel">
        <div className="queue-heading">
          <PanelTitle
            icon={<Car />}
            title="Reception Queue"
            subtitle={`${today} · all open reception visits`}
          />
          <button className="primary-action" onClick={() => setCreating(true)}>
            <Plus size={18} />
            Create New Visit
          </button>
        </div>
        <div className="queue-summary">
          <span>
            <strong>{openQueue.length}</strong> open visits
          </span>
          <span>
            <strong>
              {openQueue.filter((item) => !item.job.advisor_id).length}
            </strong>{" "}
            unassigned
          </span>
        </div>
        {createdJobNo && (
          <p className="permission-note" role="status">
            Visit created: {createdJobNo} is now selected.
          </p>
        )}
        <AdvisorAttendancePanel
          state={state}
          jobs={openQueue}
          today={today}
          selectedAdvisorId={selectedAdvisorId}
          onSelectAdvisor={setSelectedAdvisorId}
          mutate={mutate}
        />
        <ReceptionQueueRows
          jobs={openQueue}
          users={state.users}
          today={today}
          selectedAdvisorId={selectedAdvisorId}
          selectedJobId={selected?.job.id}
          onSelect={setSelectedJobId}
        />
      </div>
      <div className="desk-panel">
        <PanelTitle
          icon={<FileText />}
          title="Job Detail"
          subtitle={selected?.job.job_no ?? "Select a job"}
        />
        {selected ? (
          <>
            <JobSnapshot view={selected} />
            <VisitEditor
              key={`${selected.job.id}-${selected.job.advisor_id}`}
              view={selected}
              advisors={state.users.filter((item) => item.role === "service")}
              attendance={state.attendance}
              today={today}
              mutate={mutate}
            />
            <div className="reception-archive-zone">
              <button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    cancelJobCard(
                      db,
                      selected.job.id,
                      "Cancelled at reception",
                    ),
                  )
                }
              >
                Archive Visit/Job
              </button>
            </div>
          </>
        ) : (
          <p className="empty-state">Select a visit to review or assign it.</p>
        )}
      </div>
      {creating && (
        <CreateVisitDialog
          state={state}
          mutate={mutate}
          actor={user}
          onClose={() => setCreating(false)}
          onCreated={(jobId, jobNo) => {
            setSelectedJobId(jobId);
            setCreatedJobNo(jobNo);
            setCreating(false);
          }}
        />
      )}
    </section>
    </>
  );
}
~~~

## CMP-App-BookingOperations

src/App.tsx:2718-2746

~~~tsx
function BookingOperations({
  state,
  actor,
  mutate,
  onCheckedIn,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  onCheckedIn: (jobId: number, jobNo: string) => void;
}) {
  const today = todayKey();
  return (
    <>
      <BookingCalendar state={state} actor={actor} mutate={mutate} />
      <section className="workspace">
        <div className="desk-panel">
          <ExpectedTodayBookings
            state={state}
            actor={actor}
            mutate={mutate}
            operationalDate={today}
            onCheckedIn={onCheckedIn}
          />
        </div>
      </section>
    </>
  );
}
~~~

## CMP-App-AdvisorAttendancePanel

src/App.tsx:2748-2881

~~~tsx
function AdvisorAttendancePanel({
  state,
  jobs,
  today,
  selectedAdvisorId,
  onSelectAdvisor,
  mutate,
}: {
  state: WorkshopState;
  jobs: JobView[];
  today: string;
  selectedAdvisorId?: number;
  onSelectAdvisor: (advisorId?: number) => void;
  mutate: Mutate;
}) {
  const advisors = state.users.filter((item) => item.role === "service");
  const present = new Set(
    presentAdvisors(advisors, state.attendance, today).map((item) => item.id),
  );
  const [page, setPage] = useState(0);
  const advisorsPerPage = 6;
  const pageCount = Math.max(1, Math.ceil(advisors.length / advisorsPerPage));
  const visibleAdvisors = advisors.slice(
    page * advisorsPerPage,
    page * advisorsPerPage + advisorsPerPage,
  );
  useEffect(() => {
    if (page >= pageCount) setPage(pageCount - 1);
  }, [page, pageCount]);
  const availabilityCount = advisors.filter((advisor) =>
    present.has(advisor.id),
  ).length;
  return (
    <section
      className="advisor-attendance"
      aria-label="Service advisor availability"
    >
      <div className="advisor-roster-heading">
        <div>
          <strong>Advisor availability</strong>
          <span>
            {availabilityCount} of {advisors.length} advisors available today
          </span>
        </div>
        <div className="advisor-roster-actions">
          <button
            type="button"
            className={
              selectedAdvisorId === undefined
                ? "advisor-reset active"
                : "advisor-reset"
            }
            onClick={() => onSelectAdvisor(undefined)}
          >
            All advisors
          </button>
          {pageCount > 1 && (
            <div className="advisor-page-controls" aria-label="Advisor pages">
              <button
                type="button"
                aria-label="Previous advisors"
                title="Previous advisors"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
              >
                <ChevronLeft aria-hidden="true" size={16} />
              </button>
              <span>
                {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                aria-label="Next advisors"
                title="Next advisors"
                disabled={page === pageCount - 1}
                onClick={() => setPage((current) => current + 1)}
              >
                <ChevronRight aria-hidden="true" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="advisor-roster">
        {visibleAdvisors.map((advisor) => {
          const isPresent = present.has(advisor.id);
          const activeJobs = jobs.filter(
            (job) => job.job.advisor_id === advisor.id,
          ).length;
          return (
            <article
              key={advisor.id}
              className={`advisor-card ${isPresent ? "present" : "away"} ${selectedAdvisorId === advisor.id ? "selected" : ""}`}
            >
              <button
                type="button"
                className="advisor-card-select"
                aria-pressed={selectedAdvisorId === advisor.id}
                onClick={() =>
                  onSelectAdvisor(
                    selectedAdvisorId === advisor.id ? undefined : advisor.id,
                  )
                }
              >
                <strong>{advisor.name}</strong>
                <span>
                  {isPresent ? "Present" : "Away"} · {activeJobs} open
                </span>
              </button>
              <button
                type="button"
                className={
                  isPresent
                    ? "advisor-availability-toggle present"
                    : "advisor-availability-toggle away"
                }
                aria-label={`Mark ${advisor.name} ${isPresent ? "away" : "present"}`}
                aria-pressed={isPresent}
                onClick={() =>
                  mutate((db) =>
                    setAdvisorPresent(db, advisor.id, !isPresent, today),
                  )
                }
              >
                <span aria-hidden="true" />
                {isPresent ? "Present" : "Away"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
~~~

## CMP-App-ReceptionQueueRows

src/App.tsx:2883-3042

~~~tsx
function ReceptionQueueRows({
  jobs,
  users,
  today,
  selectedAdvisorId,
  selectedJobId,
  onSelect,
}: {
  jobs: JobView[];
  users: User[];
  today: string;
  selectedAdvisorId?: number;
  selectedJobId?: number;
  onSelect: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "NEW" | "IN_PROGRESS" | "COMPLETED" | "UNASSIGNED"
  >("ALL");
  const needle = normalizeSearch(search);
  const filtered = jobs.filter((row) => {
    const advisor = users.find((user) => user.id === row.job.advisor_id);
    const matchesSearch =
      !needle ||
      normalizeSearch(
        `${row.job.job_no} ${row.vehicle.number} ${row.customer.name} ${row.customer.mobile} ${advisor?.name ?? "Unassigned"} ${row.visit.requested_work}`,
      ).includes(needle);
    const matchesStatus =
      status === "ALL" ||
      (status === "UNASSIGNED"
        ? !row.job.advisor_id
        : row.job.main_status === status);
    return (
      matchesSearch &&
      matchesStatus &&
      (selectedAdvisorId === undefined ||
        row.job.advisor_id === selectedAdvisorId)
    );
  });
  const reset = () => {
    setSearch("");
    setStatus("ALL");
  };
  return (
    <div className="embedded-list reception-queue-list">
      <div className="queue-filter-bar">
        <label className="list-search">
          Search
          <input
            aria-label="Search reception queue"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Job, vehicle, customer or requested work"
          />
        </label>
        <label className="queue-status-select">
          Status
          <select
            aria-label="Reception queue status"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            <option value="ALL">All open</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="UNASSIGNED">Unassigned</option>
          </select>
        </label>
        <button
          type="button"
          className="secondary-action"
          onClick={reset}
          disabled={!search && status === "ALL"}
        >
          Clear
        </button>
      </div>
      <div className="reception-list-summary" role="status">
        {filtered.length} of {jobs.length} open jobs
        {selectedAdvisorId !== undefined ? " for selected advisor" : ""}
      </div>
      {filtered.length ? (
        <div className="reception-visit-rows" aria-label="Reception queue jobs">
          {filtered.map((row) => {
            const advisor = users.find(
              (user) => user.id === row.job.advisor_id,
            );
            const receivedDate = row.visit.received_at.slice(0, 10);
            const isCarryForward = receivedDate !== today;
            const statusClass = `job-status-${row.job.main_status.toLowerCase()}`;
            return (
              <button
                type="button"
                key={row.job.id}
                className={`reception-visit-row ${statusClass}${selectedJobId === row.job.id ? " active" : ""}`}
                onClick={() => onSelect(row.job.id)}
              >
                <div className="reception-job-identity">
                  <strong>{row.job.job_no}</strong>
                  <span>
                    {row.vehicle.number} · {row.customer.name}
                  </span>
                </div>
                <div className="reception-job-meta">
                  <span
                    className={
                      advisor ? "advisor-name" : "advisor-name unassigned"
                    }
                  >
                    {advisor?.name ?? "Unassigned"}
                  </span>
                  <Status
                    status={row.job.main_status}
                    sub={row.job.sub_status}
                  />
                </div>
                <div className="reception-job-received">
                  <strong
                    className={
                      isCarryForward ? "carry-forward" : "today-marker"
                    }
                  >
                    {isCarryForward ? "Carry-forward" : "Today"}
                  </strong>
                  <span>
                    {isCarryForward
                      ? receptionAgeLabel(receivedDate, today)
                      : "Received today"}{" "}
                    · {receivedDate}
                  </span>
                </div>
                <p title={row.visit.requested_work}>
                  {row.visit.requested_work}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="list-empty">
          <h3>No matching open jobs</h3>
          <button type="button" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
  /* Previous paginated queue implementation, disabled by the contained-scroll redesign. */
  /*
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("ALL"); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const statuses = ["ALL", "NEW", "IN_PROGRESS", "COMPLETED"];
  const filtered = jobs.filter((row) => (!normalizeSearch(search) || normalizeSearch(`${row.job.job_no} ${row.vehicle.number} ${row.customer.name} ${row.customer.mobile}`).includes(normalizeSearch(search))) && (status === "ALL" || row.job.main_status === status));
  const paged = paginate(filtered, page, pageSize); useEffect(() => { if (paged.page !== page) setPage(paged.page); }, [page, paged.page]);
  const reset = () => { setSearch(""); setStatus("ALL"); setPage(1); };
  const columns: ExportColumn<JobView>[] = [{ header: "Job", value: (row) => row.job.job_no }, { header: "Registration", value: (row) => row.vehicle.number }, { header: "Customer", value: (row) => row.customer.name }, { header: "Mobile", value: (row) => row.customer.mobile }, { header: "Advisor", value: (row) => users.find((user) => user.id === row.job.advisor_id)?.name ?? "Unassigned" }, { header: "Status", value: (row) => row.job.main_status }, { header: "Requested work", value: (row) => row.visit.requested_work }];
  return <div className="embedded-list reception-queue-list"><div className="queue-filter-bar"><label className="list-search">Search<input aria-label="Search today's queue" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, registration, customer or mobile" /></label><div className="queue-statuses" aria-label="Today Queue status filters">{statuses.map((value) => <button key={value} type="button" className={status === value ? "active" : ""} onClick={() => { setStatus(value); setPage(1); }}>{value === "ALL" ? "All" : value.replaceAll("_", " ")} <span>{value === "ALL" ? jobs.length : jobs.filter((row) => row.job.main_status === value).length}</span></button>)}</div><ListSearchActions onClear={reset} /></div><div className="list-result-controls"><ListExportControls report={{ title: "Today Queue", filters: activeFilterSummary({ Search: search.trim(), Status: status }), columns, rows: filtered }} /><span className="result-summary">Showing {paged.from} to {paged.to} of {paged.totalCount}</span><PageSizeSelect ariaLabel="Today Queue records per page" value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); }} /></div><ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />{paged.totalCount ? <div className="reception-visit-rows">{paged.items.map((row) => { const advisor = users.find((user) => user.id === row.job.advisor_id); return <button type="button" key={row.job.id} className={selectedJobId === row.job.id ? "reception-visit-row active" : "reception-visit-row"} onClick={() => onSelect(row.job.id)}><div><strong>{row.job.job_no}</strong><span>{row.customer.name} · {row.customer.mobile}</span></div><div><strong>{row.vehicle.number}</strong><span>{row.vehicle.make} {row.vehicle.model}</span></div><div><span className={advisor ? "advisor-name" : "advisor-name unassigned"}>{advisor?.name ?? "Unassigned"}</span><Status status={row.job.main_status} sub={row.job.sub_status} unmapped={!advisor} /></div><p>{row.visit.requested_work}</p></button>; })}</div> : <div className="list-empty"><h3>No matching visits</h3><button type="button" onClick={reset}>Clear filters</button></div>}<ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /></div>;
  */
}
~~~

## CMP-App-CreateVisitDialog

src/App.tsx:3056-3565

~~~tsx
function CreateVisitDialog({
  state,
  mutate,
  actor,
  onClose,
  onCreated,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  onClose: () => void;
  onCreated: (jobId: number, jobNo: string) => void;
}) {
  const today = todayKey();
  const [tab, setTab] = useState<"details" | "body-mark">("details");
  const [marks, setMarks] = useState<DamageMark[]>([]);
  const [error, setError] = useState("");
  const [quickAdd, setQuickAdd] = useState<"customer" | "vehicle">();
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    type: "Individual",
  });
  const [form, setForm] = useState({
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
    fuelLevelValue: "",
    fuelLevelUnit: "bars" as "bars" | "%" | "litres" | "Other",
    keys: "",
    accessories: "",
    requestedWork: "",
    advisorId: 0,
  });
  const clearCustomer = () =>
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
    }));
  const clearVehicle = () =>
    setForm((current) => ({
      ...current,
      vehicleId: 0,
      vehicleNo: "",
      make: "",
      model: "",
      color: "",
      odoReading: "",
    }));
  const selectCustomer = (id: number) => {
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
  };
  const selectVehicle = (id: number) => {
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
  };
  const submit = (event: FormEvent) => {
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
  };
  const present = presentAdvisors(state.users, state.attendance, today);
  const advisors = [
    ...present,
    ...state.users.filter(
      (user) =>
        user.role === "service" && !present.some((item) => item.id === user.id),
    ),
  ];
  const customerOptions = [
    { value: 0, label: "Clear customer and vehicle" },
    ...state.customers.map((customer) => ({
      value: customer.id,
      label: `${customer.name} · ${customer.mobile}`,
    })),
  ];
  const vehicleOptions = [
    { value: 0, label: "Clear vehicle" },
    ...state.vehicles.map((vehicle) => {
      const customer = state.customers.find(
        (item) => item.id === vehicle.customer_id,
      );
      return {
        value: vehicle.id,
        label: [
          vehicle.number,
          `${vehicle.make} ${vehicle.model}`,
          customer?.name,
          customer?.mobile,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    }),
  ];
  const tabId = (name: "details" | "body-mark") => `create-visit-${name}-tab`;
  const panelId = (name: "details" | "body-mark") =>
    `create-visit-${name}-panel`;

  return (
    <Dialog
      wide
      title="Create New Visit"
      subtitle="Link an existing customer and vehicle, or enter new details"
      onClose={onClose}
      footer={
        <button className="primary-action" form="create-visit-form">
          Create Visit
        </button>
      }
    >
      <form id="create-visit-form" onSubmit={submit}>
        <div
          className="sub-tabs create-visit-tabs"
          role="tablist"
          aria-label="Create visit sections"
          onKeyDown={handleTabListKeyDown}
        >
          {(["details", "body-mark"] as const).map((item) => (
            <button
              type="button"
              id={tabId(item)}
              aria-controls={panelId(item)}
              tabIndex={tab === item ? 0 : -1}
              key={item}
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item === "details" ? "Details" : "Body Mark"}
            </button>
          ))}
        </div>
        {tab === "details" ? (
          <div
            id={panelId("details")}
            role="tabpanel"
            aria-labelledby={tabId("details")}
            className="create-visit-tab-panel"
          >
            <div className="form-grid">
              <div className="field-with-action">
                <SearchSelect
                  label="Existing customer"
                  options={customerOptions}
                  value={form.customerId}
                  onChange={(value) => selectCustomer(Number(value))}
                  placeholder="Search customer or mobile"
                />
                <button
                  type="button"
                  className="link-action"
                  onClick={() => setQuickAdd("customer")}
                >
                  Add New Customer
                </button>
              </div>
              <div className="field-with-action">
                <SearchSelect
                  label="Existing vehicle"
                  options={vehicleOptions}
                  value={form.vehicleId}
                  onChange={(value) => selectVehicle(Number(value))}
                  placeholder="Search customer, phone, registration or model"
                />
                <button
                  type="button"
                  className="link-action"
                  disabled={!form.customerId}
                  onClick={() => setQuickAdd("vehicle")}
                >
                  Add New Vehicle
                </button>
              </div>
              <label>
                Customer Name
                <input
                  required
                  value={form.customerName}
                  onChange={(event) =>
                    setForm({ ...form, customerName: event.target.value })
                  }
                />
              </label>
              <label>
                Mobile
                <input
                  required
                  value={form.mobile}
                  onChange={(event) =>
                    setForm({ ...form, mobile: event.target.value })
                  }
                />
              </label>
              <label>
                Vehicle Number
                <input
                  required
                  value={form.vehicleNo}
                  onChange={(event) =>
                    setForm({ ...form, vehicleNo: event.target.value })
                  }
                />
              </label>
              <label>
                Make
                <input
                  required
                  value={form.make}
                  onChange={(event) =>
                    setForm({ ...form, make: event.target.value })
                  }
                />
              </label>
              <label>
                Model
                <input
                  required
                  value={form.model}
                  onChange={(event) =>
                    setForm({ ...form, model: event.target.value })
                  }
                />
              </label>
              <label>
                Color
                <input
                  value={form.color}
                  onChange={(event) =>
                    setForm({ ...form, color: event.target.value })
                  }
                />
              </label>
              <label>
                ODO meter reading (km)
                <input
                  required
                  type="number"
                  min="0"
                  value={form.odoReading}
                  onChange={(event) =>
                    setForm({ ...form, odoReading: event.target.value })
                  }
                />
              </label>
              <label>
                Fuel / battery level
                <div className="field-pair">
                  <input
                    required
                    value={form.fuelLevelValue}
                    onChange={(event) =>
                      setForm({ ...form, fuelLevelValue: event.target.value })
                    }
                  />
                  <select
                    value={form.fuelLevelUnit}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        fuelLevelUnit: event.target
                          .value as typeof form.fuelLevelUnit,
                      })
                    }
                  >
                    <option value="bars">bars</option>
                    <option value="%">%</option>
                    <option value="litres">litres</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </label>
              <label>
                Keys
                <input
                  value={form.keys}
                  onChange={(event) =>
                    setForm({ ...form, keys: event.target.value })
                  }
                />
              </label>
              <label>
                Accessories
                <input
                  value={form.accessories}
                  onChange={(event) =>
                    setForm({ ...form, accessories: event.target.value })
                  }
                />
              </label>
              <label>
                Advisor
                <select
                  value={form.advisorId}
                  onChange={(event) =>
                    setForm({ ...form, advisorId: Number(event.target.value) })
                  }
                >
                  <option value={0}>Assign later</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.name}
                      {present.some((item) => item.id === advisor.id)
                        ? " (Present)"
                        : " (Away)"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Requested Work
              <textarea
                required
                rows={3}
                value={form.requestedWork}
                onChange={(event) =>
                  setForm({ ...form, requestedWork: event.target.value })
                }
              />
            </label>
          </div>
        ) : (
          <div
            id={panelId("body-mark")}
            role="tabpanel"
            aria-labelledby={tabId("body-mark")}
            className="create-visit-tab-panel create-visit-body-mark-panel"
          >
            <div className="damage-capture">
              <strong>Body mark</strong>
              <BodyMarkDiagram
                marks={marks}
                onChange={setMarks}
                hideDownload
                meta={{
                  vehicleName: `${form.make} ${form.model}`,
                  color: form.color,
                  regNo: form.vehicleNo,
                }}
              />
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </form>
      {quickAdd === "customer" && (
        <Dialog title="Add New Customer" onClose={() => setQuickAdd(undefined)}>
          <CustomerEditor
            embedded
            value={newCustomer}
            setValue={setNewCustomer}
            mutate={mutate}
            onSaved={() => {
              setQuickAdd(undefined);
              setNewCustomer({
                id: 0,
                name: "",
                mobile: "",
                type: "Individual",
              });
            }}
          />
        </Dialog>
      )}
      {quickAdd === "vehicle" && form.customerId > 0 && (
        <Dialog title="Add New Vehicle" onClose={() => setQuickAdd(undefined)}>
          <VehicleMasterPanel
            key={form.customerId}
            embedded
            state={state}
            value={{
              id: 0,
              customer_id: form.customerId,
              number: "",
              make: "",
              model: "",
              color: "",
              km: 0,
            }}
            setValue={() => undefined}
            mutate={mutate}
            onSaved={() => setQuickAdd(undefined)}
          />
        </Dialog>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-ServiceAdvisor

src/App.tsx:3567-3637

~~~tsx
function ServiceAdvisor({
  activeMenuItem,
  state,
  view,
  mutate,
  setSelectedJobId,
  user,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  view?: JobView;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  user: User;
}) {
  const assignedActiveJobs = state.jobs.filter(
    (item) =>
      item.job.advisor_id === user.id && isServiceActiveJob(item),
  );
  const assignedJobs = state.jobs.filter((item) => item.job.advisor_id === user.id);
  if (activeMenuItem === "My Queue") {
    return (
      <section className="workspace">
        <div className="desk-panel my-queue-panel">
          <PanelTitle
            icon={<ClipboardList />}
            title="My Queue"
            subtitle="Open advisor jobs"
          />
          <FilterableJobRows
            title="My Queue"
            jobs={assignedActiveJobs}
            showStatusFilter
            queueActions={{ state, mutate, actor: user }}
          />
        </div>
      </section>
    );
  }
  if (
    (activeMenuItem === "Job Card" || activeMenuItem === "Job Cards") ||
    activeMenuItem === "Estimate" ||
    activeMenuItem === "Follow-ups"
  )
    return (
      <ServiceAdvisorList
        key={activeMenuItem}
        kind={
          activeMenuItem === "Job Card" || activeMenuItem === "Job Cards"
            ? "job-cards"
            : activeMenuItem === "Estimate"
              ? "estimates"
              : "followups"
        }
        jobs={activeMenuItem === "Follow-ups" ? assignedJobs : assignedActiveJobs}
        state={state}
        mutate={mutate}
        actor={user}
      />
    );
  if (!view) return null;
  if (activeMenuItem === "Photos") {
    return (
      <section className="workspace two-panel">
        <JobMediaPanel view={view} actor={user} mutate={mutate} />
        <Timeline view={view} />
      </section>
    );
  }
  return null;
}
~~~

## CMP-App-ServiceAdvisorList

src/App.tsx:3641-4110

~~~tsx
function ServiceAdvisorList({
  kind,
  jobs,
  state,
  mutate,
  actor,
  filterLayout = "default",
}: {
  kind: ServiceListKind;
  jobs: JobView[];
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  filterLayout?: "default" | "search";
}) {
  const today = useLocalDeliveryDate();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(() =>
    kind === "estimates" ? localCalendarDate() : "",
  );
  const [month, setMonth] = useState(() =>
    kind === "job-cards" ? localCalendarDate().slice(0, 7) : "",
  );
  const [mainStatus, setMainStatus] = useState("ALL");
  const [workflow, setWorkflow] = useState("ALL");
  const [customer, setCustomer] = useState("");
  const [advisor, setAdvisor] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // Job Cards for service advisors are intentionally table-only.
  const isGridView = false;
  const [selected, setSelected] = useState<JobView>();
  const [dialog, setDialog] = useState<
    "job" | "edit" | "estimate" | "followup" | "followup-view"
  >();
  const needle = normalizeSearch(useDeferredValue(search));
  const listedJobs = useMemo(
    () => (kind === "followups" || kind === "job-cards" ? jobs : jobs.filter(isServiceActiveJob)),
    [jobs, kind],
  );
  const months = useMemo(
    () =>
      [
        ...new Set(
          listedJobs
            .map((item) =>
              kind === "job-cards"
                ? item.job.estimated_delivery?.slice(0, 7) ?? ""
                : item.visit.received_at.slice(0, 7),
            )
            .filter((value) => /^\d{4}-\d{2}$/.test(value)),
        ),
      ]
        .sort()
        .reverse(),
    [listedJobs],
  );
  const filtered = useMemo(
    () =>
      listedJobs.filter((item) => {
        const filteredDate =
          kind === "job-cards"
            ? item.job.estimated_delivery ?? ""
            : item.visit.received_at.slice(0, 10);
        return (
          (!needle ||
            normalizeSearch(
              `${item.job.job_no} ${item.vehicle.number} ${item.vehicle.make} ${item.vehicle.model} ${item.customer.name} ${item.customer.mobile}`,
            ).includes(needle)) &&
          (!date || filteredDate === date) && // Exact date intentionally takes precedence over month/year.
          (kind !== "job-cards" || !month || item.job.estimated_delivery?.slice(0, 7) === month) &&
          (kind !== "job-cards" || mainStatus === "ALL" || item.job.main_status === mainStatus) &&
          (kind !== "job-cards" || workflow === "ALL" || item.job.sub_status === workflow) &&
          (kind !== "job-cards" || !customer || normalizeSearch(`${item.customer.name} ${item.customer.mobile}`).includes(normalizeSearch(customer))) &&
          (kind !== "job-cards" || advisor === "ALL" || String(item.advisor.id) === advisor)
        );
      }).sort((a, b) => {
        if (kind !== "job-cards" || sort === "newest") return b.job.id - a.job.id;
        if (sort === "oldest") return a.job.id - b.job.id;
        if (sort === "amount-high") return jobTotal(b) - jobTotal(a);
        if (sort === "amount-low") return jobTotal(a) - jobTotal(b);
        if (sort === "delivery-soonest") return (a.job.estimated_delivery || "9999-12-31").localeCompare(b.job.estimated_delivery || "9999-12-31");
        return (b.job.estimated_delivery || "").localeCompare(a.job.estimated_delivery || "");
      }),
    [listedJobs, needle, date, month, kind, mainStatus, workflow, customer, advisor, sort],
  );
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);
  const title =
    kind === "job-cards"
      ? "Job Cards"
      : kind === "estimates"
        ? "Estimates"
        : "Follow-ups";
  const clear = () => {
    setSearch("");
    setDate("");
    setMonth("");
    setMainStatus("ALL"); setWorkflow("ALL"); setCustomer(""); setAdvisor("ALL"); setSort("newest");
    setPage(1);
  };
  const open = (
    row: JobView,
    next: "job" | "edit" | "estimate" | "followup",
  ) => {
    setSelected(row);
    setDialog(next);
  };
  const columns: ExportColumn<JobView>[] = [
    { header: "Job card", value: (row) => row.job.job_no },
    { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name },
    ...(kind === "job-cards"
      ? [{ header: "Estimated Delivery Date", value: (row: JobView) => row.job.estimated_delivery || "—" }]
      : []),
    { header: "Job status", value: (row) => row.job.main_status },
    {
      header: "Estimate status",
      value: (row) => row.estimate?.status ?? "Not created",
    },
    ...(kind === "job-cards"
      ? [{ header: "Service Advisor", value: (row: JobView) => row.advisor.name }]
      : [{ header: "Follow-up status", value: serviceFollowupStatus }]),
  ];
  const followupTone = (status: string) =>
    status.startsWith("Done(") ? "done" : "pending";
  const monthYearLabel = (value: string) => {
    const dateValue = new Date(`${value}-01T00:00:00`);
    return Number.isNaN(dateValue.valueOf())
      ? value
      : dateValue.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });
  };
  return (
    <section className="entity-list-page service-advisor-list">
      {selected && dialog === "job" && (
        <JobRecordDialog
          view={selected}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="view"
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "edit" && (
        <JobRecordDialog
          view={selected}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="edit"
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "estimate" && (
        <ServiceEstimateDialog
          view={selected}
          actor={actor}
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "followup" && (
        <ServiceFollowupDialog
          view={selected}
          mode="add"
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
      {selected && dialog === "followup-view" && (
        <ServiceFollowupDialog
          view={selected}
          mode="view"
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
      )}
      <div className="list-page-heading">
        <div>
          <h2>{title}</h2>
          <p>
            {actor.role === "admin"
              ? "All workshop jobs"
              : "Jobs assigned to you"}
          </p>
        </div>
      </div>
      <div className={`list-filter-bar${filterLayout === "search" ? " search-filter-layout" : ""}`}>
        {kind === "job-cards" ? (
          <JobCardFilterFields
            jobs={listedJobs}
            values={{ search, primary: mainStatus, secondary: workflow, date, month, customer, advisor, sort, archivedOnly: false }}
            onChange={(patch) => {
              if (patch.search !== undefined) setSearch(patch.search);
              if (patch.primary !== undefined) setMainStatus(patch.primary);
              if (patch.secondary !== undefined) setWorkflow(patch.secondary);
              if (patch.date !== undefined) { setDate(patch.date); if (patch.date) setMonth(""); }
              if (patch.month !== undefined) { setMonth(patch.month); if (patch.month) setDate(""); }
              if (patch.customer !== undefined) setCustomer(patch.customer);
              if (patch.advisor !== undefined) setAdvisor(patch.advisor);
              if (patch.sort !== undefined) setSort(patch.sort);
              setPage(1);
            }}
            onClear={clear}
            searchLabel={`Search ${title.toLowerCase()}`}
            variant="service"
          />
        ) : <>
        <label className="list-search">
          Search
          <input
            aria-label={`Search ${title.toLowerCase()}`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job, vehicle or customer"
          />
        </label>
        <div className={`list-filter-fields open${filterLayout === "search" ? " search-filter-row" : ""}`}>
          <label>
            Received date
            <input
              aria-label={`${title} received date`}
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setMonth("");
                setPage(1);
              }}
            />
          </label>
          <label>
            Month-Year
            <select
              aria-label={`${title} month-year`}
              value={month}
              onChange={(event) => {
                setMonth(event.target.value);
                setDate("");
                setPage(1);
              }}
            >
              <option value="">All months</option>
              {months.map((value) => (
                <option key={value} value={value}>
                  {monthYearLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <ListSearchActions onClear={clear} />
        </div>
        </>}
      </div>
      <PaginationToolbar
        controls={
          <><ListExportControls report={{
              title,
              filters: activeFilterSummary({
                Search: search.trim(),
                [kind === "job-cards" ? "Estimated Delivery Date" : "Received date"]: date,
                [kind === "job-cards" ? "Estimated Delivery Month-Year" : "Received month"]: month,
                ...(kind === "job-cards" ? { "Main status": mainStatus, Workflow: workflow, Customer: customer, "Service advisor": advisor, Sort: sort } : {}),
              }),
              columns,
              rows: filtered,
            }} />
          </>
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel={`${title} records per page`}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount ? (
        isGridView && kind === "job-cards" ? (
          <div className="record-grid jobs">
            {paged.items.map((row) => (
              <article
                className={`record-card job-card job-status-${row.job.main_status.toLowerCase()} ${jobDeliveryClass(row.job, today)}`}
                key={row.job.id}
              >
                <div className="record-identity">
                  <strong>{row.vehicle.number}</strong>
                  <span>{row.vehicle.make} {row.vehicle.model}</span>
                </div>
                <h3>{row.job.job_no}</h3>
                <p>{row.customer.name} · {row.customer.mobile}</p>
                <Status status={row.job.main_status} sub={row.job.sub_status} />
                <Info label="Estimated Delivery Date" value={row.job.estimated_delivery || "—"} />
                <Info label="Estimate Status" value={row.estimate?.status ?? "Not created"} />
                <Info label="Service Advisor" value={row.advisor.name} />
                <div className="grid-actions">
                  <button type="button" className="grid-action" onClick={() => open(row, "job")}>View</button>
                  {actor.role === "service" && actor.id === row.job.advisor_id && (
                    <button type="button" className="grid-action" onClick={() => open(row, "edit")}>Edit</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job Card</th>
                <th>Vehicle</th>
                <th>Customer</th>
                {kind === "job-cards" && <th>Estimated Delivery Date</th>}
                {kind !== "followups" && <th>Job Status</th>}
                <th>Estimate Status</th>
                <th>{kind === "job-cards" ? "Service Advisor" : "Follow-up Status"}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.items.map((row) => {
                const status = serviceFollowupStatus(row);
                const tone = followupTone(status);
                return (
                  <tr
                    key={row.job.id}
                    className={
                      kind === "followups"
                        ? `service-followup-row service-followup-${tone}`
                        : kind === "job-cards" ? jobDeliveryClass(row.job, today) : undefined
                    }
                  >
                    <td>{row.job.job_no}</td>
                    <td>{row.vehicle.number}</td>
                    <td>{row.customer.name}</td>
                    {kind === "job-cards" && <td>{row.job.estimated_delivery || "—"}</td>}
                    {kind !== "followups" && (
                      <td>
                        <Status
                          status={row.job.main_status}
                          sub={row.job.sub_status}
                        />
                      </td>
                    )}
                    <td>{row.estimate?.status ?? "Not created"}</td>
                    <td>
                      {kind === "job-cards" ? (
                        row.advisor.name
                      ) : kind === "followups" ? (
                        <span
                          className={`service-followup-status service-followup-status-${tone}`}
                          role="status"
                        >
                          {status}
                        </span>
                      ) : (
                        status
                      )}
                    </td>
                    <td>
                      <div className="grid-actions">
                        {kind === "job-cards" && (
                          <>
                            <button
                              type="button"
                              className="grid-action"
                              onClick={() => open(row, "job")}
                            >
                              View
                            </button>
                            {actor.role === "service" &&
                              actor.id === row.job.advisor_id && (
                                <button
                                  type="button"
                                  className="grid-action"
                                  onClick={() => open(row, "edit")}
                                >
                                  Edit
                                </button>
                              )}
                          </>
                        )}
                        {kind === "estimates" && (
                          <>
                            {isServiceActiveJob(row) && (
                              <button
                                type="button"
                                className={`workflow-action ${row.estimate ? "action-secondary" : "action-primary"}`}
                                onClick={() => open(row, "estimate")}
                              >
                                {row.estimate ? (
                                  <>
                                    <Pencil size={15} />
                                    Edit Estimate
                                  </>
                                ) : (
                                  <>
                                    <Plus size={15} />
                                    Create Estimate
                                  </>
                                )}
                              </button>
                            )}
                            {row.estimate && (
                              <DocumentDownloadButton
                                kind="estimate"
                                view={row}
                              />
                            )}
                          </>
                        )}
                        {kind === "followups" && (
                          canAddServiceFollowup(row) ? (
                            <button
                              className="grid-action"
                              onClick={() => open(row, "followup")}
                            >
                              Add Follow-up
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="grid-action"
                              onClick={() => {
                                setSelected(row);
                                setDialog("followup-view");
                              }}
                            >
                              View
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )
      ) : (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton onClick={clear} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </section>
  );
}
~~~

## CMP-App-ServiceEstimateDialog

src/App.tsx:4112-4159

~~~tsx
function ServiceEstimateDialog({
  view,
  actor,
  mutate,
  onClose,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  if (isServiceActiveJob(view))
    return (
      <EstimateDialog
        view={view}
        actor={actor}
        mutate={mutate}
        onClose={onClose}
      />
    );
  return (
    <Dialog
      title="View Estimate"
      subtitle={`${view.job.job_no} · ${view.estimate?.status ?? "Not created"}`}
      onClose={onClose}
    >
      {view.estimate ? (
        <div className="record-view">
          {view.estimate_items.map((item) => (
            <Info
              key={item.id}
              label={item.description}
              value={money(item.qty * item.rate)}
            />
          ))}
          <Info
            label="Total"
            value={money(invoiceItemsTotal(view.estimate_items, view.estimate))}
          />
        </div>
      ) : (
        <p className="empty-state">
          No estimate has been created for this job.
        </p>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-ServiceFollowupDialog

src/App.tsx:4161-4551

~~~tsx
function ServiceFollowupDialog({
  view,
  mode,
  mutate,
  onClose,
}: {
  view: JobView;
  mode: "add" | "view";
  mutate: Mutate;
  onClose: () => void;
}) {
  const editable = mode === "add" && canAddServiceFollowup(view);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [completions, setCompletions] = useState<
    Record<number, { selected: boolean; outcome: string }>
  >({});
  const [history, setHistory] = useState(() =>
    [...view.followups].sort((left, right) =>
      (right.created_at || right.updated_at || right.due_at).localeCompare(
        left.created_at || left.updated_at || left.due_at,
      ),
    ),
  );
  const [editingId, setEditingId] = useState<number>();
  const resetComposer = () => {
    setNote("");
    setOutcome("");
    setDone(false);
    setEditingId(undefined);
  };
  const editOpen = (item: Followup) => {
    setEditingId(item.id);
    setNote(item.note);
    setOutcome(item.outcome ?? "");
    setDone(false);
  };
  const save = (event: FormEvent, keepOpen = false) => {
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
  };
  const materialName = (itemId: number) =>
    view.inventory.find((item) => item.id === itemId)?.name ??
    `Item #${itemId}`;
  return (
    <Dialog
      wide
      className="service-followup-dialog"
      title={mode === "view" ? "Follow-up History" : "Follow-ups"}
      subtitle="Customer contact and service coordination"
      onClose={onClose}
    >
      <div className="followup-job-card">
        <div>
          <span>Job card</span>
          <strong>{view.job.job_no}</strong>
        </div>
        <div>
          <span>Customer</span>
          <strong>{view.customer.name}</strong>
          <a href={`tel:${view.customer.mobile}`}>{view.customer.mobile}</a>
        </div>
        <div>
          <span>Vehicle</span>
          <strong>{view.vehicle.number}</strong>
          <small>
            {view.vehicle.make} {view.vehicle.model}
          </small>
        </div>
        <div>
          <span>Current job status</span>
          <Status status={view.job.main_status} sub={view.job.sub_status} />
        </div>
      </div>
      <div className="followup-details">
        <details>
          <summary>Vehicle details</summary>
          <div>
            <span>Registration: {view.vehicle.number}</span>
            <span>
              Model: {view.vehicle.make} {view.vehicle.model}
            </span>
            <span>Odometer: {view.vehicle.km.toLocaleString("en-IN")} km</span>
            <span>Requested work: {view.visit.requested_work || "—"}</span>
          </div>
        </details>
        <details>
          <summary>
            Requested materials (
            {view.material_requests.length +
              view.material_purchase_requests.length}
            )
          </summary>
          <div>
            {view.material_requests.length ||
            view.material_purchase_requests.length ? (
              <>
                {view.material_requests.map((item) => (
                  <span key={`material-${item.id}`}>
                    {materialName(item.item_id)} · {item.requested_qty} ·{" "}
                    {item.status ?? "Requested"}
                  </span>
                ))}
                {view.material_purchase_requests.map((item) => (
                  <span key={`purchase-${item.id}`}>
                    {item.item_name} · {item.quantity} {item.unit} ·{" "}
                    {item.status}
                  </span>
                ))}
              </>
            ) : (
              <span>No materials requested.</span>
            )}
          </div>
        </details>
        <details>
          <summary>
            Estimate{" "}
            {view.estimate ? `· ${view.estimate.status}` : "· Not created"}
          </summary>
          <div>
            <span>Status: {view.estimate?.status ?? "Not created"}</span>
            <span>Items: {view.estimate_items.length}</span>
            <span>
              Total:{" "}
              {money(invoiceItemsTotal(view.estimate_items, view.estimate))}
            </span>
          </div>
        </details>
      </div>
      <section className="followup-history" aria-label="Follow-up history">
        <div className="followup-section-heading">
          <h3>History</h3>
          <span>{history.length} saved</span>
        </div>
        {history.length ? (
          history.map((item) => (
            <article
              className={`followup-history-card ${item.done ? "done" : "open"}`}
              key={item.id}
            >
              <div>
                <span className="followup-state">
                  {item.done ? "Done" : "Open"}
                </span>
                <strong>{item.note}</strong>
                {item.outcome && <p>Outcome: {item.outcome}</p>}
              </div>
              <div className="followup-timestamps">
                <span>
                  Created {formatTimestamp(item.created_at || item.due_at)}
                </span>
                {item.done && (
                  <span>
                    Completed{" "}
                    {formatTimestamp(
                      item.updated_at || item.created_at || item.due_at,
                    )}
                  </span>
                )}
                {editable && !item.done && (
                  <button
                    type="button"
                    className="link-action"
                    onClick={() => editOpen(item)}
                  >
                    Edit
                  </button>
                )}
                {item.done && <small>Completed entries are read-only.</small>}
              </div>
            </article>
          ))
        ) : (
          <p className="empty-state">No saved follow-ups.</p>
        )}
      </section>
      {editable && (
        <form
          id="service-followup-form"
          className="followup-composer"
          onSubmit={(event) => save(event, false)}
        >
          <div className="followup-section-heading">
            <h3>{editingId ? "Edit open follow-up" : "Add follow-up"}</h3>
            {editingId && (
              <button
                type="button"
                className="link-action"
                onClick={resetComposer}
              >
                Cancel edit
              </button>
            )}
          </div>
          <label>
            Note
            <textarea
              data-dialog-initial-focus
              rows={3}
              required
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a concise follow-up note"
            />
          </label>
          <label>
            Outcome <small>Optional</small>
            <input
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
              placeholder="Customer response or next step"
            />
          </label>
          <button
            type="button"
            className={`followup-done-toggle ${done ? "checked" : ""}`}
            role="checkbox"
            aria-checked={done}
            onClick={() => setDone((value) => !value)}
          >
            <Check size={16} aria-hidden="true" /> Mark this follow-up done
          </button>
          <div className="followup-composer-actions">
            <button type="submit" className="secondary-action">
              Save Follow-up
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={(event) => save(event as unknown as FormEvent, true)}
            >
              Save & Add Another
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
  return (
    <Dialog
      title={mode === "view" ? "Follow-up History" : "Follow-ups"}
      subtitle={`${view.job.job_no} · ${view.vehicle.number}`}
      onClose={onClose}
      footer={
        editable ? (
          <button form="service-followup-form" className="primary-action">
            Save Follow-up
          </button>
        ) : undefined
      }
    >
      <div className="followup-history">
        {view.followups.length ? (
          view.followups.map((item) => (
            <div className="row" key={item.id}>
              <strong>{item.note}</strong>
              <span>
                {item.done ? "Done" : "Open"}
                {item.outcome ? ` · ${item.outcome}` : ""}
              </span>
              <span>
                {formatTimestamp(
                  item.created_at || item.updated_at || item.due_at,
                )}
              </span>
              {editable && !item.done && (
                <label className="followup-completion">
                  <input
                    type="checkbox"
                    checked={completions[item.id]?.selected ?? false}
                    onChange={(event) =>
                      setCompletions((current) => ({
                        ...current,
                        [item.id]: {
                          selected: event.target.checked,
                          outcome: current[item.id]?.outcome ?? "",
                        },
                      }))
                    }
                  />{" "}
                  Mark Done{" "}
                  <input
                    aria-label={`Outcome for ${item.note}`}
                    value={completions[item.id]?.outcome ?? ""}
                    disabled={!completions[item.id]?.selected}
                    onChange={(event) =>
                      setCompletions((current) => ({
                        ...current,
                        [item.id]: {
                          selected: current[item.id]?.selected ?? false,
                          outcome: event.target.value,
                        },
                      }))
                    }
                    placeholder="Outcome"
                  />
                </label>
              )}
            </div>
          ))
        ) : (
          <p className="empty-state">No saved follow-ups.</p>
        )}
      </div>
      {editable && (
        <form id="service-followup-form" onSubmit={save}>
          <label>
            Note
            <input
              data-dialog-initial-focus
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a follow-up note"
            />
          </label>
          <label>
            Outcome
            <input
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
            />
          </label>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={done}
              onChange={(event) => setDone(event.target.checked)}
            />{" "}
            Mark new follow-up Done
          </label>
        </form>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-MaterialProcurementTriage

src/App.tsx:4553-4634

~~~tsx
function MaterialProcurementTriage({
  requests,
  purchaseOrders,
  purchaseOrderLines,
  inventory,
  onOpenIssueMaterial,
  onCreatePurchaseRequest,
}: {
  requests: StoreRequestRow[];
  purchaseOrders: PurchaseOrder[];
  purchaseOrderLines: PurchaseOrderLine[];
  inventory: InventoryItem[];
  onOpenIssueMaterial: () => void;
  onCreatePurchaseRequest: (draft: ProcurementDraft) => void;
}) {
  const activeRequests = requests.filter(({ request }) =>
    !["Issued", "Cancelled"].includes(request.status ?? "Requested") &&
    request.requested_qty > request.issued_qty,
  );
  const allocations = allocateMaterialDemands(
    activeRequests.map(({ request }) => request),
    inventory,
  );
  const issuable = activeRequests.filter((_, index) => allocations[index].outcome === "issuable");
  const procurement = activeRequests.filter((_, index) => allocations[index].outcome === "procurement");
  const newItems = purchaseOrderLines.filter((line) =>
    line.item_id === 0 && purchaseOrders.some((order) =>
      order.id === line.purchase_order_id && ["PO Request", "New Item Request"].includes(order.status),
    ),
  );
  const [selectedProcurementRequestId, setSelectedProcurementRequestId] = useState<number>();
  const selectedProcurement = procurement.find(
    ({ request }) => request.id === selectedProcurementRequestId,
  ) ?? procurement[0];
  return (
    <section className="material-procurement-triage" aria-label="Material procurement triage">
      <div>
        <p className="section-kicker">Materials Request</p>
        <h2>Material procurement triage</h2>
        <p>Choose the next safe action for each demand. Procurement starts only as a Purchase Request.</p>
      </div>
      <div className="material-triage-grid">
        <article className="material-triage-card material-triage-card-issuable">
          <h3>Available to issue</h3>
          <strong>{issuable.length}</strong>
          <p>Existing SKUs have enough stock for their outstanding requested quantity.</p>
          <button type="button" className="secondary-action" onClick={onOpenIssueMaterial}>Open Issue Material</button>
        </article>
        <article className="material-triage-card material-triage-card-procurement">
          <h3>Existing-SKU procurement</h3>
          <strong>{procurement.length}</strong>
          <p>Existing SKUs are short. Create a Purchase Request; do not add stock directly.</p>
          {procurement.length > 1 && (
            <label>
              Procurement demand
              <select aria-label="Procurement material request" value={selectedProcurement?.request.id ?? ""} onChange={(event) => setSelectedProcurementRequestId(Number(event.target.value))}>
                {procurement.map(({ view, request, item }) => <option key={request.id} value={request.id}>{view.job.job_no} · {item?.sku ?? "SKU"} · {Math.max(0, request.requested_qty - request.issued_qty)} {item?.unit ?? "units"}</option>)}
              </select>
            </label>
          )}
          <button type="button" className="primary-action" disabled={!procurement.length} onClick={() => {
            const selectedIndex = activeRequests.findIndex(
              ({ request }) => request.id === selectedProcurement?.request.id,
            );
            const selected = selectedProcurement?.request;
            if (!selected) return;
            onCreatePurchaseRequest({
              source: `Material Request #${selected.id}`,
              lines: [{ item_id: selected.item_id, ordered_qty: allocations[selectedIndex].procurementQty }],
            });
          }}>Create Purchase Request</button>
        </article>
        <article className="material-triage-card material-triage-card-new-item">
          <h3>New Item Requests</h3>
          <strong>{newItems.length}</strong>
          <p>New Item Requests are the uncatalogued lines already recorded on open Purchase Requests.</p>
          <button type="button" className="primary-action" onClick={() => onCreatePurchaseRequest({ source: "New Item Request", lines: [{ item_name: "", unit: "piece", ordered_qty: 1 }] })}>Create New Item Request</button>
        </article>
      </div>
    </section>
  );
}
~~~

## CMP-App-StoreDesk

src/App.tsx:4636-4926

~~~tsx
function StoreDesk({
  activeMenuItem,
  state,
  actor,
  mutate,
  setSelectedJobId,
  onNavigate,
  onCreatePurchaseRequest,
  initialStockSearch,
  initialDrilldown,
  filterLayout = "default",
}: {
  activeMenuItem: string;
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  onNavigate?: (label: string) => void;
  onCreatePurchaseRequest?: (draft: ProcurementDraft) => void;
  initialStockSearch?: string;
  initialDrilldown?: DashboardDrilldown;
  filterLayout?: "default" | "search";
}) {
  const [stockTab, setStockTab] = useState<
    "Inventory List" | "Low Stock" | "Stock Movements"
  >(initialDrilldown?.stockTab ?? "Inventory List");
  const [editingStock, setEditingStock] = useState<InventoryItem>();
  const [quickAddStockOpen, setQuickAddStockOpen] = useState(false);
  const [releaseCandidate, setReleaseCandidate] = useState<StoreRequestRow>();
  const [approvalCandidate, setApprovalCandidate] = useState<StoreRequestRow>();
  const [reconcileCandidate, setReconcileCandidate] =
    useState<StoreRequestRow>();
  const [viewJobId, setViewJobId] = useState<number>();
  const openJob = (id: number) => {
    setSelectedJobId(id);
    setViewJobId(id);
  };
  const viewJob = state.jobs.find((view) => view.job.id === viewJobId);
  const requests = state.jobs.flatMap((view) =>
    view.material_requests.map((request) => ({
      view,
      request,
      item: state.inventory.find((item) => item.id === request.item_id),
    })),
  );
  const localPurchases = state.jobs.flatMap((view) =>
    view.local_purchases.map((purchase) => ({ view, purchase })),
  );
  const purchaseRequests = state.jobs.flatMap((view) =>
    view.material_purchase_requests.map((purchaseRequest) => ({
      view,
      purchaseRequest,
    })),
  );
  if (activeMenuItem === "Stock") {
    const lowStock = state.inventory.filter(
      (item) => item.stock_qty < item.low_stock_qty,
    );
    return (
      <section className="workspace single-panel stock-workspace">
        <div className="desk-panel stock-overview">
          <PanelTitle
            icon={<Boxes />}
            title="Stock"
            subtitle="Inventory levels, low-stock attention and movement history"
          />
          <div className="sub-tabs" role="tablist" aria-label="Stock views">
            {(["Inventory List", "Low Stock", "Stock Movements"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={stockTab === tab}
                  className={stockTab === tab ? "active" : ""}
                  onClick={() => setStockTab(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          <div className="stock-summary" aria-label="Stock summary">
            <span>
              <Boxes size={16} />
              <strong>{state.inventory.length}</strong> Total SKUs
            </span>
            <span>
              <Package size={16} />
              <strong>
                {state.inventory.reduce((sum, item) => sum + item.stock_qty, 0)}
              </strong>{" "}
              Total Units
            </span>
            <span>
              <ClipboardCheck size={16} />
              <strong>{lowStock.length}</strong> Low Stock
            </span>
            <span>
              <ShieldCheck size={16} />
              <strong>
                {state.inventory.filter((item) => item.stock_qty <= 0).length}
              </strong>{" "}
              Out of Stock
            </span>
          </div>
        </div>
        {stockTab === "Inventory List" && (
          <StoreList
            key={`stock-${initialStockSearch ?? "all"}`}
            kind="stock"
            inventory={state.inventory}
            requests={requests}
            onOpenJob={openJob}
            onEditStock={setEditingStock}
            initialSearch={initialStockSearch}
            initialPrimary={initialDrilldown?.status}
            filterLayout={filterLayout}
            headerAction={actor.role === "admin" ? (
              <button
                type="button"
                className="primary-action"
                aria-haspopup="dialog"
                onClick={() => setQuickAddStockOpen(true)}
              >
                <Plus size={16} /> Quick Add Stock
              </button>
            ) : undefined}
          />
        )}
        {stockTab === "Low Stock" && (
          <StoreList
            key="low-stock"
            kind="stock"
            inventory={lowStock}
            requests={requests}
            onOpenJob={openJob}
            filterLayout={filterLayout}
          />
        )}
        {stockTab === "Stock Movements" && (
          <StockMovementHistory state={state} />
        )}
        {actor.role === "admin" && quickAddStockOpen && (
          <Dialog
            title="Quick Add Stock"
            subtitle="Record an inward against an existing SKU or create a new SKU"
            onClose={() => setQuickAddStockOpen(false)}
          >
            <QuickAddStock
              inventory={state.inventory}
              actor={actor}
              purchaseOrders={state.purchase_orders}
              purchaseOrderLines={state.purchase_order_lines}
              mutate={mutate}
              onSaved={() => setQuickAddStockOpen(false)}
            />
          </Dialog>
        )}
        {editingStock && (
          <EditStockDetailsDialog
            item={editingStock}
            mutate={mutate}
            onClose={() => setEditingStock(undefined)}
          />
        )}
      </section>
    );
  }
  if (activeMenuItem === "Material Requests") {
    return (
      <section className="workspace single-panel store-list-first-workspace">
        <MaterialProcurementTriage
          requests={requests}
          purchaseOrders={state.purchase_orders}
          purchaseOrderLines={state.purchase_order_lines}
          inventory={state.inventory}
          onOpenIssueMaterial={() => onNavigate?.("Issue Material")}
          onCreatePurchaseRequest={(draft) => onCreatePurchaseRequest?.(draft)}
        />
        <StoreList
          key={`requests-${initialDrilldown?.month ?? ""}`}
          kind="requests"
          inventory={state.inventory}
          requests={requests}
          purchases={localPurchases}
          purchaseRequests={purchaseRequests}
          onOpenJob={openJob}
          onNeedsApproval={setApprovalCandidate}
          initialMonth={initialDrilldown?.month}
          filterLayout={filterLayout}
        />
        <details className="workflow-disclosure">
          <summary>Procurement and issue workflow</summary>
          <p className="permission-note">Available inventory can be issued from Issue Material. Shortages and New Item Requests must be created as Purchase Requests on the Purchase Orders page. Stock Inward is recorded only after Purchase Order closure.</p>
        </details>
        {approvalCandidate && (
          <MaterialApprovalSubmitDialog
            row={approvalCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setApprovalCandidate(undefined)}
          />
        )}
        {viewJob && (
          <JobRecordDialog
            view={viewJob}
            state={state}
            mutate={mutate}
            actor={actor}
            mode="view"
            onClose={() => setViewJobId(undefined)}
          />
        )}
      </section>
    );
  }
  const eligibleRequests = requests.filter(({ view, request }) =>
    materialRowActionsFor(actor, view.job, request).includes("release"),
  );
  if (activeMenuItem === "Issue Material") {
    return (
      <section className="workspace single-panel store-list-first-workspace">
        <StoreList
          key={`${activeMenuItem}-${initialDrilldown?.month ?? ""}`}
          kind="issue"
          inventory={state.inventory}
          requests={eligibleRequests}
          onOpenJob={openJob}
          onRelease={setReleaseCandidate}
          onNeedsApproval={setApprovalCandidate}
          initialMonth={initialDrilldown?.month}
          initialPrimary={initialDrilldown?.status}
          filterLayout={filterLayout}
        />
        <details className="workflow-disclosure">
          <summary>Issue workflow</summary>
          <IssueMaterialEditor />
        </details>
        {releaseCandidate && (
          <ReleaseMaterialDialog
            row={releaseCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setReleaseCandidate(undefined)}
          />
        )}
        {approvalCandidate && (
          <MaterialApprovalSubmitDialog
            row={approvalCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setApprovalCandidate(undefined)}
          />
        )}
        {viewJob && (
          <JobRecordDialog
            view={viewJob}
            state={state}
            mutate={mutate}
            actor={actor}
            mode="view"
            onClose={() => setViewJobId(undefined)}
          />
        )}
      </section>
    );
  }
  const reconcileRequests = requests.filter(
    ({ request }) => request.issued_qty > 0,
  );
  return (
    <section className="workspace single-panel store-list-first-workspace">
      <StoreList
        key={activeMenuItem}
        kind="reconcile"
        inventory={state.inventory}
        requests={reconcileRequests}
        onOpenJob={openJob}
        onReconcile={setReconcileCandidate}
        filterLayout={filterLayout}
      />
      {reconcileCandidate && (
        <ReconcileEditor
          row={reconcileCandidate}
          mutate={mutate}
          onClose={() => setReconcileCandidate(undefined)}
        />
      )}
    </section>
  );
}
~~~

## CMP-App-PurchaseStockIssueEditor

src/App.tsx:4928-5084

~~~tsx
function PurchaseStockIssueEditor({
  state,
  actor,
  purchaseRequests,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  purchaseRequests: Array<{
    view: JobView;
    purchaseRequest: MaterialPurchaseRequest;
  }>;
  mutate: Mutate;
}) {
  const pending = purchaseRequests.filter(
    ({ purchaseRequest }) => purchaseRequest.status === "Pending",
  );
  const [requestId, setRequestId] = useState(
    pending[0]?.purchaseRequest.id ?? 0,
  );
  const [itemId, setItemId] = useState(0);
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Local purchase");
  const [unitCost, setUnitCost] = useState(0);
  const [vendor, setVendor] = useState("");
  const [billReference, setBillReference] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const selected = pending.find((row) => row.purchaseRequest.id === requestId);
  const save = (event: FormEvent) => {
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
  };
  return (
    <form className="desk-panel" onSubmit={save}>
      <PanelTitle
        icon={<PackageCheck />}
        title="Purchase, Stock & Issue"
        subtitle="Complete a requested new item in one audited operation"
      />
      {!pending.length ? (
        <p className="empty-state">No pending new-item requests.</p>
      ) : (
        <>
          <label>
            Pending request
            <select
              value={requestId}
              onChange={(event) => setRequestId(Number(event.target.value))}
            >
              {pending.map(({ view, purchaseRequest }) => (
                <option key={purchaseRequest.id} value={purchaseRequest.id}>
                  {view.job.job_no} · {purchaseRequest.item_name} ·{" "}
                  {purchaseRequest.quantity} {purchaseRequest.unit}
                </option>
              ))}
            </select>
          </label>
          <label>
            Map to inventory item (optional)
            <select
              value={itemId}
              onChange={(event) => setItemId(Number(event.target.value))}
            >
              <option value={0}>Create inventory item</option>
              {state.inventory
                .filter((item) => item.unit === selected?.purchaseRequest.unit)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.sku}
                  </option>
                ))}
            </select>
          </label>
          {!itemId && (
            <div className="form-grid">
              <label>
                SKU
                <input
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder={`LOCAL-${requestId}`}
                />
              </label>
              <label>
                Category
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
              </label>
            </div>
          )}
          <div className="form-grid">
            <label>
              Unit cost
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(event) => setUnitCost(Number(event.target.value))}
              />
            </label>
            <label>
              Vendor / shop
              <input
                required
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
              />
            </label>
            <label>
              Bill / reference
              <input
                required
                value={billReference}
                onChange={(event) => setBillReference(event.target.value)}
              />
            </label>
          </div>
          <label>
            Note (optional)
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
          <button className="primary-action">Purchase, Stock & Issue</button>
        </>
      )}
    </form>
  );
}
~~~

## CMP-App-PurchaseOrdersWorkspace

src/App.tsx:5110-5964

~~~tsx
function PurchaseOrdersWorkspace({
  state,
  actor,
  mutate,
  procurementDraft,
  onProcurementDraftConsumed,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  procurementDraft?: ProcurementDraft;
  onProcurementDraftConsumed: () => void;
}) {
  const [selectedId, setSelectedId] = useState<number>();
  const [dialog, setDialog] = useState<"form" | "view" | "approve" | "receipt" | "confirm">();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<PurchaseRequestFormLine[]>([]);
  const [approvalLines, setApprovalLines] = useState<PurchaseRequestApprovalFormLine[]>([]);
  const [receiptLines, setReceiptLines] = useState<Array<{ purchase_order_line_id: number; delivered_qty: number }>>([]);
  const [confirmationLines, setConfirmationLines] = useState<Array<{ purchase_order_line_id: number; accepted_qty: number; returned_qty: number; damaged_qty: number; wasted_qty: number }>>([]);
  useEffect(() => {
    if (!procurementDraft) return;
    setSelectedId(undefined);
    setOrderDate(new Date().toISOString().slice(0, 10));
    setNotes(`From ${procurementDraft.source}`);
    setLines(procurementDraft.lines.map((line) =>
      "item_id" in line
        ? { key: crypto.randomUUID(), item_id: line.item_id, new_item: false, ordered_qty: line.ordered_qty }
        : { key: crypto.randomUUID(), item_name: line.item_name, unit: line.unit, new_item: true, ordered_qty: line.ordered_qty },
    ));
    setDialog("form");
    onProcurementDraftConsumed();
  }, [procurementDraft, onProcurementDraftConsumed]);
  const supplierName = (id: number) =>
    supplierNameForPurchaseOrder(state.suppliers, id);
  const legacyOrderIds = new Set(
    state.inward_purchases
      .map((purchase) => purchase.purchase_order_id)
      .filter((id): id is number => id !== null && id !== undefined),
  );
  const orders = state.purchase_orders.filter(
    (order) => !legacyOrderIds.has(order.id),
  );
  const nextPurchaseRequestNumber = nextPurchaseRequestNumberForOrders(
    state.purchase_orders,
  );
  const visibleOrders = actor.role === "store"
    ? orders.filter((order) => order.created_by === actor.id)
    : orders;
  const selected = visibleOrders.find((order) => order.id === selectedId);
  const selectedLines = selected
    ? state.purchase_order_lines.filter(
        (line) => line.purchase_order_id === selected.id,
      )
    : [];
  const deliveredFor = (line: PurchaseOrderLine) => {
    const receiptIds = new Set(state.purchase_order_receipts.map((receipt) => receipt.id));
    return state.purchase_order_receipt_lines
      .filter((receiptLine) => receiptIds.has(receiptLine.purchase_order_receipt_id) && receiptLine.purchase_order_line_id === line.id)
      .reduce((sum, receiptLine) => sum + receiptLine.delivered_qty, 0);
  };
  const confirmationFor = (line: PurchaseOrderLine) =>
    state.purchase_order_confirmations.find((confirmation) => confirmation.purchase_order_line_id === line.id);
  const downloadClosedAudit = (order: PurchaseOrder, orderLines: PurchaseOrderLine[]) => {
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
  };
  const close = () => {
    setDialog(undefined);
    setSelectedId(undefined);
  };
  const openNew = () => {
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
  };
  const openEdit = (order: PurchaseOrder) => {
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
  };
  const openView = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setDialog("view");
  };
  const beginReceipt = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setReceiptLines(state.purchase_order_lines.filter((line) => line.purchase_order_id === order.id).map((line) => ({ purchase_order_line_id: line.id, delivered_qty: 0 })));
    setDialog("receipt");
  };
  const beginConfirmation = (order: PurchaseOrder) => {
    setSelectedId(order.id);
    setConfirmationLines(state.purchase_order_lines.filter((line) => line.purchase_order_id === order.id).map((line) => ({ purchase_order_line_id: line.id, accepted_qty: deliveredFor(line), returned_qty: 0, damaged_qty: 0, wasted_qty: 0 })));
    setDialog("confirm");
  };
  const beginApproval = (order: PurchaseOrder) => {
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
  };
  const approveRequest = () => {
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
  };
  const valid =
    /^\d{4}-\d{2}-\d{2}$/.test(orderDate) &&
    lines.length > 0 &&
    lines.every(
      (line) =>
        line.ordered_qty > 0 &&
        (line.new_item
          ? Boolean(line.item_name?.trim()) && Boolean(line.unit?.trim())
          : Boolean(line.item_id)),
    );
  const save = () => {
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
  };
  const filtered = visibleOrders.filter(
    (order) =>
      (status === "ALL" || order.status === status) &&
      (!search.trim() ||
        normalizeSearch(
          `${order.po_number} ${supplierName(order.supplier_id)} ${order.notes}`,
        ).includes(normalizeSearch(search))),
  );
  const totalReceived = selectedLines.reduce(
    (sum, line) => sum + deliveredFor(line),
    0,
  );
  const totalOrdered = selectedLines.reduce(
    (sum, line) => sum + line.ordered_qty,
    0,
  );
  const receivedValue = selectedLines.reduce(
    (sum, line) => sum + deliveredFor(line) * line.unit_cost,
    0,
  );
  return (
    <section className="workspace single-panel purchase-orders-workspace">
      <div className="desk-panel store-list-page inward-register">
        <div className="action-row">
          <PanelTitle
            icon={<ReceiptText />}
            title="Purchase Orders"
            subtitle="Ordering commitments; stock is recorded only through Stock Inward."
          />
          {(actor.role === "admin" || actor.role === "store") && (
            <button className="primary-action" onClick={openNew}>
              <Plus size={16} /> New Purchase Request
            </button>
          )}
        </div>
        <div className="store-filter-grid register-filter-toolbar">
          <label className="list-search">
            Search
            <input
              aria-label="Search purchase orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="PO number or supplier"
            />
          </label>
          <label>
            Status
            <select
              aria-label="Purchase order status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              {[
                "PO Request",
                "PO Request Approved",
                "PO Issued",
                "PO Received",
                "PO Confirmation",
                "Draft",
                "Sent",
                "Partially Received",
                "Ready to Close",
                "Closed",
                "Cancelled",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
        </div>
        <div className="table-wrap">
          <table aria-label="Purchase order register">
            <thead>
              <tr>
                <th>PO</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Ordered</th>
                <th>Received</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const orderLines = state.purchase_order_lines.filter(
                  (line) => line.purchase_order_id === order.id,
                );
                const received = orderLines.reduce(
                  (sum, line) => sum + deliveredFor(line),
                  0,
                );
                return (
                  <tr
                    key={order.id}
                    className="clickable-row"
                    onClick={() => openView(order)}
                  >
                    <td>{order.po_number}</td>
                    <td>{order.order_date}</td>
                    <td>{supplierName(order.supplier_id)}</td>
                    <td>
                      {orderLines.reduce(
                        (sum, line) => sum + line.ordered_qty,
                        0,
                      )}
                    </td>
                    <td>{received}</td>
                    <td>{money(order.total)}</td>
                    <td>
                      <span className="status-badge">{order.status}</span>
                    </td>
                    <td>
                      <div className="grid-actions purchase-order-actions">
                        {order.status === "PO Request" &&
                          (actor.role === "admin" || order.created_by === actor.id) && (
                          <button
                            type="button"
                            className="workflow-action action-secondary purchase-order-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(order);
                            }}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        )}
                        <button
                          type="button"
                          className="workflow-action action-document purchase-order-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            openView(order);
                          }}
                        >
                          <Workflow size={15} />
                          Process
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {dialog === "form" && (
        <Dialog
          wide
          className="purchase-request-dialog"
          title={selectedId ? `Edit ${selected?.po_number ?? "Purchase Request"}` : "New Purchase Request"}
          subtitle="PO number is assigned automatically. Supplier and pricing are completed by Admin after review."
          onClose={close}
          footer={
            <button
              type="button"
              className="primary-action"
              disabled={!valid}
              onClick={save}
            >
              {selectedId ? "Save request" : "Create request"}
            </button>
          }
        >
          <div className="inward-dialog-content">
            <div className="form-grid">
              <label>
                PO number
                <input
                  aria-label="PO number"
                  value={selected?.po_number ?? nextPurchaseRequestNumber}
                  disabled
                  readOnly
                />
              </label>
              <label>
                Order date
                <input
                  aria-label="PO order date"
                  type="date"
                  value={orderDate}
                  onChange={(event) => setOrderDate(event.target.value)}
                />
              </label>
              <label>
                Notes
                <input
                  aria-label="PO notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
              <label>
                Supplier
                <input
                  aria-label="PO supplier"
                  value="Assigned by Admin after request"
                  disabled
                  readOnly
                />
              </label>
            </div>
            <section>
              <div className="receipt-lines-heading">
                <h4>Order lines</h4>
                <button
                  type="button"
                  onClick={() =>
                    state.inventory[0] &&
                    setLines((current) => [
                      ...current,
                      {
                        key: crypto.randomUUID(),
                        item_id: state.inventory[0].id,
                        new_item: false,
                        ordered_qty: 1,
                      },
                    ])
                  }
                >
                  Add line
                </button>
              </div>
              {lines.map((line, index) => (
                <div
                  className={`receipt-line-row purchase-request-line-row${line.new_item ? " purchase-request-line-row--new" : ""}`}
                  key={line.key}
                >
                  <label>
                    Item type
                    <select value={line.new_item ? "new" : "inventory"} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, new_item: event.target.value === "new", item_id: event.target.value === "new" ? undefined : state.inventory[0]?.id, item_name: "", unit: "" } : candidate))}>
                      <option value="inventory">Existing inventory SKU</option>
                      <option value="new">New item request</option>
                    </select>
                  </label>
                  {line.new_item ? (
                    <>
                      <label>New item name<input aria-label={`PO line ${index + 1} new item name`} value={line.item_name ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_name: event.target.value } : candidate))} /></label>
                      <label>Unit<input aria-label={`PO line ${index + 1} unit`} value={line.unit ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, unit: event.target.value } : candidate))} /></label>
                    </>
                  ) : <InventoryPicker inventory={state.inventory} value={line.item_id ?? 0} onChange={(item_id) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_id } : candidate))} label={`PO line ${index + 1} item`} />}
                  <label>
                    Qty
                    <input
                      aria-label={`PO line ${index + 1} quantity`}
                      type="number"
                      min="0.01"
                      value={line.ordered_qty}
                      onChange={(event) =>
                        setLines((current) =>
                          current.map((candidate) =>
                            candidate.key === line.key
                              ? {
                                  ...candidate,
                                  ordered_qty: Number(event.target.value),
                                }
                              : candidate,
                          ),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="danger-action"
                    onClick={() =>
                      setLines((current) =>
                        current.filter(
                          (candidate) => candidate.key !== line.key,
                        ),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>
          </div>
        </Dialog>
      )}
      {dialog === "view" && selected && (
        <Dialog
          wide
          title={selected.po_number}
          subtitle={`${supplierName(selected.supplier_id)} · ${selected.status}`}
          onClose={close}
          footer={
            <>
              {selected.status === "Draft" && actor.role === "admin" && (
                <>
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => openEdit(selected)}
                  >
                    Edit draft
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      mutate((db) =>
                        setPurchaseOrderStatusForActor(
                          db,
                          selected.id,
                          actor.id,
                          "send",
                        ),
                      )
                    }
                  >
                    Send saved PO
                  </button>
                </>
              )}
              {selected.status === "PO Request" &&
                (actor.role === "admin" || selected.created_by === actor.id) && (
                  <>
                    {actor.role === "admin" && (
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() => beginApproval(selected)}
                      >
                        Review & approve request
                      </button>
                    )}
                    <button
                      type="button"
                      className="primary-action"
                      onClick={() => openEdit(selected)}
                    >
                      Edit request
                    </button>
                    <button
                      type="button"
                      className="danger-action"
                      onClick={() =>
                        mutate((db) =>
                          cancelPurchaseRequestForActor(db, selected.id, actor.id),
                        )
                      }
                    >
                      Cancel request
                    </button>
                  </>
                )}
              {selected.status === "PO Request Approved" && actor.role === "admin" && (
                <button
                  type="button"
                  className="primary-action"
                  onClick={() =>
                    mutate((db) =>
                      issuePurchaseOrderForActor(db, selected.id, actor.id),
                    )
                  }
                >
                  Issue Purchase Order
                </button>
              )}
              {actor.role === "admin" && ["PO Issued", "PO Received"].includes(selected.status) && (
                <button type="button" className="primary-action" onClick={() => beginReceipt(selected)}>
                  Record delivery
                </button>
              )}
              {actor.role === "admin" && selected.status === "PO Received" && (
                <button type="button" onClick={() => beginConfirmation(selected)}>
                  Confirm quantities
                </button>
              )}
              {actor.role === "admin" && selected.status === "PO Confirmation" && (
                <button
                  type="button"
                  className="primary-action"
                  onClick={() =>
                    mutate((db) =>
                      closePurchaseOrderForActor(db, selected.id, actor.id),
                    )
                  }
                >
                  Close PO & post Stock Inward
                </button>
              )}
              {actor.role === "admin" && [
                "Draft",
                "Sent",
                "Partially Received",
                "Ready to Close",
              ].includes(selected.status) && (
                <button
                  type="button"
                  className="danger-action"
                  onClick={() =>
                    mutate((db) =>
                      setPurchaseOrderStatusForActor(
                        db,
                        selected.id,
                        actor.id,
                        "cancel",
                      ),
                    )
                  }
                >
                  Cancel PO
                </button>
              )}
              {actor.role === "admin" && ["Sent", "Partially Received", "Ready to Close"].includes(
                selected.status,
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    mutate((db) =>
                      setPurchaseOrderStatusForActor(
                        db,
                        selected.id,
                        actor.id,
                        "close",
                      ),
                    )
                  }
                >
                  Close PO
                </button>
              )}
            </>
          }
        >
          <div className="inward-dialog-content">
            <PurchaseOrderLifecycle status={selected.status} />
            {selected.status === "Closed" && (
              <section className="purchase-order-stage-context" aria-label="Closed Purchase Order audit">
                <strong>PO Closed — view only</strong>
                <p>
                  Accepted quantities were posted to Stock Inward at closure. This commercial record is locked for audit.
                </p>
                <button
                  type="button"
                  className="workflow-action action-document"
                  onClick={() => downloadClosedAudit(selected, selectedLines)}
                >
                  <Download size={15} /> Download closed PO audit
                </button>
              </section>
            )}
            {selected.status === "PO Request Approved" && (
              <p className="purchase-order-stage-context">
                {actor.role === "admin"
                  ? "This Purchase Order is fully approved. Issue it to its assigned supplier when you are ready to request delivery."
                  : "This Purchase Order is fully approved and awaiting Admin issue to its assigned supplier."}
              </p>
            )}
            {[
              "PO Issued",
              "PO Received",
              "PO Confirmation",
              "Closed",
              "Partially Received",
              "Ready to Close",
            ].includes(selected.status) && (
              <SupplierBasket
                supplier={state.suppliers.find(
                  (supplier) => supplier.id === selected.supplier_id,
                )}
                lines={selectedLines}
              />
            )}
            <p>
              <strong>Order vs received:</strong> {totalOrdered} ordered ·{" "}
              {totalReceived} received · {totalOrdered - totalReceived}{" "}
              remaining · {money(receivedValue)} received value
            </p>
            <p className="muted">
              Delivery does not update inventory. Admin confirms every delivered unit as
              accepted, returned, damaged, or wasted before the PO can close.
            </p>
            <div className="table-wrap">
              <table aria-label="Purchase order reconciliation">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Ordered</th>
                    <th>Delivered</th>
                    <th>Outstanding</th>
                    <th>Accepted</th>
                    <th>Exceptions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLines.map((line) => {
                    const received = deliveredFor(line);
                    const confirmation = confirmationFor(line);
                    const item = state.inventory.find(
                      (candidate) => candidate.id === line.item_id,
                    );
                    return (
                      <tr key={line.id}>
                        <td>
                          {item?.sku} · {item?.name}
                        </td>
                        <td>{line.ordered_qty}</td>
                        <td>{received}</td>
                        <td>{Math.max(0, line.ordered_qty - received)}</td>
                        <td>{confirmation?.accepted_qty ?? "—"}</td>
                        <td>{confirmation ? `${confirmation.returned_qty} returned / ${confirmation.damaged_qty} damaged / ${confirmation.wasted_qty} wasted` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {actor.role === "admin" && selected.status === "PO Request" && <PreviousPriceReview state={state} order={selected} lines={selectedLines} actor={actor} mutate={mutate} />}
            <h4>Linked stock inward history</h4>
            {state.stock_inwards.filter(
              (inward) => inward.purchase_order_id === selected.id,
            ).length ? (
              <ul>
                {state.stock_inwards
                  .filter((inward) => inward.purchase_order_id === selected.id)
                  .map((inward) => (
                    <li key={inward.id}>
                      {inward.received_at}: {inward.qty}{" "}
                      {
                        state.inventory.find(
                          (item) => item.id === inward.item_id,
                        )?.unit
                      }{" "}
                      · {inward.note}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="empty-state">No linked receipts yet.</p>
            )}
            {selected.status === "Cancelled" &&
              totalReceived < totalOrdered && (
                <p className="error-text">
                  Outstanding balance cancelled: {totalOrdered - totalReceived}{" "}
                  not received.
                </p>
              )}
          </div>
        </Dialog>
      )}
      {dialog === "receipt" && selected && (
        <Dialog
          title={`Record delivery — ${selected.po_number}`}
          subtitle="Enter this supplier delivery only. Inventory will not change until the confirmed PO is closed."
          onClose={close}
          footer={<button type="button" className="primary-action" onClick={() => {
            const lines = receiptLines.filter((line) => line.delivered_qty > 0);
            if (mutate((db) => recordPurchaseOrderReceiptForActor(db, selected.id, actor.id, { lines }))) setDialog("view");
          }}>Save delivery</button>}
        >
          <div className="inward-dialog-content" aria-label="Purchase Order delivery receipt">
            {selectedLines.map((line, index) => {
              const item = state.inventory.find((candidate) => candidate.id === line.item_id);
              const delivered = deliveredFor(line);
              const formLine = receiptLines.find((candidate) => candidate.purchase_order_line_id === line.id);
              return <label key={line.id} className="receipt-line-row">
                {item?.sku} · {item?.name ?? line.item_name} — ordered {line.ordered_qty}, delivered {delivered}, outstanding {line.ordered_qty - delivered}
                <input aria-label={`Delivered quantity for PO line ${index + 1}`} type="number" min="0" max={Math.max(0, line.ordered_qty - delivered)} step="0.01" value={formLine?.delivered_qty || ""} onChange={(event) => setReceiptLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, delivered_qty: Number(event.target.value) } : candidate))} />
              </label>;
            })}
          </div>
        </Dialog>
      )}
      {dialog === "confirm" && selected && (
        <Dialog
          wide
          title={`Confirm quantities — ${selected.po_number}`}
          subtitle="Every delivered unit must be accepted, returned, damaged, or wasted before this PO can move to confirmation."
          onClose={close}
          footer={<button type="button" className="primary-action" onClick={() => {
            if (mutate((db) => confirmPurchaseOrderForActor(db, selected.id, actor.id, { lines: confirmationLines }))) setDialog("view");
          }}>Confirm quantities</button>}
        >
          <div className="inward-dialog-content" aria-label="Purchase Order quality confirmation">
            {selectedLines.map((line, index) => {
              const item = state.inventory.find((candidate) => candidate.id === line.item_id);
              const delivered = deliveredFor(line);
              const formLine = confirmationLines.find((candidate) => candidate.purchase_order_line_id === line.id);
              if (!formLine) return null;
              const update = (patch: Partial<typeof formLine>) => setConfirmationLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, ...patch } : candidate));
              return <section className="approval-line" key={line.id}>
                <h4>{index + 1}. {item?.sku} · {item?.name ?? line.item_name} <span className="muted">Delivered {delivered} / ordered {line.ordered_qty}</span></h4>
                <div className="form-grid">
                  <label>Accepted<input aria-label={`Accepted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.accepted_qty} onChange={(event) => update({ accepted_qty: Number(event.target.value) })} /></label>
                  <label>Returned<input aria-label={`Returned quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.returned_qty} onChange={(event) => update({ returned_qty: Number(event.target.value) })} /></label>
                  <label>Damaged<input aria-label={`Damaged quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.damaged_qty} onChange={(event) => update({ damaged_qty: Number(event.target.value) })} /></label>
                  <label>Wasted<input aria-label={`Wasted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.wasted_qty} onChange={(event) => update({ wasted_qty: Number(event.target.value) })} /></label>
                </div>
              </section>;
            })}
          </div>
        </Dialog>
      )}
      {dialog === "approve" && selected && (
        <Dialog
          wide
          title={`Approve ${selected.po_number}`}
          subtitle="Assign each line to an active supplier and enter its pre-GST price. Different suppliers create traceable supplier-specific Purchase Orders."
          onClose={close}
          footer={<button type="button" className="primary-action" onClick={approveRequest}>Approve Purchase Request</button>}
        >
          <div className="inward-dialog-content" aria-label="Purchase Request commercial approval">
            <p className="muted">New Item Requests need catalogue details now. Their SKU is created with zero stock and will not become issuable until later receipt and closure steps.</p>
            {selectedLines.map((requestLine, index) => {
              const formLine = approvalLines.find((line) => line.purchase_order_line_id === requestLine.id);
              if (!formLine) return null;
              const item = state.inventory.find((candidate) => candidate.id === requestLine.item_id);
              const update = (patch: Partial<PurchaseRequestApprovalFormLine>) => setApprovalLines((current) => current.map((line) => line.purchase_order_line_id === requestLine.id ? { ...line, ...patch } : line));
              return <section className="approval-line" key={requestLine.id}>
                <h4>{index + 1}. {item ? `${item.sku} · ${item.name}` : requestLine.item_name} <span className="muted">× {requestLine.ordered_qty} {item?.unit ?? requestLine.unit}</span></h4>
                <div className="form-grid">
                  <label>Supplier<select aria-label={`Supplier for PO line ${index + 1}`} value={formLine.supplier_id} onChange={(event) => update({ supplier_id: Number(event.target.value) })}><option value={0}>Select active supplier</option>{state.suppliers.filter((supplier) => supplier.status === "Active").map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label>
                  <label>Pre-GST unit cost<input aria-label={`Pre-GST price for PO line ${index + 1}`} type="number" min="0.01" step="0.01" value={formLine.unit_cost || ""} onChange={(event) => update({ unit_cost: Number(event.target.value) })} /></label>
                </div>
                {!item && <div className="form-grid approval-new-item"><label>SKU<input aria-label={`SKU for PO line ${index + 1}`} value={formLine.sku} onChange={(event) => update({ sku: event.target.value })} /></label><label>Category<input aria-label={`Category for PO line ${index + 1}`} value={formLine.category} onChange={(event) => update({ category: event.target.value })} /></label><label>Name<input aria-label={`Catalogue name for PO line ${index + 1}`} value={formLine.name} onChange={(event) => update({ name: event.target.value })} /></label><label>Unit<input aria-label={`Catalogue unit for PO line ${index + 1}`} value={formLine.unit} onChange={(event) => update({ unit: event.target.value })} /></label><label>Low-stock threshold<input aria-label={`Low stock threshold for PO line ${index + 1}`} type="number" min="0" value={formLine.low_stock_qty} onChange={(event) => update({ low_stock_qty: Number(event.target.value) })} /></label><label>Selling price<input aria-label={`Selling price for PO line ${index + 1}`} type="number" min="0" value={formLine.selling_price} onChange={(event) => update({ selling_price: Number(event.target.value) })} /></label></div>}
              </section>;
            })}
          </div>
        </Dialog>
      )}
    </section>
  );
}
~~~

## CMP-App-PurchaseOrderLifecycle

src/App.tsx:5966-5997

~~~tsx
function PurchaseOrderLifecycle({ status }: { status: PurchaseOrderStatus }) {
  const stages = [
    "PO Request",
    "PO Request Approved",
    "PO Issued",
    "PO Received",
    "PO Confirmation",
    "PO Closed",
  ];
  const currentStage = status === "Closed"
    ? "PO Closed"
    : status === "Partially Received" || status === "Ready to Close"
      ? "PO Received"
      : status;
  const currentIndex = stages.indexOf(currentStage);
  return (
    <section className="purchase-order-lifecycle" aria-label="Purchase Order lifecycle">
      <span className="section-kicker">Lifecycle</span>
      <ol>
        {stages.map((stage, index) => (
          <li
            key={stage}
            className={index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming"}
            aria-current={index === currentIndex ? "step" : undefined}
          >
            {stage}
          </li>
        ))}
      </ol>
    </section>
  );
}
~~~

## CMP-App-SupplierBasket

src/App.tsx:5999-6028

~~~tsx
function SupplierBasket({
  supplier,
  lines,
}: {
  supplier?: Supplier;
  lines: PurchaseOrderLine[];
}) {
  const totalQuantity = lines.reduce((sum, line) => sum + line.ordered_qty, 0);
  return (
    <section className="supplier-basket" aria-label="Supplier Basket">
      <div>
        <span className="section-kicker">Supplier Basket</span>
        <h4>{supplier?.name ?? "Assigned supplier unavailable"}</h4>
        <p>
          {totalQuantity} ordered units across {lines.length} item{lines.length === 1 ? "" : "s"}
        </p>
      </div>
      {supplier ? (
        <dl>
          <div><dt>Contact</dt><dd>{supplier.contact_name || "Not recorded"}</dd></div>
          <div><dt>Phone</dt><dd>{supplier.phone || "Not recorded"}</dd></div>
          <div><dt>Email</dt><dd>{supplier.email || "Not recorded"}</dd></div>
          <div><dt>GSTIN</dt><dd>{supplier.gstin || "Not recorded"}</dd></div>
        </dl>
      ) : (
        <p className="error-text">The supplier record is unavailable. Contact an Admin before receiving this order.</p>
      )}
    </section>
  );
}
~~~

## CMP-App-PreviousPriceReview

src/App.tsx:6030-6060

~~~tsx
function PreviousPriceReview({ state, order, lines, actor, mutate }: { state: WorkshopState; order: PurchaseOrder; lines: PurchaseOrderLine[]; actor: User; mutate: Mutate }) {
  const [quotationLineId, setQuotationLineId] = useState<number>();
  const [supplierName, setSupplierName] = useState("");
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().slice(0, 10));
  const [quotedQty, setQuotedQty] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [notes, setNotes] = useState("");
  const historyFor = (itemId: number) => state.purchase_order_lines.filter((line) => line.item_id === itemId).map((line) => ({ line, order: state.purchase_orders.find((candidate) => candidate.id === line.purchase_order_id) })).filter((entry): entry is { line: PurchaseOrderLine; order: PurchaseOrder } => entry.order?.status === "Closed").sort((left, right) => right.order.order_date.localeCompare(left.order.order_date) || right.order.id - left.order.id || right.line.id - left.line.id).slice(0, 3);
  const quotesFor = (lineId: number) => state.purchase_order_quotations.filter((quote) => quote.purchase_order_line_id === lineId).sort((left, right) => right.quote_date.localeCompare(left.quote_date) || right.id - left.id);
  const beginQuotation = (line: PurchaseOrderLine) => {
    setQuotationLineId(line.id); setSupplierName(""); setQuoteDate(new Date().toISOString().slice(0, 10)); setQuotedQty(line.ordered_qty); setUnitCost(0); setNotes("");
  };
  return <section className="previous-price-review" aria-label="Previous Price Review">
    <div className="receipt-lines-heading"><div><h4>Previous Price Review</h4><p className="muted">Completed purchases across all suppliers. Prices are pre-GST.</p></div></div>
    <div className="previous-price-review-grid">
      {lines.map((line) => {
        const item = state.inventory.find((candidate) => candidate.id === line.item_id);
        const history = line.item_id ? historyFor(line.item_id) : [];
        const quotations = quotesFor(line.id);
        return <article className={`price-review-card${line.item_id ? "" : " price-review-card-new"}`} key={line.id}>
          <header><strong>{line.item_id ? `${item?.sku ?? "SKU"} · ${item?.name ?? line.item_name}` : line.item_name}</strong><span>{line.item_id ? `Stock: ${item?.stock_qty ?? 0} ${item?.unit ?? line.unit}` : "N/A"}</span></header>
          {line.item_id ? history.length ? <div className="table-wrap"><table aria-label={`Previous purchases for ${item?.name ?? line.item_name}`}><thead><tr><th>Supplier</th><th>Date</th><th>Pre-GST price</th><th>Qty</th></tr></thead><tbody>{history.map(({ line: pastLine, order: pastOrder }) => <tr key={pastLine.id}><td>{state.suppliers.find((supplier) => supplier.id === pastOrder.supplier_id)?.name ?? "Supplier unavailable"}</td><td>{pastOrder.order_date}</td><td>{money(pastLine.unit_cost)}</td><td>{pastLine.ordered_qty}</td></tr>)}</tbody></table></div> : <p className="empty-state">No completed purchase history.</p> : <p className="empty-state">N/A — New Item Request; no purchase history.</p>}
          <div className="quotation-review"><div className="receipt-lines-heading"><strong>Supplier quotations <span className="muted">(optional)</span></strong><button type="button" onClick={() => quotationLineId === line.id ? setQuotationLineId(undefined) : beginQuotation(line)}>{quotationLineId === line.id ? "Cancel quotation" : "Add quotation"}</button></div>
            {quotationLineId === line.id && <div className="quotation-form"><label>Supplier name<input aria-label={`Quotation supplier for ${line.id}`} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} /></label><label>Quote date<input aria-label={`Quotation date for ${line.id}`} type="date" value={quoteDate} onChange={(event) => setQuoteDate(event.target.value)} /></label><label>Qty<input aria-label={`Quotation quantity for ${line.id}`} type="number" min="0.01" value={quotedQty} onChange={(event) => setQuotedQty(Number(event.target.value))} /></label><label>Pre-GST unit price<input aria-label={`Quotation price for ${line.id}`} type="number" min="0" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))} /></label><label className="quotation-notes">Notes<input aria-label={`Quotation notes for ${line.id}`} value={notes} onChange={(event) => setNotes(event.target.value)} /></label><button type="button" className="primary-action" onClick={() => mutate((db) => { savePurchaseOrderQuotationForActor(db, order.id, actor.id, { purchase_order_line_id: line.id, supplier_name: supplierName, quote_date: quoteDate, quoted_qty: quotedQty, unit_cost: unitCost, notes }); setQuotationLineId(undefined); })}>Save quotation</button></div>}
            {quotations.length ? <ul className="quotation-list">{quotations.map((quote) => <li key={quote.id}><strong>{quote.supplier_name}</strong> · {quote.quote_date} · {money(quote.unit_cost)} pre-GST × {quote.quoted_qty}{quote.notes ? ` · ${quote.notes}` : ""}</li>)}</ul> : <p className="muted">No quotations recorded. This is optional.</p>}
          </div>
        </article>;
      })}
    </div>
  </section>;
}
~~~

## CMP-App-LegacyInwardPurchasesWorkspace

src/App.tsx:6062-6761

~~~tsx
function LegacyInwardPurchasesWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [composerOpen, setComposerOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [poNumber, setPoNumber] = useState("");
  const [lines, setLines] = useState<PurchaseFormLine[]>(() =>
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
  const [attachments, setAttachments] = useState<
    InwardPurchaseAttachmentInput[]
  >([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [revisionReason, setRevisionReason] = useState("");
  const selected = state.inward_purchases.find(
    (purchase) => purchase.id === selectedId,
  );
  const selectedLines = selected
    ? state.inward_purchase_lines.filter(
        (line) => line.purchase_id === selected.id,
      )
    : [];
  const selectedAttachments = selected
    ? state.inward_purchase_attachments.filter(
        (attachment) => attachment.purchase_id === selected.id,
      )
    : [];

  useEffect(() => {
    if (!selected) return;
    setSupplierId(selected.supplier_id ?? 0);
    setInvoiceNo(selected.supplier_invoice_no);
    setInvoiceDate(
      selected.invoice_date || new Date().toISOString().slice(0, 10),
    );
    setPoNumber(selected.po_number ?? "");
    setLines(
      selectedLines.map((line) => ({
        key: String(line.id),
        item_id: line.item_id,
        received_qty: line.received_qty,
        unit_cost: line.unit_cost,
        discount: line.discount,
        gst_rate: line.gst_rate,
      })),
    );
    setAttachments([]);
    setRevisionReason("");
    // Selected records are intentionally copied into editable draft state only when selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const reset = () => {
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
  };
  const draftInput = () => ({
    supplier_id: supplierId || undefined,
    supplier_invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    po_number: poNumber,
    lines: lines.map(({ key: _key, ...line }) => line),
    attachments,
  });
  const saveDraft = () => {
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
  };
  const addLine = () => {
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
  };
  const updateLine = (key: string, patch: Partial<InwardPurchaseLineInput>) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  const selectFile = async (file?: File) => {
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
  };
  const supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier";
  const filtered = state.inward_purchases.filter(
    (purchase) =>
      (status === "ALL" || purchase.status === status) &&
      (!search.trim() ||
        normalizeSearch(
          `${supplierName(purchase.supplier_id)} ${purchase.supplier_invoice_no} ${purchase.po_number}`,
        ).includes(normalizeSearch(search))),
  );
  const editable = !selected || selected.status === "Draft";
  const total = lines.reduce((sum, line) => {
    const base = line.received_qty * line.unit_cost - (line.discount ?? 0);
    return sum + base * (1 + (line.gst_rate ?? 0) / 100);
  }, 0);
  const projectedQuantity = (itemId: number) =>
    (state.inventory.find((item) => item.id === itemId)?.stock_qty ?? 0) +
    lines
      .filter((line) => line.item_id === itemId)
      .reduce(
        (sum, line) =>
          sum + (Number.isFinite(line.received_qty) ? line.received_qty : 0),
        0,
      );
  const activeSupplier =
    state.suppliers.find((supplier) => supplier.id === supplierId)?.status ===
    "Active";
  const validDate =
    Boolean(invoiceDate) &&
    !Number.isNaN(new Date(`${invoiceDate}T00:00:00`).getTime());
  const validLines =
    lines.length > 0 &&
    lines.every(
      (line) =>
        state.inventory.some((item) => item.id === line.item_id) &&
        line.received_qty > 0 &&
        line.unit_cost >= 0 &&
        (line.discount ?? 0) >= 0 &&
        (line.gst_rate ?? 0) >= 0 &&
        (line.gst_rate ?? 0) <= 100,
    );
  const hasScan = selectedAttachments.length + attachments.length > 0;
  const ready =
    activeSupplier &&
    Boolean(invoiceNo.trim()) &&
    validDate &&
    validLines &&
    hasScan;
  const lineTotal = (line: PurchaseFormLine) => {
    const base = line.received_qty * line.unit_cost - (line.discount ?? 0);
    return base * (1 + (line.gst_rate ?? 0) / 100);
  };

  return (
    <section
      className={`workspace two-panel inward-workspace${composerOpen ? " inward-composer-open" : ""}`}
    >
      <div className="desk-panel store-list-page inward-register">
        <PanelTitle
          icon={<ReceiptText />}
          title="Inward Purchases"
          subtitle="Invoice-based goods receipts and item purchase history"
        />
        <div className="store-filter-grid">
          <label className="list-search">
            Search
            <input
              aria-label="Search inward purchases"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Supplier, invoice or PO"
            />
          </label>
          <label>
            Status
            <select
              aria-label="Inward purchase status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option>Draft</option>
              <option>Submitted</option>
            </select>
          </label>
          <ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
        </div>
        <div className="action-row">
          <button className="primary-action" onClick={reset}>
            <Plus size={16} /> New inward purchase
          </button>
          <ListExportControls
            report={{
              title: "Inward Purchases",
              filters: activeFilterSummary({ Search: search, Status: status }),
              columns: [
                {
                  header: "Invoice date",
                  value: (row: InwardPurchase) => row.invoice_date,
                },
                {
                  header: "Supplier",
                  value: (row: InwardPurchase) => supplierName(row.supplier_id),
                },
                {
                  header: "Invoice",
                  value: (row: InwardPurchase) => row.supplier_invoice_no,
                },
                {
                  header: "Status",
                  value: (row: InwardPurchase) => row.status,
                },
                { header: "Total", value: (row: InwardPurchase) => row.total },
              ],
              rows: filtered,
            }}
          />
        </div>
        <div className="table-wrap">
          <table aria-label="Inward purchase register">
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Invoice</th>
                <th>PO</th>
                <th>Total</th>
                <th>Status</th>
                <th>Lines</th>
                <th>Scan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((purchase) => {
                const attachment = state.inward_purchase_attachments.find(
                  (item) => item.purchase_id === purchase.id,
                );
                const lineCount = state.inward_purchase_lines.filter(
                  (line) => line.purchase_id === purchase.id,
                ).length;
                return (
                  <tr
                    key={purchase.id}
                    className={`clickable-row${purchase.id === selectedId ? " selected-register-row" : ""}`}
                    aria-selected={purchase.id === selectedId}
                    onClick={() => {
                      setSelectedId(purchase.id);
                      setComposerOpen(true);
                    }}
                  >
                    <td>{purchase.invoice_date || "—"}</td>
                    <td>{supplierName(purchase.supplier_id)}</td>
                    <td>{purchase.supplier_invoice_no || "—"}</td>
                    <td>{purchase.po_number || "—"}</td>
                    <td>{money(purchase.total)}</td>
                    <td>
                      <span className="status-badge">{purchase.status}</span>
                    </td>
                    <td>{lineCount}</td>
                    <td>
                      {attachment ? (
                        <a
                          href={attachment.document_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form
        className="desk-panel inward-composer"
        onSubmit={(event) => {
          event.preventDefault();
          saveDraft();
        }}
      >
        <button
          type="button"
          className="inward-back"
          onClick={() => setComposerOpen(false)}
        >
          ← Back to register
        </button>
        <PanelTitle
          icon={<PackageCheck />}
          title={selected ? `Receipt #${selected.id}` : "New receipt draft"}
          subtitle={
            selected?.status === "Submitted"
              ? "Posted receipt is immutable; Admin corrections append a revision."
              : "Save a draft, attach the supplier invoice, then submit."
          }
        />
        {selected?.status === "Submitted" ? (
          <div className="submitted-receipt">
            <section>
              <h4>Receipt details</h4>
              <dl>
                <div>
                  <dt>Supplier</dt>
                  <dd>{supplierName(supplierId)}</dd>
                </div>
                <div>
                  <dt>Invoice</dt>
                  <dd>{invoiceNo}</dd>
                </div>
                <div>
                  <dt>Invoice date</dt>
                  <dd>{invoiceDate}</dd>
                </div>
                <div>
                  <dt>PO</dt>
                  <dd>{poNumber || "—"}</dd>
                </div>
                <div>
                  <dt>Posting status</dt>
                  <dd>
                    <span className="status-badge">Submitted</span>
                  </dd>
                </div>
              </dl>
            </section>
            <section>
              <h4>Posted lines</h4>
              <div className="receipt-line-grid readonly">
                {lines.map((line) => {
                  const item = state.inventory.find(
                    (candidate) => candidate.id === line.item_id,
                  );
                  return (
                    <div className="receipt-line-row" key={line.key}>
                      <span>
                        {item?.sku} · {item?.name}
                      </span>
                      <span>
                        {line.received_qty} {item?.unit}
                      </span>
                      <span>{money(line.unit_cost)}</span>
                      <strong>{money(lineTotal(line))}</strong>
                    </div>
                  );
                })}
              </div>
              <p className="receipt-total">Posted total: {money(total)}</p>
            </section>
            <section>
              <h4>Invoice scans</h4>
              {selectedAttachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
            </section>
          </div>
        ) : (
          <>
            <section className="receipt-header">
              <h4>Receipt header</h4>
              <div className="form-grid">
                <label>
                  Supplier
                  <select
                    aria-label="Purchase supplier"
                    required
                    value={supplierId}
                    onChange={(event) =>
                      setSupplierId(Number(event.target.value))
                    }
                  >
                    <option value={0}>Select active supplier</option>
                    {state.suppliers
                      .filter(
                        (supplier) =>
                          supplier.status === "Active" ||
                          supplier.id === supplierId,
                      )
                      .map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                          {supplier.status === "On hold" ? " (On hold)" : ""}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Supplier invoice no.
                  <input
                    aria-label="Supplier invoice number"
                    value={invoiceNo}
                    onChange={(event) => setInvoiceNo(event.target.value)}
                  />
                </label>
                <label>
                  Invoice date
                  <input
                    aria-label="Invoice date"
                    type="date"
                    value={invoiceDate}
                    onChange={(event) => setInvoiceDate(event.target.value)}
                  />
                </label>
                <label>
                  PO number (optional)
                  <input
                    aria-label="PO number"
                    value={poNumber}
                    onChange={(event) => setPoNumber(event.target.value)}
                  />
                </label>
              </div>
            </section>
            <section>
              <div className="receipt-lines-heading">
                <h4>Receipt lines</h4>
                <button type="button" onClick={addLine}>
                  Add line
                </button>
              </div>
              <div className="receipt-line-grid">
                {lines.map((line, index) => {
                  const item = state.inventory.find(
                    (candidate) => candidate.id === line.item_id,
                  );
                  return (
                    <div className="receipt-line-row" key={line.key}>
                      <InventoryPicker
                        inventory={state.inventory}
                        value={line.item_id}
                        onChange={(item_id) =>
                          updateLine(line.key, { item_id })
                        }
                        label={`Receipt line ${index + 1} item`}
                      />
                      <small>
                        {item?.sku} · {item?.unit} · stock {item?.stock_qty} →{" "}
                        {projectedQuantity(line.item_id)} {item?.unit}
                      </small>
                      <label>
                        Qty
                        <input
                          aria-label={`Receipt line ${index + 1} quantity`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={line.received_qty}
                          onChange={(event) =>
                            updateLine(line.key, {
                              received_qty: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        Pre-GST cost
                        <input
                          aria-label={`Receipt line ${index + 1} unit cost`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unit_cost}
                          onChange={(event) =>
                            updateLine(line.key, {
                              unit_cost: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        Discount
                        <input
                          aria-label={`Receipt line ${index + 1} discount`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.discount}
                          onChange={(event) =>
                            updateLine(line.key, {
                              discount: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        GST %
                        <input
                          aria-label={`Receipt line ${index + 1} GST`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={line.gst_rate}
                          onChange={(event) =>
                            updateLine(line.key, {
                              gst_rate: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <strong>{money(lineTotal(line))}</strong>
                      <button
                        type="button"
                        className="danger-action"
                        aria-label={`Remove receipt line ${index + 1}`}
                        onClick={() =>
                          setLines((current) =>
                            current.filter((item) => item.key !== line.key),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="receipt-attachments">
              <h4>Invoice scan</h4>
              <label className="file-upload-button">
                Attach invoice scan (PDF/JPG, max 10 MB)
                <input
                  aria-label="Invoice scan"
                  type="file"
                  accept="application/pdf,image/jpeg"
                  onChange={(event) => {
                    void selectFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                  hidden
                />
              </label>
              {selectedAttachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
              {attachments.map((attachment, index) => (
                <AttachmentItem
                  key={`${attachment.original_name}-${index}`}
                  attachment={attachment}
                  onRemove={() =>
                    setAttachments((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
              ))}
            </section>
          </>
        )}
        {selected?.status === "Submitted" && actor.role === "admin" && (
          <section className="receipt-correction">
            <h4>Admin correction</h4>
            <p>
              Post only the revised receipt quantities; WorkshopOS records the
              delta and reason.
            </p>
            <label>
              Correction reason
              <input
                aria-label="Correction reason"
                value={revisionReason}
                onChange={(event) => setRevisionReason(event.target.value)}
                placeholder="Required reason for stock delta"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                mutate((db) =>
                  reviseInwardPurchaseForActor(db, selected.id, actor.id, {
                    reason: revisionReason,
                    lines: lines.map(({ key: _key, ...line }) => line),
                  }),
                )
              }
            >
              Post revision delta
            </button>
          </section>
        )}
        {editable && (
          <div className="receipt-status-bar" aria-label="Receipt readiness">
            <div>
              <strong>{money(total)}</strong>
              <span>
                {lines.length} line{lines.length === 1 ? "" : "s"} ·{" "}
                {hasScan ? "scan attached" : "scan needed"}
              </span>
            </div>
            <ul>
              <li className={activeSupplier ? "ready" : ""}>Active supplier</li>
              <li className={invoiceNo.trim() ? "ready" : ""}>
                Invoice number
              </li>
              <li className={validDate ? "ready" : ""}>Valid date</li>
              <li className={validLines ? "ready" : ""}>Valid lines</li>
              <li className={hasScan ? "ready" : ""}>Invoice scan</li>
            </ul>
            <div className="action-row">
              <button className="primary-action">Save draft</button>
              {selected && (
                <button
                  type="button"
                  className="primary-action"
                  disabled={!ready}
                  onClick={() =>
                    mutate((db) =>
                      submitInwardPurchaseForActor(db, selected.id, actor.id),
                    )
                  }
                >
                  Submit receipt
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
~~~

## CMP-App-InwardPurchasesWorkspace

src/App.tsx:6763-7475

~~~tsx
function InwardPurchasesWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [dialog, setDialog] = useState<
    "create" | "view" | "edit" | "receive" | "approve"
  >();
  const [recordId, setRecordId] = useState<number>();
  const [supplierId, setSupplierId] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [poNumber, setPoNumber] = useState("");
  const [lines, setLines] = useState<PurchaseFormLine[]>([]);
  const [attachments, setAttachments] = useState<
    InwardPurchaseAttachmentInput[]
  >([]);
  const [revisionReason, setRevisionReason] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const record = state.inward_purchases.find(
    (purchase) => purchase.id === recordId,
  );
  const recordLines = record
    ? state.inward_purchase_lines.filter(
        (line) => line.purchase_id === record.id,
      )
    : [];
  const recordAttachments = record
    ? state.inward_purchase_attachments.filter(
        (attachment) => attachment.purchase_id === record.id,
      )
    : [];
  const supplierName = (id: number) =>
    state.suppliers.find((supplier) => supplier.id === id)?.name ??
    "Unknown supplier";
  const freshLine = (): PurchaseFormLine | undefined =>
    state.inventory[0] && {
      key: crypto.randomUUID(),
      item_id: state.inventory[0].id,
      received_qty: 1,
      unit_cost: 0,
      discount: 0,
      gst_rate: 0,
    };
  const open = (next: NonNullable<typeof dialog>, id?: number) => {
    setRecordId(id);
    setDialog(next);
    setError("");
    setAttachments([]);
    setRevisionReason("");
  };
  const close = () => {
    setDialog(undefined);
    setRecordId(undefined);
  };

  useEffect(() => {
    if (!dialog) return;
    if (!record) {
      const line = freshLine();
      setSupplierId(0);
      setInvoiceNo("");
      setInvoiceDate(new Date().toISOString().slice(0, 10));
      setPoNumber("");
      setLines(line ? [line] : []);
      return;
    }
    setSupplierId(record.supplier_id ?? 0);
    setInvoiceNo(record.supplier_invoice_no);
    setInvoiceDate(
      record.invoice_date || new Date().toISOString().slice(0, 10),
    );
    setPoNumber(record.po_number ?? "");
    setLines(
      recordLines.map((line) => ({
        key: String(line.id),
        purchase_order_line_id: line.purchase_order_line_id ?? undefined,
        item_id: line.item_id,
        received_qty: line.received_qty,
        unit_cost: line.unit_cost,
        discount: line.discount,
        gst_rate: line.gst_rate,
      })),
    );
    // The dialog intentionally snapshots a record into form state on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, recordId]);

  const updateLine = (key: string, patch: Partial<InwardPurchaseLineInput>) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  const draftInput = () => ({
    supplier_id: supplierId || undefined,
    supplier_invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    po_number: poNumber,
    lines: lines.map(({ key: _key, ...line }) => line),
    attachments,
  });
  const lineTotal = (line: PurchaseFormLine) =>
    (line.received_qty * line.unit_cost - (line.discount ?? 0)) *
    (1 + (line.gst_rate ?? 0) / 100);
  const total = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const activeSupplier =
    state.suppliers.find((supplier) => supplier.id === supplierId)?.status ===
    "Active";
  const validLines =
    lines.length > 0 &&
    lines.every(
      (line) =>
        state.inventory.some((item) => item.id === line.item_id) &&
        line.received_qty > 0 &&
        line.unit_cost >= 0 &&
        (line.discount ?? 0) >= 0 &&
        (line.gst_rate ?? 0) >= 0 &&
        (line.gst_rate ?? 0) <= 100,
    );
  const validDate =
    Boolean(invoiceDate) &&
    !Number.isNaN(new Date(`${invoiceDate}T00:00:00`).getTime());
  const hasScan = recordAttachments.length + attachments.length > 0;
  const filtered = state.inward_purchases.filter(
    (purchase) =>
      (status === "ALL" || purchase.status === status) &&
      (!search.trim() ||
        normalizeSearch(
          `${purchase.id} ${supplierName(purchase.supplier_id)} ${purchase.supplier_invoice_no} ${purchase.po_number}`,
        ).includes(normalizeSearch(search))),
  );
  const selectFile = async (file?: File) => {
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
  };
  const saveDraft = () => {
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
  };
  const sendForApproval = () => {
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
  };
  const receive = () => {
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
  };
  const approve = () => {
    if (
      recordId &&
      mutate(
        (db) => approveInwardPurchaseForActor(db, recordId, actor.id),
        setError,
      )
    )
      close();
  };
  const revise = () => {
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
  };
  const editorMode = dialog === "create" || dialog === "edit";
  const receiveMode = dialog === "receive";
  const receivedMode =
    record?.status === "Received" || record?.status === "Submitted";
  const dialogTitle =
    dialog === "create"
      ? "Add purchase record"
      : dialog === "approve"
        ? "Approve purchase order"
        : receiveMode
          ? `Receive & Post · ${record?.po_number ?? `Purchase #${record?.id}`}`
          : editorMode
            ? `Edit purchase record · #${record?.id ?? "new"}`
            : `Purchase record · #${record?.id}`;
  const dialogFooter =
    dialog === "approve" ? (
      actor.role === "admin" ? (
        <button type="button" className="primary-action" onClick={approve}>
          Approve PO
        </button>
      ) : undefined
    ) : editorMode ? (
      <>
        <button type="button" className="secondary-action" onClick={saveDraft}>
          Save Draft
        </button>
        {record && (
          <button
            type="button"
            className="primary-action"
            onClick={sendForApproval}
          >
            Send for PO
          </button>
        )}
      </>
    ) : receiveMode ? (
      <button type="button" className="primary-action" onClick={receive}>
        Receive & Post
      </button>
    ) : receivedMode && actor.role === "admin" ? (
      <button type="button" className="danger-action" onClick={revise}>
        Post revision delta
      </button>
    ) : undefined;

  return (
    <section className="workspace single-panel inward-purchases-workspace">
      <div className="desk-panel store-list-page inward-register">
        <div className="action-row">
          <PanelTitle
            icon={<ReceiptText />}
            title="Inward Purchases"
            subtitle="Invoice-based goods receipts and item purchase history"
          />
          <button
            type="button"
            className="primary-action"
            onClick={() => open("create")}
          >
            <Plus size={16} /> Add purchase record
          </button>
        </div>
        <div className="store-filter-grid register-filter-toolbar">
          <label className="list-search">
            Search
            <input
              aria-label="Search inward purchases"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Supplier, invoice or PO"
            />
          </label>
          <label>
            Status
            <select
              aria-label="Inward purchase status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option>Draft</option>
              <option>Awaiting PO Approval</option>
              <option>Approved</option>
              <option>Received</option>
            </select>
          </label>
          <ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
        </div>
        <div className="action-row register-export-actions">
          <ListExportControls
            report={{
              title: "Inward Purchases",
              filters: activeFilterSummary({ Search: search, Status: status }),
              columns: [
                { header: "Record", value: (row: InwardPurchase) => row.id },
                { header: "PO", value: (row: InwardPurchase) => row.po_number },
                {
                  header: "Date",
                  value: (row: InwardPurchase) => row.invoice_date,
                },
                {
                  header: "Supplier",
                  value: (row: InwardPurchase) => supplierName(row.supplier_id),
                },
                {
                  header: "Invoice",
                  value: (row: InwardPurchase) => row.supplier_invoice_no,
                },
                {
                  header: "Status",
                  value: (row: InwardPurchase) => row.status,
                },
                { header: "Total", value: (row: InwardPurchase) => row.total },
              ],
              rows: filtered,
            }}
          />
        </div>
        <div className="table-wrap">
          <table aria-label="Inward purchase register">
            <thead>
              <tr>
                <th>Record / PO</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Invoice</th>
                <th>Lines</th>
                <th>Total</th>
                <th>Status</th>
                <th>Scan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((purchase) => {
                const attachment = state.inward_purchase_attachments.find(
                  (item) => item.purchase_id === purchase.id,
                );
                const count = state.inward_purchase_lines.filter(
                  (line) => line.purchase_id === purchase.id,
                ).length;
                const reviewMode =
                  purchase.status === "Awaiting PO Approval"
                    ? "approve"
                    : purchase.status === "Draft"
                      ? "edit"
                      : "view";
                return (
                  <tr
                    key={purchase.id}
                    className="clickable-row"
                    onClick={() =>
                      open(
                        purchase.status === "Awaiting PO Approval"
                          ? "approve"
                          : "view",
                        purchase.id,
                      )
                    }
                  >
                    <td>
                      <strong>#{purchase.id}</strong>
                      <br />
                      <small>{purchase.po_number || "—"}</small>
                    </td>
                    <td>{purchase.invoice_date || "—"}</td>
                    <td>{supplierName(purchase.supplier_id)}</td>
                    <td>{purchase.supplier_invoice_no || "—"}</td>
                    <td>{count}</td>
                    <td>{money(purchase.total)}</td>
                    <td>
                      <span className="status-badge">
                        {purchase.status === "Submitted"
                          ? "Received"
                          : purchase.status}
                      </span>
                    </td>
                    <td>
                      {attachment ? (
                        <a
                          href={attachment.document_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="grid-actions">
                        <button
                          type="button"
                          className="grid-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            open(reviewMode, purchase.id);
                          }}
                        >
                          {purchase.status === "Draft"
                            ? "Edit"
                            : purchase.status === "Awaiting PO Approval"
                              ? "Review"
                              : "View"}
                        </button>
                        {purchase.status === "Draft" && (
                          <button
                            type="button"
                            className="grid-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              open("edit", purchase.id);
                            }}
                          >
                            Send for PO
                          </button>
                        )}
                        {purchase.status === "Awaiting PO Approval" &&
                          actor.role === "admin" && (
                            <button
                              type="button"
                              className="grid-action"
                              onClick={(event) => {
                                event.stopPropagation();
                                open("approve", purchase.id);
                              }}
                            >
                              Approve
                            </button>
                          )}
                        {purchase.status === "Approved" && (
                          <button
                            type="button"
                            className="grid-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              open("receive", purchase.id);
                            }}
                          >
                            Receive & Post
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {dialog && (
        <Dialog
          wide
          title={dialogTitle}
          subtitle={
            dialog === "approve"
              ? "Review the immutable PO snapshot before authorizing it."
              : receivedMode
                ? "Posted receipt is read-only; Admin corrections append a revision."
                : receiveMode
                  ? "Record the actual received quantities, invoice details, and scan."
                  : "Save a draft, then submit its immutable PO snapshot for approval."
          }
          onClose={close}
          footer={dialogFooter}
        >
          <div className="inward-dialog-content">
            {dialog === "approve" ? (
              <PurchaseSnapshot
                record={record!}
                lines={lines}
                inventory={state.inventory}
                supplierName={supplierName}
              />
            ) : receivedMode && !receiveMode ? (
              <>
                <PurchaseSnapshot
                  record={record!}
                  lines={lines}
                  inventory={state.inventory}
                  supplierName={supplierName}
                  attachments={recordAttachments}
                />
                {actor.role === "admin" && (
                  <section className="receipt-correction">
                    <h4>Admin correction</h4>
                    <p>
                      Enter the corrected receipt quantities, then provide the
                      audit reason.
                    </p>
                    <ReceiptLines
                      lines={lines}
                      inventory={state.inventory}
                      editableQuantity
                      updateLine={updateLine}
                      lineTotal={lineTotal}
                    />
                    <label>
                      Correction reason
                      <input
                        data-dialog-initial-focus
                        aria-label="Correction reason"
                        value={revisionReason}
                        onChange={(event) =>
                          setRevisionReason(event.target.value)
                        }
                        required
                      />
                    </label>
                  </section>
                )}
              </>
            ) : (
              <>
                <section className="receipt-header">
                  <h4>{receiveMode ? "Receipt header" : "Purchase header"}</h4>
                  <div className="form-grid">
                    <label>
                      Supplier
                      {editorMode ? (
                        <select
                          data-dialog-initial-focus
                          aria-label="Purchase supplier"
                          value={supplierId}
                          onChange={(event) =>
                            setSupplierId(Number(event.target.value))
                          }
                        >
                          <option value={0}>Select active supplier</option>
                          {state.suppliers
                            .filter(
                              (supplier) =>
                                supplier.status === "Active" ||
                                supplier.id === supplierId,
                            )
                            .map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <input readOnly value={supplierName(supplierId)} />
                      )}
                    </label>
                    <label>
                      Supplier invoice no.
                      <input
                        aria-label="Supplier invoice number"
                        value={invoiceNo}
                        readOnly={!editorMode && !receiveMode}
                        onChange={(event) => setInvoiceNo(event.target.value)}
                      />
                    </label>
                    <label>
                      Invoice date
                      <input
                        aria-label="Invoice date"
                        type="date"
                        value={invoiceDate}
                        readOnly={!editorMode && !receiveMode}
                        onChange={(event) => setInvoiceDate(event.target.value)}
                      />
                    </label>
                    {editorMode && (
                      <label>
                        PO number (optional)
                        <input
                          aria-label="PO number"
                          value={poNumber}
                          onChange={(event) => setPoNumber(event.target.value)}
                        />
                      </label>
                    )}
                  </div>
                </section>
                <section>
                  <div className="receipt-lines-heading">
                    <h4>
                      {receiveMode
                        ? "Actual received quantities"
                        : "Purchase lines"}
                    </h4>
                    {editorMode && (
                      <button
                        type="button"
                        onClick={() => {
                          const line = freshLine();
                          if (line) setLines((current) => [...current, line]);
                        }}
                      >
                        Add line
                      </button>
                    )}
                  </div>
                  <ReceiptLines
                    lines={lines}
                    inventory={state.inventory}
                    editable={editorMode}
                    editableQuantity={receiveMode}
                    updateLine={updateLine}
                    lineTotal={lineTotal}
                    onRemove={(key) =>
                      setLines((current) =>
                        current.filter((line) => line.key !== key),
                      )
                    }
                  />
                </section>
                {receiveMode && (
                  <section className="receipt-attachments">
                    <h4>Invoice scan</h4>
                    <label className="file-upload-button">
                      Attach invoice scan (PDF/JPG, max 10 MB)
                      <input
                        aria-label="Invoice scan"
                        type="file"
                        accept="application/pdf,image/jpeg"
                        onChange={(event) => {
                          void selectFile(event.target.files?.[0]);
                          event.target.value = "";
                        }}
                        hidden
                      />
                    </label>
                    {recordAttachments.map((attachment) => (
                      <AttachmentItem
                        key={attachment.id}
                        attachment={attachment}
                      />
                    ))}
                    {attachments.map((attachment, index) => (
                      <AttachmentItem
                        key={`${attachment.original_name}-${index}`}
                        attachment={attachment}
                        onRemove={() =>
                          setAttachments((current) =>
                            current.filter((_, item) => item !== index),
                          )
                        }
                      />
                    ))}
                  </section>
                )}
                <div
                  className="receipt-status-bar"
                  aria-label="Purchase readiness"
                >
                  <strong>{money(total)}</strong>
                  <span>
                    {editorMode
                      ? `${activeSupplier ? "Active supplier" : "Supplier needed"} · ${validLines ? "valid lines" : "valid lines needed"}`
                      : `${invoiceNo.trim() && validDate && validLines && hasScan ? "Ready to post" : "Invoice, date, quantities and scan are required"}`}
                  </span>
                </div>
              </>
            )}
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
          </div>
        </Dialog>
      )}
    </section>
  );
}
~~~

## CMP-App-ReceiptLines

src/App.tsx:7477-7602

~~~tsx
function ReceiptLines({
  lines,
  inventory,
  editable = false,
  editableQuantity = false,
  updateLine,
  lineTotal,
  onRemove,
}: {
  lines: PurchaseFormLine[];
  inventory: InventoryItem[];
  editable?: boolean;
  editableQuantity?: boolean;
  updateLine: (key: string, patch: Partial<InwardPurchaseLineInput>) => void;
  lineTotal: (line: PurchaseFormLine) => number;
  onRemove?: (key: string) => void;
}) {
  return (
    <div className="receipt-line-grid">
      {lines.map((line, index) => {
        const item = inventory.find(
          (candidate) => candidate.id === line.item_id,
        );
        return (
          <div className="receipt-line-row" key={line.key}>
            {editable ? (
              <InventoryPicker
                inventory={inventory}
                value={line.item_id}
                onChange={(item_id) => updateLine(line.key, { item_id })}
                label={`Receipt line ${index + 1} item`}
              />
            ) : (
              <span>
                {item?.sku} · {item?.name}
              </span>
            )}
            <small>{item?.unit}</small>
            <label>
              Qty
              <input
                aria-label={`Receipt line ${index + 1} quantity`}
                readOnly={!editable && !editableQuantity}
                type="number"
                min="0.01"
                step="0.01"
                value={line.received_qty}
                onChange={(event) =>
                  updateLine(line.key, {
                    received_qty: Number(event.target.value),
                  })
                }
              />
            </label>
            {editable ? (
              <>
                <label>
                  Pre-GST cost
                  <input
                    aria-label={`Receipt line ${index + 1} unit cost`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unit_cost}
                    onChange={(event) =>
                      updateLine(line.key, {
                        unit_cost: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Discount
                  <input
                    aria-label={`Receipt line ${index + 1} discount`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.discount}
                    onChange={(event) =>
                      updateLine(line.key, {
                        discount: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  GST %
                  <input
                    aria-label={`Receipt line ${index + 1} GST`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={line.gst_rate}
                    onChange={(event) =>
                      updateLine(line.key, {
                        gst_rate: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </>
            ) : (
              <>
                <span>{money(line.unit_cost)}</span>
                <span>{line.gst_rate}% GST</span>
              </>
            )}
            <strong>{money(lineTotal(line))}</strong>
            {editable && onRemove && (
              <button
                type="button"
                className="danger-action"
                aria-label={`Remove receipt line ${index + 1}`}
                onClick={() => onRemove(line.key)}
              >
                Remove
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
~~~

## CMP-App-PurchaseSnapshot

src/App.tsx:7604-7672

~~~tsx
function PurchaseSnapshot({
  record,
  lines,
  inventory,
  supplierName,
  attachments = [],
}: {
  record: InwardPurchase;
  lines: PurchaseFormLine[];
  inventory: InventoryItem[];
  supplierName: (id: number) => string;
  attachments?: {
    id: number;
    original_name: string;
    mime_type: string;
    byte_size: number;
    document_url: string;
  }[];
}) {
  return (
    <div className="submitted-receipt">
      <section>
        <h4>Purchase details</h4>
        <dl>
          <div>
            <dt>Supplier</dt>
            <dd>{supplierName(record.supplier_id)}</dd>
          </div>
          <div>
            <dt>PO</dt>
            <dd>{record.po_number || "—"}</dd>
          </div>
          <div>
            <dt>Invoice</dt>
            <dd>{record.supplier_invoice_no || "—"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="status-badge">
                {record.status === "Submitted" ? "Received" : record.status}
              </span>
            </dd>
          </div>
        </dl>
      </section>
      <section>
        <h4>Lines</h4>
        <ReceiptLines
          lines={lines}
          inventory={inventory}
          updateLine={() => undefined}
          lineTotal={(line) =>
            (line.received_qty * line.unit_cost - (line.discount ?? 0)) *
            (1 + (line.gst_rate ?? 0) / 100)
          }
        />
      </section>
      {attachments.length > 0 && (
        <section>
          <h4>Invoice scans</h4>
          {attachments.map((attachment) => (
            <AttachmentItem key={attachment.id} attachment={attachment} />
          ))}
        </section>
      )}
    </div>
  );
}
~~~

## CMP-App-AttachmentItem

src/App.tsx:7674-7708

~~~tsx
function AttachmentItem({
  attachment,
  onRemove,
}: {
  attachment: {
    original_name: string;
    mime_type: string;
    byte_size: number;
    document_url: string;
  };
  onRemove?: () => void;
}) {
  const size =
    attachment.byte_size >= 1024 * 1024
      ? `${(attachment.byte_size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(attachment.byte_size / 1024)} KB`;
  return (
    <div className="receipt-attachment">
      <span>
        <strong>{attachment.original_name}</strong>
        <small>
          {attachment.mime_type} · {size}
        </small>
      </span>
      <a href={attachment.document_url} target="_blank" rel="noreferrer">
        Open
      </a>
      {onRemove && (
        <button type="button" className="danger-action" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}
~~~

## CMP-App-SupplierMasterWorkspace

src/App.tsx:7710-7927

~~~tsx
function SupplierMasterWorkspace({
  state,
  actor,
  mutate,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
}) {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const selected = state.suppliers.find(
    (supplier) => supplier.id === selectedId,
  );
  const [draft, setDraft] = useState({
    name: "",
    contact_name: "",
    phone: "",
    email: "",
    gstin: "",
    status: "Active" as Supplier["status"],
  });
  useEffect(() => {
    if (selected)
      setDraft({
        name: selected.name,
        contact_name: selected.contact_name,
        phone: selected.phone,
        email: selected.email,
        gstin: selected.gstin,
        status: selected.status,
      });
  }, [selected]);
  const reset = () => {
    setSelectedId(undefined);
    setDraft({
      name: "",
      contact_name: "",
      phone: "",
      email: "",
      gstin: "",
      status: "Active",
    });
  };
  const closeDialog = () => {
    setDialogOpen(false);
    reset();
  };
  const openNew = () => {
    reset();
    setDialogOpen(true);
  };
  const openEdit = (supplier: Supplier) => {
    setSelectedId(supplier.id);
    setDialogOpen(true);
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const saved = selected
      ? mutate((db) => updateSupplierForActor(db, selected.id, actor.id, draft))
      : mutate((db) => {
          createSupplierForActor(db, actor.id, draft);
        });
    if (saved) closeDialog();
  };
  return (
    <section className="workspace single-panel">
      <div className="desk-panel">
        <div className="panel-actions">
          <PanelTitle
            icon={<UserRound />}
            title="Supplier Master"
            subtitle="Admin-managed suppliers; only active suppliers are available on goods receipts."
          />
          <button type="button" className="primary-action" onClick={openNew}>
            <Plus size={16} />
            Add new supplier
          </button>
        </div>
        <div className="table-wrap">
          <table aria-label="Supplier master">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>GSTIN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_name || supplier.phone || "—"}</td>
                  <td>{supplier.gstin || "—"}</td>
                  <td>{supplier.status}</td>
                  <td>
                    <div className="grid-actions">
                      <button
                        type="button"
                        className="grid-action"
                        onClick={() => openEdit(supplier)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {dialogOpen && (
        <Dialog
          title={selected ? "Edit supplier" : "Add supplier"}
          subtitle="Hold and archive preserve purchase history."
          onClose={closeDialog}
          footer={
            <>
              {selected && (
                <button
                  type="button"
                  className="danger-action"
                  onClick={() => {
                    if (
                      mutate((db) =>
                        archiveSupplierForActor(db, selected.id, actor.id),
                      )
                    )
                      closeDialog();
                  }}
                >
                  Archive supplier
                </button>
              )}
              <button
                type="submit"
                form="supplier-form"
                className="primary-action"
              >
                Save supplier
              </button>
            </>
          }
        >
          <form id="supplier-form" onSubmit={save}>
            <label>
              Name
              <input
                required
                data-dialog-initial-focus
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Contact name
              <input
                value={draft.contact_name}
                onChange={(event) =>
                  setDraft({ ...draft, contact_name: event.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
            </label>
            <label>
              GSTIN
              <input
                value={draft.gstin}
                onChange={(event) =>
                  setDraft({ ...draft, gstin: event.target.value })
                }
              />
            </label>
            <label>
              Status
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    status: event.target.value as Supplier["status"],
                  })
                }
              >
                <option>Active</option>
                <option>On hold</option>
              </select>
            </label>
          </form>
        </Dialog>
      )}
    </section>
  );
}
~~~

## CMP-App-StockMovementHistory

src/App.tsx:7929-8121

~~~tsx
function StockMovementHistory({ state }: { state: WorkshopState }) {
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("ALL");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const uniqueMovements = Array.from(
    new Map(
      state.jobs
        .flatMap((view) => view.material_movements)
        .map((movement) => [movement.id, movement]),
    ).values(),
  );
  const filtered = uniqueMovements.filter((movement) => {
    const item = state.inventory.find((row) => row.id === movement.item_id);
    const job = state.jobs.find((view) => view.job.id === movement.job_card_id);
    const matchesSearch =
      !normalizeSearch(search) ||
      normalizeSearch(
        `${item?.sku ?? ""} ${item?.name ?? ""} ${job?.job.job_no ?? ""} ${movement.note}`,
      ).includes(normalizeSearch(search));
    return (
      matchesSearch &&
      (direction === "ALL" || movement.direction === direction) &&
      (!date || movement.created_at.slice(0, 10) === date) &&
      (!month || movement.created_at.slice(0, 7) === month)
    );
  });
  const paged = paginate(filtered, page, pageSize);
  const movementMonths = Array.from(
    new Set(
      uniqueMovements
        .map((movement) => movement.created_at.slice(0, 7))
        .filter((value) => /^\d{4}-\d{2}$/.test(value)),
    ),
  ).sort((left, right) => right.localeCompare(left));
  const clearFilters = () => {
    setSearch("");
    setDate("");
    setMonth("");
    setDirection("ALL");
    setPage(1);
  };
  const columns: ExportColumn<MaterialMovement>[] = [
    { header: "Date", value: (row) => row.created_at },
    {
      header: "Item",
      value: (row) =>
        state.inventory.find((item) => item.id === row.item_id)?.name ??
        `Item ${row.item_id}`,
    },
    {
      header: "Job",
      value: (row) =>
        state.jobs.find((view) => view.job.id === row.job_card_id)?.job
          .job_no ?? "General stock",
    },
    { header: "Direction", value: (row) => row.direction },
    { header: "Quantity", value: (row) => row.qty },
    { header: "Note", value: (row) => row.note },
  ];
  return (
    <div className="desk-panel store-list-page" role="tabpanel">
      <div className="store-filter-grid stock-filter-grid contextual-filter-bar">
        <label className="list-search">
          Quick search
          <input
            aria-label="Search stock movements"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Item, SKU, job or note"
          />
        </label>
        <label>
          Date
          <input
            aria-label="Stock movement date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Month-Year
          <select
            aria-label="Stock movement month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All months</option>
            {movementMonths.map((value) => (
              <option key={value} value={value}>
                {SEARCH_MONTH_YEAR_FORMATTER.format(
                  new Date(`${value}-01T00:00:00Z`),
                )}
              </option>
            ))}
          </select>
        </label>
        <label>
          Direction
          <select
            aria-label="Stock movement direction"
            value={direction}
            onChange={(event) => {
              setDirection(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All movements</option>
            {Array.from(new Set(uniqueMovements.map((row) => row.direction)))
              .sort()
              .map((value) => (
                <option key={value}>{value}</option>
              ))}
          </select>
        </label>
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={
          <ListExportControls
            report={{
              title: "Stock Movements",
              filters: activeFilterSummary({
                Search: search.trim(),
                Date: date,
                Month: month,
                Direction: direction,
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Stock movement records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {filtered.length ? (
        <div className="table-wrap">
          <table aria-label="Stock movement results">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.header}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.header}>{column.value(row)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="list-empty">
          <h3>No matching movements</h3>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-StoreList

src/App.tsx:8167-8983

~~~tsx
function StoreList({
  kind,
  inventory,
  requests,
  purchases = [],
  purchaseRequests = [],
  onOpenJob,
  onEditStock,
  onRelease,
  onNeedsApproval,
  onReconcile,
  initialSearch,
  initialMonth,
  initialPrimary,
  headerAction,
  filterLayout = "default",
}: {
  kind: StoreListKind;
  inventory: InventoryItem[];
  requests: StoreRequestRow[];
  purchases?: StorePurchaseRow[];
  purchaseRequests?: Array<{
    view: JobView;
    purchaseRequest: MaterialPurchaseRequest;
  }>;
  onOpenJob: (id: number) => void;
  onEditStock?: (item: InventoryItem) => void;
  onRelease?: (row: StoreRequestRow) => void;
  onNeedsApproval?: (row: StoreRequestRow) => void;
  onReconcile?: (row: StoreRequestRow) => void;
  initialSearch?: string;
  initialMonth?: string;
  initialPrimary?: string;
  headerAction?: ReactNode;
  filterLayout?: "default" | "search";
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const deferredSearch = useDeferredValue(search);
  const [primary, setPrimary] = useState(initialPrimary ?? "ALL");
  const [job, setJob] = useState("ALL");
  const [item, setItem] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [recordDate, setRecordDate] = useState(() =>
    initialMonth ? "" : localCalendarDate(),
  );
  const [recordMonth, setRecordMonth] = useState(initialMonth ?? "");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(deferredSearch);
  const isMaterialRecordList = kind === "requests" || kind === "issue";
  const clearFilters = () => {
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
  };
  const title =
    kind === "stock"
      ? "Stock"
      : kind === "requests"
        ? "Material Requests"
        : kind === "issue"
          ? "Issue Material"
          : "Reconcile";

  const stockRows = useMemo(
    () =>
      inventory.filter((row) => {
        const stockState = row.stock_qty < row.low_stock_qty ? "LOW" : "OK";
        return (
          (!needle ||
            normalizeSearch(
              `${row.sku} ${row.name} ${row.category} ${row.unit}`,
            ).includes(needle)) &&
          (primary === "ALL" || row.category === primary) &&
          (job === "ALL" || stockState === job) &&
          (unit === "ALL" || row.unit === unit)
        );
      }),
    [inventory, needle, primary, job, unit],
  );

  const history = kind === "requests" ? [...requests, ...purchases] : requests;
  const matchesRecordDate = (createdAt?: string) =>
    !isMaterialRecordList ||
    ((!recordDate || createdAt?.slice(0, 10) === recordDate) &&
      (!recordMonth || createdAt?.slice(0, 7) === recordMonth));
  const filteredPurchaseRequests = useMemo(
    () =>
      purchaseRequests.filter(
        ({ view, purchaseRequest }) =>
          (isMaterialRecordList ||
            !needle ||
            normalizeSearch(
              `${view.job.job_no} ${view.vehicle.number} ${view.customer.name} ${view.customer.mobile} ${purchaseRequest.item_name} ${purchaseRequest.status}`,
            ).includes(needle)) &&
          (primary === "ALL" ||
            primary === "New item request" ||
            primary === purchaseRequest.status) &&
          (isMaterialRecordList ||
            job === "ALL" ||
            String(view.job.id) === job) &&
          matchesRecordDate(purchaseRequest.created_at),
      ),
    [
      purchaseRequests,
      needle,
      primary,
      job,
      recordDate,
      recordMonth,
      isMaterialRecordList,
    ],
  );
  const requestRows = useMemo(
    () =>
      history.filter((row) => {
        if (isLocalPurchase(row))
          return (
            (isMaterialRecordList ||
              !needle ||
              normalizeSearch(
                `${row.view.job.job_no} ${row.view.vehicle.number} ${row.view.customer.name} ${row.view.customer.mobile} ${row.purchase.item_description} ${row.purchase.vendor} ${row.purchase.bill_reference}`,
              ).includes(needle)) &&
            (primary === "ALL" || primary === "Local purchase") &&
            (isMaterialRecordList ||
              job === "ALL" ||
              String(row.view.job.id) === job) &&
            item === "ALL" &&
            matchesRecordDate(row.purchase.created_at)
          );
        const state =
          kind === "reconcile" ? reconciliationState(row) : requestState(row);
        return (
          (isMaterialRecordList ||
            !needle ||
            normalizeSearch(
              `${row.view.job.job_no} ${row.view.vehicle.number} ${row.view.customer.name} ${row.view.customer.mobile} ${row.item?.sku ?? ""} ${row.item?.name ?? ""}`,
            ).includes(needle)) &&
          (primary === "ALL" || state === primary) &&
          (isMaterialRecordList ||
            job === "ALL" ||
            String(row.view.job.id) === job) &&
          (item === "ALL" || String(row.request.item_id) === item) &&
          matchesRecordDate(row.request.created_at)
        );
      }),
    [
      history,
      kind,
      needle,
      primary,
      job,
      item,
      recordDate,
      recordMonth,
      isMaterialRecordList,
    ],
  );

  const filtered: Array<InventoryItem | StoreHistoryRow> =
    kind === "stock" ? stockRows : requestRows;
  const paged = paginate<InventoryItem | StoreHistoryRow>(
    filtered,
    page,
    pageSize,
  );
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);
  const categories = Array.from(
    new Set(inventory.map((row) => row.category)),
  ).sort();
  const units = Array.from(new Set(inventory.map((row) => row.unit))).sort();
  const uniqueJobs = Array.from(
    new Map(history.map((row) => [row.view.job.id, row.view])).values(),
  );
  const activeFilters = activeFilterSummary(
    kind === "stock"
      ? {
          Search: search.trim(),
          Category: primary,
          "Stock status":
            job === "LOW" ? "Low stock" : job === "OK" ? "In stock" : "ALL",
          Unit: unit,
        }
      : isMaterialRecordList
        ? {
            "Record date": recordDate,
            "Month-Year": recordMonth || "ALL",
            Status: primary,
            Item:
              item === "ALL"
                ? "ALL"
                : (inventory.find((row) => String(row.id) === item)?.name ??
                  item),
          }
        : {
            Search: search.trim(),
            "Reconciliation state": primary,
            Job:
              job === "ALL"
                ? "ALL"
                : (uniqueJobs.find((row) => String(row.job.id) === job)?.job
                    .job_no ?? job),
            Item:
              item === "ALL"
                ? "ALL"
                : (inventory.find((row) => String(row.id) === item)?.name ??
                  item),
          },
  );

  const stockColumns: ExportColumn<InventoryItem>[] = [
    { header: "SKU", value: (row) => row.sku },
    { header: "Item", value: (row) => row.name },
    { header: "Category", value: (row) => row.category },
    { header: "Stock", value: (row) => row.stock_qty },
    { header: "Unit", value: (row) => row.unit },
    { header: "Minimum", value: (row) => row.low_stock_qty },
    { header: "Sell Price", value: (row) => money(row.selling_price) },
    {
      header: "Status",
      value: (row) =>
        row.stock_qty < row.low_stock_qty ? "Low stock" : "In stock",
    },
  ];
  const stockDisplayColumns: ExportColumn<InventoryItem>[] = [
    { header: "SKU", value: (row) => row.sku },
    { header: "Item", value: (row) => row.name },
    { header: "Category", value: (row) => row.category },
    { header: "Stock", value: (row) => `${row.stock_qty} ${row.unit}` },
    { header: "Minimum", value: (row) => row.low_stock_qty },
    { header: "Sell Price", value: (row) => money(row.selling_price) },
    {
      header: "Status",
      value: (row) =>
        row.stock_qty < row.low_stock_qty ? "Low stock" : "In stock",
    },
  ];
  const requestColumns: ExportColumn<StoreHistoryRow>[] = [
    { header: "Job Card", value: (row) => row.view.job.job_no },
    { header: "Vehicle", value: (row) => row.view.vehicle.number },
    ...(kind === "requests"
      ? [
          {
            header: "Type",
            value: (row: StoreHistoryRow) =>
              isLocalPurchase(row) ? "Local purchase" : "Inventory",
          },
        ]
      : []),
    {
      header: kind === "reconcile" ? "Item / SKU" : "Item",
      value: (row) =>
        isLocalPurchase(row)
          ? row.purchase.item_description
          : kind === "reconcile"
            ? `${row.item?.name ?? "Unknown"} · ${row.item?.sku ?? "No SKU"}`
            : (row.item?.name ?? "Unknown"),
    },
    {
      header: "Requested",
      value: (row) =>
        isLocalPurchase(row)
          ? `${row.purchase.quantity} ${row.purchase.unit}`
          : row.request.requested_qty,
    },
    {
      header: "Issued",
      value: (row) => (isLocalPurchase(row) ? "—" : row.request.issued_qty),
    },
    ...(kind === "reconcile"
      ? [
          {
            header: "Used",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? row.request.used_qty : "—",
          },
          {
            header: "Returned",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? row.request.returned_qty : "—",
          },
          {
            header: "Wasted",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? row.request.wasted_qty : "—",
          },
          {
            header: "Variance",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row)
                ? row.request.issued_qty -
                  row.request.used_qty -
                  row.request.returned_qty -
                  row.request.wasted_qty
                : "—",
          },
          {
            header: "State",
            value: (row: StoreHistoryRow) =>
              !isLocalPurchase(row) ? reconciliationState(row) : "—",
          },
        ]
      : [
          {
            header: "Status",
            value: (row: StoreHistoryRow) =>
              isLocalPurchase(row) ? "Local purchase" : requestState(row),
          },
        ]),
  ];
  const exportReport =
    kind === "stock"
      ? {
          title,
          filters: activeFilters,
          columns: stockColumns,
          rows: stockRows,
        }
      : {
          title,
          filters: activeFilters,
          columns: requestColumns,
          rows: requestRows,
        };

  return (
    <div className="desk-panel store-list-page">
      <div className="store-list-header">
        <PanelTitle
          icon={
            kind === "stock" ? (
              <Boxes />
            ) : kind === "issue" ? (
              <Package />
            ) : kind === "reconcile" ? (
              <Check />
            ) : (
              <PackageCheck />
            )
          }
          title={title}
          subtitle="Search, filter and export the current list"
        />
        {headerAction && (
          <div className="store-list-header-action">{headerAction}</div>
        )}
      </div>
      {kind === "requests" && purchaseRequests.length > 0 && (
        <p className="permission-note">
          {filteredPurchaseRequests.length} new-item purchase request
          {filteredPurchaseRequests.length === 1 ? "" : "s"} match the current
          filters. Use Purchase, Stock & Issue to complete a pending request.
        </p>
      )}
      {kind === "requests" && purchaseRequests.length > 0 && (
        <section
          className="purchase-request-list"
          aria-label="New item purchase requests"
        >
          <h3>New-item purchase requests</h3>
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Trail</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchaseRequests.map(({ view, purchaseRequest }) => (
                <tr
                  key={purchaseRequest.id}
                  className="clickable-row"
                  onClick={() => onOpenJob(view.job.id)}
                >
                  <td>{view.job.job_no}</td>
                  <td>{purchaseRequest.item_name}</td>
                  <td>
                    {purchaseRequest.quantity} {purchaseRequest.unit}
                  </td>
                  <td>{purchaseRequest.status}</td>
                  <td>
                    {purchaseRequest.status === "Completed"
                      ? `Inventory #${purchaseRequest.mapped_inventory_item_id} · issued row #${purchaseRequest.material_request_id}`
                      : "Awaiting purchase"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <div
        className={`${
          kind === "stock"
            ? "store-filter-grid stock-filter-grid"
            : kind === "reconcile"
              ? "store-filter-grid reconcile-filter-grid"
              : isMaterialRecordList
                ? "store-filter-grid material-record-filter-grid"
                : "store-filter-grid"
        }${filterLayout === "search" ? " search-filter-layout search-filter-row" : ""}`}
      >
        {!isMaterialRecordList && (
          <label className="list-search">
            Search
            <input
              aria-label={`Search ${title.toLocaleLowerCase()}`}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={
                kind === "stock"
                  ? "SKU, item, category or unit"
                  : "Job, vehicle or item"
              }
            />
          </label>
        )}
        {kind === "stock" ? (
          <>
            <label>
              Category
              <select
                aria-label="Stock category"
                value={primary}
                onChange={(event) => {
                  setPrimary(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All categories</option>
                {categories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Stock status
              <select
                aria-label="Stock status"
                value={job}
                onChange={(event) => {
                  setJob(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All stock</option>
                <option value="LOW">Low stock</option>
                <option value="OK">In stock</option>
              </select>
            </label>
            <label>
              Unit
              <select
                aria-label="Stock unit"
                value={unit}
                onChange={(event) => {
                  setUnit(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All units</option>
                {units.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            {isMaterialRecordList && (
              <>
                <label>
                  Date
                  <input
                    aria-label={`${title} record date`}
                    type="date"
                    value={recordDate}
                    onChange={(event) => {
                      setRecordDate(event.target.value);
                      setRecordMonth("");
                      setPage(1);
                    }}
                  />
                </label>
                <label>
                  Month-Year
                  <select
                    aria-label={`${title} record month`}
                    value={recordMonth}
                    onChange={(event) => {
                      setRecordMonth(event.target.value);
                      setRecordDate("");
                      setPage(1);
                    }}
                  >
                    <option value="">All months</option>
                    {Array.from(
                      new Set(
                        [
                          ...history.map((row) =>
                            (isLocalPurchase(row)
                              ? row.purchase.created_at
                              : row.request.created_at
                            )?.slice(0, 7),
                          ),
                          ...purchaseRequests.map(({ purchaseRequest }) =>
                            purchaseRequest.created_at?.slice(0, 7),
                          ),
                        ].filter((value): value is string =>
                          Boolean(value && /^\d{4}-\d{2}$/.test(value)),
                        ),
                      ),
                    )
                      .sort((left, right) => right.localeCompare(left))
                      .map((value) => (
                        <option key={value} value={value}>
                          {SEARCH_MONTH_YEAR_FORMATTER.format(
                            new Date(`${value}-01T00:00:00Z`),
                          )}
                        </option>
                      ))}
                  </select>
                </label>
              </>
            )}
            <label>
              {kind === "reconcile" ? "Reconciliation state" : "Status"}
              <select
                aria-label={
                  kind === "reconcile" ? "Reconciliation state" : "Status"
                }
                value={primary}
                onChange={(event) => {
                  setPrimary(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All states</option>
                {(kind === "reconcile"
                  ? ["Matched", "Open"]
                  : [
                      "Pending",
                      "Partially issued",
                      "Issued",
                      "Reconciled",
                      ...(purchases.length ? ["Local purchase"] : []),
                      ...(purchaseRequests.length
                        ? ["New item request", "Completed"]
                        : []),
                    ]
                ).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            {!isMaterialRecordList && (
              <label>
                Job
                <select
                  aria-label={`${title} job`}
                  value={job}
                  onChange={(event) => {
                    setJob(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All jobs</option>
                  {uniqueJobs.map((row) => (
                    <option key={row.job.id} value={row.job.id}>
                      {row.job.job_no} · {row.vehicle.number} ·{" "}
                      {row.customer.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {isMaterialRecordList ? (
              <label>
                Item
                <InventoryPicker
                  inventory={inventory}
                  value={item === "ALL" ? undefined : Number(item)}
                  onChange={(id) => {
                    setItem(String(id));
                    setPage(1);
                  }}
                  label="Item"
                  allOptionLabel="All items"
                  onSelectAll={() => {
                    setItem("ALL");
                    setPage(1);
                  }}
                />
              </label>
            ) : (
              <label>
                Item
                <select
                  aria-label={`${title} item`}
                  value={item}
                  onChange={(event) => {
                    setItem(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All items</option>
                  {inventory.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </>
        )}
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={<ListExportControls report={exportReport} />}
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel={`${title} records per page`}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount === 0 ? (
        <div className="list-empty">
          <h3>No matching records</h3>
          <p>Adjust the search or clear the filters.</p>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      ) : (
        <div className="table-wrap">
          <table
            className={
              isMaterialRecordList ? "store-material-record-table" : undefined
            }
            aria-label={`${title} results`}
          >
            <thead>
              <tr>
                {(kind === "stock" ? stockDisplayColumns : requestColumns).map(
                  (column) => (
                    <th key={column.header}>{column.header}</th>
                  ),
                )}
                {kind === "stock" && onEditStock && <th>Action</th>}
                {(kind === "issue" || kind === "reconcile") && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {kind === "stock"
                ? (paged.items as InventoryItem[]).map((row) => (
                    <tr key={row.id}>
                      {stockDisplayColumns.map((column) => (
                        <td key={column.header}>{column.value(row)}</td>
                      ))}
                      {onEditStock && (
                        <td>
                          <button
                            type="button"
                            className="secondary-action"
                            onClick={() => onEditStock(row)}
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                : (paged.items as StoreHistoryRow[]).map((row) => {
                    const status =
                      kind === "reconcile" && !isLocalPurchase(row)
                        ? reconciliationState(row)
                        : isLocalPurchase(row)
                          ? "Local purchase"
                          : requestState(row);
                    return (
                      <tr
                        key={
                          isLocalPurchase(row)
                            ? `purchase-${row.purchase.id}`
                            : `request-${row.request.id}`
                        }
                        className="clickable-row"
                        onClick={() => onOpenJob(row.view.job.id)}
                      >
                        {requestColumns.map((column) => (
                          <td
                            key={column.header}
                            className={
                              column.header === "Status" ||
                              column.header === "State"
                                ? `store-material-status-cell store-material-status-cell-${storeMaterialStatusClass(status)}`
                                : undefined
                            }
                          >
                            {column.header === "Job Card" ? (
                              <button
                                type="button"
                                className="link-action"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpenJob(row.view.job.id);
                                }}
                              >
                                {String(column.value(row))}
                              </button>
                            ) : column.header === "Status" ||
                              column.header === "State" ? (
                              <span
                                className={`store-material-status store-material-status-${storeMaterialStatusClass(status)}`}
                              >
                                {status}
                              </span>
                            ) : (
                              column.value(row)
                            )}
                          </td>
                        ))}
                        {(kind === "issue" || kind === "reconcile") && (
                          <td
                            className={
                              kind === "issue"
                                ? "store-material-action-cell"
                                : undefined
                            }
                          >
                            {!isLocalPurchase(row) && (
                              <div className="grid-actions store-material-actions">
                                {kind === "issue" && onRelease && (
                                  <button
                                    type="button"
                                    className="workflow-action action-primary"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onRelease(row);
                                    }}
                                  >
                                    <Package size={15} />
                                    Issue Material
                                  </button>
                                )}
                                {kind === "issue" &&
                                  onNeedsApproval &&
                                  ["Requested", "Re-requested"].includes(
                                    row.request.status ?? "Requested",
                                  ) &&
                                  !row.request.invoiced_in && (
                                    <button
                                      type="button"
                                      className="workflow-action action-secondary"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onNeedsApproval(row);
                                      }}
                                    >
                                      <ShieldCheck size={15} />
                                      Needs Approval
                                    </button>
                                  )}
                                {kind === "reconcile" && onReconcile && (
                                  <button
                                    type="button"
                                    className="store-material-action"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onReconcile(row);
                                    }}
                                  >
                                    {reconciliationState(row) === "Matched"
                                      ? "Edit Reconciliation"
                                      : "Reconcile"}
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-Technician

src/App.tsx:8985-9088

~~~tsx
function Technician({
  activeMenuItem,
  state,
  mutate,
  setSelectedJobId,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
}) {
  const taskJobs = state.jobs.filter(
    (view) => view.job.main_status === "IN_PROGRESS",
  );
  const statuses: TaskStatus[] = ["Started", "Paused", "Completed"];
  return (
    <section className="workspace tech-board">
      <div className="desk-panel board-heading">
        <PanelTitle
          icon={activeMenuItem === "QC Prep" ? <ShieldCheck /> : <Wrench />}
          title={activeMenuItem}
          subtitle="Assigned work, progress state and QC handoff"
        />
      </div>
      {taskJobs.map((view) => (
        <div
          className="desk-panel task-column"
          key={view.job.id}
          onFocus={() => setSelectedJobId(view.job.id)}
        >
          <PanelTitle
            icon={<Wrench />}
            title={view.vehicle.number}
            subtitle={view.job.job_no}
          />
          {view.tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.notes}</p>
              <Info label="Started" value={task.started_at || "Not started"} />
              <Info label="Paused" value={task.paused_at || "Not paused"} />
              <Info
                label="Completed"
                value={task.completed_at || "Not completed"}
              />
              <Status status={view.job.main_status} sub={view.job.sub_status} />
              <label>
                Work notes
                <input
                  defaultValue={task.notes}
                  onBlur={(event) =>
                    mutate((db) =>
                      updateTask(db, task.id, task.status, event.target.value),
                    )
                  }
                />
              </label>
              <div className="segmented">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={task.status === status ? "active" : ""}
                    onClick={() =>
                      mutate((db) =>
                        updateTask(
                          db,
                          task.id,
                          status,
                          `${status} from technician board`,
                        ),
                      )
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    archiveTask(db, task.id, "Removed from technician board"),
                  )
                }
              >
                Archive Task
              </button>
            </div>
          ))}
          <TaskCreator view={view} users={state.users} mutate={mutate} />
          {activeMenuItem === "QC Prep" && (
            <QcEditor
              view={view}
              technicianId={
                state.users.find((item) => item.role === "tech")?.id ?? 6
              }
              mutate={mutate}
            />
          )}
        </div>
      ))}
    </section>
  );
}
~~~

## CMP-App-Accounts

src/App.tsx:9090-9125

~~~tsx
function Accounts({
  activeMenuItem,
  state,
  view,
  mutate,
  setSelectedJobId,
  actor,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  view?: JobView;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  actor: User;
}) {
  if (activeMenuItem === "Ready To Invoice") {
    return (
      <BillingManager
        mode="Invoices"
        state={state}
        actor={actor}
        mutate={mutate}
        pendingInvoicesOnly
      />
    );
  }
  const mode: BillingMode =
    activeMenuItem === "Payment"
      ? "Payments"
      : activeMenuItem === "Delivery"
        ? "Delivery"
        : "Invoices";
  return (
    <BillingManager mode={mode} state={state} actor={actor} mutate={mutate} />
  );
}
~~~

## CMP-App-MaterialApprovalQueue

src/App.tsx:9127-9312

~~~tsx
function MaterialApprovalQueue({
  state,
  actor,
  mutate,
  setSelectedJobId,
  initialMonth,
}: {
  state: WorkshopState;
  actor: User;
  mutate: Mutate;
  setSelectedJobId: (id: number) => void;
  initialMonth?: string;
}) {
  const pending = state.jobs.filter(
    (view) =>
      view.material_approval?.status === "Pending" &&
      (!initialMonth ||
        view.material_approval?.submitted_at?.slice(0, 7) === initialMonth),
  );
  const [reviewing, setReviewing] = useState<JobView>();
  const [viewing, setViewing] = useState<JobView>();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const decide = (decision: "Approved" | "Rejected") => {
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
  };
  return (
    <section className="workspace single-panel">
      <div className="desk-panel">
        <PanelTitle
          icon={<ShieldCheck />}
          title="Approvals"
          subtitle={`${pending.length} pending job-level material approval${pending.length === 1 ? "" : "s"}`}
        />
        {pending.length ? (
          <div className="table-wrap">
            <table aria-label="Pending material approvals">
              <thead>
                <tr>
                  <th>Job Card</th>
                  <th>Vehicle / Customer</th>
                  <th>Store user</th>
                  <th>Submitted</th>
                  <th>Job status</th>
                  <th>Outstanding materials</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((view) => {
                  const approval = view.material_approval!;
                  const requester =
                    state.users.find(
                      (user) => user.id === approval.submitted_by,
                    )?.name ?? "Store";
                  const materials = view.material_requests
                    .filter((row) =>
                      ["Requested", "Re-requested"].includes(
                        row.status ?? "Requested",
                      ),
                    )
                    .map(
                      (row) =>
                        `${state.inventory.find((item) => item.id === row.item_id)?.name ?? `Item ${row.item_id}`} × ${row.requested_qty}`,
                    )
                    .join(", ");
                  return (
                    <tr key={approval.id}>
                      <td>
                        <button
                          className="link-action"
                          onClick={() => {
                            setSelectedJobId(view.job.id);
                            setViewing(view);
                          }}
                        >
                          {view.job.job_no}
                        </button>
                      </td>
                      <td>
                        {view.vehicle.number} · {view.customer.name}
                      </td>
                      <td>{requester}</td>
                      <td>{formatTimestamp(approval.submitted_at)}</td>
                      <td>
                        <Status
                          status={view.job.main_status}
                          sub={view.job.sub_status}
                        />
                      </td>
                      <td>{materials || "No outstanding rows"}</td>
                      <td>
                        <button
                          className="primary-action"
                          onClick={() => setReviewing(view)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="list-empty">
            <h3>No pending approvals</h3>
            <p>Store material approval requests will appear here.</p>
          </div>
        )}
      </div>
      {viewing && (
        <JobRecordDialog
          view={viewing}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="view"
          onClose={() => setViewing(undefined)}
        />
      )}
      {reviewing && (
        <Dialog
          title="Review material approval"
          subtitle={`${reviewing.job.job_no} · decision controls`}
          onClose={() => setReviewing(undefined)}
          footer={
            <>
              <button
                type="button"
                className="secondary-action"
                onClick={() => decide("Approved")}
              >
                Approve
              </button>
              <button
                type="button"
                className="danger-action"
                onClick={() => decide("Rejected")}
              >
                Reject
              </button>
            </>
          }
        >
          <p>
            Approve restores the retained requested rows for Store issue. Reject
            keeps the job on HOLD for the linked Service Advisor to correct.
          </p>
          <label>
            Rejection reason
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              placeholder="Required when rejecting"
            />
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
        </Dialog>
      )}
    </section>
  );
}
~~~

## CMP-App-Admin

src/App.tsx:9314-9442

~~~tsx
function Admin({
  activeMenuItem,
  state,
  selected,
  mutate,
  setSelectedJobId,
  user,
  cognitoConfig,
  onNavigate,
  onDashboardNavigate,
  dashboardDrilldown,
  onThemeSaved,
  onAdminStateSaved,
}: {
  activeMenuItem: string;
  state: WorkshopState;
  selected?: JobView;
  mutate: Mutate;
  setSelectedJobId: (value: number) => void;
  user: User;
  cognitoConfig?: CognitoConfig;
  onNavigate: (label: string) => void;
  onDashboardNavigate: (drilldown: DashboardDrilldown) => void;
  dashboardDrilldown?: DashboardDrilldown;
  onThemeSaved: (theme: AppTheme) => void;
  onAdminStateSaved: () => void;
}) {
  if (activeMenuItem === "Advance Bookings") {
    return (
      <BookingOperations
        state={state}
        actor={user}
        mutate={mutate}
        onCheckedIn={(jobId) => setSelectedJobId(jobId)}
      />
    );
  }
  if (activeMenuItem === "Data Flow") {
    return <DataFlowWorkspace jobs={state.jobs} users={state.users} />;
  }
  if (activeMenuItem === "Approvals")
    return (
      <MaterialApprovalQueue
        state={state}
        actor={user}
        mutate={mutate}
        setSelectedJobId={setSelectedJobId}
        initialMonth={dashboardDrilldown?.month}
      />
    );
  if (activeMenuItem === "Job Cards") {
    return (
      <section className="workspace two-panel">
        <div className="desk-panel">
          <PanelTitle
            icon={<FileText />}
            title="Job Cards"
            subtitle="Linked operational records"
          />
          <FilterableJobRows
            title="Job Cards"
            jobs={state.jobs}
            selectedJobId={selected?.job.id}
            onSelect={setSelectedJobId}
            showStatusFilter
          />
        </div>
        <div className="desk-panel">
          <PanelTitle
            icon={<FileText />}
            title="Admin Job Detail"
            subtitle={selected?.job.job_no ?? "Select a job"}
          />
          {selected && (
            <>
              <AdminJobEditor
                key={selected.job.id}
                view={selected}
                users={state.users}
                mutate={mutate}
                actor={user}
              />
              <LinkedRecords view={selected} />
              <button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    cancelJobCard(db, selected.job.id, "Cancelled by admin"),
                  )
                }
              >
                Archive Job
              </button>
            </>
          )}
        </div>
      </section>
    );
  }
  if (activeMenuItem === "Manage") {
    return (
      <>
        <ManagementHub
          state={state}
          mutate={mutate}
          actingUser={user}
          selected={selected}
          setSelectedJobId={setSelectedJobId}
          cognitoConfig={cognitoConfig}
        />
      </>
    );
  }
  if (activeMenuItem === "Admin Console") {
    return (
      <AdminConsole
        state={state}
        mutate={mutate}
        actingUser={user}
        cognitoConfig={cognitoConfig}
        onThemeSaved={onThemeSaved}
        onStateSaved={onAdminStateSaved}
      />
    );
  }
  return (
    <OperationalDashboard state={state} onNavigate={onDashboardNavigate} />
  );
}
~~~

## CMP-App-OperationalDashboard

src/App.tsx:9461-9848

~~~tsx
function OperationalDashboard({
  state,
  onNavigate,
}: {
  state: WorkshopState;
  onNavigate: (drilldown: DashboardDrilldown) => void;
}) {
  const today = localCalendarDate();
  const currentMonth = today.slice(0, 7);
  const [cashflowMonth, setCashflowMonth] = useState(currentMonth);
  const cashflowMonths = useMemo(
    () =>
      [
        ...new Set([
          currentMonth,
          ...state.jobs
            .flatMap((view) => view.payments)
            .filter((payment) => !payment.voided_at)
            .map((payment) => payment.created_at?.slice(0, 7) ?? "")
            .filter((month) => /^\d{4}-\d{2}$/.test(month)),
        ]),
      ].sort((left, right) => right.localeCompare(left)),
    [currentMonth, state.jobs],
  );
  const facts = dashboardFacts(
    state.jobs,
    state.inventory,
    today,
    cashflowMonth,
  );
  const dateLabel = new Date(`${today}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const collectionPace = facts.cashflowMonthComplete
    ? 100
    : facts.daysInMonth
      ? Math.round((facts.daysElapsed / facts.daysInMonth) * 100)
      : 0;
  const cards: DashboardCard[] = [
    {
      title: "Workshop flow",
      subtitle: "All job-card history",
      tone: "flow",
      action: "View active jobs",
      drilldown: { destination: "Job Cards", status: "ACTIVE" },
      metrics: [
        {
          label: "Active today",
          value: facts.activeToday,
          tone: "active",
          layout: "primary",
          drilldown: { destination: "Job Cards", status: "ACTIVE" },
        },
        {
          label: "Total visits",
          value: facts.totalVisits,
          tone: "received",
          layout: "secondary",
          drilldown: { destination: "Job Cards" },
        },
        {
          label: "In progress",
          value: facts.inProgress,
          tone: "progress",
          drilldown: { destination: "Job Cards", status: "IN_PROGRESS" },
        },
        {
          label: "Closed",
          value: facts.closed,
          tone: "closed",
          drilldown: { destination: "Job Cards", status: "CLOSED" },
        },
        {
          label: "On hold",
          value: facts.onHold,
          tone: "hold",
          drilldown: { destination: "Job Cards", status: "HOLD" },
        },
      ],
    },
    {
      title: "Cashflow",
      subtitle: `${facts.cashflowMonthLabel} ${facts.cashflowMonthComplete ? "collection complete" : "collection runway"}`,
      tone: "cashflow",
      action: "View collections",
      drilldown: {
        destination: "Search",
        month: cashflowMonth,
        category: "payment" as const,
      },
      metrics: [
        {
          label: facts.cashflowMonthComplete
            ? "Final collection"
            : "Total collections",
          value: money(facts.totalCollections),
          tone: "collections",
          layout: "primary",
          drilldown: {
            destination: "Search",
            month: cashflowMonth,
            category: "payment" as const,
          },
        },
        ...(facts.cashflowMonthComplete
          ? []
          : [
              {
                label: "Projected monthly collection",
                value: money(facts.projectedMonthlyCollection),
                tone: "projection",
                layout: "projection" as const,
                context: `${facts.daysElapsed} of ${facts.daysInMonth} calendar days elapsed`,
                drilldown: {
                  destination: "Search",
                  month: cashflowMonth,
                  category: "payment" as const,
                },
              },
            ]),
        {
          label: "Payments received",
          value: facts.paymentsReceived,
          tone: "payments",
          layout: "supporting",
          drilldown: {
            destination: "Search",
            month: cashflowMonth,
            category: "payment" as const,
          },
        },
        {
          label: "Invoices generated",
          value: facts.invoicesGenerated,
          tone: "invoices",
          layout: "supporting",
          drilldown: {
            destination: "Search",
            month: cashflowMonth,
            category: "invoice" as const,
          },
        },
      ],
    },
    {
      title: "Customer reach",
      subtitle: "All customers and vehicles served",
      tone: "reach",
      action: "View customers served",
      drilldown: { destination: "Search", category: "customer" },
      metrics: [
        {
          label: "Customers served",
          value: facts.customersServed,
          tone: "customers",
          drilldown: { destination: "Customers", served: "customers" },
        },
        {
          label: "Vehicles served",
          value: facts.vehiclesServed,
          tone: "vehicles",
          drilldown: { destination: "Vehicles", served: "vehicles" },
        },
      ],
    },
    {
      title: "Inventory watch",
      subtitle: `${facts.monthLabel} materials attention`,
      tone: "inventory",
      action: "View low-stock blockers",
      drilldown: {
        destination: "Search",
        category: "stock",
        lowStockOnly: true,
      },
      metrics: [
        {
          label: "Low-stock items",
          value: facts.lowStock,
          tone: "low-stock",
          drilldown: { destination: "Stock", stockTab: "Low Stock" },
        },
        {
          label: "Pending approvals",
          value: facts.pendingApprovals,
          tone: "approvals",
          drilldown: { destination: "Approvals", month: currentMonth },
        },
        {
          label: "Material requests",
          value: facts.materialRequests,
          tone: "requests",
          drilldown: { destination: "Material Requests", month: currentMonth },
        },
        {
          label: "Materials issued",
          value: facts.materialsIssued,
          tone: "issued",
          drilldown: {
            destination: "Issue Material",
            month: currentMonth,
            status: "Issued",
          },
        },
      ],
    },
  ];
  return (
    <section
      className="workspace operational-dashboard"
      aria-label="Workshop command center"
    >
      <header className="command-header">
        <div>
          <p className="command-kicker">Workshop command center</p>
          <h1>Operational dashboard</h1>
          <p>Live job flow, customer reach, stock attention and collections.</p>
        </div>
        <div className="command-date" aria-label={`Today: ${dateLabel}`}>
          <CalendarDays size={20} />
          <div>
            <strong>{dateLabel}</strong>
            <span>Real-time overview</span>
          </div>
        </div>
      </header>
      <div className="command-grid">
        {cards.map((card) => {
          const icon =
            card.tone === "flow" ? (
              <Gauge size={21} />
            ) : card.tone === "cashflow" ? (
              <Banknote size={21} />
            ) : card.tone === "reach" ? (
              <UsersRound size={21} />
            ) : (
              <Boxes size={21} />
            );
          return (
            <article
              key={card.title}
              data-dashboard-card={card.tone}
              className={`command-card command-${card.tone}`}
              tabIndex={0}
              onClick={() => onNavigate(card.drilldown)}
              onKeyDown={(event) => {
                if (
                  event.target === event.currentTarget &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  onNavigate(card.drilldown);
                }
              }}
            >
              <div className="command-card-heading">
                <span className="command-icon-tile" aria-hidden="true">
                  {icon}
                </span>
                <div>
                  <h2>{card.title}</h2>
                  <p>{card.subtitle}</p>
                </div>
                {card.tone === "cashflow" && (
                  <label className="cashflow-month">
                    Cashflow month
                    <select
                      aria-label="Cashflow month"
                      value={cashflowMonth}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        event.stopPropagation();
                        setCashflowMonth(event.target.value);
                      }}
                    >
                      {cashflowMonths.map((month) => (
                        <option key={month} value={month}>
                          {SEARCH_MONTH_YEAR_FORMATTER.format(
                            new Date(`${month}-01T00:00:00Z`),
                          )}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              <div
                className={`command-metrics${card.tone === "cashflow" ? " command-cashflow-metrics" : ""}`}
              >
                {card.metrics.map((metric) => (
                  <button
                    type="button"
                    key={metric.label}
                    className={`command-metric metric-${metric.tone}${metric.layout ? ` command-metric-${metric.layout}` : ""}`}
                    aria-label={`Open ${metric.label}: ${metric.value}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onNavigate(metric.drilldown);
                    }}
                  >
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    {metric.context && <small>{metric.context}</small>}
                  </button>
                ))}
              </div>
              {card.tone === "cashflow" &&
                (facts.cashflowMonthComplete ? (
                  <div
                    className="collection-pace collection-complete"
                    aria-label={`${facts.cashflowMonthLabel} collection complete`}
                  >
                    <div className="collection-pace-label">
                      <span>Collection period</span>
                      <strong>Month complete</strong>
                    </div>
                  </div>
                ) : (
                  <div
                    className="collection-pace"
                    aria-label={`${collectionPace}% of calendar month elapsed`}
                  >
                    <div className="collection-pace-label">
                      <span>Collection runway</span>
                      <strong>{collectionPace}% elapsed</strong>
                    </div>
                    <div className="collection-pace-track">
                      <span style={{ width: `${collectionPace}%` }} />
                    </div>
                    <div className="collection-bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                ))}
              {card.tone === "reach" && (
                <svg
                  className="customer-trend"
                  viewBox="0 0 260 62"
                  role="img"
                  aria-label="Decorative customer reach trend"
                >
                  <path
                    d="M2 52C28 48 31 36 53 42S83 51 103 29s33 5 54-8 29-1 46-17 30-1 55-3"
                    fill="none"
                    pathLength="1"
                  />
                  <path d="M2 59H258" />
                </svg>
              )}
              {card.tone === "inventory" && (
                <div className="inventory-signal" aria-hidden="true">
                  <Sparkles size={15} />
                  <span>Attention queue</span>
                  <i />
                  <i />
                  <i />
                </div>
              )}
              <div className="command-card-footer">
                <button
                  type="button"
                  className="command-card-open"
                  aria-label={card.action}
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigate(card.drilldown);
                  }}
                >
                  {card.action} <ChevronRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
~~~

## CMP-App-ManagementHub

src/App.tsx:9863-9998

~~~tsx
function ManagementHub({
  state,
  mutate,
  actingUser,
  selected,
  setSelectedJobId,
  cognitoConfig,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actingUser: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
  cognitoConfig?: CognitoConfig;
}) {
  const [area, setArea] = useState<ManagementArea>("Users");
  const [managedJobId, setManagedJobId] = useState<number>();
  const managedJob = state.jobs.find((view) => view.job.id === managedJobId);
  return (
    <section className="workspace single-panel management-hub">
      <div className="desk-panel">
        <PanelTitle
          icon={<ShieldCheck />}
          title="Management Hub"
          subtitle="Admin master data and workflow controls"
        />
        <div className="demo-dataset-control">
          <div>
            <strong>Large demo dataset</strong>
            <span>
              120 customers, 132 vehicles, 144 jobs and 288 offline media
              records.
            </span>
          </div>
          <button
            className="primary-action"
            onClick={() => {
              if (
                window.confirm(
                  "Load Large Demo Dataset? Current local demo records will be replaced. This cannot be undone from this screen.",
                )
              )
                mutate(loadLargeDemoDataset);
            }}
          >
            Load Large Demo Dataset
          </button>
        </div>
        <div
          className="management-tabs"
          role="tablist"
          aria-label="Management areas"
          onKeyDown={handleTabListKeyDown}
        >
          {managementAreas.map((item) => (
            <button
              id={`management-tab-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
              aria-controls="management-active-panel"
              tabIndex={area === item ? 0 : -1}
              key={item}
              role="tab"
              aria-selected={area === item}
              className={area === item ? "active" : ""}
              onClick={() => setArea(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div
          id="management-active-panel"
          role="tabpanel"
          aria-labelledby={`management-tab-${area.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
        >
          {area === "Estimates" && (
            <JobPicker
              jobs={state.jobs}
              selectedJobId={managedJob?.job.id}
              onSelect={setManagedJobId}
              label={`Job for ${area}`}
            />
          )}
          {area === "Users" && (
            <UserManager
              users={state.users}
              mutate={mutate}
              actingUser={actingUser}
              cognitoConfig={cognitoConfig}
            />
          )}
          {area === "Customers" && (
            <CustomerManager state={state} mutate={mutate} actor={actingUser} />
          )}
          {area === "Vehicles" && (
            <VehicleManager state={state} mutate={mutate} actor={actingUser} />
          )}
          {area === "Suppliers" && (
            <SupplierMasterWorkspace
              state={state}
              actor={actingUser}
              mutate={mutate}
            />
          )}
          {area === "Job Cards" && (
            <VisitJobManager
              state={state}
              mutate={mutate}
              actingUser={actingUser}
              selected={selected}
              setSelectedJobId={setSelectedJobId}
            />
          )}
          {area === "Estimates" && (
            <EstimateManager
              view={managedJob}
              mutate={mutate}
              actor={actingUser}
            />
          )}
          {(area === "Invoices" ||
            area === "Payments" ||
            area === "Delivery") && (
            <BillingManager
              key={area}
              mode={area}
              state={state}
              actor={actingUser}
              mutate={mutate}
              panel={false}
            />
          )}
        </div>
      </div>
    </section>
  );
}
~~~

## CMP-App-CustomerManager

src/App.tsx:10000-10212

~~~tsx
function CustomerManager({
  state,
  mutate,
  actor,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
}) {
  const [archivedOnly, setArchivedOnly] = useState(false);
  const customers = archivedOnly ? state.archived_customers : state.customers;
  const empty: Customer = { id: 0, name: "", mobile: "", type: "Individual" };
  const [draft, setDraft] = useState<Customer>(empty);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{
    customer: Customer;
    mode: "view" | "edit";
  }>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = customers.filter(
    (item) =>
      !needle ||
      normalizeSearch(`${item.name} ${item.mobile} ${item.type}`).includes(
        needle,
      ),
  );
  const paged = paginate(filtered, page, pageSize);
  const vehicleCount = (customer: Customer) =>
    state.vehicles.filter((vehicle) => vehicle.customer_id === customer.id)
      .length;
  const openJobCount = (customer: Customer) =>
    state.jobs.filter(
      (view) =>
        view.customer.id === customer.id && view.job.main_status !== "CLOSED",
    ).length;
  const columns: ExportColumn<Customer>[] = [
    { header: "Customer", value: (row) => row.name },
    { header: "Mobile", value: (row) => row.mobile },
    { header: "Type", value: (row) => row.type },
    { header: "Vehicles", value: vehicleCount },
    { header: "Open Jobs", value: openJobCount },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Customers</h3>
        {!archivedOnly && (
          <button
            className="primary-action"
            onClick={() => {
              setDraft(empty);
              setCreating(true);
            }}
          >
            Add Customer
          </button>
        )}
      </div>
      {creating && (
        <Dialog title="Add Customer" onClose={() => setCreating(false)}>
          <CustomerEditor
            embedded
            value={draft}
            setValue={setDraft}
            mutate={mutate}
            onSaved={() => setCreating(false)}
          />
        </Dialog>
      )}
      {record && (
        <CustomerRecordDialog
          customer={record.customer}
          state={state}
          mutate={mutate}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search customers"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, mobile or type"
          />
        </label>
        {actor.role === "admin" && (
          <Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
        )}
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Customers",
              filters: activeFilterSummary({
                Search: search.trim(),
                "Show archived only": archivedOnly ? "Yes" : "No",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Customer records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap management-table">
          <table aria-label="Customer manager">
            <thead>
              <tr>
                {[
                  "Customer",
                  "Mobile",
                  "Type",
                  "Vehicles",
                  "Open Jobs",
                  "Actions",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.type}</td>
                  <td>{vehicleCount(customer)}</td>
                  <td>{openJobCount(customer)}</td>
                  <td>
                    <RecordActions
                      inGrid
                      onView={() => setRecord({ customer, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ customer, mode: "edit" })
                          : undefined
                      }
                      onArchive={
                        !archivedOnly
                          ? () =>
                              mutate((db) =>
                                archiveCustomer(
                                  db,
                                  customer.id,
                                  "Archived by Admin",
                                ),
                              )
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-VehicleManager

src/App.tsx:10214-10435

~~~tsx
function VehicleManager({
  state,
  mutate,
  actor,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
}) {
  const [archivedOnly, setArchivedOnly] = useState(false);
  const empty: Vehicle = {
    id: 0,
    customer_id: state.customers[0]?.id ?? 0,
    number: "",
    make: "",
    model: "",
    color: "",
    km: 0,
  };
  const [draft, setDraft] = useState<Vehicle>(empty);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ id: number; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const vehicles = archivedOnly ? state.archived_vehicles : state.vehicles;
  const owners = archivedOnly
    ? [...state.customers, ...state.archived_customers]
    : state.customers;
  const filtered = vehicles.filter((item) => {
    const owner =
      owners.find((customer) => customer.id === item.customer_id)?.name ?? "";
    return (
      !needle ||
      normalizeSearch(
        `${item.number} ${item.make} ${item.model} ${owner}`,
      ).includes(needle)
    );
  });
  const paged = paginate(filtered, page, pageSize);
  const ownerName = (vehicle: Vehicle) =>
    owners.find((customer) => customer.id === vehicle.customer_id)?.name ?? "—";
  const columns: ExportColumn<Vehicle>[] = [
    { header: "Registration", value: (row) => row.number },
    { header: "Make / Model", value: (row) => `${row.make} ${row.model}` },
    { header: "Color", value: (row) => row.color },
    { header: "Customer", value: ownerName },
    { header: "KM", value: (row) => row.km },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Vehicles</h3>
        {!archivedOnly && (
          <button
            className="primary-action"
            onClick={() => {
              setDraft(empty);
              setCreating(true);
            }}
          >
            Add Vehicle
          </button>
        )}
      </div>
      {creating && (
        <Dialog title="Add Vehicle" onClose={() => setCreating(false)}>
          <VehicleMasterPanel
            embedded
            key={draft.id}
            state={state}
            value={draft}
            setValue={setDraft}
            mutate={mutate}
            onSaved={() => setCreating(false)}
          />
        </Dialog>
      )}
      {record && (
        <VehicleRecordDialog
          vehicle={vehicles.find((vehicle) => vehicle.id === record.id)!}
          state={state}
          mutate={mutate}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search vehicles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Registration, make, model or customer"
          />
        </label>
        {actor.role === "admin" && (
          <Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
        )}
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Vehicles",
              filters: activeFilterSummary({
                Search: search.trim(),
                "Show archived only": archivedOnly ? "Yes" : "No",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Vehicle records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap management-table">
          <table aria-label="Vehicle manager">
            <thead>
              <tr>
                {[
                  "Registration",
                  "Make / Model",
                  "Color",
                  "Customer",
                  "KM",
                  "Actions",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.number}</td>
                  <td>
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td>{vehicle.color}</td>
                  <td>{ownerName(vehicle)}</td>
                  <td>{vehicle.km.toLocaleString("en-IN")}</td>
                  <td>
                    <RecordActions
                      inGrid
                      onView={() => setRecord({ id: vehicle.id, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ id: vehicle.id, mode: "edit" })
                          : undefined
                      }
                      onArchive={
                        !archivedOnly
                          ? () =>
                              mutate((db) =>
                                archiveVehicle(
                                  db,
                                  vehicle.id,
                                  "Archived by Admin",
                                ),
                              )
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-VisitJobManager

src/App.tsx:10437-10708

~~~tsx
function VisitJobManager({
  state,
  mutate,
  actingUser,
  selected,
  setSelectedJobId,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actingUser: User;
  selected?: JobView;
  setSelectedJobId: (id: number) => void;
}) {
  const today = useLocalDeliveryDate();
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<{ id: number; mode: "view" | "edit" }>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryMonth, setDeliveryMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const jobs = archivedOnly ? state.archived_jobs : state.jobs;
  const filtered = jobs.filter(
    (row) =>
      (!needle ||
        normalizeSearch(
          `${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`,
        ).includes(needle)) &&
      (status === "ALL" || row.job.main_status === status) &&
      (!deliveryDate || row.job.estimated_delivery === deliveryDate) &&
      (deliveryDate ||
        !deliveryMonth ||
        row.job.estimated_delivery?.slice(0, 7) === deliveryMonth),
  );
  const paged = paginate(filtered, page, pageSize);
  const columns: ExportColumn<JobView>[] = [
    { header: "Job Card", value: (row) => row.job.job_no },
    { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name },
    {
      header: "Estimated Delivery Date",
      value: (row) => row.job.estimated_delivery || "—",
    },
    { header: "Status", value: (row) => row.job.main_status },
  ];
  const dialogJob = record
    ? jobs.find((row) => row.job.id === record.id)
    : undefined;
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Job Cards</h3>
        {!archivedOnly && (
          <button className="add-action" onClick={() => setCreating(true)}>
            <Plus size={17} />
            Add Job Card
          </button>
        )}
      </div>
      {creating && (
        <AddJobCardDialog
          state={state}
          mutate={mutate}
          actor={actingUser}
          onClose={() => setCreating(false)}
        />
      )}
      {dialogJob && (
        <JobRecordDialog
          view={dialogJob}
          state={state}
          mutate={mutate}
          actor={actingUser}
          mode={archivedOnly ? "view" : (record?.mode ?? "view")}
          historical={archivedOnly}
          onClose={() => setRecord(undefined)}
          onAdminArchive={
            !archivedOnly
              ? () =>
                  mutate((db) =>
                    cancelJobCard(
                      db,
                      dialogJob.job.id,
                      "Admin override: archived from Management Hub",
                    ),
                  )
              : undefined
          }
        />
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search job cards"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job card, vehicle or customer"
          />
        </label>
        <label>
          Status
          <select
            aria-label="Job status filter"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map(
              (value) => (
                <option key={value}>{value}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Estimated Delivery Date
          <input
            aria-label="Estimated delivery date"
            type="date"
            value={deliveryDate}
            onChange={(event) => {
              setDeliveryDate(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Estimated Delivery Month
          <input
            aria-label="Estimated delivery month"
            type="month"
            value={deliveryMonth}
            onChange={(event) => {
              setDeliveryMonth(event.target.value);
              setPage(1);
            }}
          />
        </label>
        {actingUser.role === "admin" && (
          <Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
        )}
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setStatus("ALL");
            setDeliveryDate("");
            setDeliveryMonth("");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Job Cards",
              filters: activeFilterSummary({
                Search: search.trim(),
                Status: status,
                "Estimated Delivery Date": deliveryDate,
                "Estimated Delivery Month": deliveryDate ? "" : deliveryMonth,
                "Show archived only": archivedOnly ? "Yes" : "No",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Job card records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap manage-job-table">
          <table aria-label="Managed job cards">
            <thead>
              <tr>
                {[
                  "Job Card",
                  "Vehicle",
                  "Customer",
                  "Estimated Delivery Date",
                  "Status",
                  "Actions",
                ].map(
                  (header) => (
                    <th key={header}>{header}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((row) => (
                <tr key={row.job.id} className={jobDeliveryClass(row.job, today)}>
                  <td>{row.job.job_no}</td>
                  <td>
                    {row.vehicle.number} · {row.vehicle.make}{" "}
                    {row.vehicle.model}
                  </td>
                  <td>{row.customer.name}</td>
                  <td>{row.job.estimated_delivery || "—"}</td>
                  <td>
                    <Status
                      status={row.job.main_status}
                      sub={row.job.sub_status}
                    />
                  </td>
                  <td>
                    <RecordActions
                      inGrid
                      onView={() => setRecord({ id: row.job.id, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ id: row.job.id, mode: "edit" })
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setStatus("ALL");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-EstimateManager

src/App.tsx:10710-10731

~~~tsx
function EstimateManager({
  view,
  mutate,
  actor,
}: {
  view?: JobView;
  mutate: Mutate;
  actor: User;
}) {
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Estimates</h3>
      </div>
      {view ? (
        <EstimateEditor view={view} mutate={mutate} actor={actor} />
      ) : (
        <p className="empty-state">Select a job first.</p>
      )}
    </div>
  );
}
~~~

## CMP-App-TaskQcManager

src/App.tsx:10733-10780

~~~tsx
function TaskQcManager({
  view,
  users,
  mutate,
}: {
  view?: JobView;
  users: User[];
  mutate: Mutate;
}) {
  const [addingTask, setAddingTask] = useState(false);
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Tasks / QC</h3>
        <div className="action-row">
          <button
            className="primary-action"
            disabled={!view}
            onClick={() => setAddingTask(true)}
          >
            Add Task
          </button>
          <span className="override-badge">Admin override controls</span>
        </div>
      </div>
      {addingTask && view && (
        <Dialog title="Add Task" onClose={() => setAddingTask(false)}>
          <TaskCreator
            embedded
            view={view}
            users={users}
            mutate={mutate}
            onCreated={() => setAddingTask(false)}
          />
        </Dialog>
      )}
      {view ? (
        <QcEditor
          view={view}
          technicianId={view.job.technician_id}
          mutate={mutate}
        />
      ) : (
        <p className="empty-state">Select a job first.</p>
      )}
    </div>
  );
}
~~~

## CMP-App-InventoryMaterialsManager

src/App.tsx:10782-10899

~~~tsx
function InventoryMaterialsManager({
  state,
  mutate,
}: {
  state: WorkshopState;
  mutate: Mutate;
}) {
  const [addingItem, setAddingItem] = useState(false);
  const [addingRequest, setAddingRequest] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filtered = state.inventory.filter(
    (item) =>
      !needle ||
      normalizeSearch(
        `${item.sku} ${item.name} ${item.category} ${item.unit}`,
      ).includes(needle),
  );
  const paged = paginate(filtered, page, pageSize);
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Inventory / Materials</h3>
        <div className="action-row">
          <button
            className="primary-action"
            onClick={() => setAddingItem(true)}
          >
            Add / Edit Inventory Item
          </button>
          <button
            className="primary-action"
            onClick={() => setAddingRequest(true)}
          >
            Add / Edit Material Request
          </button>
        </div>
      </div>
      {addingItem && (
        <Dialog
          title="Inventory Item"
          subtitle="Master, stock-in and adjustment"
          onClose={() => setAddingItem(false)}
        >
          <InventoryEditor embedded state={state} mutate={mutate} />
        </Dialog>
      )}
      {addingRequest && (
        <Dialog
          title="Material Request"
          subtitle="Job-linked material request"
          onClose={() => setAddingRequest(false)}
        >
          <MaterialRequestEditor embedded state={state} mutate={mutate} />
        </Dialog>
      )}
      <div className="store-filter-grid">
        <label className="list-search">
          Search
          <input
            aria-label="Search inventory / materials"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="SKU, name, category or unit"
          />
        </label>
        <ListSearchActions onClear={clearSearch} />
      </div>
      <PaginationToolbar
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Inventory records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      <div className="record-list">
        {paged.items.map((item) => (
          <div className="managed-record" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <span>
                {item.sku} · {item.category} · Stock {item.stock_qty}{" "}
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton onClick={clearSearch} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-UserManager

src/App.tsx:10901-11221

~~~tsx
export function UserManager({
  users,
  mutate,
  actingUser,
  cognitoConfig,
  managerDepartments = {},
}: {
  users: User[];
  mutate: Mutate;
  actingUser: User;
  cognitoConfig?: CognitoConfig;
  managerDepartments?: Record<number, string[]>;
}) {
  if (cognitoConfig)
    return (
      <RemoteUserManager
        config={cognitoConfig}
        actorId={actingUser.externalId}
      />
    );
  const empty: User = {
    id: 0,
    name: "",
    email: "",
    role: "service",
    password: "",
  };
  const [draft, setDraft] = useState<User>(empty);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  // sql.js only ever returns active (non-archived) users here (readState filters archived_at is null),
  // so "Active" is the only status this session can observe; the filter is kept for the spec's UI
  // shape and to make the (empty) "Archived" branch explicit rather than silently dropping the control.
  const filtered = users.filter(
    (item) =>
      (!needle ||
        normalizeSearch(
          `${item.name} ${item.email} ${roleLabels[item.role]}`,
        ).includes(needle)) &&
      (roleFilter === "ALL" || item.role === roleFilter) &&
      (statusFilter === "ALL" || statusFilter === "ACTIVE"),
  );
  const paged = paginate(filtered, page, pageSize);
  const userColumns: ExportColumn<User>[] = [
    { header: "Name", value: (item) => item.name },
    { header: "Email", value: (item) => item.email },
    { header: "Role", value: (item) => roleLabels[item.role] },
    { header: "Status", value: () => "Active" },
  ];
  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <h3>Users</h3>
        <button
          className="primary-action"
          onClick={() => {
            setDraft(empty);
            setEditing(true);
          }}
        >
          Add User
        </button>
      </div>
      {editing && (
        <Dialog
          title={draft.id ? "Edit User" : "Add User"}
          onClose={() => setEditing(false)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                mutate((db) =>
                  draft.id
                    ? updateUser(db, draft.id, draft)
                    : createUser(db, draft),
                )
              )
                setEditing(false);
            }}
          >
            <div className="form-grid">
              <label>
                User name
                <input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <label>
                User email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft({ ...draft, email: event.target.value })
                  }
                />
              </label>
              <label>
                User role
                <select
                  value={draft.role}
                  onChange={(event) =>
                    setDraft({ ...draft, role: event.target.value as Role })
                  }
                >
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <option key={role} value={role}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                User password
                <input
                  required
                  minLength={6}
                  type="password"
                  value={draft.password}
                  onChange={(event) =>
                    setDraft({ ...draft, password: event.target.value })
                  }
                />
              </label>
            </div>
            <div className="action-row">
              <button className="primary-action">Save User</button>
              <button type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}
      <div className="store-filter-grid compact-management-toolbar">
        <label className="list-search">
          Search
          <input
            aria-label="Search users"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email or role"
          />
        </label>
        <label>
          Role
          <select
            aria-label="Filter users by role"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All roles</option>
            {Object.entries(roleLabels).map(([role, label]) => (
              <option key={role} value={role}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            aria-label="Filter users by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <ListSearchActions
          onClear={() => {
            setSearch("");
            setRoleFilter("ALL");
            setStatusFilter("ALL");
            setPage(1);
          }}
        />
      </div>
      <PaginationToolbar
        controls={
          <DownloadMenu
            report={{
              title: "Users",
              filters: activeFilterSummary({
                Search: search.trim(),
                Role:
                  roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role],
                Status: statusFilter,
              }),
              columns: userColumns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="User records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount > 0 && (
        <div className="table-wrap management-table">
          <table aria-label="User manager">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Status", "Actions"].map(
                  (header) => (
                    <th key={header}>{header}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {paged.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="user-name-with-appointments">
                      <span>{item.name}</span>
                      {managerDepartments[item.id]?.map((department) => (
                        <span className="manager-appointment-badge" key={department}>
                          Manager · {department}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{item.email}</td>
                  <td>{roleLabels[item.role]}</td>
                  <td>Active</td>
                  <td>
                    <div className="grid-actions">
                      <button
                        type="button"
                        className="grid-action"
                        onClick={() => {
                          setDraft(item);
                          setEditing(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="grid-action grid-action-danger"
                        disabled={item.id === actingUser.id}
                        title={
                          item.id === actingUser.id
                            ? "You cannot archive your own signed-in account"
                            : undefined
                        }
                        onClick={() =>
                          mutate((db) =>
                            archiveUser(
                              db,
                              item.id,
                              "Archived by Admin",
                              actingUser.id,
                            ),
                          )
                        }
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton
            onClick={() => {
              setSearch("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
              setPage(1);
            }}
            label="Clear filters"
          />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-RemoteUserManager

src/App.tsx:11228-11604

~~~tsx
function RemoteUserManager({
  config,
  actorId,
}: {
  config: CognitoConfig;
  actorId?: string;
}) {
  const [directory, setDirectory] = useState<AdminDirectory>({
    users: [],
    roles: [],
    branches: [],
    serviceDepartments: [],
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RemoteDraft>({
    id: "",
    name: "",
    email: "",
    roleIds: [],
    branchIds: [],
    version: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const needle = normalizeSearch(search);
  const filteredUsers = directory.users.filter(
    (item) =>
      !needle ||
      normalizeSearch(
        `${item.name} ${item.email} ${item.roles.map((role) => role.name).join(" ")} ${item.branches.map((branch) => branch.name).join(" ")} ${item.status}`,
      ).includes(needle),
  );
  const pagedUsers = paginate(filteredUsers, page, pageSize);
  const managerDepartments = (membershipId: string) => directory.serviceDepartments
    .filter((department) => department.managers.some((manager) => manager.membershipId === membershipId))
    .map((department) => department.name);
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const refresh = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      setDirectory(await adminUsersApi.list(config));
      setError("");
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(true), 30_000);
    const onFocus = () => void refresh(true);
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [config]);

  const run = async (action: () => Promise<unknown>, closeEditor = false) => {
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
  };

  const toggle = (kind: "roleIds" | "branchIds", id: string) => {
    const current = draft[kind];
    setDraft({
      ...draft,
      [kind]: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const startNew = () => {
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
  };

  return (
    <div className="manager-panel" role="tabpanel">
      <div className="panel-actions">
        <div>
          <h3>Users</h3>
          <span>
            Accounts are tenant-scoped and invitations are sent by Cognito.
          </span>
        </div>
        <button className="primary-action" onClick={startNew}>
          Add User
        </button>
      </div>
      {error && (
        <div className="api-error" role="alert">
          {error}
          <button onClick={() => void refresh()}>Retry</button>
        </div>
      )}
      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.id)
              void run(
                () => adminUsersApi.update(config, draft as AdminUser),
                true,
              );
            else
              void run(
                () =>
                  adminUsersApi.create(config, {
                    name: draft.name,
                    email: draft.email,
                    roleIds: draft.roleIds,
                    branchIds: draft.branchIds,
                  }),
                true,
              );
          }}
        >
          <div className="form-grid">
            <label>
              User name
              <input
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              User email
              <input
                required
                type="email"
                disabled={Boolean(draft.id)}
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
              <small>
                {draft.id
                  ? "Email cannot be changed after invitation."
                  : "Cognito will email a temporary password."}
              </small>
            </label>
          </div>
          <fieldset className="assignment-fieldset">
            <legend>Roles</legend>
            {directory.roles.map((role) => (
              <label key={role.id}>
                <input
                  type="checkbox"
                  checked={draft.roleIds.includes(role.id)}
                  onChange={() => toggle("roleIds", role.id)}
                />
                {role.name}
              </label>
            ))}
          </fieldset>
          <fieldset className="assignment-fieldset">
            <legend>Permitted branches</legend>
            {directory.branches.map((branch) => (
              <label key={branch.id}>
                <input
                  type="checkbox"
                  checked={draft.branchIds.includes(branch.id)}
                  onChange={() => toggle("branchIds", branch.id)}
                />
                {branch.name}
              </label>
            ))}
          </fieldset>
          <div className="action-row">
            <button className="primary-action" disabled={busy}>
              {draft.id ? "Save Changes" : "Invite User"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="store-filter-grid compact-management-toolbar">
        <label className="list-search">
          Search
          <input
            aria-label="Search remote users"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email, role, branch or status"
          />
        </label>
        <ListSearchActions onClear={clearSearch} />
      </div>
      <PaginationToolbar
        from={pagedUsers.from}
        to={pagedUsers.to}
        totalCount={pagedUsers.totalCount}
        page={pagedUsers.page}
        pageCount={pagedUsers.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel="Remote user records per page"
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {loading ? (
        <p className="empty-state">Loading users…</p>
      ) : (
        pagedUsers.totalCount > 0 && (
          <div className="table-wrap management-table">
            <table aria-label="User manager">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Roles",
                    "Branches",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedUsers.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="user-name-with-appointments">
                        <span>{item.name}</span>
                        {managerDepartments(item.id).map((department) => (
                          <span className="manager-appointment-badge" key={department}>
                            Manager · {department}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td>
                      {item.roles.map((role) => role.name).join(", ") || "—"}
                    </td>
                    <td>
                      {item.branches.map((branch) => branch.name).join(", ") ||
                        "—"}
                    </td>
                    <td>
                      <b
                        className={`membership-status ${item.status.toLowerCase()}`}
                      >
                        {item.status === "INVITED"
                          ? "Invitation pending"
                          : item.status}
                      </b>
                    </td>
                    <td>
                      <div className="grid-actions">
                        {item.status === "INVITED" && (
                          <button
                            type="button"
                            className="grid-action"
                            disabled={busy}
                            onClick={() =>
                              void run(() =>
                                adminUsersApi.resend(config, item.id),
                              )
                            }
                          >
                            Resend invite
                          </button>
                        )}
                        <button
                          type="button"
                          className="grid-action"
                          disabled={busy}
                          onClick={() => {
                            setDraft({
                              id: item.id,
                              name: item.name,
                              email: item.email,
                              roleIds: item.roleIds,
                              branchIds: item.branchIds,
                              version: item.version,
                            });
                            setEditing(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="grid-action grid-action-danger"
                          disabled={busy || item.id === actorId}
                          title={
                            item.id === actorId
                              ? "You cannot archive your own signed-in account"
                              : undefined
                          }
                          onClick={() => {
                            const reason = window.prompt(
                              "Why is this user being archived?",
                            );
                            if (reason?.trim())
                              void run(() =>
                                adminUsersApi.archive(config, item.id, reason),
                              );
                          }}
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
      {!loading && pagedUsers.totalCount === 0 && (
        <div className="list-empty">
          <h3>No matching users</h3>
          <FilterClearButton onClick={clearSearch} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={pagedUsers.page}
        pageCount={pagedUsers.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-DuplicateJobSnapshot

src/App.tsx:11606-11626

~~~tsx
function DuplicateJobSnapshot({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Status status={view.job.main_status} sub={view.job.sub_status} />
      <Info
        label="Customer"
        value={`${view.customer.name} / ${view.customer.mobile}`}
      />
      <Info
        label="Vehicle"
        value={`${view.vehicle.number} / ${view.vehicle.make} ${view.vehicle.model}`}
      />
      <Info
        label="Visit"
        value={`${view.visit.received_at} / ${view.visit.fuel}`}
      />
      <Info label="Advisor" value={view.advisor.name} />
      <Info label="Technician" value={view.technician.name} />
    </div>
  );
}
~~~

## CMP-App-LinkedRecords

src/App.tsx:11628-11649

~~~tsx
function LinkedRecords({ view }: { view: JobView }) {
  return (
    <div className="linked-grid">
      <Info label="Estimate Items" value={view.estimate_items.length} />
      <Info label="Materials" value={view.material_requests.length} />
      <Info label="Tasks" value={view.tasks.length} />
      <Info
        label="QC Checks"
        value={`${view.qc_checks.filter((item) => item.passed).length}/${view.qc_checks.length}`}
      />
      <Info label="Invoice" value={view.invoice?.invoice_no || "None"} />
      <Info
        label="Payments"
        value={money(view.payments.reduce((sum, item) => sum + item.amount, 0))}
      />
      <Info label="Photos" value={view.photos.length} />
      <Info label="Follow-ups" value={view.followups.length} />
      <Info label="Receipt" value={view.receipt?.receipt_no || "None"} />
      <Info label="Gate Pass" value={view.gate_pass?.gate_pass_no || "None"} />
    </div>
  );
}
~~~

## CMP-App-CustomerEditor

src/App.tsx:11651-11739

~~~tsx
function CustomerEditor({
  value,
  setValue,
  mutate,
  embedded = false,
  onSaved,
}: {
  value: Customer;
  setValue: (value: Customer) => void;
  mutate: Mutate;
  embedded?: boolean;
  onSaved?: () => void;
}) {
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        if (
          mutate((db) =>
            value.id
              ? updateCustomer(db, value.id, value)
              : createCustomer(db, value),
          )
        )
          onSaved?.();
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<UserRound />}
          title="Customer Form"
          subtitle={value.id ? "Edit selected customer" : "Add customer"}
        />
      )}
      <label>
        Customer name
        <input
          aria-label="Customer name"
          required
          value={value.name}
          onChange={(event) => setValue({ ...value, name: event.target.value })}
        />
      </label>
      <label>
        Mobile
        <input
          required
          value={value.mobile}
          onChange={(event) =>
            setValue({ ...value, mobile: event.target.value })
          }
        />
      </label>
      <label>
        Type
        <input
          required
          value={value.type}
          onChange={(event) => setValue({ ...value, type: event.target.value })}
        />
      </label>
      <div className="action-row">
        <button className="primary-action">Save Customer</button>
        <button
          type="button"
          onClick={() =>
            setValue({ id: 0, name: "", mobile: "", type: "Individual" })
          }
        >
          New
        </button>
        {value.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveCustomer(db, value.id, "Archived from customer master"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}
~~~

## CMP-App-VehicleMasterPanel

src/App.tsx:11741-11885

~~~tsx
function VehicleMasterPanel({
  state,
  value,
  setValue,
  mutate,
  embedded = false,
  onSaved,
}: {
  state: WorkshopState;
  value: Vehicle;
  setValue: (value: Vehicle) => void;
  mutate: Mutate;
  embedded?: boolean;
  onSaved?: () => void;
}) {
  const [draft, setDraft] = useState<Vehicle>(value);
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        if (
          mutate((db) =>
            draft.id
              ? updateVehicle(db, draft.id, draft)
              : createVehicle(db, draft),
          )
        )
          onSaved?.();
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<Car />}
          title="Vehicle Form"
          subtitle="Vehicle master CRUD"
        />
      )}
      <select
        value={draft.id}
        onChange={(event) => {
          const next = state.vehicles.find(
            (item) => item.id === Number(event.target.value),
          ) ?? {
            id: 0,
            customer_id: state.customers[0]?.id ?? 0,
            number: "",
            make: "",
            model: "",
            color: "",
            km: 0,
          };
          setDraft(next);
          setValue(next);
        }}
      >
        <option value={0}>New vehicle</option>
        {state.vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.number}
          </option>
        ))}
      </select>
      <label>
        Customer
        <select
          value={draft.customer_id}
          onChange={(event) =>
            setDraft({ ...draft, customer_id: Number(event.target.value) })
          }
        >
          {state.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Number
          <input
            value={draft.number}
            onChange={(event) =>
              setDraft({ ...draft, number: event.target.value })
            }
          />
        </label>
        <label>
          Make
          <input
            value={draft.make}
            onChange={(event) =>
              setDraft({ ...draft, make: event.target.value })
            }
          />
        </label>
        <label>
          Model
          <input
            value={draft.model}
            onChange={(event) =>
              setDraft({ ...draft, model: event.target.value })
            }
          />
        </label>
        <label>
          Color
          <input
            value={draft.color}
            onChange={(event) =>
              setDraft({ ...draft, color: event.target.value })
            }
          />
        </label>
        <label>
          KM
          <input
            type="number"
            value={draft.km}
            onChange={(event) =>
              setDraft({ ...draft, km: Number(event.target.value) })
            }
          />
        </label>
      </div>
      <div className="action-row">
        <button className="primary-action">Save Vehicle</button>
        {draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveVehicle(db, draft.id, "Archived from vehicle master"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}
~~~

## CMP-App-DuplicateVisitEditor

src/App.tsx:11887-11976

~~~tsx
function DuplicateVisitEditor({
  view,
  advisors,
  mutate,
}: {
  view: JobView;
  advisors: User[];
  mutate: Mutate;
}) {
  const [draft, setDraft] = useState({
    advisor_id: view.visit.advisor_id,
    fuel: view.visit.fuel,
    keys: view.visit.keys,
    accessories: view.visit.accessories,
    requested_work: view.visit.requested_work,
    photos_note: view.visit.photos_note,
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) => updateVisit(db, view.visit.id, draft));
      }}
    >
      <label>
        Advisor
        <select
          value={draft.advisor_id}
          onChange={(event) =>
            setDraft({ ...draft, advisor_id: Number(event.target.value) })
          }
        >
          {advisors.map((advisor) => (
            <option key={advisor.id} value={advisor.id}>
              {advisor.name}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Fuel
          <input
            value={draft.fuel}
            onChange={(event) =>
              setDraft({ ...draft, fuel: event.target.value })
            }
          />
        </label>
        <label>
          Keys
          <input
            value={draft.keys}
            onChange={(event) =>
              setDraft({ ...draft, keys: event.target.value })
            }
          />
        </label>
        <label>
          Accessories
          <input
            value={draft.accessories}
            onChange={(event) =>
              setDraft({ ...draft, accessories: event.target.value })
            }
          />
        </label>
        <label>
          Photo Note
          <input
            value={draft.photos_note}
            onChange={(event) =>
              setDraft({ ...draft, photos_note: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Requested Work
        <input
          value={draft.requested_work}
          onChange={(event) =>
            setDraft({ ...draft, requested_work: event.target.value })
          }
        />
      </label>
      <button className="primary-action">Save Visit</button>
    </form>
  );
}
~~~

## CMP-App-AdminJobEditor

src/App.tsx:12000-12008

~~~tsx
function AdminJobEditor(props: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  actor: User;
}) {
  const { saved, onSaveResult } = useJobDetailsSaveNotice();
  return <JobEditor {...props} saved={saved} onSaveResult={onSaveResult} />;
}
~~~

## CMP-App-JobEditor

src/App.tsx:12010-12281

~~~tsx
function JobEditor({
  view,
  users,
  mutate,
  actor,
  embedded = false,
  saved,
  onSaveResult,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  actor: User;
  embedded?: boolean;
  saved: boolean;
  onSaveResult: (ok: boolean) => void;
}) {
  const [draft, setDraft] = useState({
    advisor_id: view.job.advisor_id,
    technician_id: view.job.technician_id,
    work_list: view.job.work_list,
    promised_at: view.job.promised_at,
    advisor_notes: view.job.advisor_notes ?? "",
    customer_instructions: view.job.customer_instructions ?? "",
    internal_instructions: view.job.internal_instructions ?? "",
    service_type: view.job.service_type ?? "",
    pickup_drop: view.job.pickup_drop ?? "",
    estimated_delivery: view.job.estimated_delivery ?? "",
    fuel: view.visit.fuel ?? "",
    accessories: view.visit.accessories ?? "",
    engine_no: view.vehicle.engine_no ?? "",
    address: view.customer.address ?? "",
  });
  const [error, setError] = useState("");
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          const ok = mutate(
            (db) => saveJobDetailsForActor(db, view.job.id, actor.id, draft),
            setError,
          );
          onSaveResult(ok);
        }}
      >
        <div className="form-grid">
          <label className="locked-assignment-field">
            Service advisor
            <select
              aria-label="Service advisor (locked)"
              value={draft.advisor_id}
              disabled
            >
              {users
                .filter((item) => item.role === "service")
                .map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.name}
                  </option>
                ))}
            </select>
            <small>This assignment is locked and cannot be changed here.</small>
          </label>
          <label>
            Technician
            <select
              value={draft.technician_id}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  technician_id: Number(event.target.value),
                })
              }
            >
              {users
                .filter((item) => item.role === "tech")
                .map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Main Status
            <select
              aria-label="Main Status"
              disabled
              value={view.job.main_status}
            >
              <option>{view.job.main_status}</option>
            </select>
          </label>
          <label>
            Promised
            <input
              value={draft.promised_at}
              onChange={(event) =>
                setDraft({ ...draft, promised_at: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Work List
          <input
            value={draft.work_list}
            onChange={(event) =>
              setDraft({ ...draft, work_list: event.target.value })
            }
          />
        </label>
        <label>
          Customer Instructions
          <input
            value={draft.customer_instructions}
            onChange={(event) =>
              setDraft({ ...draft, customer_instructions: event.target.value })
            }
          />
        </label>
        <label>
          Internal Instructions
          <input
            value={draft.internal_instructions}
            onChange={(event) =>
              setDraft({ ...draft, internal_instructions: event.target.value })
            }
          />
        </label>
        <label>
          Advisor Notes
          <input
            value={draft.advisor_notes}
            onChange={(event) =>
              setDraft({ ...draft, advisor_notes: event.target.value })
            }
          />
        </label>
        <h4>Job Sheet</h4>
        <div className="form-grid">
          <label>
            Service Type
            <select
              value={draft.service_type}
              onChange={(event) =>
                setDraft({ ...draft, service_type: event.target.value })
              }
            >
              <option value="">—</option>
              {SERVICE_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Pickup / Drop
            <select
              value={draft.pickup_drop}
              onChange={(event) =>
                setDraft({ ...draft, pickup_drop: event.target.value })
              }
            >
              <option value="">—</option>
              {PICKUP_DROP_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Estimated Delivery Date
            <input
              type="date"
              value={draft.estimated_delivery}
              onChange={(event) =>
                setDraft({ ...draft, estimated_delivery: event.target.value })
              }
            />
          </label>
          <label>
            Fuel
            <select
              value={draft.fuel}
              onChange={(event) =>
                setDraft({ ...draft, fuel: event.target.value })
              }
            >
              {[...new Set([draft.fuel, ...FUEL_LEVELS])]
                .filter(Boolean)
                .map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </select>
          </label>
          <label>
            Accessories
            <input
              value={draft.accessories}
              onChange={(event) =>
                setDraft({ ...draft, accessories: event.target.value })
              }
            />
          </label>
          <label>
            Engine Number
            <input
              value={draft.engine_no}
              onChange={(event) =>
                setDraft({ ...draft, engine_no: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Address
          <input
            value={draft.address}
            onChange={(event) =>
              setDraft({ ...draft, address: event.target.value })
            }
          />
        </label>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        <div className="job-details-save-row">
          <button className="primary-action">Save Job Details</button>
          {saved && (
            <span className="job-details-saved" role="status">
              <Check size={15} aria-hidden="true" /> Job details saved
            </span>
          )}
        </div>
      </form>
      {embedded && (
        <JobLifecyclePanel
          view={view}
          users={users}
          actor={actor}
          mutate={mutate}
          visible
        />
      )}
      {!embedded && (
        <>
          <JobLifecyclePanel
            view={view}
            users={users}
            actor={actor}
            mutate={mutate}
            visible
          />
          <section
            className="editor-block job-card-documents"
            aria-label="Current job documents"
          >
            <PanelTitle
              icon={<FileText />}
              title="Current Documents"
              subtitle="Only active records are available"
            />
            <JobDocuments view={view} actor={actor} mutate={mutate} />
          </section>
        </>
      )}
    </>
  );
}
~~~

## CMP-App-JobLifecyclePanel

src/App.tsx:12283-12583

~~~tsx
function JobLifecyclePanel({
  view,
  users,
  actor,
  mutate,
  visible = false,
}: {
  view: JobView;
  users: User[];
  actor: User;
  mutate: Mutate;
  visible?: boolean;
}) {
  if (!visible) return null;
  const [target, setTarget] = useState<MainStatus>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const allowed = MAIN_STATUS_TRANSITIONS[view.job.main_status].filter(
    (status) => canTransitionJobStatus(actor, view.job, status),
  );
  const terminal = isTerminalMainStatus(view.job.main_status);
  const canMutate =
    canMutateJobLifecycle(actor, view.job) &&
    !terminal &&
    view.job.main_status !== "HOLD";
  const cycle = [...view.checklist_cycles].sort((a, b) => b.id - a.id)[0];
  const items = view.checklist_items
    .filter((item) => item.checklist_cycle_id === cycle?.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const firstOpen = items.findIndex((item) => !item.checked_at);
  const remaining = items.filter((item) => !item.checked_at);
  const toggleNotApplicable = (item: ChecklistItem, notApplicable: boolean) => {
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
  };
  const toggle = (item: ChecklistItem, checked: boolean) => {
    setError("");
    mutate(
      (db) => setChecklistItemCheckedForActor(db, item.id, actor.id, checked),
      setError,
    );
  };
  const confirm = (event: FormEvent) => {
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
  };
  return (
    <section
      className="editor-block lifecycle-panel"
      aria-label="Job lifecycle"
    >
      <div className="job-card-header">
        <span
          className={`status-badge status-${view.job.main_status.toLowerCase()}`}
        >
          {view.job.main_status.replace("_", " ")}
        </span>
        <span className="job-card-header-meta">
          {view.job.job_no} · {view.vehicle.number}
        </span>
      </div>
      {view.material_approval?.status === "Rejected" &&
        actor.role === "service" &&
        actor.id === view.job.advisor_id && (
          <div className="action-row">
            <span className="permission-note">
              Material approval rejected:{" "}
              {view.material_approval.rejection_reason}
            </span>
            <button
              type="button"
              className="primary-action"
              onClick={() =>
                mutate(
                  (db) =>
                    resubmitMaterialApprovalForActor(db, view.job.id, actor.id),
                  setError,
                )
              }
            >
              Resubmit for Approval
            </button>
          </div>
        )}
      {allowed.length > 0 && (
        <div className="action-row">
          {allowed.map((status) => (
            <button
              type="button"
              key={status}
              className={
                status === "CANCELLED" ? "danger-action" : "primary-action"
              }
              disabled={status === "COMPLETED" && !canCompleteWithInvoice(view)}
              title={
                status === "COMPLETED" && !canCompleteWithInvoice(view)
                  ? "Create an Invoice before completing the job."
                  : undefined
              }
              onClick={() => {
                setTarget(status);
                setNote("");
                setError("");
              }}
            >
              {lifecycleActionLabel(view.job.main_status, status)}
            </button>
          ))}
        </div>
      )}
      {error && !target && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <PanelTitle
        icon={<ClipboardList />}
        title="Lifecycle Checklist"
        subtitle={
          cycle
            ? `${cycle.stage} · cycle ${cycle.cycle_number}`
            : "No active cycle"
        }
      />
      <p className="remaining-steps" aria-live="polite">
        {remaining.length
          ? `${remaining.length} remaining: ${remaining.map((item) => item.label).join(" → ")}`
          : "All steps complete. The next lifecycle action is available."}
      </p>
      <ol className="lifecycle-checklist">
        {items.map((item, index) => {
          const laterChecked = items.some(
            (candidate) =>
              candidate.sort_order > item.sort_order && candidate.checked_at,
          );
          const isPayment = item.label === "Payment Received";
          const isGoogleReviewReminder =
            item.label === "Remind Customer for Sharing Google Review/Feedback";
          const artifactLocked =
            (item.label === "Create Estimate" && !view.estimate) ||
            ((item.label === "Invoice Ready" || isPayment) && !view.invoice);
          const blockedByEarlier = items.some(
            (candidate) =>
              candidate.sort_order < item.sort_order &&
              candidate.required &&
              !candidate.checked_at,
          );
          const rolePermits = isPayment
            ? canMutateBilling(actor) &&
              !terminal &&
              view.job.main_status !== "HOLD"
            : canMutate;
          const enabled =
            rolePermits &&
            !artifactLocked &&
            (item.checked_at ? !laterChecked && !isPayment : !blockedByEarlier);
          const notApplicable = Boolean(item.na_at);
          const actorName =
            item.checked_by === 0
              ? "System"
              : users.find((user) => user.id === item.checked_by)?.name;
          const detail = notApplicable
            ? `N/A ${formatTimestamp(item.na_at!)}${actorName ? ` by ${users.find((user) => user.id === item.na_by)?.name ?? actorName}` : ""}`
            : item.checked_at
              ? `Completed ${formatTimestamp(item.checked_at)}${actorName ? ` by ${actorName}` : ""}`
              : item.started_at
                ? `Started ${formatTimestamp(item.started_at)}`
                : artifactLocked
                  ? `Available after the ${item.label === "Invoice Ready" || isPayment ? "invoice" : "estimate"} is saved`
                  : isPayment && blockedByEarlier
                    ? "Waiting for Google review/feedback reminder confirmation"
                  : "Waiting for the previous step";
          return (
            <li
              key={item.id}
              className={
                item.checked_at
                  ? "complete"
                  : index === firstOpen
                    ? "active"
                    : "locked"
              }
            >
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(item.checked_at)}
                  disabled={!enabled}
                  onChange={(event) => toggle(item, event.target.checked)}
                />
                <span>
                  <strong>
                    {item.label}
                    {!item.required && (
                      <em className="optional-tag"> (optional)</em>
                    )}
                  </strong>
                  <small>{detail}</small>
                </span>
              </label>
              {canMutate &&
                !isGoogleReviewReminder &&
                !artifactLocked &&
                (notApplicable || !item.checked_at) &&
                !(
                  !notApplicable &&
                  (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes(
                    item.label,
                  ) &&
                  view.material_requests.length > 0
                ) && (
                  <button
                    type="button"
                    className="link-action"
                    disabled={notApplicable && laterChecked}
                    onClick={() => toggleNotApplicable(item, !notApplicable)}
                  >
                    {notApplicable ? "Undo N/A" : "Mark N/A"}
                  </button>
                )}
            </li>
          );
        })}
      </ol>
      {terminal && (
        <p className="permission-note">
          This job is {view.job.main_status} and read-only.
        </p>
      )}
      {!terminal && !canMutate && allowed.length === 0 && (
        <p className="permission-note">
          Read only. Lifecycle changes are limited to the Owner and the linked
          Service Advisor.
        </p>
      )}
      {target && (
        <Dialog
          title={`${lifecycleActionLabel(view.job.main_status, target)}?`}
          subtitle={`${view.job.job_no}: ${view.job.main_status} → ${target}`}
          onClose={() => {
            setTarget(undefined);
            setError("");
          }}
          footer={
            <button
              className="primary-action"
              type="submit"
              form="lifecycle-confirm-form"
            >
              Confirm status change
            </button>
          }
        >
          <form id="lifecycle-confirm-form" onSubmit={confirm}>
            <label>
              Confirmation note
              <textarea
                data-dialog-initial-focus
                aria-describedby="lifecycle-note-help"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
            <p id="lifecycle-note-help" className="field-help">
              Required. This note is recorded in status history.
            </p>
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
          </form>
        </Dialog>
      )}
    </section>
  );
}
~~~

## CMP-App-ApproveEstimateDialog

src/App.tsx:12585-12641

~~~tsx
function ApproveEstimateDialog({
  view,
  actor,
  mutate,
  onClose,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [note, setNote] = useState("Customer approved");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (
      mutate(
        (db) => approveEstimateForActor(db, view.job.id, actor.id, note),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Approve Estimate?"
      subtitle={`${view.job.job_no} · Approval records the customer confirmation`}
      onClose={onClose}
      footer={
        <button
          className="primary-action"
          type="submit"
          form="approve-estimate-form"
        >
          Approve Estimate
        </button>
      }
    >
      <form id="approve-estimate-form" onSubmit={submit}>
        <label>
          Approval note
          <textarea
            data-dialog-initial-focus
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}
~~~

## CMP-App-EstimateEditor

src/App.tsx:12660-12724

~~~tsx
function EstimateEditor({
  view,
  mutate,
  actor,
}: {
  view: JobView;
  mutate: Mutate;
  actor: User;
}) {
  const [open, setOpen] = useState(false);
  const canMutate = canMutateJobLifecycle(actor, view.job);
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ReceiptText />}
        title="Estimate"
        subtitle={
          view.estimate
            ? `${view.estimate.status} · ${view.estimate_items.length} items`
            : "Not created"
        }
      />
      {view.estimate_items.map((existing) => (
        <div className="row" key={existing.id}>
          <strong>{existing.description}</strong>
          <span>
            {existing.kind} ·{" "}
            {existing.gst_type ??
              (existing.gst_rate === 0 ? "No GST" : "CGST+SGST")}{" "}
            {existing.gst_rate ?? view.estimate?.gst_rate ?? 18}%
          </span>
          <span>{money(existing.qty * existing.rate)}</span>
        </div>
      ))}
      {view.estimate && (
        <>
          <Info label="Discount" value={money(view.estimate.discount)} />
          <Info label="Notes" value={view.estimate.approval_note || "—"} />
          <Info
            label="Total"
            value={money(invoiceItemsTotal(view.estimate_items, view.estimate))}
          />
        </>
      )}
      {canMutate ? (
        <button className="primary-action" onClick={() => setOpen(true)}>
          {view.estimate ? "Edit Estimate" : "Create Estimate"}
        </button>
      ) : (
        <p className="permission-note">
          Read only. Estimate changes are limited to the Owner and the linked
          Service Advisor.
        </p>
      )}
      {open && (
        <EstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
~~~

## CMP-App-EstimateDialog

src/App.tsx:12740-12960

~~~tsx
function EstimateDialog({
  view,
  actor,
  mutate,
  onClose,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [items, setItems] = useState<EstimateDraftRow[]>(
    view.estimate_items.map((item) => ({
      key: `saved-${item.id}`,
      kind: item.kind,
      description: item.description,
      qty: item.qty,
      rate: item.rate,
      gst_type: item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST"),
      gst_rate: item.gst_rate ?? view.estimate?.gst_rate ?? 18,
    })),
  );
  const [discount, setDiscount] = useState(view.estimate?.discount ?? 0);
  const [notes, setNotes] = useState(view.estimate?.approval_note ?? "");
  const [error, setError] = useState("");
  const totals = invoiceTotals(items, discount);
  const updateItem = (key: string, patch: Partial<EstimateDraftRow>) =>
    setItems((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  const save = (event: FormEvent) => {
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
  };
  return (
    <Dialog
      wide
      className="dialog-document-editor estimate-dialog"
      title={`${view.estimate ? "Edit" : "Create"} Estimate`}
      subtitle={`${view.job.job_no} · Changes apply only when saved`}
      onClose={onClose}
      footer={
        <button
          className="primary-action"
          type="submit"
          form="estimate-dialog-form"
        >
          Save Estimate
        </button>
      }
    >
      <form
        id="estimate-dialog-form"
        onSubmit={save}
        className="estimate-dialog-form"
      >
        <div className="estimate-items">
          <div className="line-items-header">
            <strong>Estimate items</strong>
            <button
              type="button"
              className="add-line-item"
              onClick={() =>
                setItems((rows) => [
                  ...rows,
                  {
                    key: `new-${Date.now()}-${rows.length}`,
                    kind: "Service",
                    description: "",
                    qty: 1,
                    rate: 0,
                    gst_type: "CGST+SGST",
                    gst_rate: 18,
                  },
                ])
              }
            >
              + Add Item
            </button>
          </div>
          <div className="estimate-item estimate-item-heading">
            <span>Kind</span>
            <span>Description</span>
            <span>Quantity</span>
            <span>Rate</span>
            <span>GST type</span>
            <span>GST rate</span>
            <span>Action</span>
          </div>
          {items.map((item, index) => (
            <div className="estimate-item" key={item.key}>
              <select
                aria-label={`Item ${index + 1} kind`}
                value={item.kind}
                onChange={(event) =>
                  updateItem(item.key, {
                    kind: event.target.value as EstimateDraftRow["kind"],
                  })
                }
              >
                <option>Service</option>
                <option>Material</option>
              </select>
              <input
                data-dialog-initial-focus={index === 0 ? true : undefined}
                aria-label={`Item ${index + 1} description`}
                value={item.description}
                onChange={(event) =>
                  updateItem(item.key, { description: event.target.value })
                }
              />
              <input
                aria-label={`Item ${index + 1} quantity`}
                type="number"
                min="0.01"
                step="0.01"
                value={item.qty}
                onChange={(event) =>
                  updateItem(item.key, { qty: Number(event.target.value) })
                }
              />
              <input
                aria-label={`Item ${index + 1} rate`}
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(event) =>
                  updateItem(item.key, { rate: Number(event.target.value) })
                }
              />
              <select
                aria-label={`Item ${index + 1} GST type`}
                value={item.gst_type}
                onChange={(event) =>
                  updateItem(item.key, {
                    gst_type: event.target.value as GstType,
                    ...(event.target.value === "No GST"
                      ? { gst_rate: 0 }
                      : { gst_rate: item.gst_rate || 18 }),
                  })
                }
              >
                <option>CGST+SGST</option>
                <option>IGST</option>
                <option>No GST</option>
              </select>
              {item.gst_type === "No GST" ? (
                <span className="gst-no-rate">0%</span>
              ) : (
                <SearchSelect
                  label={`Item ${index + 1} GST rate`}
                  options={GST_RATE_OPTIONS}
                  value={item.gst_rate}
                  onChange={(value) =>
                    updateItem(item.key, { gst_rate: Number(value) })
                  }
                  placeholder="GST rate"
                  hideLabel
                />
              )}
              <button
                type="button"
                className="link-action line-remove"
                aria-label={`Remove item ${index + 1}`}
                onClick={() =>
                  setItems((rows) => rows.filter((row) => row.key !== item.key))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="form-grid estimate-form-grid">
          <label className="estimate-discount">
            Discount
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value))}
            />
          </label>
        </div>
        <label className="estimate-notes">
          Notes
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        <div className="estimate-total">
          <span>Subtotal {money(totals.subtotal)}</span>
          <span>GST {money(totals.gst)}</span>
          <strong>Total {money(totals.total)}</strong>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}
~~~

## CMP-App-FollowupEditor

src/App.tsx:12962-13058

~~~tsx
function FollowupEditor({ view, mutate }: { view: JobView; mutate: Mutate }) {
  const [draft, setDraft] = useState<Followup>({
    id: 0,
    job_card_id: view.job.id,
    note: "",
    due_at: new Date().toISOString().slice(0, 10),
    done: 0,
    outcome: "",
  });
  return (
    <form
      className="desk-panel"
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) =>
          draft.id
            ? updateFollowup(db, draft.id, draft)
            : createFollowup(db, draft),
        );
      }}
    >
      <PanelTitle
        icon={<ClipboardCheck />}
        title="Follow-ups"
        subtitle="Due date, outcome and completion"
      />
      {view.followups.map((followup) => (
        <button
          type="button"
          className={draft.id === followup.id ? "row active" : "row"}
          key={followup.id}
          onClick={() => setDraft(followup)}
        >
          <strong>{followup.due_at}</strong>
          <span>{followup.done ? "Done" : "Open"}</span>
          <span>{followup.note}</span>
        </button>
      ))}
      <label>
        Note
        <input
          value={draft.note}
          onChange={(event) => setDraft({ ...draft, note: event.target.value })}
        />
      </label>
      <div className="form-grid">
        <label>
          Due
          <input
            type="date"
            value={draft.due_at}
            onChange={(event) =>
              setDraft({ ...draft, due_at: event.target.value })
            }
          />
        </label>
        <label>
          Outcome
          <input
            value={draft.outcome ?? ""}
            onChange={(event) =>
              setDraft({ ...draft, outcome: event.target.value })
            }
          />
        </label>
      </div>
      <div className="action-row">
        <button className="primary-action">Save Follow-up</button>
        {draft.id > 0 && (
          <button
            type="button"
            onClick={() =>
              mutate((db) =>
                markFollowupDone(db, draft.id, draft.outcome || "Done"),
              )
            }
          >
            Mark Done
          </button>
        )}
        {draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveFollowup(db, draft.id, "Archived follow-up"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}
~~~

## CMP-App-JobMediaPanel

src/App.tsx:13060-13383

~~~tsx
function JobMediaPanel({
  view,
  actor,
  mutate,
  embedded = false,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  embedded?: boolean;
}) {
  const [galleryFilter, setGalleryFilter] = useState<
    "All Photos" | JobMediaCategory
  >("All Photos");
  const [uploadPhase, setUploadPhase] = useState<JobMediaCategory>(() =>
    view.job.main_status === "NEW" ? "Before Work" : "After Work",
  );
  const [label, setLabel] = useState("");
  const [prepared, setPrepared] = useState<PreparedJobMedia>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Photo>();
  const [archiveTarget, setArchiveTarget] = useState<Photo>();
  const [archiveReason, setArchiveReason] = useState("");
  const phaseStatusAllowed = (phase: JobMediaCategory) =>
    phase === "Before Work"
      ? view.job.main_status === "NEW"
      : view.job.main_status === "IN_PROGRESS" ||
        view.job.main_status === "COMPLETED";
  const canUpload =
    canMutateJobLifecycle(actor, view.job) && phaseStatusAllowed(uploadPhase);
  const canMutatePhoto = (photo: Photo) =>
    canMutateJobLifecycle(actor, view.job) &&
    phaseStatusAllowed(
      photo.category === "After Work" ? "After Work" : "Before Work",
    );
  const mediaLockMessage = (phase: JobMediaCategory) =>
    phase === "Before Work"
      ? "Before Photos are locked after the job leaves NEW."
      : view.job.main_status === "HOLD" ||
          view.job.main_status === "CLOSED" ||
          view.job.main_status === "CANCELLED"
        ? "After Photos are locked while this job is on hold, closed, or cancelled."
        : "After Photos can be added or changed only while the job is IN_PROGRESS or COMPLETED.";
  const rows = view.photos.filter(
    (photo) =>
      photo.src &&
      (galleryFilter === "All Photos" || photo.category === galleryFilter),
  );
  const galleryFilterId =
    galleryFilter === "All Photos"
      ? "all"
      : galleryFilter === "Before Work"
        ? "before"
        : "after";
  const chooseFile = async (file?: File) => {
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
  };
  const upload = (event: FormEvent) => {
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
  };
  return (
    <section
      className={embedded ? "job-media-panel" : "desk-panel job-media-panel"}
      aria-label="Job card photos and media"
    >
      {!embedded && (
        <PanelTitle
          icon={<Camera />}
          title="Photos / Media"
          subtitle="Compressed images stay in this browser session"
        />
      )}
      <div
        className="sub-tabs media-phase-tabs"
        role="tablist"
        aria-label="Photo gallery filter"
        onKeyDown={handleTabListKeyDown}
      >
        {(["All Photos", "Before Work", "After Work"] as const).map(
          (filter) => {
            const id =
              filter === "All Photos"
                ? "all"
                : filter === "Before Work"
                  ? "before"
                  : "after";
            return (
              <button
                type="button"
                id={`media-tab-${view.job.id}-${id}`}
                role="tab"
                aria-selected={galleryFilter === filter}
                aria-controls={`media-panel-${view.job.id}-${id}`}
                tabIndex={galleryFilter === filter ? 0 : -1}
                className={galleryFilter === filter ? "active" : ""}
                key={filter}
                onClick={() => setGalleryFilter(filter)}
              >
                {filter}
              </button>
            );
          },
        )}
      </div>
      <div
        id={`media-panel-${view.job.id}-${galleryFilterId}`}
        role="tabpanel"
        aria-labelledby={`media-tab-${view.job.id}-${galleryFilterId}`}
      >
        <section className="media-upload" aria-label="Upload photo">
          <label>
            Upload phase
            <select
              value={uploadPhase}
              onChange={(event) =>
                setUploadPhase(event.target.value as JobMediaCategory)
              }
            >
              <option>Before Work</option>
              <option>After Work</option>
            </select>
          </label>
          {canUpload ? (
            <form onSubmit={upload}>
              <div className="form-grid">
                <label>
                  Photo label
                  <input
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    placeholder={`${uploadPhase} photo`}
                  />
                </label>
                <label>
                  Image file
                  <input
                    id={`job-media-file-${view.job.id}`}
                    aria-describedby={`job-media-help-${view.job.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      void chooseFile(event.target.files?.[0])
                    }
                  />
                </label>
              </div>
              <p className="field-help" id={`job-media-help-${view.job.id}`}>
                JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed
                below 1 MB and are not stored outside this session.
              </p>
              {prepared && (
                <p className="media-ready" aria-live="polite">
                  Ready: {prepared.width} × {prepared.height} ·{" "}
                  {Math.ceil(prepared.byteSize / 1024)} KB
                </p>
              )}
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
              <button className="primary-action" disabled={busy}>
                {busy ? "Compressing…" : `Upload to ${uploadPhase}`}
              </button>
            </form>
          ) : (
            <p className="permission-note">
              {canMutateJobLifecycle(actor, view.job)
                ? mediaLockMessage(uploadPhase)
                : "Read only. Media changes are limited to the Owner and the linked Service Advisor."}
            </p>
          )}
        </section>
        {rows.length ? (
          <div className="job-media-gallery" data-testid="job-media-gallery">
            {rows.map((photo) => (
              <article className="job-media-card" key={photo.id}>
                <img src={photo.src} alt={photo.label} />
                <div>
                  <strong>{photo.label}</strong>
                  <span>
                    {photo.category === "Before Work" ||
                    photo.category === "After Work"
                      ? photo.category
                      : "General"}
                  </span>
                  <span>
                    {photo.original_name || photo.mime_type || "Image"}
                    {photo.byte_size
                      ? ` · ${Math.ceil(photo.byte_size / 1024)} KB`
                      : ""}
                  </span>
                </div>
                {canMutatePhoto(photo) && (
                  <div className="record-actions">
                    <button type="button" onClick={() => setEditing(photo)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-action"
                      onClick={() => {
                        setArchiveTarget(photo);
                        setArchiveReason("");
                      }}
                    >
                      Archive
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            {galleryFilter === "All Photos"
              ? "No images yet."
              : `No ${galleryFilter.toLocaleLowerCase()} images yet.`}
          </p>
        )}
        {editing && (
          <MediaMetadataDialog
            photo={editing}
            actor={actor}
            mutate={mutate}
            onClose={() => setEditing(undefined)}
          />
        )}
        {archiveTarget && (
          <Dialog
            title="Archive photo?"
            subtitle={archiveTarget.label}
            onClose={() => setArchiveTarget(undefined)}
            footer={
              <button
                className="danger-action"
                type="submit"
                form="archive-photo-form"
              >
                Archive photo
              </button>
            }
          >
            <form
              id="archive-photo-form"
              onSubmit={(event) => {
                event.preventDefault();
                setError("");
                if (
                  mutate(
                    (db) =>
                      archiveJobPhotoForActor(
                        db,
                        archiveTarget.id,
                        actor.id,
                        archiveReason,
                      ),
                    setError,
                  )
                )
                  setArchiveTarget(undefined);
              }}
            >
              <label>
                Archive reason
                <textarea
                  data-dialog-initial-focus
                  required
                  value={archiveReason}
                  onChange={(event) => setArchiveReason(event.target.value)}
                />
              </label>
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
            </form>
          </Dialog>
        )}
      </div>
    </section>
  );
}
~~~

## CMP-App-MediaMetadataDialog

src/App.tsx:13385-13461

~~~tsx
function MediaMetadataDialog({
  photo,
  actor,
  mutate,
  onClose,
}: {
  photo: Photo;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(photo.label);
  const [category, setCategory] = useState<JobMediaCategory>(
    photo.category === "After Work" ? "After Work" : "Before Work",
  );
  const [error, setError] = useState("");
  return (
    <Dialog
      title="Edit photo metadata"
      subtitle={photo.original_name || photo.label}
      onClose={onClose}
      footer={
        <button
          className="primary-action"
          type="submit"
          form="media-metadata-form"
        >
          Save metadata
        </button>
      }
    >
      <form
        id="media-metadata-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (
            mutate(
              (db) =>
                updateJobPhotoForActor(db, photo.id, actor.id, {
                  label,
                  category,
                }),
              setError,
            )
          )
            onClose();
        }}
      >
        <label>
          Photo label
          <input
            data-dialog-initial-focus
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </label>
        <label>
          Work phase
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as JobMediaCategory)
            }
          >
            <option>Before Work</option>
            <option>After Work</option>
          </select>
        </label>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}
~~~

## CMP-App-MaterialRequestEditor

src/App.tsx:13463-13845

~~~tsx
function MaterialRequestEditor({
  state,
  mutate,
  embedded = false,
  store = false,
}: {
  state: WorkshopState;
  mutate: Mutate;
  embedded?: boolean;
  store?: boolean;
}) {
  const emptyRequest = (): MaterialRequest => ({
    id: 0,
    job_card_id: store ? 0 : (state.jobs[0]?.job.id ?? 0),
    item_id: state.inventory[0]?.id ?? 0,
    requested_qty: 1,
    issued_qty: 0,
    used_qty: 0,
    returned_qty: 0,
    wasted_qty: 0,
  });
  const emptyPurchase = (): LocalPurchase => ({
    id: 0,
    job_card_id: 0,
    item_description: "",
    quantity: 1,
    unit: "piece",
    unit_cost: 0,
    vendor: "",
    bill_reference: "",
    note: "",
  });
  const [source, setSource] = useState<"inventory" | "local">("inventory");
  const [draft, setDraft] = useState<MaterialRequest>(emptyRequest);
  const [purchase, setPurchase] = useState<LocalPurchase>(emptyPurchase);
  const [period, setPeriod] = useState<JobPeriod>(todayJobPeriod);
  const [error, setError] = useState("");
  const requests = state.jobs.flatMap((view) =>
    view.material_requests.map((request) => ({
      ...request,
      job_card_id: view.job.id,
    })),
  );
  const purchases = state.jobs.flatMap((view) => view.local_purchases);
  const current = source === "inventory" ? draft : purchase;
  const setJob = (id?: number) =>
    source === "inventory"
      ? setDraft({ ...draft, job_card_id: id ?? 0 })
      : setPurchase({ ...purchase, job_card_id: id ?? 0 });
  const setPeriodForJob = (jobId: number) => {
    const received = state.jobs.find((view) => view.job.id === jobId)?.visit
      .received_at;
    if (!received) return;
    setPeriod({ monthYear: received.slice(0, 7) });
  };
  const selectRequest = (id: number) => {
    const next = requests.find((item) => item.id === id);
    setDraft(next ?? emptyRequest());
    if (next) setPeriodForJob(next.job_card_id);
  };
  const selectPurchase = (id: number) => {
    const next = purchases.find((item) => item.id === id);
    setPurchase(next ?? emptyPurchase());
    if (next) setPeriodForJob(next.job_card_id);
  };
  const save = () => {
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
  };
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<PackageCheck />}
          title="Request Form"
          subtitle={
            store
              ? "Inventory request or tracking-only local purchase"
              : "Job-linked material request"
          }
        />
      )}
      {store && (
        <fieldset className="source-toggle">
          <legend>Source</legend>
          <label>
            <input
              type="radio"
              checked={source === "inventory"}
              onChange={() => {
                setSource("inventory");
                setError("");
              }}
            />
            Inventory
          </label>
          <label>
            <input
              type="radio"
              checked={source === "local"}
              onChange={() => {
                setSource("local");
                setError("");
              }}
            />
            Local purchase
          </label>
        </fieldset>
      )}
      {source === "inventory" ? (
        <>
          <label>
            Request
            <select
              value={draft.id}
              onChange={(event) => selectRequest(Number(event.target.value))}
            >
              <option value={0}>New request</option>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>
                  Request #{request.id}
                </option>
              ))}
            </select>
          </label>
          {store ? (
            <JobPicker
              jobs={state.jobs}
              selectedJobId={draft.job_card_id || undefined}
              onSelect={setJob}
              label="Material request job"
              period={period}
              onPeriodChange={setPeriod}
            />
          ) : (
            <label>
              Job
              <select
                value={draft.job_card_id}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    job_card_id: Number(event.target.value),
                  })
                }
              >
                {state.jobs.map((job) => (
                  <option key={job.job.id} value={job.job.id}>
                    {job.job.job_no}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Item
            <select
              value={draft.item_id}
              onChange={(event) =>
                setDraft({ ...draft, item_id: Number(event.target.value) })
              }
            >
              {state.inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Requested Qty
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={draft.requested_qty}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  requested_qty: Number(event.target.value),
                })
              }
            />
          </label>
        </>
      ) : (
        <>
          <label>
            Local purchase
            <select
              value={purchase.id}
              onChange={(event) => selectPurchase(Number(event.target.value))}
            >
              <option value={0}>New local purchase</option>
              {purchases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_description} · {item.bill_reference}
                </option>
              ))}
            </select>
          </label>
          <JobPicker
            jobs={state.jobs}
            selectedJobId={purchase.job_card_id || undefined}
            onSelect={setJob}
            label="Local purchase job"
            period={period}
            onPeriodChange={setPeriod}
          />
          <div className="form-grid">
            <label>
              Item description
              <input
                required
                value={purchase.item_description}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    item_description: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Quantity
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={purchase.quantity}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    quantity: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Unit
              <input
                required
                value={purchase.unit}
                onChange={(event) =>
                  setPurchase({ ...purchase, unit: event.target.value })
                }
              />
            </label>
            <label>
              Unit cost
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={purchase.unit_cost}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    unit_cost: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Vendor / shop
              <input
                required
                value={purchase.vendor}
                onChange={(event) =>
                  setPurchase({ ...purchase, vendor: event.target.value })
                }
              />
            </label>
            <label>
              Bill / reference
              <input
                required
                value={purchase.bill_reference}
                onChange={(event) =>
                  setPurchase({
                    ...purchase,
                    bill_reference: event.target.value,
                  })
                }
              />
            </label>
          </div>
          <label>
            Note (optional)
            <textarea
              value={purchase.note ?? ""}
              onChange={(event) =>
                setPurchase({ ...purchase, note: event.target.value })
              }
            />
          </label>
        </>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <div className="action-row">
        <button className="primary-action">
          {source === "local" ? "Save Local Purchase" : "Save Request"}
        </button>
        {source === "inventory" && draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate(
                (db) =>
                  archiveMaterialRequest(
                    db,
                    draft.id,
                    "Archived material request",
                  ),
                setError,
              )
            }
          >
            Archive
          </button>
        )}
        {source === "local" && purchase.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate(
                (db) =>
                  archiveLocalPurchase(
                    db,
                    purchase.id,
                    "Archived local purchase",
                  ),
                setError,
              )
            }
          >
            Archive
          </button>
        )}
      </div>
    </form>
  );
}
~~~

## CMP-App-IssueMaterialEditor

src/App.tsx:13847-13861

~~~tsx
function IssueMaterialEditor() {
  return (
    <aside className="desk-panel">
      <PanelTitle
        icon={<Package />}
        title="Governed release"
        subtitle="Only requested rows for active or held jobs appear in this queue."
      />
      <p className="muted">
        Use Release on a row, verify the job, item, requested quantity and
        available stock, then confirm the full audited issue.
      </p>
    </aside>
  );
}
~~~

## CMP-App-ReleaseMaterialDialog

src/App.tsx:13863-13931

~~~tsx
function ReleaseMaterialDialog({
  row,
  actor,
  mutate,
  onClose,
}: {
  row: StoreRequestRow;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const item = row.item;
  const available = item?.stock_qty ?? 0;
  const confirm = () => {
    setError("");
    if (
      mutate(
        (db) => releaseMaterialRowForActor(db, row.request.id, actor.id),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Confirm material release"
      subtitle={`${row.view.job.job_no} · ${row.view.vehicle.number}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-action" onClick={confirm}>
            Confirm release
          </button>
        </>
      }
    >
      <div className="record-view">
        <Info label="Job" value={row.view.job.job_no} />
        <Info
          label="Item"
          value={item?.name ?? `Item ${row.request.item_id}`}
        />
        <Info
          label="Requested quantity"
          value={`${row.request.requested_qty} ${item?.unit ?? ""}`}
        />
        <Info
          label="Available stock"
          value={`${available} ${item?.unit ?? ""}`}
        />
      </div>
      {row.request.requested_qty > available && (
        <p className="error-text" role="alert">
          Insufficient stock: this release needs {row.request.requested_qty}{" "}
          {item?.unit ?? "units"}, but only {available} is available.
        </p>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-MaterialApprovalSubmitDialog

src/App.tsx:13933-13982

~~~tsx
function MaterialApprovalSubmitDialog({
  row,
  actor,
  mutate,
  onClose,
}: {
  row: StoreRequestRow;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const submit = () => {
    setError("");
    if (
      mutate(
        (db) => submitMaterialApprovalForActor(db, row.request.id, actor.id),
        setError,
      )
    )
      onClose();
  };
  return (
    <Dialog
      title="Send job for material approval"
      subtitle={`${row.view.job.job_no} · all outstanding requested materials`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-action" onClick={submit}>
            Needs Approval
          </button>
        </>
      }
    >
      <p>
        This holds the job and sends one consolidated material request to Admin.
        Store cannot issue or change materials until a decision is made.
      </p>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-ReconcileEditor

src/App.tsx:13984-14174

~~~tsx
function ReconcileEditor({
  row,
  mutate,
  onClose,
}: {
  row: StoreRequestRow;
  mutate: Mutate;
  onClose: () => void;
}) {
  const { view, request, item } = row;
  const [used, setUsed] = useState(String(request.used_qty));
  const [returned, setReturned] = useState(String(request.returned_qty));
  const [wasted, setWasted] = useState(String(request.wasted_qty));
  const [zeroRecordedAcknowledged, setZeroRecordedAcknowledged] =
    useState(false);
  const [error, setError] = useState("");
  const quantities = [used, returned, wasted].map((value) =>
    value.trim() === "" ? Number.NaN : Number(value),
  );
  const quantitiesValid = quantities.every(
    (quantity) => Number.isFinite(quantity) && quantity >= 0,
  );
  const [usedQty, returnedQty, wastedQty] = quantities;
  const total = usedQty + returnedQty + wastedQty;
  const withinIssued = quantitiesValid && total <= request.issued_qty;
  const variance = request.issued_qty - total;
  const state = withinIssued && Math.abs(variance) < 0.001 ? "Matched" : "Open";
  const needsZeroAcknowledgement = returnedQty === 0 && wastedQty === 0;
  const canSave =
    withinIssued && (!needsZeroAcknowledgement || zeroRecordedAcknowledged);
  const changeQuantity =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setZeroRecordedAcknowledged(false);
      setError("");
    };
  const submit = (event: FormEvent) => {
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
  };
  return (
    <Dialog
      wide
      title="Reconcile Material"
      subtitle={`${view.job.job_no} · ${view.vehicle.number}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="reconcile-material-form"
            className="primary-action"
            disabled={!canSave}
          >
            Save Reconciliation
          </button>
        </>
      }
    >
      <form
        id="reconcile-material-form"
        className="reconcile-dialog-form"
        onSubmit={submit}
      >
        <dl className="reconciliation-context">
          <div>
            <dt>Job card</dt>
            <dd>{view.job.job_no}</dd>
          </div>
          <div>
            <dt>Vehicle</dt>
            <dd>{view.vehicle.number}</dd>
          </div>
          <div>
            <dt>Customer</dt>
            <dd>{view.customer.name}</dd>
          </div>
          <div>
            <dt>Item</dt>
            <dd>{item?.name ?? "Unknown"}</dd>
          </div>
          <div>
            <dt>SKU</dt>
            <dd>{item?.sku ?? "No SKU"}</dd>
          </div>
          <div>
            <dt>Issued</dt>
            <dd>
              {request.issued_qty} {item?.unit ?? ""}
            </dd>
          </div>
        </dl>
        <div className="form-grid">
          <label>
            Used
            <input
              data-dialog-initial-focus
              aria-label="Used quantity"
              type="number"
              min="0"
              step="any"
              value={used}
              onChange={changeQuantity(setUsed)}
            />
          </label>
          <label>
            Returned
            <input
              aria-label="Returned quantity"
              type="number"
              min="0"
              step="any"
              value={returned}
              onChange={changeQuantity(setReturned)}
            />
          </label>
          <label>
            Wasted
            <input
              aria-label="Wasted quantity"
              type="number"
              min="0"
              step="any"
              value={wasted}
              onChange={changeQuantity(setWasted)}
            />
          </label>
        </div>
        <p className="reconciliation-equation">
          {request.issued_qty} issued ={" "}
          {Number.isFinite(usedQty) ? usedQty : "—"} used +{" "}
          {Number.isFinite(returnedQty) ? returnedQty : "—"} returned +{" "}
          {Number.isFinite(wastedQty) ? wastedQty : "—"} wasted +{" "}
          {Number.isFinite(variance) ? variance : "—"} variance
        </p>
        <p className={`reconciliation-state ${state.toLowerCase()}`}>
          State: {state} · Variance:{" "}
          {Number.isFinite(variance) ? variance : "—"}
        </p>
        {needsZeroAcknowledgement && (
          <label className="checkbox-line">
            <input
              aria-label="Confirm no return or wastage"
              type="checkbox"
              checked={zeroRecordedAcknowledged}
              onChange={(event) => {
                setZeroRecordedAcknowledged(event.target.checked);
                setError("");
              }}
            />{" "}
            I confirm that neither returned material nor wastage is being
            recorded.
          </label>
        )}
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  );
}
~~~

## CMP-App-QuickAddStock

src/App.tsx:14187-14467

~~~tsx
function QuickAddStock({
  inventory,
  actor,
  purchaseOrders,
  purchaseOrderLines,
  mutate,
  onSaved,
}: {
  inventory: InventoryItem[];
  actor: User;
  purchaseOrders: PurchaseOrder[];
  purchaseOrderLines: PurchaseOrderLine[];
  mutate: Mutate;
  onSaved?: () => void;
}) {
  const [addingNew, setAddingNew] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(inventory[0]?.id ?? 0);
  const [inwardQty, setInwardQty] = useState(1);
  const [purchaseOrderId, setPurchaseOrderId] = useState(0);
  const [purchaseOrderLineId, setPurchaseOrderLineId] = useState(0);
  const [draft, setDraft] = useState<InventoryItem>(emptyInventoryItem);
  const [error, setError] = useState("");
  const selected = inventory.find((item) => item.id === selectedId);
  const submit = (event: FormEvent) => {
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
  };
  return (
    <form className="quick-add-stock" onSubmit={submit}>
      {!addingNew ? (
        <>
          <SearchSelect
            label="Existing SKU"
            options={inventory.map((item) => ({
              value: item.id,
              label: `${item.sku} · ${item.name}`,
            }))}
            value={selectedId || undefined}
            onChange={(value) => setSelectedId(Number(value))}
            placeholder="Search SKU or material"
            openOnFocus={false}
          />
          {selected && (
            <p className="quick-add-selected">
              {selected.name} · {selected.stock_qty} {selected.unit} on hand
            </p>
          )}
          <label>
            Inward quantity
            <input
              aria-label="Inward quantity"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={inwardQty}
              onChange={(event) => setInwardQty(Number(event.target.value))}
            />
          </label>
          <label>
            Purchase order (optional)
            <select
              aria-label="Purchase order"
              value={purchaseOrderId}
              onChange={(event) => {
                setPurchaseOrderId(Number(event.target.value));
                setPurchaseOrderLineId(0);
              }}
            >
              <option value={0}>Unlinked/manual receipt</option>
              {purchaseOrders
                .filter((order) =>
                  ["Sent", "Partially Received", "Ready to Close"].includes(
                    order.status,
                  ),
                )
                .map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.po_number}
                  </option>
                ))}
            </select>
          </label>
          {purchaseOrderId > 0 && (
            <label>
              Purchase order line
              <select
                aria-label="Purchase order line"
                value={purchaseOrderLineId}
                onChange={(event) =>
                  setPurchaseOrderLineId(Number(event.target.value))
                }
              >
                <option value={0}>Select compatible line</option>
                {purchaseOrderLines
                  .filter(
                    (line) =>
                      line.purchase_order_id === purchaseOrderId &&
                      line.item_id === selectedId,
                  )
                  .map((line) => (
                    <option key={line.id} value={line.id}>
                      {
                        purchaseOrders.find(
                          (order) => order.id === purchaseOrderId,
                        )?.po_number
                      }{" "}
                      ·{" "}
                      {inventory.find((item) => item.id === line.item_id)?.name}{" "}
                      · ordered {line.ordered_qty}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <div className="quick-add-actions">
            <button
              type="button"
              data-dialog-initial-focus
              className="link-action"
              onClick={() => setAddingNew(true)}
            >
              Add new SKU
            </button>
            <button
              className="primary-action"
              disabled={
                !selectedId || (purchaseOrderId > 0 && !purchaseOrderLineId)
              }
            >
              Record Inward
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="form-grid">
            <label>
              SKU
              <input
                aria-label="New SKU"
                required
                value={draft.sku}
                onChange={(event) =>
                  setDraft({ ...draft, sku: event.target.value })
                }
              />
            </label>
            <label>
              Material name
              <input
                aria-label="New material name"
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Category
              <input
                aria-label="New SKU category"
                required
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              />
            </label>
            <label>
              Unit
              <input
                aria-label="New SKU unit"
                required
                value={draft.unit}
                onChange={(event) =>
                  setDraft({ ...draft, unit: event.target.value })
                }
              />
            </label>
            <label>
              Low-stock threshold
              <input
                aria-label="New SKU low-stock threshold"
                type="number"
                min="0"
                step="0.01"
                required
                value={draft.low_stock_qty}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    low_stock_qty: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Default selling price (₹)
              <input
                aria-label="New SKU selling price"
                type="number"
                min="0"
                step="0.01"
                required
                value={draft.selling_price}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    selling_price: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Initial inward quantity
              <input
                aria-label="Initial inward quantity"
                type="number"
                min="0"
                step="0.01"
                required
                value={inwardQty}
                onChange={(event) => setInwardQty(Number(event.target.value))}
              />
            </label>
          </div>
          <div className="quick-add-actions">
            <button
              type="button"
              className="link-action"
              onClick={() => setAddingNew(false)}
            >
              Choose existing SKU
            </button>
            <button className="primary-action">
              Create SKU &amp; Record Inward
            </button>
          </div>
        </>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
~~~

## CMP-App-EditStockDetailsDialog

src/App.tsx:14469-14610

~~~tsx
function EditStockDetailsDialog({
  item,
  mutate,
  onClose,
}: {
  item: InventoryItem;
  mutate: Mutate;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(item);
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (mutate((db) => updateInventoryItem(db, item.id, draft))) onClose();
  };
  const archive = () => {
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
  };
  return (
    <Dialog
      title="Edit stock details"
      subtitle={`${item.sku} · ${item.stock_qty} ${item.unit} on hand`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="danger-action" onClick={archive}>
            {confirmingArchive ? "Confirm archive" : "Archive"}
          </button>
          <button
            className="primary-action"
            type="submit"
            form="edit-stock-details"
          >
            Save changes
          </button>
        </>
      }
    >
      <form id="edit-stock-details" className="stock-edit-form" onSubmit={save}>
        <p className="muted">
          Stock quantity is changed only by an inward or stock movement.
        </p>
        <div className="form-grid">
          <label>
            SKU
            <input
              data-dialog-initial-focus
              aria-label="Edit SKU"
              required
              value={draft.sku}
              onChange={(event) =>
                setDraft({ ...draft, sku: event.target.value })
              }
            />
          </label>
          <label>
            Material name
            <input
              aria-label="Edit material name"
              required
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
            />
          </label>
          <label>
            Category
            <input
              aria-label="Edit category"
              required
              value={draft.category}
              onChange={(event) =>
                setDraft({ ...draft, category: event.target.value })
              }
            />
          </label>
          <label>
            Unit
            <input
              aria-label="Edit unit"
              required
              value={draft.unit}
              onChange={(event) =>
                setDraft({ ...draft, unit: event.target.value })
              }
            />
          </label>
          <label>
            Low-stock threshold
            <input
              aria-label="Edit low-stock threshold"
              type="number"
              min="0"
              step="0.01"
              required
              value={draft.low_stock_qty}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  low_stock_qty: Number(event.target.value),
                })
              }
            />
          </label>
          <label>
            Default selling price (₹)
            <input
              aria-label="Edit selling price"
              type="number"
              min="0"
              step="0.01"
              required
              value={draft.selling_price}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  selling_price: Number(event.target.value),
                })
              }
            />
          </label>
        </div>
        {confirmingArchive && (
          <p className="error-text" role="alert">
            Archive this SKU? It will no longer be available for new material
            requests.
          </p>
        )}
      </form>
    </Dialog>
  );
}
~~~

## CMP-App-InventoryEditor

src/App.tsx:14612-14829

~~~tsx
function InventoryEditor({
  state,
  mutate,
  embedded = false,
}: {
  state: WorkshopState;
  mutate: Mutate;
  embedded?: boolean;
}) {
  const [draft, setDraft] = useState<InventoryItem>(
    state.inventory[0] ?? emptyInventoryItem(),
  );
  const [movementQty, setMovementQty] = useState(1);
  const purchaseHistory = state.inward_purchase_lines
    .filter((line) => line.item_id === draft.id)
    .map((line) => ({
      line,
      purchase: state.inward_purchases.find(
        (purchase) => purchase.id === line.purchase_id,
      ),
    }))
    .filter((row): row is { line: typeof row.line; purchase: InwardPurchase } =>
      Boolean(row.purchase),
    );
  return (
    <form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) =>
          draft.id
            ? updateInventoryItem(db, draft.id, draft)
            : createInventoryItem(db, draft),
        );
      }}
    >
      {!embedded && (
        <PanelTitle
          icon={<Boxes />}
          title="Stock Form"
          subtitle="Master, stock-in and adjustment"
        />
      )}
      <select
        value={draft.id}
        onChange={(event) =>
          setDraft(
            state.inventory.find(
              (item) => item.id === Number(event.target.value),
            ) ?? emptyInventoryItem(),
          )
        }
      >
        <option value={0}>New item</option>
        {state.inventory.map((item) => (
          <option key={item.id} value={item.id}>
            {item.sku}
          </option>
        ))}
      </select>
      <div className="form-grid">
        <label>
          SKU
          <input
            value={draft.sku}
            onChange={(event) =>
              setDraft({ ...draft, sku: event.target.value })
            }
          />
        </label>
        <label>
          Category
          <input
            value={draft.category}
            onChange={(event) =>
              setDraft({ ...draft, category: event.target.value })
            }
          />
        </label>
        <label>
          Name
          <input
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
          />
        </label>
        <label>
          Unit
          <input
            value={draft.unit}
            onChange={(event) =>
              setDraft({ ...draft, unit: event.target.value })
            }
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            value={draft.stock_qty}
            onChange={(event) =>
              setDraft({ ...draft, stock_qty: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Low Stock
          <input
            type="number"
            value={draft.low_stock_qty}
            onChange={(event) =>
              setDraft({ ...draft, low_stock_qty: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Selling Price
          <input
            type="number"
            min="0"
            step="0.01"
            value={draft.selling_price}
            onChange={(event) =>
              setDraft({ ...draft, selling_price: Number(event.target.value) })
            }
          />
        </label>
      </div>
      <label>
        Movement Qty
        <input
          type="number"
          value={movementQty}
          onChange={(event) => setMovementQty(Number(event.target.value))}
        />
      </label>
      <div className="action-row">
        <button className="primary-action">Save Item</button>
        {draft.id > 0 && (
          <button
            type="button"
            onClick={() =>
              mutate((db) =>
                stockIn(db, draft.id, movementQty, "Manual stock-in"),
              )
            }
          >
            Stock In
          </button>
        )}
        {draft.id > 0 && (
          <button
            type="button"
            onClick={() =>
              mutate((db) =>
                adjustStock(db, draft.id, movementQty, "Manual adjustment"),
              )
            }
          >
            Set Stock
          </button>
        )}
        {draft.id > 0 && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveInventoryItem(db, draft.id, "Archived inventory item"),
              )
            }
          >
            Archive
          </button>
        )}
      </div>
      {draft.id > 0 && (
        <section
          className="local-purchase-records"
          aria-label="Item purchase history"
        >
          <h4>Item purchase history</h4>
          {purchaseHistory.length === 0 ? (
            <p className="empty-state">
              No inward purchase receipts for this item.
            </p>
          ) : (
            <ul className="material-rows">
              {purchaseHistory.map(({ line, purchase }) => (
                <li key={line.id} className="material-row">
                  <div className="material-row-main">
                    <strong>
                      {purchase.invoice_date} ·{" "}
                      {state.suppliers.find(
                        (supplier) => supplier.id === purchase.supplier_id,
                      )?.name ?? "Archived supplier"}
                    </strong>
                    <span>
                      {line.received_qty} {draft.unit} · {money(line.unit_cost)}{" "}
                      pre-GST · GST {line.gst_rate}%
                    </span>
                    <small>
                      Invoice {purchase.supplier_invoice_no} ·{" "}
                      {purchase.po_number ? `PO ${purchase.po_number} · ` : ""}
                      {purchase.status}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </form>
  );
}
~~~

## CMP-App-TaskCreator

src/App.tsx:14831-14885

~~~tsx
function TaskCreator({
  view,
  users,
  mutate,
  onCreated,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  embedded?: boolean;
  onCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const technicianId =
    users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (
          mutate((db) =>
            createTask(db, {
              job_card_id: view.job.id,
              technician_id: technicianId,
              title,
              status: "Pending",
              notes,
            }),
          )
        ) {
          setTitle("");
          setNotes("");
          onCreated?.();
        }
      }}
    >
      <label>
        New Task
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label>
        Notes
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      <button>Add Task</button>
    </form>
  );
}
~~~

## CMP-App-QcEditor

src/App.tsx:14887-14940

~~~tsx
function QcEditor({
  view,
  technicianId,
  mutate,
}: {
  view: JobView;
  technicianId: number;
  mutate: Mutate;
}) {
  const [reason, setReason] = useState("Rework required");
  return (
    <div className="qc-box">
      {view.qc_checks.map((check: QcCheck) => (
        <div className="request-line" key={check.id}>
          <strong>{check.label}</strong>
          <span>{check.passed ? "Pass" : check.fail_reason || "Pending"}</span>
          <div className="action-row">
            <button
              onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
            >
              Pass
            </button>
            <button
              onClick={() =>
                mutate((db) =>
                  failQcWithRework(db, check.id, technicianId, reason),
                )
              }
            >
              Fail + Rework
            </button>
          </div>
        </div>
      ))}
      <label>
        Fail/Rework Reason
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <div className="action-row">
        <button
          onClick={() => mutate((db) => markWashingNeeded(db, view.job.id))}
        >
          Washing Needed
        </button>
        <button onClick={() => mutate((db) => passQc(db, view.job.id))}>
          Pass All QC
        </button>
      </div>
    </div>
  );
}
~~~

## CMP-App-ReadyToInvoiceDraft

src/App.tsx:14942-15036

~~~tsx
function ReadyToInvoiceDraft({
  view,
  actor,
  onCreate,
}: {
  view: JobView;
  actor: User;
  onCreate: () => void;
}) {
  const draft = buildInvoiceDraft(view);
  const totals = invoiceTotals(draft.lines, draft.discount);
  const warning = unissuedWarning(draft.unissuedRows);
  const canCreate =
    canCreateInvoice(actor, view.job) &&
    view.estimate?.status === "Approved" &&
    !view.estimate.archived_at &&
    draft.lines.length > 0;
  return (
    <section className="invoice-draft" aria-label="Invoice draft">
      <div className="invoice-draft-heading">
        <div>
          <strong>{view.customer.name}</strong>
          <span>
            {view.vehicle.number} · Received{" "}
            {view.visit.received_at.slice(0, 10)}
          </span>
        </div>
        {canCreate ? (
          <button type="button" className="primary-action" onClick={onCreate}>
            Create Invoice
          </button>
        ) : (
          <span className="status hold">
            {view.estimate?.status === "Approved"
              ? "No billable items"
              : "Estimate approval required"}
          </span>
        )}
      </div>
      {warning && (
        <p className="permission-note" role="status">
          {warning}
        </p>
      )}
      {draft.lines.length ? (
        <div className="table-wrap">
          <table aria-label="Invoice draft lines">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {draft.lines.map((line, index) => (
                <tr key={line.material_row_id ?? `${line.kind}-${index}`}>
                  <td>{line.kind}</td>
                  <td>{line.description}</td>
                  <td>{line.qty}</td>
                  <td>{money(line.rate)}</td>
                  <td>
                    {line.gst_type} · {line.gst_rate}%
                  </td>
                  <td>{money(totals.lines[index].amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">
          There are no service or issued-material lines to invoice.
        </p>
      )}
      <div className="invoice-totals" aria-label="Invoice draft totals">
        <span>
          Subtotal <strong>{money(totals.subtotal)}</strong>
        </span>
        <span>
          Discount <strong>{money(totals.discount)}</strong>
        </span>
        <span>
          GST <strong>{money(totals.gst)}</strong>
        </span>
        <span>
          Total <strong>{money(totals.total)}</strong>
        </span>
      </div>
    </section>
  );
}
~~~

## CMP-App-DataFlowWorkspace

src/App.tsx:15038-15234

~~~tsx
function DataFlowWorkspace({
  jobs,
  users,
}: {
  jobs: JobView[];
  users: User[];
}) {
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const jobPickerRef = useRef<HTMLDivElement>(null);
  const months = useMemo(() => dataFlowMonths(jobs), [jobs]);
  const dates = useMemo(() => dataFlowDates(jobs, month), [jobs, month]);
  const options = useMemo(
    () => filterDataFlowJobs(jobs, { query, month, date }),
    [jobs, query, month, date],
  );
  const selected = jobs.find((view) => view.job.id === selectedId);

  usePickerDismissal(jobPickerRef, open, () => setOpen(false));

  useEffect(() => {
    if (selectedId && !options.some((view) => view.job.id === selectedId))
      setSelectedId(undefined);
    setActiveIndex((index) =>
      Math.max(-1, Math.min(index, options.length - 1)),
    );
  }, [options, selectedId]);

  const choose = (view: JobView) => {
    setSelectedId(view.job.id);
    setQuery(view.job.job_no);
    setOpen(false);
  };
  const clear = () => {
    setMonth("");
    setDate("");
    setQuery("");
    setSelectedId(undefined);
    setOpen(false);
    setActiveIndex(-1);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  return (
    <section className="workspace single-panel">
      <div className="desk-panel data-flow">
        <PanelTitle
          icon={<ClipboardCheck />}
          title="Data Flow"
          subtitle={selected?.job.job_no ?? "Select a job"}
        />
        <div className="data-flow-filters">
          <label>
            Visit month
            <select
              aria-label="Visit month"
              value={month}
              onChange={(event) => {
                setMonth(event.target.value);
                setDate("");
                setQuery("");
                setSelectedId(undefined);
                setOpen(false);
              }}
            >
              <option value="">All months</option>
              {months.map((value) => (
                <option key={value} value={value}>
                  {new Date(`${value}-01T00:00:00`).toLocaleDateString(
                    "en-IN",
                    { month: "long", year: "numeric" },
                  )}
                </option>
              ))}
            </select>
          </label>
          <label>
            Visit date
            <select
              aria-label="Visit date"
              value={date}
              onChange={(event) => {
                const next = event.target.value;
                setDate(next);
                if (next) setMonth(next.slice(0, 7));
                setQuery("");
                setSelectedId(undefined);
                setOpen(false);
              }}
            >
              <option value="">All dates</option>
              {dates.map((value) => (
                <option key={value} value={value}>
                  {new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </label>
          <div className="data-flow-combobox" ref={jobPickerRef}>
            <label htmlFor="data-flow-job-search">Find a job</label>
            <input
              id="data-flow-job-search"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="data-flow-job-options"
              aria-activedescendant={
                open && options[activeIndex]
                  ? `data-flow-job-${options[activeIndex].job.id}`
                  : undefined
              }
              autoComplete="off"
              value={query}
              placeholder="Job, vehicle, customer or mobile"
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedId(undefined);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={onKeyDown}
            />
            {open && (
              <div
                id="data-flow-job-options"
                className="data-flow-options"
                role="listbox"
                aria-label="Matching jobs"
              >
                {options.length ? (
                  options.map((view, index) => (
                    <button
                      id={`data-flow-job-${view.job.id}`}
                      type="button"
                      role="option"
                      aria-selected={selectedId === view.job.id}
                      className={index === activeIndex ? "highlighted" : ""}
                      key={view.job.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => choose(view)}
                    >
                      <strong>{view.job.job_no}</strong>
                      <span>
                        {view.vehicle.number} · {view.customer.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="data-flow-no-matches" role="status">
                    No matching jobs
                  </p>
                )}
              </div>
            )}
          </div>
          <FilterClearButton onClick={clear} />
        </div>
        {!jobs.length ? (
          <div className="empty-state">No jobs are available.</div>
        ) : selected ? (
          <DataFlow view={selected} users={users} />
        ) : (
          <div className="empty-state">Select a job to view its data flow.</div>
        )}
      </div>
    </section>
  );
}
~~~

## CMP-App-DocumentDownloadButton

src/App.tsx:15236-15339

~~~tsx
function DocumentDownloadButton({
  kind,
  view,
  className = "workflow-action action-document document-download",
  label,
  snapshotId,
  showPrint = true,
}: {
  kind: DocumentKind;
  view: JobView;
  className?: string;
  label?: string;
  snapshotId?: string;
  showPrint?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "preparing" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const resolve = (): RenderedDocument => {
    const snapshots = loadDocumentSnapshots();
    const snap = snapshotId
      ? snapshots.find((item) => item.id === snapshotId)
      : undefined;
    return snap
      ? renderSnapshotDocument(snap)
      : renderJobDocument(kind, view, loadAdminDemoState(), snapshots);
  };
  const print = () => {
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
  };
  const download = async () => {
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
  };
  return (
    <>
      <button
        type="button"
        className={className}
        disabled={status === "preparing"}
        aria-busy={status === "preparing"}
        onClick={download}
      >
        <Download size={15} />
        {status === "preparing"
          ? "Preparing…"
          : status === "done"
            ? "Downloaded ✓"
            : (label ?? "Download PDF")}
      </button>
      {showPrint && (
        <button
          type="button"
          className="workflow-action action-secondary document-print"
          onClick={print}
        >
          <Printer size={15} />
          Print
        </button>
      )}
      {status === "error" && (
        <span className="document-error" role="alert">
          {errorMessage}
        </span>
      )}
    </>
  );
}
~~~

## CMP-App-DataFlow

src/App.tsx:15341-15343

~~~tsx
function DataFlow({ view, users }: { view: JobView; users: User[] }) {
  return <DataFlowLine view={view} users={users} />;
}
~~~

## CMP-App-DataFlowLine

src/App.tsx:15345-15487

~~~tsx
function DataFlowLine({ view, users }: { view: JobView; users: User[] }) {
  const events = buildDataFlowTimeline(view, users);
  const snapshots = loadDocumentSnapshots();
  const ghosts = buildGhostSteps(view, snapshots);
  const pdf = (event: DataFlowEvent) => {
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
  };
  const lifecycle = summarizeJobLifecycle(view);
  const stageRows = buildStageRows(view);
  return (
    <>
      <section className="data-flow-stage" aria-label="Stage summary">
        <div className="data-flow-active">
          <div>
            <small>Active stage</small>
            <strong>
              {lifecycle.stage}
              {lifecycle.cycle ? ` - cycle ${lifecycle.cycle}` : ""}
            </strong>
            <small>Ordered remaining steps</small>
            <strong>
              {lifecycle.remainingSteps.length
                ? lifecycle.remainingSteps.join(" > ")
                : "None"}
            </strong>
          </div>
          <strong className="data-flow-active-step">
            {lifecycle.activeStep}
          </strong>
        </div>
        {stageRows.map((row) => (
          <div
            key={row.id}
            className={`data-flow-stage-row${row.done ? " done" : ""}`}
            data-stage={row.id}
          >
            <span className="stage-check" aria-hidden="true">
              {row.done ? "✓" : "○"}
            </span>
            <span>
              {row.label}: {row.value}
            </span>
            {row.document && row.done && (
              <div className="data-flow-row-actions">
                <DocumentDownloadButton
                  kind={row.document}
                  view={view}
                  className="workflow-action action-document document-download data-flow-document-action"
                />
              </div>
            )}
          </div>
        ))}
      </section>
      <section
        className="data-flow-timeline data-flow-line"
        aria-label="Chronological data flow"
      >
        <div className="data-flow-head">
          <h2>{view.job.job_no}</h2>
          <span>
            {view.vehicle.number} · {view.vehicle.make} {view.vehicle.model} ·{" "}
            {view.customer.name}
          </span>
          <span
            className={`data-flow-pill ${view.job.main_status.toLowerCase()}`}
          >
            {view.job.main_status.replace("_", " ")}
          </span>
          <span className="data-flow-count">
            {events.length} done event{events.length === 1 ? "" : "s"}
          </span>
        </div>
        <ol>
          {events.map((event, index) => (
            <li
              key={event.id}
              className={`timeline-event ${event.state ?? ""}${index === events.length - 1 ? " latest" : ""}`}
              aria-current={index === events.length - 1 ? "step" : undefined}
              data-event-kind={event.kind}
            >
              <time dateTime={event.timestamp}>
                {formatTimestamp(event.timestamp)}
              </time>
              <div>
                <strong>{event.title}</strong>
                <span>{event.detail}</span>
                {event.actor && <small>Actor: {event.actor}</small>}
                {pdf(event)}
              </div>
              {event.state && (
                <span className="timeline-state">{event.state}</span>
              )}
            </li>
          ))}
          <li className="not-yet-divider" role="separator" aria-label="Not yet">
            <span>Not yet</span>
          </li>
          {ghosts.length ? (
            ghosts.map((ghost) => (
              <li
                key={ghost.id}
                className="timeline-event ghost"
                data-ghost-kind={ghost.kind}
              >
                <div>
                  <strong>{ghost.title}</strong>
                  <span>{ghost.reason}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="timeline-event ghost none">
              <div>
                <span>Nothing outstanding.</span>
              </div>
            </li>
          )}
        </ol>
      </section>
    </>
  );
}
~~~

## CMP-App-JobDocuments

src/App.tsx:15491-15633

~~~tsx
function JobDocuments({
  view,
  actor,
  mutate,
  editor: controlledEditor,
  setEditor: setControlledEditor,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  editor?: DocumentEditor;
  setEditor?: (editor: DocumentEditor) => void;
}) {
  const [localEditor, setLocalEditor] = useState<DocumentEditor>();
  const editor = setControlledEditor ? controlledEditor : localEditor;
  const setEditor = setControlledEditor ?? setLocalEditor;
  const documents = resolveJobDocuments(view, loadDocumentSnapshots());
  return (
    <>
      <div className="document-center">
        {documents.length ? (
          documents.map((document) => {
            const actions =
              document.state === "void"
                ? ["download" as const]
                : resolveJobDocumentActions(document.kind, view, actor);
            return (
              <div
                className={`document-row ${document.available ? "available" : "missing"}`}
                key={document.snapshotId ?? document.kind}
              >
                <div className="document-summary">
                  <strong>{document.label}</strong>
                  <span>
                    {document.state === "void"
                      ? `${document.number} - void (frozen copy)`
                      : document.available
                        ? `${document.number ?? ""} ${document.state === "frozen" ? "- frozen" : "- ready"}`.trim()
                        : document.message}
                  </span>
                </div>
                <div
                  className="document-actions"
                  role="group"
                  aria-label={`${document.label} actions`}
                >
                  {actions.includes("create-estimate") && (
                    <button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("estimate")}
                    >
                      <Plus size={15} />
                      Create Estimate
                    </button>
                  )}
                  {actions.includes("edit-estimate") && (
                    <button
                      type="button"
                      className="workflow-action action-secondary"
                      onClick={() => setEditor("estimate")}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}
                  {actions.includes("approve-estimate") && (
                    <button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("approve-estimate")}
                    >
                      <Check size={15} />
                      Approve Estimate
                    </button>
                  )}
                  {actions.includes("create-invoice") && (
                    <button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("invoice")}
                    >
                      <Plus size={15} />
                      Create Invoice
                    </button>
                  )}
                  {actions.includes("edit-invoice") && (
                    <button
                      type="button"
                      className="workflow-action action-secondary"
                      onClick={() => setEditor("invoice")}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}
                  {actions.includes("download") && (
                    <DocumentDownloadButton
                      kind={document.kind}
                      view={view}
                      snapshotId={document.snapshotId}
                      className="workflow-action action-document document-download"
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="empty-state">
            No documents are available for this job.
          </p>
        )}
      </div>
      {editor === "estimate" && (
        <EstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
      )}
      {editor === "approve-estimate" && (
        <ApproveEstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
      )}
      {editor === "invoice" && (
        <InvoiceDialog
          fixedJob
          action={view.invoice ? "edit" : "create"}
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
      )}
    </>
  );
}
~~~

## CMP-App-AddJobCardDialog

src/App.tsx:15635-15947

~~~tsx
function AddJobCardDialog({
  state,
  mutate,
  actor,
  onClose,
}: {
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  onClose: () => void;
}) {
  const advisors = state.users.filter((item) => item.role === "service");
  const [customerId, setCustomerId] = useState<number>(0);
  const [vehicleId, setVehicleId] = useState<number>(0);
  const [advisorId, setAdvisorId] = useState<number>(
    actor.role === "service" ? actor.id : (advisors[0]?.id ?? 0),
  );
  const [form, setForm] = useState({
    requestedWork: "",
    odoReading: "",
    fuelLevelValue: "",
    fuelLevelUnit: "bars" as "bars" | "%" | "litres" | "Other",
    keys: "",
    accessories: "",
  });
  const [quickAdd, setQuickAdd] = useState<
    "customer" | "vehicle" | undefined
  >();
  const [awaiting, setAwaiting] = useState<
    "customer" | "vehicle" | undefined
  >();
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    type: "Individual",
  });
  const [error, setError] = useState("");
  const customer = state.customers.find((item) => item.id === customerId);
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  const vehicleOptions = state.vehicles.filter(
    (item) => !customerId || item.customer_id === customerId,
  );
  useEffect(() => {
    if (awaiting === "customer") {
      const latest = state.customers.reduce(
        (max, item) => Math.max(max, item.id),
        0,
      );
      if (latest && latest !== customerId) {
        setCustomerId(latest);
        setVehicleId(0);
        setAwaiting(undefined);
      }
    }
    if (awaiting === "vehicle") {
      const latest = state.vehicles.reduce(
        (max, item) => (item.id > max.id ? item : max),
        state.vehicles[0] ?? ({ id: 0, customer_id: 0 } as Vehicle),
      );
      if (latest.id && latest.id !== vehicleId) {
        setVehicleId(latest.id);
        setCustomerId(latest.customer_id);
        setAwaiting(undefined);
      }
    }
  }, [state.customers, state.vehicles, awaiting]); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = (event: FormEvent) => {
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
  };
  return (
    <Dialog
      wide
      title="Add Job Card"
      subtitle="Check in a vehicle with its ODO and fuel or battery level"
      onClose={onClose}
      footer={
        <button form="add-job-card-form" className="primary-action">
          Create Job Card
        </button>
      }
    >
      <form id="add-job-card-form" onSubmit={submit}>
        <div className="form-grid">
          <div className="field-with-action">
            <SearchSelect
              label="Customer"
              options={state.customers.map((item) => ({
                value: item.id,
                label: `${item.name} / ${item.mobile}`,
              }))}
              value={customerId || undefined}
              onChange={(value) => {
                setCustomerId(Number(value));
                setVehicleId(0);
              }}
              placeholder="Search customer or mobile"
            />
            <button
              type="button"
              className="link-action"
              onClick={() => setQuickAdd("customer")}
            >
              + Add new customer
            </button>
          </div>
          <div className="field-with-action">
            <SearchSelect
              label="Vehicle"
              options={vehicleOptions.map((item) => ({
                value: item.id,
                label: `${item.number} / ${item.make} ${item.model}`,
              }))}
              value={vehicleId || undefined}
              onChange={(value) => setVehicleId(Number(value))}
              placeholder="Search registration or model"
            />
            <button
              type="button"
              className="link-action"
              onClick={() => setQuickAdd("vehicle")}
            >
              + Add new vehicle
            </button>
          </div>
          <label>
            Service advisor
            <select
              value={advisorId}
              disabled={actor.role === "service"}
              onChange={(event) => setAdvisorId(Number(event.target.value))}
            >
              {advisors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            ODO Meter Reading (km)
            <input
              required
              min="0"
              type="number"
              inputMode="numeric"
              placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`}
              value={form.odoReading}
              onChange={(event) =>
                setForm({ ...form, odoReading: event.target.value })
              }
            />
          </label>
          <label>
            Fuel/Battery Level
            <div className="field-pair">
              <input
                required
                placeholder="Value"
                value={form.fuelLevelValue}
                onChange={(event) =>
                  setForm({ ...form, fuelLevelValue: event.target.value })
                }
              />
              <select
                aria-label="Fuel or battery unit"
                value={form.fuelLevelUnit}
                onChange={(event) =>
                  setForm({
                    ...form,
                    fuelLevelUnit: event.target
                      .value as typeof form.fuelLevelUnit,
                  })
                }
              >
                <option value="bars">bars</option>
                <option value="%">%</option>
                <option value="litres">litres</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </label>
          <label>
            Keys
            <input
              value={form.keys}
              onChange={(event) =>
                setForm({ ...form, keys: event.target.value })
              }
            />
          </label>
          <label>
            Accessories
            <input
              value={form.accessories}
              onChange={(event) =>
                setForm({ ...form, accessories: event.target.value })
              }
            />
          </label>
        </div>
        <label>
          Requested work
          <input
            required
            value={form.requestedWork}
            onChange={(event) =>
              setForm({ ...form, requestedWork: event.target.value })
            }
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </form>
      {quickAdd === "customer" && (
        <Dialog title="Add Customer" onClose={() => setQuickAdd(undefined)}>
          <CustomerEditor
            embedded
            value={newCustomer}
            setValue={setNewCustomer}
            mutate={mutate}
            onSaved={() => {
              setAwaiting("customer");
              setQuickAdd(undefined);
              setNewCustomer({
                id: 0,
                name: "",
                mobile: "",
                type: "Individual",
              });
            }}
          />
        </Dialog>
      )}
      {quickAdd === "vehicle" && (
        <Dialog title="Add Vehicle" onClose={() => setQuickAdd(undefined)}>
          <VehicleMasterPanel
            embedded
            state={state}
            value={{
              id: 0,
              customer_id: customerId || state.customers[0]?.id || 0,
              number: "",
              make: "",
              model: "",
              color: "",
              km: 0,
            }}
            setValue={() => undefined}
            mutate={mutate}
            onSaved={() => {
              setAwaiting("vehicle");
              setQuickAdd(undefined);
            }}
          />
        </Dialog>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-JobBodyMarkPanel

src/App.tsx:15949-16014

~~~tsx
function JobBodyMarkPanel({
  view,
  actor,
  mutate,
  editable,
}: {
  view: JobView;
  actor: User;
  mutate: Mutate;
  editable: boolean;
}) {
  const [marks, setMarks] = useState(() =>
    parseDamageMarks(view.job.damage_marks),
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(true);
  const save = () => {
    setError("");
    if (
      mutate(
        (db) => setDamageMarksForActor(db, view.job.id, actor.id, marks),
        setError,
      )
    )
      setSaved(true);
  };
  return (
    <section className="editor-block body-mark-tab" aria-label="Body mark">
      <BodyMarkDiagram
        marks={marks}
        onChange={
          editable
            ? (next) => {
                setMarks(next);
                setSaved(false);
              }
            : undefined
        }
        meta={{
          jobNo: view.job.job_no,
          vehicleName: `${view.vehicle.make} ${view.vehicle.model}`.trim(),
          color: view.vehicle.color,
          regNo: view.vehicle.number,
          recordedAt: view.job.damage_marks_recorded_at,
        }}
      />
      {editable && (
        <div className="action-row">
          <button
            type="button"
            className="primary-action"
            disabled={saved}
            onClick={save}
          >
            {saved ? "Marks saved" : "Save Body Marks"}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </section>
  );
}
~~~

## CMP-App-JobRecordDialog

src/App.tsx:16016-16258

~~~tsx
function JobRecordDialog({
  view,
  state,
  mutate,
  actor,
  mode,
  onClose,
  onAdminArchive,
  historical = false,
}: {
  view: JobView;
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  mode: "view" | "edit";
  onClose: () => void;
  onAdminArchive?: () => boolean;
  historical?: boolean;
}) {
  const [tab, setTab] = useState<JobCardTabKey>("details");
  const [documentEditor, setDocumentEditor] = useState<DocumentEditor>();
  const { saved, onSaveResult } = useJobDetailsSaveNotice();
  const archive = () => {
    if (
      !onAdminArchive ||
      !window.confirm(
        `Archive Job ${view.job.job_no}? This will cancel the job card.`,
      )
    )
      return;
    if (onAdminArchive()) onClose();
  };
  const panelId = `job-record-${view.job.id}-${tab}`;
  if (historical)
    return (
      <Dialog
        wide
        className="dialog-job"
        title={`Archived Job ${view.job.job_no}`}
        subtitle={`${view.vehicle.number} · ${view.customer.name}`}
        onClose={onClose}
      >
        <div className="record-view">
          <p className="permission-note">Read-only historical record.</p>
          <Info label="Archived on" value={view.job.archived_at ?? "—"} />
          <Info
            label="Archive reason"
            value={view.job.archived_reason ?? "—"}
          />
          <JobSnapshot view={view} />
          <Info label="Requested work" value={view.visit.requested_work} />
          <Info label="Advisor" value={view.advisor.name} />
          <Info label="Technician" value={view.technician.name} />
        </div>
      </Dialog>
    );
  return (
    <Dialog
      wide
      className="dialog-job"
      title={`${mode === "view" ? "View" : "Edit"} Job ${view.job.job_no}`}
      subtitle={`${view.vehicle.number} · ${view.customer.name}`}
      onClose={onClose}
    >
      {mode === "edit" && (
        <JobLifecyclePanel
          view={view}
          users={state.users}
          actor={actor}
          mutate={mutate}
          visible
        />
      )}
      <div
        className="sub-tabs"
        role="tablist"
        aria-label="Job record sections"
        onKeyDown={handleTabListKeyDown}
      >
        {JOB_CARD_TABS.map((item) => (
          <button
            id={`job-record-tab-${view.job.id}-${item.key}`}
            aria-controls={`job-record-${view.job.id}-${item.key}`}
            tabIndex={tab === item.key ? 0 : -1}
            key={item.key}
            role="tab"
            aria-selected={tab === item.key}
            className={tab === item.key ? "active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`job-record-tab-${view.job.id}-${tab}`}
      >
        {tab === "task-list" ? (
          <JobTaskListPanel
            view={view}
            catalog={state.service_catalog}
            actor={actor}
            mutate={mutate}
          />
        ) : tab === "documents" ? (
          <section
            className="editor-block job-card-documents"
            aria-label="Current job documents"
          >
            <JobDocuments
              view={view}
              actor={actor}
              mutate={mutate}
              editor={documentEditor}
              setEditor={setDocumentEditor}
            />
          </section>
        ) : tab === "bodymark" ? (
          <JobBodyMarkPanel
            view={view}
            actor={actor}
            mutate={mutate}
            editable={mode === "edit"}
          />
        ) : tab === "media" ? (
          <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} />
        ) : tab === "materials" ? (
          <JobMaterialsPanel
            view={view}
            inventory={state.inventory}
            actor={actor}
            mutate={mutate}
          />
        ) : tab === "payment" ? (
          <JobPaymentPanel view={view} actor={actor} mutate={mutate} />
        ) : tab === "invoice" ? (
          <JobInvoicePanel
            view={view}
            actor={actor}
            mutate={mutate}
            onOpen={() => setDocumentEditor("invoice")}
            onEstimate={() => setDocumentEditor("approve-estimate")}
          />
        ) : isStubTab(tab) ? (
          <p className="empty-state job-card-stub">
            {JOB_CARD_TABS.find((item) => item.key === tab)?.label} is coming
            soon.
          </p>
        ) : mode === "edit" ? (
          <>
            <JobEditor
              embedded
              key={view.job.updated_at}
              view={view}
              users={state.users}
              mutate={mutate}
              actor={actor}
              saved={saved}
              onSaveResult={onSaveResult}
            />
            <JobSheetSection
              key={`sheet-${view.job.updated_at}`}
              view={view}
              actor={actor}
              mutate={mutate}
              editable
            />
            {onAdminArchive && (
              <div className="admin-archive-action">
                <button
                  type="button"
                  className="danger-action"
                  onClick={archive}
                >
                  Archive Job
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="record-view">
            <JobSnapshot view={view} />
            <Info label="Requested work" value={view.visit.requested_work} />
            <Info label="Work completed" value={view.job.work_list || "—"} />
            <Info label="Advisor" value={view.advisor.name} />
            <Info label="Technician" value={view.technician.name} />
            <JobSheetSection view={view} actor={actor} mutate={mutate} />
          </div>
        )}
        {tab === "details" && (
          <section
            className="editor-block job-card-documents job-documents-block"
            aria-label="Current job documents"
          >
            <h4>Current Documents</h4>
            <p className="muted">Only active records are available</p>
            <JobDocuments
              view={view}
              actor={actor}
              mutate={mutate}
              editor={documentEditor}
              setEditor={setDocumentEditor}
            />
          </section>
        )}
      </div>
      {tab !== "documents" &&
        tab !== "details" &&
        documentEditor === "estimate" && (
          <EstimateDialog
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
        )}
      {tab !== "documents" &&
        tab !== "details" &&
        documentEditor === "approve-estimate" && (
          <ApproveEstimateDialog
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
        )}
      {tab !== "documents" &&
        tab !== "details" &&
        documentEditor === "invoice" && (
          <InvoiceDialog
            fixedJob
            action={view.invoice ? "edit" : "create"}
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
        )}
    </Dialog>
  );
}
~~~

## CMP-App-JobTaskListPanel

src/App.tsx:16260-16488

~~~tsx
function JobTaskListPanel({
  view,
  catalog,
  actor,
  mutate,
}: {
  view: JobView;
  catalog: WorkshopState["service_catalog"];
  actor: User;
  mutate: Mutate;
}) {
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState("");
  const [rate, setRate] = useState(0);
  const [error, setError] = useState("");
  const editable =
    (view.job.main_status === "NEW" ||
      view.job.main_status === "IN_PROGRESS") &&
    (actor.role === "admin" ||
      (actor.role === "service" && actor.id === view.job.advisor_id));
  const matches = catalog.filter((item) =>
    normalizeSearch(item.name).includes(normalizeSearch(query)),
  );
  const run = (action: (db: Database) => unknown) => mutate(action, setError);
  return (
    <section className="editor-block" aria-label="Task List">
      <div className="panel-actions">
        <div>
          <h3>Task List</h3>
          <p>Operational checklist items use pre-GST rates.</p>
        </div>
        {editable && view.estimate?.status !== "Approved" && (
          <button
            type="button"
            className="primary-action"
            onClick={() =>
              run((db) =>
                prefillEstimateFromTaskListForActor(db, view.job.id, actor.id),
              )
            }
          >
            Prefill Estimate
          </button>
        )}
      </div>
      {view.estimate?.status === "Approved" && (
        <p className="permission-note">
          Estimate is approved; the checklist can still be updated.
        </p>
      )}
      {editable && (
        <div className="task-list-add">
          <label>
            Search catalog
            <input
              aria-label="Search service catalog"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service"
            />
          </label>
          {query && (
            <div className="action-row">
              {matches.map((item) => (
                <button
                  type="button"
                  className="secondary-action"
                  key={item.id}
                  onClick={() =>
                    run((db) =>
                      addJobTaskListItemForActor(db, view.job.id, actor.id, {
                        service_catalog_item_id: item.id,
                      }),
                    )
                  }
                >
                  Add {item.name} · {money(item.base_rate)}
                </button>
              ))}
            </div>
          )}
          <label>
            Manual task
            <input
              aria-label="Manual task name"
              value={manual}
              onChange={(event) => setManual(event.target.value)}
            />
          </label>
          <label>
            Pre-GST rate
            <input
              aria-label="Manual task rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              if (
                run((db) =>
                  addJobTaskListItemForActor(db, view.job.id, actor.id, {
                    name: manual,
                    base_rate: rate,
                  }),
                )
              ) {
                setManual("");
                setRate(0);
              }
            }}
          >
            Add manual task
          </button>
        </div>
      )}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <div className="table-wrap">
        <table aria-label="Job task list">
          <thead>
            <tr>
              <th>Done</th>
              <th>Task</th>
              <th>Pre-GST rate</th>
              {editable && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {view.task_list_items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    aria-label={`${item.name} done`}
                    type="checkbox"
                    checked={Boolean(item.done)}
                    disabled={!editable}
                    onChange={(event) =>
                      run((db) =>
                        updateJobTaskListItemForActor(db, item.id, actor.id, {
                          name: item.name,
                          base_rate: item.base_rate,
                          done: event.target.checked ? 1 : 0,
                        }),
                      )
                    }
                  />
                </td>
                <td>
                  {editable ? (
                    <input
                      aria-label={`${item.name} name`}
                      value={item.name}
                      onChange={(event) =>
                        run((db) =>
                          updateJobTaskListItemForActor(db, item.id, actor.id, {
                            name: event.target.value,
                            base_rate: item.base_rate,
                            done: item.done,
                          }),
                        )
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      aria-label={`${item.name} rate`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.base_rate}
                      onChange={(event) =>
                        run((db) =>
                          updateJobTaskListItemForActor(db, item.id, actor.id, {
                            name: item.name,
                            base_rate: Number(event.target.value),
                            done: item.done,
                          }),
                        )
                      }
                    />
                  ) : (
                    money(item.base_rate)
                  )}
                </td>
                {editable && (
                  <td>
                    <button
                      type="button"
                      className="danger-action"
                      onClick={() =>
                        run((db) =>
                          archiveJobTaskListItemForActor(db, item.id, actor.id),
                        )
                      }
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!view.task_list_items.length && (
        <p className="empty-state">No task-list items yet.</p>
      )}
      {!editable && (
        <p className="permission-note">
          Read-only. Only the Owner or linked Service Advisor can edit active
          NEW and IN_PROGRESS jobs.
        </p>
      )}
    </section>
  );
}
~~~

## CMP-App-CustomerRecordDialog

src/App.tsx:16490-16558

~~~tsx
function CustomerRecordDialog({
  customer,
  state,
  mutate,
  mode,
  onClose,
}: {
  customer: Customer;
  state: WorkshopState;
  mutate: Mutate;
  mode: "view" | "edit";
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(customer);
  const vehicles = [...state.vehicles, ...state.archived_vehicles].filter(
    (vehicle) => vehicle.customer_id === customer.id,
  );
  const jobs = [...state.jobs, ...state.archived_jobs].filter(
    (view) => view.customer.id === customer.id,
  );
  return (
    <Dialog
      wide
      title={`${mode === "view" ? "View" : "Edit"} Customer`}
      subtitle={`${customer.name} · ${customer.mobile}`}
      onClose={onClose}
    >
      {mode === "edit" ? (
        <CustomerEditor
          embedded
          value={draft}
          setValue={setDraft}
          mutate={mutate}
          onSaved={onClose}
        />
      ) : (
        <div className="record-view">
          {customer.archived_at && (
            <>
              <p className="permission-note">Read-only archived record.</p>
              <Info label="Archived on" value={customer.archived_at} />
              <Info
                label="Archive reason"
                value={customer.archived_reason ?? "—"}
              />
            </>
          )}
          <Info label="Customer type" value={customer.type} />
          <Info label="Vehicles" value={vehicles.length} />
          {vehicles.map((vehicle) => (
            <Info
              key={vehicle.id}
              label={vehicle.number}
              value={`${vehicle.make} ${vehicle.model}`}
            />
          ))}
          <Info label="Jobs" value={jobs.length} />
          {jobs.map((view) => (
            <Info
              key={view.job.id}
              label={view.job.job_no}
              value={`${view.vehicle.number} · ${view.job.main_status}`}
            />
          ))}
        </div>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-VehicleRecordDialog

src/App.tsx:16560-16634

~~~tsx
function VehicleRecordDialog({
  vehicle,
  state,
  mutate,
  mode,
  onClose,
}: {
  vehicle: Vehicle;
  state: WorkshopState;
  mutate: Mutate;
  mode: "view" | "edit";
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(vehicle);
  const owner = [...state.customers, ...state.archived_customers].find(
    (customer) => customer.id === vehicle.customer_id,
  );
  const jobs = [...state.jobs, ...state.archived_jobs].filter(
    (view) => view.vehicle.id === vehicle.id,
  );
  return (
    <Dialog
      wide
      title={`${mode === "view" ? "View" : "Edit"} Vehicle`}
      subtitle={`${vehicle.number} · ${vehicle.make} ${vehicle.model}`}
      onClose={onClose}
    >
      {mode === "edit" ? (
        <VehicleMasterPanel
          embedded
          state={state}
          value={draft}
          setValue={setDraft}
          mutate={mutate}
          onSaved={onClose}
        />
      ) : (
        <div className="record-view">
          {vehicle.archived_at && (
            <>
              <p className="permission-note">Read-only archived record.</p>
              <Info label="Archived on" value={vehicle.archived_at} />
              <Info
                label="Archive reason"
                value={vehicle.archived_reason ?? "—"}
              />
            </>
          )}
          <Info label="Registration" value={vehicle.number} />
          <Info
            label="Make / model"
            value={`${vehicle.make} ${vehicle.model}`}
          />
          <Info label="Color" value={vehicle.color} />
          <Info
            label="Odometer"
            value={`${vehicle.km.toLocaleString("en-IN")} km`}
          />
          <Info
            label="Owner"
            value={owner ? `${owner.name} · ${owner.mobile}` : "—"}
          />
          <Info label="Linked jobs" value={jobs.length} />
          {jobs.map((view) => (
            <Info
              key={view.job.id}
              label={view.job.job_no}
              value={`${view.job.main_status} · ${view.visit.received_at.slice(0, 10)}`}
            />
          ))}
        </div>
      )}
    </Dialog>
  );
}
~~~

## CMP-App-Timeline

src/App.tsx:16636-16671

~~~tsx
function Timeline({ view, users = [] }: { view: JobView; users?: User[] }) {
  const events = buildDataFlowTimeline(view, users);
  return (
    <section
      className="data-flow-timeline"
      aria-label="Chronological data flow"
    >
      <PanelTitle
        icon={<ClipboardCheck />}
        title="Chronological Data Flow"
        subtitle={`${events.length} event${events.length === 1 ? "" : "s"}`}
      />
      <ol>
        {events.map((event) => (
          <li
            key={event.id}
            className={`timeline-event ${event.state ?? ""}`}
            data-event-kind={event.kind}
          >
            <time dateTime={event.timestamp}>
              {formatTimestamp(event.timestamp)}
            </time>
            <div>
              <strong>{event.title}</strong>
              <span>{event.detail}</span>
              {event.actor && <small>Actor: {event.actor}</small>}
            </div>
            {event.state && (
              <span className="timeline-state">{event.state}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
~~~

## CMP-App-JobSnapshot

src/App.tsx:16673-16691

~~~tsx
function JobSnapshot({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info
        label="Customer"
        value={`${view.customer.name} / ${view.customer.mobile}`}
      />
      <Info
        label="Vehicle"
        value={`${view.vehicle.number} / ${view.vehicle.make} ${view.vehicle.model}`}
      />
      <Info label="Job Card" value={view.job.job_no} />
      <Info
        label="Status"
        value={`${view.job.main_status} / ${view.job.sub_status}`}
      />
    </div>
  );
}
~~~

## CMP-App-VisitEditor

src/App.tsx:16693-16756

~~~tsx
function VisitEditor({
  view,
  advisors,
  attendance,
  today,
  mutate,
}: {
  view: JobView;
  advisors: User[];
  attendance: WorkshopState["attendance"];
  today: string;
  mutate: Mutate;
}) {
  const [advisorId, setAdvisorId] = useState(view.job.advisor_id);
  const present = presentAdvisors(advisors, attendance, today);
  const ordered = [
    ...present,
    ...advisors.filter(
      (advisor) => !present.some((item) => item.id === advisor.id),
    ),
  ];
  const assigned = advisors.find(
    (advisor) => advisor.id === view.job.advisor_id,
  );
  const assignedAway =
    assigned && !present.some((advisor) => advisor.id === assigned.id);
  return (
    <div className="editor-block reception-advisor-editor">
      <div className="reception-advisor-action-row">
        <label>
          Advisor
          <select
            value={advisorId}
            onChange={(event) => setAdvisorId(Number(event.target.value))}
          >
            {advisorId === 0 && <option value={0}>Not mapped</option>}
            {ordered.map((advisor) => (
              <option key={advisor.id} value={advisor.id}>
                {advisor.name}
                {present.some((item) => item.id === advisor.id)
                  ? " (Present)"
                  : " (Away)"}
              </option>
            ))}
          </select>
        </label>
        <button
          className="primary-action"
          disabled={!advisorId || advisorId === view.job.advisor_id}
          onClick={() =>
            mutate((db) => assignAdvisor(db, view.job.id, advisorId))
          }
        >
          {view.job.advisor_id ? "Update Advisor" : "Assign Advisor"}
        </button>
      </div>
      {assignedAway && (
        <p className="permission-note">
          {assigned.name} is away today but remains assigned.
        </p>
      )}
    </div>
  );
}
~~~

## CMP-App-DuplicateCustomerEditor

src/App.tsx:16758-16826

~~~tsx
function DuplicateCustomerEditor({
  value,
  setValue,
  mutate,
}: {
  value: Customer;
  setValue: (value: Customer) => void;
  mutate: Mutate;
}) {
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<UserRound />}
        title="Customer Editor"
        subtitle="Update selected customer"
      />
      <label>
        Name
        <input
          value={value.name}
          onChange={(event) => setValue({ ...value, name: event.target.value })}
        />
      </label>
      <label>
        Mobile
        <input
          value={value.mobile}
          onChange={(event) =>
            setValue({ ...value, mobile: event.target.value })
          }
        />
      </label>
      <label>
        Type
        <input
          value={value.type}
          onChange={(event) => setValue({ ...value, type: event.target.value })}
        />
      </label>
      <div className="action-row">
        <button
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              updateCustomer(db, value.id, {
                name: value.name,
                mobile: value.mobile,
                type: value.type,
              }),
            )
          }
        >
          Save Customer
        </button>
        <button
          className="danger-action"
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              archiveCustomer(db, value.id, "Archived from customer desk"),
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  );
}
~~~

## CMP-App-DuplicateVehicleMasterPanel

src/App.tsx:16828-16937

~~~tsx
function DuplicateVehicleMasterPanel({
  state,
  value,
  setValue,
  mutate,
}: {
  state: WorkshopState;
  value: Vehicle;
  setValue: (value: Vehicle) => void;
  mutate: Mutate;
}) {
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<Car />}
        title="Vehicle Editor"
        subtitle="Update selected vehicle"
      />
      <label>
        Customer
        <select
          value={value.customer_id}
          onChange={(event) =>
            setValue({ ...value, customer_id: Number(event.target.value) })
          }
        >
          {state.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Number
        <input
          value={value.number}
          onChange={(event) =>
            setValue({ ...value, number: event.target.value })
          }
        />
      </label>
      <label>
        Make
        <input
          value={value.make}
          onChange={(event) => setValue({ ...value, make: event.target.value })}
        />
      </label>
      <label>
        Model
        <input
          value={value.model}
          onChange={(event) =>
            setValue({ ...value, model: event.target.value })
          }
        />
      </label>
      <label>
        Color
        <input
          value={value.color}
          onChange={(event) =>
            setValue({ ...value, color: event.target.value })
          }
        />
      </label>
      <label>
        KM
        <input
          type="number"
          value={value.km}
          onChange={(event) =>
            setValue({ ...value, km: Number(event.target.value) })
          }
        />
      </label>
      <div className="action-row">
        <button
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              updateVehicle(db, value.id, {
                customer_id: value.customer_id,
                number: value.number,
                make: value.make,
                model: value.model,
                color: value.color,
                km: value.km,
              }),
            )
          }
        >
          Save Vehicle
        </button>
        <button
          className="danger-action"
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              archiveVehicle(db, value.id, "Archived from vehicle desk"),
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  );
}
~~~

## CMP-App-DuplicateEstimateEditor

src/App.tsx:16939-17017

~~~tsx
function DuplicateEstimateEditor({
  view,
  mutate,
}: {
  view: JobView;
  mutate: Mutate;
}) {
  const estimateId = view.estimate?.id;
  const [draft, setDraft] = useState({
    kind: "Service" as EstimateItem["kind"],
    description: "Additional work",
    qty: 1,
    rate: 1000,
  });
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ReceiptText />}
        title="Estimate Items"
        subtitle="Edit line items"
      />
      {view.estimate_items.map((item) => (
        <div className="request-line" key={item.id}>
          <Info label={item.description} value={money(item.qty * item.rate)} />
          <button
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveEstimateItem(db, item.id, "Removed from estimate"),
              )
            }
          >
            Archive Item
          </button>
        </div>
      ))}
      <label>
        Description
        <input
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
        />
      </label>
      <label>
        Qty
        <input
          type="number"
          value={draft.qty}
          onChange={(event) =>
            setDraft({ ...draft, qty: Number(event.target.value) })
          }
        />
      </label>
      <label>
        Rate
        <input
          type="number"
          value={draft.rate}
          onChange={(event) =>
            setDraft({ ...draft, rate: Number(event.target.value) })
          }
        />
      </label>
      <button
        disabled={!estimateId}
        onClick={() =>
          estimateId &&
          mutate((db) =>
            createEstimateItem(db, { estimate_id: estimateId, ...draft }),
          )
        }
      >
        Add Item
      </button>
    </div>
  );
}
~~~

## CMP-App-DuplicateFollowupEditor

src/App.tsx:17019-17081

~~~tsx
function DuplicateFollowupEditor({
  view,
  mutate,
}: {
  view: JobView;
  mutate: Mutate;
}) {
  const [note, setNote] = useState("Customer update required");
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ClipboardCheck />}
        title="Follow-ups"
        subtitle="Customer touchpoints"
      />
      {view.followups.map((followup) => (
        <div className="request-line" key={followup.id}>
          <Info label={followup.due_at} value={followup.note} />
          <div className="action-row">
            <button
              onClick={() =>
                mutate((db) =>
                  markFollowupDone(db, followup.id, followup.outcome || "Done"),
                )
              }
            >
              Done
            </button>
            <button
              className="danger-action"
              onClick={() =>
                mutate((db) =>
                  archiveFollowup(db, followup.id, "Removed follow-up"),
                )
              }
            >
              Archive
            </button>
          </div>
        </div>
      ))}
      <label>
        New note
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button
        onClick={() =>
          mutate((db) =>
            createFollowup(db, {
              job_card_id: view.job.id,
              note,
              due_at: new Date().toISOString().slice(0, 10),
              done: 0,
              outcome: "",
            }),
          )
        }
      >
        Add Follow-up
      </button>
    </div>
  );
}
~~~

## CMP-App-DuplicateTimeline

src/App.tsx:17083-17094

~~~tsx
function DuplicateTimeline({ view }: { view: JobView }) {
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<ClipboardList />}
        title="Timeline"
        subtitle="Current linked records"
      />
      <LinkedRecords view={view} />
    </div>
  );
}
~~~

## CMP-App-DuplicateJobEditor

src/App.tsx:17096-17195

~~~tsx
function DuplicateJobEditor({
  view,
  users,
  mutate,
  allowStatus,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
  allowStatus: boolean;
}) {
  const [workList, setWorkList] = useState(view.job.work_list);
  const [advisorId, setAdvisorId] = useState(view.job.advisor_id);
  const [technicianId, setTechnicianId] = useState(view.job.technician_id);
  const [mainStatus, setMainStatus] = useState<MainStatus>(
    view.job.main_status,
  );
  const [subStatus, setSubStatus] = useState<SubStatus>(view.job.sub_status);
  return (
    <div className="editor-block">
      <label>
        Work List
        <input
          value={workList}
          onChange={(event) => setWorkList(event.target.value)}
        />
      </label>
      <label>
        Advisor
        <select
          value={advisorId}
          onChange={(event) => setAdvisorId(Number(event.target.value))}
        >
          {users
            .filter((item) => item.role === "service")
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Technician
        <select
          value={technicianId}
          onChange={(event) => setTechnicianId(Number(event.target.value))}
        >
          {users
            .filter((item) => item.role === "tech")
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </label>
      {allowStatus && (
        <label>
          Status
          <select
            value={mainStatus}
            onChange={(event) =>
              setMainStatus(event.target.value as MainStatus)
            }
          >
            <option>NEW</option>
            <option>IN_PROGRESS</option>
            <option>COMPLETED</option>
            <option>CLOSED</option>
          </select>
        </label>
      )}
      {allowStatus && (
        <label>
          Sub Status
          <input
            value={subStatus}
            onChange={(event) => setSubStatus(event.target.value as SubStatus)}
          />
        </label>
      )}
      <button
        onClick={() =>
          mutate((db) =>
            updateJobCard(db, view.job.id, {
              advisor_id: advisorId,
              technician_id: technicianId,
              main_status: mainStatus,
              sub_status: subStatus,
              work_list: workList,
            }),
          )
        }
      >
        Save Job Card
      </button>
    </div>
  );
}
~~~

## CMP-App-DuplicateLinkedRecords

src/App.tsx:17197-17207

~~~tsx
function DuplicateLinkedRecords({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info label="Estimate Items" value={view.estimate_items.length} />
      <Info label="Material Requests" value={view.material_requests.length} />
      <Info label="Tasks" value={view.tasks.length} />
      <Info label="Payments" value={view.payments.length} />
      <Info label="QC" value={view.job.qc_status} />
    </div>
  );
}
~~~

## CMP-App-DuplicateInventoryEditor

src/App.tsx:17209-17316

~~~tsx
function DuplicateInventoryEditor({
  state,
  mutate,
}: {
  state: WorkshopState;
  mutate: Mutate;
}) {
  const first = state.inventory[0] ?? {
    ...emptyInventoryItem(),
    sku: "SKU",
    category: "General",
    name: "New Item",
    unit: "unit",
  };
  const [item, setItem] = useState<InventoryItem>(first);
  const [qty, setQty] = useState(1);
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<Boxes />}
        title="Inventory Editor"
        subtitle="Stock in, adjust, edit and archive"
      />
      <label>
        Item
        <select
          value={item.id}
          onChange={(event) =>
            setItem(
              state.inventory.find(
                (next) => next.id === Number(event.target.value),
              ) ?? item,
            )
          }
        >
          {state.inventory.map((next) => (
            <option key={next.id} value={next.id}>
              {next.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Name
        <input
          value={item.name}
          onChange={(event) => setItem({ ...item, name: event.target.value })}
        />
      </label>
      <label>
        Quantity
        <input
          type="number"
          value={qty}
          onChange={(event) => setQty(Number(event.target.value))}
        />
      </label>
      <div className="action-row">
        <button
          onClick={() => mutate((db) => updateInventoryItem(db, item.id, item))}
        >
          Save Item
        </button>
        <button
          onClick={() =>
            mutate((db) => stockIn(db, item.id, qty, "Manual stock-in"))
          }
        >
          Stock In
        </button>
        <button
          onClick={() =>
            mutate((db) => adjustStock(db, item.id, qty, "Manual adjustment"))
          }
        >
          Adjust
        </button>
        <button
          onClick={() =>
            mutate((db) =>
              createInventoryItem(db, {
                sku: `${item.sku}-NEW`,
                category: item.category,
                name: item.name,
                unit: item.unit,
                stock_qty: qty,
                low_stock_qty: item.low_stock_qty,
                selling_price: item.selling_price,
              }),
            )
          }
        >
          Duplicate New
        </button>
        <button
          className="danger-action"
          onClick={() =>
            mutate((db) =>
              archiveInventoryItem(db, item.id, "Archived from stock desk"),
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  );
}
~~~

## CMP-App-DuplicateMaterialRequestEditor

src/App.tsx:17318-17326

~~~tsx
function DuplicateMaterialRequestEditor({
  state,
  mutate,
}: {
  state: WorkshopState;
  mutate: Mutate;
}) {
  return <MaterialRequestEditor state={state} mutate={mutate} store />;
}
~~~

## CMP-App-DuplicateReconcileEditor

src/App.tsx:17328-17395

~~~tsx
function DuplicateReconcileEditor({
  requests,
  mutate,
}: {
  requests: { request: MaterialRequest; item?: InventoryItem }[];
  mutate: Mutate;
}) {
  const first = requests[0]?.request;
  const [requestId, setRequestId] = useState(first?.id ?? 0);
  const [used, setUsed] = useState(first?.used_qty ?? 0);
  const [returned, setReturned] = useState(first?.returned_qty ?? 0);
  const [wasted, setWasted] = useState(first?.wasted_qty ?? 0);
  return (
    <div className="desk-panel">
      <PanelTitle
        icon={<Check />}
        title="Reconcile"
        subtitle="Used, returned and wasted quantity"
      />
      <label>
        Request
        <select
          value={requestId}
          onChange={(event) => setRequestId(Number(event.target.value))}
        >
          {requests.map(({ request, item }) => (
            <option key={request.id} value={request.id}>
              {item?.name ?? request.id}
            </option>
          ))}
        </select>
      </label>
      <label>
        Used
        <input
          type="number"
          value={used}
          onChange={(event) => setUsed(Number(event.target.value))}
        />
      </label>
      <label>
        Returned
        <input
          type="number"
          value={returned}
          onChange={(event) => setReturned(Number(event.target.value))}
        />
      </label>
      <label>
        Wasted
        <input
          type="number"
          value={wasted}
          onChange={(event) => setWasted(Number(event.target.value))}
        />
      </label>
      <button
        onClick={() =>
          mutate((db) =>
            reconcileMaterialQty(db, requestId, used, returned, wasted),
          )
        }
      >
        Save Reconcile
      </button>
    </div>
  );
}
~~~

## CMP-App-DuplicateTaskCreator

src/App.tsx:17397-17435

~~~tsx
function DuplicateTaskCreator({
  view,
  users,
  mutate,
}: {
  view: JobView;
  users: User[];
  mutate: Mutate;
}) {
  const [title, setTitle] = useState("Workshop task");
  const techId =
    users.find((item) => item.role === "tech")?.id ?? view.job.technician_id;
  return (
    <div className="editor-block">
      <label>
        New Task
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <button
        onClick={() =>
          mutate((db) =>
            createTask(db, {
              job_card_id: view.job.id,
              technician_id: techId,
              title,
              status: "Pending",
              notes: "",
            }),
          )
        }
      >
        Add Task
      </button>
    </div>
  );
}
~~~

## CMP-App-DuplicateQcEditor

src/App.tsx:17437-17490

~~~tsx
function DuplicateQcEditor({
  view,
  technicianId,
  mutate,
}: {
  view: JobView;
  technicianId: number;
  mutate: Mutate;
}) {
  const [reason, setReason] = useState("Needs rework");
  return (
    <div className="editor-block">
      {view.qc_checks.map((check: QcCheck) => (
        <div className="request-line" key={check.id}>
          <Info
            label={check.label}
            value={check.passed ? "Pass" : check.fail_reason || "Pending"}
          />
          <div className="action-row">
            <button
              onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
            >
              Pass
            </button>
            <button
              onClick={() =>
                mutate((db) =>
                  updateQcCheck(
                    db,
                    check.id,
                    false,
                    reason || `Rework: ${technicianId}`,
                  ),
                )
              }
            >
              Fail
            </button>
          </div>
        </div>
      ))}
      <label>
        Fail reason
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <button onClick={() => mutate((db) => passQc(db, view.job.id))}>
        Pass All QC
      </button>
    </div>
  );
}
~~~

## CMP-App-DuplicateInvoiceSummary

src/App.tsx:17492-17509

~~~tsx
function DuplicateInvoiceSummary({ view }: { view: JobView }) {
  return (
    <div className="snapshot">
      <Info
        label="Invoice"
        value={view.invoice?.invoice_no || "Not generated"}
      />
      <Info
        label="Total"
        value={money(
          view.invoice?.total ??
            invoiceItemsTotal(view.estimate_items, view.estimate),
        )}
      />
      <Info label="Payment" value={paymentStatus(view)} />
    </div>
  );
}
~~~

## CMP-App-DuplicateDataFlow

src/App.tsx:17511-17534

~~~tsx
function DuplicateDataFlow({ view }: { view: JobView }) {
  const steps = [
    "Visit",
    "Estimate",
    "Job Card",
    "Material",
    "Work",
    "QC",
    "Invoice",
    "Payment",
    "Gate Pass",
  ];
  return (
    <>
      {steps.map((step) => (
        <div key={step} className="flow-step">
          <Check size={16} />
          {step}
        </div>
      ))}
      <LinkedRecords view={view} />
    </>
  );
}
~~~

## CMP-App-JobCardFilterFields

src/App.tsx:17558-17593

~~~tsx
function JobCardFilterFields({
  jobs,
  values,
  onChange,
  onClear,
  showArchive = false,
  searchLabel = "Search job cards",
  variant,
}: {
  jobs: JobView[];
  values: JobCardFilterValues;
  onChange: (patch: Partial<JobCardFilterValues>) => void;
  onClear: () => void;
  showArchive?: boolean;
  searchLabel?: string;
  variant: "admin" | "search" | "service";
}) {
  const workflows = [...new Set(jobs.map((item) => item.job.sub_status))].sort();
  const advisors = [...new Map(jobs.map((item) => [item.advisor.id, item.advisor])).values()].sort((a, b) => a.name.localeCompare(b.name));
  const search = <label className="list-search job-card-search-filter">Search<input aria-label={searchLabel} value={values.search} placeholder="Job, vehicle, customer or mobile" onChange={(event) => onChange({ search: event.target.value })} /></label>;
  const status = <label className="job-card-status-filter">Main status<select aria-label="Main status" value={values.primary} onChange={(event) => onChange({ primary: event.target.value })}><option value="ALL">All statuses</option>{["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}</select></label>;
  const workflow = <label className="job-card-workflow-filter">Workflow<select aria-label="Workflow status" value={values.secondary} onChange={(event) => onChange({ secondary: event.target.value })}><option value="ALL">All workflows</option>{workflows.map((value) => <option key={value}>{value}</option>)}</select></label>;
  const deliveryDate = <label className="job-card-date-filter">Estimated Delivery Date<input aria-label="Estimated delivery date" type="date" value={values.date} onChange={(event) => onChange({ date: event.target.value })} /></label>;
  const month = <label className="job-card-month-filter">Estimated Delivery Month-Year<select aria-label="Estimated delivery month-year" value={values.month} onChange={(event) => onChange({ month: event.target.value })}><option value="">All months</option>{jobDeliveryMonths(jobs, values.month).map((value) => <option key={value} value={value}>{new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</option>)}</select></label>;
  const advisor = <label className="job-card-advisor-filter">Service advisor<select aria-label="Service advisor filter" value={values.advisor} onChange={(event) => onChange({ advisor: event.target.value })}><option value="ALL">All advisors</option>{advisors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>;
  const sort = <label className="job-card-sort-filter">Sort<select aria-label="Sort results" value={values.sort} onChange={(event) => onChange({ sort: event.target.value })}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="delivery-soonest">Estimated delivery (soonest)</option><option value="delivery-latest">Estimated delivery (latest)</option><option value="amount-high">Amount (high to low)</option><option value="amount-low">Amount (low to high)</option></select></label>;
  const archive = showArchive ? <div className="job-card-archive-filter"><span>Show archived only</span><Switch className="job-card-archive-switch" label="Show archived only" checked={values.archivedOnly} onCheckedChange={(archivedOnly) => onChange({ archivedOnly })} /></div> : null;
  const clear = <ListSearchActions onClear={onClear} />;

  return <div className={`job-card-filter-grid job-card-filter-grid--${variant}`} data-job-card-filters>
    {variant === "service" ? <div className="job-card-filter-row">{search}{status}{workflow}{deliveryDate}{month}{sort}{clear}</div> : <>
      <div className="job-card-filter-row">{search}{status}{workflow}{deliveryDate}{month}</div>
      <div className="job-card-filter-row">{advisor}{sort}{archive}{clear}</div>
    </>}
  </div>;
}
~~~

## CMP-App-EntityList

src/App.tsx:17595-18618

~~~tsx
function EntityList({
  kind,
  state,
  mutate,
  actor,
  initialFilters,
  initialSelectedId,
  onInitialSelectionConsumed,
  externalSearch,
  onExternalSearchChange,
  hideSearch = false,
  filterLayout = "default",
}: {
  kind: EntityKind;
  state: WorkshopState;
  mutate: Mutate;
  actor: User;
  initialFilters?: Partial<EntityFilters>;
  initialSelectedId?: number;
  onInitialSelectionConsumed?: () => void;
  externalSearch?: string;
  onExternalSearchChange?: (value: string) => void;
  hideSearch?: boolean;
  filterLayout?: "default" | "search";
}) {
  const { role, id: userId } = actor;
  const emptyFilters: EntityFilters = {
    search: "",
    primary: "ALL",
    secondary: "ALL",
    date: "",
    month: "",
    customer: "",
    vehicle: "ALL",
    advisor: "ALL",
    sort: kind === "jobs" ? "newest" : "alphabetical",
    archivedOnly: false,
  };
  const [filters, setFilters] = useState<EntityFilters>({
    ...emptyFilters,
    ...initialFilters,
    month: initialFilters?.month ?? (kind === "jobs" && !initialFilters?.date ? localCalendarDate().slice(0, 7) : ""),
  });
  const [page, setPage] = useState(1);
  const {
    search,
    primary: filter,
    secondary: secondaryFilter,
    date: dateFilter,
    month: monthFilter,
    customer: customerFilter,
    vehicle: vehicleFilter,
    advisor: advisorFilter,
    sort,
    archivedOnly,
  } = filters;
  const updateFilters = (patch: Partial<EntityFilters>) => {
    setFilters((current) => ({
      ...current,
      ...patch,
      ...(kind === "jobs" && patch.date ? { month: "" } : {}),
      ...(kind === "jobs" && patch.month ? { date: "" } : {}),
    }));
    setPage(1);
  };
  const updateSearch = (value: string) => {
    if (onExternalSearchChange) onExternalSearchChange(value);
    else updateFilters({ search: value });
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(emptyFilters);
    onExternalSearchChange?.("");
    setPage(1);
  };
  const effectiveSearch = externalSearch ?? search;
  const deferredSearch = useDeferredValue(effectiveSearch);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialSelectedId,
  );
  const [recordMode, setRecordMode] = useState<"view" | "edit">("view");
  useEffect(() => {
    if (initialSelectedId !== undefined) onInitialSelectionConsumed?.();
    // Only meant to consume a one-time hand-off from Search page navigation on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addingJob, setAddingJob] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    mobile: "",
    type: "Individual",
  });
  const scrollPosition = useRef(0);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  const jobs = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source =
      archivedOnly && role === "admin"
        ? state.archived_jobs
        : role === "service"
          ? state.jobs.filter((item) => item.job.advisor_id === userId)
          : state.jobs;
    return source
      .filter((item) => {
        const matchesText =
          !needle ||
          normalizeSearch(
            `${item.job.job_no} ${item.vehicle.number} ${item.vehicle.make} ${item.vehicle.model} ${item.customer.name} ${item.customer.mobile}`,
          ).includes(needle);
        return (
          matchesText &&
          (filter === "ALL" ||
            (filter === "ACTIVE"
              ? !["CLOSED", "CANCELLED"].includes(item.job.main_status)
              : item.job.main_status === filter)) &&
          (secondaryFilter === "ALL" ||
            item.job.sub_status === secondaryFilter) &&
          (!dateFilter || item.job.estimated_delivery === dateFilter) &&
          (!monthFilter || item.job.estimated_delivery?.slice(0, 7) === monthFilter) &&
          (!customerFilter ||
            normalizeSearch(`${item.customer.name} ${item.customer.mobile}`).includes(
              normalizeSearch(customerFilter),
            )) &&
          (advisorFilter === "ALL" || String(item.advisor.id) === advisorFilter)
        );
      })
      .sort((a, b) => {
        if (sort === "oldest") return a.job.id - b.job.id;
        if (sort === "amount-high") return jobTotal(b) - jobTotal(a);
        if (sort === "amount-low") return jobTotal(a) - jobTotal(b);
        if (sort === "delivery-soonest") return (a.job.estimated_delivery || "9999-12-31").localeCompare(b.job.estimated_delivery || "9999-12-31");
        if (sort === "delivery-latest") return (b.job.estimated_delivery || "").localeCompare(a.job.estimated_delivery || "");
        return b.job.id - a.job.id;
      });
  }, [
    deferredSearch,
    filter,
    secondaryFilter,
    dateFilter,
    monthFilter,
    customerFilter,
    vehicleFilter,
    advisorFilter,
    sort,
    archivedOnly,
    state.jobs,
    state.archived_jobs,
    role,
    userId,
  ]);

  const customers = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source =
      archivedOnly && role === "admin"
        ? state.archived_customers
        : state.customers;
    return source
      .filter(
        (item) =>
          (!needle ||
            normalizeSearch(`${item.name} ${item.mobile}`).includes(needle)) &&
          (filter === "ALL" || item.type === filter) &&
          (!monthFilter ||
            state.jobs.some(
              (view) =>
                view.customer.id === item.id &&
                view.visit.received_at.slice(0, 7) === monthFilter,
            )),
      )
      .sort((a, b) =>
        sort === "recent" ? b.id - a.id : a.name.localeCompare(b.name),
      );
  }, [
    deferredSearch,
    filter,
    monthFilter,
    sort,
    archivedOnly,
    role,
    state.jobs,
    state.customers,
    state.archived_customers,
  ]);

  const vehicles = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    const source =
      archivedOnly && role === "admin"
        ? state.archived_vehicles
        : state.vehicles;
    const owners =
      archivedOnly && role === "admin"
        ? [...state.customers, ...state.archived_customers]
        : state.customers;
    return source
      .filter((item) => {
        const owner =
          owners.find((customer) => customer.id === item.customer_id)?.name ??
          "";
        return (
          (!needle ||
            normalizeSearch(
              `${item.number} ${item.make} ${item.model} ${owner}`,
            ).includes(needle)) &&
          (!monthFilter ||
            state.jobs.some(
              (view) =>
                view.vehicle.id === item.id &&
                view.visit.received_at.slice(0, 7) === monthFilter,
            ))
        );
      })
      .sort((a, b) =>
        sort === "recent" ? b.id - a.id : a.number.localeCompare(b.number),
      );
  }, [
    deferredSearch,
    monthFilter,
    sort,
    archivedOnly,
    role,
    state.jobs,
    state.vehicles,
    state.archived_vehicles,
    state.customers,
    state.archived_customers,
  ]);

  const mediaJobs = useMemo(() => {
    if (archivedOnly && role === "admin")
      return [...state.jobs, ...state.archived_jobs];
    return role === "service"
      ? state.jobs.filter((job) => job.job.advisor_id === userId)
      : state.jobs;
  }, [archivedOnly, role, state.jobs, state.archived_jobs, userId]);

  const mediaMonths = useMemo(
    () =>
      [
        ...new Set(
          mediaJobs
            .map((job) => job.visit.received_at.slice(0, 7))
            .filter((value) => /^\d{4}-\d{2}$/.test(value)),
        ),
      ]
        .sort()
        .reverse(),
    [mediaJobs],
  );

  const media = useMemo(() => {
    const needle = normalizeSearch(deferredSearch);
    return mediaJobs
      .flatMap((job) =>
        (archivedOnly
          ? (job.photo_history ?? []).filter((photo) => photo.archived_at)
          : job.photos
        ).map((photo) => ({ photo, job })),
      )
      .filter(({ photo, job }) => {
        const matchesText =
          !needle ||
          normalizeSearch(
            `${photo.label} ${job.job.job_no} ${job.vehicle.number}`,
          ).includes(needle);
        const received = job.visit.received_at.slice(0, 10);
        return (
          matchesText &&
          (filter === "ALL" || String(photo.job_card_id) === filter) &&
          (secondaryFilter === "ALL" ||
            (photo.category || "General") === secondaryFilter) &&
          (!dateFilter || received === dateFilter) && // Exact date intentionally takes precedence over month/year.
          (dateFilter || !monthFilter || received.slice(0, 7) === monthFilter)
        );
      })
      .sort((a, b) => b.photo.id - a.photo.id);
  }, [
    deferredSearch,
    filter,
    secondaryFilter,
    dateFilter,
    monthFilter,
    archivedOnly,
    mediaJobs,
  ]);

  const filtered: unknown[] =
    kind === "jobs"
      ? jobs
      : kind === "customers"
        ? customers
        : kind === "vehicles"
          ? vehicles
          : media;
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);

  const changePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => resultHeading.current?.focus());
  };
  const openRecord = (id: number, mode: "view" | "edit" = "view") => {
    scrollPosition.current = window.scrollY;
    setRecordMode(mode);
    setSelectedId(id);
  };
  const closeRecord = () => {
    setSelectedId(undefined);
    requestAnimationFrame(() => window.scrollTo(0, scrollPosition.current));
  };

  if (selectedId !== undefined && kind === "media") {
    const mediaJobs = archivedOnly
      ? [...state.jobs, ...state.archived_jobs]
      : state.jobs;
    const selectedJob = mediaJobs.find((item) =>
      (archivedOnly ? (item.photo_history ?? []) : item.photos).some(
        (photo) => photo.id === selectedId,
      ),
    );
    const selectedPhoto = (
      archivedOnly ? selectedJob?.photo_history : selectedJob?.photos
    )?.find((photo) => photo.id === selectedId);
    return (
      <section className="record-workspace">
        <button className="back-button" onClick={closeRecord}>
          ← Back to {entityTitle(kind)}
        </button>
        <div className="list-page-heading">
          <div>
            <h2>{entityTitle(kind)} Detail</h2>
            <p>Focused record workspace</p>
          </div>
        </div>
        {selectedJob && selectedPhoto && kind === "media" && (
          <div className="job-detail-layout">
            <aside className="desk-panel">
              <img
                className="media-detail-image"
                src={selectedPhoto.src || "/media-placeholder.svg"}
                alt={selectedPhoto.label}
              />
              <Info label="Vehicle" value={selectedJob.vehicle.number} />
              <Info label="Job" value={selectedJob.job.job_no} />
              {archivedOnly && (
                <>
                  <Info
                    label="Archived on"
                    value={selectedPhoto.archived_at ?? "—"}
                  />
                  <Info
                    label="Archive reason"
                    value={selectedPhoto.archived_reason ?? "—"}
                  />
                </>
              )}
            </aside>
            {archivedOnly ? (
              <div className="desk-panel">
                <p className="permission-note">Read-only archived media.</p>
                <Info label="Label" value={selectedPhoto.label} />
                <Info
                  label="Category"
                  value={selectedPhoto.category || "General"}
                />
              </div>
            ) : (
              <JobMediaPanel
                key={selectedPhoto.updated_at}
                view={selectedJob}
                actor={actor}
                mutate={mutate}
              />
            )}
          </div>
        )}
      </section>
    );
  }

  const title =
    kind === "jobs" && role === "admin" ? "Job Cards" : entityTitle(kind);
  const dialogJob =
    kind === "jobs" && selectedId !== undefined
      ? (archivedOnly ? state.archived_jobs : state.jobs).find(
          (item) => item.job.id === selectedId,
        )
      : undefined;
  const dialogCustomer =
    kind === "customers" && selectedId !== undefined
      ? (archivedOnly ? state.archived_customers : state.customers).find(
          (item) => item.id === selectedId,
        )
      : undefined;
  const dialogVehicle =
    kind === "vehicles" && selectedId !== undefined
      ? (archivedOnly ? state.archived_vehicles : state.vehicles).find(
          (item) => item.id === selectedId,
        )
      : undefined;
  const categories = Array.from(
    new Set(
      mediaJobs.flatMap((job) =>
        (archivedOnly
          ? (job.photo_history ?? []).filter((photo) => photo.archived_at)
          : job.photos
        ).map((photo) => photo.category || "General"),
      ),
    ),
  ).sort();
  const customerTypes = Array.from(
    new Set(state.customers.map((customer) => customer.type)),
  ).sort();
  const servedMonths = Array.from(
    new Set(
      state.jobs
        .map((view) => view.visit.received_at.slice(0, 7))
        .filter((value) => /^\d{4}-\d{2}$/.test(value)),
    ),
  )
    .sort()
    .reverse();
  const jobCustomerOptions = Array.from(
    new Map(
      state.jobs.map((item) => [item.customer.id, item.customer]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const jobVehicleOptions = Array.from(
    new Map(state.jobs.map((item) => [item.vehicle.id, item.vehicle])).values(),
  ).sort((a, b) => a.number.localeCompare(b.number));
  const jobAdvisorOptions = Array.from(
    new Map(state.jobs.map((item) => [item.advisor.id, item.advisor])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const canCreate =
    (kind === "customers" || kind === "vehicles") &&
    (role === "admin" || role === "reception");
  const canAddJob = kind === "jobs" && (role === "admin" || role === "service");
  const createLabel =
    kind === "customers"
      ? "Add Customer"
      : kind === "vehicles"
        ? "Add Vehicle"
        : "Upload Media";
  const exportFilters = activeFilterSummary(
    kind === "jobs"
      ? {
          Search: effectiveSearch.trim(),
          "Show archived only": archivedOnly ? "Yes" : "No",
          "Main status": filter,
          Workflow: secondaryFilter,
          Sort: sort,
          "Estimated Delivery Date": dateFilter,
          "Estimated Delivery Month-Year": monthFilter,
          Customer: customerFilter,
          Advisor:
            advisorFilter === "ALL"
              ? "ALL"
              : (jobAdvisorOptions.find(
                  (item) => String(item.id) === advisorFilter,
                )?.name ?? advisorFilter),
        }
      : kind === "customers"
        ? {
            Search: effectiveSearch.trim(),
            "Show archived only": archivedOnly ? "Yes" : "No",
            "Customer type": filter,
            "Served month": monthFilter,
            Sort: sort,
          }
        : kind === "media"
          ? {
              Search: effectiveSearch.trim(),
              "Show archived only": archivedOnly ? "Yes" : "No",
              "Job card":
                filter === "ALL"
                  ? "ALL"
                  : (mediaJobs.find((row) => String(row.job.id) === filter)?.job
                      .job_no ?? filter),
              Category: secondaryFilter,
              "Received date": dateFilter,
              "Month-Year": dateFilter ? "" : monthFilter,
            }
          : {
              Search: effectiveSearch.trim(),
              "Show archived only": archivedOnly ? "Yes" : "No",
              "Served month": monthFilter,
              Sort: sort,
            },
  );
  const exportColumns: ExportColumn<any>[] =
    kind === "jobs"
      ? [
          { header: "Job", value: (row: JobView) => row.job.job_no },
          {
            header: "Vehicle",
            value: (row: JobView) =>
              `${row.vehicle.number} ${row.vehicle.make} ${row.vehicle.model}`,
          },
          { header: "Customer", value: (row: JobView) => row.customer.name },
          { header: "Estimated Delivery Date", value: (row: JobView) => row.job.estimated_delivery || "—" },
          { header: "Status", value: (row: JobView) => row.job.main_status },
          { header: "Workflow", value: (row: JobView) => row.job.sub_status },
          { header: "Total", value: (row: JobView) => jobTotal(row) },
        ]
      : kind === "customers"
        ? [
            { header: "Customer", value: (row: Customer) => row.name },
            { header: "Mobile", value: (row: Customer) => row.mobile },
            { header: "Type", value: (row: Customer) => row.type },
            {
              header: "Vehicles",
              value: (row: Customer) =>
                state.vehicles.filter(
                  (vehicle) => vehicle.customer_id === row.id,
                ).length,
            },
            {
              header: "Open jobs",
              value: (row: Customer) =>
                state.jobs.filter(
                  (job) =>
                    job.customer.id === row.id &&
                    job.job.main_status !== "CLOSED",
                ).length,
            },
          ]
        : kind === "vehicles"
          ? [
              { header: "Registration", value: (row: Vehicle) => row.number },
              {
                header: "Make / Model",
                value: (row: Vehicle) => `${row.make} ${row.model}`,
              },
              { header: "Color", value: (row: Vehicle) => row.color },
              {
                header: "Customer",
                value: (row: Vehicle) =>
                  state.customers.find(
                    (customer) => customer.id === row.customer_id,
                  )?.name ?? "",
              },
              { header: "KM", value: (row: Vehicle) => row.km },
            ]
          : [
              {
                header: "Label",
                value: (row: { photo: Photo }) => row.photo.label,
              },
              {
                header: "Category",
                value: (row: { photo: Photo }) =>
                  row.photo.category ?? "General",
              },
              {
                header: "Vehicle",
                value: (row: { job: JobView }) => row.job.vehicle.number,
              },
              {
                header: "Job",
                value: (row: { job: JobView }) => row.job.job.job_no,
              },
            ];
  return (
    <section className={`entity-list-page kind-${kind}`}>
      {dialogJob && (
        <JobRecordDialog
          view={dialogJob}
          state={state}
          mutate={mutate}
          actor={actor}
          mode={archivedOnly ? "view" : recordMode}
          historical={archivedOnly}
          onClose={closeRecord}
        />
      )}
      {dialogCustomer && (
        <CustomerRecordDialog
          customer={dialogCustomer}
          state={state}
          mutate={mutate}
          mode={recordMode}
          onClose={closeRecord}
        />
      )}
      {dialogVehicle && (
        <VehicleRecordDialog
          vehicle={dialogVehicle}
          state={state}
          mutate={mutate}
          mode={recordMode}
          onClose={closeRecord}
        />
      )}
      <div className="list-page-heading">
        <div>
          <h2 ref={resultHeading} tabIndex={-1}>
            {title}
          </h2>
          <p>
            {kind === "media"
              ? "Before, after and workshop documentation"
              : `Browse and manage ${title.toLocaleLowerCase()}`}
          </p>
        </div>
        {canCreate && (
          <button className="primary-action" onClick={() => setCreating(true)}>
            {createLabel}
          </button>
        )}
        {canAddJob && (
          <button className="primary-action" onClick={() => setAddingJob(true)}>
            Add Job Card
          </button>
        )}
      </div>
      {addingJob && (
        <AddJobCardDialog
          state={state}
          mutate={mutate}
          actor={actor}
          onClose={() => setAddingJob(false)}
        />
      )}
      {creating && (
        <Dialog title={createLabel} onClose={() => setCreating(false)}>
          {kind === "customers" && (
            <CustomerEditor
              embedded
              value={newCustomer}
              setValue={setNewCustomer}
              mutate={mutate}
            />
          )}
          {kind === "vehicles" && (
            <VehicleMasterPanel
              embedded
              state={state}
              value={{
                id: 0,
                customer_id: state.customers[0]?.id ?? 0,
                number: "",
                make: "",
                model: "",
                color: "",
                km: 0,
              }}
              setValue={() => undefined}
              mutate={mutate}
            />
          )}
        </Dialog>
      )}
      <div className={`list-filter-bar${filterLayout === "search" ? " search-filter-layout" : ""}`}>
        {!hideSearch && kind !== "jobs" && filterLayout !== "search" && (
          <label className="list-search">
            Search
            <input
              aria-label={`Search ${title.toLocaleLowerCase()}`}
              value={effectiveSearch}
              placeholder={searchPlaceholder(kind)}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </label>
        )}
        <button
          className="mobile-filter-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          {filtersOpen ? "Hide filters" : "Show filters"}
        </button>
        <div
          className={`${filtersOpen || filterLayout === "search" ? "list-filter-fields open" : "list-filter-fields"}${filterLayout === "search" ? " search-filter-row" : ""}${filterLayout === "search" && kind !== "jobs" ? " entity-search-filter-row" : ""}`}
        >
          {!hideSearch && kind !== "jobs" && filterLayout === "search" && (
            <label className="list-search">
              Search
              <input
                aria-label="Search records"
                value={effectiveSearch}
                placeholder={searchPlaceholder(kind)}
                onChange={(event) => updateSearch(event.target.value)}
              />
            </label>
          )}
          {kind === "jobs" && (
            <JobCardFilterFields
              jobs={archivedOnly && role === "admin" ? state.archived_jobs : state.jobs}
              values={{ search: effectiveSearch, primary: filter, secondary: secondaryFilter, date: dateFilter, month: monthFilter, customer: customerFilter, advisor: advisorFilter, sort, archivedOnly }}
              onChange={(patch) => {
                if (patch.search !== undefined && onExternalSearchChange) onExternalSearchChange(patch.search);
                else updateFilters(patch);
                if (patch.archivedOnly !== undefined) setSelectedId(undefined);
              }}
              onClear={clearFilters}
              showArchive={role === "admin"}
              variant="admin"
            />
          )}
          {role === "admin" && kind !== "jobs" && (
            <Switch
              label="Show archived only"
              checked={archivedOnly}
              onCheckedChange={(checked) => {
                updateFilters({ archivedOnly: checked });
                setSelectedId(undefined);
              }}
            />
          )}
          {false && kind === "jobs" && (
            <>
              <label>
                Main status
                <select
                  aria-label="Main status"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
                  <option value="ALL">All statuses</option>
                  {[
                    "NEW",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELLED",
                    "CLOSED",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Workflow
                <select
                  aria-label="Workflow status"
                  value={filters.secondary}
                  onChange={(event) =>
                    updateFilters({ secondary: event.target.value })
                  }
                >
                  <option value="ALL">All workflows</option>
                  {Array.from(
                    new Set(state.jobs.map((item) => item.job.sub_status)),
                  ).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Estimated Delivery Date
                <input
                  aria-label="Estimated delivery date"
                  type="date"
                  value={filters.date}
                  onChange={(event) =>
                    updateFilters({ date: event.target.value })
                  }
                />
              </label>
              <label>
                Estimated Delivery Month
                <input
                  aria-label="Estimated delivery month"
                  type="month"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                />
              </label>
              <label>
                Customer
                <select
                  aria-label="Customer filter"
                  value={filters.customer}
                  onChange={(event) =>
                    updateFilters({ customer: event.target.value })
                  }
                >
                  <option value="ALL">All customers</option>
                  {jobCustomerOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Vehicle
                <select
                  aria-label="Vehicle filter"
                  value={filters.vehicle}
                  onChange={(event) =>
                    updateFilters({ vehicle: event.target.value })
                  }
                >
                  <option value="ALL">All vehicles</option>
                  {jobVehicleOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.number}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Service advisor
                <select
                  aria-label="Service advisor filter"
                  value={filters.advisor}
                  onChange={(event) =>
                    updateFilters({ advisor: event.target.value })
                  }
                >
                  <option value="ALL">All advisors</option>
                  {jobAdvisorOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {kind === "customers" && (
            <>
              <label>
                Customer type
                <select
                  aria-label="Customer type"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
                  <option value="ALL">All types</option>
                  {customerTypes.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Served month
                <select
                  aria-label="Customer served month"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                >
                  <option value="">All months</option>
                  {servedMonths.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {kind === "vehicles" && (
            <label>
              Served month
              <select
                aria-label="Vehicle served month"
                value={filters.month}
                onChange={(event) =>
                  updateFilters({ month: event.target.value })
                }
              >
                <option value="">All months</option>
                {servedMonths.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          )}
          {kind === "media" && (
            <>
              <label>
                Job card
                <select
                  aria-label="Job card filter"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
                  <option value="ALL">All job cards</option>
                  {mediaJobs.map((item) => (
                    <option value={item.job.id} key={item.job.id}>
                      {item.job.job_no}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select
                  aria-label="Media category"
                  value={filters.secondary}
                  onChange={(event) =>
                    updateFilters({ secondary: event.target.value })
                  }
                >
                  <option value="ALL">All categories</option>
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Received date
                <input
                  aria-label="Media received date"
                  type="date"
                  value={filters.date}
                  onChange={(event) =>
                    updateFilters({ date: event.target.value })
                  }
                />
              </label>
              <label>
                Month-Year
                <select
                  aria-label="Media month-year"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                >
                  <option value="">All months</option>
                  {mediaMonths.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {kind !== "media" && kind !== "jobs" && (
            <label>
              Sort
              <select
                aria-label="Sort results"
                value={filters.sort}
                onChange={(event) =>
                  updateFilters({ sort: event.target.value })
                }
              >
                <><option value="alphabetical">Alphabetical</option><option value="recent">Recent</option></>
              </select>
            </label>
          )}
          {kind !== "jobs" && <ListSearchActions onClear={clearFilters} />}
        </div>
      </div>
      {kind === "media" && <MediaKpis rows={media} />}
      <PaginationToolbar
        controls={
          <>
            <ListExportControls
              report={{
                title,
                filters: exportFilters,
                columns: exportColumns,
                rows: filtered,
              }}
            />
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </>
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={changePage}
        pageSize={pageSize}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount === 0 ? (
        <div className="list-empty">
          <h3>No matching records</h3>
          <p>Adjust the search or clear the filters.</p>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      ) : (
        <EntityResults
          kind={kind}
          rows={paged.items}
          state={state}
          viewMode={viewMode}
          role={role}
          actor={actor}
          historical={archivedOnly}
          openRecord={openRecord}
          mutate={mutate}
        />
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={changePage}
      />
    </section>
  );
}
~~~

## CMP-App-ViewModeToggle

src/App.tsx:18642-18667

~~~tsx
function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="view-toggle" role="group" aria-label="View mode">
      <button
        aria-pressed={value === "grid"}
        className={value === "grid" ? "active" : ""}
        onClick={() => onChange("grid")}
      >
        Grid
      </button>
      <button
        aria-pressed={value === "table"}
        className={value === "table" ? "active" : ""}
        onClick={() => onChange("table")}
      >
        Table
      </button>
    </div>
  );
}
~~~

## CMP-App-ListExportControls

src/App.tsx:18669-18680

~~~tsx
function ListExportControls({
  report,
}: {
  report: {
    title: string;
    filters: string[];
    columns: ExportColumn<any>[];
    rows: any[];
  };
}) {
  return <DownloadMenu report={report} />;
}
~~~

## CMP-App-MediaKpis

src/App.tsx:18682-18702

~~~tsx
function MediaKpis({ rows }: { rows: { photo: Photo; job: JobView }[] }) {
  const before = rows.filter(
    ({ photo }) =>
      photo.category === "Before Work" || photo.category === "Before",
  ).length;
  const after = rows.filter(
    ({ photo }) =>
      photo.category === "After Work" || photo.category === "After",
  ).length;
  return (
    <div className="media-kpis">
      <Info label="Total Images" value={rows.length} />
      <Info label="Before Images" value={before} />
      <Info label="After Images" value={after} />
      <Info
        label="Job Cards"
        value={new Set(rows.map(({ job }) => job.job.id)).size}
      />
    </div>
  );
}
~~~

## CMP-App-EntityResults

src/App.tsx:18704-18900

~~~tsx
function EntityResults({
  kind,
  rows,
  state,
  viewMode,
  role,
  actor,
  historical = false,
  openRecord,
  mutate,
}: {
  kind: EntityKind;
  rows: unknown[];
  state: WorkshopState;
  viewMode: ViewMode;
  role: Role;
  actor: User;
  historical?: boolean;
  openRecord: (id: number, mode?: "view" | "edit") => void;
  mutate: Mutate;
}) {
  const today = useLocalDeliveryDate();
  const canArchive =
    !historical &&
    (kind === "media"
      ? role === "admin"
      : role === "admin" || role === "reception");
  const canManageJob = (row: JobView) =>
    !historical && canMutateJobLifecycle(actor, row.job);
  const archive = (id: number) => {
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
  };
  const cardFor = (raw: unknown): ReactNode => {
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
  };
  const cards = (
    <div className={`record-grid ${kind}`}>{rows.map(cardFor)}</div>
  );
  if (viewMode === "grid") return cards;
  return (
    <>
      <div className="mobile-table-fallback">{cards}</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {tableHeaders(kind).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((raw) => (
              <EntityTableRow
                key={rowId(kind, raw)}
                kind={kind}
                raw={raw}
                state={state}
                canArchive={canArchive}
                canManageJob={kind === "jobs" && canManageJob(raw as JobView)}
                today={today}
                openRecord={openRecord}
                archive={archive}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
~~~

## CMP-App-RecordActions

src/App.tsx:18902-18956

~~~tsx
function RecordActions({
  onView,
  onEdit,
  onArchive,
  inGrid = false,
  editLabel = "Edit",
}: {
  onView: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  inGrid?: boolean;
  editLabel?: string;
}) {
  const actionClass = inGrid ? "grid-action" : undefined;
  return (
    <div className={inGrid ? "grid-actions" : "record-actions"}>
      <button
        type="button"
        className={actionClass}
        onClick={(event) => {
          event.stopPropagation();
          onView();
        }}
      >
        View
      </button>
      {onEdit && (
        <button
          type="button"
          className={actionClass}
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          {editLabel}
        </button>
      )}
      {onArchive && (
        <button
          type="button"
          className={
            inGrid ? "grid-action grid-action-danger" : "danger-action"
          }
          onClick={(event) => {
            event.stopPropagation();
            onArchive();
          }}
        >
          Archive
        </button>
      )}
    </div>
  );
}
~~~

## CMP-App-CustomerDetail

src/App.tsx:18957-18966

~~~tsx
function CustomerDetail({
  customer,
  mutate,
}: {
  customer: Customer;
  mutate: Mutate;
}) {
  const [draft, setDraft] = useState(customer);
  return <CustomerEditor value={draft} setValue={setDraft} mutate={mutate} />;
}
~~~

## CMP-App-EntityTableRow

src/App.tsx:18983-19083

~~~tsx
function EntityTableRow({
  kind,
  raw,
  state,
  canArchive,
  canManageJob,
  today,
  openRecord,
  archive,
}: {
  kind: EntityKind;
  raw: unknown;
  state: WorkshopState;
  canArchive: boolean;
  canManageJob: boolean;
  today: string;
  openRecord: (id: number, mode?: "view" | "edit") => void;
  archive: (id: number) => void;
}) {
  const id = rowId(kind, raw);
  let cells: ReactNode[];
  if (kind === "jobs") {
    const row = raw as JobView;
    cells = [
      row.job.job_no,
      `${row.vehicle.number} · ${row.vehicle.make} ${row.vehicle.model}`,
      row.customer.name,
      row.job.estimated_delivery || "—",
      <Status status={row.job.main_status} sub={row.job.sub_status} />,
      money(jobTotal(row)),
    ];
  } else if (kind === "customers") {
    const row = raw as Customer;
    cells = [
      row.name,
      row.mobile,
      row.type,
      state.vehicles.filter((item) => item.customer_id === row.id).length,
      state.jobs.filter(
        (item) =>
          item.customer.id === row.id && item.job.main_status !== "CLOSED",
      ).length,
    ];
  } else if (kind === "vehicles") {
    const row = raw as Vehicle;
    cells = [
      row.number,
      `${row.make} ${row.model}`,
      row.color,
      state.customers.find((item) => item.id === row.customer_id)?.name ?? "—",
      row.km.toLocaleString("en-IN"),
    ];
  } else {
    const { photo, job } = raw as { photo: Photo; job: JobView };
    cells = [
      <img
        className="table-thumb"
        src={photo.src || "/media-placeholder.svg"}
        alt=""
      />,
      photo.label,
      photo.category || "General",
      `${job.vehicle.number} · ${job.job.job_no}`,
    ];
  }
  const statusClass =
    kind === "jobs"
      ? `job-status-${(raw as JobView).job.main_status.toLowerCase()} ${jobDeliveryClass((raw as JobView).job, today)}`
      : undefined;
  return (
    <tr className={statusClass}>
      {cells.map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
      <td>
        <RecordActions
          inGrid
          onView={() => openRecord(id, "view")}
          onEdit={
            kind === "jobs"
              ? canManageJob
                ? () => openRecord(id, "edit")
                : undefined
              : (kind === "customers" || kind === "vehicles") && canArchive
                ? () => openRecord(id, "edit")
                : undefined
          }
          onArchive={
            kind === "jobs"
              ? canManageJob
                ? () => archive(id)
                : undefined
              : canArchive
                ? () => archive(id)
                : undefined
          }
        />
      </td>
    </tr>
  );
}
~~~

## CMP-App-DocumentChips

src/App.tsx:19093-19135

~~~tsx
function DocumentChips({ view }: { view: JobView }) {
  const rows = resolveJobDocuments(view, loadDocumentSnapshots());
  return (
    <span className="doc-chips" aria-label="Documents">
      {(
        [
          "estimate",
          "invoice",
          "payment-receipt",
          "gate-pass",
        ] as DocumentKind[]
      ).map((kind) => {
        const current = rows.find(
          (row) => row.kind === kind && row.state !== "void",
        );
        const voided = rows.some(
          (row) => row.kind === kind && row.state === "void",
        );
        const state = current?.available
          ? current.state
          : voided
            ? "void"
            : "missing";
        const text =
          state === "missing"
            ? "not created"
            : state === "void"
              ? "void"
              : "created";
        return (
          <span
            key={kind}
            className={`doc-chip doc-chip-${state}`}
            title={`${DOCUMENT_LABELS[kind]}: ${text}`}
            data-state={state}
          >
            {CHIP_LABELS[kind]}
          </span>
        );
      })}
    </span>
  );
}
~~~

## CMP-App-JobRows

src/App.tsx:19137-19168

~~~tsx
function JobRows({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: JobView[];
  selectedJobId?: number;
  onSelect?: (id: number) => void;
}) {
  return (
    <div className="row-list">
      {jobs.map((view) => (
        <button
          className={selectedJobId === view.job.id ? "row active" : "row"}
          key={view.job.id}
          onClick={() => onSelect?.(view.job.id)}
        >
          <strong>{view.job.job_no}</strong>
          <span>{view.vehicle.number}</span>
          <Status
            status={view.job.main_status}
            sub={view.job.sub_status}
            unmapped={
              view.job.advisor_id === 0 && view.job.main_status === "NEW"
            }
          />
          <DocumentChips view={view} />
        </button>
      ))}
    </div>
  );
}
~~~

## CMP-App-FilterableJobRows

src/App.tsx:19170-19451

~~~tsx
function FilterableJobRows({
  title,
  jobs,
  selectedJobId,
  onSelect,
  showStatusFilter = false,
  readyToInvoiceFilters = false,
  queueActions,
}: {
  title: string;
  jobs: JobView[];
  selectedJobId?: number;
  onSelect?: (id: number) => void;
  showStatusFilter?: boolean;
  readyToInvoiceFilters?: boolean;
  queueActions?: { state: WorkshopState; mutate: Mutate; actor: User };
}) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("ALL");
  const [receivedDate, setReceivedDate] = useState("");
  const [receivedMonth, setReceivedMonth] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<JobView>();
  const [dialog, setDialog] = useState<"view" | "edit">();
  const needle = normalizeSearch(deferredSearch);
  const availableReceivedMonths = useMemo(
    () =>
      [
        ...new Set(
          jobs
            .map((row) => row.visit.received_at.slice(0, 7))
            .filter((month) => /^\d{4}-\d{2}$/.test(month)),
        ),
      ].sort((left, right) => right.localeCompare(left)),
    [jobs],
  );
  const filtered = useMemo(
    () =>
      jobs.filter((row) => {
        const receivedAt = row.visit.received_at;
        return (
          (!needle ||
            normalizeSearch(
              `${row.job.job_no} ${row.vehicle.number} ${row.customer.name}`,
            ).includes(needle)) &&
          (status === "ALL" || row.job.main_status === status) &&
          (!readyToInvoiceFilters ||
            !receivedDate ||
            receivedAt.slice(0, 10) === receivedDate) &&
          (!readyToInvoiceFilters ||
            !receivedMonth ||
            receivedAt.slice(0, 7) === receivedMonth)
        );
      }),
    [jobs, needle, status, readyToInvoiceFilters, receivedDate, receivedMonth],
  );
  const paged = paginate(filtered, page, pageSize);
  useEffect(() => {
    if (paged.page !== page) setPage(paged.page);
  }, [paged.page, page]);
  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setReceivedDate("");
    setReceivedMonth("");
    setPage(1);
  };
  const columns: ExportColumn<JobView>[] = [
    { header: "Job", value: (row) => row.job.job_no },
    { header: "Vehicle", value: (row) => row.vehicle.number },
    { header: "Customer", value: (row) => row.customer.name },
    { header: "Status", value: (row) => row.job.main_status },
    { header: "Workflow", value: (row) => row.job.sub_status },
  ];
  return (
    <div className="embedded-list">
      {selected && dialog && queueActions && (
        <JobRecordDialog
          view={selected}
          state={queueActions.state}
          mutate={queueActions.mutate}
          actor={queueActions.actor}
          mode={dialog}
          onClose={() => setDialog(undefined)}
        />
      )}
      <div
        className={
          queueActions
            ? "store-filter-grid my-queue-filter-bar"
            : readyToInvoiceFilters
            ? "store-filter-grid ready-to-invoice-filters"
            : "store-filter-grid"
        }
      >
        <label className="list-search">
          Search
          <input
            aria-label={`Search ${title.toLocaleLowerCase()}`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job, vehicle or customer"
          />
        </label>
        {readyToInvoiceFilters && (
          <>
            <label>
              Received date
              <input
                aria-label="Ready To Invoice received date"
                type="date"
                value={receivedDate}
                onChange={(event) => {
                  setReceivedDate(event.target.value);
                  setReceivedMonth("");
                  setPage(1);
                }}
              />
            </label>
            <label>
              Month-Year
              <select
                aria-label="Ready To Invoice month-year"
                value={receivedMonth}
                onChange={(event) => {
                  setReceivedMonth(event.target.value);
                  setReceivedDate("");
                  setPage(1);
                }}
              >
                <option value="">All months</option>
                {availableReceivedMonths.map((month) => (
                  <option key={month} value={month}>
                    {SEARCH_MONTH_YEAR_FORMATTER.format(
                      new Date(`${month}-01T00:00:00Z`),
                    )}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {showStatusFilter && (
          <label>
            Status
            <select
              aria-label={`${title} status`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All statuses</option>
              {["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        )}
        <ListSearchActions onClear={clearFilters} />
      </div>
      <PaginationToolbar
        controls={
          <ListExportControls
            report={{
              title,
              filters: activeFilterSummary({
                Search: search.trim(),
                Status: status,
                "Received date": readyToInvoiceFilters ? receivedDate : "",
                "Received month": readyToInvoiceFilters ? receivedMonth : "",
              }),
              columns,
              rows: filtered,
            }}
          />
        }
        from={paged.from}
        to={paged.to}
        totalCount={paged.totalCount}
        page={paged.page}
        pageCount={paged.pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeAriaLabel={`${title} records per page`}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
      {paged.totalCount ? (
        readyToInvoiceFilters ? (
          <ReadyToInvoiceRows
            jobs={paged.items}
            selectedJobId={selectedJobId}
            onSelect={onSelect ?? (() => {})}
          />
        ) : queueActions ? (
          <div className="table-wrap">
            <table aria-label="My Queue">
              <thead>
                <tr>
                  <th>Job Card</th>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Workflow</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.items.map((row) => (
                  <tr key={row.job.id}>
                    <td>{row.job.job_no}</td>
                    <td>{row.vehicle.number}</td>
                    <td>{row.customer.name}</td>
                    <td>
                      <Status
                        status={row.job.main_status}
                        sub={row.job.sub_status}
                      />
                    </td>
                    <td>{row.job.sub_status}</td>
                    <td>
                      <div className="grid-actions">
                        <button
                          type="button"
                          className="grid-action"
                          onClick={() => {
                            setSelected(row);
                            setDialog("view");
                          }}
                        >
                          View
                        </button>
                        {queueActions.actor.role === "service" &&
                          queueActions.actor.id === row.job.advisor_id && (
                            <button
                              type="button"
                              className="grid-action"
                              onClick={() => {
                                setSelected(row);
                                setDialog("edit");
                              }}
                            >
                              Edit
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <JobRows
            jobs={paged.items}
            selectedJobId={selectedJobId}
            onSelect={onSelect}
          />
        )
      ) : (
        <div className="list-empty">
          <h3>No matching records</h3>
          <FilterClearButton onClick={clearFilters} label="Clear filters" />
        </div>
      )}
      <ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
    </div>
  );
}
~~~

## CMP-App-ReadyToInvoiceRows

src/App.tsx:19453-19498

~~~tsx
function ReadyToInvoiceRows({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: JobView[];
  selectedJobId?: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="ready-to-invoice-rows" aria-label="Jobs awaiting invoice">
      {jobs.map((view) => {
        const draft = buildInvoiceDraft(view);
        const totals = invoiceTotals(draft.lines, draft.discount);
        const warning = unissuedWarning(draft.unissuedRows);
        const ready =
          view.estimate?.status === "Approved" && draft.lines.length > 0;
        return (
          <button
            type="button"
            key={view.job.id}
            className={`ready-to-invoice-row${selectedJobId === view.job.id ? " active" : ""}`}
            onClick={() => onSelect(view.job.id)}
          >
            <strong>{view.job.job_no}</strong>
            <span>
              {view.customer.name} · {view.vehicle.number}
            </span>
            <span>Received {view.visit.received_at.slice(0, 10)}</span>
            <span>
              {draft.lines.length} billable item
              {draft.lines.length === 1 ? "" : "s"}
            </span>
            <strong>{money(totals.total)}</strong>
            <span
              className={ready && !warning ? "ready-state" : "warning-state"}
            >
              {warning ??
                (ready ? "Ready to invoice" : "Estimate approval required")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
~~~

## CMP-App-PanelTitle

src/App.tsx:19500-19518

~~~tsx
export function PanelTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="panel-title">
      {icon}
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
~~~

## CMP-App-Info

src/App.tsx:19520-19533

~~~tsx
export function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
~~~

## CMP-App-Status

src/App.tsx:19535-19552

~~~tsx
function Status({
  status,
  sub,
  unmapped = false,
}: {
  status: string;
  sub: string;
  unmapped?: boolean;
}) {
  if (unmapped)
    return <span className="status hold">{ADVISOR_NOT_MAPPED_LABEL}</span>;
  const label = status.replaceAll("_", " ");
  return (
    <span className={`status ${status.toLowerCase()}`}>
      {label} · {sub}
    </span>
  );
}
~~~

## CMP-billing-manager-BillingManager

src/billing-manager.tsx:117-195

~~~tsx
export function BillingManager({ mode, state, actor, mutate, panel = true, pendingInvoicesOnly = false }: { mode: BillingMode; state: WorkshopState; actor: User; mutate: Mutate; panel?: boolean; pendingInvoicesOnly?: boolean }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [invoiceDialog, setInvoiceDialog] = useState<{ action: "create" | "view" | "edit"; view: JobView }>();
  const [paymentDialog, setPaymentDialog] = useState<JobView>();
  const [jobId, setJobId] = useState<number>();
  const [expanded, setExpanded] = useState<string>();
  const [paymentMode, setPaymentMode] = useState<"ALL" | PaymentMode>("ALL");
  const [eventMonth, setEventMonth] = useState("ALL");
  const editable = actor.role === "admin" || actor.role === "service";
  const allRecords = useMemo(() => recordsFor(mode, state.jobs).filter((record) => !pendingInvoicesOnly || record.view.invoice?.status === "Pending"), [mode, state.jobs, pendingInvoicesOnly]);
  const recordStatus = (record: BillingRecord) => mode === "Invoices" ? invoiceStatus(record.view) : mode === "Payments" ? paymentStatus(record) : delivered(record.view) ? "Delivered" : "Pending";
  const showStatusFilter = !pendingInvoicesOnly && mode === "Invoices";
  const compactAccountsPanel = panel && actor.role === "accounts";
  const showPaymentModeFilter = mode === "Payments";
  const availableMonths = useMemo(() => Array.from(new Set(allRecords.map((record) => recordDate(mode, record).slice(0, 7)).filter(Boolean))).sort((left, right) => right.localeCompare(left)), [allRecords, mode]);
  const filtered = allRecords.filter((record) => {
    const needle = normalizeSearch(search);
    const date = recordDate(mode, record);
    return (!eventMonth || eventMonth === "ALL" || date.startsWith(eventMonth)) && (!needle || searchText(record).includes(needle)) && (!showStatusFilter || status === "ALL" || recordStatus(record) === status) && (!showPaymentModeFilter || paymentMode === "ALL" || record.payment?.mode === paymentMode);
  }).sort((left, right) => newestFirst(mode, left, right));
  const manage = !panel && mode !== "Delivery";
  const pickedJob = state.jobs.find((view) => view.job.id === jobId);
  const paged = paginate(filtered, page, pageSize);
  const statusOptions = mode === "Invoices" ? ["Pending", "Partial", "Cleared"] : ["Delivered"];
  const clear = () => { setSearch(""); setStatus("ALL"); setPaymentMode("ALL"); setEventMonth("ALL"); setJobId(undefined); setPage(1); };
  const columns: ExportColumn<BillingRecord>[] = mode === "Invoices"
    ? [{ header: "Created", value: (row) => timestamp(row.view.invoice?.created_at) }, { header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "Not created" }, { header: "Customer", value: (row) => row.view.customer.name }, ...(pendingInvoicesOnly ? [{ header: "Vehicle", value: (row: BillingRecord) => row.view.vehicle.number }] : []), { header: "Total", value: (row) => row.view.invoice?.total ?? 0 }, { header: "Status", value: (row) => invoiceStatus(row.view) }]
    : mode === "Payments"
      ? [{ header: "Paid at", value: (row) => timestamp(row.payment?.created_at) }, { header: "Job", value: (row) => row.view.job.job_no }, { header: "Invoice", value: (row) => row.view.invoice?.invoice_no ?? "" }, { header: "Customer", value: (row) => row.view.customer.name }, { header: "Amount", value: (row) => row.payment?.amount ?? row.view.invoice?.total ?? 0 }, { header: "Mode", value: (row) => row.payment?.mode ?? "-" }, { header: "Status", value: (row) => paymentStatus(row) }]
      : [{ header: "Created", value: (row) => timestamp(row.view.gate_pass?.created_at) }, { header: "Job", value: (row) => row.view.job.job_no }, { header: "Vehicle", value: (row) => row.view.vehicle.number }, { header: "Gate pass", value: (row) => row.view.gate_pass?.gate_pass_no ?? "Pending" }, { header: "Delivery", value: (row) => delivered(row.view) ? "Delivered" : "Pending" }];
  const inline = mode !== "Delivery";
  const toggle = (key: string) => { setExpanded((current) => current === key ? undefined : key); const hit = allRecords.find((record) => record.key === key); if (manage && hit) setJobId(hit.view.job.id); };

  return (
    <section className={panel ? "workspace single-panel" : "billing-manager"} data-billing-manager={mode} role="tabpanel">
      <div className={panel ? "desk-panel" : "manager-panel"} role={panel ? undefined : "tabpanel"}>
        {pendingInvoicesOnly && <div className="panel-actions"><div><h2>Ready To Invoice</h2><p>Active invoices awaiting payment. View or download invoices from this read-only queue.</p></div></div>}
        {panel && !compactAccountsPanel && <>
          <div className="panel-actions"><div><h2>{mode}</h2><p>{mode === "Payments" ? "Paid invoices with downloadable receipts" : "All workshop jobs"}</p></div></div>
          {actor.role === "accounts" && <p className="permission-note">Invoices are view/download-only. Use Quick Mark Paid to complete the handover.</p>}
          {actor.role === "accounts" && <AccountsReconciliationQueues jobs={state.jobs} />}
          {!editable && actor.role !== "accounts" && <p className="permission-note">Read-only billing access.</p>}
          {inline && <p className="permission-note" role="note">Click a row for lines, GST and totals.{manage ? "" : " Create or edit invoices from the Job Card."}</p>}
        </>}
        {manage && <>
          {pickedJob && <div className="action-row"><span className="result-summary">{pickedJob.invoice ? `${pickedJob.invoice.invoice_no} · ${invoiceStatus(pickedJob)}` : "No invoice yet"}</span>
            {pickedJob.invoice ? <><button onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}>View Invoice</button>{canEditInvoice(actor, pickedJob.job) && pickedJob.invoice.status === "Pending" && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}>Edit Invoice</button>}</> : canCreateInvoice(actor, pickedJob.job) && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}>Create Invoice</button>}</div>}</>}
        <div className="store-filter-grid billing-panel-filter-grid">
          <label className="list-search">Search<input aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, invoice, customer, vehicle or reference" /></label>
          <label>Month-Year<select aria-label={`${mode} Month-Year filter`} value={eventMonth} onChange={(event) => { setEventMonth(event.target.value); setPage(1); }}><option value="ALL">All months</option>{availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}</select></label>
          {showStatusFilter && <label>Status<select aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All</option>{statusOptions.map((value) => <option key={value}>{value}</option>)}</select></label>}
          {showPaymentModeFilter && <label>Payment mode<select aria-label="Payment mode filter" value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value as "ALL" | PaymentMode); setPage(1); }}><option value="ALL">All</option>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as PaymentMode[]).map((value) => <option key={value}>{value}</option>)}</select></label>}
          <ListSearchActions onClear={clear} />
        </div>
        <PaginationToolbar controls={<DownloadMenu report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${mode} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
        <div className="table-wrap"><table aria-label={`${mode} manager`}><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}<th>Actions</th></tr></thead><tbody>{paged.items.map((record) => {
          const open = expanded === record.key;
          const quickPay = !pendingInvoicesOnly && mode === "Invoices" && record.view.invoice?.status === "Pending" && canRecordOrVoidPayment(actor, record.view.job);
          const highlightClass = accountsRowHighlight(mode, record, compactAccountsPanel);
          return <Fragment key={record.key}>
            <tr className={[record.kind === "void" ? "billing-row-void" : "", highlightClass, inline ? "billing-row-click" : ""].filter(Boolean).join(" ") || undefined} {...(inline ? { tabIndex: 0, "aria-expanded": open, "aria-controls": `billing-detail-${record.key}`, onClick: () => toggle(record.key), onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); toggle(record.key); } } } : {})}>{columns.map((column) => <td key={column.header}>{String(column.value(record))}</td>)}<td><div className="grid-actions billing-table-actions">
              {mode === "Invoices" && <><button type="button" className="billing-table-action" onClick={(event) => { event.stopPropagation(); setInvoiceDialog({ action: "view", view: record.view }); }}><Eye size={15} />View</button><DocumentDownloadButton kind="invoice" view={record.view} label="Download" className="billing-table-action" />{quickPay && <button type="button" className="billing-table-action billing-table-action-primary" onClick={(event) => { event.stopPropagation(); setPaymentDialog(record.view); }}><Check size={15} />Quick Mark Paid</button>}</>}
              {mode === "Payments" && record.payment && <DocumentDownloadButton kind="payment-receipt" view={record.view} label="Receipt" className="billing-table-action" />}
              {mode === "Delivery" && <DocumentDownloadButton kind="gate-pass" view={record.view} label="Gate pass" className="billing-table-action" />}
            </div></td></tr>
            {inline && open && <tr className="billing-detail-row"><td colSpan={columns.length + 1} id={`billing-detail-${record.key}`}><BillingDetail record={record} actor={actor} mutate={mutate} readOnly={pendingInvoicesOnly} /></td></tr>}
          </Fragment>;
        })}</tbody></table></div>
        {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><FilterClearButton onClick={clear} label="Clear filters" /></div>}
        <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
        {invoiceDialog && <InvoiceDialog action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)} />}
        {paymentDialog?.invoice && <PaymentDialog view={paymentDialog} actor={actor} mutate={mutate} onClose={() => setPaymentDialog(undefined)} />}
      </div>
    </section>
  );
}
~~~

## CMP-billing-manager-AccountsReconciliationQueues

src/billing-manager.tsx:197-208

~~~tsx
export function AccountsReconciliationQueues({ jobs }: { jobs: JobView[] }) {
  const active = jobs.filter((view) => view.job.main_status !== "CANCELLED");
  const awaitingInvoice = active.filter((view) => view.job.main_status === "COMPLETED" && !billingReconciliation(view).invoice);
  const awaitingPayment = active.filter((view) => view.job.main_status === "COMPLETED" && Boolean(billingReconciliation(view).invoice) && !billingReconciliation(view).payment);
  const complete = active.filter((view) => view.job.main_status === "CLOSED" && billingReconciliation(view).complete);
  const exceptions = active.filter((view) => view.job.main_status === "CLOSED" && !billingReconciliation(view).complete);
  return <section className="editor-block" aria-label="Accounts reconciliation queues">
    <h3>Accounts reconciliation queues</h3>
    <div className="linked-grid"><div><span>Awaiting invoice</span><strong>{awaitingInvoice.length}</strong></div><div><span>Invoices awaiting payment</span><strong>{awaitingPayment.length}</strong></div><div><span>Completed handovers</span><strong>{complete.length}</strong></div><div><span>Closed exceptions</span><strong>{exceptions.length}</strong></div></div>
    {exceptions.length > 0 && <div className="table-wrap"><table aria-label="Closed exceptions"><thead><tr><th>Job</th><th>Customer</th><th>Missing records</th></tr></thead><tbody>{exceptions.map((view) => <tr key={view.job.id}><td>{view.job.job_no}</td><td>{view.customer.name}</td><td>{billingReconciliation(view).missing.join(", ")}</td></tr>)}</tbody></table></div>}
  </section>;
}
~~~

## CMP-billing-manager-BillingDetail

src/billing-manager.tsx:211-230

~~~tsx
function BillingDetail({ record, actor, mutate, readOnly = false }: { record: BillingRecord; actor: User; mutate: Mutate; readOnly?: boolean }) {
  const { view, payment } = record;
  const invoice = view.invoice;
  const canAct = canRecordOrVoidPayment(actor, view.job);
  const terminal = view.job.main_status === "CLOSED" || view.job.main_status === "CANCELLED";
  const receipt = view.receipt && payment && view.receipt.invoice_id === payment.invoice_id ? view.receipt : undefined;
  const totals = invoice ? invoiceTotals(view.invoice_items.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? invoice.gst_rate })), invoice.discount) : undefined;
  const status = payment ? (payment.voided_at ? "Void" : "Received") : invoiceStatus(view);
  return <div className="billing-detail" aria-label={`${view.job.job_no} detail`}>
    <div className="panel-actions"><div><h3>{payment ? "Payment" : "Invoice"} · {invoice?.invoice_no ?? view.job.job_no} <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span></h3><p>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}{invoice?.tally_invoice_no ? ` · Tally ${invoice.tally_invoice_no}` : ""}</p></div></div>
    {payment && <div className="linked-grid"><div><span>Invoice</span><strong>{invoice?.invoice_no ?? "-"}</strong></div><div><span>Mode</span><strong>{payment.mode === "Other" ? `Other (${payment.other_detail})` : payment.mode}</strong></div><div><span>Reference</span><strong>{payment.reference || "-"}</strong></div><div><span>Receipt</span><strong>{receipt?.receipt_no ?? "-"}</strong></div><div><span>Amount</span><strong>{money(payment.amount)}</strong></div>{payment.voided_at && <div><span>Void reason</span><strong>{payment.void_reason}</strong></div>}</div>}
    {invoice && <div className="table-wrap"><table aria-label="Invoice lines"><thead><tr><th>Type</th><th>Description</th><th>Qty</th><th>Rate</th><th>GST type</th><th>GST %</th><th>Amount</th></tr></thead><tbody>{view.invoice_items.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.description}</td><td>{item.qty}</td><td>{money(item.rate)}</td><td>{item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST")}</td><td>{item.gst_rate ?? invoice.gst_rate}%</td><td>{money(item.qty * item.rate)}</td></tr>)}</tbody></table></div>}
    {invoice && totals && <div className="invoice-totals" aria-label="Invoice summary"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(invoice.total)}</strong></span></div>}
    {invoice?.voided_at && <p className="permission-note">Invoice voided on {invoice.voided_at}: {invoice.void_reason}</p>}
    {payment?.voided_at && <p className="permission-note">Payment voided on {payment.voided_at}: {payment.void_reason}</p>}
    {!readOnly && record.kind === "unpaid" && invoice && (canAct ? <RecordPaymentForm invoice={invoice} actor={actor} mutate={mutate} /> : <p className="permission-note">Only the Owner and Accounts can record payment.</p>)}
    {!readOnly && payment && !payment.voided_at && actor.role === "admin" && <InlineVoid label="Void Payment" hint="Voiding reopens the Invoice and voids the Receipt." onVoid={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} mutate={mutate} />}
    {!readOnly && !payment && invoice && actor.role === "admin" && canVoidCurrentInvoice(actor, view) && <InlineVoid label="Void Invoice" hint="Voiding unlocks the material rows this invoice billed." onVoid={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} mutate={mutate} />}
  </div>;
}
~~~

## CMP-billing-manager-InlineVoid

src/billing-manager.tsx:232-249

~~~tsx
function InlineVoid({ label, hint, onVoid, mutate }: { label: string; hint: string; onVoid: (db: Database, reason: string) => void; mutate: Mutate }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  if (!open) return <div className="action-row"><button type="button" className="danger-action" onClick={() => setOpen(true)}>{label}</button></div>;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!reason.trim()) { setError("A reason is required."); return; }
    mutate((db) => onVoid(db, reason), setError);
  };
  return <form className="billing-dialog-form" onSubmit={submit} aria-label={label}>
    <p className="permission-note">{hint}</p>
    <label>Void reason<textarea aria-label={`${label} reason`} required value={reason} onChange={(event) => setReason(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
    <div className="action-row"><button type="button" onClick={() => { setOpen(false); setReason(""); setError(""); }}>Cancel</button><button type="submit" className="danger-action">Confirm {label}</button></div>
  </form>;
}
~~~

## CMP-billing-manager-RecordPaymentForm

src/billing-manager.tsx:252-268

~~~tsx
function RecordPaymentForm({ invoice, actor, mutate }: { invoice: { id: number; total: number }; actor: User; mutate: Mutate }) {
  const [mode, setMode] = useState<PaymentMode>("UPI");
  const [otherDetail, setOtherDetail] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const record = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    mutate((db) => { recordPaymentForActor(db, invoice.id, actor.id, { mode, otherDetail, reference, notes }); }, setError);
  };
  return <form className="billing-dialog-form" onSubmit={record} aria-label="Quick mark paid">
    <div className="form-grid"><label>Amount<input aria-label="Payment amount" value={money(invoice.total)} disabled readOnly /></label><label>Mode<select aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>{mode === "Other" && <label>Other detail<input aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)} /></label>}<label>Reference (optional)<input aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)} /></label></div><label>Notes (optional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
    <div className="action-row"><button type="submit" className="primary-action">Confirm Payment</button></div>
  </form>;
}
~~~

## CMP-billing-manager-InvoiceDialog

src/billing-manager.tsx:280-328

~~~tsx
export function InvoiceDialog({ action, view, candidates = [], fixedJob = false, actor, mutate, onClose }: InvoiceDialogProps) {
  const [selected, setSelected] = useState(view);
  const invoice = selected.invoice;
  const draftFor = (source: JobView) => buildInvoiceDraft(source);
  const toDrafts = (source: JobView): InvoiceItemDraft[] => source.invoice
    ? source.invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_type: item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST"), gst_rate: item.gst_rate ?? source.invoice!.gst_rate, material_row_id: item.material_row_id ?? undefined }))
    : draftFor(source).lines;
  const [tally, setTally] = useState(invoice?.tally_invoice_no ?? "");
  const [discount, setDiscount] = useState(invoice?.discount ?? draftFor(selected).discount);
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [editNote, setEditNote] = useState("");
  const [items, setItems] = useState<InvoiceItemDraft[]>(toDrafts(selected));
  const [error, setError] = useState("");
  const readOnly = action === "view";
  const financialLocked = Boolean(invoice && selected.payments.some((payment) => payment.invoice_id === invoice.id && !payment.voided_at));
  const lockFinancials = readOnly || financialLocked;
  const totals = invoiceTotals(items.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate })), discount);
  const warning = unissuedWarning(draftFor(selected).unissuedRows);
  const lateMaterials = invoice ? pickableMaterialLines(selected).filter((line) => !items.some((item) => item.material_row_id === line.material_row_id)) : [];
  const chooseJob = (jobId: number) => {
    const next = candidates.find((candidate) => candidate.job.id === jobId);
    if (!next) return;
    setSelected(next);
    setTally("");
    setDiscount(draftFor(next).discount);
    setNotes("");
    setItems(toDrafts(next));
  };
  const updateItem = (index: number, patch: Partial<InvoiceItemDraft>) => setItems((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const ok = mutate((db) => action === "create"
      ? createInvoiceForActor(db, selected.job.id, actor.id, { tallyInvoiceNo: tally, discount, notes, items })
      : saveInvoiceForActor(db, invoice!.id, actor.id, { tallyInvoiceNo: tally, discount, notes, items, note: editNote }), setError);
    if (ok) onClose();
  };
  return <Dialog title={`${action[0].toUpperCase() + action.slice(1)} Invoice`} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide className="dialog-document-editor" footer={!readOnly && <button className="primary-action" type="submit" form="invoice-dialog-form">{action === "edit" ? "Update Invoice" : "Save Invoice"}</button>}><form id="invoice-dialog-form" className="billing-dialog-form" onSubmit={submit}>
    {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>}
    {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>}
    <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div>
    <div className="estimate-items"><div className="line-items-header"><strong>Invoice items</strong>{!lockFinancials && <button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}><Plus size={16} />Add Item</button>}</div><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST type</span><span>GST rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate || 18 }) })}><option>CGST+SGST</option><option>IGST</option><option>No GST</option></select>{item.gst_type === "No GST" ? <span className="gst-no-rate">0%</span> : <SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />} {!lockFinancials && <button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div>
    <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div>
    <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label>
    {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>}
    {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference and notes can still be updated.</p>}
    {error && <p className="error-text" role="alert">{error}</p>}
  </form></Dialog>;
}
~~~

## CMP-billing-manager-PaymentDialog

src/billing-manager.tsx:331-338

~~~tsx
function PaymentDialog({ view, actor, mutate, onClose }: { view: JobView; actor: User; mutate: Mutate; onClose: () => void }) {
  const invoice = view.invoice!;
  return <Dialog title="Quick Mark Paid" subtitle={`${view.job.job_no} · ${invoice.invoice_no}`} onClose={onClose} footer={null}><RecordPaymentForm invoice={invoice} actor={actor} mutate={(action, onError) => {
    const ok = mutate(action, onError);
    if (ok) onClose();
    return ok;
  }} /></Dialog>;
}
~~~

## CMP-billing-manager-JobInvoicePanel

src/billing-manager.tsx:341-363

~~~tsx
export function JobInvoicePanel({ view, actor, mutate, onOpen, onEstimate }: { view: JobView; actor: User; mutate: Mutate; onOpen: () => void; onEstimate: () => void }) {
  const invoice = view.invoice;
  const [voiding, setVoiding] = useState(false);
  const canVoidInvoice = Boolean(invoice && !invoice.voided_at) && actor.role === "admin" && !view.payments.some((item) => item.invoice_id === invoice!.id && !item.voided_at) && view.job.main_status !== "CLOSED" && view.job.main_status !== "CANCELLED";
  const actions = resolveJobDocumentActions("invoice", view, actor);
  const estimateActions = resolveJobDocumentActions("estimate", view, actor);
  const warning = unissuedWarning(buildInvoiceDraft(view).unissuedRows);
  if (!invoice) {
    return <section className="editor-block job-card-invoice" aria-label="Job invoice">
      <p className="empty-state">No invoice yet.{view.estimate?.status === "Approved" ? "" : " Approve the Estimate first."}</p>
      {warning && <p className="permission-note" role="status">{warning}</p>}
      <div className="action-row">{estimateActions.includes("approve-estimate") && <button type="button" className="primary-action" onClick={onEstimate}>Approve Estimate</button>}{actions.includes("create-invoice") && <button type="button" className="primary-action" onClick={onOpen}>Create Invoice</button>}</div>
    </section>;
  }
  const totals = invoiceTotals(view.invoice_items.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? invoice.gst_rate })), invoice.discount);
  return <section className="editor-block job-card-invoice" aria-label="Job invoice">
    <div className="panel-actions"><div><h3>{invoice.invoice_no}</h3><p>{invoice.status}{invoice.tally_invoice_no ? ` · Tally ${invoice.tally_invoice_no}` : ""}</p></div><div className="action-row">{actions.includes("edit-invoice") && <button type="button" className="primary-action" onClick={onOpen}>Edit Invoice</button>}{canVoidInvoice && <button type="button" className="danger-action" onClick={() => setVoiding(true)}>Void Invoice</button>}</div></div>
    <div className="table-wrap"><table aria-label="Invoice lines"><thead><tr><th>Type</th><th>Description</th><th>Qty</th><th>Rate</th><th>GST type</th><th>GST %</th><th>Amount</th></tr></thead><tbody>{view.invoice_items.map((item) => <tr key={item.id}><td>{item.kind}</td><td>{item.description}</td><td>{item.qty}</td><td>{money(item.rate)}</td><td>{item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST")}</td><td>{item.gst_rate ?? invoice.gst_rate}%</td><td>{money(item.qty * item.rate)}</td></tr>)}</tbody></table></div>
    {warning && <p className="permission-note" role="status">{warning}</p>}
    <div className="invoice-totals" aria-label="Invoice summary"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(invoice.total)}</strong></span></div>
    {voiding && <VoidReasonDialog title="Void Invoice?" subtitle={`${view.job.job_no} · Unlocks the material rows it billed`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} />}
  </section>;
}
~~~

## CMP-billing-manager-VoidReasonDialog

src/billing-manager.tsx:365-378

~~~tsx
function VoidReasonDialog({ title, subtitle, action, onClose, mutate }: { title: string; subtitle: string; action: (db: Database, reason: string) => void; onClose: () => void; mutate: Mutate }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!reason.trim()) { setError("A reason is required."); return; }
    if (mutate((db) => action(db, reason), setError)) onClose();
  };
  return <Dialog title={title} subtitle={subtitle} onClose={onClose} footer={<button className="danger-action" type="submit" form="void-reason-dialog-form">Void</button>}><form id="void-reason-dialog-form" className="billing-dialog-form" onSubmit={submit}>
    <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label>
    {error && <p className="error-text" role="alert">{error}</p>}
  </form></Dialog>;
}
~~~

## CMP-billing-manager-JobPaymentPanel

src/billing-manager.tsx:381-398

~~~tsx
export function JobPaymentPanel({ view, actor, mutate }: { view: JobView; actor: User; mutate: Mutate }) {
  const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;
  const payment = invoice ? view.payments.find((item) => item.invoice_id === invoice.id && !item.voided_at) : undefined;
  const receipt = view.receipt && !view.receipt.voided_at && invoice && view.receipt.invoice_id === invoice.id ? view.receipt : undefined;
  const [voiding, setVoiding] = useState(false);
  const terminal = view.job.main_status === "CLOSED" || view.job.main_status === "CANCELLED";
  const canAct = canMutateBilling(actor) && !terminal;
  if (!invoice) return <section className="editor-block job-card-payment" aria-label="Job payment"><p className="empty-state">No invoice yet. Create an Invoice before recording payment.</p></section>;
  const voided = (view.payment_history ?? view.payments).filter((item) => item.invoice_id === invoice.id && item.voided_at);
  return <section className="editor-block job-card-payment" aria-label="Job payment">
    <div className="panel-actions"><div><h3>{invoice.invoice_no}</h3><p>{invoice.status} · Total {money(invoice.total)}</p></div>{payment && actor.role === "admin" && <button type="button" className="danger-action" onClick={() => setVoiding(true)}>Void Payment</button>}</div>
    {payment ? <div className="table-wrap"><table aria-label="Payment"><thead><tr><th>Receipt</th><th>Mode</th><th>Reference</th><th>Amount</th></tr></thead><tbody><tr><td>{receipt?.receipt_no ?? "-"}</td><td>{payment.mode === "Other" ? `Other (${payment.other_detail})` : payment.mode}</td><td>{payment.reference || "-"}</td><td>{money(payment.amount)}</td></tr></tbody></table></div>
      : canAct ? <RecordPaymentForm invoice={invoice} actor={actor} mutate={mutate} />
        : <p className="permission-note">{terminal ? `This job is ${view.job.main_status} and read-only.` : "Only the Owner and Accounts can record payment."}</p>}
    {voided.length > 0 && <div className="table-wrap"><table aria-label="Voided payments"><thead><tr><th>Mode</th><th>Reference</th><th>Amount</th><th>Void reason</th></tr></thead><tbody>{voided.map((item) => <tr key={item.id}><td>{item.mode}</td><td>{item.reference || "-"}</td><td>{money(item.amount)}</td><td>{item.void_reason}</td></tr>)}</tbody></table></div>}
    {voiding && payment && <VoidReasonDialog title="Void Payment?" subtitle={`${view.job.job_no} · Reopens the Invoice and voids the Receipt`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} />}
  </section>;
}
~~~

## CMP-body-mark-BodyMarkDiagram

src/body-mark.tsx:60-79

~~~tsx
export function BodyMarkDiagram({ marks, onChange, meta, hideDownload = false }: { marks: DamageMark[]; onChange?: (marks: DamageMark[]) => void; meta: BodyMarkMeta; hideDownload?: boolean }) {
  const [error, setError] = useState("");
  const download = () => { setError(""); downloadBodyMarkImage(marks, meta).catch((err) => setError(err instanceof Error ? err.message : "Download failed.")); };
  return (
    <div className="body-mark" data-testid="damage-diagram">
      <div className={`body-mark-canvas${onChange ? " editable" : ""}`} role="group" aria-label="Combined vehicle body-mark illustration" onClick={onChange ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onChange(addDamageMark(marks, ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100));
      } : undefined}>
        <img src={DAMAGE_DIAGRAM_ASSET} alt="Vehicle body illustration" />
        {marks.map((mark) => <button key={mark.id} type="button" className="damage-marker" data-testid="damage-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} aria-label={`Remove damage mark ${mark.id}`} title={`Remove damage mark ${mark.id}`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }} disabled={!onChange}>{mark.id}<X size={10} aria-hidden="true" /></button>)}
      </div>
      <div className="body-mark-footer">
        <p className="damage-hint">{onChange ? "Click the illustration to mark damage; use a numbered marker to remove it." : ""} {marks.length} mark{marks.length === 1 ? "" : "s"} recorded.</p>
        {!hideDownload && <button type="button" className="workflow-action action-document document-download" onClick={download}><Download size={15} />Download image</button>}
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
    </div>
  );
}
~~~

## CMP-booking-calendar-BookingCalendar

src/booking-calendar.tsx:28-46

~~~tsx
export function BookingCalendar({ state, actor, mutate }: { state: WorkshopState; actor: User; mutate: Mutate }) {
  const range = useMemo(() => advanceBookingRange(), []); const [month, setMonth] = useState(range.firstMonth); const [selectedDate, setSelectedDate] = useState(range.min); const [creating, setCreating] = useState(false); const [editingCapacity, setEditingCapacity] = useState(false); const [form, setForm] = useState<BookingDraft>(() => draftFor(range.min)); const [error, setError] = useState("");
  const draftCapacity = (date: string) => { const c = capacityFor(state, date); return { serviceWork: String(c.serviceWork.limit), generalCheckupFollowup: String(c.generalCheckupFollowup.limit) }; };
  const [capacityDraft, setCapacityDraft] = useState(() => draftCapacity(range.min)); const capacity = capacityFor(state, selectedDate); const canOverride = actor.role === "admin";
  const quota = (date: string, type: BookingServiceType) => capacityFor(state, date)[quotaKey(type)]; const formQuota = quota(form.bookingDate, form.serviceType);
  const bookings = useMemo(() => state.bookings.filter((b) => b.booking_date === selectedDate).sort((a, b) => a.created_at.localeCompare(b.created_at)), [state.bookings, selectedDate]);
  const overrides = useMemo(() => new Map(state.booking_capacity_overrides.filter((r) => r.booking_date === selectedDate).map((r) => [r.booking_id, r])), [state.booking_capacity_overrides, selectedDate]);
  const selectDate = (date: string) => { setSelectedDate(date); setCapacityDraft(draftCapacity(date)); };
  const changeMonth = (delta: -1 | 1) => { const next = shiftCalendarMonth(month, delta); if (next < range.firstMonth || next > range.lastMonth) return; setMonth(next); selectDate(clampAdvanceBookingDate(`${next}-01`, range)); };
  const submit = (event: FormEvent) => { event.preventDefault(); if (mutate((db) => createBooking(db, actor.id, form), setError)) setCreating(false); };
  const saveLimits = (event: FormEvent) => { event.preventDefault(); if (mutate((db) => setBookingCapacityForDate(db, actor.id, selectedDate, { serviceWork: Number(capacityDraft.serviceWork), generalCheckupFollowup: Number(capacityDraft.generalCheckupFollowup) }), setError)) setEditingCapacity(false); };
  return <section className="workspace booking-calendar-workspace" aria-label="Advance booking calendar"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Advance Bookings</h2><p>Plan customer arrivals by date. Advisor assignment happens only after check-in.</p></div><button className="primary-action" onClick={() => { setForm(draftFor(selectedDate)); setError(""); setCreating(true); }} disabled={!canOverride && !capacity.serviceWork.remaining && !capacity.generalCheckupFollowup.remaining}><Plus size={16} /> Create Booking</button></div>
    <div className="booking-calendar-layout"><section className="booking-month-panel" aria-label="Booking month calendar"><div className="booking-month-toolbar"><button type="button" aria-label="Previous month" disabled={month === range.firstMonth} onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button><h3>{monthLabel(month)}</h3><button type="button" aria-label="Next month" disabled={month === range.lastMonth} onClick={() => changeMonth(1)}><ChevronRight size={18} /></button></div><div className="booking-calendar-grid" role="grid" aria-label={`${monthLabel(month)} bookings`}>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <strong key={d} role="columnheader">{d}</strong>)}{datesForCalendarMonth(month).map((date) => { const c = capacityFor(state, date); const full = !c.serviceWork.remaining && !c.generalCheckupFollowup.remaining; return <button type="button" key={date} role="gridcell" disabled={!isAdvanceBookingDate(date, range)} onClick={() => selectDate(date)} className={`booking-calendar-day${!date.startsWith(month) ? " outside-month" : ""}${date === selectedDate ? " selected" : ""}${full ? " full" : ""}`} aria-pressed={date === selectedDate}><span>{Number(date.slice(-2))}</span><small>SW {c.serviceWork.count}/{c.serviceWork.limit} · C {c.generalCheckupFollowup.count}/{c.generalCheckupFollowup.limit}</small></button>; })}</div><p className="booking-calendar-legend"><span className="calendar-full-dot" /> SW = Service Work · C = General Checkup / Follow-up.</p></section>
      <section className="booking-day-detail" aria-live="polite"><div className="panel-actions"><div><h3>{dateLabel(selectedDate)}</h3><p>Service Work: <strong>{capacity.serviceWork.count}/{capacity.serviceWork.limit}</strong> · {capacity.serviceWork.remaining} remaining</p><p>General Checkup / Follow-up: <strong>{capacity.generalCheckupFollowup.count}/{capacity.generalCheckupFollowup.limit}</strong> · {capacity.generalCheckupFollowup.remaining} remaining</p></div>{canOverride && <button type="button" aria-label="Admin control: set daily booking limits" onClick={() => { setCapacityDraft(draftCapacity(selectedDate)); setError(""); setEditingCapacity(true); }}>Admin: Set limits</button>}</div>{(!capacity.serviceWork.remaining || !capacity.generalCheckupFollowup.remaining) && <p className="booking-capacity-alert" role="status">{!capacity.serviceWork.remaining ? "Service Work is full. " : ""}{!capacity.generalCheckupFollowup.remaining ? "General Checkup / Follow-up is full. " : ""}Reception cannot select a full type.{canOverride ? " Admin may add one with an override reason." : ""}</p>}<div className="booking-day-list">{bookings.length === 0 ? <p className="empty-state">No advance bookings for this day.</p> : bookings.map((b) => <article className="booking-day-row" key={b.id}><div><strong>{b.customer_name}</strong><span>{b.vehicle_no} · {b.make} {b.model}</span><span>{b.service_type} · {b.arrival_window || "Arrival window not set"} · {b.status}</span></div><div><span>{b.mobile}</span>{overrides.get(b.id) && <small>Admin override: {overrides.get(b.id)!.reason}</small>}</div></article>)}</div></section></div></div>
    {creating && <Dialog title="Create advance booking" subtitle={`Booking for ${dateLabel(selectedDate)}`} onClose={() => setCreating(false)}><form className="booking-form" onSubmit={submit}><label>Customer name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label><label>Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label><label>Vehicle number<input required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })} /></label><label>Make<input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /></label><label>Model<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label><label>Color<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label><label>Booking date<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} /></label><label>Service type<select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}>{serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}</select></label><label>Arrival window<select value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}>{windows.map((w) => <option key={w} value={w}>{w || "Not set"}</option>)}</select></label><label className="booking-form-wide">Requested work<textarea required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })} /></label>{formQuota.remaining === 0 && canOverride && <label className="booking-form-wide">Admin override reason (recorded in the booking audit trail)<textarea required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })} /></label>}{error && <p className="error-text booking-form-wide" role="alert">{error}</p>}<div className="action-row booking-form-wide"><button className="primary-action">Save Booking</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div></form></Dialog>}
    {editingCapacity && <Dialog title="Set daily booking limits" subtitle={dateLabel(selectedDate)} onClose={() => setEditingCapacity(false)}><form onSubmit={saveLimits}><label>Service Work bookings allowed<input aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })} /></label><label>General Checkup / Follow-up bookings allowed<input aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })} /></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="action-row"><button className="primary-action">Save limits</button><button type="button" onClick={() => setEditingCapacity(false)}>Cancel</button></div></form></Dialog>}
  </section>;
}
~~~

## CMP-booking-check-in-BookingCheckInDialog

src/booking-check-in.tsx:12-50

~~~tsx
export function BookingCheckInDialog({ booking, actor, mutate, onClose, onCreated }: {
  booking: Booking;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
  onCreated: (jobId: number, jobNo: string) => void;
}) {
  const [odoReading, setOdoReading] = useState("");
  const [fuelLevelValue, setFuelLevelValue] = useState("");
  const [fuelLevelUnit, setFuelLevelUnit] = useState<FuelUnit>("bars");
  const [keys, setKeys] = useState("");
  const [accessories, setAccessories] = useState("");
  const [requestedWork, setRequestedWork] = useState(booking.requested_work);
  const [marks, setMarks] = useState<DamageMark[]>([]);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const odo = Number(odoReading);
    if (!Number.isFinite(odo) || odo < 0) return setError("Enter the ODO meter reading in km.");
    let jobId = 0;
    let jobNo = "";
    if (mutate((db) => { jobId = checkInBooking(db, booking.id, actor.id, { odoReading: odo, fuelLevelValue, fuelLevelUnit, keys, accessories, requestedWork, damageMarks: serializeDamageMarks(marks) }).jobId; jobNo = String(db.exec("select job_no from job_cards where id=?", [jobId])[0]?.values[0]?.[0] ?? ""); }, setError)) onCreated(jobId, jobNo);
  };
  return <Dialog wide title="Check in advance booking" subtitle={`${booking.customer_name} · ${booking.vehicle_no}`} onClose={onClose} footer={<button className="primary-action" type="submit" form="booking-check-in-form">Create Visit and Job Card</button>}>
    <form id="booking-check-in-form" onSubmit={submit}>
      <p className="permission-note">Booking details are prefilled below. Capture actual arrival condition; advisor assignment happens after check-in.</p>
      <div className="form-grid">
        <label>Customer name<input value={booking.customer_name} readOnly /></label><label>Mobile<input value={booking.mobile} readOnly /></label>
        <label>Vehicle number<input value={booking.vehicle_no} readOnly /></label><label>Vehicle<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly /></label><label>Booked service type<input value={booking.service_type} readOnly /></label>
        <label>ODO meter reading (km)<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} /></label>
        <label>Fuel / battery level<div className="field-pair"><input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} /><select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}><option value="bars">bars</option><option value="%">%</option><option value="litres">litres</option><option value="Other">Other</option></select></div></label>
        <label>Keys<input value={keys} onChange={(event) => setKeys(event.target.value)} /></label><label>Accessories<input value={accessories} onChange={(event) => setAccessories(event.target.value)} /></label>
      </div>
      <label>Requested work<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} /></label>
      <div className="damage-capture"><strong>Arrival body marks (optional)</strong><BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} /></div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  </Dialog>;
}
~~~

## CMP-booking-expected-today-ExpectedTodayBookings

src/booking-expected-today.tsx:25-104

~~~tsx
export function ExpectedTodayBookings({ state, actor, mutate, operationalDate, onCheckedIn }: { state: WorkshopState; actor: User; mutate: Mutate; operationalDate: string; onCheckedIn?: (jobId: number, jobNo: string) => void }) {
  const range = useMemo(() => advanceBookingRange(), []);
  const [filter, setFilter] = useState<ExpectedTodayFilter>("ALL");
  const [selected, setSelected] = useState<{ booking: Booking; action: Action }>();
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState(operationalDate);
  const [arrivalWindow, setArrivalWindow] = useState<BookingArrivalWindow>("");
  const [capacityOverrideReason, setCapacityOverrideReason] = useState("");
  const rows = useMemo(
    () => expectedBookingsForDate(state.bookings, state.booking_call_logs, operationalDate, filter),
    [state.bookings, state.booking_call_logs, operationalDate, filter],
  );
  const allRows = useMemo(
    () => expectedBookingsForDate(state.bookings, state.booking_call_logs, operationalDate),
    [state.bookings, state.booking_call_logs, operationalDate],
  );
  const openAction = (booking: Booking, action: Action) => {
    setSelected({ booking, action });
    setError("");
    setNote("");
    setCapacityOverrideReason("");
    setRescheduleDate(clampAdvanceBookingDate(booking.booking_date, range));
    setArrivalWindow(booking.arrival_window);
  };
  const closeAction = () => { setSelected(undefined); setError(""); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || selected.action === "check-in") return;
    const success = mutate((db) => {
      if (selected.action === "call") recordBookingCall(db, selected.booking.id, actor.id, note);
      if (selected.action === "reschedule") rescheduleBooking(db, selected.booking.id, actor.id, rescheduleDate, note, arrivalWindow, new Date().toISOString(), capacityOverrideReason);
      if (selected.action === "cancel") cancelBooking(db, selected.booking.id, actor.id, note);
      if (selected.action === "no-show") markBookingNoShow(db, selected.booking.id, actor.id, note);
    }, setError);
    if (success) closeAction();
  };
  const title = selected?.action === "call" ? "Log follow-up call" : selected?.action === "reschedule" ? "Reschedule booking" : selected?.action === "cancel" ? "Cancel booking" : "Mark booking as no-show";
  const reschedulingBooking = selected?.action === "reschedule" ? selected.booking : undefined;
  const rescheduleQuotaFull = Boolean(reschedulingBooking && (() => {
    const configured = state.booking_capacity_limits.find((limit) => limit.booking_date === rescheduleDate);
    const limit = reschedulingBooking.service_type === "Service Work" ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
    const count = state.bookings.filter((booking) => booking.id !== reschedulingBooking.id && booking.booking_date === rescheduleDate && booking.service_type === reschedulingBooking.service_type && ["Booked", "Confirmed", "Rescheduled"].includes(booking.status)).length;
    return count >= limit;
  })());

  if (selected?.action === "check-in") return <BookingCheckInDialog booking={selected.booking} actor={actor} mutate={mutate} onClose={closeAction} onCreated={(jobId, jobNo) => { closeAction(); onCheckedIn?.(jobId, jobNo); }} />;

  return <section className="expected-today" aria-labelledby="expected-today-title">
    <div className="expected-today-heading">
      <div>
        <h2 id="expected-today-title">Expected Today</h2>
        <p>{operationalDate} · customers yet to arrive at reception</p>
      </div>
      <span className="expected-count" aria-label={`${allRows.length} expected customers`}>{allRows.length} expected</span>
    </div>
    <div className="expected-filter-bar" role="group" aria-label="Expected today filters">
      <label>Follow-up status<select aria-label="Expected today follow-up status" value={filter} onChange={(event) => setFilter(event.target.value as ExpectedTodayFilter)}>
        <option value="ALL">All expected</option><option value="NEEDS_FOLLOW_UP">Needs follow-up</option><option value="CALLED">Call logged</option>
      </select></label>
      <span>{rows.length} shown</span>
    </div>
    <div className="expected-booking-list">
      {rows.map(({ booking, calls, lastCall }) => <article className="expected-booking-row" key={booking.id}>
        <div className="expected-booking-identity"><strong>{booking.customer_name}</strong><span>{booking.vehicle_no} · {booking.make} {booking.model}</span><span>{booking.service_type} · {booking.mobile} · {booking.arrival_window || "Arrival time not set"}</span></div>
        <div className="expected-booking-work"><span className={`booking-status booking-status-${booking.status.toLowerCase()}`}>{booking.status}</span><p>{booking.requested_work}</p>{lastCall ? <small>Last call: {new Date(lastCall.called_at).toLocaleString("en-IN")} · {lastCall.note}</small> : <small className="needs-follow-up">No call logged yet</small>}</div>
        <div className="expected-booking-actions"><button type="button" className="primary-action" onClick={() => openAction(booking, "check-in")}>Check in</button><button type="button" onClick={() => openAction(booking, "call")}>Log call{calls.length ? ` (${calls.length})` : ""}</button><button type="button" onClick={() => openAction(booking, "reschedule")}>Reschedule</button><button type="button" className="danger-action" onClick={() => openAction(booking, "cancel")}>Cancel</button><button type="button" className="secondary-action" onClick={() => openAction(booking, "no-show")}>No-show</button></div>
      </article>)}
      {!rows.length && <div className="expected-empty"><strong>No customers match this filter.</strong><span>Bookings checked in, cancelled, rescheduled away, or marked no-show do not appear here.</span></div>}
    </div>
    {selected && <Dialog title={title} subtitle={`${selected.booking.customer_name} · ${selected.booking.vehicle_no}`} onClose={closeAction} footer={<button type="submit" form="booking-follow-up-form" className={selected.action === "cancel" ? "danger-action" : "primary-action"}>{selected.action === "call" ? "Save call note" : selected.action === "reschedule" ? "Save reschedule" : selected.action === "cancel" ? "Cancel booking" : "Mark no-show"}</button>}>
      <form id="booking-follow-up-form" className="booking-follow-up-form" onSubmit={submit}>
        {selected.action === "reschedule" && <><label>New booking date<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required /></label><label>Booked service type<input value={selected.booking.service_type} readOnly /></label><label>Arrival window<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>{windowOptions.map((window) => <option key={window} value={window}>{window || "Not set"}</option>)}</select></label>{rescheduleQuotaFull && actor.role === "admin" && <label>Admin override reason (recorded in the booking audit trail)<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} /></label>}</>}
        <label>{selected.action === "call" ? "Call note" : selected.action === "reschedule" ? "Reschedule reason" : selected.action === "cancel" ? "Cancellation reason" : "No-show reason"}<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required /></label>
        {selected.action === "no-show" && <p className="permission-note">Use this only after day-end follow-up. This is a manual status and cannot be undone from Expected Today.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
    </Dialog>}
  </section>;
}
~~~

## CMP-developer-console-DeveloperConsole

src/developer-console.tsx:5-19

~~~tsx
export function DeveloperConsole({ state, commit, onEmulate, onReset }: { state: DeveloperControlPlaneState; commit: (action: (current: DeveloperControlPlaneState) => DeveloperControlPlaneState) => void; onEmulate: (role: EmulationRole) => void; onReset: () => void; }) {
  const tenant = selectedTenant(state);
  const [tab, setTab] = useState<"Tenants" | "Communications" | "Billing">("Tenants");
  const [role, setRole] = useState<EmulationRole>("admin");
  const [notice, setNotice] = useState("");
  const test = (channel: "email" | "whatsapp") => { commit((current) => simulateCommunicationTest(current, channel, tenant.id, tenant.profile.email)); setNotice(`${channel === "email" ? "Email" : "WhatsApp"} test queued as a simulated delivery.`); };
  return <main className="developer-console">
    <header className="developer-header"><div><p>Developer control plane · browser demo only</p><h1><ShieldCheck size={28} /> Developer Console</h1></div><button className="danger-action" onClick={onReset}><RotateCcw size={16} /> Reset demo</button></header>
    <div className="management-tabs" role="tablist" aria-label="Developer Console tabs">{(["Tenants", "Communications", "Billing"] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div>
    {notice && <p className="success-text">{notice}</p>}
    {tab === "Tenants" && <section className="developer-grid"><div className="desk-panel"><h2>Demo tenants</h2>{state.tenants.map((item) => <button className={`tenant-row ${item.id === tenant.id ? "selected" : ""}`} key={item.id} onClick={() => commit((current) => ({ ...current, selectedTenantId: item.id }))}><Building2 size={18}/><span><strong>{item.profile.name}</strong><small>{item.lifecycle}</small></span></button>)}<TenantCreate onCreate={(profile) => commit((current) => createTenant(current, profile))}/></div><div className="desk-panel"><h2>{tenant.profile.name}</h2><TenantProfileForm profile={tenant.profile} onSave={(profile) => commit((current) => updateTenantProfile(current, tenant.id, profile))}/><div className="developer-actions"><button className={tenant.lifecycle === "active" ? "danger-action" : "primary-action"} onClick={() => commit((current) => setTenantLifecycle(current, tenant.id, tenant.lifecycle === "active" ? "disabled" : "active"))}>{tenant.lifecycle === "active" ? "Disable tenant" : "Restore tenant"}</button><select aria-label="Emulate role" value={role} onChange={(event) => setRole(event.target.value as EmulationRole)}>{Object.entries(EMULATION_ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="primary-action" disabled={tenant.lifecycle !== "active"} onClick={() => onEmulate(role)}><Play size={16}/> Emulate tenant</button></div>{tenant.lifecycle !== "active" && <p className="error-text">Disabled tenants cannot be emulated or used operationally.</p>}</div></section>}
    {tab === "Communications" && <section className="developer-grid">{(["email", "whatsapp"] as const).map((channel) => <div className="desk-panel" key={channel}><h2>{channel === "email" ? <Mail size={20}/> : <MessageCircle size={20}/>} {channel === "email" ? "Email" : "WhatsApp"}</h2><label className="switch-line"><input type="checkbox" checked={state.communications[channel].active} onChange={(event) => commit((current) => updateCommunication(current, channel, { active: event.target.checked }))}/> Channel active</label><label>Default sender<input value={state.communications[channel].sender} onChange={(event) => commit((current) => updateCommunication(current, channel, { sender: event.target.value }))}/></label><button className="primary-action" onClick={() => test(channel)}>Send simulated test</button></div>)}</section>}
    {tab === "Communications" && <section className="desk-panel"><h2>Simulated delivery log</h2>{state.communicationLogs.length ? <ul className="developer-log">{state.communicationLogs.map((item) => <li key={item.id}>{item.channel} to {item.recipient} — <strong>{item.result}</strong></li>)}</ul> : <p>No test sends yet.</p>}</section>}
    {tab === "Billing" && <Billing state={state} tenantId={tenant.id} commit={commit}/>}</main>;
}
~~~

## CMP-developer-console-TenantCreate

src/developer-console.tsx:21-21

~~~tsx
function TenantCreate({ onCreate }: { onCreate: (profile: TenantProfile) => void }) { const [name, setName] = useState(""); const submit = (event: FormEvent) => { event.preventDefault(); if (!name.trim()) return; onCreate({ name, brandName: name, address: "", contactName: "", email: "", phone: "", gstin: "", timezone: "Asia/Kolkata", currency: "INR", invoicePrefix: name.slice(0, 4).toUpperCase() }); setName(""); }; return <form className="inline-form" onSubmit={submit}><input aria-label="New tenant name" value={name} onChange={(event) => setName(event.target.value)} placeholder="New workshop name"/><button className="primary-action"><Plus size={16}/> Create tenant</button></form>; }
~~~

## CMP-developer-console-TenantProfileForm

src/developer-console.tsx:22-22

~~~tsx
function TenantProfileForm({ profile, onSave }: { profile: TenantProfile; onSave: (profile: Partial<TenantProfile>) => void }) { const [draft, setDraft] = useState(profile); const change = (key: keyof TenantProfile, value: string) => setDraft({ ...draft, [key]: value }); return <form className="developer-form" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><div className="developer-form-grid">{(["name", "brandName", "address", "contactName", "email", "phone", "gstin", "timezone", "currency", "invoicePrefix"] as const).map((key) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<input value={draft[key]} onChange={(event) => change(key, event.target.value)}/></label>)}</div><button className="primary-action">Save company profile</button></form>; }
~~~

## CMP-developer-console-Billing

src/developer-console.tsx:23-23

~~~tsx
function Billing({ state, tenantId, commit }: { state: DeveloperControlPlaneState; tenantId: string; commit: (action: (current: DeveloperControlPlaneState) => DeveloperControlPlaneState) => void }) { const [description, setDescription] = useState(""); const [amount, setAmount] = useState(""); const [dueDate, setDueDate] = useState(""); const [payment, setPayment] = useState<Record<string, string>>({}); const charges = state.charges.filter((charge) => charge.tenantId === tenantId); return <section className="developer-grid billing-grid"><form className="desk-panel developer-form" onSubmit={(event) => { event.preventDefault(); commit((current) => createPlatformCharge(current, { tenantId, description, amount: Number(amount), dueDate })); setDescription(""); setAmount(""); setDueDate(""); }}><h2>Quick platform charge</h2><label>Description<input value={description} onChange={(event) => setDescription(event.target.value)}/></label><label>Amount<input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)}/></label><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)}/></label><button className="primary-action">Create charge</button></form><div className="desk-panel"><h2>Charges</h2>{charges.length ? charges.map((charge) => { const paid = charge.payments.reduce((sum, item) => sum + item.amount, 0); return <article className="charge-row" key={charge.id}><strong>{charge.description}</strong><span>₹{charge.amount} · {chargeStatus(charge)} · due {charge.dueDate}</span><small>Paid ₹{paid}; {charge.payments.length} payment(s)</small><div><input aria-label={`Payment for ${charge.description}`} type="number" min="1" placeholder="Payment amount" value={payment[charge.id] ?? ""} onChange={(event) => setPayment({ ...payment, [charge.id]: event.target.value })}/><button onClick={() => { const value = Number(payment[charge.id]); if (value > 0) { commit((current) => recordPlatformPayment(current, charge.id, value)); setPayment({ ...payment, [charge.id]: "" }); } }}>Record payment</button></div></article>; }) : <p>No charges for this tenant.</p>}</div></section>; }
~~~

## CMP-document-download-DocumentDownloadButton

src/document-download.tsx:9-27

~~~tsx
export function DocumentDownloadButton({ kind, view, className = "workflow-action action-document document-download", label, snapshotId, showPrint = true }: { kind: DocumentKind; view: JobView; className?: string; label?: string; snapshotId?: string; showPrint?: boolean }) {
  const [status, setStatus] = useState<"idle" | "preparing" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const resolve = (): RenderedDocument => {
    const snapshots = loadDocumentSnapshots();
    const snap = snapshotId ? snapshots.find((item) => item.id === snapshotId) : undefined;
    return snap ? renderSnapshotDocument(snap) : renderJobDocument(kind, view, loadAdminDemoState(), snapshots);
  };
  const print = () => {
    try { const result = printRenderedDocument(resolve()); if (!result.ok) throw new Error(result.error); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "The document could not be printed."); setStatus("error"); }
  };
  const download = async () => {
    setStatus("preparing"); setErrorMessage("");
    try { const doc = resolve(); await renderHtmlToPdf(doc.html, doc.filename); setStatus("done"); window.setTimeout(() => setStatus("idle"), 2500); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Document generation failed."); setStatus("error"); }
  };
  return <><button type="button" className={className} disabled={status === "preparing"} aria-busy={status === "preparing"} onClick={(event) => { event.stopPropagation(); void download(); }}><Download size={15} />{status === "preparing" ? "Preparing…" : status === "done" ? "Downloaded ✓" : label ?? "Download PDF"}</button>{showPrint && <button type="button" className="workflow-action action-secondary document-print" onClick={(event) => { event.stopPropagation(); print(); }}><Printer size={15} />Print</button>}{status === "error" && <span className="document-error" role="alert">{errorMessage}</span>}</>;
}
~~~

## CMP-job-picker-JobPicker

src/job-picker.tsx:14-23

~~~tsx
export function JobPicker({ jobs, selectedJobId, onSelect, label = "Select job", period: controlledPeriod, onPeriodChange, onClear, showJobResults = true }: { jobs: JobView[]; selectedJobId?: number; onSelect: (id?: number) => void; label?: string; period?: JobPeriod; onPeriodChange?: (period: JobPeriod) => void; onClear?: () => void; showJobResults?: boolean }) {
  const [localPeriod, setLocalPeriod] = useState<JobPeriod>({ monthYear: "ALL" }); const [query, setQuery] = useState(""); const period = controlledPeriod ?? localPeriod;
  const setPeriod = (next: JobPeriod) => { if (!selectedJobRemainsInPeriod(jobs, selectedJobId, next)) onSelect(undefined); if (controlledPeriod) onPeriodChange?.(next); else setLocalPeriod(next); };
  const reset = () => { const next = { monthYear: "ALL" }; setQuery(""); onSelect(undefined); if (controlledPeriod) onPeriodChange?.(next); else setLocalPeriod(next); onClear?.(); };
  const periodJobs = useMemo(() => jobsForPeriod(jobs, period), [jobs, period]); const needle = normalizeSearch(query);
  const options = periodJobs.filter((view) => !needle || normalizeSearch(`${view.job.job_no} ${view.vehicle.number} ${view.customer.name} ${view.customer.mobile}`).includes(needle)).sort((left, right) => right.visit.received_at.localeCompare(left.visit.received_at) || right.job.id - left.job.id);
  const availableMonths = useMemo(() => Array.from(new Set(jobs.map((view) => view.visit.received_at.slice(0, 7)).filter(Boolean))).sort((left, right) => right.localeCompare(left)), [jobs]);
  useEffect(() => { if (!selectedJobRemainsInPeriod(jobs, selectedJobId, period)) onSelect(undefined); }, [jobs, period, selectedJobId, onSelect]);
  return <div className="job-selector">{showJobResults && <label className="list-search">Search<input type="search" aria-label={`${label} search`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job, vehicle, customer or mobile" /></label>}<label>Month-Year<select aria-label={`${label} Month-Year filter`} value={period.monthYear} onChange={(event) => setPeriod({ monthYear: event.target.value })}><option value="ALL">All months</option>{availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}</select></label>{showJobResults && <label>Matching jobs<select aria-label="Job results" value={selectedJobId ?? ""} onChange={(event) => onSelect(event.target.value ? Number(event.target.value) : undefined)}><option value="">Choose a job</option>{options.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}</option>)}</select></label>}<FilterClearButton onClick={reset} label="Clear filters" />{showJobResults && query && options.length === 0 && <p className="job-picker-empty" role="status">No matching jobs</p>}</div>;
}
~~~

## CMP-job-sheet-ui-Row

src/job-sheet-ui.tsx:7-9

~~~tsx
function Row({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><strong>{value || "—"}</strong></div>;
}
~~~

## CMP-job-sheet-ui-EstimatedDeliveryRow

src/job-sheet-ui.tsx:11-32

~~~tsx
function EstimatedDeliveryRow({ view, actor, mutate }: { view: JobView; actor: User; mutate: Mutate }) {
  const [date, setDate] = useState(view.job.estimated_delivery ?? "");
  const [error, setError] = useState("");
  const canEdit = !view.job.archived_at && !isTerminalMainStatus(view.job.main_status) && canMutateJobLifecycle(actor, view.job);
  if (!canEdit) return <Row label="Estimated Delivery Date" value={view.job.estimated_delivery ?? ""} />;
  return (
    <div className="job-sheet-delivery-row">
      <form className="info-row" onSubmit={(event) => {
        event.preventDefault();
        setError("");
        mutate((db) => updateEstimatedDeliveryForActor(db, view.job.id, actor.id, date), setError);
      }}>
        <label htmlFor={`job-delivery-date-${view.job.id}`}>Estimated Delivery Date</label>
        <div className="job-sheet-delivery-actions">
          <input id={`job-delivery-date-${view.job.id}`} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <button type="submit" className="primary-action">Save</button>
        </div>
      </form>
      {error && <p role="alert" className="form-error">{error}</p>}
    </div>
  );
}
~~~

## CMP-job-sheet-ui-DamageDiagram

src/job-sheet-ui.tsx:34-55

~~~tsx
export function DamageDiagram({ marks, onAdd, onRemove }: { marks: ReturnType<typeof parseDamageMarks>; onAdd?: (x: number, y: number) => void; onRemove?: (id: number) => void }) {
  return (
    <div className="damage-diagram" data-testid="damage-diagram">
      <svg viewBox="0 0 100 200" role="img" aria-label="Vehicle damage diagram, top view" onClick={onAdd ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onAdd(((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100);
      } : undefined}>
        <rect x="18" y="8" width="64" height="184" rx="26" className="damage-body" />
        <rect x="26" y="40" width="48" height="34" rx="6" className="damage-glass" />
        <rect x="26" y="128" width="48" height="26" rx="6" className="damage-glass" />
        <line x1="18" y1="100" x2="82" y2="100" className="damage-body-line" />
        {marks.filter((mark) => !mark.view).map((mark) => (
          <g key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x} ${mark.y * 2})`} onClick={(event) => { event.stopPropagation(); onRemove?.(mark.id); }}>
            <circle r="5" />
            <text textAnchor="middle" dy="2.5">{mark.id}</text>
          </g>
        ))}
      </svg>
      <p className="damage-hint">{onAdd ? "Tap the diagram to mark damage; tap a mark to remove it." : `${marks.length} damage mark${marks.length === 1 ? "" : "s"} recorded.`}</p>
    </div>
  );
}
~~~

## CMP-job-sheet-ui-JobSheetSection

src/job-sheet-ui.tsx:57-103

~~~tsx
export function JobSheetSection({ view, actor, mutate, editable = false }: { view: JobView; actor: User; mutate: Mutate; editable?: boolean }) {
  const [draft, setDraft] = useState({
    service_type: view.job.service_type ?? "",
    pickup_drop: view.job.pickup_drop ?? "",
    estimated_delivery: view.job.estimated_delivery ?? "",
    fuel: view.visit.fuel ?? "",
    accessories: view.visit.accessories ?? "",
    engine_no: view.vehicle.engine_no ?? "",
    address: view.customer.address ?? "",
  });
  const [error, setError] = useState("");
  if (!editable) {
    return (
      <section className="editor-block job-sheet" aria-label="Job sheet">
        <h4>Job sheet</h4>
        <div className="snapshot">
          <Row label="Service type" value={view.job.service_type ?? ""} />
          <Row label="Pickup / Drop" value={view.job.pickup_drop ?? ""} />
          <EstimatedDeliveryRow key={`${view.job.id}-${view.job.estimated_delivery ?? ""}`} view={view} actor={actor} mutate={mutate} />
          <Row label="Fuel" value={view.visit.fuel} />
          <Row label="Accessories" value={view.visit.accessories} />
          <Row label="Engine number" value={view.vehicle.engine_no ?? ""} />
          <Row label="Address" value={view.customer.address ?? ""} />
        </div>
      </section>
    );
  }
  const set = (key: keyof typeof draft) => (event: { target: { value: string } }) => setDraft({ ...draft, [key]: event.target.value });
  return (
    <section className="editor-block job-sheet" aria-label="Job sheet">
      <h4>Job sheet</h4>
      <form onSubmit={(event) => { event.preventDefault(); setError(""); mutate((db) => updateJobSheetForActor(db, view.job.id, actor.id, draft), setError); }}>
        <div className="form-grid">
          <label>Service Type<select value={draft.service_type} onChange={set("service_type")}><option value="">—</option>{SERVICE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Pickup / Drop<select value={draft.pickup_drop} onChange={set("pickup_drop")}><option value="">—</option>{PICKUP_DROP_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Estimated Delivery Date<input type="date" value={draft.estimated_delivery} onChange={set("estimated_delivery")} /></label>
          <label>Fuel<select value={draft.fuel} onChange={set("fuel")}>{[...new Set([draft.fuel, ...FUEL_LEVELS])].filter(Boolean).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Accessories<input value={draft.accessories} onChange={set("accessories")} /></label>
          <label>Engine Number<input value={draft.engine_no} onChange={set("engine_no")} /></label>
        </div>
        <label>Address<input value={draft.address} onChange={set("address")} /></label>
        <button className="primary-action">Save Job Sheet</button>
        {error && <p role="alert" className="form-error">{error}</p>}
      </form>
    </section>
  );
}
~~~

## CMP-local-sales-LocalSalesWorkspace

src/local-sales.tsx:21-32

~~~tsx
export function LocalSalesWorkspace({ mode, state, mutate }: { mode: "leads" | "quotations"; state: WorkshopState; mutate: Mutate }) {
  const [query, setQuery] = useState(""); const [leadQuery, setLeadQuery] = useState(""); const [leadStage, setLeadStage] = useState<Lead["stage"] | "">(""); const [leadCreatedMonth, setLeadCreatedMonth] = useState(currentMonthYear); const [createdDate, setCreatedDate] = useState(""); const [createdMonth, setCreatedMonth] = useState(currentMonthYear); const [error, setError] = useState(""); const [leadDialog, setLeadDialog] = useState<"add" | "edit" | null>(null); const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null); const [editor, setEditor] = useState<Quotation | "new" | null>(null); const [details, setDetails] = useState<Quotation | null>(null);
  const templates = useMemo(() => loadAdminDemoState().reportTemplates.filter((template) => template.category === "quotation"), []);
  const leads = state.sales_leads.map(remoteLead); const tasks: ServiceTask[] = state.service_catalog.filter((item) => !item.archived_at).map((item) => ({ id: item.id, name: item.name, description: item.name, rate: item.base_rate, gstRate: item.gst_rate })); const quotations = state.sales_quotations.map(remoteQuotation);
  const filteredLeads = filterSalesLeads(leads, leadQuery, leadStage, leadCreatedMonth); const filteredQuotations = quotations.filter((item) => `${item.quotationNo} ${leads.find((lead) => lead.id === item.leadId)?.displayName ?? ""}`.toLowerCase().includes(query.toLowerCase()) && (!createdDate || item.createdAt.slice(0, 10) === createdDate) && (!createdDate && createdMonth ? item.createdAt.startsWith(createdMonth) : true));
  const closeLeadDialog = () => { setLeadDialog(null); setSelectedLead(null); }; const saveLead = (draft: LeadFormDraft) => { const ok = leadDialog === "edit" && selectedLead ? mutate((db) => updateSalesLead(db, selectedLead.id, localLeadInput(draft)), setError) : mutate((db) => createSalesLead(db, localLeadInput(draft)), setError); if (ok) closeLeadDialog(); };
  const saveInlineLead = async (lead: Lead, draft: LeadFormDraft) => mutate((db) => updateSalesLead(db, lead.id, localLeadInput(draft)), setError);
  if (mode === "leads") return <section className="workspace single-panel"><div className="desk-panel"><div className="panel-actions"><div><h2>Sales Leads</h2><p>Local CRM inquiries, follow-ups, and site visits.</p></div><div className="grid-actions"><DownloadMenu report={salesLeadsReport(filteredLeads, leadCreatedMonth, leadQuery, leadStage)} /><button className="primary-action" onClick={() => { setSelectedLead(null); setLeadDialog("add"); }}>Add Lead</button></div></div>{error && <p className="api-error" role="alert">{error}</p>}<SalesLeadFilterBar query={leadQuery} stage={leadStage} createdMonth={leadCreatedMonth} onQueryChange={setLeadQuery} onStageChange={setLeadStage} onCreatedMonthChange={setLeadCreatedMonth} onClear={() => { setLeadQuery(""); setLeadStage(""); setLeadCreatedMonth(""); }} />{leadDialog && <SalesLeadDialog lead={selectedLead ? leadDraft(remoteLead(selectedLead)) : blankLeadDraft} editing={leadDialog === "edit"} onSave={saveLead} onClose={closeLeadDialog} />}<SalesLeadRegister leads={filteredLeads} onEdit={(lead) => { const localLead = state.sales_leads.find((item) => item.id === lead.id); if (localLead) { setSelectedLead(localLead); setLeadDialog("edit"); } }} onSave={saveInlineLead} /></div></section>;
  const saveQuotation = (input: QuotationInput) => { const target = editor; const ok = mutate((db) => target && target !== "new" ? updateSalesQuotation(db, target.id, localInput(input)) : createSalesQuotation(db, localInput(input)), setError); if (ok) setEditor(null); };
  const quotationStatus = ""; const setQuotationStatus = (_status: string) => undefined;
  return <section className="workspace single-panel"><div className="desk-panel"><div className="panel-actions"><div><h2>Quotations</h2><p>Local, frozen quotation documents and lifecycle.</p></div><button className="primary-action" onClick={() => setEditor("new")}>New Quotation</button></div>{error && <p className="api-error" role="alert">{error}</p>}{editor && <QuotationEditorDialog leads={leads} templates={templates} tasks={tasks} quotation={editor === "new" ? undefined : editor} busy={false} onClose={() => setEditor(null)} onSave={saveQuotation} />}{details && <QuotationDetailsDialog quotation={details} lead={leads.find((lead) => lead.id === details.leadId)} templateName={templates.find((template) => template.id === details.templateId)?.name ?? details.templateId} loadDocument={() => Promise.resolve(localDocument(details, leads.find((lead) => lead.id === details.leadId)))} onClose={() => setDetails(null)} />}<QuotationFilterBar query={query} status={quotationStatus} createdDate={createdDate} createdMonth={createdMonth} onQueryChange={setQuery} onStatusChange={setQuotationStatus} onCreatedDateChange={setCreatedDate} onCreatedMonthChange={setCreatedMonth} onClear={() => { setQuery(""); setQuotationStatus(""); setCreatedDate(""); setCreatedMonth(""); }} /><div className="table-wrap sales-crm-table"><table aria-label="Quotation register"><thead><tr><th>Number</th><th>Lead</th><th>Status</th><th>Amount</th><th>Created</th><th>Valid until</th><th>Actions</th></tr></thead><tbody>{filteredQuotations.map((item) => { const lead = leads.find((candidate) => candidate.id === item.leadId); return <tr key={item.id}><td>{item.quotationNo}</td><td>{lead?.displayName ?? item.leadId}</td><td>{item.status}</td><td>₹{item.total.toFixed(2)}</td><td>{item.createdAt.slice(0, 10)}</td><td>{item.validUntil || "—"}</td><td><div className="grid-actions billing-table-actions"><button type="button" className="billing-table-action" onClick={() => setDetails(item)}><Eye size={15} />View details</button>{item.status === "DRAFT" && <button type="button" className="billing-table-action" onClick={() => setEditor(item)}><Pencil size={15} />Edit</button>}<QuotationOutputControls className="quotation-document-actions" buttonClassName="billing-table-action" loadDocument={() => Promise.resolve(localDocument(item, lead))} onError={setError} /><button type="button" className="billing-table-action billing-table-action-primary" disabled={["ACCEPTED", "REJECTED", "EXPIRED"].includes(item.status)} onClick={() => mutate((db) => setSalesQuotationStatus(db, item.id, "SENT"), setError)}><Send size={15} />Mark sent</button><button type="button" className="billing-table-action" disabled={item.status !== "SENT"} onClick={() => mutate((db) => setSalesQuotationStatus(db, item.id, "ACCEPTED"), setError)}><Check size={15} />Accept</button></div></td></tr>; })}</tbody></table></div>{!filteredQuotations.length && <p className="empty-state">No quotations match these filters.</p>}</div></section>;
}
~~~

## CMP-materials-ui-InventoryPicker

src/materials-ui.tsx:9-23

~~~tsx
export function InventoryPicker({ inventory, value, onChange, label, disabled = false, allOptionLabel, onSelectAll }: { inventory: InventoryItem[]; value?: number; onChange: (id: number) => void; label: string; disabled?: boolean; allOptionLabel?: string; onSelectAll?: () => void }) {
  const selected = inventory.find((item) => item.id === value);
  const [query, setQuery] = useState(selected?.name ?? ""); const [open, setOpen] = useState(false); const [activeIndex, setActiveIndex] = useState(0); const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  usePickerDismissal(rootRef, open, () => setOpen(false));
  const allSelected = Boolean(allOptionLabel && value === undefined);
  const matches = filterInventory(inventory, (selected && query === selected.name) || (allSelected && query === allOptionLabel) ? "" : query).slice(0, 8);
  const options: Array<InventoryItem | undefined> = allOptionLabel ? [undefined, ...matches] : matches;
  useEffect(() => { setQuery(allSelected ? allOptionLabel! : selected?.name ?? ""); }, [allOptionLabel, allSelected, selected?.id]);
  const choose = (item: InventoryItem) => { onChange(item.id); setQuery(item.name); setOpen(false); };
  const chooseOption = (option: InventoryItem | undefined) => { if (option) choose(option); else if (onSelectAll) { onSelectAll(); setQuery(allOptionLabel ?? ""); setOpen(false); } };
  return <div className="inventory-picker" ref={rootRef}><input aria-label={label} role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && options[activeIndex] ? `${listId}-${options[activeIndex]!.id}` : open && allOptionLabel ? `${listId}-all` : undefined} aria-autocomplete="list" disabled={disabled} value={query} placeholder="Type to search inventory" onFocus={() => { setOpen(true); setActiveIndex(0); }} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.min(index + 1, Math.max(options.length - 1, 0))); } else if (event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.max(index - 1, 0)); } else if (event.key === "Enter" && open && options[activeIndex] !== undefined) { event.preventDefault(); chooseOption(options[activeIndex]); } else if (event.key === "Enter" && open && allOptionLabel && activeIndex === 0) { event.preventDefault(); chooseOption(undefined); } else if (event.key === "Escape") setOpen(false); }} />
    {open && <ul id={listId} role="listbox" aria-label={`${label} options`} className="inventory-picker-options">{options.map((option, index) => <li id={option ? `${listId}-${option.id}` : `${listId}-all`} key={option?.id ?? "all"} role="option" aria-selected={index === activeIndex}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseOption(option)}>{option ? pickerLabel(option) : allOptionLabel}</button></li>)}{matches.length === 0 && !allOptionLabel && <li className="empty-state">No matching inventory</li>}</ul>}
    {selected && <small className="picker-stock">in stock: {selected.stock_qty} {selected.unit}</small>}</div>;
}
~~~

## CMP-materials-ui-MaterialRow

src/materials-ui.tsx:25-30

~~~tsx
function MaterialRow({ row, job, inventory, actor, mutate }: { row: MaterialRequest; job: JobView["job"] & { materialApprovalStatus?: "Pending" | "Approved" | "Rejected" }; inventory: InventoryItem[]; actor: User; mutate: Mutate }) {
  const item = inventory.find((candidate) => candidate.id === row.item_id); const actions = canManageMaterialRows(actor, job) ? materialRowActionsFor(actor, job, row) : [];
  const [editing, setEditing] = useState(false); const [itemId, setItemId] = useState(row.item_id); const [qty, setQty] = useState(row.requested_qty); const [note, setNote] = useState(""); const [error, setError] = useState("");
  const run = (action: (db: Database) => unknown) => mutate((db) => action(db), setError); const status = materialRowStatus(row); const issued = actions.includes("edit-issued"); const draft = actions.includes("edit"); const warning = overStockWarning(editing ? qty : row.requested_qty, (editing ? inventory.find((candidate) => candidate.id === itemId) : item)?.stock_qty ?? 0);
  return <tr><td>{editing ? <InventoryPicker inventory={inventory} value={itemId} onChange={setItemId} label="Item" /> : item?.name ?? `Item ${row.item_id}`}</td><td>{editing ? <input aria-label="Qty" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))} /> : `${row.requested_qty} ${item?.unit ?? ""}`}</td><td><span className={`status-badge material-status material-status-${status.toLowerCase()}`}>{status}</span>{warning && <p className="permission-note" role="status">{warning}</p>}{error && <p className="error-text" role="alert">{error}</p>}</td><td><div className="grid-actions material-table-actions">{editing ? <>{issued && <input aria-label="Edit request note" placeholder="Note required" value={note} onChange={(event) => setNote(event.target.value)} />}<button type="button" className="grid-action" onClick={() => { const ok = run((db) => issued ? editIssuedMaterialRowForActor(db, row.id, actor.id, itemId, qty, note) : draft ? updateMaterialRowForActor(db, row.id, actor.id, itemId, qty) : reRequestMaterialRowForActor(db, row.id, actor.id, itemId, qty)); if (ok) setEditing(false); }}>Save</button><button type="button" className="grid-action" onClick={() => setEditing(false)}>Cancel</button></> : <>{actions.includes("request") && <button type="button" className="grid-action" onClick={() => run((db) => requestMaterialRowForActor(db, row.id, actor.id))}>Request Item</button>}{(actions.includes("edit") || actions.includes("re-request") || issued) && <button type="button" className="grid-action" onClick={() => setEditing(true)}>Edit Request</button>}{actions.includes("cancel") && <button type="button" className="grid-action grid-action-danger" onClick={() => run((db) => cancelMaterialRowForActor(db, row.id, actor.id))}>Cancel Request</button>}{actions.includes("delete") && <button type="button" className="grid-action grid-action-danger" onClick={() => run((db) => deleteMaterialRowForActor(db, row.id, actor.id))}>Delete</button>}</>}</div></td></tr>;
}
~~~

## CMP-materials-ui-PurchaseRequestTable

src/materials-ui.tsx:32-35

~~~tsx
function PurchaseRequestTable({ rows, inventory }: { rows: MaterialPurchaseRequest[]; inventory: InventoryItem[] }) {
  if (!rows.length) return null;
  return <section className="material-purchase-requests" aria-label="New item purchase requests"><h4>New item purchase requests</h4><div className="material-table-scroll"><table><thead><tr><th>Item</th><th>Qty</th><th>Status</th><th>Resolution</th></tr></thead><tbody>{rows.map((row) => { const item = inventory.find((candidate) => candidate.id === row.mapped_inventory_item_id); return <tr key={row.id}><td>{row.item_name}</td><td>{row.quantity} {row.unit}</td><td>{row.status}</td><td>{row.status === "Completed" ? `${item?.name ?? "Inventory item"} · issued row #${row.material_request_id}` : "Awaiting Store"}</td></tr>; })}</tbody></table></div></section>;
}
~~~

## CMP-materials-ui-JobMaterialsPanel

src/materials-ui.tsx:37-42

~~~tsx
export function JobMaterialsPanel({ view, inventory, actor, mutate }: { view: JobView; inventory: InventoryItem[]; actor: User; mutate: Mutate }) {
  const materialJob = { ...view.job, materialApprovalStatus: view.material_approval?.status }; const editable = canManageMaterialRows(actor, materialJob); const [itemId, setItemId] = useState<number>(); const [qty, setQty] = useState(1); const [newItem, setNewItem] = useState({ item_name: "", quantity: 1, unit: "piece" }); const [error, setError] = useState("");
  const add = () => { if (itemId === undefined) { setError("Choose an item."); return; } if (mutate((db) => addMaterialRowForActor(db, view.job.id, actor.id, itemId, qty), setError)) { setItemId(undefined); setQty(1); } };
  const requestNew = () => { if (mutate((db) => createMaterialPurchaseRequestForActor(db, view.job.id, actor.id, newItem), setError)) setNewItem({ item_name: "", quantity: 1, unit: "piece" }); };
  return <section className="editor-block job-card-materials" aria-label="Job materials"><h4>Materials</h4>{!editable ? <p className="permission-note">Materials are locked because this job is {view.job.main_status}. Only the Owner or linked Service Advisor may request items while it is IN_PROGRESS.</p> : <><div className="material-add"><label>Item<InventoryPicker inventory={inventory} value={itemId} onChange={setItemId} label="Item" /></label><label>Qty<input aria-label="Qty" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))} /></label><button type="button" className="primary-action" onClick={add}>Add Row</button></div><form className="material-new-item" onSubmit={(event) => { event.preventDefault(); requestNew(); }}><h5>Request New Item</h5><label>Item name<input required value={newItem.item_name} onChange={(event) => setNewItem({ ...newItem, item_name: event.target.value })} /></label><label>Quantity<input required type="number" min="0.01" step="0.01" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: Number(event.target.value) })} /></label><label>Unit<input required value={newItem.unit} onChange={(event) => setNewItem({ ...newItem, unit: event.target.value })} /></label><button className="secondary-action">Request New Item</button></form></>}{error && <p className="error-text" role="alert">{error}</p>}<div className="material-table-scroll"><table aria-label="Material rows"><thead><tr><th>Item</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead><tbody>{view.material_requests.length ? view.material_requests.map((row) => <MaterialRow key={`${row.id}-${row.status}-${row.requested_qty}-${row.item_id}`} row={row} job={materialJob} inventory={inventory} actor={actor} mutate={mutate} />) : <tr><td colSpan={4}>No inventory material rows yet.</td></tr>}</tbody></table></div><PurchaseRequestTable rows={view.material_purchase_requests} inventory={inventory} /></section>;
}
~~~

## CMP-pagination-toolbar-PaginationToolbar

src/pagination-toolbar.tsx:19-28

~~~tsx
export function PaginationToolbar({ from, to, totalCount, page, pageCount, onPageChange, pageSize, onPageSizeChange, pageSizeAriaLabel, controls }: PaginationToolbarProps) {
  return <div className="pagination-toolbar">
    {controls && <div className="pagination-toolbar-controls">{controls}</div>}
    <div className="result-summary" aria-live="polite">Showing {from} to {to} of {totalCount}</div>
    <div className="pagination-toolbar-navigation">
      <PageSizeSelect ariaLabel={pageSizeAriaLabel} value={pageSize} onChange={onPageSizeChange} />
      <ResultPagination page={page} pageCount={pageCount} onChange={onPageChange} />
    </div>
  </div>;
}
~~~

## CMP-pagination-toolbar-ResultPagination

src/pagination-toolbar.tsx:30-46

~~~tsx
export function ResultPagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  const atFirstPage = page <= 1;
  const atLastPage = page >= pageCount;

  return <nav className="result-pagination" aria-label="Results pagination">
    <button type="button" aria-label="First page" title="First page" disabled={atFirstPage} onClick={() => onChange(1)}><ChevronFirst aria-hidden="true" size={18} /></button>
    <button type="button" aria-label="Previous page" title="Previous page" disabled={atFirstPage} onClick={() => onChange(page - 1)}><ChevronLeft aria-hidden="true" size={18} /></button>
    <span className="mobile-page-label">Page {page} of {pageCount}</span>
    <div className="numbered-pages">
      {pageNumbers(page, pageCount).map((token, index) => token === "ellipsis"
        ? <span className="page-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>…</span>
        : <button type="button" key={token} aria-label={`Page ${token}`} aria-current={page === token ? "page" : undefined} className={page === token ? "active" : ""} onClick={() => onChange(token)}>{token}</button>)}
    </div>
    <button type="button" aria-label="Next page" title="Next page" disabled={atLastPage} onClick={() => onChange(page + 1)}><ChevronRight aria-hidden="true" size={18} /></button>
    <button type="button" aria-label="Last page" title="Last page" disabled={atLastPage} onClick={() => onChange(pageCount)}><ChevronLast aria-hidden="true" size={18} /></button>
  </nav>;
}
~~~

## CMP-quotation-dialog-QuotationTotals

src/quotation-dialog.tsx:16-19

~~~tsx
function QuotationTotals({ subtotal, discount, gst, total }: { subtotal: number; discount: number; gst: number; total: number }) {
  const items = [["Subtotal", subtotal], ["Discount", discount], ["GST", gst], ["Total", total]] as const;
  return <dl className="quotation-totals" aria-label="Quotation totals">{items.map(([label, amount]) => <div className={`quotation-total-item${label === "Total" ? " quotation-total-grand" : ""}`} key={label}><dt>{label}</dt><dd>{money(amount)}</dd></div>)}</dl>;
}
~~~

## CMP-quotation-dialog-CatalogDescriptionCombobox

src/quotation-dialog.tsx:21-29

~~~tsx
function CatalogDescriptionCombobox({ lineNumber, value, tasks, onChange, onSelect }: { lineNumber: number; value: string; tasks: ServiceTask[]; onChange: (description: string) => void; onSelect: (task: ServiceTask) => void }) {
  const [open, setOpen] = useState(false); const [activeIndex, setActiveIndex] = useState(0); const listId = useId();
  const needle = value.trim().toLowerCase(); const matches = tasks.filter((task) => !needle || `${task.name} ${task.description ?? ""}`.toLowerCase().includes(needle)).slice(0, 100);
  const choose = (task: ServiceTask) => { onSelect(task); setOpen(false); };
  const openOptions = () => { setOpen(true); setActiveIndex(0); };
  return <label className="search-select quotation-catalog-description"><span className="sr-only">Catalog description for line {lineNumber}</span><input required role="combobox" aria-label={`Catalog description for line ${lineNumber}`} aria-expanded={open} aria-controls={listId} aria-activedescendant={open && matches[activeIndex] ? `${listId}-${matches[activeIndex].id}` : undefined} aria-autocomplete="list" placeholder="Type a description or search catalog" value={value} onFocus={openOptions} onClick={() => !open && openOptions()} onChange={(event) => { onChange(event.target.value); openOptions(); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActiveIndex((index) => event.key === "ArrowDown" ? Math.min(index + 1, Math.max(matches.length - 1, 0)) : Math.max(index - 1, 0)); } else if (event.key === "Enter" && open && matches[activeIndex]) { event.preventDefault(); choose(matches[activeIndex]); } else if (event.key === "Escape") { event.preventDefault(); setOpen(false); } }} />
    {open && <ul id={listId} role="listbox" aria-label={`Catalog suggestions for line ${lineNumber}`} className="search-select-options">{matches.length ? matches.map((task, index) => <li id={`${listId}-${task.id}`} key={task.id} role="option" aria-selected={index === activeIndex}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(task)}>{task.name} · {money(task.rate)} · GST {task.gstRate}%</button></li>) : <li className="picker-stock" role="status">No catalog matches — your description will be saved as entered.</li>}</ul>}
  </label>;
}
~~~

## CMP-quotation-dialog-QuotationEditorDialog

src/quotation-dialog.tsx:31-47

~~~tsx
export function QuotationEditorDialog({ config, leads, templates, quotation, tasks: suppliedTasks, busy, onClose, onSave }: { config?: CognitoConfig; leads: Lead[]; templates: Template[]; quotation?: Quotation; tasks?: ServiceTask[]; busy: boolean; onClose: () => void; onSave: (input: QuotationInput) => void }) {
  const defaultTemplate = templates.find((template) => template.active)?.id ?? templates[0]?.id ?? "";
  const [leadId, setLeadId] = useState(quotation?.leadId ?? 0); const [validUntil, setValidUntil] = useState(quotation?.validUntil ?? ""); const [notes, setNotes] = useState(quotation?.customerNotes ?? ""); const [discount, setDiscount] = useState(String(quotation?.discount ?? 0)); const [templateId, setTemplateId] = useState(quotation?.templateId ?? defaultTemplate);
  const [lines, setLines] = useState<QuotationLine[]>(quotation?.lines.length ? quotation.lines : [emptyLine()]); const [tasks, setTasks] = useState<ServiceTask[]>(suppliedTasks ?? []); const [catalogError, setCatalogError] = useState("");
  useEffect(() => { if (suppliedTasks) setTasks(suppliedTasks); else if (config) void salesApi.serviceTasks(config).then(setTasks).catch((error: unknown) => setCatalogError(error instanceof Error ? error.message : "SERVICE_TASKS_FAILED")); }, [config, suppliedTasks]);
  const amount = useMemo(() => totals(lines, Number(discount) || 0), [lines, discount]);
  const changeLine = (index: number, patch: Partial<QuotationLine>) => setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line));
  const selectTask = (index: number, task: ServiceTask) => changeLine(index, { kind: "Service", description: task.description || task.name, rate: task.rate, gstRate: task.gstRate });
  const selectTemplate = (id: string) => setTemplateId(id);
  const submit = (event: FormEvent) => { event.preventDefault(); const cleanLines = lines.filter((line) => line.description.trim()); const templateHtml = templates.find((template) => template.id === templateId)?.html ?? ""; if (!leadId || !templateId || !templateHtml.trim() || !cleanLines.length) return; onSave({ leadId, validUntil: validUntil || undefined, customerNotes: notes, discount: Number(discount) || 0, templateId, templateHtml, lines: cleanLines }); };
  return <Dialog wide title={quotation ? "Edit quotation" : "New quotation"} subtitle={quotation ? `${quotation.quotationNo} · Draft` : "Create a frozen quotation document"} onClose={onClose} className="dialog-document-editor quotation-dialog" footer={<button className="primary-action" type="submit" form="quotation-editor-form" disabled={busy}>{quotation ? "Save quotation" : "Create quotation"}</button>}><form id="quotation-editor-form" className="billing-dialog-form quotation-editor-form" onSubmit={submit}>
    <div className="form-grid"><label>Lead<select data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}><option value={0}>Select lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}</select></label><label>Valid until<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} /></label><label>Template<select required value={templateId} onChange={(event) => selectTemplate(event.target.value)}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}</select></label><label>Discount<input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label></div>
    <label className="quotation-notes">Customer notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
    <div className="estimate-items"><div className="line-items-header"><strong>Line items</strong><button type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus size={16} />Add Item</button></div>{catalogError && <p className="error-text" role="alert">Service catalog unavailable: {catalogError}</p>}<div className="estimate-item estimate-item-heading quotation-item-heading"><span>Catalog description</span><span>Quantity</span><span>Rate</span><span>GST rate</span><span>Action</span></div>{lines.map((line, index) => <div className="estimate-item quotation-item" key={line.id ?? index}><CatalogDescriptionCombobox lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)} /><input aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })} /><input aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })} /><input aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })} /><button type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}>Remove</button></div>)}</div>
    <QuotationTotals subtotal={amount.subtotal} discount={Number(discount) || 0} gst={amount.gst} total={amount.total} />
  </form></Dialog>;
}
~~~

## CMP-quotation-dialog-QuotationOutputControls

src/quotation-dialog.tsx:51-51

~~~tsx
export function QuotationOutputControls({ loadDocument, onError, className, buttonClassName }: { loadDocument: () => Promise<QuotationDocument>; onError?: (message: string) => void; className?: string; buttonClassName?: string }) { const [busy, setBusy] = useState<"" | "download" | "print">(""); const run = async (action: "download" | "print") => { setBusy(action); onError?.(""); try { const document = await loadDocument(); const html = quotationDocumentHtml(document); if (action === "download") await renderHtmlToPdf(html, `${document.quotationNo}.pdf`); else { const result = printRenderedDocument({ html, title: `Quotation ${document.quotationNo}` }); if (!result.ok) throw new Error(result.error); } } catch (error) { onError?.(error instanceof Error ? error.message : "QUOTATION_OUTPUT_FAILED"); } finally { setBusy(""); } }; return <span className={className}><button type="button" className={buttonClassName} disabled={Boolean(busy)} aria-busy={Boolean(busy)} onClick={() => void run("download")}><Download size={15} />{busy === "download" ? "Generating PDF…" : "Download PDF"}</button><button type="button" className={buttonClassName} disabled={Boolean(busy)} aria-busy={Boolean(busy)} onClick={() => void run("print")}><Printer size={15} />{busy === "print" ? "Preparing print…" : "Print"}</button></span>; }
~~~

## CMP-quotation-dialog-QuotationDownloadButton

src/quotation-dialog.tsx:52-52

~~~tsx
export function QuotationDownloadButton({ config, quotationId, className, buttonClassName, onError }: { config: CognitoConfig; quotationId: number; className?: string; buttonClassName?: string; onError?: (message: string) => void }) { return <QuotationOutputControls className={className} buttonClassName={buttonClassName} loadDocument={() => salesApi.document(config, quotationId)} onError={onError} />; }
~~~

## CMP-quotation-dialog-QuotationDetailsDialog

src/quotation-dialog.tsx:53-53

~~~tsx
export function QuotationDetailsDialog({ config, quotation, lead, templateName, loadDocument, onClose }: { config?: CognitoConfig; quotation: Quotation; lead?: Lead; templateName: string; loadDocument?: () => Promise<QuotationDocument>; onClose: () => void }) { const [error, setError] = useState(""); const document = loadDocument ?? (() => config ? salesApi.document(config, quotation.id) : Promise.reject(new Error("QUOTATION_DOCUMENT_UNAVAILABLE"))); return <Dialog wide title={`Quotation ${quotation.quotationNo}`} subtitle="Read-only frozen quotation" onClose={onClose} className="dialog-document-editor quotation-dialog" footer={<QuotationOutputControls loadDocument={document} onError={setError} className="quotation-output-controls" buttonClassName="billing-table-action" />}><div className="quotation-details-content">{error && <p className="error-text" role="alert">{error}</p>}<div className="form-grid"><p><strong>Customer</strong><br />{lead?.displayName ?? quotation.leadId}<br />{lead?.phone}</p><p><strong>Status</strong><br />{quotation.status}</p><p><strong>Valid until</strong><br />{quotation.validUntil ?? "—"}</p><p><strong>Template</strong><br />{templateName}</p></div><div className="table-wrap"><table aria-label="Quotation details"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>GST</th><th>Amount</th></tr></thead><tbody>{quotation.lines.map((line, index) => <tr key={line.id ?? index}><td>{line.description}</td><td>{line.quantity}</td><td>{money(line.rate)}</td><td>{line.gstRate}%</td><td>{money(line.quantity * line.rate)}</td></tr>)}</tbody></table></div>{quotation.customerNotes && <section className="quotation-notes"><strong>Notes</strong><p>{quotation.customerNotes}</p></section>}<QuotationTotals subtotal={quotation.subtotal} discount={quotation.discount} gst={quotation.gstAmount} total={quotation.total} /></div></Dialog>; }
~~~

## CMP-quotation-filter-bar-QuotationFilterBar

src/quotation-filter-bar.tsx:3-5

~~~tsx
export function QuotationFilterBar({ query, createdDate, createdMonth, busy, onQueryChange, onCreatedDateChange, onCreatedMonthChange, onClear }: { query: string; createdDate: string; createdMonth: string; busy?: boolean; onQueryChange: (value: string) => void; onCreatedDateChange: (value: string) => void; onCreatedMonthChange: (value: string) => void; onClear: () => void; status?: string; onStatusChange?: (value: string) => void }) {
  return <div className="quotation-filter-row sales-crm-filter"><label className="list-search">Search quotations<input aria-label="Search quotations" value={query} disabled={busy} onChange={(event) => onQueryChange(event.target.value)} placeholder="Quotation number or lead" /></label><label>Created date<input aria-label="Quotation created date" type="date" value={createdDate} disabled={busy} onChange={(event) => onCreatedDateChange(event.target.value)} /></label><label>Created month/year<input aria-label="Quotation created month/year" type="month" value={createdMonth} disabled={busy} onChange={(event) => onCreatedMonthChange(event.target.value)} /></label><FilterClearButton onClick={onClear} disabled={busy} /></div>;
}
~~~

## CMP-remote-finance-RemoteFinanceWorkspace

src/remote-finance.tsx:12-81

~~~tsx
export function RemoteFinanceWorkspace({ config, mode }: { config: CognitoConfig; mode: Mode }) {
  const [jobs, setJobs] = useState<RemoteJob[]>([]); const [selectedId, setSelectedId] = useState<number>();
  const [invoices, setInvoices] = useState<RemoteInvoice[]>([]); const [payments, setPayments] = useState<RemotePayment[]>([]); const [delivery, setDelivery] = useState<RemoteHandover | null>();
  const [replacesInvoiceId, setReplacesInvoiceId] = useState<number>();
  const [payAmount, setPayAmount] = useState(""); const [method, setMethod] = useState<"cash" | "card" | "upi" | "bank_transfer" | "other">("upi"); const [reference, setReference] = useState("");
  const [deliveredBy, setDeliveredBy] = useState(""); const [finalOdometer, setFinalOdometer] = useState(""); const [acknowledgement, setAcknowledgement] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const selected = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);
  const active = invoices.find(isActiveRemoteInvoice);

  const refresh = async () => {
    const nextJobs = await jobsApi.list(config); setJobs(nextJobs);
    const job = nextJobs.find((item) => item.id === (selectedId && nextJobs.some((candidate) => candidate.id === selectedId) ? selectedId : nextJobs[0]?.id));
    setSelectedId(job?.id);
    if (!job) { setInvoices([]); setPayments([]); setDelivery(undefined); return; }
    const nextInvoices = await financeApi.invoices(config, job.id); setInvoices(nextInvoices);
    const current = nextInvoices.find(isActiveRemoteInvoice);
    setPayments(current ? await financeApi.payments(config, current.id) : []);
    setDelivery(await financeApi.delivery(config, job.id));
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")); }, [config]);
  useEffect(() => { if (selectedId) void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")); }, [selectedId]);
  const run = (action: () => Promise<unknown>, afterSuccess?: () => void) => { setBusy(true); setError(""); void action().then(() => { afterSuccess?.(); return refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "FINANCE_API_FAILED")).finally(() => setBusy(false)); };
  const issue = () => {
    if (!selected) return;
    run(() => financeApi.issueInvoice(config, selected.id, { ...(replacesInvoiceId ? { replacesInvoiceId } : {}) }, crypto.randomUUID()), () => setReplacesInvoiceId(undefined));
  };
  const voidInvoice = (invoice: RemoteInvoice) => {
    const reason = window.prompt(`Why should ${invoice.number} be voided?`, "") ?? "";
    if (reason.trim()) run(() => financeApi.voidInvoice(config, invoice.id, reason.trim(), crypto.randomUUID()));
  };
  const prepareReplacement = (invoice: RemoteInvoice) => {
    setReplacesInvoiceId(invoice.id);
  };
  const creditAndRefund = (invoice: RemoteInvoice) => {
    const amount = Number(window.prompt(`Credit/refund amount for ${invoice.number} (₹):`, ""));
    const reason = window.prompt("Credit note reason:", "") ?? "";
    if (!(amount > 0) || !reason.trim()) return;
    run(async () => {
      const note = await financeApi.issueCreditNote(config, invoice.id, { amountPaise: rupeesToPaise(String(amount)), reason: reason.trim() }, crypto.randomUUID());
      await financeApi.recordRefund(config, note.id, { amountPaise: rupeesToPaise(String(amount)), method: "upi" }, crypto.randomUUID());
    });
  };
  const download = async (path: string, number: string) => {
    try {
      const response = await authenticatedFetch(config, path);
      if (!response.ok) throw new Error("FINANCIAL_DOCUMENT_DOWNLOAD_FAILED");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = remoteDocumentFilename(number); link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "FINANCIAL_DOCUMENT_DOWNLOAD_FAILED"); }
  };
  const pay = () => {
    if (!active || !(Number(payAmount) > 0)) return;
    run(() => financeApi.recordPayment(config, active.id, { amountPaise: rupeesToPaise(payAmount), method, reference }, crypto.randomUUID()));
  };
  const handover = () => {
    if (!selected || !deliveredBy.trim() || !(Number(finalOdometer) >= 0) || !acknowledgement.trim()) return;
    run(() => financeApi.completeHandover(config, selected.id, { deliveredBy, finalOdometer: Number(finalOdometer), acknowledgement }, crypto.randomUUID()));
  };
  const title = mode === "invoice" ? "Invoices" : mode === "payment" ? "Payments" : "Delivery";
  return <section className="manager-panel" aria-label={`Online ${title.toLowerCase()}`}>
    <div className="panel-actions"><div><h3>{title}</h3><span>Live tenant financial records. Signed-out mode retains the SQLite demo workspace.</span></div></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    <label>Job<select value={selected?.id ?? 0} onChange={(event) => setSelectedId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.status}</option>)}</select></label>
    {mode === "invoice" && <><div className="form-grid"><p className="permission-note">Invoices are issued only from the current approved estimate. Lines, rates, tax, and discount cannot be edited here.</p><div className="action-row"><button className="primary-action" disabled={busy || Boolean(active) || (requiresInvoiceReplacement(invoices) && !replacesInvoiceId)} onClick={issue}>{replacesInvoiceId ? "Issue replacement invoice" : "Issue approved estimate"}</button>{replacesInvoiceId && <button disabled={busy} onClick={() => setReplacesInvoiceId(undefined)}>Cancel replacement</button>}</div></div>{replacesInvoiceId && <p className="permission-note">A replacement issues a new immutable number; it does not edit the corrected document.</p>}<InvoiceRows invoices={invoices} busy={busy} onDownload={download} onVoid={voidInvoice} onReplace={prepareReplacement} onCreditRefund={creditAndRefund} /></>}
    {mode === "payment" && <><InvoiceRows invoices={invoices} busy={busy} onDownload={download} />{active && <div className="form-grid"><label>Amount (₹)<input min="0.01" type="number" value={payAmount} onChange={(event) => setPayAmount(event.target.value)} /></label><label>Method<select value={method} onChange={(event) => setMethod(event.target.value as typeof method)}>{["upi", "cash", "card", "bank_transfer", "other"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Reference<input value={reference} onChange={(event) => setReference(event.target.value)} /></label><div className="action-row"><button className="primary-action" disabled={busy || active.status === "SETTLED"} onClick={pay}>Record payment</button></div></div>}<div className="table-wrap"><table><thead><tr><th>Receipt</th><th>Amount</th><th>Method</th><th>Reference</th><th>Document</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{payment.receiptNumber}</td><td>{money(payment.amountPaise)}</td><td>{payment.method}</td><td>{payment.reference || "—"}</td><td><button disabled={busy} onClick={() => void download(payment.contentPath, payment.receiptNumber)}>Download</button></td></tr>)}</tbody></table></div></>}
    {mode === "delivery" && <>{delivery ? <p><strong>{delivery.gatePassNumber}</strong> · Delivered by {delivery.deliveredBy} at {new Date(delivery.handoverAt).toLocaleString()}. <button disabled={busy} onClick={() => void download(delivery.contentPath, delivery.gatePassNumber)}>Download gate pass</button></p> : <><InvoiceRows invoices={invoices} busy={busy} onDownload={download} /><div className="form-grid"><label>Delivered by<input value={deliveredBy} onChange={(event) => setDeliveredBy(event.target.value)} /></label><label>Final odometer<input min="0" type="number" value={finalOdometer} onChange={(event) => setFinalOdometer(event.target.value)} /></label><label>Acknowledgement<input value={acknowledgement} onChange={(event) => setAcknowledgement(event.target.value)} /></label><div className="action-row"><button className="primary-action" disabled={busy || active?.status !== "SETTLED" || selected?.status !== "COMPLETED"} onClick={handover}>Issue gate pass & hand over</button></div></div></>}</>}
  </section>;
}
~~~

## CMP-remote-finance-InvoiceRows

src/remote-finance.tsx:83-86

~~~tsx
function InvoiceRows({ invoices, busy, onDownload, onVoid, onReplace, onCreditRefund }: { invoices: RemoteInvoice[]; busy: boolean; onDownload: (path: string, number: string) => Promise<void>; onVoid?: (invoice: RemoteInvoice) => void; onReplace?: (invoice: RemoteInvoice) => void; onCreditRefund?: (invoice: RemoteInvoice) => void }) {
  const activeExists = invoices.some(isActiveRemoteInvoice);
  return <div className="table-wrap"><table aria-label="Issued invoices"><thead><tr><th>Invoice</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Document</th>{(onVoid || onReplace || onCreditRefund) && <th>Correction</th>}</tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td>{invoice.number}</td><td>{money(invoice.totalPaise)}</td><td>{money(invoice.paidPaise)}</td><td>{money(invoice.balancePaise)}</td><td>{invoice.status}</td><td><button disabled={busy} onClick={() => void onDownload(invoice.contentPath, invoice.number)}>Download</button></td>{(onVoid || onReplace || onCreditRefund) && <td><div className="grid-actions">{onVoid && canVoidRemoteInvoice(invoice) && <button className="danger-action" disabled={busy} onClick={() => onVoid(invoice)}>Void with reason</button>}{onCreditRefund && (invoice.status === "PARTIAL" || invoice.status === "SETTLED") && <button className="danger-action" disabled={busy} onClick={() => onCreditRefund(invoice)}>Credit & refund</button>}{onReplace && canReplaceRemoteInvoice(invoice, activeExists) && <button disabled={busy} onClick={() => onReplace(invoice)}>Issue replacement</button>}</div></td>}</tr>)}</tbody></table></div>;
}
~~~

## CMP-remote-followups-RemoteFollowupsWorkspace

src/remote-followups.tsx:9-75

~~~tsx
export function RemoteFollowupsWorkspace({ config, mode }: { config: CognitoConfig; mode: Mode }) {
  const [followups, setFollowups] = useState<RemoteFollowup[]>([]);
  const [jobs, setJobs] = useState<FollowupJob[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [jobId, setJobId] = useState(0);
  const [note, setNote] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [editing, setEditing] = useState<RemoteFollowup>();
  const [outcome, setOutcome] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    const [nextFollowups, nextJobs] = await Promise.all([followupsApi.list(config), followupsApi.jobs(config)]);
    setFollowups(nextFollowups); setJobs(nextJobs);
    setJobId((current) => current || nextJobs[0]?.id || 0);
  };
  useEffect(() => { if (mode === "followups") void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "FOLLOWUPS_API_FAILED")); }, [config, mode]);

  const run = (action: () => Promise<unknown>, after?: () => void) => {
    setBusy(true); setError("");
    void action().then(async () => { after?.(); await refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "FOLLOWUPS_API_FAILED")).finally(() => setBusy(false));
  };
  const create = (event: FormEvent) => {
    event.preventDefault(); if (!jobId || !note.trim()) return;
    run(() => followupsApi.create(config, { jobId, note: note.trim(), ...(dueAt ? { dueAt } : {}) }), () => { setNote(""); setDueAt(""); });
  };
  const beginEdit = (item: RemoteFollowup) => { setEditing(item); setNote(item.note); setDueAt(dateInput(item.dueAt)); setOutcome(item.outcome); };
  const saveEdit = (event: FormEvent) => {
    event.preventDefault(); if (!editing || !note.trim()) return;
    run(() => followupsApi.update(config, editing.id, { note: note.trim(), ...(dueAt ? { dueAt } : {}), outcome: outcome.trim() }), () => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); });
  };
  const complete = (item: RemoteFollowup) => run(() => followupsApi.complete(config, item.id, window.prompt("Completion outcome:", item.outcome) ?? item.outcome));
  const archive = (item: RemoteFollowup) => {
    const reason = window.prompt(`Why archive follow-up #${item.id}?`, "");
    if (reason?.trim()) run(() => followupsApi.archive(config, item.id, reason.trim()));
  };
  const search = (event: FormEvent) => {
    event.preventDefault(); if (query.trim().length < 2) { setError("Enter at least 2 characters to search."); return; }
    setBusy(true); setError("");
    void followupsApi.search(config, query.trim()).then((payload) => setResults(payload.results)).catch((caught) => setError(caught instanceof Error ? caught.message : "SEARCH_API_FAILED")).finally(() => setBusy(false));
  };

  if (mode === "search") return <section className="workspace single-panel" aria-label="Online global search"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Search</h2><p>Live, tenant- and branch-scoped customers, vehicles, jobs, and invoices.</p></div></div>
    {error && <div className="api-error" role="alert">{error}</div>}
    <form className="store-filter-grid" onSubmit={search}><label className="list-search">Search all records<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, registration, job card, or invoice" /></label><button className="primary-action" disabled={busy}>Search</button></form>
    <div className="table-wrap"><table aria-label="Global search results"><thead><tr><th>Type</th><th>Record</th><th>Context</th></tr></thead><tbody>{results.map((item) => <tr key={`${item.entity}-${item.id}`}><td>{item.entity}</td><td>{item.title}</td><td>{item.subtitle || "—"}</td></tr>)}</tbody></table></div>
    {query && !busy && !results.length && <p className="empty-state">No authorized records match this search.</p>}
  </div></section>;

  const formTitle = editing ? `Edit Follow-up #${editing.id}` : "New Follow-up";
  return <section className="workspace single-panel" aria-label="Online follow-ups"><div className="desk-panel">
    <div className="panel-actions"><div><h2>Follow-ups</h2><p>Live tenant and permitted branch customer contact records.</p></div></div>
    {error && <div className="api-error" role="alert">{error}<button onClick={() => void refresh()}>Retry</button></div>}
    <form className="form-grid" onSubmit={editing ? saveEdit : create}><h3>{formTitle}</h3>
      {!editing && <label>Job<select required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.vehicleNo} · {job.customerName}</option>)}</select></label>}
      <label>Due date<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label>
      <label>Note<textarea required rows={2} value={note} onChange={(event) => setNote(event.target.value)} /></label>
      {editing && <label>Outcome<textarea rows={2} value={outcome} onChange={(event) => setOutcome(event.target.value)} /></label>}
      <div className="action-row"><button className="primary-action" disabled={busy}>{editing ? "Save Follow-up" : "Create Follow-up"}</button>{editing && <button type="button" disabled={busy} onClick={() => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); }}>Cancel</button>}</div>
    </form>
    <div className="table-wrap"><table aria-label="Remote follow-ups"><thead><tr><th>Due</th><th>Job</th><th>Customer / Vehicle</th><th>Note</th><th>Status</th><th>Action</th></tr></thead><tbody>{followups.map((item) => <tr key={item.id}><td>{dateInput(item.dueAt) || "—"}</td><td>{item.jobNo}</td><td>{item.customerName} · {item.vehicleNo}</td><td>{item.note}</td><td>{item.status}</td><td><div className="grid-actions"><button disabled={busy} onClick={() => beginEdit(item)}>Edit</button>{item.status === "OPEN" && <button disabled={busy} onClick={() => complete(item)}>Complete</button>}<button className="grid-action-danger" disabled={busy} onClick={() => archive(item)}>Archive</button></div></td></tr>)}</tbody></table></div>
    {!followups.length && <p className="empty-state">No active follow-ups.</p>}
  </div></section>;
}
~~~

## CMP-remote-sales-RemoteSalesWorkspace

src/remote-sales.tsx:18-30

~~~tsx
export function RemoteSalesWorkspace({ config, mode }: { config: CognitoConfig; mode: "leads" | "quotations" }) {
  const [leads, setLeads] = useState<Lead[]>([]); const [quotations, setQuotations] = useState<Quotation[]>([]); const [query, setQuery] = useState(""); const [stage, setStage] = useState<Lead["stage"] | "">(""); const [createdDate, setCreatedDate] = useState(""); const [createdMonth, setCreatedMonth] = useState(currentMonthYear); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [leadDialog, setLeadDialog] = useState<"add" | "edit" | null>(null); const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const templates = useMemo(() => loadAdminDemoState().reportTemplates.filter((item) => item.category === "quotation"), []);
  const quotationParams = new URLSearchParams(); if (query.trim()) quotationParams.set("q", query.trim()); if (createdDate) quotationParams.set("exactDate", createdDate); else if (createdMonth) quotationParams.set("month", createdMonth); const quotationFilters = quotationParams.size ? `?${quotationParams}` : "";
  const refresh = async () => { const leadFilter = mode === "leads" ? leadFilterQuery(query, stage, createdMonth) : ""; const [nextLeads, nextQuotations] = await Promise.all([salesApi.leads(config, leadFilter), salesApi.quotations(config, mode === "quotations" ? quotationFilters : "")]); setLeads(nextLeads); setQuotations(nextQuotations); };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "SALES_CRM_API_FAILED")); }, [config, mode, query, stage, createdDate, createdMonth]);
  const run = (action: () => Promise<unknown>, after?: () => void) => { setBusy(true); setError(""); void action().then(async () => { after?.(); await refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "SALES_CRM_API_FAILED")).finally(() => setBusy(false)); };
  const closeLeadDialog = () => { setLeadDialog(null); setSelectedLead(null); };
  const saveLead = (draft: LeadFormDraft) => { const input: LeadInput = draft; run(() => leadDialog === "edit" && selectedLead ? salesApi.updateLead(config, selectedLead.id, input) : salesApi.createLead(config, input), closeLeadDialog); };
  const saveInlineLead = async (lead: Lead, draft: LeadFormDraft) => { setBusy(true); setError(""); try { await salesApi.updateLead(config, lead.id, draft); await refresh(); return true; } catch (caught) { setError(caught instanceof Error ? caught.message : "SALES_CRM_API_FAILED"); return false; } finally { setBusy(false); } };
  if (mode === "leads") return <section className="workspace single-panel"><div className="desk-panel"><div className="panel-actions"><div><h2>Sales Leads</h2><p>Admin-only inquiries, follow-ups, and site visits.</p></div><div className="grid-actions"><DownloadMenu report={salesLeadsReport(leads, createdMonth, query, stage)} /><button className="primary-action" onClick={() => { setSelectedLead(null); setLeadDialog("add"); }}>Add Lead</button></div></div>{error && <p className="api-error" role="alert">{error}</p>}<SalesLeadFilterBar query={query} stage={stage} createdMonth={createdMonth} busy={busy} onQueryChange={setQuery} onStageChange={setStage} onCreatedMonthChange={setCreatedMonth} onClear={() => { setQuery(""); setStage(""); setCreatedMonth(""); }} />{leadDialog && <SalesLeadDialog lead={selectedLead ? leadDraft(selectedLead) : blankLeadDraft} editing={leadDialog === "edit"} busy={busy} onSave={saveLead} onClose={closeLeadDialog} />}<SalesLeadRegister leads={leads} busy={busy} onEdit={(lead) => { setSelectedLead(lead); setLeadDialog("edit"); }} onSave={saveInlineLead} /></div></section>;
  return <QuotationWorkspace config={config} leads={leads} quotations={quotations} templates={templates} error={error} busy={busy} query={query} onQueryChange={setQuery} createdDate={createdDate} onCreatedDateChange={setCreatedDate} createdMonth={createdMonth} onCreatedMonthChange={setCreatedMonth} run={run} />;
}
~~~

## CMP-remote-sales-QuotationWorkspace

src/remote-sales.tsx:32-41

~~~tsx
function QuotationWorkspace({ config, leads, quotations, templates, error, busy, query, onQueryChange, createdDate, onCreatedDateChange, createdMonth, onCreatedMonthChange, run }: { config: CognitoConfig; leads: Lead[]; quotations: Quotation[]; templates: ReturnType<typeof loadAdminDemoState>["reportTemplates"]; error: string; busy: boolean; query: string; onQueryChange: (query: string) => void; createdDate: string; onCreatedDateChange: (date: string) => void; createdMonth: string; onCreatedMonthChange: (month: string) => void; run: (action: () => Promise<unknown>, after?: () => void) => void }) {
  const status = ""; const onStatusChange = undefined;
  const [editor, setEditor] = useState<Quotation | "new" | null>(null); const [details, setDetails] = useState<Quotation | null>(null); const [documentError, setDocumentError] = useState("");
  const filteredQuotations = quotations.filter((item) => {
    const searchable = `${item.quotationNo} ${leads.find((lead) => lead.id === item.leadId)?.displayName ?? ""}`.toLowerCase();
    return (!query || searchable.includes(query.trim().toLowerCase())) && (!createdDate || item.createdAt.slice(0, 10) === createdDate) && (!createdDate && createdMonth ? item.createdAt.startsWith(createdMonth) : true);
  });
  const clearFilters = () => { onQueryChange(""); onCreatedDateChange(""); onCreatedMonthChange(""); };
  return <section className="workspace single-panel"><div className="desk-panel"><div className="panel-actions"><div><h2>Quotations</h2><p>Frozen quotation documents and their lifecycle.</p></div><button className="primary-action" onClick={() => setEditor("new")}>New Quotation</button></div>{(error || documentError) && <p className="api-error" role="alert">{error || documentError}</p>}{editor && <QuotationEditorDialog config={config} leads={leads} templates={templates} quotation={editor === "new" ? undefined : editor} busy={busy} onClose={() => setEditor(null)} onSave={(input) => run(() => editor !== "new" ? salesApi.updateQuotation(config, editor.id, input) : salesApi.createQuotation(config, input), () => setEditor(null))} />}{details && <QuotationDetailsDialog config={config} quotation={details} lead={leads.find((lead) => lead.id === details.leadId)} templateName={templates.find((template) => template.id === details.templateId)?.name ?? details.templateId} onClose={() => setDetails(null)} />}<QuotationFilterBar query={query} status={status} createdDate={createdDate} createdMonth={createdMonth} busy={busy} onQueryChange={onQueryChange} onStatusChange={onStatusChange} onCreatedDateChange={onCreatedDateChange} onCreatedMonthChange={onCreatedMonthChange} onClear={clearFilters} /><div className="table-wrap sales-crm-table"><table aria-label="Quotation register"><thead><tr><th>Number</th><th>Lead</th><th>Status</th><th>Amount</th><th>Created</th><th>Valid until</th><th>Actions</th></tr></thead><tbody>{filteredQuotations.map((item) => <tr key={item.id}><td>{item.quotationNo}</td><td>{leads.find((lead) => lead.id === item.leadId)?.displayName ?? item.leadId}</td><td>{item.status}</td><td>₹{item.total.toFixed(2)}</td><td>{item.createdAt.slice(0, 10)}</td><td>{item.validUntil || "—"}</td><td><div className="grid-actions billing-table-actions"><button type="button" className="billing-table-action" onClick={() => setDetails(item)}><Eye size={15} />View details</button>{item.status === "DRAFT" && <button type="button" className="billing-table-action" disabled={busy} onClick={() => setEditor(item)}><Pencil size={15} />Edit</button>}<QuotationDownloadButton config={config} quotationId={item.id} className="quotation-document-actions" buttonClassName="billing-table-action" onError={setDocumentError} /><button type="button" className="billing-table-action billing-table-action-primary" disabled={busy || ["ACCEPTED", "REJECTED", "EXPIRED"].includes(item.status)} onClick={() => run(() => salesApi.status(config, item.id, "SENT"))}><Send size={15} />Mark sent</button><button type="button" className="billing-table-action" disabled={busy || item.status !== "SENT"} onClick={() => run(() => salesApi.status(config, item.id, "ACCEPTED"))}><Check size={15} />Accept</button></div></td></tr>)}</tbody></table></div>{!filteredQuotations.length && <p className="empty-state">No quotations match these filters.</p>}</div></section>;
}
~~~

## CMP-sales-lead-dialog-SalesLeadDialog

src/sales-lead-dialog.tsx:26-55

~~~tsx
export function SalesLeadDialog({ lead = blankLeadDraft, editing = false, busy = false, onSave, onClose }: {
  lead?: LeadFormDraft;
  editing?: boolean;
  busy?: boolean;
  onSave: (lead: LeadFormDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(lead);
  const save = (event: FormEvent) => { event.preventDefault(); onSave(draft); };
  const update = (patch: Partial<LeadFormDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const formId = "sales-lead-dialog-form";
  return <Dialog wide title={editing ? "Edit Lead" : "Add Lead"} onClose={onClose} footer={<button className="primary-action" type="submit" form={formId} disabled={busy}>{editing ? "Save Changes" : "Save Lead"}</button>}>
    <form id={formId} className="form-grid" onSubmit={save}>
      <label>Name<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} /></label>
      <label>Phone<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} /></label>
      <label>Company<input disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })} /></label>
      <Switch label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })} />
      <label>Email<input type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })} /></label>
      <Switch label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })} />
      <label>Address<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} /></label>
      <label>Service interest<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} /></label>
      <label>Stage<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}><option value="NEW">New</option><option value="QUALIFIED">Qualified</option><option value="QUOTATION_SENT">Quotation sent</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label>
      <label>Temperature<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></label>
      <label>Follow-up date<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value || null })} /></label>
      <Switch label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })} />
      <label>Site visit date<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value || null })} /></label>
      <label>Notes<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} /></label>
    </form>
  </Dialog>;
}
~~~

## CMP-sales-lead-register-SalesLeadFilterBar

src/sales-lead-register.tsx:69-94

~~~tsx
export function SalesLeadFilterBar({ query, stage, createdMonth, busy, onQueryChange, onStageChange, onCreatedMonthChange, onClear }: {
  query: string;
  stage: LeadStage | "";
  createdMonth: string;
  busy?: boolean;
  onQueryChange: (query: string) => void;
  onStageChange: (stage: LeadStage | "") => void;
  onCreatedMonthChange: (month: string) => void;
  onClear: () => void;
}) {
  return <div className="sales-lead-filter-row sales-crm-filter">
    <label className="list-search">Search leads
      <input aria-label="Search leads" value={query} disabled={busy} onChange={(event) => onQueryChange(event.target.value)} placeholder="Name, company, or phone" />
    </label>
    <label>Status
      <select aria-label="Lead status filter" value={stage} disabled={busy} onChange={(event) => onStageChange(event.target.value as LeadStage | "")}>
        <option value="">All statuses</option>
        {leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
    <label>Created month/year
      <input aria-label="Lead created month/year" type="month" value={createdMonth} disabled={busy} onChange={(event) => onCreatedMonthChange(event.target.value)} />
    </label>
    <FilterClearButton onClick={onClear} disabled={busy} />
  </div>;
}
~~~

## CMP-sales-lead-register-SalesLeadRegister

src/sales-lead-register.tsx:96-126

~~~tsx
export function SalesLeadRegister({ leads, busy = false, onEdit, onSave }: {
  leads: Lead[];
  busy?: boolean;
  onEdit: (lead: Lead) => void;
  onSave: (lead: Lead, draft: LeadFormDraft) => Promise<boolean>;
}) {
  const [drafts, setDrafts] = useState<Record<number, LeadFormDraft>>({});
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(() => new Set());
  const [savingIds, setSavingIds] = useState<Set<number>>(() => new Set());
  const update = (lead: Lead, patch: Partial<LeadFormDraft>) => {
    setDrafts((current) => ({ ...current, [lead.id]: { ...(current[lead.id] ?? leadDraft(lead)), ...patch } }));
    setDirtyIds((current) => new Set(current).add(lead.id));
  };
  const cancel = (id: number) => {
    setDrafts((current) => { const next = { ...current }; delete next[id]; return next; });
    setDirtyIds((current) => { const next = new Set(current); next.delete(id); return next; });
  };
  const save = async (lead: Lead) => {
    const draft = drafts[lead.id] ?? leadDraft(lead);
    setSavingIds((current) => new Set(current).add(lead.id));
    try {
      if (await onSave(lead, draft)) cancel(lead.id);
    } finally {
      setSavingIds((current) => { const next = new Set(current); next.delete(lead.id); return next; });
    }
  };
  return <div className="table-wrap sales-crm-table"><table aria-label="Sales leads"><thead><tr><th>Lead</th><th>Contact</th><th>Stage</th><th>Temperature</th><th>Follow-up</th><th>Site visit</th><th>Actions</th></tr></thead><tbody>{leads.map((item) => {
    const draft = drafts[item.id] ?? leadDraft(item); const dirty = dirtyIds.has(item.id); const disabled = busy || savingIds.has(item.id);
    return <tr key={item.id} className={`sales-temperature-${draft.temperature.toLowerCase()}`}><td><strong>{item.displayName}</strong><br />{item.companyNotEntered ? "Not entered" : item.company || "—"}</td><td>{item.phone}<br />{item.emailNotEntered ? "Not entered" : item.email || "—"}</td><td><select aria-label={`Stage for ${item.displayName}`} disabled={disabled} value={draft.stage} onChange={(event) => update(item, { stage: event.target.value as LeadFormDraft["stage"] })}>{leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></td><td><select aria-label={`Temperature for ${item.displayName}`} disabled={disabled} value={draft.temperature} onChange={(event) => update(item, { temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></td><td><input aria-label={`Follow-up for ${item.displayName}`} disabled={disabled} type="date" value={draft.followUpDue ?? ""} onChange={(event) => update(item, { followUpDue: event.target.value || null })} /></td><td><select aria-label={`Site visit for ${item.displayName}`} disabled={disabled} value={draft.siteVisitCompleted ? "yes" : "no"} onChange={(event) => update(item, { siteVisitCompleted: event.target.value === "yes", siteVisitDate: event.target.value === "yes" ? draft.siteVisitDate : null })}><option value="yes">Yes</option><option value="no">No</option></select></td><td><div className="grid-actions sales-lead-actions"><button type="button" className="sales-lead-action sales-lead-action-secondary" disabled={disabled} onClick={() => onEdit(item)}>Edit</button>{dirty && <><button type="button" className="primary-action sales-lead-action sales-lead-action-save" disabled={disabled} onClick={() => void save(item)}>Save</button><button type="button" className="sales-lead-action sales-lead-action-secondary" disabled={disabled} onClick={() => cancel(item.id)}>Cancel</button></>}</div></td></tr>;
  })}</tbody></table>{!leads.length && <p className="empty-state">No leads match these filters.</p>}</div>;
}
~~~

## CMP-ui-kit-FilterClearButton

src/ui-kit.tsx:6-8

~~~tsx
export function FilterClearButton({ onClick, disabled, label = "Clear" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return <button type="button" className="filter-clear-action" onClick={onClick} disabled={disabled}>{label}</button>;
}
~~~

## CMP-ui-kit-ListSearchActions

src/ui-kit.tsx:10-12

~~~tsx
export function ListSearchActions({ onClear }: { onClear: () => void }) {
  return <div className="list-search-actions" role="group" aria-label="Search actions"><FilterClearButton onClick={onClear} /></div>;
}
~~~

## CMP-ui-kit-Switch

src/ui-kit.tsx:14-18

~~~tsx
export function Switch({ label, checked, onCheckedChange, className = "" }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; className?: string }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={checked} className={`ui-switch ${className}`.trim()} onClick={() => onCheckedChange(!checked)}>
    <span className="ui-switch-control" aria-hidden="true"><span /></span><span className="ui-switch-label">{label}</span><span className="ui-switch-state" aria-hidden="true">{checked ? "On" : "Off"}</span>
  </button>;
}
~~~

## CMP-ui-kit-PageSizeSelect

src/ui-kit.tsx:20-22

~~~tsx
export function PageSizeSelect({ value, onChange, ariaLabel = "Records per page" }: { value: number; onChange: (value: number) => void; ariaLabel?: string }) {
  return <label className="page-size">Per page<select aria-label={ariaLabel} value={value} onChange={(event) => onChange(Number(event.target.value))}>{PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
~~~

## CMP-ui-kit-DownloadMenu

src/ui-kit.tsx:24-40

~~~tsx
export function DownloadMenu<T>({ report }: { report: ExportReport<T> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const disabled = report.rows.length === 0;
  useEffect(() => {
    if (!open) return;
    const onClickAway = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickAway); document.addEventListener("keydown", onEscape);
    return () => { document.removeEventListener("mousedown", onClickAway); document.removeEventListener("keydown", onEscape); };
  }, [open]);
  const run = (action: (report: ExportReport<T>) => void) => { action(report); setOpen(false); };
  return <div className="download-menu" ref={ref}>
    <button type="button" className="download-menu-trigger" disabled={disabled} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}><Download size={16} /> Download</button>
    {open && <div className="download-menu-list" role="menu"><button type="button" role="menuitem" onClick={() => run(downloadExcel)}>Excel (.xlsx)</button><button type="button" role="menuitem" onClick={() => run(downloadPdf)}>PDF</button></div>}
  </div>;
}
~~~

## CMP-ui-kit-Dialog

src/ui-kit.tsx:57-84

~~~tsx
export function Dialog({ title, subtitle, onClose, children, wide = false, footer, className }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode; wide?: boolean; footer?: ReactNode; className?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const stackId = Symbol('dialog'); dialogStack.push(stackId); returnFocusRef.current = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    const onEscape = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== stackId) return;
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === 'Tab') { const items = focusable(); if (!items.length) { event.preventDefault(); panelRef.current?.focus(); return; } const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', onEscape);
    if (bodyScrollLocks === 0) savedBodyOverflow = document.body.style.overflow;
    bodyScrollLocks += 1; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => (panelRef.current?.querySelector<HTMLElement>('[data-dialog-initial-focus]') ?? focusable()[0] ?? panelRef.current)?.focus());
    return () => { document.removeEventListener('keydown', onEscape); const stackIndex = dialogStack.indexOf(stackId); if (stackIndex >= 0) dialogStack.splice(stackIndex, 1); bodyScrollLocks = Math.max(0, bodyScrollLocks - 1); if (bodyScrollLocks === 0) document.body.style.overflow = savedBodyOverflow; returnFocusRef.current?.focus(); };
  }, []);
  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panelRef} tabIndex={-1} className={`${wide ? 'dialog-panel dialog-wide' : 'dialog-panel'}${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="dialog-header"><div><h2 id={titleId}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>
      <div className="dialog-body">{children}</div>
      <div className="dialog-footer"><div className="dialog-footer-actions">{footer}</div><button type="button" className="back-action" onClick={onClose}>Go Back</button></div>
    </div>
  </div>;
}
~~~

## CMP-ui-kit-SearchSelect

src/ui-kit.tsx:106-114

~~~tsx
export function SearchSelect({ label, options, value, onChange, placeholder = 'Search...', disabled = false, hideLabel = false, openOnFocus = true }: { label: string; options: SearchSelectOption[]; value: number | string | undefined; onChange: (value: number | string) => void; placeholder?: string; disabled?: boolean; hideLabel?: boolean; openOnFocus?: boolean }) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState(''); const listId = useId();
  const rootRef = useRef<HTMLLabelElement>(null);
  usePickerDismissal(rootRef, open, () => setOpen(false));
  const selected = options.find((option) => option.value === value); const needle = query.trim().toLowerCase(); const shown = options.filter((option) => !needle || option.label.toLowerCase().includes(needle)).slice(0, 100);
  return <label className="search-select" ref={rootRef}><span className={hideLabel ? "sr-only" : undefined}>{label}</span><input role="combobox" aria-label={label} aria-expanded={open} aria-controls={listId} aria-autocomplete="list" disabled={disabled} placeholder={placeholder} value={open ? query : selected?.label ?? ''} onFocus={() => { if (openOnFocus) { setQuery(''); setOpen(true); } }} onClick={() => { if (!open) { setQuery(''); setOpen(true); } }} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={(event) => { if (event.key === 'Enter' && open) { event.preventDefault(); if (shown[0]) { onChange(shown[0].value); setOpen(false); } } else if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); } }} />
    {open && <ul id={listId} role="listbox" className="search-select-options">{shown.length ? shown.map((option) => <li key={option.value}><button type="button" role="option" aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button></li>) : <li className="picker-stock">No matches</li>}</ul>}
  </label>;
}
~~~