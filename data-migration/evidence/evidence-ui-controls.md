# Exhaustive static UI declaration ledger

Counts are source declaration sites, not rendered instances. Dynamic maps can instantiate many controls. Legacy/unreachable declarations are retained and explicitly not asserted reachable. IDs are fixed to this revision and source line. Fields preserve exact JSX attributes, including required/default/value/disabled rules. Ancestor expressions preserve conditional visibility. Use parent component IDs to join screens and actions.

### STATE-admin-console-tsx-179

Component: AdminConsole Â· src/admin-console.tsx:179-183

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
          className="management-tabs"
          role="tablist"
          aria-label="Admin Console tabs"
        >
```

Content/label expression:  {ADMIN_TABS.map((item) => ( <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => { if (item === tab) return; if ( tab === "Report Templates" && templateDirty && !window.confirm("Discard unsaved template changes?") ) return; setTemplateDirty(false); setTab(item); }} > {ADMIN_TAB_LABELS[item] ?? item} </button> ))} 

### STATE-admin-console-tsx-185

Component: AdminConsole Â· src/admin-console.tsx:185-201

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {ADMIN_TAB_LABELS[item] ?? item} 

### STATE-admin-console-tsx-207

Component: AdminConsole Â· src/admin-console.tsx:207-207

Tag: div; visibility: storageError

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  <p>{storageError}</p> 

### ACT-admin-console-tsx-246

Component: AdminConsole Â· src/admin-console.tsx:246-251

Tag: AppThemeTab; visibility: tab === "App Theme"

```tsx
<AppThemeTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
            onThemeSaved={onThemeSaved}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-261

Component: AdminConsole Â· src/admin-console.tsx:261-267

Tag: ReportTemplatesTab; visibility: tab === "Report Templates"

```tsx
<ReportTemplatesTab
            adminState={adminState}
            commit={commit}
            actingUser={actingUser}
            onDirtyChange={setTemplateDirty}
            initialCategory={initialReportCategory}
          />
```

Content/label expression: 

### STATE-admin-console-tsx-299

Component: TeamStructureTab Â· src/admin-console.tsx:299-299

Tag: p; visibility: error

```tsx
<p className="api-error" role="alert">
```

Content/label expression: {error}

### ACT-admin-console-tsx-299

Component: TeamStructureTab Â· src/admin-console.tsx:299-299

Tag: RemoteTeamStructure; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<RemoteTeamStructure directory={remote} config={cognitoConfig} onChanged={refreshRemote} />
```

Content/label expression: 

### ACT-admin-console-tsx-304

Component: TeamStructureHeader Â· src/admin-console.tsx:304-304

Tag: button; visibility: refresh

```tsx
<button type="button" className="secondary-action team-icon-action" onClick={refresh}>
```

Content/label expression: <RefreshCw size={16} /> Refresh

### FORM-admin-console-tsx-331

Component: LocalTeamStructure Â· src/admin-console.tsx:331-331

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="team-create-form" onSubmit={create}>
```

Content/label expression: <label>New department<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" /></label> <button className="primary-action" type="submit"><Plus size={17} />Create department</button>

### ACT-admin-console-tsx-331

Component: LocalTeamStructure Â· src/admin-console.tsx:331-331

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" />
```

Content/label expression: 

### ACT-admin-console-tsx-331

Component: LocalTeamStructure Â· src/admin-console.tsx:331-331

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit">
```

Content/label expression: <Plus size={17} /> Create department

### ACT-admin-console-tsx-332

Component: LocalTeamStructure Â· src/admin-console.tsx:332-332

Tag: DepartmentTable; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<DepartmentTable departments={state.service_departments} selectedId={selectedId} users={state.users} onManage={setSelectedId} onRename={setRenameDepartment} onArchive={(department) => mutate((db) => updateServiceDepartment(db, department.id, department.name, "ARCHIVED"))} />
```

Content/label expression: 

### ACT-admin-console-tsx-333

Component: LocalTeamStructure Â· src/admin-console.tsx:333-333

Tag: DepartmentTeamPanel; visibility: selected

```tsx
<DepartmentTeamPanel departmentName={selected.name} managers={selected.manager_ids.map((id) => state.users.find((user) => user.id === id)).filter((user): user is User => Boolean(user))} advisorTeams={selected.advisor_teams.map((team) => ({ managerId: team.manager_id, advisor: state.users.find((user) => user.id === team.advisor_id) })).filter((team): team is { managerId: number; advisor: User } => Boolean(team.advisor))} appointmentManagerId={appointmentManagerId} teamManagerId={teamManagerId} advisorId={advisorId} eligibleManagers={managers.filter((user) => !selected.manager_ids.includes(user.id))} eligibleAdvisors={advisors} onAppointmentManagerChange={setAppointmentManagerId} onTeamManagerChange={setTeamManagerId} onAdvisorChange={setAdvisorId} onAppoint={() => { if (mutate((db) => appointServiceDepartmentManager(db, selected.id, appointmentManagerId))) { setTeamManagerId(appointmentManagerId); setAppointmentManagerId(0); } }} onRemoveManager={(managerId) => { if (mutate((db) => removeServiceDepartmentManager(db, selected.id, managerId)) && teamManagerId === managerId) setTeamManagerId(0); }} onAssignAdvisor={() => { if (mutate((db) => assignServiceAdvisorTeam(db, selected.id, teamManagerId, advisorId))) setAdvisorId(0); }} onRemoveAdvisor={(managerId, nextAdvisorId) => mutate((db) => removeServiceAdvisorTeam(db, selected.id, managerId, nextAdvisorId))} />
```

Content/label expression: 

### ACT-admin-console-tsx-334

Component: LocalTeamStructure Â· src/admin-console.tsx:334-334

Tag: DepartmentRenameDialog; visibility: renameDepartment

```tsx
<DepartmentRenameDialog key={renameDepartment.id} departmentName={renameDepartment.name} onClose={() => setRenameDepartment(undefined)} onSave={(name) => { if (mutate((db) => updateServiceDepartment(db, renameDepartment.id, name, renameDepartment.status))) setRenameDepartment(undefined); }} />
```

Content/label expression: 

### STATE-admin-console-tsx-340

Component: DepartmentRenameDialog Â· src/admin-console.tsx:340-340

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog title="Rename department" onClose={onClose}>
```

Content/label expression: <form onSubmit={(event) => { event.preventDefault(); onSave(name); }}><label>Department name<input aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)} /></label><div className="action-row"><button className="primary-action" type="submit"><Pencil size={17} />Save department</button><button type="button" onClick={onClose}>Cancel</button></div></form>

### FORM-admin-console-tsx-340

Component: DepartmentRenameDialog Â· src/admin-console.tsx:340-340

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form onSubmit={(event) => { event.preventDefault(); onSave(name); }}>
```

Content/label expression: <label>Department name<input aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)} /></label> <div className="action-row"><button className="primary-action" type="submit"><Pencil size={17} />Save department</button><button type="button" onClick={onClose}>Cancel</button></div>

### ACT-admin-console-tsx-340

Component: DepartmentRenameDialog Â· src/admin-console.tsx:340-340

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Department name" required value={name} onChange={(event) => setName(event.target.value)} />
```

Content/label expression: 

### ACT-admin-console-tsx-340

Component: DepartmentRenameDialog Â· src/admin-console.tsx:340-340

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit">
```

Content/label expression: <Pencil size={17} /> Save department

### ACT-admin-console-tsx-340

Component: DepartmentRenameDialog Â· src/admin-console.tsx:340-340

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" onClick={onClose}>
```

Content/label expression: Cancel

### ACT-admin-console-tsx-345

Component: DepartmentTable Â· src/admin-console.tsx:345-345

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action" onClick={() => onManage(department.id)}>
```

Content/label expression: <UsersRound size={15} /> Manage team

### ACT-admin-console-tsx-345

Component: DepartmentTable Â· src/admin-console.tsx:345-345

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action" onClick={() => onRename(department)}>
```

Content/label expression: <Pencil size={15} /> Rename

### ACT-admin-console-tsx-345

Component: DepartmentTable Â· src/admin-console.tsx:345-345

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action grid-action-danger" onClick={() => onArchive(department)} disabled={department.status === "ARCHIVED"}>
```

Content/label expression: <Archive size={15} /> Archive

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Eligible manager" value={appointmentManagerId} onChange={(event) => onAppointmentManagerChange(Number(event.target.value))}>
```

Content/label expression: <option value={0}>Select eligible manager</option> {eligibleManagers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" disabled={!appointmentManagerId} onClick={onAppoint}>
```

Content/label expression: <UserPlus size={17} /> Appoint manager

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: button; visibility: managers.length

```tsx
<button type="button" className="secondary-action" onClick={() => onRemoveManager(manager.id)}>
```

Content/label expression: <UserMinus size={16} /> Remove

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Appointed manager" value={teamManagerId} onChange={(event) => onTeamManagerChange(Number(event.target.value))}>
```

Content/label expression: <option value={0}>Select appointed manager</option> {managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Eligible advisor" value={advisorId} disabled={!selectedManager} onChange={(event) => onAdvisorChange(Number(event.target.value))}>
```

Content/label expression: <option value={0}>{selectedManager ? "Select eligible advisor" : "Choose a manager first"}</option> {eligibleAdvisors.map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.name}</option>)}

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action team-assign-action" disabled={!selectedManager || !advisorId} onClick={onAssignAdvisor}>
```

Content/label expression: <UserPlus size={17} /> Assign advisor

### ACT-admin-console-tsx-351

Component: DepartmentTeamPanel Â· src/admin-console.tsx:351-351

Tag: button; visibility: !selectedManager

```tsx
<button type="button" className="secondary-action" onClick={() => onRemoveAdvisor(team.managerId, team.advisor.id)}>
```

Content/label expression: <UserMinus size={16} /> Remove

### FORM-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="team-create-form" onSubmit={(event) => { event.preventDefault(); if (branchId) void run(async () => { const result = await adminUsersApi.createServiceDepartment(config, { branchId, name }); setName(""); setDepartmentId(result.serviceDepartment.id); }); }}>
```

Content/label expression: <label>New department<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" /></label> <button className="primary-action" type="submit"><Plus size={17} />Create department</button>

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="New department" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. General Service" />
```

Content/label expression: 

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit">
```

Content/label expression: <Plus size={17} /> Create department

### STATE-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: p; visibility: error

```tsx
<p className="api-error" role="alert">
```

Content/label expression: {error}

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action" onClick={() => setDepartmentId(item.id)}>
```

Content/label expression: <UsersRound size={15} /> Manage team

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action" onClick={() => setRenameDepartment(item)}>
```

Content/label expression: <Pencil size={15} /> Rename

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action grid-action-danger" disabled={item.status === "ARCHIVED"} onClick={() => void run(() => adminUsersApi.updateServiceDepartment(config, item.id, { name: item.name, status: "ARCHIVED" }))}>
```

Content/label expression: <Archive size={15} /> Archive

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: RemoteDepartmentTeamPanel; visibility: department

```tsx
<RemoteDepartmentTeamPanel department={department} appointmentManagerId={appointmentManagerId} teamManagerId={teamManagerId} advisorId={advisorId} managerUsers={managerUsers} advisorUsers={advisorUsers} onAppointmentManagerChange={setAppointmentManagerId} onTeamManagerChange={setTeamManagerId} onAdvisorChange={setAdvisorId} onAppoint={() => void run(async () => { await adminUsersApi.appointManager(config, department.id, appointmentManagerId); setTeamManagerId(appointmentManagerId); setAppointmentManagerId(""); })} onRemoveManager={(managerId) => void run(() => adminUsersApi.removeManager(config, department.id, managerId))} onAssignAdvisor={() => void run(async () => { await adminUsersApi.assignAdvisorTeam(config, department.id, teamManagerId, advisorId); setAdvisorId(""); })} onRemoveAdvisor={(managerId, nextAdvisorId) => void run(() => adminUsersApi.removeAdvisorTeam(config, department.id, managerId, nextAdvisorId))} />
```

Content/label expression: 

### ACT-admin-console-tsx-363

Component: RemoteTeamStructure Â· src/admin-console.tsx:363-363

Tag: DepartmentRenameDialog; visibility: renameDepartment

```tsx
<DepartmentRenameDialog key={renameDepartment.id} departmentName={renameDepartment.name} onClose={() => setRenameDepartment(undefined)} onSave={(nextName) => void run(async () => { await adminUsersApi.updateServiceDepartment(config, renameDepartment.id, { name: nextName, status: renameDepartment.status }); setRenameDepartment(undefined); })} />
```

Content/label expression: 

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Eligible manager" value={appointmentManagerId} onChange={(event) => onAppointmentManagerChange(event.target.value)}>
```

Content/label expression: <option value="">Select eligible manager</option> {managerUsers.filter((user) => !managers.some((manager) => manager.membershipId === user.id)).map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" disabled={!appointmentManagerId} onClick={onAppoint}>
```

Content/label expression: <UserPlus size={17} /> Appoint manager

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: button; visibility: managers.length

```tsx
<button type="button" className="secondary-action" onClick={() => onRemoveManager(manager.membershipId)}>
```

Content/label expression: <UserMinus size={16} /> Remove

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Appointed manager" value={teamManagerId} onChange={(event) => onTeamManagerChange(event.target.value)}>
```

Content/label expression: <option value="">Select appointed manager</option> {managers.map((manager) => <option key={manager.membershipId} value={manager.membershipId}>{manager.name}</option>)}

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Eligible advisor" value={advisorId} disabled={!selectedManager} onChange={(event) => onAdvisorChange(event.target.value)}>
```

Content/label expression: <option value="">{selectedManager ? "Select eligible advisor" : "Choose a manager first"}</option> {advisorUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action team-assign-action" disabled={!selectedManager || !advisorId} onClick={onAssignAdvisor}>
```

Content/label expression: <UserPlus size={17} /> Assign advisor

### ACT-admin-console-tsx-369

Component: RemoteDepartmentTeamPanel Â· src/admin-console.tsx:369-369

Tag: button; visibility: !selectedManager

```tsx
<button type="button" className="secondary-action" onClick={() => onRemoveAdvisor(team.managerMembershipId, team.advisorMembershipId)}>
```

Content/label expression: <UserMinus size={16} /> Remove

### STATE-admin-console-tsx-417

Component: ServiceTaskCatalog Â· src/admin-console.tsx:417-417

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="sub-tabs" role="tablist" aria-label="Service task sections">
```

Content/label expression:  <button id="service-tasks-tab" type="button" role="tab" aria-selected={subTab === "tasks"} aria-controls="service-tasks-panel" className={subTab === "tasks" ? "active" : ""} onClick={() => setSubTab("tasks")} > Service Tasks </button> <button id="catalogs-tab" type="button" role="tab" aria-selected={subTab === "catalogs"} aria-controls="catalogs-panel" className={subTab === "catalogs" ? "active" : ""} onClick={() => setSubTab("catalogs")} > Catalogs </button> 

### STATE-admin-console-tsx-418

Component: ServiceTaskCatalog Â· src/admin-console.tsx:418-426

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          id="service-tasks-tab"
          type="button"
          role="tab"
          aria-selected={subTab === "tasks"}
          aria-controls="service-tasks-panel"
          className={subTab === "tasks" ? "active" : ""}
          onClick={() => setSubTab("tasks")}
        >
```

Content/label expression: Service Tasks 

### STATE-admin-console-tsx-429

Component: ServiceTaskCatalog Â· src/admin-console.tsx:429-437

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          id="catalogs-tab"
          type="button"
          role="tab"
          aria-selected={subTab === "catalogs"}
          aria-controls="catalogs-panel"
          className={subTab === "catalogs" ? "active" : ""}
          onClick={() => setSubTab("catalogs")}
        >
```

Content/label expression: Catalogs 

### STATE-admin-console-tsx-441

Component: ServiceTaskCatalog Â· src/admin-console.tsx:441-441

Tag: div; visibility: subTab === "tasks"

```tsx
<div id="service-tasks-panel" className="service-task-panel" role="tabpanel" aria-labelledby="service-tasks-tab" aria-label="Service Tasks">
```

Content/label expression:  <div className="panel-actions"> <div> <h3>Service Tasks</h3> <p>Service tasks by department, brand, and car segment.</p> </div> <button type="button" className="primary-action" onClick={() => setDialog({})} > Add Service Task </button> </div> <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search catalog <input type="search" aria-label="Search catalog services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search service tasks" /> </label> <label>Department<select aria-label="Filter department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}><option value={0}>All departments</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label> <label>Brand name<select aria-label="Filter brand name" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}><option value={0}>All brands</option><option value={-1}>- NA -</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label> <label>Car segment<select aria-label="Filter car segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}><option value={0}>All segments</option><option value={-1}>- NA -</option>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}</select></label> <ListSearchActions onClear={clearFilters} /> </div> {error && ( <p className="error-text" role="alert"> {error} </p> )} <div className="table-wrap"> <table aria-label="Service task catalog"> <thead> <tr> <th>Department</th> <th>Brand name</th> <th>Car Segment</th> <th>Service task</th> <th>Pre-GST base rate</th> <th>Applicable GST</th> <th>Actions</th> </tr> </thead> <tbody> {visible.map((item) => ( <CatalogRow key={item.id} item={item} actor={actor} mutate={mutate} setError={setError} onEdit={() => setDialog({ item })} /> ))} </tbody> </table> </div> {!visible.length && ( <p className="empty-state">No active catalog services.</p> )} 

### ACT-admin-console-tsx-447

Component: ServiceTaskCatalog Â· src/admin-console.tsx:447-451

Tag: button; visibility: subTab === "tasks"

```tsx
<button
          type="button"
          className="primary-action"
          onClick={() => setDialog({})}
        >
```

Content/label expression: Add Service Task 

### ACT-admin-console-tsx-458

Component: ServiceTaskCatalog Â· src/admin-console.tsx:458-464

Tag: input; visibility: subTab === "tasks"

```tsx
<input
            type="search"
            aria-label="Search catalog services"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search service tasks"
          />
```

Content/label expression: 

### ACT-admin-console-tsx-466

Component: ServiceTaskCatalog Â· src/admin-console.tsx:466-466

Tag: select; visibility: subTab === "tasks"

```tsx
<select aria-label="Filter department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}>
```

Content/label expression: <option value={0}>All departments</option> {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}

### ACT-admin-console-tsx-467

Component: ServiceTaskCatalog Â· src/admin-console.tsx:467-467

Tag: select; visibility: subTab === "tasks"

```tsx
<select aria-label="Filter brand name" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}>
```

Content/label expression: <option value={0}>All brands</option> <option value={-1}>- NA -</option> {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}

### ACT-admin-console-tsx-468

Component: ServiceTaskCatalog Â· src/admin-console.tsx:468-468

Tag: select; visibility: subTab === "tasks"

```tsx
<select aria-label="Filter car segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}>
```

Content/label expression: <option value={0}>All segments</option> <option value={-1}>- NA -</option> {segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}

### ACT-admin-console-tsx-469

Component: ServiceTaskCatalog Â· src/admin-console.tsx:469-469

Tag: ListSearchActions; visibility: subTab === "tasks"

```tsx
<ListSearchActions onClear={clearFilters} />
```

Content/label expression: 

### STATE-admin-console-tsx-472

Component: ServiceTaskCatalog Â· src/admin-console.tsx:472-472

Tag: p; visibility: error; subTab === "tasks"

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-admin-console-tsx-491

Component: ServiceTaskCatalog Â· src/admin-console.tsx:491-498

Tag: CatalogRow; visibility: subTab === "tasks"

```tsx
<CatalogRow
                key={item.id}
                item={item}
                actor={actor}
                mutate={mutate}
                setError={setError}
                onEdit={() => setDialog({ item })}
              />
```

Content/label expression: 

### STATE-admin-console-tsx-507

Component: ServiceTaskCatalog Â· src/admin-console.tsx:507-507

Tag: div; visibility: subTab === "catalogs"

```tsx
<div id="catalogs-panel" className="service-task-catalogs-panel" role="tabpanel" aria-labelledby="catalogs-tab" aria-label="Catalogs">
```

Content/label expression:  <div className="team-details-grid"> <CatalogMasterList title="Brand names" table="service_brands" items={brands} mutate={mutate} /> <CatalogMasterList title="Car segments" table="car_segments" items={segments} mutate={mutate} /> </div> 

### ACT-admin-console-tsx-514

Component: ServiceTaskCatalog Â· src/admin-console.tsx:514-523

Tag: CatalogServiceTaskDialog; visibility: dialog

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-552

Component: CatalogRow Â· src/admin-console.tsx:552-556

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            className="grid-action"
            onClick={onEdit}
          >
```

Content/label expression: Edit 

### ACT-admin-console-tsx-559

Component: CatalogRow Â· src/admin-console.tsx:559-569

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Archive 

### STATE-admin-console-tsx-635

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:635-645

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="service-task-dialog-form" className="service-task-dialog-form" onSubmit={save} > <div className="service-task-form-row"> <label> Department <select data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}> <option value={0}>Select department</option> {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)} </select> </label> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-brand">Brand name</label> <button type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}>Quick add new Brand</button> </div> <select id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}> <option value={0}>- NA -</option> {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)} </select> </div> </div> <div className="service-task-form-row"> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-car-segment">Car segment</label> <button type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}>Quick add new Car Segment</button> </div> <select id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}> <option value={0}>- NA -</option> {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)} </select> </div> <label> Service name <input aria-label="Catalog service name" value={name} onChange={(event) => setName(event.target.value)} /> </label> </div> <div className="service-task-rate-grid"> <label> Pre-GST base rate <input aria-label="Catalog base rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} /> </label> <SearchSelect label="Applicable GST" options={CATALOG_GST_OPTIONS} value={gstRate} onChange={(value) => setGstRate(Number(value))} placeholder="Select GST rate" /> </div> {error && <p className="error-text" role="alert">{error}</p>} </form> {quickAdd && <CatalogMasterDialog table={quickAdd} title={quickAdd === "service_brands" ? "Add Brand name" : "Add Car Segment"} mutate={mutate} onClose={() => setQuickAdd(undefined)} onCreated={(id) => { if (quickAdd === "service_brands") setBrandId(id); else setSegmentId(id); setQuickAdd(undefined); }} />} 

### ACT-admin-console-tsx-641

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:641-641

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit" form="service-task-dialog-form">
```

Content/label expression:  {item ? "Save changes" : "Add service task"} 

### FORM-admin-console-tsx-646

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:646-650

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form
        id="service-task-dialog-form"
        className="service-task-dialog-form"
        onSubmit={save}
      >
```

Content/label expression:  <div className="service-task-form-row"> <label> Department <select data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}> <option value={0}>Select department</option> {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)} </select> </label> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-brand">Brand name</label> <button type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}>Quick add new Brand</button> </div> <select id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}> <option value={0}>- NA -</option> {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)} </select> </div> </div> <div className="service-task-form-row"> <div className="service-task-field"> <div className="service-task-field-header"> <label htmlFor="service-task-car-segment">Car segment</label> <button type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}>Quick add new Car Segment</button> </div> <select id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}> <option value={0}>- NA -</option> {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)} </select> </div> <label> Service name <input aria-label="Catalog service name" value={name} onChange={(event) => setName(event.target.value)} /> </label> </div> <div className="service-task-rate-grid"> <label> Pre-GST base rate <input aria-label="Catalog base rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} /> </label> <SearchSelect label="Applicable GST" options={CATALOG_GST_OPTIONS} value={gstRate} onChange={(value) => setGstRate(Number(value))} placeholder="Select GST rate" /> </div> {error && <p className="error-text" role="alert">{error}</p>} 

### ACT-admin-console-tsx-654

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:654-654

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select data-dialog-initial-focus aria-label="Service department" value={departmentId} onChange={(event) => setDepartmentId(Number(event.target.value))}>
```

Content/label expression:  <option value={0}>Select department</option> {departments.filter((department) => department.status === "ACTIVE").map((department) => <option key={department.id} value={department.id}>{department.name}</option>)} 

### ACT-admin-console-tsx-662

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:662-662

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="link-action" onClick={() => setQuickAdd("service_brands")}>
```

Content/label expression: Quick add new Brand

### ACT-admin-console-tsx-664

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:664-664

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select id="service-task-brand" value={brandId} onChange={(event) => setBrandId(Number(event.target.value))}>
```

Content/label expression:  <option value={0}>- NA -</option> {brands.filter((brand) => brand.status === "ACTIVE").map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)} 

### ACT-admin-console-tsx-674

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:674-674

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="link-action" onClick={() => setQuickAdd("car_segments")}>
```

Content/label expression: Quick add new Car Segment

### ACT-admin-console-tsx-676

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:676-676

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select id="service-task-car-segment" value={segmentId} onChange={(event) => setSegmentId(Number(event.target.value))}>
```

Content/label expression:  <option value={0}>- NA -</option> {segments.filter((segment) => segment.status === "ACTIVE").map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)} 

### ACT-admin-console-tsx-683

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:683-687

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Catalog service name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
```

Content/label expression: 

### ACT-admin-console-tsx-693

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:693-700

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Catalog base rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
```

Content/label expression: 

### ACT-admin-console-tsx-702

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:702-708

Tag: SearchSelect; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<SearchSelect
            label="Applicable GST"
            options={CATALOG_GST_OPTIONS}
            value={gstRate}
            onChange={(value) => setGstRate(Number(value))}
            placeholder="Select GST rate"
          />
```

Content/label expression: 

### STATE-admin-console-tsx-710

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:710-710

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-admin-console-tsx-712

Component: CatalogServiceTaskDialog Â· src/admin-console.tsx:712-712

Tag: CatalogMasterDialog; visibility: quickAdd

```tsx
<CatalogMasterDialog table={quickAdd} title={quickAdd === "service_brands" ? "Add Brand name" : "Add Car Segment"} mutate={mutate} onClose={() => setQuickAdd(undefined)} onCreated={(id) => { if (quickAdd === "service_brands") setBrandId(id); else setSegmentId(id); setQuickAdd(undefined); }} />
```

Content/label expression: 

### ACT-admin-console-tsx-719

Component: CatalogMasterList Â· src/admin-console.tsx:719-719

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="secondary-action" onClick={() => setDialog({ id: 0, name: "", status: "ACTIVE", created_at: "", updated_at: "" })}>
```

Content/label expression: <Plus size={16} /> Add

### ACT-admin-console-tsx-719

Component: CatalogMasterList Â· src/admin-console.tsx:719-719

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action" onClick={() => setDialog(item)}>
```

Content/label expression: Rename

### ACT-admin-console-tsx-719

Component: CatalogMasterList Â· src/admin-console.tsx:719-719

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="grid-action grid-action-danger" disabled={item.status === "ARCHIVED"} onClick={() => mutate((db) => updateServiceCatalogMaster(db, table, item.id, item.name, "ARCHIVED"))}>
```

Content/label expression: Archive

### ACT-admin-console-tsx-719

Component: CatalogMasterList Â· src/admin-console.tsx:719-719

Tag: CatalogMasterDialog; visibility: dialog

```tsx
<CatalogMasterDialog table={table} title={dialog.id ? `Rename ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`} item={dialog.id ? dialog : undefined} mutate={mutate} onClose={() => setDialog(undefined)} />
```

Content/label expression: 

### STATE-admin-console-tsx-726

Component: CatalogMasterDialog Â· src/admin-console.tsx:726-726

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog title={title} onClose={onClose} footer={<button className="primary-action" type="submit" form="catalog-master-dialog-form">Save</button>}>
```

Content/label expression: <form id="catalog-master-dialog-form" onSubmit={save}><label>Name<input data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)} /></label>{error && <p className="error-text" role="alert">{error}</p>}</form>

### ACT-admin-console-tsx-726

Component: CatalogMasterDialog Â· src/admin-console.tsx:726-726

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit" form="catalog-master-dialog-form">
```

Content/label expression: Save

### FORM-admin-console-tsx-726

Component: CatalogMasterDialog Â· src/admin-console.tsx:726-726

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="catalog-master-dialog-form" onSubmit={save}>
```

Content/label expression: <label>Name<input data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>}

### ACT-admin-console-tsx-726

Component: CatalogMasterDialog Â· src/admin-console.tsx:726-726

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input data-dialog-initial-focus aria-label={`${title} name`} required value={name} onChange={(event) => setName(event.target.value)} />
```

Content/label expression: 

### STATE-admin-console-tsx-726

Component: CatalogMasterDialog Â· src/admin-console.tsx:726-726

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### STATE-admin-console-tsx-824

Component: RolesPageAccessTab Â· src/admin-console.tsx:824-824

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Roles &amp; Page Access</h3> <button className="primary-action" onClick={() => { setNewRole({ label: "", description: "" }); setFormError(""); setCreating(true); }} > Add Role </button> </div> {creating && ( <Dialog title="Add Role" subtitle="Session-only demo role" onClose={() => setCreating(false)} > <form onSubmit={(event) => { event.preventDefault(); try { commit((current) => addDemoRole(current, newRole), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${newRole.label.trim()}" created`, userId: String(actingUser.id), userName: actingUser.name, }); setCreating(false); } catch (error) { setFormError( error instanceof Error ? error.message : "Could not create role.", ); } }} > <label> Role name <input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) } /> </label> <label> Description <input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) } /> </label> {formError && <p className="error-text">{formError}</p>} <div className="action-row"> <button className="primary-action">Save Role</button> <button type="button" onClick={() => setCreating(false)}> Cancel </button> </div> </form> </Dialog> )} <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search <input aria-label="Search roles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Role name or description" /> </label> <label> Status <select aria-label="Filter roles by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as typeof statusFilter); setPage(1); }} > <option value="ALL">All statuses</option> <option value="active">Active</option> <option value="archived">Archived</option> </select> </label> <ListSearchActions onClear={() => { setSearch(""); setStatusFilter("ALL"); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Roles", filters: activeFilterSummary({ Search: search.trim(), Status: statusFilter, }), columns: roleColumns, rows: roles, }} /> } from={pagedRoles.from} to={pagedRoles.to} totalCount={pagedRoles.totalCount} page={pagedRoles.page} pageCount={pagedRoles.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Role records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <div className="role-access-layout"> <div className="record-list role-list"> {pagedRoles.items.map((role) => ( <div className={`managed-record${selectedRoleId === role.id ? " active-record" : ""}`} key={role.id} > {editingRoleId === role.id ? ( <form className="inline-edit" onSubmit={(event) => { event.preventDefault(); try { commit( (current) => updateDemoRole(current, role.id, editDraft), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${role.label}" updated`, userId: String(actingUser.id), userName: actingUser.name, }, ); setEditingRoleId(undefined); } catch (error) { window.alert( error instanceof Error ? error.message : "Could not update role.", ); } }} > <input required value={editDraft.label} onChange={(event) => setEditDraft({ ...editDraft, label: event.target.value }) } /> <input value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value, }) } placeholder="Description" /> <div className="action-row"> <button className="primary-action">Save</button> <button type="button" onClick={() => setEditingRoleId(undefined)} > Cancel </button> </div> </form> ) : ( <button className="record-select" onClick={() => setSelectedRoleId(role.id)} > <strong>{role.label}</strong> <span> {role.description \|\| "No description"} · {role.status} {role.isBuiltIn ? " · built-in" : ""} </span> </button> )} {editingRoleId !== role.id && ( <div className="action-row"> <button onClick={() => { setEditingRoleId(role.id); setEditDraft({ label: role.label, description: role.description, }); }} > Edit </button> <button className="danger-action" disabled={role.id === "admin" \|\| role.status === "archived"} title={ role.id === "admin" ? "Owner/Admin cannot be archived" : undefined } onClick={() => { if (!window.confirm(`Archive role "${role.label}"?`)) return; commit((current) => archiveDemoRole(current, role.id), { stream: "feature", level: "warning", area: "Administration", feature: "Roles & Page Access", message: `Role "${role.label}" archived`, userId: String(actingUser.id), userName: actingUser.name, }); if (selectedRoleId === role.id) setSelectedRoleId(undefined); }} > Archive </button> </div> )} </div> ))} {roles.length === 0 && ( <div className="list-empty"> <h3>No matching roles</h3> <FilterClearButton onClick={() => { setSearch(""); setStatusFilter("ALL"); setPage(1); }} label="Clear filters" /> </div> )} </div> <div className="desk-panel page-access-panel"> {!selectedRole ? ( <p className="empty-state">Select a role to manage page access.</p> ) : ( <> <PanelTitle icon={<Sliders />} title={`Page Access · ${selectedRole.label}`} subtitle={ isOwnerRole ? "Admin Console access is always protected for Owner/Admin" : "Grouped by navigation area" } /> <div className="store-filter-grid"> <label className="list-search"> Search pages <input value={pageSearch} onChange={(event) => setPageSearch(event.target.value)} placeholder="Page name" /> </label> <div className="action-row"> <button onClick={() => setDraftPages( isOwnerRole ? [...ALL_PAGE_KEYS] : [...ALL_PAGE_KEYS], ) } > Select All </button> <button onClick={() => setDraftPages(isOwnerRole ? ["admin-console"] : []) } > Clear All </button> <button onClick={() => setDraftPages(savedPages)} disabled={!dirty} > Reset to Saved </button> <button className="primary-action" disabled={!dirty} onClick={() => { commit( (current) => updateRolePageAccess( current, selectedRole.id, draftPages, ), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Page access saved for "${selectedRole.label}"`, userId: String(actingUser.id), userName: actingUser.name, referenceId: selectedRole.id, }, ); }} > Save Changes </button> </div> </div> <div className="page-access-groups"> {filteredGroups.map((group) => ( <GroupFieldset key={group.key} group={group} draftPages={draftPages} isOwnerRole={isOwnerRole} onToggleGroup={toggleGroup} onTogglePage={togglePage} /> ))} </div> <div className="nav-preview"> <strong>Navigation preview</strong> <div className="nav-preview-pills"> {draftPages.length === 0 ? ( <span className="empty-state">No pages granted.</span> ) : ( ADMIN_PAGE_GROUPS.flatMap((group) => group.pages) .filter((page) => draftPages.includes(page.key)) .map((page) => ( <span className="category-badge" key={page.key}> {page.label} </span> )) )} </div> </div> </> )} </div> </div> <ResultPagination page={pagedRoles.page} pageCount={pagedRoles.pageCount} onChange={setPage} /> 

### ACT-admin-console-tsx-827

Component: RolesPageAccessTab Â· src/admin-console.tsx:827-834

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="primary-action"
          onClick={() => {
            setNewRole({ label: "", description: "" });
            setFormError("");
            setCreating(true);
          }}
        >
```

Content/label expression: Add Role 

### STATE-admin-console-tsx-840

Component: RolesPageAccessTab Â· src/admin-console.tsx:840-844

Tag: Dialog; visibility: creating

```tsx
<Dialog
          title="Add Role"
          subtitle="Session-only demo role"
          onClose={() => setCreating(false)}
        >
```

Content/label expression:  <form onSubmit={(event) => { event.preventDefault(); try { commit((current) => addDemoRole(current, newRole), { stream: "feature", level: "info", area: "Administration", feature: "Roles & Page Access", message: `Role "${newRole.label.trim()}" created`, userId: String(actingUser.id), userName: actingUser.name, }); setCreating(false); } catch (error) { setFormError( error instanceof Error ? error.message : "Could not create role.", ); } }} > <label> Role name <input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) } /> </label> <label> Description <input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) } /> </label> {formError && <p className="error-text">{formError}</p>} <div className="action-row"> <button className="primary-action">Save Role</button> <button type="button" onClick={() => setCreating(false)}> Cancel </button> </div> </form> 

### FORM-admin-console-tsx-845

Component: RolesPageAccessTab Â· src/admin-console.tsx:845-867

Tag: form; visibility: creating

```tsx
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
```

Content/label expression:  <label> Role name <input required value={newRole.label} onChange={(event) => setNewRole({ ...newRole, label: event.target.value }) } /> </label> <label> Description <input value={newRole.description} onChange={(event) => setNewRole({ ...newRole, description: event.target.value }) } /> </label> {formError && <p className="error-text">{formError}</p>} <div className="action-row"> <button className="primary-action">Save Role</button> <button type="button" onClick={() => setCreating(false)}> Cancel </button> </div> 

### ACT-admin-console-tsx-870

Component: RolesPageAccessTab Â· src/admin-console.tsx:870-876

Tag: input; visibility: creating

```tsx
<input
                required
                value={newRole.label}
                onChange={(event) =>
                  setNewRole({ ...newRole, label: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-880

Component: RolesPageAccessTab Â· src/admin-console.tsx:880-885

Tag: input; visibility: creating

```tsx
<input
                value={newRole.description}
                onChange={(event) =>
                  setNewRole({ ...newRole, description: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-889

Component: RolesPageAccessTab Â· src/admin-console.tsx:889-889

Tag: button; visibility: creating

```tsx
<button className="primary-action">
```

Content/label expression: Save Role

### ACT-admin-console-tsx-890

Component: RolesPageAccessTab Â· src/admin-console.tsx:890-890

Tag: button; visibility: creating

```tsx
<button type="button" onClick={() => setCreating(false)}>
```

Content/label expression: Cancel 

### ACT-admin-console-tsx-901

Component: RolesPageAccessTab Â· src/admin-console.tsx:901-909

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search roles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Role name or description"
          />
```

Content/label expression: 

### ACT-admin-console-tsx-913

Component: RolesPageAccessTab Â· src/admin-console.tsx:913-920

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Filter roles by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All statuses</option> <option value="active">Active</option> <option value="archived">Archived</option> 

### ACT-admin-console-tsx-926

Component: RolesPageAccessTab Â· src/admin-console.tsx:926-932

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
          onClear={() => {
            setSearch("");
            setStatusFilter("ALL");
            setPage(1);
          }}
        />
```

Content/label expression: 

### ACT-admin-console-tsx-934

Component: RolesPageAccessTab Â· src/admin-console.tsx:934-960

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-936

Component: RolesPageAccessTab Â· src/admin-console.tsx:936-946

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### FORM-admin-console-tsx-970

Component: RolesPageAccessTab Â· src/admin-console.tsx:970-997

Tag: form; visibility: editingRoleId === role.id

```tsx
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
```

Content/label expression:  <input required value={editDraft.label} onChange={(event) => setEditDraft({ ...editDraft, label: event.target.value }) } /> <input value={editDraft.description} onChange={(event) => setEditDraft({ ...editDraft, description: event.target.value, }) } placeholder="Description" /> <div className="action-row"> <button className="primary-action">Save</button> <button type="button" onClick={() => setEditingRoleId(undefined)} > Cancel </button> </div> 

### ACT-admin-console-tsx-998

Component: RolesPageAccessTab Â· src/admin-console.tsx:998-1004

Tag: input; visibility: editingRoleId === role.id

```tsx
<input
                    required
                    value={editDraft.label}
                    onChange={(event) =>
                      setEditDraft({ ...editDraft, label: event.target.value })
                    }
                  />
```

Content/label expression: 

### ACT-admin-console-tsx-1005

Component: RolesPageAccessTab Â· src/admin-console.tsx:1005-1014

Tag: input; visibility: editingRoleId === role.id

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1016

Component: RolesPageAccessTab Â· src/admin-console.tsx:1016-1016

Tag: button; visibility: editingRoleId === role.id

```tsx
<button className="primary-action">
```

Content/label expression: Save

### ACT-admin-console-tsx-1017

Component: RolesPageAccessTab Â· src/admin-console.tsx:1017-1020

Tag: button; visibility: editingRoleId === role.id

```tsx
<button
                      type="button"
                      onClick={() => setEditingRoleId(undefined)}
                    >
```

Content/label expression: Cancel 

### ACT-admin-console-tsx-1026

Component: RolesPageAccessTab Â· src/admin-console.tsx:1026-1029

Tag: button; visibility: editingRoleId === role.id

```tsx
<button
                  className="record-select"
                  onClick={() => setSelectedRoleId(role.id)}
                >
```

Content/label expression:  <strong>{role.label}</strong> <span> {role.description \|\| "No description"} · {role.status} {role.isBuiltIn ? " · built-in" : ""} </span> 

### ACT-admin-console-tsx-1039

Component: RolesPageAccessTab Â· src/admin-console.tsx:1039-1047

Tag: button; visibility: editingRoleId !== role.id

```tsx
<button
                    onClick={() => {
                      setEditingRoleId(role.id);
                      setEditDraft({
                        label: role.label,
                        description: role.description,
                      });
                    }}
                  >
```

Content/label expression: Edit 

### ACT-admin-console-tsx-1050

Component: RolesPageAccessTab Â· src/admin-console.tsx:1050-1073

Tag: button; visibility: editingRoleId !== role.id

```tsx
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
```

Content/label expression: Archive 

### ACT-admin-console-tsx-1083

Component: RolesPageAccessTab Â· src/admin-console.tsx:1083-1090

Tag: FilterClearButton; visibility: roles.length === 0

```tsx
<FilterClearButton
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPage(1);
                }}
                label="Clear filters"
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1112

Component: RolesPageAccessTab Â· src/admin-console.tsx:1112-1116

Tag: input; visibility: !selectedRole

```tsx
<input
                    value={pageSearch}
                    onChange={(event) => setPageSearch(event.target.value)}
                    placeholder="Page name"
                  />
```

Content/label expression: 

### ACT-admin-console-tsx-1119

Component: RolesPageAccessTab Â· src/admin-console.tsx:1119-1125

Tag: button; visibility: !selectedRole

```tsx
<button
                    onClick={() =>
                      setDraftPages(
                        isOwnerRole ? [...ALL_PAGE_KEYS] : [...ALL_PAGE_KEYS],
                      )
                    }
                  >
```

Content/label expression: Select All 

### ACT-admin-console-tsx-1128

Component: RolesPageAccessTab Â· src/admin-console.tsx:1128-1132

Tag: button; visibility: !selectedRole

```tsx
<button
                    onClick={() =>
                      setDraftPages(isOwnerRole ? ["admin-console"] : [])
                    }
                  >
```

Content/label expression: Clear All 

### ACT-admin-console-tsx-1135

Component: RolesPageAccessTab Â· src/admin-console.tsx:1135-1138

Tag: button; visibility: !selectedRole

```tsx
<button
                    onClick={() => setDraftPages(savedPages)}
                    disabled={!dirty}
                  >
```

Content/label expression: Reset to Saved 

### ACT-admin-console-tsx-1141

Component: RolesPageAccessTab Â· src/admin-console.tsx:1141-1164

Tag: button; visibility: !selectedRole

```tsx
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
```

Content/label expression: Save Changes 

### ACT-admin-console-tsx-1171

Component: RolesPageAccessTab Â· src/admin-console.tsx:1171-1178

Tag: GroupFieldset; visibility: !selectedRole

```tsx
<GroupFieldset
                    key={group.key}
                    group={group}
                    draftPages={draftPages}
                    isOwnerRole={isOwnerRole}
                    onToggleGroup={toggleGroup}
                    onTogglePage={togglePage}
                  />
```

Content/label expression: 

### ACT-admin-console-tsx-1201

Component: RolesPageAccessTab Â· src/admin-console.tsx:1201-1205

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={pagedRoles.page}
        pageCount={pagedRoles.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### ACT-admin-console-tsx-1236

Component: GroupFieldset Â· src/admin-console.tsx:1236-1241

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            ref={groupRef}
            type="checkbox"
            checked={allChecked}
            onChange={() => onToggleGroup(keys, !allChecked)}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-1256

Component: GroupFieldset Â· src/admin-console.tsx:1256-1261

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              type="checkbox"
              checked={draftPages.includes(page.key)}
              disabled={locked}
              onChange={() => onTogglePage(page.key)}
            />
```

Content/label expression: 

### STATE-admin-console-tsx-1313

Component: AppThemeTab Â· src/admin-console.tsx:1313-1313

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel app-theme-tab" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <div> <h3>App Theme</h3> <p> Changes apply to the live application after saving; generated documents keep their own template styling. </p> </div> <div className="action-row"> <button onClick={() => { setDraft(adminState.appTheme); setJustSaved(false); }} disabled={!dirty} > Reset to Saved </button> <button onClick={() => { setDraft({ ...DEFAULT_APP_THEME }); setJustSaved(false); }} > Set to Default </button> <button className="primary-action" onClick={save} disabled={!dirty}> Save App Theme </button> </div> </div> {justSaved && !dirty && ( <p className="save-confirmation">App theme saved for this session.</p> )} {dirty && ( <p className="unsaved-note"> Previewing unsaved changes. Save App Theme to apply them globally. </p> )} <div className="app-theme-layout"> <div className="app-theme-controls"> <SearchSelect label="Application font" options={APP_THEME_FONTS.map((item) => ({ value: item.id, label: item.label, }))} value={draft.fontId} onChange={(fontId) => { setDraft((current) => ({ ...current, fontId: fontId as AppTheme["fontId"], })); setJustSaved(false); }} placeholder="Search fonts..." /> <fieldset className="palette-picker"> <legend>Color palette</legend> <div className="palette-options"> {APP_THEME_PALETTES.map((item) => ( <button type="button" key={item.id} className={`palette-option${draft.paletteId === item.id ? " selected" : ""}`} aria-pressed={draft.paletteId === item.id} onClick={() => { setDraft((current) => ({ ...current, paletteId: item.id })); setJustSaved(false); }} > <span className="palette-swatch" style={{ background: item.tokens.sidebar, borderColor: item.tokens.sidebarBorder, }} > <i style={{ background: item.tokens.active }} /> <i style={{ background: item.tokens.tableHeader }} /> <i style={{ background: item.tokens.accent }} /> </span> <span>{item.label}</span> </button> ))} </div> </fieldset> </div> <section className="app-theme-preview" style={{ fontFamily: font.cssFamily, background: palette.tokens.background, ["--preview-sidebar" as string]: palette.tokens.sidebar, ["--preview-active" as string]: palette.tokens.active, ["--preview-accent" as string]: palette.tokens.accent, ["--preview-header" as string]: palette.tokens.tableHeader, }} aria-label="App theme preview" > <aside> <strong>WorkshopOS</strong> <span className="preview-menu-active">Dashboard</span> <span>Job Cards</span> </aside> <div> <h2>Theme preview</h2> <label> Customer name <input value="Aarav Motors" readOnly /> </label> <div className="preview-tabs"> <button className="active">Overview</button> <button>History</button> </div> <div className="preview-selected-row">Selected job row</div> <table> <thead> <tr> <th>Job Card</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td>JC-2026-002144</td> <td>In progress</td> </tr> </tbody> </table> </div> </section> </div> 

### ACT-admin-console-tsx-1323

Component: AppThemeTab Â· src/admin-console.tsx:1323-1329

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            onClick={() => {
              setDraft(adminState.appTheme);
              setJustSaved(false);
            }}
            disabled={!dirty}
          >
```

Content/label expression: Reset to Saved 

### ACT-admin-console-tsx-1332

Component: AppThemeTab Â· src/admin-console.tsx:1332-1337

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            onClick={() => {
              setDraft({ ...DEFAULT_APP_THEME });
              setJustSaved(false);
            }}
          >
```

Content/label expression: Set to Default 

### ACT-admin-console-tsx-1340

Component: AppThemeTab Â· src/admin-console.tsx:1340-1340

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={save} disabled={!dirty}>
```

Content/label expression: Save App Theme 

### ACT-admin-console-tsx-1355

Component: AppThemeTab Â· src/admin-console.tsx:1355-1370

Tag: SearchSelect; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1375

Component: AppThemeTab Â· src/admin-console.tsx:1375-1384

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <span className="palette-swatch" style={{ background: item.tokens.sidebar, borderColor: item.tokens.sidebarBorder, }} > <i style={{ background: item.tokens.active }} /> <i style={{ background: item.tokens.tableHeader }} /> <i style={{ background: item.tokens.accent }} /> </span> <span>{item.label}</span> 

### ACT-admin-console-tsx-1423

Component: AppThemeTab Â· src/admin-console.tsx:1423-1423

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value="Aarav Motors" readOnly />
```

Content/label expression: 

### ACT-admin-console-tsx-1426

Component: AppThemeTab Â· src/admin-console.tsx:1426-1426

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="active">
```

Content/label expression: Overview

### ACT-admin-console-tsx-1427

Component: AppThemeTab Â· src/admin-console.tsx:1427-1427

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button>
```

Content/label expression: History

### STATE-admin-console-tsx-1564

Component: BusinessSettingsTab Â· src/admin-console.tsx:1564-1564

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Business Settings</h3> <div className="action-row"> <button onClick={reset} disabled={!dirty}> Reset to Saved </button> <button className="primary-action" onClick={save} disabled={!dirty}> Save Settings </button> </div> </div> {errors.length > 0 && ( <div className="api-error" role="alert"> {errors.map((message) => ( <p key={message}>{message}</p> ))} </div> )} {justSaved && !dirty && ( <p className="save-confirmation">Settings saved for this session.</p> )} {dirty && <p className="unsaved-note">Unsaved changes.</p>} <div className="sub-tabs" role="tablist" aria-label="Business settings sections" > {SETTINGS_GROUPS.map((group) => ( <button key={group.key} role="tab" aria-selected={subTab === group.key} className={subTab === group.key ? "active" : ""} onClick={() => setSubTab(group.key)} > {group.label} </button> ))} </div> {subTab === "profile" && ( <div className="form-grid"> <label> Business name <input value={draft.profile.businessName} onChange={(event) => setField("profile", "businessName", event.target.value) } /> </label> <label> Legal name <input value={draft.profile.legalName} onChange={(event) => setField("profile", "legalName", event.target.value) } /> </label> <label> Phone <input value={draft.profile.phone} onChange={(event) => setField("profile", "phone", event.target.value) } /> </label> <label> Email <input type="email" value={draft.profile.email} onChange={(event) => setField("profile", "email", event.target.value) } /> </label> <label> Address <input value={draft.profile.address} onChange={(event) => setField("profile", "address", event.target.value) } /> </label> <label> Timezone <input value={draft.profile.timezone} onChange={(event) => setField("profile", "timezone", event.target.value) } /> </label> <label> Currency <input value={draft.profile.currency} onChange={(event) => setField("profile", "currency", event.target.value) } /> </label> </div> )} {subTab === "branch" && ( <> <div className="form-grid"> <label> Branch name <input value={draft.branch.name} onChange={(event) => setField("branch", "name", event.target.value) } /> </label> <label> Opening time <input type="time" value={draft.branch.openingTime} onChange={(event) => setField("branch", "openingTime", event.target.value) } /> </label> <label> Closing time <input type="time" value={draft.branch.closingTime} onChange={(event) => setField("branch", "closingTime", event.target.value) } /> </label> <label> Holiday behavior <select value={draft.branch.holidayBehavior} onChange={(event) => setField( "branch", "holidayBehavior", event.target .value as WorkshopBusinessSettings["branch"]["holidayBehavior"], ) } > <option value="closed">Closed</option> <option value="appointment-only">Appointment only</option> </select> </label> </div> <fieldset className="assignment-fieldset"> <legend>Working days</legend> {WEEKDAYS.map((day) => ( <label key={day}> <input type="checkbox" checked={draft.branch.workingDays.includes(day)} onChange={() => toggleListValue("branch", "workingDays", day)} /> {day} </label> ))} </fieldset> </> )} {subTab === "jobs" && ( <div className="form-grid"> <label> Job number prefix <input value={draft.jobs.jobNumberPrefix} onChange={(event) => setField("jobs", "jobNumberPrefix", event.target.value) } /> </label> <label> Default promised hours <input type="number" min={1} value={draft.jobs.defaultPromisedHours} onChange={(event) => setField( "jobs", "defaultPromisedHours", Number(event.target.value), ) } /> </label> <label> <input type="checkbox" checked={draft.jobs.requireQc} onChange={(event) => setField("jobs", "requireQc", event.target.checked) } />{" "} Require QC before closure </label> <label> <input type="checkbox" checked={draft.jobs.washingDefault} onChange={(event) => setField("jobs", "washingDefault", event.target.checked) } />{" "} Washing needed by default </label> <label> <input type="checkbox" checked={draft.jobs.autoCloseAfterDelivery} onChange={(event) => setField("jobs", "autoCloseAfterDelivery", event.target.checked) } />{" "} Auto-close after delivery </label> </div> )} {subTab === "pricing" && ( <div className="form-grid"> <label> Estimate validity (days) <input type="number" min={1} value={draft.pricing.estimateValidityDays} onChange={(event) => setField( "pricing", "estimateValidityDays", Number(event.target.value), ) } /> </label> <label> Default labour rate <input type="number" min={0} value={draft.pricing.defaultLabourRate} onChange={(event) => setField( "pricing", "defaultLabourRate", Number(event.target.value), ) } /> </label> <label> Discount approval threshold (%) <input type="number" min={0} max={100} value={draft.pricing.discountApprovalPercent} onChange={(event) => setField( "pricing", "discountApprovalPercent", Number(event.target.value), ) } /> </label> <label> <input type="checkbox" checked={draft.pricing.requireEstimateApproval} onChange={(event) => setField( "pricing", "requireEstimateApproval", event.target.checked, ) } />{" "} Require estimate approval </label> </div> )} {subTab === "billing" && ( <> <div className="form-grid"> <label> GSTIN <input aria-label="GSTIN" value={draft.billing.gstin} onChange={(event) => setField("billing", "gstin", event.target.value) } /> </label> <label> Account holder <input aria-label="Account holder" value={draft.billing.bankAccountHolder} onChange={(event) => setField("billing", "bankAccountHolder", event.target.value) } /> </label> <label> Bank name <input aria-label="Bank name" value={draft.billing.bankName} onChange={(event) => setField("billing", "bankName", event.target.value) } /> </label> <label> Account number <input aria-label="Account number" inputMode="numeric" value={draft.billing.bankAccountNumber} onChange={(event) => setField("billing", "bankAccountNumber", event.target.value) } /> </label> <label> IFSC <input aria-label="IFSC" value={draft.billing.bankIfsc} onChange={(event) => setField("billing", "bankIfsc", event.target.value) } /> </label> <label> Branch <input aria-label="Bank branch" value={draft.billing.bankBranch} onChange={(event) => setField("billing", "bankBranch", event.target.value) } /> </label> <label> UPI ID <input aria-label="UPI ID" value={draft.billing.upiId} onChange={(event) => setField("billing", "upiId", event.target.value) } /> </label> <label> Default GST % <input type="number" min={0} max={100} value={draft.billing.defaultGstPercent} onChange={(event) => setField( "billing", "defaultGstPercent", Number(event.target.value), ) } /> </label> <label> Invoice prefix <input value={draft.billing.invoicePrefix} onChange={(event) => setField("billing", "invoicePrefix", event.target.value) } /> </label> <label> Receipt prefix <input value={draft.billing.receiptPrefix} onChange={(event) => setField("billing", "receiptPrefix", event.target.value) } /> </label> <label> Gate pass prefix <input value={draft.billing.gatePassPrefix} onChange={(event) => setField("billing", "gatePassPrefix", event.target.value) } /> </label> </div> <fieldset className="assignment-fieldset"> <legend>Accepted payment modes</legend> {PAYMENT_MODE_OPTIONS.map((mode) => ( <label key={mode}> <input type="checkbox" checked={draft.billing.paymentModes.includes(mode)} onChange={() => toggleListValue("billing", "paymentModes", mode) } /> {mode} </label> ))} </fieldset> </> )} {subTab === "inventory" && ( <div className="form-grid"> <label> Default unit <input value={draft.inventory.defaultUnit} onChange={(event) => setField("inventory", "defaultUnit", event.target.value) } /> </label> <label> <input type="checkbox" checked={draft.inventory.lowStockNotifications} onChange={(event) => setField( "inventory", "lowStockNotifications", event.target.checked, ) } />{" "} Low-stock notifications </label> <label> <input type="checkbox" checked={draft.inventory.requireAdjustmentReason} onChange={(event) => setField( "inventory", "requireAdjustmentReason", event.target.checked, ) } />{" "} Require a reason for stock adjustments </label> </div> )} {subTab === "notifications" && ( <> <fieldset className="assignment-fieldset"> <legend>Customer update channels</legend> {NOTIFICATION_CHANNEL_OPTIONS.map((channel) => ( <label key={channel}> <input type="checkbox" checked={draft.notifications.customerChannels.includes( channel, )} onChange={() => toggleListValue( "notifications", "customerChannels", channel, ) } /> {channel} </label> ))} </fieldset> <div className="form-grid"> <label> Document header <input value={draft.notifications.documentHeader} onChange={(event) => setField( "notifications", "documentHeader", event.target.value, ) } /> </label> <label> Estimate template <input value={draft.notifications.estimateTemplate} onChange={(event) => setField( "notifications", "estimateTemplate", event.target.value, ) } /> </label> <label> Invoice template <input value={draft.notifications.invoiceTemplate} onChange={(event) => setField( "notifications", "invoiceTemplate", event.target.value, ) } /> </label> </div> <p className="field-help"> Available placeholders: {"{{jobCardNo}}"}, {"{{vehicleRegistrationNo}}"}, {"{{serviceAdvisorName}}"}, and {"{{workshopName}}"}. </p> <div className="form-grid"> <label> Job-card creation WhatsApp template <textarea rows={3} value={draft.notifications.jobCardCreatedWhatsAppTemplate} onChange={(event) => setField( "notifications", "jobCardCreatedWhatsAppTemplate", event.target.value, ) } /> </label> <label> Job-card creation email template <textarea rows={3} value={draft.notifications.jobCardCreatedEmailTemplate} onChange={(event) => setField( "notifications", "jobCardCreatedEmailTemplate", event.target.value, ) } /> </label> <label> Job-card closure WhatsApp template <textarea rows={3} value={draft.notifications.jobCardClosedWhatsAppTemplate} onChange={(event) => setField( "notifications", "jobCardClosedWhatsAppTemplate", event.target.value, ) } /> </label> <label> Job-card closure email template <textarea rows={3} value={draft.notifications.jobCardClosedEmailTemplate} onChange={(event) => setField( "notifications", "jobCardClosedEmailTemplate", event.target.value, ) } /> </label> </div> </> )} 

### ACT-admin-console-tsx-1568

Component: BusinessSettingsTab Â· src/admin-console.tsx:1568-1568

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button onClick={reset} disabled={!dirty}>
```

Content/label expression: Reset to Saved 

### ACT-admin-console-tsx-1571

Component: BusinessSettingsTab Â· src/admin-console.tsx:1571-1571

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={save} disabled={!dirty}>
```

Content/label expression: Save Settings 

### STATE-admin-console-tsx-1577

Component: BusinessSettingsTab Â· src/admin-console.tsx:1577-1577

Tag: div; visibility: errors.length > 0

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  {errors.map((message) => ( <p key={message}>{message}</p> ))} 

### STATE-admin-console-tsx-1587

Component: BusinessSettingsTab Â· src/admin-console.tsx:1587-1591

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
        className="sub-tabs"
        role="tablist"
        aria-label="Business settings sections"
      >
```

Content/label expression:  {SETTINGS_GROUPS.map((group) => ( <button key={group.key} role="tab" aria-selected={subTab === group.key} className={subTab === group.key ? "active" : ""} onClick={() => setSubTab(group.key)} > {group.label} </button> ))} 

### STATE-admin-console-tsx-1593

Component: BusinessSettingsTab Â· src/admin-console.tsx:1593-1599

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            key={group.key}
            role="tab"
            aria-selected={subTab === group.key}
            className={subTab === group.key ? "active" : ""}
            onClick={() => setSubTab(group.key)}
          >
```

Content/label expression:  {group.label} 

### ACT-admin-console-tsx-1609

Component: BusinessSettingsTab Â· src/admin-console.tsx:1609-1614

Tag: input; visibility: subTab === "profile"

```tsx
<input
              value={draft.profile.businessName}
              onChange={(event) =>
                setField("profile", "businessName", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1618

Component: BusinessSettingsTab Â· src/admin-console.tsx:1618-1623

Tag: input; visibility: subTab === "profile"

```tsx
<input
              value={draft.profile.legalName}
              onChange={(event) =>
                setField("profile", "legalName", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1627

Component: BusinessSettingsTab Â· src/admin-console.tsx:1627-1632

Tag: input; visibility: subTab === "profile"

```tsx
<input
              value={draft.profile.phone}
              onChange={(event) =>
                setField("profile", "phone", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1636

Component: BusinessSettingsTab Â· src/admin-console.tsx:1636-1642

Tag: input; visibility: subTab === "profile"

```tsx
<input
              type="email"
              value={draft.profile.email}
              onChange={(event) =>
                setField("profile", "email", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1646

Component: BusinessSettingsTab Â· src/admin-console.tsx:1646-1651

Tag: input; visibility: subTab === "profile"

```tsx
<input
              value={draft.profile.address}
              onChange={(event) =>
                setField("profile", "address", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1655

Component: BusinessSettingsTab Â· src/admin-console.tsx:1655-1660

Tag: input; visibility: subTab === "profile"

```tsx
<input
              value={draft.profile.timezone}
              onChange={(event) =>
                setField("profile", "timezone", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1664

Component: BusinessSettingsTab Â· src/admin-console.tsx:1664-1669

Tag: input; visibility: subTab === "profile"

```tsx
<input
              value={draft.profile.currency}
              onChange={(event) =>
                setField("profile", "currency", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1678

Component: BusinessSettingsTab Â· src/admin-console.tsx:1678-1683

Tag: input; visibility: subTab === "branch"

```tsx
<input
                value={draft.branch.name}
                onChange={(event) =>
                  setField("branch", "name", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1687

Component: BusinessSettingsTab Â· src/admin-console.tsx:1687-1693

Tag: input; visibility: subTab === "branch"

```tsx
<input
                type="time"
                value={draft.branch.openingTime}
                onChange={(event) =>
                  setField("branch", "openingTime", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1697

Component: BusinessSettingsTab Â· src/admin-console.tsx:1697-1703

Tag: input; visibility: subTab === "branch"

```tsx
<input
                type="time"
                value={draft.branch.closingTime}
                onChange={(event) =>
                  setField("branch", "closingTime", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1707

Component: BusinessSettingsTab Â· src/admin-console.tsx:1707-1717

Tag: select; visibility: subTab === "branch"

```tsx
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
```

Content/label expression:  <option value="closed">Closed</option> <option value="appointment-only">Appointment only</option> 

### ACT-admin-console-tsx-1727

Component: BusinessSettingsTab Â· src/admin-console.tsx:1727-1731

Tag: input; visibility: subTab === "branch"

```tsx
<input
                  type="checkbox"
                  checked={draft.branch.workingDays.includes(day)}
                  onChange={() => toggleListValue("branch", "workingDays", day)}
                />
```

Content/label expression: 

### ACT-admin-console-tsx-1742

Component: BusinessSettingsTab Â· src/admin-console.tsx:1742-1747

Tag: input; visibility: subTab === "jobs"

```tsx
<input
              value={draft.jobs.jobNumberPrefix}
              onChange={(event) =>
                setField("jobs", "jobNumberPrefix", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1751

Component: BusinessSettingsTab Â· src/admin-console.tsx:1751-1762

Tag: input; visibility: subTab === "jobs"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1765

Component: BusinessSettingsTab Â· src/admin-console.tsx:1765-1771

Tag: input; visibility: subTab === "jobs"

```tsx
<input
              type="checkbox"
              checked={draft.jobs.requireQc}
              onChange={(event) =>
                setField("jobs", "requireQc", event.target.checked)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1775

Component: BusinessSettingsTab Â· src/admin-console.tsx:1775-1781

Tag: input; visibility: subTab === "jobs"

```tsx
<input
              type="checkbox"
              checked={draft.jobs.washingDefault}
              onChange={(event) =>
                setField("jobs", "washingDefault", event.target.checked)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1785

Component: BusinessSettingsTab Â· src/admin-console.tsx:1785-1791

Tag: input; visibility: subTab === "jobs"

```tsx
<input
              type="checkbox"
              checked={draft.jobs.autoCloseAfterDelivery}
              onChange={(event) =>
                setField("jobs", "autoCloseAfterDelivery", event.target.checked)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1800

Component: BusinessSettingsTab Â· src/admin-console.tsx:1800-1811

Tag: input; visibility: subTab === "pricing"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1815

Component: BusinessSettingsTab Â· src/admin-console.tsx:1815-1826

Tag: input; visibility: subTab === "pricing"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1830

Component: BusinessSettingsTab Â· src/admin-console.tsx:1830-1842

Tag: input; visibility: subTab === "pricing"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1845

Component: BusinessSettingsTab Â· src/admin-console.tsx:1845-1855

Tag: input; visibility: subTab === "pricing"

```tsx
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
            />
```

Content/label expression: 

### ACT-admin-console-tsx-1865

Component: BusinessSettingsTab Â· src/admin-console.tsx:1865-1871

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="GSTIN"
                value={draft.billing.gstin}
                onChange={(event) =>
                  setField("billing", "gstin", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1875

Component: BusinessSettingsTab Â· src/admin-console.tsx:1875-1881

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="Account holder"
                value={draft.billing.bankAccountHolder}
                onChange={(event) =>
                  setField("billing", "bankAccountHolder", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1885

Component: BusinessSettingsTab Â· src/admin-console.tsx:1885-1891

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="Bank name"
                value={draft.billing.bankName}
                onChange={(event) =>
                  setField("billing", "bankName", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1895

Component: BusinessSettingsTab Â· src/admin-console.tsx:1895-1902

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="Account number"
                inputMode="numeric"
                value={draft.billing.bankAccountNumber}
                onChange={(event) =>
                  setField("billing", "bankAccountNumber", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1906

Component: BusinessSettingsTab Â· src/admin-console.tsx:1906-1912

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="IFSC"
                value={draft.billing.bankIfsc}
                onChange={(event) =>
                  setField("billing", "bankIfsc", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1916

Component: BusinessSettingsTab Â· src/admin-console.tsx:1916-1922

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="Bank branch"
                value={draft.billing.bankBranch}
                onChange={(event) =>
                  setField("billing", "bankBranch", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1926

Component: BusinessSettingsTab Â· src/admin-console.tsx:1926-1932

Tag: input; visibility: subTab === "billing"

```tsx
<input
                aria-label="UPI ID"
                value={draft.billing.upiId}
                onChange={(event) =>
                  setField("billing", "upiId", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1936

Component: BusinessSettingsTab Â· src/admin-console.tsx:1936-1948

Tag: input; visibility: subTab === "billing"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-1952

Component: BusinessSettingsTab Â· src/admin-console.tsx:1952-1957

Tag: input; visibility: subTab === "billing"

```tsx
<input
                value={draft.billing.invoicePrefix}
                onChange={(event) =>
                  setField("billing", "invoicePrefix", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1961

Component: BusinessSettingsTab Â· src/admin-console.tsx:1961-1966

Tag: input; visibility: subTab === "billing"

```tsx
<input
                value={draft.billing.receiptPrefix}
                onChange={(event) =>
                  setField("billing", "receiptPrefix", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1970

Component: BusinessSettingsTab Â· src/admin-console.tsx:1970-1975

Tag: input; visibility: subTab === "billing"

```tsx
<input
                value={draft.billing.gatePassPrefix}
                onChange={(event) =>
                  setField("billing", "gatePassPrefix", event.target.value)
                }
              />
```

Content/label expression: 

### ACT-admin-console-tsx-1982

Component: BusinessSettingsTab Â· src/admin-console.tsx:1982-1988

Tag: input; visibility: subTab === "billing"

```tsx
<input
                  type="checkbox"
                  checked={draft.billing.paymentModes.includes(mode)}
                  onChange={() =>
                    toggleListValue("billing", "paymentModes", mode)
                  }
                />
```

Content/label expression: 

### ACT-admin-console-tsx-1999

Component: BusinessSettingsTab Â· src/admin-console.tsx:1999-2004

Tag: input; visibility: subTab === "inventory"

```tsx
<input
              value={draft.inventory.defaultUnit}
              onChange={(event) =>
                setField("inventory", "defaultUnit", event.target.value)
              }
            />
```

Content/label expression: 

### ACT-admin-console-tsx-2007

Component: BusinessSettingsTab Â· src/admin-console.tsx:2007-2017

Tag: input; visibility: subTab === "inventory"

```tsx
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
            />
```

Content/label expression: 

### ACT-admin-console-tsx-2021

Component: BusinessSettingsTab Â· src/admin-console.tsx:2021-2031

Tag: input; visibility: subTab === "inventory"

```tsx
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
            />
```

Content/label expression: 

### ACT-admin-console-tsx-2042

Component: BusinessSettingsTab Â· src/admin-console.tsx:2042-2054

Tag: input; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2062

Component: BusinessSettingsTab Â· src/admin-console.tsx:2062-2071

Tag: input; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2075

Component: BusinessSettingsTab Â· src/admin-console.tsx:2075-2084

Tag: input; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2088

Component: BusinessSettingsTab Â· src/admin-console.tsx:2088-2097

Tag: input; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2107

Component: BusinessSettingsTab Â· src/admin-console.tsx:2107-2117

Tag: textarea; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2121

Component: BusinessSettingsTab Â· src/admin-console.tsx:2121-2131

Tag: textarea; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2135

Component: BusinessSettingsTab Â· src/admin-console.tsx:2135-2145

Tag: textarea; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2149

Component: BusinessSettingsTab Â· src/admin-console.tsx:2149-2159

Tag: textarea; visibility: subTab === "notifications"

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2248

Component: CompanyImageField Â· src/admin-console.tsx:2248-2254

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => choose(event.target.files?.[0])}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2256

Component: CompanyImageField Â· src/admin-console.tsx:2256-2264

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          type="button"
          disabled={!value}
          onClick={() => {
            onError("");
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
```

Content/label expression: Clear 

### STATE-admin-console-tsx-2352

Component: CompanySettingsTab Â· src/admin-console.tsx:2352-2352

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <div> <h3>Company Settings</h3> <p> Single company profile and images merged into every report template. </p> </div> <div className="action-row"> <button type="button" disabled={!dirty} onClick={reset}> Reset to Saved </button> <button type="button" className="primary-action" disabled={!dirty} onClick={save} > Save Company Settings </button> </div> </div> {error && ( <div className="api-error" role="alert"> <p>{error}</p> </div> )} {savedMessage && !dirty && ( <p className="save-confirmation"> Company settings saved for this session. </p> )} {dirty && <p className="unsaved-note">Unsaved changes.</p>} <label> Company name <input value={companyName} onChange={(event) => { setCompanyName(event.target.value); setSavedMessage(false); }} /> </label> <div className="form-grid"> <label> Address <input value={details.address} onChange={(event) => setDetail("address", event.target.value)} /> </label> <label> Phone <input value={details.phone} onChange={(event) => setDetail("phone", event.target.value)} /> </label> <label> Email <input value={details.email} onChange={(event) => setDetail("email", event.target.value)} /> </label> <label> GSTIN <input value={details.gstin} onChange={(event) => setDetail("gstin", event.target.value)} /> </label> <label> Terms / footer <textarea value={details.footer} onChange={(event) => setDetail("footer", event.target.value)} /> </label> </div> <div className="company-assets-grid"> <CompanyImageField label="Company logo" value={assets.logo} onChange={(next) => changeAsset("logo", next)} onError={setError} /> <CompanyImageField label="Company stamp" value={assets.stamp} onChange={(next) => changeAsset("stamp", next)} onError={setError} /> <CompanyImageField label="Authorized signature" value={assets.authorizedSignature} onChange={(next) => changeAsset("authorizedSignature", next)} onError={setError} /> </div> 

### ACT-admin-console-tsx-2361

Component: CompanySettingsTab Â· src/admin-console.tsx:2361-2361

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" disabled={!dirty} onClick={reset}>
```

Content/label expression: Reset to Saved 

### ACT-admin-console-tsx-2364

Component: CompanySettingsTab Â· src/admin-console.tsx:2364-2369

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            className="primary-action"
            disabled={!dirty}
            onClick={save}
          >
```

Content/label expression: Save Company Settings 

### STATE-admin-console-tsx-2375

Component: CompanySettingsTab Â· src/admin-console.tsx:2375-2375

Tag: div; visibility: error

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  <p>{error}</p> 

### ACT-admin-console-tsx-2387

Component: CompanySettingsTab Â· src/admin-console.tsx:2387-2393

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={companyName}
          onChange={(event) => {
            setCompanyName(event.target.value);
            setSavedMessage(false);
          }}
        />
```

Content/label expression: 

### ACT-admin-console-tsx-2398

Component: CompanySettingsTab Â· src/admin-console.tsx:2398-2401

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={details.address}
            onChange={(event) => setDetail("address", event.target.value)}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2405

Component: CompanySettingsTab Â· src/admin-console.tsx:2405-2408

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={details.phone}
            onChange={(event) => setDetail("phone", event.target.value)}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2412

Component: CompanySettingsTab Â· src/admin-console.tsx:2412-2415

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={details.email}
            onChange={(event) => setDetail("email", event.target.value)}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2419

Component: CompanySettingsTab Â· src/admin-console.tsx:2419-2422

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={details.gstin}
            onChange={(event) => setDetail("gstin", event.target.value)}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2426

Component: CompanySettingsTab Â· src/admin-console.tsx:2426-2429

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea
            value={details.footer}
            onChange={(event) => setDetail("footer", event.target.value)}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2433

Component: CompanySettingsTab Â· src/admin-console.tsx:2433-2438

Tag: CompanyImageField; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<CompanyImageField
          label="Company logo"
          value={assets.logo}
          onChange={(next) => changeAsset("logo", next)}
          onError={setError}
        />
```

Content/label expression: 

### ACT-admin-console-tsx-2439

Component: CompanySettingsTab Â· src/admin-console.tsx:2439-2444

Tag: CompanyImageField; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<CompanyImageField
          label="Company stamp"
          value={assets.stamp}
          onChange={(next) => changeAsset("stamp", next)}
          onError={setError}
        />
```

Content/label expression: 

### ACT-admin-console-tsx-2445

Component: CompanySettingsTab Â· src/admin-console.tsx:2445-2450

Tag: CompanyImageField; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<CompanyImageField
          label="Authorized signature"
          value={assets.authorizedSignature}
          onChange={(next) => changeAsset("authorizedSignature", next)}
          onError={setError}
        />
```

Content/label expression: 

### STATE-admin-console-tsx-2617

Component: ReportTemplatesTab Â· src/admin-console.tsx:2617-2617

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel report-template-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <div> <h3>Report Templates</h3> <p> Design sanitized print layouts using the supported placeholders. </p> </div> <div className="action-row"> <button type="button" onClick={() => { if (confirmDiscard()) load(null); }} > New Template </button> <button type="button" disabled={!selectedId} onClick={remove}> Delete Template </button> <button type="button" className="primary-action" disabled={!dirty} onClick={save} > {selectedId ? "Update Template" : "Create Template"} </button> </div> </div> {errors.length > 0 && ( <div className="api-error" role="alert"> {errors.map((message) => ( <p key={message}>{message}</p> ))} </div> )} {justSaved && !dirty && ( <p className="save-confirmation">Template saved for this session.</p> )} {dirty && <p className="unsaved-note">Unsaved changes.</p>} <div className="template-selectors form-grid"> <label> Report category <select aria-label="Report category" value={category} onChange={(event) => changeCategory(event.target.value as ReportCategory) } > {REPORT_CATEGORIES.map((item) => ( <option key={item} value={item}> {REPORT_CATEGORY_LABELS[item]} </option> ))} </select> </label> <label> Template <select aria-label="Report template" value={selectedId ?? ""} onChange={(event) => { if (confirmDiscard()) load(event.target.value \|\| null); }} > <option value="">New unsaved template</option> {categoryTemplates.map((template) => ( <option key={template.id} value={template.id}> {template.name} {template.active ? " (Active)" : ""} </option> ))} </select> </label> <label> Template name <input aria-label="Template name" value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }); setJustSaved(false); }} /> </label> <label className="template-active"> <input type="checkbox" checked={draft.active} onChange={(event) => { if (draft.active && !event.target.checked) { setErrors([ "Activate another template before deactivating the current template.", ]); return; } setDraft({ ...draft, active: event.target.checked }); setErrors([]); setJustSaved(false); }} />{" "} Active template </label> </div> <div className="template-workspace"> <div className="template-editor-column"> <strong>Template HTML</strong> <CodeMirror className="template-html-editor" value={draft.html} height="460px" basicSetup={{ lineNumbers: true, foldGutter: false }} extensions={[ htmlLanguage(), EditorView.lineWrapping, EditorView.contentAttributes.of({ "aria-label": "Template HTML", }), ]} onChange={(next) => { setDraft((current) => ({ ...current, html: next })); setJustSaved(false); }} /> </div> <div className="template-preview-column"> <strong>Live preview (sandboxed)</strong> {unsupported.length ? ( <div className="api-error" role="alert"> <p> Preview unavailable until unsupported placeholders are removed. </p> </div> ) : ( <iframe className="template-preview" title={`${REPORT_CATEGORY_LABELS[category]} template preview`} sandbox="" srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}*{box-sizing:border-box}</style></head><body>${preview}</body></html>`} /> )} </div> <aside className="placeholder-registry"> <h4>Allowed placeholders</h4> <p> Insert a placeholder exactly as shown. Blocks generate safe report tables or configured images. </p> {REPORT_PLACEHOLDERS[category].map((name) => ( <code key={name}>{`{{${name}}}`}</code> ))} <h4>Line loop</h4> <code>{"{{#lines}} ... {{/lines}}"}</code> {LINE_PLACEHOLDERS.map((name) => ( <code key={name}>{`{{${name}}}`}</code> ))} {unsupported.length > 0 && ( <div className="api-error" role="alert"> <strong>Unsupported</strong> {unsupported.map((name) => ( <p key={name}>{name}</p> ))} </div> )} </aside> </div> 

### ACT-admin-console-tsx-2626

Component: ReportTemplatesTab Â· src/admin-console.tsx:2626-2631

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            onClick={() => {
              if (confirmDiscard()) load(null);
            }}
          >
```

Content/label expression: New Template 

### ACT-admin-console-tsx-2634

Component: ReportTemplatesTab Â· src/admin-console.tsx:2634-2634

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" disabled={!selectedId} onClick={remove}>
```

Content/label expression: Delete Template 

### ACT-admin-console-tsx-2637

Component: ReportTemplatesTab Â· src/admin-console.tsx:2637-2642

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            className="primary-action"
            disabled={!dirty}
            onClick={save}
          >
```

Content/label expression:  {selectedId ? "Update Template" : "Create Template"} 

### STATE-admin-console-tsx-2648

Component: ReportTemplatesTab Â· src/admin-console.tsx:2648-2648

Tag: div; visibility: errors.length > 0

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  {errors.map((message) => ( <p key={message}>{message}</p> ))} 

### ACT-admin-console-tsx-2661

Component: ReportTemplatesTab Â· src/admin-console.tsx:2661-2667

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Report category"
            value={category}
            onChange={(event) =>
              changeCategory(event.target.value as ReportCategory)
            }
          >
```

Content/label expression:  {REPORT_CATEGORIES.map((item) => ( <option key={item} value={item}> {REPORT_CATEGORY_LABELS[item]} </option> ))} 

### ACT-admin-console-tsx-2677

Component: ReportTemplatesTab Â· src/admin-console.tsx:2677-2683

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Report template"
            value={selectedId ?? ""}
            onChange={(event) => {
              if (confirmDiscard()) load(event.target.value || null);
            }}
          >
```

Content/label expression:  <option value="">New unsaved template</option> {categoryTemplates.map((template) => ( <option key={template.id} value={template.id}> {template.name} {template.active ? " (Active)" : ""} </option> ))} 

### ACT-admin-console-tsx-2695

Component: ReportTemplatesTab Â· src/admin-console.tsx:2695-2702

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Template name"
            value={draft.name}
            onChange={(event) => {
              setDraft({ ...draft, name: event.target.value });
              setJustSaved(false);
            }}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2705

Component: ReportTemplatesTab Â· src/admin-console.tsx:2705-2719

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
          />
```

Content/label expression: 

### ACT-admin-console-tsx-2726

Component: ReportTemplatesTab Â· src/admin-console.tsx:2726-2742

Tag: CodeMirror; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### STATE-admin-console-tsx-2747

Component: ReportTemplatesTab Â· src/admin-console.tsx:2747-2747

Tag: div; visibility: unsupported.length

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  <p> Preview unavailable until unsupported placeholders are removed. </p> 

### STATE-admin-console-tsx-2776

Component: ReportTemplatesTab Â· src/admin-console.tsx:2776-2776

Tag: div; visibility: unsupported.length > 0

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  <strong>Unsupported</strong> {unsupported.map((name) => ( <p key={name}>{name}</p> ))} 

### STATE-admin-console-tsx-2937

Component: InventoryImportTab Â· src/admin-console.tsx:2937-2937

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Inventory Import</h3> <span> Step {step} of 4 · session-only, never touches the persisted inventory </span> </div> <div className="wizard-steps"> {["Upload", "Map Columns", "Validate & Preview", "Confirm"].map( (label, index) => ( <span key={label} className={`wizard-step${step === index + 1 ? " active" : ""}${step > index + 1 ? " done" : ""}`} > {index + 1}. {label} </span> ), )} </div> {step === 1 && ( <div className="desk-panel"> <p> Upload a CSV or XLSX file with your opening inventory, or start from the WorkshopOS template. </p> <div className="action-row"> <label className="primary-action file-upload-button"> Choose File <input type="file" accept=".csv,.xlsx,.xls" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFileChosen(file); event.target.value = ""; }} hidden /> </label> <button onClick={downloadTemplate}>Download Template</button> </div> {uploadError && <p className="error-text">{uploadError}</p>} </div> )} {step === 2 && parsed && ( <div className="desk-panel"> <p> Mapped from <strong>{fileName}</strong> ({parsed.rows.length} rows). Adjust any column below. </p> <div className="form-grid"> {INVENTORY_IMPORT_FIELDS.map((field: InventoryImportField) => ( <label key={field}> {INVENTORY_TEMPLATE_HEADERS[field]} <select value={mapping[field] ?? ""} onChange={(event) => setMapping((prev) => ({ ...prev, [field]: event.target.value \|\| undefined, })) } > <option value="">Not mapped</option> {parsed.headers.map((header) => ( <option key={header} value={header}> {header} </option> ))} </select> </label> ))} </div> <div className="action-row"> <button onClick={() => setStep(1)}>Back</button> <button className="primary-action" onClick={runValidation}> Validate &amp; Preview </button> </div> </div> )} {step === 3 && preview && ( <div className="desk-panel"> {preview.mappingIssues.length > 0 ? ( <> <p className="error-text"> Fix the column mapping before continuing: </p> <ul> {preview.mappingIssues.map((issue) => ( <li key={`${issue.field}-${issue.code}`}>{issue.message}</li> ))} </ul> <button onClick={() => setStep(2)}>Back to Mapping</button> </> ) : ( <> <div className="linked-grid"> <Info label="Total rows" value={preview.totalRows} /> <Info label="Valid rows" value={preview.validRows.length} /> <Info label="Rejected rows" value={preview.rejectedRows.length} /> </div> <h4>Valid rows (first 10)</h4> <div className="table-wrap"> <table> <thead> <tr> <th>SKU</th> <th>Name</th> <th>Category</th> <th>Unit</th> <th>Opening Qty</th> <th>Low-stock</th> </tr> </thead> <tbody> {preview.validRows.slice(0, 10).map((row) => ( <tr key={row.sourceRowNumber}> <td>{row.item.sku}</td> <td>{row.item.name}</td> <td>{row.item.category}</td> <td>{row.item.unit}</td> <td>{row.item.stock_qty}</td> <td>{row.item.low_stock_qty}</td> </tr> ))} </tbody> </table> </div> {preview.rejectedRows.length > 0 && ( <> <div className="panel-actions"> <h4>Rejected rows</h4> <DownloadMenu report={{ title: "Rejected Inventory Import Rows", filters: [`File: ${fileName}`], columns: rejectedColumns, rows: preview.rejectedRows, }} /> </div> <div className="table-wrap"> <table> <thead> <tr> <th>Row</th> <th>SKU</th> <th>Name</th> <th>Issues</th> </tr> </thead> <tbody> {preview.rejectedRows.slice(0, 20).map((row) => ( <tr key={row.sourceRowNumber}> <td>{row.sourceRowNumber}</td> <td>{row.normalized.sku}</td> <td>{row.normalized.name}</td> <td> {row.issues .map((issue) => issue.message) .join("; ")} </td> </tr> ))} </tbody> </table> </div> </> )} <div className="action-row"> <button onClick={() => setStep(2)}>Back</button> <button className="primary-action" disabled={preview.validRows.length === 0} onClick={confirmImport} > Confirm Import </button> </div> </> )} </div> )} {step === 4 && result && ( <div className="desk-panel"> <PanelTitle icon={<FileSpreadsheet />} title="Import complete" subtitle={`Batch ${result.batchId}`} /> <div className="linked-grid"> <Info label="Total rows" value={result.total} /> <Info label="Imported" value={result.accepted} /> <Info label="Rejected" value={result.rejected} /> </div> <p> Imported rows are merged into Stock presentation data for this session only. </p> <button className="primary-action" onClick={resetWizard}> Start New Import </button> </div> )} 

### ACT-admin-console-tsx-2966

Component: InventoryImportTab Â· src/admin-console.tsx:2966-2975

Tag: input; visibility: step === 1

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-2977

Component: InventoryImportTab Â· src/admin-console.tsx:2977-2977

Tag: button; visibility: step === 1

```tsx
<button onClick={downloadTemplate}>
```

Content/label expression: Download Template

### ACT-admin-console-tsx-2993

Component: InventoryImportTab Â· src/admin-console.tsx:2993-3001

Tag: select; visibility: step === 2 && parsed

```tsx
<select
                  value={mapping[field] ?? ""}
                  onChange={(event) =>
                    setMapping((prev) => ({
                      ...prev,
                      [field]: event.target.value || undefined,
                    }))
                  }
                >
```

Content/label expression:  <option value="">Not mapped</option> {parsed.headers.map((header) => ( <option key={header} value={header}> {header} </option> ))} 

### ACT-admin-console-tsx-3013

Component: InventoryImportTab Â· src/admin-console.tsx:3013-3013

Tag: button; visibility: step === 2 && parsed

```tsx
<button onClick={() => setStep(1)}>
```

Content/label expression: Back

### ACT-admin-console-tsx-3014

Component: InventoryImportTab Â· src/admin-console.tsx:3014-3014

Tag: button; visibility: step === 2 && parsed

```tsx
<button className="primary-action" onClick={runValidation}>
```

Content/label expression: Validate &amp; Preview 

### ACT-admin-console-tsx-3033

Component: InventoryImportTab Â· src/admin-console.tsx:3033-3033

Tag: button; visibility: preview.mappingIssues.length > 0; step === 3 && preview

```tsx
<button onClick={() => setStep(2)}>
```

Content/label expression: Back to Mapping

### ACT-admin-console-tsx-3076

Component: InventoryImportTab Â· src/admin-console.tsx:3076-3083

Tag: DownloadMenu; visibility: preview.rejectedRows.length > 0; preview.mappingIssues.length > 0; step === 3 && preview

```tsx
<DownloadMenu
                      report={{
                        title: "Rejected Inventory Import Rows",
                        filters: [`File: ${fileName}`],
                        columns: rejectedColumns,
                        rows: preview.rejectedRows,
                      }}
                    />
```

Content/label expression: 

### ACT-admin-console-tsx-3114

Component: InventoryImportTab Â· src/admin-console.tsx:3114-3114

Tag: button; visibility: preview.mappingIssues.length > 0; step === 3 && preview

```tsx
<button onClick={() => setStep(2)}>
```

Content/label expression: Back

### ACT-admin-console-tsx-3115

Component: InventoryImportTab Â· src/admin-console.tsx:3115-3119

Tag: button; visibility: preview.mappingIssues.length > 0; step === 3 && preview

```tsx
<button
                  className="primary-action"
                  disabled={preview.validRows.length === 0}
                  onClick={confirmImport}
                >
```

Content/label expression: Confirm Import 

### ACT-admin-console-tsx-3144

Component: InventoryImportTab Â· src/admin-console.tsx:3144-3144

Tag: button; visibility: step === 4 && result

```tsx
<button className="primary-action" onClick={resetWizard}>
```

Content/label expression: Start New Import 

### ACT-admin-console-tsx-3192

Component: LogTable Â· src/admin-console.tsx:3192-3196

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<tr
              key={log.id}
              className="clickable-row"
              onClick={() => onSelect(log)}
            >
```

Content/label expression:  <td>{new Date(log.timestamp).toLocaleString("en-IN")}</td> <td> <span className={`status ${log.level}`}>{log.level}</span> </td> <td>{log.area}</td> <td>{log.feature}</td> <td>{log.message}</td> <td>{log.userName ?? "Unavailable"}</td> <td>{log.referenceId ?? "Unavailable"}</td> 

### STATE-admin-console-tsx-3278

Component: LogsPanel Â· src/admin-console.tsx:3278-3278

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search logs" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Message, area, feature, user or reference" /> </label> <label> Date from <input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} /> </label> <label> Date to <input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} /> </label> <label> Level <select value={level} onChange={(event) => { setLevel(event.target.value); setPage(1); }} > <option value="ALL">All levels</option> {LOG_LEVELS.map((item) => ( <option key={item} value={item}> {item} </option> ))} </select> </label> <label> Area <select value={area} onChange={(event) => { setArea(event.target.value); setPage(1); }} > <option value="ALL">All areas</option> {areas.map((item) => ( <option key={item} value={item}> {item} </option> ))} </select> </label> <ListSearchActions onClear={clearFilters} /> </div> <PaginationToolbar controls={ <> <DownloadMenu report={{ title: stream === "operational" ? "Daily Operational Logs" : "Feature Activity", filters: activeFilterSummary({ Search: search.trim(), Level: level, Area: area, "Date from": dateFrom, "Date to": dateTo, }), columns, rows: filtered, }} /> <button className="danger-action" onClick={clear} disabled={streamLogs.length === 0} > Clear Logs </button> </> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Log records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <LogTable logs={paged.items} onSelect={setSelected} /> <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> {selected && ( <Dialog title="Log detail" subtitle={new Date(selected.timestamp).toLocaleString("en-IN")} onClose={() => setSelected(undefined)} > <div className="linked-grid"> <Info label="Level" value={selected.level} /> <Info label="Area" value={selected.area} /> <Info label="Feature" value={selected.feature} /> <Info label="User" value={selected.userName ?? "Unavailable"} /> <Info label="Reference" value={selected.referenceId ?? "Unavailable"} /> </div> <p>{selected.message}</p> {selected.details && ( <pre className="log-details"> {JSON.stringify(selected.details, null, 2)} </pre> )} </Dialog> )} 

### ACT-admin-console-tsx-3282

Component: LogsPanel Â· src/admin-console.tsx:3282-3290

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search logs"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Message, area, feature, user or reference"
          />
```

Content/label expression: 

### ACT-admin-console-tsx-3294

Component: LogsPanel Â· src/admin-console.tsx:3294-3301

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setPage(1);
            }}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-3305

Component: LogsPanel Â· src/admin-console.tsx:3305-3312

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              setPage(1);
            }}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-3316

Component: LogsPanel Â· src/admin-console.tsx:3316-3322

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            value={level}
            onChange={(event) => {
              setLevel(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All levels</option> {LOG_LEVELS.map((item) => ( <option key={item} value={item}> {item} </option> ))} 

### ACT-admin-console-tsx-3333

Component: LogsPanel Â· src/admin-console.tsx:3333-3339

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            value={area}
            onChange={(event) => {
              setArea(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All areas</option> {areas.map((item) => ( <option key={item} value={item}> {item} </option> ))} 

### ACT-admin-console-tsx-3348

Component: LogsPanel Â· src/admin-console.tsx:3348-3348

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clearFilters} />
```

Content/label expression: 

### ACT-admin-console-tsx-3350

Component: LogsPanel Â· src/admin-console.tsx:3350-3391

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-3353

Component: LogsPanel Â· src/admin-console.tsx:3353-3369

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-admin-console-tsx-3370

Component: LogsPanel Â· src/admin-console.tsx:3370-3374

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              className="danger-action"
              onClick={clear}
              disabled={streamLogs.length === 0}
            >
```

Content/label expression: Clear Logs 

### ACT-admin-console-tsx-3392

Component: LogsPanel Â· src/admin-console.tsx:3392-3392

Tag: LogTable; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<LogTable logs={paged.items} onSelect={setSelected} />
```

Content/label expression: 

### ACT-admin-console-tsx-3393

Component: LogsPanel Â· src/admin-console.tsx:3393-3397

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### STATE-admin-console-tsx-3399

Component: LogsPanel Â· src/admin-console.tsx:3399-3403

Tag: Dialog; visibility: selected

```tsx
<Dialog
          title="Log detail"
          subtitle={new Date(selected.timestamp).toLocaleString("en-IN")}
          onClose={() => setSelected(undefined)}
        >
```

Content/label expression:  <div className="linked-grid"> <Info label="Level" value={selected.level} /> <Info label="Area" value={selected.area} /> <Info label="Feature" value={selected.feature} /> <Info label="User" value={selected.userName ?? "Unavailable"} /> <Info label="Reference" value={selected.referenceId ?? "Unavailable"} /> </div> <p>{selected.message}</p> {selected.details && ( <pre className="log-details"> {JSON.stringify(selected.details, null, 2)} </pre> )} 

### STATE-admin-console-tsx-3456

Component: RetentionSettingsPanel Â· src/admin-console.tsx:3456-3456

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <p> This is demo operational visibility, not a production observability or compliance audit trail. </p> <div className="form-grid"> <label> Operational / error log retention (days) <input type="number" min={1} value={operationalDays} onChange={(event) => setOperationalDays(Number(event.target.value))} /> </label> <label> Feature activity retention (days) <input type="number" min={1} value={featureDays} onChange={(event) => setFeatureDays(Number(event.target.value))} /> </label> </div> <div className="action-row"> <button disabled={!dirty} onClick={() => { setOperationalDays( adminState.businessSettings.logRetention.operationalDays, ); setFeatureDays( adminState.businessSettings.logRetention.featureDays, ); }} > Reset to Saved </button> <button className="primary-action" disabled={!dirty \|\| operationalDays < 1 \|\| featureDays < 1} onClick={() => commit( (current) => updateBusinessSettings(current, { logRetention: { operationalDays, featureDays }, }), { stream: "feature", level: "info", area: "Administration", feature: "Support & Logs", message: "Log retention settings updated", userId: String(actingUser.id), userName: actingUser.name, }, ) } > Save Retention Settings </button> </div> 

### ACT-admin-console-tsx-3464

Component: RetentionSettingsPanel Â· src/admin-console.tsx:3464-3469

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="number"
            min={1}
            value={operationalDays}
            onChange={(event) => setOperationalDays(Number(event.target.value))}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-3473

Component: RetentionSettingsPanel Â· src/admin-console.tsx:3473-3478

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="number"
            min={1}
            value={featureDays}
            onChange={(event) => setFeatureDays(Number(event.target.value))}
          />
```

Content/label expression: 

### ACT-admin-console-tsx-3482

Component: RetentionSettingsPanel Â· src/admin-console.tsx:3482-3492

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Reset to Saved 

### ACT-admin-console-tsx-3495

Component: RetentionSettingsPanel Â· src/admin-console.tsx:3495-3515

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Save Retention Settings 

### STATE-admin-console-tsx-3539

Component: SupportLogsTab Â· src/admin-console.tsx:3539-3539

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Support &amp; Logs</h3> <button onClick={refresh}>Refresh</button> </div> <div className="sub-tabs" role="tablist" aria-label="Support and logs sections" > {SUPPORT_SUB_TABS.map((item) => ( <button key={item} role="tab" aria-selected={subTab === item} className={subTab === item ? "active" : ""} onClick={() => setSubTab(item)} > {item} </button> ))} </div> {subTab === "Daily Operational Logs" && ( <LogsPanel adminState={adminState} stream="operational" commit={commit} /> )} {subTab === "Feature Activity" && ( <LogsPanel adminState={adminState} stream="feature" commit={commit} /> )} {subTab === "Retention Settings" && ( <RetentionSettingsPanel adminState={adminState} commit={commit} actingUser={actingUser} /> )} 

### ACT-admin-console-tsx-3542

Component: SupportLogsTab Â· src/admin-console.tsx:3542-3542

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button onClick={refresh}>
```

Content/label expression: Refresh

### STATE-admin-console-tsx-3544

Component: SupportLogsTab Â· src/admin-console.tsx:3544-3548

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
        className="sub-tabs"
        role="tablist"
        aria-label="Support and logs sections"
      >
```

Content/label expression:  {SUPPORT_SUB_TABS.map((item) => ( <button key={item} role="tab" aria-selected={subTab === item} className={subTab === item ? "active" : ""} onClick={() => setSubTab(item)} > {item} </button> ))} 

### STATE-admin-console-tsx-3550

Component: SupportLogsTab Â· src/admin-console.tsx:3550-3556

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            key={item}
            role="tab"
            aria-selected={subTab === item}
            className={subTab === item ? "active" : ""}
            onClick={() => setSubTab(item)}
          >
```

Content/label expression:  {item} 

### ACT-App-tsx-983

Component: App Â· src/App.tsx:983-1003

Tag: DeveloperConsole; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1009

Component: App Â· src/App.tsx:1009-1016

Tag: LoginScreen; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<LoginScreen
        onLogin={handleLogin}
        onCognitoLogin={() =>
          authConfig?.mode === "cognito" && beginCognitoLogin(authConfig)
        }
        config={authConfig}
        error={loginError}
      />
```

Content/label expression: 

### ACT-App-tsx-1135

Component: App Â· src/App.tsx:1135-1144

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {sidebarCollapsed ? ( <PanelLeftOpen size={18} /> ) : ( <PanelLeftClose size={18} /> )} 

### ACT-App-tsx-1158

Component: App Â· src/App.tsx:1158-1174

Tag: button; visibility: menuItems.length === 0

```tsx
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
```

Content/label expression:  {item.icon} <span> {item.label === "Approvals" ? `Approvals (${state.jobs.filter((view) => view.material_approval?.status === "Pending").length})` : item.label} </span> 

### ACT-App-tsx-1183

Component: App Â· src/App.tsx:1183-1183

Tag: summary; visibility: user.role === "admin"; menuItems.length === 0

```tsx
<summary>
```

Content/label expression: Sales CRM

### ACT-App-tsx-1183

Component: App Â· src/App.tsx:1183-1183

Tag: button; visibility: user.role === "admin"; menuItems.length === 0

```tsx
<button key={item.label} className={activeMenuItem === item.label ? "active" : ""} onClick={() => setActiveMenuItem(item.label)} title={item.label}>
```

Content/label expression: {item.icon} <span>{item.label}</span>

### ACT-App-tsx-1187

Component: App Â· src/App.tsx:1187-1187

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="logout" onClick={developerEmulation ? returnToDeveloper : handleLogout}>
```

Content/label expression:  <LogOut size={18} /> <span>{developerEmulation ? "Return to Developer" : "Logout"}</span> 

### ACT-App-tsx-1203

Component: App Â· src/App.tsx:1203-1221

Tag: select; visibility: activeMenuItem === "Search"

```tsx
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
```

Content/label expression:  <option value="">Select a category</option> {searchCategoriesFor(user, permittedPages).map((item) => ( <option key={item} value={item}> {item in ADMIN_OPERATIONAL_SEARCH_LABELS ? ADMIN_OPERATIONAL_SEARCH_LABELS[ item as AdminOperationalSearchCategory ] : SEARCH_CATEGORY_LABELS[item as SearchTableCategory]} </option> ))} 

### ACT-App-tsx-1234

Component: App Â· src/App.tsx:1234-1238

Tag: FilterClearButton; visibility: activeMenuItem === "Search"

```tsx
<FilterClearButton
                label="Clear category"
                disabled={!searchCategory}
                onClick={() => setSearchCategory("")}
              />
```

Content/label expression: 

### ACT-App-tsx-1246

Component: App Â· src/App.tsx:1246-1246

Tag: button; visibility: developerEmulation

```tsx
<button className="secondary-action" onClick={returnToDeveloper}>
```

Content/label expression: Return to Developer 

### ACT-App-tsx-1250

Component: App Â· src/App.tsx:1250-1254

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            className="mobile-logout"
            onClick={developerEmulation ? returnToDeveloper : handleLogout}
            aria-label={developerEmulation ? "Return to Developer" : "Logout"}
          >
```

Content/label expression:  <LogOut size={18} /> {developerEmulation ? "Return" : "Logout"} 

### ACT-App-tsx-1271

Component: App Â· src/App.tsx:1271-1309

Tag: RoleWorkspace; visibility: menuItems.length === 0

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1313

Component: App Â· src/App.tsx:1313-1316

Tag: JobCardNotificationDialog; visibility: jobCardNotification

```tsx
<JobCardNotificationDialog
          notification={jobCardNotification}
          onClose={() => setJobCardNotification(undefined)}
        />
```

Content/label expression: 

### STATE-App-tsx-1335

Component: JobCardNotificationDialog Â· src/App.tsx:1335-1349

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <p className="permission-note"> The customer notification details are shown below. </p> <section className="notification-message" aria-label="WhatsApp message"> <strong>WhatsApp</strong> <p>{payload.whatsapp}</p> </section> <section className="notification-message" aria-label="Email message"> <strong>Email</strong> <p>{payload.email}</p> </section> 

### ACT-App-tsx-1340

Component: JobCardNotificationDialog Â· src/App.tsx:1340-1345

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          type="button"
          className="primary-action"
          data-dialog-initial-focus
          onClick={onClose}
        >
```

Content/label expression: Done 

### ACT-App-tsx-1396

Component: LoginScreen Â· src/App.tsx:1396-1396

Tag: button; visibility: config?.mode === "cognito"

```tsx
<button className="primary-action" onClick={onCognitoLogin}>
```

Content/label expression: Continue with Cognito 

### FORM-App-tsx-1408

Component: LoginScreen Â· src/App.tsx:1408-1413

Tag: form; visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
<form
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(email, password);
            }}
          >
```

Content/label expression:  <label> Email <input value={email} onChange={(event) => setEmail(event.target.value)} /> </label> <label> Password <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /> </label> {error && <p className="error-text">{error}</p>} <button className="primary-action">Login</button> 

### ACT-App-tsx-1416

Component: LoginScreen Â· src/App.tsx:1416-1419

Tag: input; visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
<input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
```

Content/label expression: 

### ACT-App-tsx-1423

Component: LoginScreen Â· src/App.tsx:1423-1427

Tag: input; visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
<input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
```

Content/label expression: 

### ACT-App-tsx-1430

Component: LoginScreen Â· src/App.tsx:1430-1430

Tag: button; visibility: config?.mode === "local" && !config.allowDemo; config?.mode === "cognito"

```tsx
<button className="primary-action">
```

Content/label expression: Login

### ACT-App-tsx-1436

Component: LoginScreen Â· src/App.tsx:1436-1439

Tag: select; visibility: config?.mode === "local" && config.allowDemo

```tsx
<select
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            >
```

Content/label expression:  {demoLogins.map((item) => ( <option key={item} value={item}> {item} </option> ))} 

### ACT-App-tsx-1538

Component: RoleWorkspace Â· src/App.tsx:1538-1538

Tag: AdminConsole; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<AdminConsole state={state} mutate={mutate} actingUser={user} cognitoConfig={cognitoConfig} onThemeSaved={onThemeSaved} onStateSaved={onAdminStateSaved} initialTab="Report Templates" initialReportCategory="quotation" />
```

Content/label expression: 

### ACT-App-tsx-1554

Component: RoleWorkspace Â· src/App.tsx:1554-1582

Tag: SearchPortal; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1591

Component: RoleWorkspace Â· src/App.tsx:1591-1610

Tag: EntityList; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1614

Component: RoleWorkspace Â· src/App.tsx:1614-1629

Tag: EntityList; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1633

Component: RoleWorkspace Â· src/App.tsx:1633-1648

Tag: EntityList; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1659

Component: RoleWorkspace Â· src/App.tsx:1659-1659

Tag: PurchaseOrdersWorkspace; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<PurchaseOrdersWorkspace state={state} actor={user} mutate={mutate} procurementDraft={procurementDraft} onProcurementDraftConsumed={() => setProcurementDraft(undefined)} />
```

Content/label expression: 

### ACT-App-tsx-1695

Component: RoleWorkspace Â· src/App.tsx:1695-1708

Tag: StoreDesk; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1712

Component: RoleWorkspace Â· src/App.tsx:1712-1723

Tag: StoreDesk; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1746

Component: RoleWorkspace Â· src/App.tsx:1746-1759

Tag: Admin; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-1948

Component: SearchPortal Â· src/App.tsx:1948-1955

Tag: JobRecordDialog; visibility: record?.category === "job"

```tsx
<JobRecordDialog
          view={record.view}
          state={state}
          mutate={mutate}
          actor={actor}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-1958

Component: SearchPortal Â· src/App.tsx:1958-1965

Tag: InvoiceDialog; visibility: record?.category === "invoice"

```tsx
<InvoiceDialog
          fixedJob
          action={record.mode}
          view={record.view}
          actor={actor}
          mutate={mutate}
          onClose={() => setRecord(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-1968

Component: SearchPortal Â· src/App.tsx:1968-1975

Tag: InvoiceDialog; visibility: record?.category === "payment"

```tsx
<InvoiceDialog
          fixedJob
          action="view"
          view={record.view}
          actor={actor}
          mutate={mutate}
          onClose={() => setRecord(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-1981

Component: SearchPortal Â· src/App.tsx:1981-1988

Tag: input; visibility: !operationalCategory && category !== "job" && !entityListKind; !operationalCategory && !entityListKind

```tsx
<input
              aria-label="Search records"
              value={query}
              placeholder="Search vehicle, mobile, customer, job card, invoice"
              onChange={(event) =>
                changeFilters(() => setQuery(event.target.value))
              }
            />
```

Content/label expression: 

### ACT-App-tsx-1992

Component: SearchPortal Â· src/App.tsx:1992-2009

Tag: JobCardFilterFields; visibility: category === "job"; !operationalCategory && !entityListKind

```tsx
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
```

Content/label expression: 

### STATE-App-tsx-2013

Component: SearchPortal Â· src/App.tsx:2013-2013

Tag: span; visibility: category === "stock" && activeLowStockOnly; !operationalCategory && !entityListKind

```tsx
<span className="search-scope" role="status">
```

Content/label expression: Low stock only 

### ACT-App-tsx-2025

Component: SearchPortal Â· src/App.tsx:2025-2035

Tag: select; visibility: false && category === "job"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
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
```

Content/label expression:  {SEARCH_STATUS_OPTIONS.map((item) => ( <option key={item} value={item}> {item === "ALL" ? "All statuses" : item} </option> ))} 

### ACT-App-tsx-2047

Component: SearchPortal Â· src/App.tsx:2047-2057

Tag: select; visibility: category === "payment"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
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
```

Content/label expression:  <option value="ALL">All</option> {( [ "UPI", "Cash", "Card", "Bank transfer", "Other", ] as PaymentMode[] ).map((mode) => ( <option key={mode} value={mode}> {mode} </option> ))} 

### ACT-App-tsx-2077

Component: SearchPortal Â· src/App.tsx:2077-2087

Tag: input; visibility: category !== "job"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-2091

Component: SearchPortal Â· src/App.tsx:2091-2100

Tag: select; visibility: category !== "job"; !operationalCategory && category && category !== "stock" && !entityListKind; !operationalCategory && !entityListKind

```tsx
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
```

Content/label expression:  <option value="">All months</option> {availableMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} 

### ACT-App-tsx-2132

Component: SearchPortal Â· src/App.tsx:2132-2143

Tag: EntityList; visibility: entityListKind; !category; operationalCategory

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-2146

Component: SearchPortal Â· src/App.tsx:2146-2158

Tag: PaginationToolbar; visibility: entityListKind; !category; operationalCategory

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-2163

Component: SearchPortal Â· src/App.tsx:2163-2163

Tag: FilterClearButton; visibility: resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
<FilterClearButton onClick={clearFilters} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-2166

Component: SearchPortal Â· src/App.tsx:2166-2169

Tag: StockSearchResultsTable; visibility: isStock; resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
<StockSearchResultsTable
              rows={pagedStock.items}
              onOpenRecord={onOpenStockRecord}
            />
```

Content/label expression: 

### ACT-App-tsx-2171

Component: SearchPortal Â· src/App.tsx:2171-2176

Tag: PaymentSearchResultsTable; visibility: isPayment; isStock; resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
<PaymentSearchResultsTable
              rows={pagedPayments.items}
              onOpenRecord={(view) =>
                setRecord({ view, category: "payment", mode: "view" })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-2178

Component: SearchPortal Â· src/App.tsx:2178-2192

Tag: SearchResultsTable; visibility: isPayment; isStock; resultPage.totalCount === 0; entityListKind; !category; operationalCategory

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-2194

Component: SearchPortal Â· src/App.tsx:2194-2198

Tag: ResultPagination; visibility: entityListKind; !category; operationalCategory

```tsx
<ResultPagination
            page={resultPage.page}
            pageCount={resultPage.pageCount}
            onChange={setPage}
          />
```

Content/label expression: 

### ACT-App-tsx-2316

Component: SearchResultsTable Â· src/App.tsx:2316-2320

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<tr
                key={view.job.id}
                className={`clickable-row ${category === "job" ? jobDeliveryClass(view.job, today) : ""}`}
                onClick={() => onOpenRecord(view, category, "view")}
              >
```

Content/label expression:  {category === "job" && ( <> <td>{view.job.job_no}</td> <td> {view.vehicle.number} · {view.vehicle.make}{" "} {view.vehicle.model} </td> <td>{view.customer.name}</td> <td>{view.job.estimated_delivery \|\| "—"}</td> <td> <Status status={view.job.main_status} sub={view.job.sub_status} /> </td> <td>{money(jobTotal(view))}</td> </> )} {category === "invoice" && ( <> <td>{view.invoice?.invoice_no \|\| "Not generated"}</td> <td>{view.job.job_no}</td> <td>{view.customer.name}</td> <td>{money(view.invoice?.total ?? jobTotal(view))}</td> <td>{view.invoice?.status ?? "Not generated"}</td> </> )} <td> <RecordActions inGrid onView={() => onOpenRecord(view, category, "view")} onEdit={ editable ? () => onOpenRecord(view, category, "edit") : undefined } editLabel={ category === "invoice" ? "Edit Invoice" : undefined } /> </td> 

### ACT-App-tsx-2349

Component: SearchResultsTable Â· src/App.tsx:2349-2360

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-2400

Component: PaymentSearchResultsTable Â· src/App.tsx:2400-2404

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<tr
              key={payment.id}
              className={`clickable-row ${paymentRowHighlight(payment.mode)}`}
              onClick={() => onOpenRecord(view)}
            >
```

Content/label expression:  <td> {payment.created_at ? formatTimestamp(payment.created_at) : "—"} </td> <td>{view.job.job_no}</td> <td>{view.invoice?.invoice_no ?? "Not generated"}</td> <td>{view.customer.name}</td> <td>{money(payment.amount)}</td> <td>{payment.mode}</td> <td>Paid</td> <td> <RecordActions inGrid onView={() => onOpenRecord(view)} /> </td> 

### ACT-App-tsx-2415

Component: PaymentSearchResultsTable Â· src/App.tsx:2415-2415

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<RecordActions inGrid onView={() => onOpenRecord(view)} />
```

Content/label expression: 

### ACT-App-tsx-2467

Component: StockSearchResultsTable Â· src/App.tsx:2467-2471

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<tr
                key={item.id}
                className="clickable-row"
                onClick={() => onOpenRecord(item)}
              >
```

Content/label expression:  <td>{item.sku}</td> <td>{item.name}</td> <td>{item.category}</td> <td>{item.stock_qty}</td> <td>{item.unit}</td> <td>{item.low_stock_qty}</td> <td> <span className={`status stock-status stock-status-${stockStatus}`} > {statusLabel} </span> </td> <td> <button type="button" className="secondary-action" onClick={(event) => { event.stopPropagation(); onOpenRecord(item); }} > View </button> </td> 

### ACT-App-tsx-2486

Component: StockSearchResultsTable Â· src/App.tsx:2486-2493

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                    type="button"
                    className="secondary-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenRecord(item);
                    }}
                  >
```

Content/label expression: View 

### ACT-App-tsx-2605

Component: Reception Â· src/App.tsx:2605-2610

Tag: BookingOperations; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<BookingOperations
        state={state}
        actor={user}
        mutate={mutate}
        onCheckedIn={(jobId) => setSelectedJobId(jobId)}
      />
```

Content/label expression: 

### ACT-App-tsx-2623

Component: Reception Â· src/App.tsx:2623-2623

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={() => setCreating(true)}>
```

Content/label expression:  <Plus size={18} /> Create New Visit 

### STATE-App-tsx-2640

Component: Reception Â· src/App.tsx:2640-2640

Tag: p; visibility: createdJobNo

```tsx
<p className="permission-note" role="status">
```

Content/label expression: Visit created: {createdJobNo} is now selected. 

### ACT-App-tsx-2644

Component: Reception Â· src/App.tsx:2644-2651

Tag: AdvisorAttendancePanel; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<AdvisorAttendancePanel
          state={state}
          jobs={openQueue}
          today={today}
          selectedAdvisorId={selectedAdvisorId}
          onSelectAdvisor={setSelectedAdvisorId}
          mutate={mutate}
        />
```

Content/label expression: 

### ACT-App-tsx-2652

Component: Reception Â· src/App.tsx:2652-2659

Tag: ReceptionQueueRows; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ReceptionQueueRows
          jobs={openQueue}
          users={state.users}
          today={today}
          selectedAdvisorId={selectedAdvisorId}
          selectedJobId={selected?.job.id}
          onSelect={setSelectedJobId}
        />
```

Content/label expression: 

### ACT-App-tsx-2679

Component: Reception Â· src/App.tsx:2679-2690

Tag: button; visibility: selected

```tsx
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
```

Content/label expression: Archive Visit/Job 

### ACT-App-tsx-2700

Component: Reception Â· src/App.tsx:2700-2710

Tag: CreateVisitDialog; visibility: creating

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-2735

Component: BookingOperations Â· src/App.tsx:2735-2741

Tag: ExpectedTodayBookings; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ExpectedTodayBookings
            state={state}
            actor={actor}
            mutate={mutate}
            operationalDate={today}
            onCheckedIn={onCheckedIn}
          />
```

Content/label expression: 

### ACT-App-tsx-2793

Component: AdvisorAttendancePanel Â· src/App.tsx:2793-2801

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            className={
              selectedAdvisorId === undefined
                ? "advisor-reset active"
                : "advisor-reset"
            }
            onClick={() => onSelectAdvisor(undefined)}
          >
```

Content/label expression: All advisors 

### ACT-App-tsx-2806

Component: AdvisorAttendancePanel Â· src/App.tsx:2806-2812

Tag: button; visibility: pageCount > 1

```tsx
<button
                type="button"
                aria-label="Previous advisors"
                title="Previous advisors"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
              >
```

Content/label expression:  <ChevronLeft aria-hidden="true" size={16} /> 

### ACT-App-tsx-2818

Component: AdvisorAttendancePanel Â· src/App.tsx:2818-2824

Tag: button; visibility: pageCount > 1

```tsx
<button
                type="button"
                aria-label="Next advisors"
                title="Next advisors"
                disabled={page === pageCount - 1}
                onClick={() => setPage((current) => current + 1)}
              >
```

Content/label expression:  <ChevronRight aria-hidden="true" size={16} /> 

### ACT-App-tsx-2842

Component: AdvisorAttendancePanel Â· src/App.tsx:2842-2851

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <strong>{advisor.name}</strong> <span> {isPresent ? "Present" : "Away"} · {activeJobs} open </span> 

### ACT-App-tsx-2857

Component: AdvisorAttendancePanel Â· src/App.tsx:2857-2871

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <span aria-hidden="true" /> {isPresent ? "Present" : "Away"} 

### ACT-App-tsx-2931

Component: ReceptionQueueRows Â· src/App.tsx:2931-2936

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search reception queue"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Job, vehicle, customer or requested work"
          />
```

Content/label expression: 

### ACT-App-tsx-2940

Component: ReceptionQueueRows Â· src/App.tsx:2940-2944

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Reception queue status"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
```

Content/label expression:  <option value="ALL">All open</option> <option value="NEW">New</option> <option value="IN_PROGRESS">In Progress</option> <option value="COMPLETED">Completed</option> <option value="UNASSIGNED">Unassigned</option> 

### ACT-App-tsx-2952

Component: ReceptionQueueRows Â· src/App.tsx:2952-2957

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          type="button"
          className="secondary-action"
          onClick={reset}
          disabled={!search && status === "ALL"}
        >
```

Content/label expression: Clear 

### STATE-App-tsx-2961

Component: ReceptionQueueRows Â· src/App.tsx:2961-2961

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="reception-list-summary" role="status">
```

Content/label expression:  {filtered.length} of {jobs.length} open jobs {selectedAdvisorId !== undefined ? " for selected advisor" : ""} 

### ACT-App-tsx-2975

Component: ReceptionQueueRows Â· src/App.tsx:2975-2980

Tag: button; visibility: filtered.length

```tsx
<button
                type="button"
                key={row.job.id}
                className={`reception-visit-row ${statusClass}${selectedJobId === row.job.id ? " active" : ""}`}
                onClick={() => onSelect(row.job.id)}
              >
```

Content/label expression:  <div className="reception-job-identity"> <strong>{row.job.job_no}</strong> <span> {row.vehicle.number} · {row.customer.name} </span> </div> <div className="reception-job-meta"> <span className={ advisor ? "advisor-name" : "advisor-name unassigned" } > {advisor?.name ?? "Unassigned"} </span> <Status status={row.job.main_status} sub={row.job.sub_status} /> </div> <div className="reception-job-received"> <strong className={ isCarryForward ? "carry-forward" : "today-marker" } > {isCarryForward ? "Carry-forward" : "Today"} </strong> <span> {isCarryForward ? receptionAgeLabel(receivedDate, today) : "Received today"}{" "} · {receivedDate} </span> </div> <p title={row.visit.requested_work}> {row.visit.requested_work} </p> 

### ACT-App-tsx-3025

Component: ReceptionQueueRows Â· src/App.tsx:3025-3025

Tag: button; visibility: filtered.length

```tsx
<button type="button" onClick={reset}>
```

Content/label expression: Clear filters 

### STATE-App-tsx-3272

Component: CreateVisitDialog Â· src/App.tsx:3272-3282

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="create-visit-form" onSubmit={submit}> <div className="sub-tabs create-visit-tabs" role="tablist" aria-label="Create visit sections" onKeyDown={handleTabListKeyDown} > {(["details", "body-mark"] as const).map((item) => ( <button type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} > {item === "details" ? "Details" : "Body Mark"} </button> ))} </div> {tab === "details" ? ( <div id={panelId("details")} role="tabpanel" aria-labelledby={tabId("details")} className="create-visit-tab-panel" > <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > Add New Customer </button> </div> <div className="field-with-action"> <SearchSelect label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model" /> <button type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")} > Add New Vehicle </button> </div> <label> Customer Name <input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) } /> </label> <label> Mobile <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) } /> </label> <label> Vehicle Number <input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) } /> </label> <label> Make <input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) } /> </label> <label> Model <input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) } /> </label> <label> Color <input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) } /> </label> <label> ODO meter reading (km) <input required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel / battery level <div className="field-pair"> <input required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> <label> Advisor <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) } > <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} </select> </label> </div> <label> Requested Work <textarea required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> </div> ) : ( <div id={panelId("body-mark")} role="tabpanel" aria-labelledby={tabId("body-mark")} className="create-visit-tab-panel create-visit-body-mark-panel" > <div className="damage-capture"> <strong>Body mark</strong> <BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }} /> </div> </div> )} {error && ( <p role="alert" className="form-error"> {error} </p> )} </form> {quickAdd === "customer" && ( <Dialog title="Add New Customer" onClose={() => setQuickAdd(undefined)}> <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> </Dialog> )} {quickAdd === "vehicle" && form.customerId > 0 && ( <Dialog title="Add New Vehicle" onClose={() => setQuickAdd(undefined)}> <VehicleMasterPanel key={form.customerId} embedded state={state} value={{ id: 0, customer_id: form.customerId, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => setQuickAdd(undefined)} /> </Dialog> )} 

### ACT-App-tsx-3278

Component: CreateVisitDialog Â· src/App.tsx:3278-3278

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" form="create-visit-form">
```

Content/label expression: Create Visit 

### FORM-App-tsx-3283

Component: CreateVisitDialog Â· src/App.tsx:3283-3283

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="create-visit-form" onSubmit={submit}>
```

Content/label expression:  <div className="sub-tabs create-visit-tabs" role="tablist" aria-label="Create visit sections" onKeyDown={handleTabListKeyDown} > {(["details", "body-mark"] as const).map((item) => ( <button type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} > {item === "details" ? "Details" : "Body Mark"} </button> ))} </div> {tab === "details" ? ( <div id={panelId("details")} role="tabpanel" aria-labelledby={tabId("details")} className="create-visit-tab-panel" > <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > Add New Customer </button> </div> <div className="field-with-action"> <SearchSelect label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model" /> <button type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")} > Add New Vehicle </button> </div> <label> Customer Name <input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) } /> </label> <label> Mobile <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) } /> </label> <label> Vehicle Number <input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) } /> </label> <label> Make <input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) } /> </label> <label> Model <input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) } /> </label> <label> Color <input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) } /> </label> <label> ODO meter reading (km) <input required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel / battery level <div className="field-pair"> <input required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> <label> Advisor <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) } > <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} </select> </label> </div> <label> Requested Work <textarea required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> </div> ) : ( <div id={panelId("body-mark")} role="tabpanel" aria-labelledby={tabId("body-mark")} className="create-visit-tab-panel create-visit-body-mark-panel" > <div className="damage-capture"> <strong>Body mark</strong> <BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }} /> </div> </div> )} {error && ( <p role="alert" className="form-error"> {error} </p> )} 

### STATE-App-tsx-3284

Component: CreateVisitDialog Â· src/App.tsx:3284-3289

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
          className="sub-tabs create-visit-tabs"
          role="tablist"
          aria-label="Create visit sections"
          onKeyDown={handleTabListKeyDown}
        >
```

Content/label expression:  {(["details", "body-mark"] as const).map((item) => ( <button type="button" id={tabId(item)} aria-controls={panelId(item)} tabIndex={tab === item ? 0 : -1} key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} > {item === "details" ? "Details" : "Body Mark"} </button> ))} 

### STATE-App-tsx-3291

Component: CreateVisitDialog Â· src/App.tsx:3291-3301

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {item === "details" ? "Details" : "Body Mark"} 

### STATE-App-tsx-3307

Component: CreateVisitDialog Â· src/App.tsx:3307-3312

Tag: div; visibility: tab === "details"

```tsx
<div
            id={panelId("details")}
            role="tabpanel"
            aria-labelledby={tabId("details")}
            className="create-visit-tab-panel"
          >
```

Content/label expression:  <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Existing customer" options={customerOptions} value={form.customerId} onChange={(value) => selectCustomer(Number(value))} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > Add New Customer </button> </div> <div className="field-with-action"> <SearchSelect label="Existing vehicle" options={vehicleOptions} value={form.vehicleId} onChange={(value) => selectVehicle(Number(value))} placeholder="Search customer, phone, registration or model" /> <button type="button" className="link-action" disabled={!form.customerId} onClick={() => setQuickAdd("vehicle")} > Add New Vehicle </button> </div> <label> Customer Name <input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value }) } /> </label> <label> Mobile <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value }) } /> </label> <label> Vehicle Number <input required value={form.vehicleNo} onChange={(event) => setForm({ ...form, vehicleNo: event.target.value }) } /> </label> <label> Make <input required value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value }) } /> </label> <label> Model <input required value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value }) } /> </label> <label> Color <input value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value }) } /> </label> <label> ODO meter reading (km) <input required type="number" min="0" value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel / battery level <div className="field-pair"> <input required value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> <label> Advisor <select value={form.advisorId} onChange={(event) => setForm({ ...form, advisorId: Number(event.target.value) }) } > <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} </select> </label> </div> <label> Requested Work <textarea required rows={3} value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> 

### ACT-App-tsx-3315

Component: CreateVisitDialog Â· src/App.tsx:3315-3321

Tag: SearchSelect; visibility: tab === "details"

```tsx
<SearchSelect
                  label="Existing customer"
                  options={customerOptions}
                  value={form.customerId}
                  onChange={(value) => selectCustomer(Number(value))}
                  placeholder="Search customer or mobile"
                />
```

Content/label expression: 

### ACT-App-tsx-3322

Component: CreateVisitDialog Â· src/App.tsx:3322-3326

Tag: button; visibility: tab === "details"

```tsx
<button
                  type="button"
                  className="link-action"
                  onClick={() => setQuickAdd("customer")}
                >
```

Content/label expression: Add New Customer 

### ACT-App-tsx-3331

Component: CreateVisitDialog Â· src/App.tsx:3331-3337

Tag: SearchSelect; visibility: tab === "details"

```tsx
<SearchSelect
                  label="Existing vehicle"
                  options={vehicleOptions}
                  value={form.vehicleId}
                  onChange={(value) => selectVehicle(Number(value))}
                  placeholder="Search customer, phone, registration or model"
                />
```

Content/label expression: 

### ACT-App-tsx-3338

Component: CreateVisitDialog Â· src/App.tsx:3338-3343

Tag: button; visibility: tab === "details"

```tsx
<button
                  type="button"
                  className="link-action"
                  disabled={!form.customerId}
                  onClick={() => setQuickAdd("vehicle")}
                >
```

Content/label expression: Add New Vehicle 

### ACT-App-tsx-3349

Component: CreateVisitDialog Â· src/App.tsx:3349-3355

Tag: input; visibility: tab === "details"

```tsx
<input
                  required
                  value={form.customerName}
                  onChange={(event) =>
                    setForm({ ...form, customerName: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3359

Component: CreateVisitDialog Â· src/App.tsx:3359-3365

Tag: input; visibility: tab === "details"

```tsx
<input
                  required
                  value={form.mobile}
                  onChange={(event) =>
                    setForm({ ...form, mobile: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3369

Component: CreateVisitDialog Â· src/App.tsx:3369-3375

Tag: input; visibility: tab === "details"

```tsx
<input
                  required
                  value={form.vehicleNo}
                  onChange={(event) =>
                    setForm({ ...form, vehicleNo: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3379

Component: CreateVisitDialog Â· src/App.tsx:3379-3385

Tag: input; visibility: tab === "details"

```tsx
<input
                  required
                  value={form.make}
                  onChange={(event) =>
                    setForm({ ...form, make: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3389

Component: CreateVisitDialog Â· src/App.tsx:3389-3395

Tag: input; visibility: tab === "details"

```tsx
<input
                  required
                  value={form.model}
                  onChange={(event) =>
                    setForm({ ...form, model: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3399

Component: CreateVisitDialog Â· src/App.tsx:3399-3404

Tag: input; visibility: tab === "details"

```tsx
<input
                  value={form.color}
                  onChange={(event) =>
                    setForm({ ...form, color: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3408

Component: CreateVisitDialog Â· src/App.tsx:3408-3416

Tag: input; visibility: tab === "details"

```tsx
<input
                  required
                  type="number"
                  min="0"
                  value={form.odoReading}
                  onChange={(event) =>
                    setForm({ ...form, odoReading: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3421

Component: CreateVisitDialog Â· src/App.tsx:3421-3427

Tag: input; visibility: tab === "details"

```tsx
<input
                    required
                    value={form.fuelLevelValue}
                    onChange={(event) =>
                      setForm({ ...form, fuelLevelValue: event.target.value })
                    }
                  />
```

Content/label expression: 

### ACT-App-tsx-3428

Component: CreateVisitDialog Â· src/App.tsx:3428-3437

Tag: select; visibility: tab === "details"

```tsx
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
```

Content/label expression:  <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> 

### ACT-App-tsx-3447

Component: CreateVisitDialog Â· src/App.tsx:3447-3452

Tag: input; visibility: tab === "details"

```tsx
<input
                  value={form.keys}
                  onChange={(event) =>
                    setForm({ ...form, keys: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3456

Component: CreateVisitDialog Â· src/App.tsx:3456-3461

Tag: input; visibility: tab === "details"

```tsx
<input
                  value={form.accessories}
                  onChange={(event) =>
                    setForm({ ...form, accessories: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-3465

Component: CreateVisitDialog Â· src/App.tsx:3465-3470

Tag: select; visibility: tab === "details"

```tsx
<select
                  value={form.advisorId}
                  onChange={(event) =>
                    setForm({ ...form, advisorId: Number(event.target.value) })
                  }
                >
```

Content/label expression:  <option value={0}>Assign later</option> {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} 

### ACT-App-tsx-3485

Component: CreateVisitDialog Â· src/App.tsx:3485-3492

Tag: textarea; visibility: tab === "details"

```tsx
<textarea
                required
                rows={3}
                value={form.requestedWork}
                onChange={(event) =>
                  setForm({ ...form, requestedWork: event.target.value })
                }
              />
```

Content/label expression: 

### STATE-App-tsx-3496

Component: CreateVisitDialog Â· src/App.tsx:3496-3501

Tag: div; visibility: tab === "details"

```tsx
<div
            id={panelId("body-mark")}
            role="tabpanel"
            aria-labelledby={tabId("body-mark")}
            className="create-visit-tab-panel create-visit-body-mark-panel"
          >
```

Content/label expression:  <div className="damage-capture"> <strong>Body mark</strong> <BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${form.make} ${form.model}`, color: form.color, regNo: form.vehicleNo, }} /> </div> 

### ACT-App-tsx-3504

Component: CreateVisitDialog Â· src/App.tsx:3504-3513

Tag: BodyMarkDiagram; visibility: tab === "details"

```tsx
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
```

Content/label expression: 

### STATE-App-tsx-3518

Component: CreateVisitDialog Â· src/App.tsx:3518-3518

Tag: p; visibility: error

```tsx
<p role="alert" className="form-error">
```

Content/label expression:  {error} 

### STATE-App-tsx-3524

Component: CreateVisitDialog Â· src/App.tsx:3524-3524

Tag: Dialog; visibility: quickAdd === "customer"

```tsx
<Dialog title="Add New Customer" onClose={() => setQuickAdd(undefined)}>
```

Content/label expression:  <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> 

### ACT-App-tsx-3525

Component: CreateVisitDialog Â· src/App.tsx:3525-3539

Tag: CustomerEditor; visibility: quickAdd === "customer"

```tsx
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
```

Content/label expression: 

### STATE-App-tsx-3543

Component: CreateVisitDialog Â· src/App.tsx:3543-3543

Tag: Dialog; visibility: quickAdd === "vehicle" && form.customerId > 0

```tsx
<Dialog title="Add New Vehicle" onClose={() => setQuickAdd(undefined)}>
```

Content/label expression:  <VehicleMasterPanel key={form.customerId} embedded state={state} value={{ id: 0, customer_id: form.customerId, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => setQuickAdd(undefined)} /> 

### ACT-App-tsx-3544

Component: CreateVisitDialog Â· src/App.tsx:3544-3560

Tag: VehicleMasterPanel; visibility: quickAdd === "vehicle" && form.customerId > 0

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-3782

Component: ServiceAdvisorList Â· src/App.tsx:3782-3789

Tag: JobRecordDialog; visibility: selected && dialog === "job"

```tsx
<JobRecordDialog
          view={selected}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="view"
          onClose={() => setDialog(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-3792

Component: ServiceAdvisorList Â· src/App.tsx:3792-3799

Tag: JobRecordDialog; visibility: selected && dialog === "edit"

```tsx
<JobRecordDialog
          view={selected}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="edit"
          onClose={() => setDialog(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-3802

Component: ServiceAdvisorList Â· src/App.tsx:3802-3807

Tag: ServiceEstimateDialog; visibility: selected && dialog === "estimate"

```tsx
<ServiceEstimateDialog
          view={selected}
          actor={actor}
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-3810

Component: ServiceAdvisorList Â· src/App.tsx:3810-3815

Tag: ServiceFollowupDialog; visibility: selected && dialog === "followup"

```tsx
<ServiceFollowupDialog
          view={selected}
          mode="add"
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-3818

Component: ServiceAdvisorList Â· src/App.tsx:3818-3823

Tag: ServiceFollowupDialog; visibility: selected && dialog === "followup-view"

```tsx
<ServiceFollowupDialog
          view={selected}
          mode="view"
          mutate={mutate}
          onClose={() => setDialog(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-3837

Component: ServiceAdvisorList Â· src/App.tsx:3837-3854

Tag: JobCardFilterFields; visibility: kind === "job-cards"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-3858

Component: ServiceAdvisorList Â· src/App.tsx:3858-3866

Tag: input; visibility: kind === "job-cards"

```tsx
<input
            aria-label={`Search ${title.toLowerCase()}`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job, vehicle or customer"
          />
```

Content/label expression: 

### ACT-App-tsx-3871

Component: ServiceAdvisorList Â· src/App.tsx:3871-3880

Tag: input; visibility: kind === "job-cards"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-3884

Component: ServiceAdvisorList Â· src/App.tsx:3884-3892

Tag: select; visibility: kind === "job-cards"

```tsx
<select
              aria-label={`${title} month-year`}
              value={month}
              onChange={(event) => {
                setMonth(event.target.value);
                setDate("");
                setPage(1);
              }}
            >
```

Content/label expression:  <option value="">All months</option> {months.map((value) => ( <option key={value} value={value}> {monthYearLabel(value)} </option> ))} 

### ACT-App-tsx-3901

Component: ServiceAdvisorList Â· src/App.tsx:3901-3901

Tag: ListSearchActions; visibility: kind === "job-cards"

```tsx
<ListSearchActions onClear={clear} />
```

Content/label expression: 

### ACT-App-tsx-3905

Component: ServiceAdvisorList Â· src/App.tsx:3905-3932

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-3952

Component: ServiceAdvisorList Â· src/App.tsx:3952-3952

Tag: button; visibility: isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button type="button" className="grid-action" onClick={() => open(row, "job")}>
```

Content/label expression: View

### ACT-App-tsx-3954

Component: ServiceAdvisorList Â· src/App.tsx:3954-3954

Tag: button; visibility: actor.role === "service" && actor.id === row.job.advisor_id; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button type="button" className="grid-action" onClick={() => open(row, "edit")}>
```

Content/label expression: Edit

### STATE-App-tsx-4005

Component: ServiceAdvisorList Â· src/App.tsx:4005-4008

Tag: span; visibility: kind === "followups"; kind === "job-cards"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<span
                          className={`service-followup-status service-followup-status-${tone}`}
                          role="status"
                        >
```

Content/label expression:  {status} 

### ACT-App-tsx-4019

Component: ServiceAdvisorList Â· src/App.tsx:4019-4023

Tag: button; visibility: kind === "job-cards"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button
                              type="button"
                              className="grid-action"
                              onClick={() => open(row, "job")}
                            >
```

Content/label expression: View 

### ACT-App-tsx-4028

Component: ServiceAdvisorList Â· src/App.tsx:4028-4032

Tag: button; visibility: actor.role === "service" && actor.id === row.job.advisor_id; kind === "job-cards"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button
                                  type="button"
                                  className="grid-action"
                                  onClick={() => open(row, "edit")}
                                >
```

Content/label expression: Edit 

### ACT-App-tsx-4041

Component: ServiceAdvisorList Â· src/App.tsx:4041-4045

Tag: button; visibility: isServiceActiveJob(row); kind === "estimates"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button
                                type="button"
                                className={`workflow-action ${row.estimate ? "action-secondary" : "action-primary"}`}
                                onClick={() => open(row, "estimate")}
                              >
```

Content/label expression:  {row.estimate ? ( <> <Pencil size={15} /> Edit Estimate </> ) : ( <> <Plus size={15} /> Create Estimate </> )} 

### ACT-App-tsx-4060

Component: ServiceAdvisorList Â· src/App.tsx:4060-4063

Tag: DocumentDownloadButton; visibility: row.estimate; kind === "estimates"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<DocumentDownloadButton
                                kind="estimate"
                                view={row}
                              />
```

Content/label expression: 

### ACT-App-tsx-4069

Component: ServiceAdvisorList Â· src/App.tsx:4069-4072

Tag: button; visibility: canAddServiceFollowup(row); kind === "followups"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button
                              className="grid-action"
                              onClick={() => open(row, "followup")}
                            >
```

Content/label expression: Add Follow-up 

### ACT-App-tsx-4076

Component: ServiceAdvisorList Â· src/App.tsx:4076-4083

Tag: button; visibility: canAddServiceFollowup(row); kind === "followups"; isGridView && kind === "job-cards"; paged.totalCount

```tsx
<button
                              type="button"
                              className="grid-action"
                              onClick={() => {
                                setSelected(row);
                                setDialog("followup-view");
                              }}
                            >
```

Content/label expression: View 

### ACT-App-tsx-4100

Component: ServiceAdvisorList Â· src/App.tsx:4100-4100

Tag: FilterClearButton; visibility: paged.totalCount

```tsx
<FilterClearButton onClick={clear} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-4103

Component: ServiceAdvisorList Â· src/App.tsx:4103-4107

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### ACT-App-tsx-4125

Component: ServiceEstimateDialog Â· src/App.tsx:4125-4130

Tag: EstimateDialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<EstimateDialog
        view={view}
        actor={actor}
        mutate={mutate}
        onClose={onClose}
      />
```

Content/label expression: 

### STATE-App-tsx-4133

Component: ServiceEstimateDialog Â· src/App.tsx:4133-4137

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog
      title="View Estimate"
      subtitle={`${view.job.job_no} · ${view.estimate?.status ?? "Not created"}`}
      onClose={onClose}
    >
```

Content/label expression:  {view.estimate ? ( <div className="record-view"> {view.estimate_items.map((item) => ( <Info key={item.id} label={item.description} value={money(item.qty * item.rate)} /> ))} <Info label="Total" value={money(invoiceItemsTotal(view.estimate_items, view.estimate))} /> </div> ) : ( <p className="empty-state"> No estimate has been created for this job. </p> )} 

### STATE-App-tsx-4261

Component: ServiceFollowupDialog Â· src/App.tsx:4261-4267

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog
      wide
      className="service-followup-dialog"
      title={mode === "view" ? "Follow-up History" : "Follow-ups"}
      subtitle="Customer contact and service coordination"
      onClose={onClose}
    >
```

Content/label expression:  <div className="followup-job-card"> <div> <span>Job card</span> <strong>{view.job.job_no}</strong> </div> <div> <span>Customer</span> <strong>{view.customer.name}</strong> <a href={`tel:${view.customer.mobile}`}>{view.customer.mobile}</a> </div> <div> <span>Vehicle</span> <strong>{view.vehicle.number}</strong> <small> {view.vehicle.make} {view.vehicle.model} </small> </div> <div> <span>Current job status</span> <Status status={view.job.main_status} sub={view.job.sub_status} /> </div> </div> <div className="followup-details"> <details> <summary>Vehicle details</summary> <div> <span>Registration: {view.vehicle.number}</span> <span> Model: {view.vehicle.make} {view.vehicle.model} </span> <span>Odometer: {view.vehicle.km.toLocaleString("en-IN")} km</span> <span>Requested work: {view.visit.requested_work \|\| "—"}</span> </div> </details> <details> <summary> Requested materials ( {view.material_requests.length + view.material_purchase_requests.length} ) </summary> <div> {view.material_requests.length \|\| view.material_purchase_requests.length ? ( <> {view.material_requests.map((item) => ( <span key={`material-${item.id}`}> {materialName(item.item_id)} · {item.requested_qty} ·{" "} {item.status ?? "Requested"} </span> ))} {view.material_purchase_requests.map((item) => ( <span key={`purchase-${item.id}`}> {item.item_name} · {item.quantity} {item.unit} ·{" "} {item.status} </span> ))} </> ) : ( <span>No materials requested.</span> )} </div> </details> <details> <summary> Estimate{" "} {view.estimate ? `· ${view.estimate.status}` : "· Not created"} </summary> <div> <span>Status: {view.estimate?.status ?? "Not created"}</span> <span>Items: {view.estimate_items.length}</span> <span> Total:{" "} {money(invoiceItemsTotal(view.estimate_items, view.estimate))} </span> </div> </details> </div> <section className="followup-history" aria-label="Follow-up history"> <div className="followup-section-heading"> <h3>History</h3> <span>{history.length} saved</span> </div> {history.length ? ( history.map((item) => ( <article className={`followup-history-card ${item.done ? "done" : "open"}`} key={item.id} > <div> <span className="followup-state"> {item.done ? "Done" : "Open"} </span> <strong>{item.note}</strong> {item.outcome && <p>Outcome: {item.outcome}</p>} </div> <div className="followup-timestamps"> <span> Created {formatTimestamp(item.created_at \|\| item.due_at)} </span> {item.done && ( <span> Completed{" "} {formatTimestamp( item.updated_at \|\| item.created_at \|\| item.due_at, )} </span> )} {editable && !item.done && ( <button type="button" className="link-action" onClick={() => editOpen(item)} > Edit </button> )} {item.done && <small>Completed entries are read-only.</small>} </div> </article> )) ) : ( <p className="empty-state">No saved follow-ups.</p> )} </section> {editable && ( <form id="service-followup-form" className="followup-composer" onSubmit={(event) => save(event, false)} > <div className="followup-section-heading"> <h3>{editingId ? "Edit open follow-up" : "Add follow-up"}</h3> {editingId && ( <button type="button" className="link-action" onClick={resetComposer} > Cancel edit </button> )} </div> <label> Note <textarea data-dialog-initial-focus rows={3} required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a concise follow-up note" /> </label> <label> Outcome <small>Optional</small> <input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="Customer response or next step" /> </label> <button type="button" className={`followup-done-toggle ${done ? "checked" : ""}`} role="checkbox" aria-checked={done} onClick={() => setDone((value) => !value)} > <Check size={16} aria-hidden="true" /> Mark this follow-up done </button> <div className="followup-composer-actions"> <button type="submit" className="secondary-action"> Save Follow-up </button> <button type="button" className="primary-action" onClick={(event) => save(event as unknown as FormEvent, true)} > Save & Add Another </button> </div> </form> )} 

### ACT-App-tsx-4276

Component: ServiceFollowupDialog Â· src/App.tsx:4276-4276

Tag: a; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<a href={`tel:${view.customer.mobile}`}>
```

Content/label expression: {view.customer.mobile}

### ACT-App-tsx-4292

Component: ServiceFollowupDialog Â· src/App.tsx:4292-4292

Tag: summary; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<summary>
```

Content/label expression: Vehicle details

### ACT-App-tsx-4303

Component: ServiceFollowupDialog Â· src/App.tsx:4303-4303

Tag: summary; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<summary>
```

Content/label expression: Requested materials ( {view.material_requests.length + view.material_purchase_requests.length} ) 

### ACT-App-tsx-4332

Component: ServiceFollowupDialog Â· src/App.tsx:4332-4332

Tag: summary; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<summary>
```

Content/label expression: Estimate {" "} {view.estimate ? `· ${view.estimate.status}` : "· Not created"} 

### ACT-App-tsx-4377

Component: ServiceFollowupDialog Â· src/App.tsx:4377-4381

Tag: button; visibility: editable && !item.done; history.length

```tsx
<button
                    type="button"
                    className="link-action"
                    onClick={() => editOpen(item)}
                  >
```

Content/label expression: Edit 

### FORM-App-tsx-4394

Component: ServiceFollowupDialog Â· src/App.tsx:4394-4398

Tag: form; visibility: editable

```tsx
<form
          id="service-followup-form"
          className="followup-composer"
          onSubmit={(event) => save(event, false)}
        >
```

Content/label expression:  <div className="followup-section-heading"> <h3>{editingId ? "Edit open follow-up" : "Add follow-up"}</h3> {editingId && ( <button type="button" className="link-action" onClick={resetComposer} > Cancel edit </button> )} </div> <label> Note <textarea data-dialog-initial-focus rows={3} required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a concise follow-up note" /> </label> <label> Outcome <small>Optional</small> <input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="Customer response or next step" /> </label> <button type="button" className={`followup-done-toggle ${done ? "checked" : ""}`} role="checkbox" aria-checked={done} onClick={() => setDone((value) => !value)} > <Check size={16} aria-hidden="true" /> Mark this follow-up done </button> <div className="followup-composer-actions"> <button type="submit" className="secondary-action"> Save Follow-up </button> <button type="button" className="primary-action" onClick={(event) => save(event as unknown as FormEvent, true)} > Save & Add Another </button> </div> 

### ACT-App-tsx-4402

Component: ServiceFollowupDialog Â· src/App.tsx:4402-4406

Tag: button; visibility: editingId; editable

```tsx
<button
                type="button"
                className="link-action"
                onClick={resetComposer}
              >
```

Content/label expression: Cancel edit 

### ACT-App-tsx-4413

Component: ServiceFollowupDialog Â· src/App.tsx:4413-4420

Tag: textarea; visibility: editable

```tsx
<textarea
              data-dialog-initial-focus
              rows={3}
              required
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a concise follow-up note"
            />
```

Content/label expression: 

### ACT-App-tsx-4424

Component: ServiceFollowupDialog Â· src/App.tsx:4424-4428

Tag: input; visibility: editable

```tsx
<input
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
              placeholder="Customer response or next step"
            />
```

Content/label expression: 

### ACT-App-tsx-4430

Component: ServiceFollowupDialog Â· src/App.tsx:4430-4436

Tag: button; visibility: editable

```tsx
<button
            type="button"
            className={`followup-done-toggle ${done ? "checked" : ""}`}
            role="checkbox"
            aria-checked={done}
            onClick={() => setDone((value) => !value)}
          >
```

Content/label expression:  <Check size={16} aria-hidden="true" /> Mark this follow-up done 

### ACT-App-tsx-4440

Component: ServiceFollowupDialog Â· src/App.tsx:4440-4440

Tag: button; visibility: editable

```tsx
<button type="submit" className="secondary-action">
```

Content/label expression: Save Follow-up 

### ACT-App-tsx-4443

Component: ServiceFollowupDialog Â· src/App.tsx:4443-4447

Tag: button; visibility: editable

```tsx
<button
              type="button"
              className="primary-action"
              onClick={(event) => save(event as unknown as FormEvent, true)}
            >
```

Content/label expression: Save & Add Another 

### STATE-App-tsx-4456

Component: ServiceFollowupDialog Â· src/App.tsx:4456-4467

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <div className="followup-history"> {view.followups.length ? ( view.followups.map((item) => ( <div className="row" key={item.id}> <strong>{item.note}</strong> <span> {item.done ? "Done" : "Open"} {item.outcome ? ` · ${item.outcome}` : ""} </span> <span> {formatTimestamp( item.created_at \|\| item.updated_at \|\| item.due_at, )} </span> {editable && !item.done && ( <label className="followup-completion"> <input type="checkbox" checked={completions[item.id]?.selected ?? false} onChange={(event) => setCompletions((current) => ({ ...current, [item.id]: { selected: event.target.checked, outcome: current[item.id]?.outcome ?? "", }, })) } />{" "} Mark Done{" "} <input aria-label={`Outcome for ${item.note}`} value={completions[item.id]?.outcome ?? ""} disabled={!completions[item.id]?.selected} onChange={(event) => setCompletions((current) => ({ ...current, [item.id]: { selected: current[item.id]?.selected ?? false, outcome: event.target.value, }, })) } placeholder="Outcome" /> </label> )} </div> )) ) : ( <p className="empty-state">No saved follow-ups.</p> )} </div> {editable && ( <form id="service-followup-form" onSubmit={save}> <label> Note <input data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a follow-up note" /> </label> <label> Outcome <input value={outcome} onChange={(event) => setOutcome(event.target.value)} /> </label> <label className="checkbox-line"> <input type="checkbox" checked={done} onChange={(event) => setDone(event.target.checked)} />{" "} Mark new follow-up Done </label> </form> )} 

### ACT-App-tsx-4462

Component: ServiceFollowupDialog Â· src/App.tsx:4462-4462

Tag: button; visibility: editable

```tsx
<button form="service-followup-form" className="primary-action">
```

Content/label expression: Save Follow-up 

### ACT-App-tsx-4484

Component: ServiceFollowupDialog Â· src/App.tsx:4484-4496

Tag: input; visibility: editable && !item.done; view.followups.length

```tsx
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
                  />
```

Content/label expression: 

### ACT-App-tsx-4498

Component: ServiceFollowupDialog Â· src/App.tsx:4498-4512

Tag: input; visibility: editable && !item.done; view.followups.length

```tsx
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
```

Content/label expression: 

### FORM-App-tsx-4522

Component: ServiceFollowupDialog Â· src/App.tsx:4522-4522

Tag: form; visibility: editable

```tsx
<form id="service-followup-form" onSubmit={save}>
```

Content/label expression:  <label> Note <input data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a follow-up note" /> </label> <label> Outcome <input value={outcome} onChange={(event) => setOutcome(event.target.value)} /> </label> <label className="checkbox-line"> <input type="checkbox" checked={done} onChange={(event) => setDone(event.target.checked)} />{" "} Mark new follow-up Done </label> 

### ACT-App-tsx-4525

Component: ServiceFollowupDialog Â· src/App.tsx:4525-4530

Tag: input; visibility: editable

```tsx
<input
              data-dialog-initial-focus
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a follow-up note"
            />
```

Content/label expression: 

### ACT-App-tsx-4534

Component: ServiceFollowupDialog Â· src/App.tsx:4534-4537

Tag: input; visibility: editable

```tsx
<input
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)}
            />
```

Content/label expression: 

### ACT-App-tsx-4540

Component: ServiceFollowupDialog Â· src/App.tsx:4540-4544

Tag: input; visibility: editable

```tsx
<input
              type="checkbox"
              checked={done}
              onChange={(event) => setDone(event.target.checked)}
            />
```

Content/label expression: 

### ACT-App-tsx-4599

Component: MaterialProcurementTriage Â· src/App.tsx:4599-4599

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="secondary-action" onClick={onOpenIssueMaterial}>
```

Content/label expression: Open Issue Material

### ACT-App-tsx-4608

Component: MaterialProcurementTriage Â· src/App.tsx:4608-4608

Tag: select; visibility: procurement.length > 1

```tsx
<select aria-label="Procurement material request" value={selectedProcurement?.request.id ?? ""} onChange={(event) => setSelectedProcurementRequestId(Number(event.target.value))}>
```

Content/label expression:  {procurement.map(({ view, request, item }) => <option key={request.id} value={request.id}>{view.job.job_no} · {item?.sku ?? "SKU"} · {Math.max(0, request.requested_qty - request.issued_qty)} {item?.unit ?? "units"}</option>)} 

### ACT-App-tsx-4613

Component: MaterialProcurementTriage Â· src/App.tsx:4613-4623

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
          }}>
```

Content/label expression: Create Purchase Request

### ACT-App-tsx-4629

Component: MaterialProcurementTriage Â· src/App.tsx:4629-4629

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" onClick={() => onCreatePurchaseRequest({ source: "New Item Request", lines: [{ item_name: "", unit: "piece", ordered_qty: 1 }] })}>
```

Content/label expression: Create New Item Request

### STATE-App-tsx-4702

Component: StoreDesk Â· src/App.tsx:4702-4702

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="sub-tabs" role="tablist" aria-label="Stock views">
```

Content/label expression:  {(["Inventory List", "Low Stock", "Stock Movements"] as const).map( (tab) => ( <button key={tab} role="tab" aria-selected={stockTab === tab} className={stockTab === tab ? "active" : ""} onClick={() => setStockTab(tab)} > {tab} </button> ), )} 

### STATE-App-tsx-4705

Component: StoreDesk Â· src/App.tsx:4705-4711

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                  key={tab}
                  role="tab"
                  aria-selected={stockTab === tab}
                  className={stockTab === tab ? "active" : ""}
                  onClick={() => setStockTab(tab)}
                >
```

Content/label expression:  {tab} 

### ACT-App-tsx-4743

Component: StoreDesk Â· src/App.tsx:4743-4763

Tag: StoreList; visibility: stockTab === "Inventory List"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-4754

Component: StoreDesk Â· src/App.tsx:4754-4759

Tag: button; visibility: actor.role === "admin"; stockTab === "Inventory List"

```tsx
<button
                type="button"
                className="primary-action"
                aria-haspopup="dialog"
                onClick={() => setQuickAddStockOpen(true)}
              >
```

Content/label expression:  <Plus size={16} /> Quick Add Stock 

### ACT-App-tsx-4766

Component: StoreDesk Â· src/App.tsx:4766-4773

Tag: StoreList; visibility: stockTab === "Low Stock"

```tsx
<StoreList
            key="low-stock"
            kind="stock"
            inventory={lowStock}
            requests={requests}
            onOpenJob={openJob}
            filterLayout={filterLayout}
          />
```

Content/label expression: 

### STATE-App-tsx-4779

Component: StoreDesk Â· src/App.tsx:4779-4783

Tag: Dialog; visibility: actor.role === "admin" && quickAddStockOpen

```tsx
<Dialog
            title="Quick Add Stock"
            subtitle="Record an inward against an existing SKU or create a new SKU"
            onClose={() => setQuickAddStockOpen(false)}
          >
```

Content/label expression:  <QuickAddStock inventory={state.inventory} actor={actor} purchaseOrders={state.purchase_orders} purchaseOrderLines={state.purchase_order_lines} mutate={mutate} onSaved={() => setQuickAddStockOpen(false)} /> 

### ACT-App-tsx-4784

Component: StoreDesk Â· src/App.tsx:4784-4791

Tag: QuickAddStock; visibility: actor.role === "admin" && quickAddStockOpen

```tsx
<QuickAddStock
              inventory={state.inventory}
              actor={actor}
              purchaseOrders={state.purchase_orders}
              purchaseOrderLines={state.purchase_order_lines}
              mutate={mutate}
              onSaved={() => setQuickAddStockOpen(false)}
            />
```

Content/label expression: 

### ACT-App-tsx-4795

Component: StoreDesk Â· src/App.tsx:4795-4799

Tag: EditStockDetailsDialog; visibility: editingStock

```tsx
<EditStockDetailsDialog
            item={editingStock}
            mutate={mutate}
            onClose={() => setEditingStock(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-4807

Component: StoreDesk Â· src/App.tsx:4807-4814

Tag: MaterialProcurementTriage; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<MaterialProcurementTriage
          requests={requests}
          purchaseOrders={state.purchase_orders}
          purchaseOrderLines={state.purchase_order_lines}
          inventory={state.inventory}
          onOpenIssueMaterial={() => onNavigate?.("Issue Material")}
          onCreatePurchaseRequest={(draft) => onCreatePurchaseRequest?.(draft)}
        />
```

Content/label expression: 

### ACT-App-tsx-4815

Component: StoreDesk Â· src/App.tsx:4815-4826

Tag: StoreList; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-4828

Component: StoreDesk Â· src/App.tsx:4828-4828

Tag: summary; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<summary>
```

Content/label expression: Procurement and issue workflow

### ACT-App-tsx-4832

Component: StoreDesk Â· src/App.tsx:4832-4837

Tag: MaterialApprovalSubmitDialog; visibility: approvalCandidate

```tsx
<MaterialApprovalSubmitDialog
            row={approvalCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setApprovalCandidate(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-4840

Component: StoreDesk Â· src/App.tsx:4840-4847

Tag: JobRecordDialog; visibility: viewJob

```tsx
<JobRecordDialog
            view={viewJob}
            state={state}
            mutate={mutate}
            actor={actor}
            mode="view"
            onClose={() => setViewJobId(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-4858

Component: StoreDesk Â· src/App.tsx:4858-4869

Tag: StoreList; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-4871

Component: StoreDesk Â· src/App.tsx:4871-4871

Tag: summary; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<summary>
```

Content/label expression: Issue workflow

### ACT-App-tsx-4875

Component: StoreDesk Â· src/App.tsx:4875-4880

Tag: ReleaseMaterialDialog; visibility: releaseCandidate

```tsx
<ReleaseMaterialDialog
            row={releaseCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setReleaseCandidate(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-4883

Component: StoreDesk Â· src/App.tsx:4883-4888

Tag: MaterialApprovalSubmitDialog; visibility: approvalCandidate

```tsx
<MaterialApprovalSubmitDialog
            row={approvalCandidate}
            actor={actor}
            mutate={mutate}
            onClose={() => setApprovalCandidate(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-4891

Component: StoreDesk Â· src/App.tsx:4891-4898

Tag: JobRecordDialog; visibility: viewJob

```tsx
<JobRecordDialog
            view={viewJob}
            state={state}
            mutate={mutate}
            actor={actor}
            mode="view"
            onClose={() => setViewJobId(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-4908

Component: StoreDesk Â· src/App.tsx:4908-4916

Tag: StoreList; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<StoreList
        key={activeMenuItem}
        kind="reconcile"
        inventory={state.inventory}
        requests={reconcileRequests}
        onOpenJob={openJob}
        onReconcile={setReconcileCandidate}
        filterLayout={filterLayout}
      />
```

Content/label expression: 

### ACT-App-tsx-4918

Component: StoreDesk Â· src/App.tsx:4918-4922

Tag: ReconcileEditor; visibility: reconcileCandidate

```tsx
<ReconcileEditor
          row={reconcileCandidate}
          mutate={mutate}
          onClose={() => setReconcileCandidate(undefined)}
        />
```

Content/label expression: 

### FORM-App-tsx-4979

Component: PurchaseStockIssueEditor Â· src/App.tsx:4979-4979

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="desk-panel" onSubmit={save}>
```

Content/label expression:  <PanelTitle icon={<PackageCheck />} title="Purchase, Stock & Issue" subtitle="Complete a requested new item in one audited operation" /> {!pending.length ? ( <p className="empty-state">No pending new-item requests.</p> ) : ( <> <label> Pending request <select value={requestId} onChange={(event) => setRequestId(Number(event.target.value))} > {pending.map(({ view, purchaseRequest }) => ( <option key={purchaseRequest.id} value={purchaseRequest.id}> {view.job.job_no} · {purchaseRequest.item_name} ·{" "} {purchaseRequest.quantity} {purchaseRequest.unit} </option> ))} </select> </label> <label> Map to inventory item (optional) <select value={itemId} onChange={(event) => setItemId(Number(event.target.value))} > <option value={0}>Create inventory item</option> {state.inventory .filter((item) => item.unit === selected?.purchaseRequest.unit) .map((item) => ( <option key={item.id} value={item.id}> {item.name} · {item.sku} </option> ))} </select> </label> {!itemId && ( <div className="form-grid"> <label> SKU <input value={sku} onChange={(event) => setSku(event.target.value)} placeholder={`LOCAL-${requestId}`} /> </label> <label> Category <input value={category} onChange={(event) => setCategory(event.target.value)} /> </label> </div> )} <div className="form-grid"> <label> Unit cost <input required type="number" min="0" step="0.01" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))} /> </label> <label> Vendor / shop <input required value={vendor} onChange={(event) => setVendor(event.target.value)} /> </label> <label> Bill / reference <input required value={billReference} onChange={(event) => setBillReference(event.target.value)} /> </label> </div> <label> Note (optional) <textarea value={note} onChange={(event) => setNote(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} <button className="primary-action">Purchase, Stock & Issue</button> </> )} 

### ACT-App-tsx-4991

Component: PurchaseStockIssueEditor Â· src/App.tsx:4991-4994

Tag: select; visibility: !pending.length

```tsx
<select
              value={requestId}
              onChange={(event) => setRequestId(Number(event.target.value))}
            >
```

Content/label expression:  {pending.map(({ view, purchaseRequest }) => ( <option key={purchaseRequest.id} value={purchaseRequest.id}> {view.job.job_no} · {purchaseRequest.item_name} ·{" "} {purchaseRequest.quantity} {purchaseRequest.unit} </option> ))} 

### ACT-App-tsx-5005

Component: PurchaseStockIssueEditor Â· src/App.tsx:5005-5008

Tag: select; visibility: !pending.length

```tsx
<select
              value={itemId}
              onChange={(event) => setItemId(Number(event.target.value))}
            >
```

Content/label expression:  <option value={0}>Create inventory item</option> {state.inventory .filter((item) => item.unit === selected?.purchaseRequest.unit) .map((item) => ( <option key={item.id} value={item.id}> {item.name} · {item.sku} </option> ))} 

### ACT-App-tsx-5023

Component: PurchaseStockIssueEditor Â· src/App.tsx:5023-5027

Tag: input; visibility: !itemId; !pending.length

```tsx
<input
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder={`LOCAL-${requestId}`}
                />
```

Content/label expression: 

### ACT-App-tsx-5031

Component: PurchaseStockIssueEditor Â· src/App.tsx:5031-5034

Tag: input; visibility: !itemId; !pending.length

```tsx
<input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
```

Content/label expression: 

### ACT-App-tsx-5041

Component: PurchaseStockIssueEditor Â· src/App.tsx:5041-5048

Tag: input; visibility: !pending.length

```tsx
<input
                required
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(event) => setUnitCost(Number(event.target.value))}
              />
```

Content/label expression: 

### ACT-App-tsx-5052

Component: PurchaseStockIssueEditor Â· src/App.tsx:5052-5056

Tag: input; visibility: !pending.length

```tsx
<input
                required
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
              />
```

Content/label expression: 

### ACT-App-tsx-5060

Component: PurchaseStockIssueEditor Â· src/App.tsx:5060-5064

Tag: input; visibility: !pending.length

```tsx
<input
                required
                value={billReference}
                onChange={(event) => setBillReference(event.target.value)}
              />
```

Content/label expression: 

### ACT-App-tsx-5069

Component: PurchaseStockIssueEditor Â· src/App.tsx:5069-5072

Tag: textarea; visibility: !pending.length

```tsx
<textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
```

Content/label expression: 

### STATE-App-tsx-5075

Component: PurchaseStockIssueEditor Â· src/App.tsx:5075-5075

Tag: p; visibility: error; !pending.length

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-5079

Component: PurchaseStockIssueEditor Â· src/App.tsx:5079-5079

Tag: button; visibility: !pending.length

```tsx
<button className="primary-action">
```

Content/label expression: Purchase, Stock & Issue

### ACT-App-tsx-5358

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5358-5358

Tag: button; visibility: (actor.role === "admin" \|\| actor.role === "store")

```tsx
<button className="primary-action" onClick={openNew}>
```

Content/label expression:  <Plus size={16} /> New Purchase Request 

### ACT-App-tsx-5366

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5366-5371

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Search purchase orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="PO number or supplier"
            />
```

Content/label expression: 

### ACT-App-tsx-5375

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5375-5379

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              aria-label="Purchase order status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
```

Content/label expression:  <option value="ALL">All statuses</option> {[ "PO Request", "PO Request Approved", "PO Issued", "PO Received", "PO Confirmation", "Draft", "Sent", "Partially Received", "Ready to Close", "Closed", "Cancelled", ].map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-5398

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5398-5403

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-5429

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5429-5433

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<tr
                    key={order.id}
                    className="clickable-row"
                    onClick={() => openView(order)}
                  >
```

Content/label expression:  <td>{order.po_number}</td> <td>{order.order_date}</td> <td>{supplierName(order.supplier_id)}</td> <td> {orderLines.reduce( (sum, line) => sum + line.ordered_qty, 0, )} </td> <td>{received}</td> <td>{money(order.total)}</td> <td> <span className="status-badge">{order.status}</span> </td> <td> <div className="grid-actions purchase-order-actions"> {order.status === "PO Request" && (actor.role === "admin" \|\| order.created_by === actor.id) && ( <button type="button" className="workflow-action action-secondary purchase-order-action" onClick={(event) => { event.stopPropagation(); openEdit(order); }} > <Pencil size={15} /> Edit </button> )} <button type="button" className="workflow-action action-document purchase-order-action" onClick={(event) => { event.stopPropagation(); openView(order); }} > <Workflow size={15} /> Process </button> </div> </td> 

### ACT-App-tsx-5452

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5452-5459

Tag: button; visibility: order.status === "PO Request" && (actor.role === "admin" \|\| order.created_by === actor.id)

```tsx
<button
                            type="button"
                            className="workflow-action action-secondary purchase-order-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(order);
                            }}
                          >
```

Content/label expression:  <Pencil size={15} /> Edit 

### ACT-App-tsx-5464

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5464-5471

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                          type="button"
                          className="workflow-action action-document purchase-order-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            openView(order);
                          }}
                        >
```

Content/label expression:  <Workflow size={15} /> Process 

### STATE-App-tsx-5485

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5485-5501

Tag: Dialog; visibility: dialog === "form"

```tsx
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
```

Content/label expression:  <div className="inward-dialog-content"> <div className="form-grid"> <label> PO number <input aria-label="PO number" value={selected?.po_number ?? nextPurchaseRequestNumber} disabled readOnly /> </label> <label> Order date <input aria-label="PO order date" type="date" value={orderDate} onChange={(event) => setOrderDate(event.target.value)} /> </label> <label> Notes <input aria-label="PO notes" value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <label> Supplier <input aria-label="PO supplier" value="Assigned by Admin after request" disabled readOnly /> </label> </div> <section> <div className="receipt-lines-heading"> <h4>Order lines</h4> <button type="button" onClick={() => state.inventory[0] && setLines((current) => [ ...current, { key: crypto.randomUUID(), item_id: state.inventory[0].id, new_item: false, ordered_qty: 1, }, ]) } > Add line </button> </div> {lines.map((line, index) => ( <div className={`receipt-line-row purchase-request-line-row${line.new_item ? " purchase-request-line-row--new" : ""}`} key={line.key} > <label> Item type <select value={line.new_item ? "new" : "inventory"} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, new_item: event.target.value === "new", item_id: event.target.value === "new" ? undefined : state.inventory[0]?.id, item_name: "", unit: "" } : candidate))}> <option value="inventory">Existing inventory SKU</option> <option value="new">New item request</option> </select> </label> {line.new_item ? ( <> <label>New item name<input aria-label={`PO line ${index + 1} new item name`} value={line.item_name ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_name: event.target.value } : candidate))} /></label> <label>Unit<input aria-label={`PO line ${index + 1} unit`} value={line.unit ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, unit: event.target.value } : candidate))} /></label> </> ) : <InventoryPicker inventory={state.inventory} value={line.item_id ?? 0} onChange={(item_id) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_id } : candidate))} label={`PO line ${index + 1} item`} />} <label> Qty <input aria-label={`PO line ${index + 1} quantity`} type="number" min="0.01" value={line.ordered_qty} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, ordered_qty: Number(event.target.value), } : candidate, ), ) } /> </label> <button type="button" className="danger-action" onClick={() => setLines((current) => current.filter( (candidate) => candidate.key !== line.key, ), ) } > Remove </button> </div> ))} </section> </div> 

### ACT-App-tsx-5492

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5492-5497

Tag: button; visibility: dialog === "form"

```tsx
<button
              type="button"
              className="primary-action"
              disabled={!valid}
              onClick={save}
            >
```

Content/label expression:  {selectedId ? "Save request" : "Create request"} 

### ACT-App-tsx-5506

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5506-5511

Tag: input; visibility: dialog === "form"

```tsx
<input
                  aria-label="PO number"
                  value={selected?.po_number ?? nextPurchaseRequestNumber}
                  disabled
                  readOnly
                />
```

Content/label expression: 

### ACT-App-tsx-5515

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5515-5520

Tag: input; visibility: dialog === "form"

```tsx
<input
                  aria-label="PO order date"
                  type="date"
                  value={orderDate}
                  onChange={(event) => setOrderDate(event.target.value)}
                />
```

Content/label expression: 

### ACT-App-tsx-5524

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5524-5528

Tag: input; visibility: dialog === "form"

```tsx
<input
                  aria-label="PO notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
```

Content/label expression: 

### ACT-App-tsx-5532

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5532-5537

Tag: input; visibility: dialog === "form"

```tsx
<input
                  aria-label="PO supplier"
                  value="Assigned by Admin after request"
                  disabled
                  readOnly
                />
```

Content/label expression: 

### ACT-App-tsx-5543

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5543-5557

Tag: button; visibility: dialog === "form"

```tsx
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
```

Content/label expression: Add line 

### ACT-App-tsx-5568

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5568-5568

Tag: select; visibility: dialog === "form"

```tsx
<select value={line.new_item ? "new" : "inventory"} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, new_item: event.target.value === "new", item_id: event.target.value === "new" ? undefined : state.inventory[0]?.id, item_name: "", unit: "" } : candidate))}>
```

Content/label expression:  <option value="inventory">Existing inventory SKU</option> <option value="new">New item request</option> 

### ACT-App-tsx-5575

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5575-5575

Tag: input; visibility: line.new_item; dialog === "form"

```tsx
<input aria-label={`PO line ${index + 1} new item name`} value={line.item_name ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_name: event.target.value } : candidate))} />
```

Content/label expression: 

### ACT-App-tsx-5576

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5576-5576

Tag: input; visibility: line.new_item; dialog === "form"

```tsx
<input aria-label={`PO line ${index + 1} unit`} value={line.unit ?? ""} onChange={(event) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, unit: event.target.value } : candidate))} />
```

Content/label expression: 

### ACT-App-tsx-5578

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5578-5578

Tag: InventoryPicker; visibility: line.new_item; dialog === "form"

```tsx
<InventoryPicker inventory={state.inventory} value={line.item_id ?? 0} onChange={(item_id) => setLines((current) => current.map((candidate) => candidate.key === line.key ? { ...candidate, item_id } : candidate))} label={`PO line ${index + 1} item`} />
```

Content/label expression: 

### ACT-App-tsx-5581

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5581-5598

Tag: input; visibility: dialog === "form"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-5600

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5600-5610

Tag: button; visibility: dialog === "form"

```tsx
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
```

Content/label expression: Remove 

### STATE-App-tsx-5620

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5620-5765

Tag: Dialog; visibility: dialog === "view" && selected

```tsx
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
```

Content/label expression:  <div className="inward-dialog-content"> <PurchaseOrderLifecycle status={selected.status} /> {selected.status === "Closed" && ( <section className="purchase-order-stage-context" aria-label="Closed Purchase Order audit"> <strong>PO Closed — view only</strong> <p> Accepted quantities were posted to Stock Inward at closure. This commercial record is locked for audit. </p> <button type="button" className="workflow-action action-document" onClick={() => downloadClosedAudit(selected, selectedLines)} > <Download size={15} /> Download closed PO audit </button> </section> )} {selected.status === "PO Request Approved" && ( <p className="purchase-order-stage-context"> {actor.role === "admin" ? "This Purchase Order is fully approved. Issue it to its assigned supplier when you are ready to request delivery." : "This Purchase Order is fully approved and awaiting Admin issue to its assigned supplier."} </p> )} {[ "PO Issued", "PO Received", "PO Confirmation", "Closed", "Partially Received", "Ready to Close", ].includes(selected.status) && ( <SupplierBasket supplier={state.suppliers.find( (supplier) => supplier.id === selected.supplier_id, )} lines={selectedLines} /> )} <p> <strong>Order vs received:</strong> {totalOrdered} ordered ·{" "} {totalReceived} received · {totalOrdered - totalReceived}{" "} remaining · {money(receivedValue)} received value </p> <p className="muted"> Delivery does not update inventory. Admin confirms every delivered unit as accepted, returned, damaged, or wasted before the PO can close. </p> <div className="table-wrap"> <table aria-label="Purchase order reconciliation"> <thead> <tr> <th>Item</th> <th>Ordered</th> <th>Delivered</th> <th>Outstanding</th> <th>Accepted</th> <th>Exceptions</th> </tr> </thead> <tbody> {selectedLines.map((line) => { const received = deliveredFor(line); const confirmation = confirmationFor(line); const item = state.inventory.find( (candidate) => candidate.id === line.item_id, ); return ( <tr key={line.id}> <td> {item?.sku} · {item?.name} </td> <td>{line.ordered_qty}</td> <td>{received}</td> <td>{Math.max(0, line.ordered_qty - received)}</td> <td>{confirmation?.accepted_qty ?? "—"}</td> <td>{confirmation ? `${confirmation.returned_qty} returned / ${confirmation.damaged_qty} damaged / ${confirmation.wasted_qty} wasted` : "—"}</td> </tr> ); })} </tbody> </table> </div> {actor.role === "admin" && selected.status === "PO Request" && <PreviousPriceReview state={state} order={selected} lines={selectedLines} actor={actor} mutate={mutate} />} <h4>Linked stock inward history</h4> {state.stock_inwards.filter( (inward) => inward.purchase_order_id === selected.id, ).length ? ( <ul> {state.stock_inwards .filter((inward) => inward.purchase_order_id === selected.id) .map((inward) => ( <li key={inward.id}> {inward.received_at}: {inward.qty}{" "} { state.inventory.find( (item) => item.id === inward.item_id, )?.unit }{" "} · {inward.note} </li> ))} </ul> ) : ( <p className="empty-state">No linked receipts yet.</p> )} {selected.status === "Cancelled" && totalReceived < totalOrdered && ( <p className="error-text"> Outstanding balance cancelled: {totalOrdered - totalReceived}{" "} not received. </p> )} </div> 

### ACT-App-tsx-5629

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5629-5633

Tag: button; visibility: selected.status === "Draft" && actor.role === "admin"; dialog === "view" && selected

```tsx
<button
                    type="button"
                    className="primary-action"
                    onClick={() => openEdit(selected)}
                  >
```

Content/label expression: Edit draft 

### ACT-App-tsx-5636

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5636-5648

Tag: button; visibility: selected.status === "Draft" && actor.role === "admin"; dialog === "view" && selected

```tsx
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
```

Content/label expression: Send saved PO 

### ACT-App-tsx-5657

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5657-5661

Tag: button; visibility: actor.role === "admin"; selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id); dialog === "view" && selected

```tsx
<button
                        type="button"
                        className="primary-action"
                        onClick={() => beginApproval(selected)}
                      >
```

Content/label expression: Review & approve request 

### ACT-App-tsx-5665

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5665-5669

Tag: button; visibility: selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id); dialog === "view" && selected

```tsx
<button
                      type="button"
                      className="primary-action"
                      onClick={() => openEdit(selected)}
                    >
```

Content/label expression: Edit request 

### ACT-App-tsx-5672

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5672-5680

Tag: button; visibility: selected.status === "PO Request" && (actor.role === "admin" \|\| selected.created_by === actor.id); dialog === "view" && selected

```tsx
<button
                      type="button"
                      className="danger-action"
                      onClick={() =>
                        mutate((db) =>
                          cancelPurchaseRequestForActor(db, selected.id, actor.id),
                        )
                      }
                    >
```

Content/label expression: Cancel request 

### ACT-App-tsx-5686

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5686-5694

Tag: button; visibility: selected.status === "PO Request Approved" && actor.role === "admin"; dialog === "view" && selected

```tsx
<button
                  type="button"
                  className="primary-action"
                  onClick={() =>
                    mutate((db) =>
                      issuePurchaseOrderForActor(db, selected.id, actor.id),
                    )
                  }
                >
```

Content/label expression: Issue Purchase Order 

### ACT-App-tsx-5699

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5699-5699

Tag: button; visibility: actor.role === "admin" && ["PO Issued", "PO Received"].includes(selected.status); dialog === "view" && selected

```tsx
<button type="button" className="primary-action" onClick={() => beginReceipt(selected)}>
```

Content/label expression: Record delivery 

### ACT-App-tsx-5704

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5704-5704

Tag: button; visibility: actor.role === "admin" && selected.status === "PO Received"; dialog === "view" && selected

```tsx
<button type="button" onClick={() => beginConfirmation(selected)}>
```

Content/label expression: Confirm quantities 

### ACT-App-tsx-5709

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5709-5717

Tag: button; visibility: actor.role === "admin" && selected.status === "PO Confirmation"; dialog === "view" && selected

```tsx
<button
                  type="button"
                  className="primary-action"
                  onClick={() =>
                    mutate((db) =>
                      closePurchaseOrderForActor(db, selected.id, actor.id),
                    )
                  }
                >
```

Content/label expression: Close PO & post Stock Inward 

### ACT-App-tsx-5727

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5727-5740

Tag: button; visibility: actor.role === "admin" && [ "Draft", "Sent", "Partially Received", "Ready to Close", ].includes(selected.status); dialog === "view" && selected

```tsx
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
```

Content/label expression: Cancel PO 

### ACT-App-tsx-5747

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5747-5759

Tag: button; visibility: actor.role === "admin" && ["Sent", "Partially Received", "Ready to Close"].includes( selected.status, ); dialog === "view" && selected

```tsx
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
```

Content/label expression: Close PO 

### ACT-App-tsx-5774

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5774-5778

Tag: button; visibility: selected.status === "Closed"; dialog === "view" && selected

```tsx
<button
                  type="button"
                  className="workflow-action action-document"
                  onClick={() => downloadClosedAudit(selected, selectedLines)}
                >
```

Content/label expression:  <Download size={15} /> Download closed PO audit 

### STATE-App-tsx-5883

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5883-5891

Tag: Dialog; visibility: dialog === "receipt" && selected

```tsx
<Dialog
          title={`Record delivery — ${selected.po_number}`}
          subtitle="Enter this supplier delivery only. Inventory will not change until the confirmed PO is closed."
          onClose={close}
          footer={<button type="button" className="primary-action" onClick={() => {
            const lines = receiptLines.filter((line) => line.delivered_qty > 0);
            if (mutate((db) => recordPurchaseOrderReceiptForActor(db, selected.id, actor.id, { lines }))) setDialog("view");
          }}>Save delivery</button>}
        >
```

Content/label expression:  <div className="inward-dialog-content" aria-label="Purchase Order delivery receipt"> {selectedLines.map((line, index) => { const item = state.inventory.find((candidate) => candidate.id === line.item_id); const delivered = deliveredFor(line); const formLine = receiptLines.find((candidate) => candidate.purchase_order_line_id === line.id); return <label key={line.id} className="receipt-line-row"> {item?.sku} · {item?.name ?? line.item_name} — ordered {line.ordered_qty}, delivered {delivered}, outstanding {line.ordered_qty - delivered} <input aria-label={`Delivered quantity for PO line ${index + 1}`} type="number" min="0" max={Math.max(0, line.ordered_qty - delivered)} step="0.01" value={formLine?.delivered_qty \|\| ""} onChange={(event) => setReceiptLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, delivered_qty: Number(event.target.value) } : candidate))} /> </label>; })} </div> 

### ACT-App-tsx-5887

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5887-5890

Tag: button; visibility: dialog === "receipt" && selected

```tsx
<button type="button" className="primary-action" onClick={() => {
            const lines = receiptLines.filter((line) => line.delivered_qty > 0);
            if (mutate((db) => recordPurchaseOrderReceiptForActor(db, selected.id, actor.id, { lines }))) setDialog("view");
          }}>
```

Content/label expression: Save delivery

### ACT-App-tsx-5899

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5899-5899

Tag: input; visibility: dialog === "receipt" && selected

```tsx
<input aria-label={`Delivered quantity for PO line ${index + 1}`} type="number" min="0" max={Math.max(0, line.ordered_qty - delivered)} step="0.01" value={formLine?.delivered_qty || ""} onChange={(event) => setReceiptLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, delivered_qty: Number(event.target.value) } : candidate))} />
```

Content/label expression: 

### STATE-App-tsx-5906

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5906-5914

Tag: Dialog; visibility: dialog === "confirm" && selected

```tsx
<Dialog
          wide
          title={`Confirm quantities — ${selected.po_number}`}
          subtitle="Every delivered unit must be accepted, returned, damaged, or wasted before this PO can move to confirmation."
          onClose={close}
          footer={<button type="button" className="primary-action" onClick={() => {
            if (mutate((db) => confirmPurchaseOrderForActor(db, selected.id, actor.id, { lines: confirmationLines }))) setDialog("view");
          }}>Confirm quantities</button>}
        >
```

Content/label expression:  <div className="inward-dialog-content" aria-label="Purchase Order quality confirmation"> {selectedLines.map((line, index) => { const item = state.inventory.find((candidate) => candidate.id === line.item_id); const delivered = deliveredFor(line); const formLine = confirmationLines.find((candidate) => candidate.purchase_order_line_id === line.id); if (!formLine) return null; const update = (patch: Partial<typeof formLine>) => setConfirmationLines((current) => current.map((candidate) => candidate.purchase_order_line_id === line.id ? { ...candidate, ...patch } : candidate)); return <section className="approval-line" key={line.id}> <h4>{index + 1}. {item?.sku} · {item?.name ?? line.item_name} <span className="muted">Delivered {delivered} / ordered {line.ordered_qty}</span></h4> <div className="form-grid"> <label>Accepted<input aria-label={`Accepted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.accepted_qty} onChange={(event) => update({ accepted_qty: Number(event.target.value) })} /></label> <label>Returned<input aria-label={`Returned quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.returned_qty} onChange={(event) => update({ returned_qty: Number(event.target.value) })} /></label> <label>Damaged<input aria-label={`Damaged quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.damaged_qty} onChange={(event) => update({ damaged_qty: Number(event.target.value) })} /></label> <label>Wasted<input aria-label={`Wasted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.wasted_qty} onChange={(event) => update({ wasted_qty: Number(event.target.value) })} /></label> </div> </section>; })} </div> 

### ACT-App-tsx-5911

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5911-5913

Tag: button; visibility: dialog === "confirm" && selected

```tsx
<button type="button" className="primary-action" onClick={() => {
            if (mutate((db) => confirmPurchaseOrderForActor(db, selected.id, actor.id, { lines: confirmationLines }))) setDialog("view");
          }}>
```

Content/label expression: Confirm quantities

### ACT-App-tsx-5925

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5925-5925

Tag: input; visibility: dialog === "confirm" && selected

```tsx
<input aria-label={`Accepted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.accepted_qty} onChange={(event) => update({ accepted_qty: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-App-tsx-5926

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5926-5926

Tag: input; visibility: dialog === "confirm" && selected

```tsx
<input aria-label={`Returned quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.returned_qty} onChange={(event) => update({ returned_qty: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-App-tsx-5927

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5927-5927

Tag: input; visibility: dialog === "confirm" && selected

```tsx
<input aria-label={`Damaged quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.damaged_qty} onChange={(event) => update({ damaged_qty: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-App-tsx-5928

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5928-5928

Tag: input; visibility: dialog === "confirm" && selected

```tsx
<input aria-label={`Wasted quantity for PO line ${index + 1}`} type="number" min="0" step="0.01" value={formLine.wasted_qty} onChange={(event) => update({ wasted_qty: Number(event.target.value) })} />
```

Content/label expression: 

### STATE-App-tsx-5936

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5936-5942

Tag: Dialog; visibility: dialog === "approve" && selected

```tsx
<Dialog
          wide
          title={`Approve ${selected.po_number}`}
          subtitle="Assign each line to an active supplier and enter its pre-GST price. Different suppliers create traceable supplier-specific Purchase Orders."
          onClose={close}
          footer={<button type="button" className="primary-action" onClick={approveRequest}>Approve Purchase Request</button>}
        >
```

Content/label expression:  <div className="inward-dialog-content" aria-label="Purchase Request commercial approval"> <p className="muted">New Item Requests need catalogue details now. Their SKU is created with zero stock and will not become issuable until later receipt and closure steps.</p> {selectedLines.map((requestLine, index) => { const formLine = approvalLines.find((line) => line.purchase_order_line_id === requestLine.id); if (!formLine) return null; const item = state.inventory.find((candidate) => candidate.id === requestLine.item_id); const update = (patch: Partial<PurchaseRequestApprovalFormLine>) => setApprovalLines((current) => current.map((line) => line.purchase_order_line_id === requestLine.id ? { ...line, ...patch } : line)); return <section className="approval-line" key={requestLine.id}> <h4>{index + 1}. {item ? `${item.sku} · ${item.name}` : requestLine.item_name} <span className="muted">× {requestLine.ordered_qty} {item?.unit ?? requestLine.unit}</span></h4> <div className="form-grid"> <label>Supplier<select aria-label={`Supplier for PO line ${index + 1}`} value={formLine.supplier_id} onChange={(event) => update({ supplier_id: Number(event.target.value) })}><option value={0}>Select active supplier</option>{state.suppliers.filter((supplier) => supplier.status === "Active").map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label> <label>Pre-GST unit cost<input aria-label={`Pre-GST price for PO line ${index + 1}`} type="number" min="0.01" step="0.01" value={formLine.unit_cost \|\| ""} onChange={(event) => update({ unit_cost: Number(event.target.value) })} /></label> </div> {!item && <div className="form-grid approval-new-item"><label>SKU<input aria-label={`SKU for PO line ${index + 1}`} value={formLine.sku} onChange={(event) => update({ sku: event.target.value })} /></label><label>Category<input aria-label={`Category for PO line ${index + 1}`} value={formLine.category} onChange={(event) => update({ category: event.target.value })} /></label><label>Name<input aria-label={`Catalogue name for PO line ${index + 1}`} value={formLine.name} onChange={(event) => update({ name: event.target.value })} /></label><label>Unit<input aria-label={`Catalogue unit for PO line ${index + 1}`} value={formLine.unit} onChange={(event) => update({ unit: event.target.value })} /></label><label>Low-stock threshold<input aria-label={`Low stock threshold for PO line ${index + 1}`} type="number" min="0" value={formLine.low_stock_qty} onChange={(event) => update({ low_stock_qty: Number(event.target.value) })} /></label><label>Selling price<input aria-label={`Selling price for PO line ${index + 1}`} type="number" min="0" value={formLine.selling_price} onChange={(event) => update({ selling_price: Number(event.target.value) })} /></label></div>} </section>; })} </div> 

### ACT-App-tsx-5941

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5941-5941

Tag: button; visibility: dialog === "approve" && selected

```tsx
<button type="button" className="primary-action" onClick={approveRequest}>
```

Content/label expression: Approve Purchase Request

### ACT-App-tsx-5953

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5953-5953

Tag: select; visibility: dialog === "approve" && selected

```tsx
<select aria-label={`Supplier for PO line ${index + 1}`} value={formLine.supplier_id} onChange={(event) => update({ supplier_id: Number(event.target.value) })}>
```

Content/label expression: <option value={0}>Select active supplier</option> {state.suppliers.filter((supplier) => supplier.status === "Active").map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}

### ACT-App-tsx-5954

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5954-5954

Tag: input; visibility: dialog === "approve" && selected

```tsx
<input aria-label={`Pre-GST price for PO line ${index + 1}`} type="number" min="0.01" step="0.01" value={formLine.unit_cost || ""} onChange={(event) => update({ unit_cost: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-App-tsx-5956

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5956-5956

Tag: input; visibility: !item; dialog === "approve" && selected

```tsx
<input aria-label={`SKU for PO line ${index + 1}`} value={formLine.sku} onChange={(event) => update({ sku: event.target.value })} />
```

Content/label expression: 

### ACT-App-tsx-5956

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5956-5956

Tag: input; visibility: !item; dialog === "approve" && selected

```tsx
<input aria-label={`Category for PO line ${index + 1}`} value={formLine.category} onChange={(event) => update({ category: event.target.value })} />
```

Content/label expression: 

### ACT-App-tsx-5956

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5956-5956

Tag: input; visibility: !item; dialog === "approve" && selected

```tsx
<input aria-label={`Catalogue name for PO line ${index + 1}`} value={formLine.name} onChange={(event) => update({ name: event.target.value })} />
```

Content/label expression: 

### ACT-App-tsx-5956

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5956-5956

Tag: input; visibility: !item; dialog === "approve" && selected

```tsx
<input aria-label={`Catalogue unit for PO line ${index + 1}`} value={formLine.unit} onChange={(event) => update({ unit: event.target.value })} />
```

Content/label expression: 

### ACT-App-tsx-5956

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5956-5956

Tag: input; visibility: !item; dialog === "approve" && selected

```tsx
<input aria-label={`Low stock threshold for PO line ${index + 1}`} type="number" min="0" value={formLine.low_stock_qty} onChange={(event) => update({ low_stock_qty: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-App-tsx-5956

Component: PurchaseOrdersWorkspace Â· src/App.tsx:5956-5956

Tag: input; visibility: !item; dialog === "approve" && selected

```tsx
<input aria-label={`Selling price for PO line ${index + 1}`} type="number" min="0" value={formLine.selling_price} onChange={(event) => update({ selling_price: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-App-tsx-6052

Component: PreviousPriceReview Â· src/App.tsx:6052-6052

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" onClick={() => quotationLineId === line.id ? setQuotationLineId(undefined) : beginQuotation(line)}>
```

Content/label expression: {quotationLineId === line.id ? "Cancel quotation" : "Add quotation"}

### ACT-App-tsx-6053

Component: PreviousPriceReview Â· src/App.tsx:6053-6053

Tag: input; visibility: quotationLineId === line.id

```tsx
<input aria-label={`Quotation supplier for ${line.id}`} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} />
```

Content/label expression: 

### ACT-App-tsx-6053

Component: PreviousPriceReview Â· src/App.tsx:6053-6053

Tag: input; visibility: quotationLineId === line.id

```tsx
<input aria-label={`Quotation date for ${line.id}`} type="date" value={quoteDate} onChange={(event) => setQuoteDate(event.target.value)} />
```

Content/label expression: 

### ACT-App-tsx-6053

Component: PreviousPriceReview Â· src/App.tsx:6053-6053

Tag: input; visibility: quotationLineId === line.id

```tsx
<input aria-label={`Quotation quantity for ${line.id}`} type="number" min="0.01" value={quotedQty} onChange={(event) => setQuotedQty(Number(event.target.value))} />
```

Content/label expression: 

### ACT-App-tsx-6053

Component: PreviousPriceReview Â· src/App.tsx:6053-6053

Tag: input; visibility: quotationLineId === line.id

```tsx
<input aria-label={`Quotation price for ${line.id}`} type="number" min="0" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))} />
```

Content/label expression: 

### ACT-App-tsx-6053

Component: PreviousPriceReview Â· src/App.tsx:6053-6053

Tag: input; visibility: quotationLineId === line.id

```tsx
<input aria-label={`Quotation notes for ${line.id}`} value={notes} onChange={(event) => setNotes(event.target.value)} />
```

Content/label expression: 

### ACT-App-tsx-6053

Component: PreviousPriceReview Â· src/App.tsx:6053-6053

Tag: button; visibility: quotationLineId === line.id

```tsx
<button type="button" className="primary-action" onClick={() => mutate((db) => { savePurchaseOrderQuotationForActor(db, order.id, actor.id, { purchase_order_line_id: line.id, supplier_name: supplierName, quote_date: quoteDate, quoted_qty: quotedQty, unit_cost: unitCost, notes }); setQuotationLineId(undefined); })}>
```

Content/label expression: Save quotation

### ACT-App-tsx-6295

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6295-6300

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Search inward purchases"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Supplier, invoice or PO"
            />
```

Content/label expression: 

### ACT-App-tsx-6304

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6304-6308

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              aria-label="Inward purchase status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
```

Content/label expression:  <option value="ALL">All statuses</option> <option>Draft</option> <option>Submitted</option> 

### ACT-App-tsx-6314

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6314-6319

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-6322

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6322-6322

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={reset}>
```

Content/label expression:  <Plus size={16} /> New inward purchase 

### ACT-App-tsx-6375

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6375-6383

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<tr
                    key={purchase.id}
                    className={`clickable-row${purchase.id === selectedId ? " selected-register-row" : ""}`}
                    aria-selected={purchase.id === selectedId}
                    onClick={() => {
                      setSelectedId(purchase.id);
                      setComposerOpen(true);
                    }}
                  >
```

Content/label expression:  <td>{purchase.invoice_date \|\| "—"}</td> <td>{supplierName(purchase.supplier_id)}</td> <td>{purchase.supplier_invoice_no \|\| "—"}</td> <td>{purchase.po_number \|\| "—"}</td> <td>{money(purchase.total)}</td> <td> <span className="status-badge">{purchase.status}</span> </td> <td>{lineCount}</td> <td> {attachment ? ( <a href={attachment.document_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} > Open </a> ) : ( "—" )} </td> 

### ACT-App-tsx-6395

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6395-6400

Tag: a; visibility: attachment

```tsx
<a
                          href={attachment.document_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
```

Content/label expression: Open 

### FORM-App-tsx-6414

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6414-6420

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form
        className="desk-panel inward-composer"
        onSubmit={(event) => {
          event.preventDefault();
          saveDraft();
        }}
      >
```

Content/label expression:  <button type="button" className="inward-back" onClick={() => setComposerOpen(false)} > ← Back to register </button> <PanelTitle icon={<PackageCheck />} title={selected ? `Receipt #${selected.id}` : "New receipt draft"} subtitle={ selected?.status === "Submitted" ? "Posted receipt is immutable; Admin corrections append a revision." : "Save a draft, attach the supplier invoice, then submit." } /> {selected?.status === "Submitted" ? ( <div className="submitted-receipt"> <section> <h4>Receipt details</h4> <dl> <div> <dt>Supplier</dt> <dd>{supplierName(supplierId)}</dd> </div> <div> <dt>Invoice</dt> <dd>{invoiceNo}</dd> </div> <div> <dt>Invoice date</dt> <dd>{invoiceDate}</dd> </div> <div> <dt>PO</dt> <dd>{poNumber \|\| "—"}</dd> </div> <div> <dt>Posting status</dt> <dd> <span className="status-badge">Submitted</span> </dd> </div> </dl> </section> <section> <h4>Posted lines</h4> <div className="receipt-line-grid readonly"> {lines.map((line) => { const item = state.inventory.find( (candidate) => candidate.id === line.item_id, ); return ( <div className="receipt-line-row" key={line.key}> <span> {item?.sku} · {item?.name} </span> <span> {line.received_qty} {item?.unit} </span> <span>{money(line.unit_cost)}</span> <strong>{money(lineTotal(line))}</strong> </div> ); })} </div> <p className="receipt-total">Posted total: {money(total)}</p> </section> <section> <h4>Invoice scans</h4> {selectedAttachments.map((attachment) => ( <AttachmentItem key={attachment.id} attachment={attachment} /> ))} </section> </div> ) : ( <> <section className="receipt-header"> <h4>Receipt header</h4> <div className="form-grid"> <label> Supplier <select aria-label="Purchase supplier" required value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) } > <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} {supplier.status === "On hold" ? " (On hold)" : ""} </option> ))} </select> </label> <label> Supplier invoice no. <input aria-label="Supplier invoice number" value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)} /> </label> <label> Invoice date <input aria-label="Invoice date" type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /> </label> <label> PO number (optional) <input aria-label="PO number" value={poNumber} onChange={(event) => setPoNumber(event.target.value)} /> </label> </div> </section> <section> <div className="receipt-lines-heading"> <h4>Receipt lines</h4> <button type="button" onClick={addLine}> Add line </button> </div> <div className="receipt-line-grid"> {lines.map((line, index) => { const item = state.inventory.find( (candidate) => candidate.id === line.item_id, ); return ( <div className="receipt-line-row" key={line.key}> <InventoryPicker inventory={state.inventory} value={line.item_id} onChange={(item_id) => updateLine(line.key, { item_id }) } label={`Receipt line ${index + 1} item`} /> <small> {item?.sku} · {item?.unit} · stock {item?.stock_qty} →{" "} {projectedQuantity(line.item_id)} {item?.unit} </small> <label> Qty <input aria-label={`Receipt line ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={line.received_qty} onChange={(event) => updateLine(line.key, { received_qty: Number(event.target.value), }) } /> </label> <label> Pre-GST cost <input aria-label={`Receipt line ${index + 1} unit cost`} type="number" min="0" step="0.01" value={line.unit_cost} onChange={(event) => updateLine(line.key, { unit_cost: Number(event.target.value), }) } /> </label> <label> Discount <input aria-label={`Receipt line ${index + 1} discount`} type="number" min="0" step="0.01" value={line.discount} onChange={(event) => updateLine(line.key, { discount: Number(event.target.value), }) } /> </label> <label> GST % <input aria-label={`Receipt line ${index + 1} GST`} type="number" min="0" max="100" step="0.01" value={line.gst_rate} onChange={(event) => updateLine(line.key, { gst_rate: Number(event.target.value), }) } /> </label> <strong>{money(lineTotal(line))}</strong> <button type="button" className="danger-action" aria-label={`Remove receipt line ${index + 1}`} onClick={() => setLines((current) => current.filter((item) => item.key !== line.key), ) } > Remove </button> </div> ); })} </div> </section> <section className="receipt-attachments"> <h4>Invoice scan</h4> <label className="file-upload-button"> Attach invoice scan (PDF/JPG, max 10 MB) <input aria-label="Invoice scan" type="file" accept="application/pdf,image/jpeg" onChange={(event) => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} hidden /> </label> {selectedAttachments.map((attachment) => ( <AttachmentItem key={attachment.id} attachment={attachment} /> ))} {attachments.map((attachment, index) => ( <AttachmentItem key={`${attachment.original_name}-${index}`} attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index), ) } /> ))} </section> </> )} {selected?.status === "Submitted" && actor.role === "admin" && ( <section className="receipt-correction"> <h4>Admin correction</h4> <p> Post only the revised receipt quantities; WorkshopOS records the delta and reason. </p> <label> Correction reason <input aria-label="Correction reason" value={revisionReason} onChange={(event) => setRevisionReason(event.target.value)} placeholder="Required reason for stock delta" /> </label> <button type="button" onClick={() => mutate((db) => reviseInwardPurchaseForActor(db, selected.id, actor.id, { reason: revisionReason, lines: lines.map(({ key: _key, ...line }) => line), }), ) } > Post revision delta </button> </section> )} {editable && ( <div className="receipt-status-bar" aria-label="Receipt readiness"> <div> <strong>{money(total)}</strong> <span> {lines.length} line{lines.length === 1 ? "" : "s"} ·{" "} {hasScan ? "scan attached" : "scan needed"} </span> </div> <ul> <li className={activeSupplier ? "ready" : ""}>Active supplier</li> <li className={invoiceNo.trim() ? "ready" : ""}> Invoice number </li> <li className={validDate ? "ready" : ""}>Valid date</li> <li className={validLines ? "ready" : ""}>Valid lines</li> <li className={hasScan ? "ready" : ""}>Invoice scan</li> </ul> <div className="action-row"> <button className="primary-action">Save draft</button> {selected && ( <button type="button" className="primary-action" disabled={!ready} onClick={() => mutate((db) => submitInwardPurchaseForActor(db, selected.id, actor.id), ) } > Submit receipt </button> )} </div> </div> )} 

### ACT-App-tsx-6421

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6421-6425

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          type="button"
          className="inward-back"
          onClick={() => setComposerOpen(false)}
        >
```

Content/label expression: ← Back to register 

### ACT-App-tsx-6503

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6503-6510

Tag: select; visibility: selected?.status === "Submitted"

```tsx
<select
                    aria-label="Purchase supplier"
                    required
                    value={supplierId}
                    onChange={(event) =>
                      setSupplierId(Number(event.target.value))
                    }
                  >
```

Content/label expression:  <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} {supplier.status === "On hold" ? " (On hold)" : ""} </option> ))} 

### ACT-App-tsx-6528

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6528-6532

Tag: input; visibility: selected?.status === "Submitted"

```tsx
<input
                    aria-label="Supplier invoice number"
                    value={invoiceNo}
                    onChange={(event) => setInvoiceNo(event.target.value)}
                  />
```

Content/label expression: 

### ACT-App-tsx-6536

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6536-6541

Tag: input; visibility: selected?.status === "Submitted"

```tsx
<input
                    aria-label="Invoice date"
                    type="date"
                    value={invoiceDate}
                    onChange={(event) => setInvoiceDate(event.target.value)}
                  />
```

Content/label expression: 

### ACT-App-tsx-6545

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6545-6549

Tag: input; visibility: selected?.status === "Submitted"

```tsx
<input
                    aria-label="PO number"
                    value={poNumber}
                    onChange={(event) => setPoNumber(event.target.value)}
                  />
```

Content/label expression: 

### ACT-App-tsx-6556

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6556-6556

Tag: button; visibility: selected?.status === "Submitted"

```tsx
<button type="button" onClick={addLine}>
```

Content/label expression: Add line 

### ACT-App-tsx-6567

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6567-6574

Tag: InventoryPicker; visibility: selected?.status === "Submitted"

```tsx
<InventoryPicker
                        inventory={state.inventory}
                        value={line.item_id}
                        onChange={(item_id) =>
                          updateLine(line.key, { item_id })
                        }
                        label={`Receipt line ${index + 1} item`}
                      />
```

Content/label expression: 

### ACT-App-tsx-6581

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6581-6592

Tag: input; visibility: selected?.status === "Submitted"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-6596

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6596-6607

Tag: input; visibility: selected?.status === "Submitted"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-6611

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6611-6622

Tag: input; visibility: selected?.status === "Submitted"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-6626

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6626-6638

Tag: input; visibility: selected?.status === "Submitted"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-6641

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6641-6650

Tag: button; visibility: selected?.status === "Submitted"

```tsx
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
```

Content/label expression: Remove 

### ACT-App-tsx-6662

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6662-6671

Tag: input; visibility: selected?.status === "Submitted"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-6677

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6677-6685

Tag: AttachmentItem; visibility: selected?.status === "Submitted"

```tsx
<AttachmentItem
                  key={`${attachment.original_name}-${index}`}
                  attachment={attachment}
                  onRemove={() =>
                    setAttachments((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-6699

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6699-6704

Tag: input; visibility: selected?.status === "Submitted" && actor.role === "admin"

```tsx
<input
                aria-label="Correction reason"
                value={revisionReason}
                onChange={(event) => setRevisionReason(event.target.value)}
                placeholder="Required reason for stock delta"
              />
```

Content/label expression: 

### ACT-App-tsx-6706

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6706-6716

Tag: button; visibility: selected?.status === "Submitted" && actor.role === "admin"

```tsx
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
```

Content/label expression: Post revision delta 

### ACT-App-tsx-6740

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6740-6740

Tag: button; visibility: editable

```tsx
<button className="primary-action">
```

Content/label expression: Save draft

### ACT-App-tsx-6742

Component: LegacyInwardPurchasesWorkspace Â· src/App.tsx:6742-6751

Tag: button; visibility: selected; editable

```tsx
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
```

Content/label expression: Submit receipt 

### ACT-App-tsx-7016

Component: InwardPurchasesWorkspace Â· src/App.tsx:7016-7016

Tag: button; visibility: actor.role === "admin"; dialog === "approve"

```tsx
<button type="button" className="primary-action" onClick={approve}>
```

Content/label expression: Approve PO 

### ACT-App-tsx-7022

Component: InwardPurchasesWorkspace Â· src/App.tsx:7022-7022

Tag: button; visibility: editorMode; dialog === "approve"

```tsx
<button type="button" className="secondary-action" onClick={saveDraft}>
```

Content/label expression: Save Draft 

### ACT-App-tsx-7026

Component: InwardPurchasesWorkspace Â· src/App.tsx:7026-7030

Tag: button; visibility: record; editorMode; dialog === "approve"

```tsx
<button
            type="button"
            className="primary-action"
            onClick={sendForApproval}
          >
```

Content/label expression: Send for PO 

### ACT-App-tsx-7036

Component: InwardPurchasesWorkspace Â· src/App.tsx:7036-7036

Tag: button; visibility: receiveMode; editorMode; dialog === "approve"

```tsx
<button type="button" className="primary-action" onClick={receive}>
```

Content/label expression: Receive & Post 

### ACT-App-tsx-7040

Component: InwardPurchasesWorkspace Â· src/App.tsx:7040-7040

Tag: button; visibility: receivedMode && actor.role === "admin"; receiveMode; editorMode; dialog === "approve"

```tsx
<button type="button" className="danger-action" onClick={revise}>
```

Content/label expression: Post revision delta 

### ACT-App-tsx-7054

Component: InwardPurchasesWorkspace Â· src/App.tsx:7054-7058

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            className="primary-action"
            onClick={() => open("create")}
          >
```

Content/label expression:  <Plus size={16} /> Add purchase record 

### ACT-App-tsx-7065

Component: InwardPurchasesWorkspace Â· src/App.tsx:7065-7070

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Search inward purchases"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Supplier, invoice or PO"
            />
```

Content/label expression: 

### ACT-App-tsx-7074

Component: InwardPurchasesWorkspace Â· src/App.tsx:7074-7078

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              aria-label="Inward purchase status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
```

Content/label expression:  <option value="ALL">All statuses</option> <option>Draft</option> <option>Awaiting PO Approval</option> <option>Approved</option> <option>Received</option> 

### ACT-App-tsx-7086

Component: InwardPurchasesWorkspace Â· src/App.tsx:7086-7091

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
            onClear={() => {
              setSearch("");
              setStatus("ALL");
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-7153

Component: InwardPurchasesWorkspace Â· src/App.tsx:7153-7164

Tag: tr; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <td> <strong>#{purchase.id}</strong> <br /> <small>{purchase.po_number \|\| "—"}</small> </td> <td>{purchase.invoice_date \|\| "—"}</td> <td>{supplierName(purchase.supplier_id)}</td> <td>{purchase.supplier_invoice_no \|\| "—"}</td> <td>{count}</td> <td>{money(purchase.total)}</td> <td> <span className="status-badge"> {purchase.status === "Submitted" ? "Received" : purchase.status} </span> </td> <td> {attachment ? ( <a href={attachment.document_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} > Open </a> ) : ( "—" )} </td> <td> <div className="grid-actions"> <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open(reviewMode, purchase.id); }} > {purchase.status === "Draft" ? "Edit" : purchase.status === "Awaiting PO Approval" ? "Review" : "View"} </button> {purchase.status === "Draft" && ( <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("edit", purchase.id); }} > Send for PO </button> )} {purchase.status === "Awaiting PO Approval" && actor.role === "admin" && ( <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("approve", purchase.id); }} > Approve </button> )} {purchase.status === "Approved" && ( <button type="button" className="grid-action" onClick={(event) => { event.stopPropagation(); open("receive", purchase.id); }} > Receive & Post </button> )} </div> </td> 

### ACT-App-tsx-7184

Component: InwardPurchasesWorkspace Â· src/App.tsx:7184-7189

Tag: a; visibility: attachment

```tsx
<a
                          href={attachment.document_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
```

Content/label expression: Open 

### ACT-App-tsx-7198

Component: InwardPurchasesWorkspace Â· src/App.tsx:7198-7205

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                          type="button"
                          className="grid-action"
                          onClick={(event) => {
                            event.stopPropagation();
                            open(reviewMode, purchase.id);
                          }}
                        >
```

Content/label expression:  {purchase.status === "Draft" ? "Edit" : purchase.status === "Awaiting PO Approval" ? "Review" : "View"} 

### ACT-App-tsx-7213

Component: InwardPurchasesWorkspace Â· src/App.tsx:7213-7220

Tag: button; visibility: purchase.status === "Draft"

```tsx
<button
                            type="button"
                            className="grid-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              open("edit", purchase.id);
                            }}
                          >
```

Content/label expression: Send for PO 

### ACT-App-tsx-7226

Component: InwardPurchasesWorkspace Â· src/App.tsx:7226-7233

Tag: button; visibility: purchase.status === "Awaiting PO Approval" && actor.role === "admin"

```tsx
<button
                              type="button"
                              className="grid-action"
                              onClick={(event) => {
                                event.stopPropagation();
                                open("approve", purchase.id);
                              }}
                            >
```

Content/label expression: Approve 

### ACT-App-tsx-7238

Component: InwardPurchasesWorkspace Â· src/App.tsx:7238-7245

Tag: button; visibility: purchase.status === "Approved"

```tsx
<button
                            type="button"
                            className="grid-action"
                            onClick={(event) => {
                              event.stopPropagation();
                              open("receive", purchase.id);
                            }}
                          >
```

Content/label expression: Receive & Post 

### STATE-App-tsx-7259

Component: InwardPurchasesWorkspace Â· src/App.tsx:7259-7273

Tag: Dialog; visibility: dialog

```tsx
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
```

Content/label expression:  <div className="inward-dialog-content"> {dialog === "approve" ? ( <PurchaseSnapshot record={record!} lines={lines} inventory={state.inventory} supplierName={supplierName} /> ) : receivedMode && !receiveMode ? ( <> <PurchaseSnapshot record={record!} lines={lines} inventory={state.inventory} supplierName={supplierName} attachments={recordAttachments} /> {actor.role === "admin" && ( <section className="receipt-correction"> <h4>Admin correction</h4> <p> Enter the corrected receipt quantities, then provide the audit reason. </p> <ReceiptLines lines={lines} inventory={state.inventory} editableQuantity updateLine={updateLine} lineTotal={lineTotal} /> <label> Correction reason <input data-dialog-initial-focus aria-label="Correction reason" value={revisionReason} onChange={(event) => setRevisionReason(event.target.value) } required /> </label> </section> )} </> ) : ( <> <section className="receipt-header"> <h4>{receiveMode ? "Receipt header" : "Purchase header"}</h4> <div className="form-grid"> <label> Supplier {editorMode ? ( <select data-dialog-initial-focus aria-label="Purchase supplier" value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) } > <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} </option> ))} </select> ) : ( <input readOnly value={supplierName(supplierId)} /> )} </label> <label> Supplier invoice no. <input aria-label="Supplier invoice number" value={invoiceNo} readOnly={!editorMode && !receiveMode} onChange={(event) => setInvoiceNo(event.target.value)} /> </label> <label> Invoice date <input aria-label="Invoice date" type="date" value={invoiceDate} readOnly={!editorMode && !receiveMode} onChange={(event) => setInvoiceDate(event.target.value)} /> </label> {editorMode && ( <label> PO number (optional) <input aria-label="PO number" value={poNumber} onChange={(event) => setPoNumber(event.target.value)} /> </label> )} </div> </section> <section> <div className="receipt-lines-heading"> <h4> {receiveMode ? "Actual received quantities" : "Purchase lines"} </h4> {editorMode && ( <button type="button" onClick={() => { const line = freshLine(); if (line) setLines((current) => [...current, line]); }} > Add line </button> )} </div> <ReceiptLines lines={lines} inventory={state.inventory} editable={editorMode} editableQuantity={receiveMode} updateLine={updateLine} lineTotal={lineTotal} onRemove={(key) => setLines((current) => current.filter((line) => line.key !== key), ) } /> </section> {receiveMode && ( <section className="receipt-attachments"> <h4>Invoice scan</h4> <label className="file-upload-button"> Attach invoice scan (PDF/JPG, max 10 MB) <input aria-label="Invoice scan" type="file" accept="application/pdf,image/jpeg" onChange={(event) => { void selectFile(event.target.files?.[0]); event.target.value = ""; }} hidden /> </label> {recordAttachments.map((attachment) => ( <AttachmentItem key={attachment.id} attachment={attachment} /> ))} {attachments.map((attachment, index) => ( <AttachmentItem key={`${attachment.original_name}-${index}`} attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, item) => item !== index), ) } /> ))} </section> )} <div className="receipt-status-bar" aria-label="Purchase readiness" > <strong>{money(total)}</strong> <span> {editorMode ? `${activeSupplier ? "Active supplier" : "Supplier needed"} · ${validLines ? "valid lines" : "valid lines needed"}` : `${invoiceNo.trim() && validDate && validLines && hasScan ? "Ready to post" : "Invoice, date, quantities and scan are required"}`} </span> </div> </> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} </div> 

### ACT-App-tsx-7307

Component: InwardPurchasesWorkspace Â· src/App.tsx:7307-7315

Tag: input; visibility: actor.role === "admin"; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<input
                        data-dialog-initial-focus
                        aria-label="Correction reason"
                        value={revisionReason}
                        onChange={(event) =>
                          setRevisionReason(event.target.value)
                        }
                        required
                      />
```

Content/label expression: 

### ACT-App-tsx-7328

Component: InwardPurchasesWorkspace Â· src/App.tsx:7328-7335

Tag: select; visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<select
                          data-dialog-initial-focus
                          aria-label="Purchase supplier"
                          value={supplierId}
                          onChange={(event) =>
                            setSupplierId(Number(event.target.value))
                          }
                        >
```

Content/label expression:  <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} </option> ))} 

### ACT-App-tsx-7350

Component: InwardPurchasesWorkspace Â· src/App.tsx:7350-7350

Tag: input; visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<input readOnly value={supplierName(supplierId)} />
```

Content/label expression: 

### ACT-App-tsx-7355

Component: InwardPurchasesWorkspace Â· src/App.tsx:7355-7360

Tag: input; visibility: receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<input
                        aria-label="Supplier invoice number"
                        value={invoiceNo}
                        readOnly={!editorMode && !receiveMode}
                        onChange={(event) => setInvoiceNo(event.target.value)}
                      />
```

Content/label expression: 

### ACT-App-tsx-7364

Component: InwardPurchasesWorkspace Â· src/App.tsx:7364-7370

Tag: input; visibility: receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<input
                        aria-label="Invoice date"
                        type="date"
                        value={invoiceDate}
                        readOnly={!editorMode && !receiveMode}
                        onChange={(event) => setInvoiceDate(event.target.value)}
                      />
```

Content/label expression: 

### ACT-App-tsx-7375

Component: InwardPurchasesWorkspace Â· src/App.tsx:7375-7379

Tag: input; visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<input
                          aria-label="PO number"
                          value={poNumber}
                          onChange={(event) => setPoNumber(event.target.value)}
                        />
```

Content/label expression: 

### ACT-App-tsx-7392

Component: InwardPurchasesWorkspace Â· src/App.tsx:7392-7398

Tag: button; visibility: editorMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<button
                        type="button"
                        onClick={() => {
                          const line = freshLine();
                          if (line) setLines((current) => [...current, line]);
                        }}
                      >
```

Content/label expression: Add line 

### ACT-App-tsx-7403

Component: InwardPurchasesWorkspace Â· src/App.tsx:7403-7415

Tag: ReceiptLines; visibility: receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-7422

Component: InwardPurchasesWorkspace Â· src/App.tsx:7422-7431

Tag: input; visibility: receiveMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-7440

Component: InwardPurchasesWorkspace Â· src/App.tsx:7440-7448

Tag: AttachmentItem; visibility: receiveMode; receivedMode && !receiveMode; dialog === "approve"; dialog

```tsx
<AttachmentItem
                        key={`${attachment.original_name}-${index}`}
                        attachment={attachment}
                        onRemove={() =>
                          setAttachments((current) =>
                            current.filter((_, item) => item !== index),
                          )
                        }
                      />
```

Content/label expression: 

### STATE-App-tsx-7466

Component: InwardPurchasesWorkspace Â· src/App.tsx:7466-7466

Tag: p; visibility: error; dialog

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-7503

Component: ReceiptLines Â· src/App.tsx:7503-7508

Tag: InventoryPicker; visibility: editable

```tsx
<InventoryPicker
                inventory={inventory}
                value={line.item_id}
                onChange={(item_id) => updateLine(line.key, { item_id })}
                label={`Receipt line ${index + 1} item`}
              />
```

Content/label expression: 

### ACT-App-tsx-7517

Component: ReceiptLines Â· src/App.tsx:7517-7529

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-7535

Component: ReceiptLines Â· src/App.tsx:7535-7546

Tag: input; visibility: editable

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-7550

Component: ReceiptLines Â· src/App.tsx:7550-7561

Tag: input; visibility: editable

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-7565

Component: ReceiptLines Â· src/App.tsx:7565-7577

Tag: input; visibility: editable

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-7588

Component: ReceiptLines Â· src/App.tsx:7588-7593

Tag: button; visibility: editable && onRemove

```tsx
<button
                type="button"
                className="danger-action"
                aria-label={`Remove receipt line ${index + 1}`}
                onClick={() => onRemove(line.key)}
              >
```

Content/label expression: Remove 

### ACT-App-tsx-7698

Component: AttachmentItem Â· src/App.tsx:7698-7698

Tag: a; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<a href={attachment.document_url} target="_blank" rel="noreferrer">
```

Content/label expression: Open 

### ACT-App-tsx-7702

Component: AttachmentItem Â· src/App.tsx:7702-7702

Tag: button; visibility: onRemove

```tsx
<button type="button" className="danger-action" onClick={onRemove}>
```

Content/label expression: Remove 

### ACT-App-tsx-7784

Component: SupplierMasterWorkspace Â· src/App.tsx:7784-7784

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" onClick={openNew}>
```

Content/label expression:  <Plus size={16} /> Add new supplier 

### ACT-App-tsx-7809

Component: SupplierMasterWorkspace Â· src/App.tsx:7809-7813

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                        type="button"
                        className="grid-action"
                        onClick={() => openEdit(supplier)}
                      >
```

Content/label expression:  <Pencil size={15} /> Edit 

### STATE-App-tsx-7826

Component: SupplierMasterWorkspace Â· src/App.tsx:7826-7857

Tag: Dialog; visibility: dialogOpen

```tsx
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
```

Content/label expression:  <form id="supplier-form" onSubmit={save}> <label> Name <input required data-dialog-initial-focus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Contact name <input value={draft.contact_name} onChange={(event) => setDraft({ ...draft, contact_name: event.target.value }) } /> </label> <label> Phone <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value }) } /> </label> <label> Email <input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> GSTIN <input value={draft.gstin} onChange={(event) => setDraft({ ...draft, gstin: event.target.value }) } /> </label> <label> Status <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Supplier["status"], }) } > <option>Active</option> <option>On hold</option> </select> </label> </form> 

### ACT-App-tsx-7833

Component: SupplierMasterWorkspace Â· src/App.tsx:7833-7844

Tag: button; visibility: selected; dialogOpen

```tsx
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
```

Content/label expression: Archive supplier 

### ACT-App-tsx-7848

Component: SupplierMasterWorkspace Â· src/App.tsx:7848-7852

Tag: button; visibility: dialogOpen

```tsx
<button
                type="submit"
                form="supplier-form"
                className="primary-action"
              >
```

Content/label expression: Save supplier 

### FORM-App-tsx-7858

Component: SupplierMasterWorkspace Â· src/App.tsx:7858-7858

Tag: form; visibility: dialogOpen

```tsx
<form id="supplier-form" onSubmit={save}>
```

Content/label expression:  <label> Name <input required data-dialog-initial-focus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Contact name <input value={draft.contact_name} onChange={(event) => setDraft({ ...draft, contact_name: event.target.value }) } /> </label> <label> Phone <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value }) } /> </label> <label> Email <input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> GSTIN <input value={draft.gstin} onChange={(event) => setDraft({ ...draft, gstin: event.target.value }) } /> </label> <label> Status <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Supplier["status"], }) } > <option>Active</option> <option>On hold</option> </select> </label> 

### ACT-App-tsx-7861

Component: SupplierMasterWorkspace Â· src/App.tsx:7861-7868

Tag: input; visibility: dialogOpen

```tsx
<input
                required
                data-dialog-initial-focus
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-7872

Component: SupplierMasterWorkspace Â· src/App.tsx:7872-7877

Tag: input; visibility: dialogOpen

```tsx
<input
                value={draft.contact_name}
                onChange={(event) =>
                  setDraft({ ...draft, contact_name: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-7881

Component: SupplierMasterWorkspace Â· src/App.tsx:7881-7886

Tag: input; visibility: dialogOpen

```tsx
<input
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-7890

Component: SupplierMasterWorkspace Â· src/App.tsx:7890-7896

Tag: input; visibility: dialogOpen

```tsx
<input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-7900

Component: SupplierMasterWorkspace Â· src/App.tsx:7900-7905

Tag: input; visibility: dialogOpen

```tsx
<input
                value={draft.gstin}
                onChange={(event) =>
                  setDraft({ ...draft, gstin: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-7909

Component: SupplierMasterWorkspace Â· src/App.tsx:7909-7917

Tag: select; visibility: dialogOpen

```tsx
<select
                value={draft.status}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    status: event.target.value as Supplier["status"],
                  })
                }
              >
```

Content/label expression:  <option>Active</option> <option>On hold</option> 

### STATE-App-tsx-7992

Component: StockMovementHistory Â· src/App.tsx:7992-7992

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="desk-panel store-list-page" role="tabpanel">
```

Content/label expression:  <div className="store-filter-grid stock-filter-grid contextual-filter-bar"> <label className="list-search"> Quick search <input aria-label="Search stock movements" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Item, SKU, job or note" /> </label> <label> Date <input aria-label="Stock movement date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setPage(1); }} /> </label> <label> Month-Year <select aria-label="Stock movement month" value={month} onChange={(event) => { setMonth(event.target.value); setPage(1); }} > <option value="">All months</option> {movementMonths.map((value) => ( <option key={value} value={value}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${value}-01T00:00:00Z`), )} </option> ))} </select> </label> <label> Direction <select aria-label="Stock movement direction" value={direction} onChange={(event) => { setDirection(event.target.value); setPage(1); }} > <option value="ALL">All movements</option> {Array.from(new Set(uniqueMovements.map((row) => row.direction))) .sort() .map((value) => ( <option key={value}>{value}</option> ))} </select> </label> <ListSearchActions onClear={clearFilters} /> </div> <PaginationToolbar controls={ <ListExportControls report={{ title: "Stock Movements", filters: activeFilterSummary({ Search: search.trim(), Date: date, Month: month, Direction: direction, }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Stock movement records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {filtered.length ? ( <div className="table-wrap"> <table aria-label="Stock movement results"> <thead> <tr> {columns.map((column) => ( <th key={column.header}>{column.header}</th> ))} </tr> </thead> <tbody> {paged.items.map((row) => ( <tr key={row.id}> {columns.map((column) => ( <td key={column.header}>{column.value(row)}</td> ))} </tr> ))} </tbody> </table> </div> ) : ( <div className="list-empty"> <h3>No matching movements</h3> <FilterClearButton onClick={clearFilters} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 

### ACT-App-tsx-7996

Component: StockMovementHistory Â· src/App.tsx:7996-8004

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search stock movements"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Item, SKU, job or note"
          />
```

Content/label expression: 

### ACT-App-tsx-8008

Component: StockMovementHistory Â· src/App.tsx:8008-8016

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Stock movement date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-8020

Component: StockMovementHistory Â· src/App.tsx:8020-8027

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Stock movement month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="">All months</option> {movementMonths.map((value) => ( <option key={value} value={value}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${value}-01T00:00:00Z`), )} </option> ))} 

### ACT-App-tsx-8040

Component: StockMovementHistory Â· src/App.tsx:8040-8047

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Stock movement direction"
            value={direction}
            onChange={(event) => {
              setDirection(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All movements</option> {Array.from(new Set(uniqueMovements.map((row) => row.direction))) .sort() .map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-8056

Component: StockMovementHistory Â· src/App.tsx:8056-8056

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clearFilters} />
```

Content/label expression: 

### ACT-App-tsx-8058

Component: StockMovementHistory Â· src/App.tsx:8058-8086

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-8111

Component: StockMovementHistory Â· src/App.tsx:8111-8111

Tag: FilterClearButton; visibility: filtered.length

```tsx
<FilterClearButton onClick={clearFilters} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-8114

Component: StockMovementHistory Â· src/App.tsx:8114-8118

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### ACT-App-tsx-8548

Component: StoreList Â· src/App.tsx:8548-8552

Tag: tr; visibility: kind === "requests" && purchaseRequests.length > 0

```tsx
<tr
                  key={purchaseRequest.id}
                  className="clickable-row"
                  onClick={() => onOpenJob(view.job.id)}
                >
```

Content/label expression:  <td>{view.job.job_no}</td> <td>{purchaseRequest.item_name}</td> <td> {purchaseRequest.quantity} {purchaseRequest.unit} </td> <td>{purchaseRequest.status}</td> <td> {purchaseRequest.status === "Completed" ? `Inventory #${purchaseRequest.mapped_inventory_item_id} · issued row #${purchaseRequest.material_request_id}` : "Awaiting purchase"} </td> 

### ACT-App-tsx-8584

Component: StoreList Â· src/App.tsx:8584-8596

Tag: input; visibility: !isMaterialRecordList

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-8603

Component: StoreList Â· src/App.tsx:8603-8610

Tag: select; visibility: kind === "stock"

```tsx
<select
                aria-label="Stock category"
                value={primary}
                onChange={(event) => {
                  setPrimary(event.target.value);
                  setPage(1);
                }}
              >
```

Content/label expression:  <option value="ALL">All categories</option> {categories.map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-8619

Component: StoreList Â· src/App.tsx:8619-8626

Tag: select; visibility: kind === "stock"

```tsx
<select
                aria-label="Stock status"
                value={job}
                onChange={(event) => {
                  setJob(event.target.value);
                  setPage(1);
                }}
              >
```

Content/label expression:  <option value="ALL">All stock</option> <option value="LOW">Low stock</option> <option value="OK">In stock</option> 

### ACT-App-tsx-8634

Component: StoreList Â· src/App.tsx:8634-8641

Tag: select; visibility: kind === "stock"

```tsx
<select
                aria-label="Stock unit"
                value={unit}
                onChange={(event) => {
                  setUnit(event.target.value);
                  setPage(1);
                }}
              >
```

Content/label expression:  <option value="ALL">All units</option> {units.map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-8655

Component: StoreList Â· src/App.tsx:8655-8664

Tag: input; visibility: isMaterialRecordList; kind === "stock"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-8668

Component: StoreList Â· src/App.tsx:8668-8676

Tag: select; visibility: isMaterialRecordList; kind === "stock"

```tsx
<select
                    aria-label={`${title} record month`}
                    value={recordMonth}
                    onChange={(event) => {
                      setRecordMonth(event.target.value);
                      setRecordDate("");
                      setPage(1);
                    }}
                  >
```

Content/label expression:  <option value="">All months</option> {Array.from( new Set( [ ...history.map((row) => (isLocalPurchase(row) ? row.purchase.created_at : row.request.created_at )?.slice(0, 7), ), ...purchaseRequests.map(({ purchaseRequest }) => purchaseRequest.created_at?.slice(0, 7), ), ].filter((value): value is string => Boolean(value && /^\d{4}-\d{2}$/.test(value)), ), ), ) .sort((left, right) => right.localeCompare(left)) .map((value) => ( <option key={value} value={value}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${value}-01T00:00:00Z`), )} </option> ))} 

### ACT-App-tsx-8709

Component: StoreList Â· src/App.tsx:8709-8718

Tag: select; visibility: kind === "stock"

```tsx
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
```

Content/label expression:  <option value="ALL">All states</option> {(kind === "reconcile" ? ["Matched", "Open"] : [ "Pending", "Partially issued", "Issued", "Reconciled", ...(purchases.length ? ["Local purchase"] : []), ...(purchaseRequests.length ? ["New item request", "Completed"] : []), ] ).map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-8740

Component: StoreList Â· src/App.tsx:8740-8747

Tag: select; visibility: !isMaterialRecordList; kind === "stock"

```tsx
<select
                  aria-label={`${title} job`}
                  value={job}
                  onChange={(event) => {
                    setJob(event.target.value);
                    setPage(1);
                  }}
                >
```

Content/label expression:  <option value="ALL">All jobs</option> {uniqueJobs.map((row) => ( <option key={row.job.id} value={row.job.id}> {row.job.job_no} · {row.vehicle.number} ·{" "} {row.customer.name} </option> ))} 

### ACT-App-tsx-8761

Component: StoreList Â· src/App.tsx:8761-8774

Tag: InventoryPicker; visibility: isMaterialRecordList; kind === "stock"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-8779

Component: StoreList Â· src/App.tsx:8779-8786

Tag: select; visibility: isMaterialRecordList; kind === "stock"

```tsx
<select
                  aria-label={`${title} item`}
                  value={item}
                  onChange={(event) => {
                    setItem(event.target.value);
                    setPage(1);
                  }}
                >
```

Content/label expression:  <option value="ALL">All items</option> {inventory.map((row) => ( <option key={row.id} value={row.id}> {row.name} </option> ))} 

### ACT-App-tsx-8798

Component: StoreList Â· src/App.tsx:8798-8798

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clearFilters} />
```

Content/label expression: 

### ACT-App-tsx-8800

Component: StoreList Â· src/App.tsx:8800-8814

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-8819

Component: StoreList Â· src/App.tsx:8819-8819

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton onClick={clearFilters} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-8849

Component: StoreList Â· src/App.tsx:8849-8853

Tag: button; visibility: onEditStock; kind === "stock"; paged.totalCount === 0

```tsx
<button
                            type="button"
                            className="secondary-action"
                            onClick={() => onEditStock(row)}
                          >
```

Content/label expression: Edit 

### ACT-App-tsx-8868

Component: StoreList Â· src/App.tsx:8868-8876

Tag: tr; visibility: kind === "stock"; paged.totalCount === 0

```tsx
<tr
                        key={
                          isLocalPurchase(row)
                            ? `purchase-${row.purchase.id}`
                            : `request-${row.request.id}`
                        }
                        className="clickable-row"
                        onClick={() => onOpenJob(row.view.job.id)}
                      >
```

Content/label expression:  {requestColumns.map((column) => ( <td key={column.header} className={ column.header === "Status" \|\| column.header === "State" ? `store-material-status-cell store-material-status-cell-${storeMaterialStatusClass(status)}` : undefined } > {column.header === "Job Card" ? ( <button type="button" className="link-action" onClick={(event) => { event.stopPropagation(); onOpenJob(row.view.job.id); }} > {String(column.value(row))} </button> ) : column.header === "Status" \|\| column.header === "State" ? ( <span className={`store-material-status store-material-status-${storeMaterialStatusClass(status)}`} > {status} </span> ) : ( column.value(row) )} </td> ))} {(kind === "issue" \|\| kind === "reconcile") && ( <td className={ kind === "issue" ? "store-material-action-cell" : undefined } > {!isLocalPurchase(row) && ( <div className="grid-actions store-material-actions"> {kind === "issue" && onRelease && ( <button type="button" className="workflow-action action-primary" onClick={(event) => { event.stopPropagation(); onRelease(row); }} > <Package size={15} /> Issue Material </button> )} {kind === "issue" && onNeedsApproval && ["Requested", "Re-requested"].includes( row.request.status ?? "Requested", ) && !row.request.invoiced_in && ( <button type="button" className="workflow-action action-secondary" onClick={(event) => { event.stopPropagation(); onNeedsApproval(row); }} > <ShieldCheck size={15} /> Needs Approval </button> )} {kind === "reconcile" && onReconcile && ( <button type="button" className="store-material-action" onClick={(event) => { event.stopPropagation(); onReconcile(row); }} > {reconciliationState(row) === "Matched" ? "Edit Reconciliation" : "Reconcile"} </button> )} </div> )} </td> )} 

### ACT-App-tsx-8888

Component: StoreList Â· src/App.tsx:8888-8895

Tag: button; visibility: column.header === "Job Card"; kind === "stock"; paged.totalCount === 0

```tsx
<button
                                type="button"
                                className="link-action"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpenJob(row.view.job.id);
                                }}
                              >
```

Content/label expression:  {String(column.value(row))} 

### ACT-App-tsx-8921

Component: StoreList Â· src/App.tsx:8921-8928

Tag: button; visibility: kind === "issue" && onRelease; !isLocalPurchase(row); (kind === "issue" \|\| kind === "reconcile"); kind === "stock"; paged.totalCount === 0

```tsx
<button
                                    type="button"
                                    className="workflow-action action-primary"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onRelease(row);
                                    }}
                                  >
```

Content/label expression:  <Package size={15} /> Issue Material 

### ACT-App-tsx-8939

Component: StoreList Â· src/App.tsx:8939-8946

Tag: button; visibility: kind === "issue" && onNeedsApproval && ["Requested", "Re-requested"].includes( row.request.status ?? "Requested", ) && !row.request.invoiced_in; !isLocalPurchase(row); (kind === "issue" \|\| kind === "reconcile"); kind === "stock"; paged.totalCount === 0

```tsx
<button
                                      type="button"
                                      className="workflow-action action-secondary"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onNeedsApproval(row);
                                      }}
                                    >
```

Content/label expression:  <ShieldCheck size={15} /> Needs Approval 

### ACT-App-tsx-8952

Component: StoreList Â· src/App.tsx:8952-8959

Tag: button; visibility: kind === "reconcile" && onReconcile; !isLocalPurchase(row); (kind === "issue" \|\| kind === "reconcile"); kind === "stock"; paged.totalCount === 0

```tsx
<button
                                    type="button"
                                    className="store-material-action"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onReconcile(row);
                                    }}
                                  >
```

Content/label expression:  {reconciliationState(row) === "Matched" ? "Edit Reconciliation" : "Reconcile"} 

### ACT-App-tsx-8976

Component: StoreList Â· src/App.tsx:8976-8980

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### ACT-App-tsx-9010

Component: Technician Â· src/App.tsx:9010-9014

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
          className="desk-panel task-column"
          key={view.job.id}
          onFocus={() => setSelectedJobId(view.job.id)}
        >
```

Content/label expression:  <PanelTitle icon={<Wrench />} title={view.vehicle.number} subtitle={view.job.job_no} /> {view.tasks.map((task) => ( <div className="task-card" key={task.id}> <strong>{task.title}</strong> <p>{task.notes}</p> <Info label="Started" value={task.started_at \|\| "Not started"} /> <Info label="Paused" value={task.paused_at \|\| "Not paused"} /> <Info label="Completed" value={task.completed_at \|\| "Not completed"} /> <Status status={view.job.main_status} sub={view.job.sub_status} /> <label> Work notes <input defaultValue={task.notes} onBlur={(event) => mutate((db) => updateTask(db, task.id, task.status, event.target.value), ) } /> </label> <div className="segmented"> {statuses.map((status) => ( <button key={status} className={task.status === status ? "active" : ""} onClick={() => mutate((db) => updateTask( db, task.id, status, `${status} from technician board`, ), ) } > {status} </button> ))} </div> <button className="danger-action" onClick={() => mutate((db) => archiveTask(db, task.id, "Removed from technician board"), ) } > Archive Task </button> </div> ))} <TaskCreator view={view} users={state.users} mutate={mutate} /> {activeMenuItem === "QC Prep" && ( <QcEditor view={view} technicianId={ state.users.find((item) => item.role === "tech")?.id ?? 6 } mutate={mutate} /> )} 

### ACT-App-tsx-9033

Component: Technician Â· src/App.tsx:9033-9040

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
                  defaultValue={task.notes}
                  onBlur={(event) =>
                    mutate((db) =>
                      updateTask(db, task.id, task.status, event.target.value),
                    )
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-9044

Component: Technician Â· src/App.tsx:9044-9057

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {status} 

### ACT-App-tsx-9062

Component: Technician Â· src/App.tsx:9062-9069

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    archiveTask(db, task.id, "Removed from technician board"),
                  )
                }
              >
```

Content/label expression: Archive Task 

### ACT-App-tsx-9213

Component: MaterialApprovalQueue Â· src/App.tsx:9213-9219

Tag: button; visibility: pending.length

```tsx
<button
                          className="link-action"
                          onClick={() => {
                            setSelectedJobId(view.job.id);
                            setViewing(view);
                          }}
                        >
```

Content/label expression:  {view.job.job_no} 

### ACT-App-tsx-9236

Component: MaterialApprovalQueue Â· src/App.tsx:9236-9239

Tag: button; visibility: pending.length

```tsx
<button
                          className="primary-action"
                          onClick={() => setReviewing(view)}
                        >
```

Content/label expression: Review 

### ACT-App-tsx-9257

Component: MaterialApprovalQueue Â· src/App.tsx:9257-9264

Tag: JobRecordDialog; visibility: viewing

```tsx
<JobRecordDialog
          view={viewing}
          state={state}
          mutate={mutate}
          actor={actor}
          mode="view"
          onClose={() => setViewing(undefined)}
        />
```

Content/label expression: 

### STATE-App-tsx-9267

Component: MaterialApprovalQueue Â· src/App.tsx:9267-9289

Tag: Dialog; visibility: reviewing

```tsx
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
```

Content/label expression:  <p> Approve restores the retained requested rows for Store issue. Reject keeps the job on HOLD for the linked Service Advisor to correct. </p> <label> Rejection reason <textarea value={reason} onChange={(event) => setReason(event.target.value)} required placeholder="Required when rejecting" /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-9273

Component: MaterialApprovalQueue Â· src/App.tsx:9273-9277

Tag: button; visibility: reviewing

```tsx
<button
                type="button"
                className="secondary-action"
                onClick={() => decide("Approved")}
              >
```

Content/label expression: Approve 

### ACT-App-tsx-9280

Component: MaterialApprovalQueue Â· src/App.tsx:9280-9284

Tag: button; visibility: reviewing

```tsx
<button
                type="button"
                className="danger-action"
                onClick={() => decide("Rejected")}
              >
```

Content/label expression: Reject 

### ACT-App-tsx-9296

Component: MaterialApprovalQueue Â· src/App.tsx:9296-9301

Tag: textarea; visibility: reviewing

```tsx
<textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              placeholder="Required when rejecting"
            />
```

Content/label expression: 

### STATE-App-tsx-9304

Component: MaterialApprovalQueue Â· src/App.tsx:9304-9304

Tag: p; visibility: error; reviewing

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-9343

Component: Admin Â· src/App.tsx:9343-9348

Tag: BookingOperations; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<BookingOperations
        state={state}
        actor={user}
        mutate={mutate}
        onCheckedIn={(jobId) => setSelectedJobId(jobId)}
      />
```

Content/label expression: 

### ACT-App-tsx-9373

Component: Admin Â· src/App.tsx:9373-9379

Tag: FilterableJobRows; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<FilterableJobRows
            title="Job Cards"
            jobs={state.jobs}
            selectedJobId={selected?.job.id}
            onSelect={setSelectedJobId}
            showStatusFilter
          />
```

Content/label expression: 

### ACT-App-tsx-9397

Component: Admin Â· src/App.tsx:9397-9404

Tag: button; visibility: selected

```tsx
<button
                className="danger-action"
                onClick={() =>
                  mutate((db) =>
                    cancelJobCard(db, selected.job.id, "Cancelled by admin"),
                  )
                }
              >
```

Content/label expression: Archive Job 

### ACT-App-tsx-9429

Component: Admin Â· src/App.tsx:9429-9436

Tag: AdminConsole; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<AdminConsole
        state={state}
        mutate={mutate}
        actingUser={user}
        cognitoConfig={cognitoConfig}
        onThemeSaved={onThemeSaved}
        onStateSaved={onAdminStateSaved}
      />
```

Content/label expression: 

### ACT-App-tsx-9440

Component: Admin Â· src/App.tsx:9440-9440

Tag: OperationalDashboard; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<OperationalDashboard state={state} onNavigate={onDashboardNavigate} />
```

Content/label expression: 

### ACT-App-tsx-9702

Component: OperationalDashboard Â· src/App.tsx:9702-9717

Tag: article; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <div className="command-card-heading"> <span className="command-icon-tile" aria-hidden="true"> {icon} </span> <div> <h2>{card.title}</h2> <p>{card.subtitle}</p> </div> {card.tone === "cashflow" && ( <label className="cashflow-month"> Cashflow month <select aria-label="Cashflow month" value={cashflowMonth} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onChange={(event) => { event.stopPropagation(); setCashflowMonth(event.target.value); }} > {cashflowMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} </select> </label> )} </div> <div className={`command-metrics${card.tone === "cashflow" ? " command-cashflow-metrics" : ""}`} > {card.metrics.map((metric) => ( <button type="button" key={metric.label} className={`command-metric metric-${metric.tone}${metric.layout ? ` command-metric-${metric.layout}` : ""}`} aria-label={`Open ${metric.label}: ${metric.value}`} onClick={(event) => { event.stopPropagation(); onNavigate(metric.drilldown); }} > <span>{metric.label}</span> <strong>{metric.value}</strong> {metric.context && <small>{metric.context}</small>} </button> ))} </div> {card.tone === "cashflow" && (facts.cashflowMonthComplete ? ( <div className="collection-pace collection-complete" aria-label={`${facts.cashflowMonthLabel} collection complete`} > <div className="collection-pace-label"> <span>Collection period</span> <strong>Month complete</strong> </div> </div> ) : ( <div className="collection-pace" aria-label={`${collectionPace}% of calendar month elapsed`} > <div className="collection-pace-label"> <span>Collection runway</span> <strong>{collectionPace}% elapsed</strong> </div> <div className="collection-pace-track"> <span style={{ width: `${collectionPace}%` }} /> </div> <div className="collection-bars" aria-hidden="true"> <i /> <i /> <i /> <i /> <i /> <i /> <i /> </div> </div> ))} {card.tone === "reach" && ( <svg className="customer-trend" viewBox="0 0 260 62" role="img" aria-label="Decorative customer reach trend" > <path d="M2 52C28 48 31 36 53 42S83 51 103 29s33 5 54-8 29-1 46-17 30-1 55-3" fill="none" pathLength="1" /> <path d="M2 59H258" /> </svg> )} {card.tone === "inventory" && ( <div className="inventory-signal" aria-hidden="true"> <Sparkles size={15} /> <span>Attention queue</span> <i /> <i /> <i /> </div> )} <div className="command-card-footer"> <button type="button" className="command-card-open" aria-label={card.action} onClick={(event) => { event.stopPropagation(); onNavigate(card.drilldown); }} > {card.action} <ChevronRight size={14} /> </button> </div> 

### ACT-App-tsx-9729

Component: OperationalDashboard Â· src/App.tsx:9729-9739

Tag: select; visibility: card.tone === "cashflow"

```tsx
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
```

Content/label expression:  {cashflowMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} 

### ACT-App-tsx-9755

Component: OperationalDashboard Â· src/App.tsx:9755-9764

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <span>{metric.label}</span> <strong>{metric.value}</strong> {metric.context && <small>{metric.context}</small>} 

### ACT-App-tsx-9830

Component: OperationalDashboard Â· src/App.tsx:9830-9838

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                  type="button"
                  className="command-card-open"
                  aria-label={card.action}
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigate(card.drilldown);
                  }}
                >
```

Content/label expression:  {card.action} <ChevronRight size={14} /> 

### ACT-App-tsx-9897

Component: ManagementHub Â· src/App.tsx:9897-9907

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Load Large Demo Dataset 

### STATE-App-tsx-9911

Component: ManagementHub Â· src/App.tsx:9911-9916

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
          className="management-tabs"
          role="tablist"
          aria-label="Management areas"
          onKeyDown={handleTabListKeyDown}
        >
```

Content/label expression:  {managementAreas.map((item) => ( <button id={`management-tab-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`} aria-controls="management-active-panel" tabIndex={area === item ? 0 : -1} key={item} role="tab" aria-selected={area === item} className={area === item ? "active" : ""} onClick={() => setArea(item)} > {item} </button> ))} 

### STATE-App-tsx-9918

Component: ManagementHub Â· src/App.tsx:9918-9927

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {item} 

### STATE-App-tsx-9932

Component: ManagementHub Â· src/App.tsx:9932-9936

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
          id="management-active-panel"
          role="tabpanel"
          aria-labelledby={`management-tab-${area.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
        >
```

Content/label expression:  {area === "Estimates" && ( <JobPicker jobs={state.jobs} selectedJobId={managedJob?.job.id} onSelect={setManagedJobId} label={`Job for ${area}`} /> )} {area === "Users" && ( <UserManager users={state.users} mutate={mutate} actingUser={actingUser} cognitoConfig={cognitoConfig} /> )} {area === "Customers" && ( <CustomerManager state={state} mutate={mutate} actor={actingUser} /> )} {area === "Vehicles" && ( <VehicleManager state={state} mutate={mutate} actor={actingUser} /> )} {area === "Suppliers" && ( <SupplierMasterWorkspace state={state} actor={actingUser} mutate={mutate} /> )} {area === "Job Cards" && ( <VisitJobManager state={state} mutate={mutate} actingUser={actingUser} selected={selected} setSelectedJobId={setSelectedJobId} /> )} {area === "Estimates" && ( <EstimateManager view={managedJob} mutate={mutate} actor={actingUser} /> )} {(area === "Invoices" \|\| area === "Payments" \|\| area === "Delivery") && ( <BillingManager key={area} mode={area} state={state} actor={actingUser} mutate={mutate} panel={false} /> )} 

### ACT-App-tsx-9938

Component: ManagementHub Â· src/App.tsx:9938-9943

Tag: JobPicker; visibility: area === "Estimates"

```tsx
<JobPicker
              jobs={state.jobs}
              selectedJobId={managedJob?.job.id}
              onSelect={setManagedJobId}
              label={`Job for ${area}`}
            />
```

Content/label expression: 

### STATE-App-tsx-10046

Component: CustomerManager Â· src/App.tsx:10046-10046

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Customers</h3> {!archivedOnly && ( <button className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }} > Add Customer </button> )} </div> {creating && ( <Dialog title="Add Customer" onClose={() => setCreating(false)}> <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> </Dialog> )} {record && ( <CustomerRecordDialog customer={record.customer} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} /> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search customers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, mobile or type" /> </label> {actor.role === "admin" && ( <Switch label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }} /> )} <ListSearchActions onClear={() => { setSearch(""); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Customers", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Customer records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="Customer manager"> <thead> <tr> {[ "Customer", "Mobile", "Type", "Vehicles", "Open Jobs", "Actions", ].map((header) => ( <th key={header}>{header}</th> ))} </tr> </thead> <tbody> {paged.items.map((customer) => ( <tr key={customer.id}> <td>{customer.name}</td> <td>{customer.mobile}</td> <td>{customer.type}</td> <td>{vehicleCount(customer)}</td> <td>{openJobCount(customer)}</td> <td> <RecordActions inGrid onView={() => setRecord({ customer, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ customer, mode: "edit" }) : undefined } onArchive={ !archivedOnly ? () => mutate((db) => archiveCustomer( db, customer.id, "Archived by Admin", ), ) : undefined } /> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 

### ACT-App-tsx-10050

Component: CustomerManager Â· src/App.tsx:10050-10056

Tag: button; visibility: !archivedOnly

```tsx
<button
            className="primary-action"
            onClick={() => {
              setDraft(empty);
              setCreating(true);
            }}
          >
```

Content/label expression: Add Customer 

### STATE-App-tsx-10062

Component: CustomerManager Â· src/App.tsx:10062-10062

Tag: Dialog; visibility: creating

```tsx
<Dialog title="Add Customer" onClose={() => setCreating(false)}>
```

Content/label expression:  <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> 

### ACT-App-tsx-10063

Component: CustomerManager Â· src/App.tsx:10063-10069

Tag: CustomerEditor; visibility: creating

```tsx
<CustomerEditor
            embedded
            value={draft}
            setValue={setDraft}
            mutate={mutate}
            onSaved={() => setCreating(false)}
          />
```

Content/label expression: 

### ACT-App-tsx-10073

Component: CustomerManager Â· src/App.tsx:10073-10079

Tag: CustomerRecordDialog; visibility: record

```tsx
<CustomerRecordDialog
          customer={record.customer}
          state={state}
          mutate={mutate}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-10084

Component: CustomerManager Â· src/App.tsx:10084-10092

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search customers"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, mobile or type"
          />
```

Content/label expression: 

### ACT-App-tsx-10095

Component: CustomerManager Â· src/App.tsx:10095-10103

Tag: Switch; visibility: actor.role === "admin"

```tsx
<Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-10105

Component: CustomerManager Â· src/App.tsx:10105-10110

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        />
```

Content/label expression: 

### ACT-App-tsx-10112

Component: CustomerManager Â· src/App.tsx:10112-10138

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10114

Component: CustomerManager Â· src/App.tsx:10114-10124

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10165

Component: CustomerManager Â· src/App.tsx:10165-10185

Tag: RecordActions; visibility: paged.totalCount > 0

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10196

Component: CustomerManager Â· src/App.tsx:10196-10202

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            label="Clear filters"
          />
```

Content/label expression: 

### ACT-App-tsx-10205

Component: CustomerManager Â· src/App.tsx:10205-10209

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### STATE-App-tsx-10265

Component: VehicleManager Â· src/App.tsx:10265-10265

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Vehicles</h3> {!archivedOnly && ( <button className="primary-action" onClick={() => { setDraft(empty); setCreating(true); }} > Add Vehicle </button> )} </div> {creating && ( <Dialog title="Add Vehicle" onClose={() => setCreating(false)}> <VehicleMasterPanel embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> </Dialog> )} {record && ( <VehicleRecordDialog vehicle={vehicles.find((vehicle) => vehicle.id === record.id)!} state={state} mutate={mutate} mode={record.mode} onClose={() => setRecord(undefined)} /> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search vehicles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Registration, make, model or customer" /> </label> {actor.role === "admin" && ( <Switch label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }} /> )} <ListSearchActions onClear={() => { setSearch(""); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Vehicles", filters: activeFilterSummary({ Search: search.trim(), "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Vehicle records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="Vehicle manager"> <thead> <tr> {[ "Registration", "Make / Model", "Color", "Customer", "KM", "Actions", ].map((header) => ( <th key={header}>{header}</th> ))} </tr> </thead> <tbody> {paged.items.map((vehicle) => ( <tr key={vehicle.id}> <td>{vehicle.number}</td> <td> {vehicle.make} {vehicle.model} </td> <td>{vehicle.color}</td> <td>{ownerName(vehicle)}</td> <td>{vehicle.km.toLocaleString("en-IN")}</td> <td> <RecordActions inGrid onView={() => setRecord({ id: vehicle.id, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ id: vehicle.id, mode: "edit" }) : undefined } onArchive={ !archivedOnly ? () => mutate((db) => archiveVehicle( db, vehicle.id, "Archived by Admin", ), ) : undefined } /> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 

### ACT-App-tsx-10269

Component: VehicleManager Â· src/App.tsx:10269-10275

Tag: button; visibility: !archivedOnly

```tsx
<button
            className="primary-action"
            onClick={() => {
              setDraft(empty);
              setCreating(true);
            }}
          >
```

Content/label expression: Add Vehicle 

### STATE-App-tsx-10281

Component: VehicleManager Â· src/App.tsx:10281-10281

Tag: Dialog; visibility: creating

```tsx
<Dialog title="Add Vehicle" onClose={() => setCreating(false)}>
```

Content/label expression:  <VehicleMasterPanel embedded key={draft.id} state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={() => setCreating(false)} /> 

### ACT-App-tsx-10282

Component: VehicleManager Â· src/App.tsx:10282-10290

Tag: VehicleMasterPanel; visibility: creating

```tsx
<VehicleMasterPanel
            embedded
            key={draft.id}
            state={state}
            value={draft}
            setValue={setDraft}
            mutate={mutate}
            onSaved={() => setCreating(false)}
          />
```

Content/label expression: 

### ACT-App-tsx-10294

Component: VehicleManager Â· src/App.tsx:10294-10300

Tag: VehicleRecordDialog; visibility: record

```tsx
<VehicleRecordDialog
          vehicle={vehicles.find((vehicle) => vehicle.id === record.id)!}
          state={state}
          mutate={mutate}
          mode={record.mode}
          onClose={() => setRecord(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-10305

Component: VehicleManager Â· src/App.tsx:10305-10313

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search vehicles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Registration, make, model or customer"
          />
```

Content/label expression: 

### ACT-App-tsx-10316

Component: VehicleManager Â· src/App.tsx:10316-10324

Tag: Switch; visibility: actor.role === "admin"

```tsx
<Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-10326

Component: VehicleManager Â· src/App.tsx:10326-10331

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        />
```

Content/label expression: 

### ACT-App-tsx-10333

Component: VehicleManager Â· src/App.tsx:10333-10359

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10335

Component: VehicleManager Â· src/App.tsx:10335-10345

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10388

Component: VehicleManager Â· src/App.tsx:10388-10408

Tag: RecordActions; visibility: paged.totalCount > 0

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10419

Component: VehicleManager Â· src/App.tsx:10419-10425

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            label="Clear filters"
          />
```

Content/label expression: 

### ACT-App-tsx-10428

Component: VehicleManager Â· src/App.tsx:10428-10432

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### STATE-App-tsx-10489

Component: VisitJobManager Â· src/App.tsx:10489-10489

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Job Cards</h3> {!archivedOnly && ( <button className="add-action" onClick={() => setCreating(true)}> <Plus size={17} /> Add Job Card </button> )} </div> {creating && ( <AddJobCardDialog state={state} mutate={mutate} actor={actingUser} onClose={() => setCreating(false)} /> )} {dialogJob && ( <JobRecordDialog view={dialogJob} state={state} mutate={mutate} actor={actingUser} mode={archivedOnly ? "view" : (record?.mode ?? "view")} historical={archivedOnly} onClose={() => setRecord(undefined)} onAdminArchive={ !archivedOnly ? () => mutate((db) => cancelJobCard( db, dialogJob.job.id, "Admin override: archived from Management Hub", ), ) : undefined } /> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search job cards" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job card, vehicle or customer" /> </label> <label> Status <select aria-label="Job status filter" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} > <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map( (value) => ( <option key={value}>{value}</option> ), )} </select> </label> <label> Estimated Delivery Date <input aria-label="Estimated delivery date" type="date" value={deliveryDate} onChange={(event) => { setDeliveryDate(event.target.value); setPage(1); }} /> </label> <label> Estimated Delivery Month <input aria-label="Estimated delivery month" type="month" value={deliveryMonth} onChange={(event) => { setDeliveryMonth(event.target.value); setPage(1); }} /> </label> {actingUser.role === "admin" && ( <Switch label="Show archived only" checked={archivedOnly} onCheckedChange={(checked) => { setArchivedOnly(checked); setPage(1); setRecord(undefined); }} /> )} <ListSearchActions onClear={() => { setSearch(""); setStatus("ALL"); setDeliveryDate(""); setDeliveryMonth(""); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Job Cards", filters: activeFilterSummary({ Search: search.trim(), Status: status, "Estimated Delivery Date": deliveryDate, "Estimated Delivery Month": deliveryDate ? "" : deliveryMonth, "Show archived only": archivedOnly ? "Yes" : "No", }), columns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Job card records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap manage-job-table"> <table aria-label="Managed job cards"> <thead> <tr> {[ "Job Card", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Actions", ].map( (header) => ( <th key={header}>{header}</th> ), )} </tr> </thead> <tbody> {paged.items.map((row) => ( <tr key={row.job.id} className={jobDeliveryClass(row.job, today)}> <td>{row.job.job_no}</td> <td> {row.vehicle.number} · {row.vehicle.make}{" "} {row.vehicle.model} </td> <td>{row.customer.name}</td> <td>{row.job.estimated_delivery \|\| "—"}</td> <td> <Status status={row.job.main_status} sub={row.job.sub_status} /> </td> <td> <RecordActions inGrid onView={() => setRecord({ id: row.job.id, mode: "view" })} onEdit={ !archivedOnly ? () => setRecord({ id: row.job.id, mode: "edit" }) : undefined } /> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setStatus("ALL"); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 

### ACT-App-tsx-10493

Component: VisitJobManager Â· src/App.tsx:10493-10493

Tag: button; visibility: !archivedOnly

```tsx
<button className="add-action" onClick={() => setCreating(true)}>
```

Content/label expression:  <Plus size={17} /> Add Job Card 

### ACT-App-tsx-10500

Component: VisitJobManager Â· src/App.tsx:10500-10505

Tag: AddJobCardDialog; visibility: creating

```tsx
<AddJobCardDialog
          state={state}
          mutate={mutate}
          actor={actingUser}
          onClose={() => setCreating(false)}
        />
```

Content/label expression: 

### ACT-App-tsx-10508

Component: VisitJobManager Â· src/App.tsx:10508-10528

Tag: JobRecordDialog; visibility: dialogJob

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10533

Component: VisitJobManager Â· src/App.tsx:10533-10541

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search job cards"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job card, vehicle or customer"
          />
```

Content/label expression: 

### ACT-App-tsx-10545

Component: VisitJobManager Â· src/App.tsx:10545-10552

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Job status filter"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map( (value) => ( <option key={value}>{value}</option> ), )} 

### ACT-App-tsx-10563

Component: VisitJobManager Â· src/App.tsx:10563-10571

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Estimated delivery date"
            type="date"
            value={deliveryDate}
            onChange={(event) => {
              setDeliveryDate(event.target.value);
              setPage(1);
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-10575

Component: VisitJobManager Â· src/App.tsx:10575-10583

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Estimated delivery month"
            type="month"
            value={deliveryMonth}
            onChange={(event) => {
              setDeliveryMonth(event.target.value);
              setPage(1);
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-10586

Component: VisitJobManager Â· src/App.tsx:10586-10594

Tag: Switch; visibility: actingUser.role === "admin"

```tsx
<Switch
            label="Show archived only"
            checked={archivedOnly}
            onCheckedChange={(checked) => {
              setArchivedOnly(checked);
              setPage(1);
              setRecord(undefined);
            }}
          />
```

Content/label expression: 

### ACT-App-tsx-10596

Component: VisitJobManager Â· src/App.tsx:10596-10604

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
          onClear={() => {
            setSearch("");
            setStatus("ALL");
            setDeliveryDate("");
            setDeliveryMonth("");
            setPage(1);
          }}
        />
```

Content/label expression: 

### ACT-App-tsx-10606

Component: VisitJobManager Â· src/App.tsx:10606-10635

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10608

Component: VisitJobManager Â· src/App.tsx:10608-10621

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10672

Component: VisitJobManager Â· src/App.tsx:10672-10680

Tag: RecordActions; visibility: paged.totalCount > 0

```tsx
<RecordActions
                      inGrid
                      onView={() => setRecord({ id: row.job.id, mode: "view" })}
                      onEdit={
                        !archivedOnly
                          ? () => setRecord({ id: row.job.id, mode: "edit" })
                          : undefined
                      }
                    />
```

Content/label expression: 

### ACT-App-tsx-10691

Component: VisitJobManager Â· src/App.tsx:10691-10698

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton
            onClick={() => {
              setSearch("");
              setStatus("ALL");
              setPage(1);
            }}
            label="Clear filters"
          />
```

Content/label expression: 

### ACT-App-tsx-10701

Component: VisitJobManager Â· src/App.tsx:10701-10705

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### STATE-App-tsx-10720

Component: EstimateManager Â· src/App.tsx:10720-10720

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Estimates</h3> </div> {view ? ( <EstimateEditor view={view} mutate={mutate} actor={actor} /> ) : ( <p className="empty-state">Select a job first.</p> )} 

### STATE-App-tsx-10744

Component: TaskQcManager Â· src/App.tsx:10744-10744

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Tasks / QC</h3> <div className="action-row"> <button className="primary-action" disabled={!view} onClick={() => setAddingTask(true)} > Add Task </button> <span className="override-badge">Admin override controls</span> </div> </div> {addingTask && view && ( <Dialog title="Add Task" onClose={() => setAddingTask(false)}> <TaskCreator embedded view={view} users={users} mutate={mutate} onCreated={() => setAddingTask(false)} /> </Dialog> )} {view ? ( <QcEditor view={view} technicianId={view.job.technician_id} mutate={mutate} /> ) : ( <p className="empty-state">Select a job first.</p> )} 

### ACT-App-tsx-10748

Component: TaskQcManager Â· src/App.tsx:10748-10752

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            className="primary-action"
            disabled={!view}
            onClick={() => setAddingTask(true)}
          >
```

Content/label expression: Add Task 

### STATE-App-tsx-10759

Component: TaskQcManager Â· src/App.tsx:10759-10759

Tag: Dialog; visibility: addingTask && view

```tsx
<Dialog title="Add Task" onClose={() => setAddingTask(false)}>
```

Content/label expression:  <TaskCreator embedded view={view} users={users} mutate={mutate} onCreated={() => setAddingTask(false)} /> 

### ACT-App-tsx-10760

Component: TaskQcManager Â· src/App.tsx:10760-10766

Tag: TaskCreator; visibility: addingTask && view

```tsx
<TaskCreator
            embedded
            view={view}
            users={users}
            mutate={mutate}
            onCreated={() => setAddingTask(false)}
          />
```

Content/label expression: 

### STATE-App-tsx-10808

Component: InventoryMaterialsManager Â· src/App.tsx:10808-10808

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Inventory / Materials</h3> <div className="action-row"> <button className="primary-action" onClick={() => setAddingItem(true)} > Add / Edit Inventory Item </button> <button className="primary-action" onClick={() => setAddingRequest(true)} > Add / Edit Material Request </button> </div> </div> {addingItem && ( <Dialog title="Inventory Item" subtitle="Master, stock-in and adjustment" onClose={() => setAddingItem(false)} > <InventoryEditor embedded state={state} mutate={mutate} /> </Dialog> )} {addingRequest && ( <Dialog title="Material Request" subtitle="Job-linked material request" onClose={() => setAddingRequest(false)} > <MaterialRequestEditor embedded state={state} mutate={mutate} /> </Dialog> )} <div className="store-filter-grid"> <label className="list-search"> Search <input aria-label="Search inventory / materials" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="SKU, name, category or unit" /> </label> <ListSearchActions onClear={clearSearch} /> </div> <PaginationToolbar from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Inventory records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <div className="record-list"> {paged.items.map((item) => ( <div className="managed-record" key={item.id}> <div> <strong>{item.name}</strong> <span> {item.sku} · {item.category} · Stock {item.stock_qty}{" "} {item.unit} </span> </div> </div> ))} </div> {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={clearSearch} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 

### ACT-App-tsx-10812

Component: InventoryMaterialsManager Â· src/App.tsx:10812-10815

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            className="primary-action"
            onClick={() => setAddingItem(true)}
          >
```

Content/label expression: Add / Edit Inventory Item 

### ACT-App-tsx-10818

Component: InventoryMaterialsManager Â· src/App.tsx:10818-10821

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            className="primary-action"
            onClick={() => setAddingRequest(true)}
          >
```

Content/label expression: Add / Edit Material Request 

### STATE-App-tsx-10827

Component: InventoryMaterialsManager Â· src/App.tsx:10827-10831

Tag: Dialog; visibility: addingItem

```tsx
<Dialog
          title="Inventory Item"
          subtitle="Master, stock-in and adjustment"
          onClose={() => setAddingItem(false)}
        >
```

Content/label expression:  <InventoryEditor embedded state={state} mutate={mutate} /> 

### STATE-App-tsx-10836

Component: InventoryMaterialsManager Â· src/App.tsx:10836-10840

Tag: Dialog; visibility: addingRequest

```tsx
<Dialog
          title="Material Request"
          subtitle="Job-linked material request"
          onClose={() => setAddingRequest(false)}
        >
```

Content/label expression:  <MaterialRequestEditor embedded state={state} mutate={mutate} /> 

### ACT-App-tsx-10847

Component: InventoryMaterialsManager Â· src/App.tsx:10847-10855

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search inventory / materials"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="SKU, name, category or unit"
          />
```

Content/label expression: 

### ACT-App-tsx-10857

Component: InventoryMaterialsManager Â· src/App.tsx:10857-10857

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clearSearch} />
```

Content/label expression: 

### ACT-App-tsx-10859

Component: InventoryMaterialsManager Â· src/App.tsx:10859-10872

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-10889

Component: InventoryMaterialsManager Â· src/App.tsx:10889-10889

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton onClick={clearSearch} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-10892

Component: InventoryMaterialsManager Â· src/App.tsx:10892-10896

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### STATE-App-tsx-10956

Component: UserManager Â· src/App.tsx:10956-10956

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <h3>Users</h3> <button className="primary-action" onClick={() => { setDraft(empty); setEditing(true); }} > Add User </button> </div> {editing && ( <Dialog title={draft.id ? "Edit User" : "Add User"} onClose={() => setEditing(false)} > <form onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft), ) ) setEditing(false); }} > <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> User role <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) } > {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> User password <input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save User</button> <button type="button" onClick={() => setEditing(false)}> Cancel </button> </div> </form> </Dialog> )} <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search <input aria-label="Search users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email or role" /> </label> <label> Role <select aria-label="Filter users by role" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} > <option value="ALL">All roles</option> {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> Status <select aria-label="Filter users by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} > <option value="ALL">All statuses</option> <option value="ACTIVE">Active</option> <option value="ARCHIVED">Archived</option> </select> </label> <ListSearchActions onClear={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }} /> </div> <PaginationToolbar controls={ <DownloadMenu report={{ title: "Users", filters: activeFilterSummary({ Search: search.trim(), Role: roleFilter === "ALL" ? "ALL" : roleLabels[roleFilter as Role], Status: statusFilter, }), columns: userColumns, rows: filtered, }} /> } from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="User records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {paged.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="User manager"> <thead> <tr> {["Name", "Email", "Role", "Status", "Actions"].map( (header) => ( <th key={header}>{header}</th> ), )} </tr> </thead> <tbody> {paged.items.map((item) => ( <tr key={item.id}> <td> <div className="user-name-with-appointments"> <span>{item.name}</span> {managerDepartments[item.id]?.map((department) => ( <span className="manager-appointment-badge" key={department}> Manager · {department} </span> ))} </div> </td> <td>{item.email}</td> <td>{roleLabels[item.role]}</td> <td>Active</td> <td> <div className="grid-actions"> <button type="button" className="grid-action" onClick={() => { setDraft(item); setEditing(true); }} > Edit </button> <button type="button" className="grid-action grid-action-danger" disabled={item.id === actingUser.id} title={ item.id === actingUser.id ? "You cannot archive your own signed-in account" : undefined } onClick={() => mutate((db) => archiveUser( db, item.id, "Archived by Admin", actingUser.id, ), ) } > Archive </button> </div> </td> </tr> ))} </tbody> </table> </div> )} {paged.totalCount === 0 && ( <div className="list-empty"> <h3>No matching records</h3> <FilterClearButton onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); setPage(1); }} label="Clear filters" /> </div> )} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> 

### ACT-App-tsx-10959

Component: UserManager Â· src/App.tsx:10959-10965

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="primary-action"
          onClick={() => {
            setDraft(empty);
            setEditing(true);
          }}
        >
```

Content/label expression: Add User 

### STATE-App-tsx-10970

Component: UserManager Â· src/App.tsx:10970-10973

Tag: Dialog; visibility: editing

```tsx
<Dialog
          title={draft.id ? "Edit User" : "Add User"}
          onClose={() => setEditing(false)}
        >
```

Content/label expression:  <form onSubmit={(event) => { event.preventDefault(); if ( mutate((db) => draft.id ? updateUser(db, draft.id, draft) : createUser(db, draft), ) ) setEditing(false); }} > <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> User role <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) } > {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> User password <input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save User</button> <button type="button" onClick={() => setEditing(false)}> Cancel </button> </div> </form> 

### FORM-App-tsx-10974

Component: UserManager Â· src/App.tsx:10974-10986

Tag: form; visibility: editing

```tsx
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
```

Content/label expression:  <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> </label> <label> User role <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role }) } > {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} </select> </label> <label> User password <input required minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save User</button> <button type="button" onClick={() => setEditing(false)}> Cancel </button> </div> 

### ACT-App-tsx-10990

Component: UserManager Â· src/App.tsx:10990-10996

Tag: input; visibility: editing

```tsx
<input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-11000

Component: UserManager Â· src/App.tsx:11000-11007

Tag: input; visibility: editing

```tsx
<input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft({ ...draft, email: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-11011

Component: UserManager Â· src/App.tsx:11011-11016

Tag: select; visibility: editing

```tsx
<select
                  value={draft.role}
                  onChange={(event) =>
                    setDraft({ ...draft, role: event.target.value as Role })
                  }
                >
```

Content/label expression:  {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} 

### ACT-App-tsx-11026

Component: UserManager Â· src/App.tsx:11026-11034

Tag: input; visibility: editing

```tsx
<input
                  required
                  minLength={6}
                  type="password"
                  value={draft.password}
                  onChange={(event) =>
                    setDraft({ ...draft, password: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-11038

Component: UserManager Â· src/App.tsx:11038-11038

Tag: button; visibility: editing

```tsx
<button className="primary-action">
```

Content/label expression: Save User

### ACT-App-tsx-11039

Component: UserManager Â· src/App.tsx:11039-11039

Tag: button; visibility: editing

```tsx
<button type="button" onClick={() => setEditing(false)}>
```

Content/label expression: Cancel 

### ACT-App-tsx-11049

Component: UserManager Â· src/App.tsx:11049-11057

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search users"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email or role"
          />
```

Content/label expression: 

### ACT-App-tsx-11061

Component: UserManager Â· src/App.tsx:11061-11068

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Filter users by role"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All roles</option> {Object.entries(roleLabels).map(([role, label]) => ( <option key={role} value={role}> {label} </option> ))} 

### ACT-App-tsx-11079

Component: UserManager Â· src/App.tsx:11079-11086

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            aria-label="Filter users by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
```

Content/label expression:  <option value="ALL">All statuses</option> <option value="ACTIVE">Active</option> <option value="ARCHIVED">Archived</option> 

### ACT-App-tsx-11092

Component: UserManager Â· src/App.tsx:11092-11099

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions
          onClear={() => {
            setSearch("");
            setRoleFilter("ALL");
            setStatusFilter("ALL");
            setPage(1);
          }}
        />
```

Content/label expression: 

### ACT-App-tsx-11101

Component: UserManager Â· src/App.tsx:11101-11129

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-11103

Component: UserManager Â· src/App.tsx:11103-11115

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-11160

Component: UserManager Â· src/App.tsx:11160-11167

Tag: button; visibility: paged.totalCount > 0

```tsx
<button
                        type="button"
                        className="grid-action"
                        onClick={() => {
                          setDraft(item);
                          setEditing(true);
                        }}
                      >
```

Content/label expression: Edit 

### ACT-App-tsx-11170

Component: UserManager Â· src/App.tsx:11170-11189

Tag: button; visibility: paged.totalCount > 0

```tsx
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
```

Content/label expression: Archive 

### ACT-App-tsx-11203

Component: UserManager Â· src/App.tsx:11203-11211

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton
            onClick={() => {
              setSearch("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
              setPage(1);
            }}
            label="Clear filters"
          />
```

Content/label expression: 

### ACT-App-tsx-11214

Component: UserManager Â· src/App.tsx:11214-11218

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### STATE-App-tsx-11339

Component: RemoteUserManager Â· src/App.tsx:11339-11339

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="manager-panel" role="tabpanel">
```

Content/label expression:  <div className="panel-actions"> <div> <h3>Users</h3> <span> Accounts are tenant-scoped and invitations are sent by Cognito. </span> </div> <button className="primary-action" onClick={startNew}> Add User </button> </div> {error && ( <div className="api-error" role="alert"> {error} <button onClick={() => void refresh()}>Retry</button> </div> )} {editing && ( <form onSubmit={(event) => { event.preventDefault(); if (draft.id) void run( () => adminUsersApi.update(config, draft as AdminUser), true, ); else void run( () => adminUsersApi.create(config, { name: draft.name, email: draft.email, roleIds: draft.roleIds, branchIds: draft.branchIds, }), true, ); }} > <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> <small> {draft.id ? "Email cannot be changed after invitation." : "Cognito will email a temporary password."} </small> </label> </div> <fieldset className="assignment-fieldset"> <legend>Roles</legend> {directory.roles.map((role) => ( <label key={role.id}> <input type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)} /> {role.name} </label> ))} </fieldset> <fieldset className="assignment-fieldset"> <legend>Permitted branches</legend> {directory.branches.map((branch) => ( <label key={branch.id}> <input type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)} /> {branch.name} </label> ))} </fieldset> <div className="action-row"> <button className="primary-action" disabled={busy}> {draft.id ? "Save Changes" : "Invite User"} </button> <button type="button" disabled={busy} onClick={() => setEditing(false)} > Cancel </button> </div> </form> )} <div className="store-filter-grid compact-management-toolbar"> <label className="list-search"> Search <input aria-label="Search remote users" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email, role, branch or status" /> </label> <ListSearchActions onClear={clearSearch} /> </div> <PaginationToolbar from={pagedUsers.from} to={pagedUsers.to} totalCount={pagedUsers.totalCount} page={pagedUsers.page} pageCount={pagedUsers.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel="Remote user records per page" onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> {loading ? ( <p className="empty-state">Loading users…</p> ) : ( pagedUsers.totalCount > 0 && ( <div className="table-wrap management-table"> <table aria-label="User manager"> <thead> <tr> {[ "Name", "Email", "Roles", "Branches", "Status", "Actions", ].map((header) => ( <th key={header}>{header}</th> ))} </tr> </thead> <tbody> {pagedUsers.items.map((item) => ( <tr key={item.id}> <td> <div className="user-name-with-appointments"> <span>{item.name}</span> {managerDepartments(item.id).map((department) => ( <span className="manager-appointment-badge" key={department}> Manager · {department} </span> ))} </div> </td> <td>{item.email}</td> <td> {item.roles.map((role) => role.name).join(", ") \|\| "—"} </td> <td> {item.branches.map((branch) => branch.name).join(", ") \|\| "—"} </td> <td> <b className={`membership-status ${item.status.toLowerCase()}`} > {item.status === "INVITED" ? "Invitation pending" : item.status} </b> </td> <td> <div className="grid-actions"> {item.status === "INVITED" && ( <button type="button" className="grid-action" disabled={busy} onClick={() => void run(() => adminUsersApi.resend(config, item.id), ) } > Resend invite </button> )} <button type="button" className="grid-action" disabled={busy} onClick={() => { setDraft({ id: item.id, name: item.name, email: item.email, roleIds: item.roleIds, branchIds: item.branchIds, version: item.version, }); setEditing(true); }} > Edit </button> <button type="button" className="grid-action grid-action-danger" disabled={busy \|\| item.id === actorId} title={ item.id === actorId ? "You cannot archive your own signed-in account" : undefined } onClick={() => { const reason = window.prompt( "Why is this user being archived?", ); if (reason?.trim()) void run(() => adminUsersApi.archive(config, item.id, reason), ); }} > Archive </button> </div> </td> </tr> ))} </tbody> </table> </div> ) )} {!loading && pagedUsers.totalCount === 0 && ( <div className="list-empty"> <h3>No matching users</h3> <FilterClearButton onClick={clearSearch} label="Clear filters" /> </div> )} <ResultPagination page={pagedUsers.page} pageCount={pagedUsers.pageCount} onChange={setPage} /> 

### ACT-App-tsx-11347

Component: RemoteUserManager Â· src/App.tsx:11347-11347

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={startNew}>
```

Content/label expression: Add User 

### STATE-App-tsx-11352

Component: RemoteUserManager Â· src/App.tsx:11352-11352

Tag: div; visibility: error

```tsx
<div className="api-error" role="alert">
```

Content/label expression:  {error} <button onClick={() => void refresh()}>Retry</button> 

### ACT-App-tsx-11354

Component: RemoteUserManager Â· src/App.tsx:11354-11354

Tag: button; visibility: error

```tsx
<button onClick={() => void refresh()}>
```

Content/label expression: Retry

### FORM-App-tsx-11358

Component: RemoteUserManager Â· src/App.tsx:11358-11378

Tag: form; visibility: editing

```tsx
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
```

Content/label expression:  <div className="form-grid"> <label> User name <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> User email <input required type="email" disabled={Boolean(draft.id)} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value }) } /> <small> {draft.id ? "Email cannot be changed after invitation." : "Cognito will email a temporary password."} </small> </label> </div> <fieldset className="assignment-fieldset"> <legend>Roles</legend> {directory.roles.map((role) => ( <label key={role.id}> <input type="checkbox" checked={draft.roleIds.includes(role.id)} onChange={() => toggle("roleIds", role.id)} /> {role.name} </label> ))} </fieldset> <fieldset className="assignment-fieldset"> <legend>Permitted branches</legend> {directory.branches.map((branch) => ( <label key={branch.id}> <input type="checkbox" checked={draft.branchIds.includes(branch.id)} onChange={() => toggle("branchIds", branch.id)} /> {branch.name} </label> ))} </fieldset> <div className="action-row"> <button className="primary-action" disabled={busy}> {draft.id ? "Save Changes" : "Invite User"} </button> <button type="button" disabled={busy} onClick={() => setEditing(false)} > Cancel </button> </div> 

### ACT-App-tsx-11382

Component: RemoteUserManager Â· src/App.tsx:11382-11388

Tag: input; visibility: editing

```tsx
<input
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-11392

Component: RemoteUserManager Â· src/App.tsx:11392-11400

Tag: input; visibility: editing

```tsx
<input
                required
                type="email"
                disabled={Boolean(draft.id)}
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-11412

Component: RemoteUserManager Â· src/App.tsx:11412-11416

Tag: input; visibility: editing

```tsx
<input
                  type="checkbox"
                  checked={draft.roleIds.includes(role.id)}
                  onChange={() => toggle("roleIds", role.id)}
                />
```

Content/label expression: 

### ACT-App-tsx-11425

Component: RemoteUserManager Â· src/App.tsx:11425-11429

Tag: input; visibility: editing

```tsx
<input
                  type="checkbox"
                  checked={draft.branchIds.includes(branch.id)}
                  onChange={() => toggle("branchIds", branch.id)}
                />
```

Content/label expression: 

### ACT-App-tsx-11435

Component: RemoteUserManager Â· src/App.tsx:11435-11435

Tag: button; visibility: editing

```tsx
<button className="primary-action" disabled={busy}>
```

Content/label expression:  {draft.id ? "Save Changes" : "Invite User"} 

### ACT-App-tsx-11438

Component: RemoteUserManager Â· src/App.tsx:11438-11442

Tag: button; visibility: editing

```tsx
<button
              type="button"
              disabled={busy}
              onClick={() => setEditing(false)}
            >
```

Content/label expression: Cancel 

### ACT-App-tsx-11451

Component: RemoteUserManager Â· src/App.tsx:11451-11459

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label="Search remote users"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email, role, branch or status"
          />
```

Content/label expression: 

### ACT-App-tsx-11461

Component: RemoteUserManager Â· src/App.tsx:11461-11461

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clearSearch} />
```

Content/label expression: 

### ACT-App-tsx-11463

Component: RemoteUserManager Â· src/App.tsx:11463-11476

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-11530

Component: RemoteUserManager Â· src/App.tsx:11530-11539

Tag: button; visibility: item.status === "INVITED"; pagedUsers.totalCount > 0; loading

```tsx
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
```

Content/label expression: Resend invite 

### ACT-App-tsx-11543

Component: RemoteUserManager Â· src/App.tsx:11543-11558

Tag: button; visibility: pagedUsers.totalCount > 0; loading

```tsx
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
```

Content/label expression: Edit 

### ACT-App-tsx-11561

Component: RemoteUserManager Â· src/App.tsx:11561-11579

Tag: button; visibility: pagedUsers.totalCount > 0; loading

```tsx
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
```

Content/label expression: Archive 

### ACT-App-tsx-11594

Component: RemoteUserManager Â· src/App.tsx:11594-11594

Tag: FilterClearButton; visibility: !loading && pagedUsers.totalCount === 0

```tsx
<FilterClearButton onClick={clearSearch} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-11597

Component: RemoteUserManager Â· src/App.tsx:11597-11601

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={pagedUsers.page}
        pageCount={pagedUsers.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### FORM-App-tsx-11665

Component: CustomerEditor Â· src/App.tsx:11665-11678

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {!embedded && ( <PanelTitle icon={<UserRound />} title="Customer Form" subtitle={value.id ? "Edit selected customer" : "Add customer"} /> )} <label> Customer name <input aria-label="Customer name" required value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} /> </label> <label> Mobile <input required value={value.mobile} onChange={(event) => setValue({ ...value, mobile: event.target.value }) } /> </label> <label> Type <input required value={value.type} onChange={(event) => setValue({ ...value, type: event.target.value })} /> </label> <div className="action-row"> <button className="primary-action">Save Customer</button> <button type="button" onClick={() => setValue({ id: 0, name: "", mobile: "", type: "Individual" }) } > New </button> {value.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveCustomer(db, value.id, "Archived from customer master"), ) } > Archive </button> )} </div> 

### ACT-App-tsx-11688

Component: CustomerEditor Â· src/App.tsx:11688-11693

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          aria-label="Customer name"
          required
          value={value.name}
          onChange={(event) => setValue({ ...value, name: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-11697

Component: CustomerEditor Â· src/App.tsx:11697-11703

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          required
          value={value.mobile}
          onChange={(event) =>
            setValue({ ...value, mobile: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-11707

Component: CustomerEditor Â· src/App.tsx:11707-11711

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          required
          value={value.type}
          onChange={(event) => setValue({ ...value, type: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-11714

Component: CustomerEditor Â· src/App.tsx:11714-11714

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Customer

### ACT-App-tsx-11715

Component: CustomerEditor Â· src/App.tsx:11715-11720

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          type="button"
          onClick={() =>
            setValue({ id: 0, name: "", mobile: "", type: "Individual" })
          }
        >
```

Content/label expression: New 

### ACT-App-tsx-11724

Component: CustomerEditor Â· src/App.tsx:11724-11732

Tag: button; visibility: value.id > 0

```tsx
<button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveCustomer(db, value.id, "Archived from customer master"),
              )
            }
          >
```

Content/label expression: Archive 

### FORM-App-tsx-11758

Component: VehicleMasterPanel Â· src/App.tsx:11758-11771

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {!embedded && ( <PanelTitle icon={<Car />} title="Vehicle Form" subtitle="Vehicle master CRUD" /> )} <select value={draft.id} onChange={(event) => { const next = state.vehicles.find( (item) => item.id === Number(event.target.value), ) ?? { id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0, }; setDraft(next); setValue(next); }} > <option value={0}>New vehicle</option> {state.vehicles.map((vehicle) => ( <option key={vehicle.id} value={vehicle.id}> {vehicle.number} </option> ))} </select> <label> Customer <select value={draft.customer_id} onChange={(event) => setDraft({ ...draft, customer_id: Number(event.target.value) }) } > {state.customers.map((customer) => ( <option key={customer.id} value={customer.id}> {customer.name} </option> ))} </select> </label> <div className="form-grid"> <label> Number <input value={draft.number} onChange={(event) => setDraft({ ...draft, number: event.target.value }) } /> </label> <label> Make <input value={draft.make} onChange={(event) => setDraft({ ...draft, make: event.target.value }) } /> </label> <label> Model <input value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value }) } /> </label> <label> Color <input value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value }) } /> </label> <label> KM <input type="number" value={draft.km} onChange={(event) => setDraft({ ...draft, km: Number(event.target.value) }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save Vehicle</button> {draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveVehicle(db, draft.id, "Archived from vehicle master"), ) } > Archive </button> )} </div> 

### ACT-App-tsx-11779

Component: VehicleMasterPanel Â· src/App.tsx:11779-11796

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <option value={0}>New vehicle</option> {state.vehicles.map((vehicle) => ( <option key={vehicle.id} value={vehicle.id}> {vehicle.number} </option> ))} 

### ACT-App-tsx-11806

Component: VehicleMasterPanel Â· src/App.tsx:11806-11811

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
          value={draft.customer_id}
          onChange={(event) =>
            setDraft({ ...draft, customer_id: Number(event.target.value) })
          }
        >
```

Content/label expression:  {state.customers.map((customer) => ( <option key={customer.id} value={customer.id}> {customer.name} </option> ))} 

### ACT-App-tsx-11822

Component: VehicleMasterPanel Â· src/App.tsx:11822-11827

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.number}
            onChange={(event) =>
              setDraft({ ...draft, number: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11831

Component: VehicleMasterPanel Â· src/App.tsx:11831-11836

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.make}
            onChange={(event) =>
              setDraft({ ...draft, make: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11840

Component: VehicleMasterPanel Â· src/App.tsx:11840-11845

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.model}
            onChange={(event) =>
              setDraft({ ...draft, model: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11849

Component: VehicleMasterPanel Â· src/App.tsx:11849-11854

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.color}
            onChange={(event) =>
              setDraft({ ...draft, color: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11858

Component: VehicleMasterPanel Â· src/App.tsx:11858-11864

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="number"
            value={draft.km}
            onChange={(event) =>
              setDraft({ ...draft, km: Number(event.target.value) })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11868

Component: VehicleMasterPanel Â· src/App.tsx:11868-11868

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Vehicle

### ACT-App-tsx-11870

Component: VehicleMasterPanel Â· src/App.tsx:11870-11878

Tag: button; visibility: draft.id > 0

```tsx
<button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveVehicle(db, draft.id, "Archived from vehicle master"),
              )
            }
          >
```

Content/label expression: Archive 

### FORM-App-tsx-11905

Component: DuplicateVisitEditor Â· src/App.tsx:11905-11910

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form
      onSubmit={(event) => {
        event.preventDefault();
        mutate((db) => updateVisit(db, view.visit.id, draft));
      }}
    >
```

Content/label expression:  <label> Advisor <select value={draft.advisor_id} onChange={(event) => setDraft({ ...draft, advisor_id: Number(event.target.value) }) } > {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} </select> </label> <div className="form-grid"> <label> Fuel <input value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value }) } /> </label> <label> Keys <input value={draft.keys} onChange={(event) => setDraft({ ...draft, keys: event.target.value }) } /> </label> <label> Accessories <input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value }) } /> </label> <label> Photo Note <input value={draft.photos_note} onChange={(event) => setDraft({ ...draft, photos_note: event.target.value }) } /> </label> </div> <label> Requested Work <input value={draft.requested_work} onChange={(event) => setDraft({ ...draft, requested_work: event.target.value }) } /> </label> <button className="primary-action">Save Visit</button> 

### ACT-App-tsx-11913

Component: DuplicateVisitEditor Â· src/App.tsx:11913-11918

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
          value={draft.advisor_id}
          onChange={(event) =>
            setDraft({ ...draft, advisor_id: Number(event.target.value) })
          }
        >
```

Content/label expression:  {advisors.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} 

### ACT-App-tsx-11929

Component: DuplicateVisitEditor Â· src/App.tsx:11929-11934

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.fuel}
            onChange={(event) =>
              setDraft({ ...draft, fuel: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11938

Component: DuplicateVisitEditor Â· src/App.tsx:11938-11943

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.keys}
            onChange={(event) =>
              setDraft({ ...draft, keys: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11947

Component: DuplicateVisitEditor Â· src/App.tsx:11947-11952

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.accessories}
            onChange={(event) =>
              setDraft({ ...draft, accessories: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11956

Component: DuplicateVisitEditor Â· src/App.tsx:11956-11961

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.photos_note}
            onChange={(event) =>
              setDraft({ ...draft, photos_note: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-11966

Component: DuplicateVisitEditor Â· src/App.tsx:11966-11971

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={draft.requested_work}
          onChange={(event) =>
            setDraft({ ...draft, requested_work: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-11973

Component: DuplicateVisitEditor Â· src/App.tsx:11973-11973

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Visit

### ACT-App-tsx-12007

Component: AdminJobEditor Â· src/App.tsx:12007-12007

Tag: JobEditor; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<JobEditor {...props} saved={saved} onSaveResult={onSaveResult} />
```

Content/label expression: 

### FORM-App-tsx-12046

Component: JobEditor Â· src/App.tsx:12046-12056

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <div className="form-grid"> <label className="locked-assignment-field"> Service advisor <select aria-label="Service advisor (locked)" value={draft.advisor_id} disabled > {users .filter((item) => item.role === "service") .map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} </select> <small>This assignment is locked and cannot be changed here.</small> </label> <label> Technician <select value={draft.technician_id} onChange={(event) => setDraft({ ...draft, technician_id: Number(event.target.value), }) } > {users .filter((item) => item.role === "tech") .map((tech) => ( <option key={tech.id} value={tech.id}> {tech.name} </option> ))} </select> </label> <label> Main Status <select aria-label="Main Status" disabled value={view.job.main_status} > <option>{view.job.main_status}</option> </select> </label> <label> Promised <input value={draft.promised_at} onChange={(event) => setDraft({ ...draft, promised_at: event.target.value }) } /> </label> </div> <label> Work List <input value={draft.work_list} onChange={(event) => setDraft({ ...draft, work_list: event.target.value }) } /> </label> <label> Customer Instructions <input value={draft.customer_instructions} onChange={(event) => setDraft({ ...draft, customer_instructions: event.target.value }) } /> </label> <label> Internal Instructions <input value={draft.internal_instructions} onChange={(event) => setDraft({ ...draft, internal_instructions: event.target.value }) } /> </label> <label> Advisor Notes <input value={draft.advisor_notes} onChange={(event) => setDraft({ ...draft, advisor_notes: event.target.value }) } /> </label> <h4>Job Sheet</h4> <div className="form-grid"> <label> Service Type <select value={draft.service_type} onChange={(event) => setDraft({ ...draft, service_type: event.target.value }) } > <option value="">—</option> {SERVICE_TYPES.map((item) => ( <option key={item}>{item}</option> ))} </select> </label> <label> Pickup / Drop <select value={draft.pickup_drop} onChange={(event) => setDraft({ ...draft, pickup_drop: event.target.value }) } > <option value="">—</option> {PICKUP_DROP_OPTIONS.map((item) => ( <option key={item}>{item}</option> ))} </select> </label> <label> Estimated Delivery Date <input type="date" value={draft.estimated_delivery} onChange={(event) => setDraft({ ...draft, estimated_delivery: event.target.value }) } /> </label> <label> Fuel <select value={draft.fuel} onChange={(event) => setDraft({ ...draft, fuel: event.target.value }) } > {[...new Set([draft.fuel, ...FUEL_LEVELS])] .filter(Boolean) .map((item) => ( <option key={item}>{item}</option> ))} </select> </label> <label> Accessories <input value={draft.accessories} onChange={(event) => setDraft({ ...draft, accessories: event.target.value }) } /> </label> <label> Engine Number <input value={draft.engine_no} onChange={(event) => setDraft({ ...draft, engine_no: event.target.value }) } /> </label> </div> <label> Address <input value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value }) } /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} <div className="job-details-save-row"> <button className="primary-action">Save Job Details</button> {saved && ( <span className="job-details-saved" role="status"> <Check size={15} aria-hidden="true" /> Job details saved </span> )} </div> 

### ACT-App-tsx-12060

Component: JobEditor Â· src/App.tsx:12060-12064

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              aria-label="Service advisor (locked)"
              value={draft.advisor_id}
              disabled
            >
```

Content/label expression:  {users .filter((item) => item.role === "service") .map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} </option> ))} 

### ACT-App-tsx-12077

Component: JobEditor Â· src/App.tsx:12077-12085

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              value={draft.technician_id}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  technician_id: Number(event.target.value),
                })
              }
            >
```

Content/label expression:  {users .filter((item) => item.role === "tech") .map((tech) => ( <option key={tech.id} value={tech.id}> {tech.name} </option> ))} 

### ACT-App-tsx-12097

Component: JobEditor Â· src/App.tsx:12097-12101

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              aria-label="Main Status"
              disabled
              value={view.job.main_status}
            >
```

Content/label expression:  <option>{view.job.main_status}</option> 

### ACT-App-tsx-12107

Component: JobEditor Â· src/App.tsx:12107-12112

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              value={draft.promised_at}
              onChange={(event) =>
                setDraft({ ...draft, promised_at: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-12117

Component: JobEditor Â· src/App.tsx:12117-12122

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.work_list}
            onChange={(event) =>
              setDraft({ ...draft, work_list: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-12126

Component: JobEditor Â· src/App.tsx:12126-12131

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.customer_instructions}
            onChange={(event) =>
              setDraft({ ...draft, customer_instructions: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-12135

Component: JobEditor Â· src/App.tsx:12135-12140

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.internal_instructions}
            onChange={(event) =>
              setDraft({ ...draft, internal_instructions: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-12144

Component: JobEditor Â· src/App.tsx:12144-12149

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.advisor_notes}
            onChange={(event) =>
              setDraft({ ...draft, advisor_notes: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-12155

Component: JobEditor Â· src/App.tsx:12155-12160

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              value={draft.service_type}
              onChange={(event) =>
                setDraft({ ...draft, service_type: event.target.value })
              }
            >
```

Content/label expression:  <option value="">—</option> {SERVICE_TYPES.map((item) => ( <option key={item}>{item}</option> ))} 

### ACT-App-tsx-12169

Component: JobEditor Â· src/App.tsx:12169-12174

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              value={draft.pickup_drop}
              onChange={(event) =>
                setDraft({ ...draft, pickup_drop: event.target.value })
              }
            >
```

Content/label expression:  <option value="">—</option> {PICKUP_DROP_OPTIONS.map((item) => ( <option key={item}>{item}</option> ))} 

### ACT-App-tsx-12183

Component: JobEditor Â· src/App.tsx:12183-12189

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              type="date"
              value={draft.estimated_delivery}
              onChange={(event) =>
                setDraft({ ...draft, estimated_delivery: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-12193

Component: JobEditor Â· src/App.tsx:12193-12198

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              value={draft.fuel}
              onChange={(event) =>
                setDraft({ ...draft, fuel: event.target.value })
              }
            >
```

Content/label expression:  {[...new Set([draft.fuel, ...FUEL_LEVELS])] .filter(Boolean) .map((item) => ( <option key={item}>{item}</option> ))} 

### ACT-App-tsx-12208

Component: JobEditor Â· src/App.tsx:12208-12213

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              value={draft.accessories}
              onChange={(event) =>
                setDraft({ ...draft, accessories: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-12217

Component: JobEditor Â· src/App.tsx:12217-12222

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              value={draft.engine_no}
              onChange={(event) =>
                setDraft({ ...draft, engine_no: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-12227

Component: JobEditor Â· src/App.tsx:12227-12232

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.address}
            onChange={(event) =>
              setDraft({ ...draft, address: event.target.value })
            }
          />
```

Content/label expression: 

### STATE-App-tsx-12235

Component: JobEditor Â· src/App.tsx:12235-12235

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-12240

Component: JobEditor Â· src/App.tsx:12240-12240

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Job Details

### STATE-App-tsx-12242

Component: JobEditor Â· src/App.tsx:12242-12242

Tag: span; visibility: saved

```tsx
<span className="job-details-saved" role="status">
```

Content/label expression:  <Check size={15} aria-hidden="true" /> Job details saved 

### ACT-App-tsx-12376

Component: JobLifecyclePanel Â· src/App.tsx:12376-12386

Tag: button; visibility: view.material_approval?.status === "Rejected" && actor.role === "service" && actor.id === view.job.advisor_id

```tsx
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
```

Content/label expression: Resubmit for Approval 

### ACT-App-tsx-12394

Component: JobLifecyclePanel Â· src/App.tsx:12394-12411

Tag: button; visibility: allowed.length > 0

```tsx
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
```

Content/label expression:  {lifecycleActionLabel(view.job.main_status, status)} 

### STATE-App-tsx-12418

Component: JobLifecyclePanel Â· src/App.tsx:12418-12418

Tag: p; visibility: error && !target

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-12491

Component: JobLifecyclePanel Â· src/App.tsx:12491-12496

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
                  type="checkbox"
                  checked={Boolean(item.checked_at)}
                  disabled={!enabled}
                  onChange={(event) => toggle(item, event.target.checked)}
                />
```

Content/label expression: 

### ACT-App-tsx-12518

Component: JobLifecyclePanel Â· src/App.tsx:12518-12523

Tag: button; visibility: canMutate && !isGoogleReviewReminder && !artifactLocked && (notApplicable \|\| !item.checked_at) && !( !notApplicable && (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes( item.label, ) && view.material_requests.length > 0 )

```tsx
<button
                    type="button"
                    className="link-action"
                    disabled={notApplicable && laterChecked}
                    onClick={() => toggleNotApplicable(item, !notApplicable)}
                  >
```

Content/label expression:  {notApplicable ? "Undo N/A" : "Mark N/A"} 

### STATE-App-tsx-12543

Component: JobLifecyclePanel Â· src/App.tsx:12543-12559

Tag: Dialog; visibility: target

```tsx
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
```

Content/label expression:  <form id="lifecycle-confirm-form" onSubmit={confirm}> <label> Confirmation note <textarea data-dialog-initial-focus aria-describedby="lifecycle-note-help" value={note} onChange={(event) => setNote(event.target.value)} /> </label> <p id="lifecycle-note-help" className="field-help"> Required. This note is recorded in status history. </p> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 

### ACT-App-tsx-12551

Component: JobLifecyclePanel Â· src/App.tsx:12551-12555

Tag: button; visibility: target

```tsx
<button
              className="primary-action"
              type="submit"
              form="lifecycle-confirm-form"
            >
```

Content/label expression: Confirm status change 

### FORM-App-tsx-12560

Component: JobLifecyclePanel Â· src/App.tsx:12560-12560

Tag: form; visibility: target

```tsx
<form id="lifecycle-confirm-form" onSubmit={confirm}>
```

Content/label expression:  <label> Confirmation note <textarea data-dialog-initial-focus aria-describedby="lifecycle-note-help" value={note} onChange={(event) => setNote(event.target.value)} /> </label> <p id="lifecycle-note-help" className="field-help"> Required. This note is recorded in status history. </p> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-12563

Component: JobLifecyclePanel Â· src/App.tsx:12563-12568

Tag: textarea; visibility: target

```tsx
<textarea
                data-dialog-initial-focus
                aria-describedby="lifecycle-note-help"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
```

Content/label expression: 

### STATE-App-tsx-12574

Component: JobLifecyclePanel Â· src/App.tsx:12574-12574

Tag: p; visibility: error; target

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### STATE-App-tsx-12610

Component: ApproveEstimateDialog Â· src/App.tsx:12610-12623

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="approve-estimate-form" onSubmit={submit}> <label> Approval note <textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 

### ACT-App-tsx-12615

Component: ApproveEstimateDialog Â· src/App.tsx:12615-12619

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="primary-action"
          type="submit"
          form="approve-estimate-form"
        >
```

Content/label expression: Approve Estimate 

### FORM-App-tsx-12624

Component: ApproveEstimateDialog Â· src/App.tsx:12624-12624

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="approve-estimate-form" onSubmit={submit}>
```

Content/label expression:  <label> Approval note <textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-12627

Component: ApproveEstimateDialog Â· src/App.tsx:12627-12631

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea
            data-dialog-initial-focus
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
```

Content/label expression: 

### STATE-App-tsx-12634

Component: ApproveEstimateDialog Â· src/App.tsx:12634-12634

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-12705

Component: EstimateEditor Â· src/App.tsx:12705-12705

Tag: button; visibility: canMutate

```tsx
<button className="primary-action" onClick={() => setOpen(true)}>
```

Content/label expression:  {view.estimate ? "Edit Estimate" : "Create Estimate"} 

### ACT-App-tsx-12715

Component: EstimateEditor Â· src/App.tsx:12715-12720

Tag: EstimateDialog; visibility: open

```tsx
<EstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setOpen(false)}
        />
```

Content/label expression: 

### STATE-App-tsx-12788

Component: EstimateDialog Â· src/App.tsx:12788-12803

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="estimate-dialog-form" onSubmit={save} className="estimate-dialog-form" > <div className="estimate-items"> <div className="line-items-header"> <strong>Estimate items</strong> <button type="button" className="add-line-item" onClick={() => setItems((rows) => [ ...rows, { key: `new-${Date.now()}-${rows.length}`, kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18, }, ]) } > + Add Item </button> </div> <div className="estimate-item estimate-item-heading"> <span>Kind</span> <span>Description</span> <span>Quantity</span> <span>Rate</span> <span>GST type</span> <span>GST rate</span> <span>Action</span> </div> {items.map((item, index) => ( <div className="estimate-item" key={item.key}> <select aria-label={`Item ${index + 1} kind`} value={item.kind} onChange={(event) => updateItem(item.key, { kind: event.target.value as EstimateDraftRow["kind"], }) } > <option>Service</option> <option>Material</option> </select> <input data-dialog-initial-focus={index === 0 ? true : undefined} aria-label={`Item ${index + 1} description`} value={item.description} onChange={(event) => updateItem(item.key, { description: event.target.value }) } /> <input aria-label={`Item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.key, { qty: Number(event.target.value) }) } /> <input aria-label={`Item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.key, { rate: Number(event.target.value) }) } /> <select aria-label={`Item ${index + 1} GST type`} value={item.gst_type} onChange={(event) => updateItem(item.key, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }), }) } > <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option> </select> {item.gst_type === "No GST" ? ( <span className="gst-no-rate">0%</span> ) : ( <SearchSelect label={`Item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} onChange={(value) => updateItem(item.key, { gst_rate: Number(value) }) } placeholder="GST rate" hideLabel /> )} <button type="button" className="link-action line-remove" aria-label={`Remove item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key)) } > Remove </button> </div> ))} </div> <div className="form-grid estimate-form-grid"> <label className="estimate-discount"> Discount <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /> </label> </div> <label className="estimate-notes"> Notes <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <div className="estimate-total"> <span>Subtotal {money(totals.subtotal)}</span> <span>GST {money(totals.gst)}</span> <strong>Total {money(totals.total)}</strong> </div> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 

### ACT-App-tsx-12795

Component: EstimateDialog Â· src/App.tsx:12795-12799

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="primary-action"
          type="submit"
          form="estimate-dialog-form"
        >
```

Content/label expression: Save Estimate 

### FORM-App-tsx-12804

Component: EstimateDialog Â· src/App.tsx:12804-12808

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form
        id="estimate-dialog-form"
        onSubmit={save}
        className="estimate-dialog-form"
      >
```

Content/label expression:  <div className="estimate-items"> <div className="line-items-header"> <strong>Estimate items</strong> <button type="button" className="add-line-item" onClick={() => setItems((rows) => [ ...rows, { key: `new-${Date.now()}-${rows.length}`, kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18, }, ]) } > + Add Item </button> </div> <div className="estimate-item estimate-item-heading"> <span>Kind</span> <span>Description</span> <span>Quantity</span> <span>Rate</span> <span>GST type</span> <span>GST rate</span> <span>Action</span> </div> {items.map((item, index) => ( <div className="estimate-item" key={item.key}> <select aria-label={`Item ${index + 1} kind`} value={item.kind} onChange={(event) => updateItem(item.key, { kind: event.target.value as EstimateDraftRow["kind"], }) } > <option>Service</option> <option>Material</option> </select> <input data-dialog-initial-focus={index === 0 ? true : undefined} aria-label={`Item ${index + 1} description`} value={item.description} onChange={(event) => updateItem(item.key, { description: event.target.value }) } /> <input aria-label={`Item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} onChange={(event) => updateItem(item.key, { qty: Number(event.target.value) }) } /> <input aria-label={`Item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.key, { rate: Number(event.target.value) }) } /> <select aria-label={`Item ${index + 1} GST type`} value={item.gst_type} onChange={(event) => updateItem(item.key, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }), }) } > <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option> </select> {item.gst_type === "No GST" ? ( <span className="gst-no-rate">0%</span> ) : ( <SearchSelect label={`Item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} onChange={(value) => updateItem(item.key, { gst_rate: Number(value) }) } placeholder="GST rate" hideLabel /> )} <button type="button" className="link-action line-remove" aria-label={`Remove item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((row) => row.key !== item.key)) } > Remove </button> </div> ))} </div> <div className="form-grid estimate-form-grid"> <label className="estimate-discount"> Discount <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /> </label> </div> <label className="estimate-notes"> Notes <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <div className="estimate-total"> <span>Subtotal {money(totals.subtotal)}</span> <span>GST {money(totals.gst)}</span> <strong>Total {money(totals.total)}</strong> </div> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-12812

Component: EstimateDialog Â· src/App.tsx:12812-12829

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: + Add Item 

### ACT-App-tsx-12844

Component: EstimateDialog Â· src/App.tsx:12844-12852

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
                aria-label={`Item ${index + 1} kind`}
                value={item.kind}
                onChange={(event) =>
                  updateItem(item.key, {
                    kind: event.target.value as EstimateDraftRow["kind"],
                  })
                }
              >
```

Content/label expression:  <option>Service</option> <option>Material</option> 

### ACT-App-tsx-12856

Component: EstimateDialog Â· src/App.tsx:12856-12863

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
                data-dialog-initial-focus={index === 0 ? true : undefined}
                aria-label={`Item ${index + 1} description`}
                value={item.description}
                onChange={(event) =>
                  updateItem(item.key, { description: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-12864

Component: EstimateDialog Â· src/App.tsx:12864-12873

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-12874

Component: EstimateDialog Â· src/App.tsx:12874-12883

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-12884

Component: EstimateDialog Â· src/App.tsx:12884-12895

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option> 

### ACT-App-tsx-12903

Component: EstimateDialog Â· src/App.tsx:12903-12912

Tag: SearchSelect; visibility: item.gst_type === "No GST"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-12914

Component: EstimateDialog Â· src/App.tsx:12914-12921

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
                type="button"
                className="link-action line-remove"
                aria-label={`Remove item ${index + 1}`}
                onClick={() =>
                  setItems((rows) => rows.filter((row) => row.key !== item.key))
                }
              >
```

Content/label expression: Remove 

### ACT-App-tsx-12930

Component: EstimateDialog Â· src/App.tsx:12930-12936

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value))}
            />
```

Content/label expression: 

### ACT-App-tsx-12941

Component: EstimateDialog Â· src/App.tsx:12941-12945

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
```

Content/label expression: 

### STATE-App-tsx-12953

Component: EstimateDialog Â· src/App.tsx:12953-12953

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### FORM-App-tsx-12972

Component: FollowupEditor Â· src/App.tsx:12972-12982

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <PanelTitle icon={<ClipboardCheck />} title="Follow-ups" subtitle="Due date, outcome and completion" /> {view.followups.map((followup) => ( <button type="button" className={draft.id === followup.id ? "row active" : "row"} key={followup.id} onClick={() => setDraft(followup)} > <strong>{followup.due_at}</strong> <span>{followup.done ? "Done" : "Open"}</span> <span>{followup.note}</span> </button> ))} <label> Note <input value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /> </label> <div className="form-grid"> <label> Due <input type="date" value={draft.due_at} onChange={(event) => setDraft({ ...draft, due_at: event.target.value }) } /> </label> <label> Outcome <input value={draft.outcome ?? ""} onChange={(event) => setDraft({ ...draft, outcome: event.target.value }) } /> </label> </div> <div className="action-row"> <button className="primary-action">Save Follow-up</button> {draft.id > 0 && ( <button type="button" onClick={() => mutate((db) => markFollowupDone(db, draft.id, draft.outcome \|\| "Done"), ) } > Mark Done </button> )} {draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveFollowup(db, draft.id, "Archived follow-up"), ) } > Archive </button> )} </div> 

### ACT-App-tsx-12989

Component: FollowupEditor Â· src/App.tsx:12989-12994

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          type="button"
          className={draft.id === followup.id ? "row active" : "row"}
          key={followup.id}
          onClick={() => setDraft(followup)}
        >
```

Content/label expression:  <strong>{followup.due_at}</strong> <span>{followup.done ? "Done" : "Open"}</span> <span>{followup.note}</span> 

### ACT-App-tsx-13002

Component: FollowupEditor Â· src/App.tsx:13002-13005

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={draft.note}
          onChange={(event) => setDraft({ ...draft, note: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-13010

Component: FollowupEditor Â· src/App.tsx:13010-13016

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="date"
            value={draft.due_at}
            onChange={(event) =>
              setDraft({ ...draft, due_at: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-13020

Component: FollowupEditor Â· src/App.tsx:13020-13025

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.outcome ?? ""}
            onChange={(event) =>
              setDraft({ ...draft, outcome: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-13029

Component: FollowupEditor Â· src/App.tsx:13029-13029

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Follow-up

### ACT-App-tsx-13031

Component: FollowupEditor Â· src/App.tsx:13031-13038

Tag: button; visibility: draft.id > 0

```tsx
<button
            type="button"
            onClick={() =>
              mutate((db) =>
                markFollowupDone(db, draft.id, draft.outcome || "Done"),
              )
            }
          >
```

Content/label expression: Mark Done 

### ACT-App-tsx-13043

Component: FollowupEditor Â· src/App.tsx:13043-13051

Tag: button; visibility: draft.id > 0

```tsx
<button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveFollowup(db, draft.id, "Archived follow-up"),
              )
            }
          >
```

Content/label expression: Archive 

### STATE-App-tsx-13172

Component: JobMediaPanel Â· src/App.tsx:13172-13177

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
        className="sub-tabs media-phase-tabs"
        role="tablist"
        aria-label="Photo gallery filter"
        onKeyDown={handleTabListKeyDown}
      >
```

Content/label expression:  {(["All Photos", "Before Work", "After Work"] as const).map( (filter) => { const id = filter === "All Photos" ? "all" : filter === "Before Work" ? "before" : "after"; return ( <button type="button" id={`media-tab-${view.job.id}-${id}`} role="tab" aria-selected={galleryFilter === filter} aria-controls={`media-panel-${view.job.id}-${id}`} tabIndex={galleryFilter === filter ? 0 : -1} className={galleryFilter === filter ? "active" : ""} key={filter} onClick={() => setGalleryFilter(filter)} > {filter} </button> ); }, )} 

### STATE-App-tsx-13187

Component: JobMediaPanel Â· src/App.tsx:13187-13197

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {filter} 

### STATE-App-tsx-13204

Component: JobMediaPanel Â· src/App.tsx:13204-13208

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
        id={`media-panel-${view.job.id}-${galleryFilterId}`}
        role="tabpanel"
        aria-labelledby={`media-tab-${view.job.id}-${galleryFilterId}`}
      >
```

Content/label expression:  <section className="media-upload" aria-label="Upload photo"> <label> Upload phase <select value={uploadPhase} onChange={(event) => setUploadPhase(event.target.value as JobMediaCategory) } > <option>Before Work</option> <option>After Work</option> </select> </label> {canUpload ? ( <form onSubmit={upload}> <div className="form-grid"> <label> Photo label <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={`${uploadPhase} photo`} /> </label> <label> Image file <input id={`job-media-file-${view.job.id}`} aria-describedby={`job-media-help-${view.job.id}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseFile(event.target.files?.[0]) } /> </label> </div> <p className="field-help" id={`job-media-help-${view.job.id}`}> JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed below 1 MB and are not stored outside this session. </p> {prepared && ( <p className="media-ready" aria-live="polite"> Ready: {prepared.width} × {prepared.height} ·{" "} {Math.ceil(prepared.byteSize / 1024)} KB </p> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} <button className="primary-action" disabled={busy}> {busy ? "Compressing…" : `Upload to ${uploadPhase}`} </button> </form> ) : ( <p className="permission-note"> {canMutateJobLifecycle(actor, view.job) ? mediaLockMessage(uploadPhase) : "Read only. Media changes are limited to the Owner and the linked Service Advisor."} </p> )} </section> {rows.length ? ( <div className="job-media-gallery" data-testid="job-media-gallery"> {rows.map((photo) => ( <article className="job-media-card" key={photo.id}> <img src={photo.src} alt={photo.label} /> <div> <strong>{photo.label}</strong> <span> {photo.category === "Before Work" \|\| photo.category === "After Work" ? photo.category : "General"} </span> <span> {photo.original_name \|\| photo.mime_type \|\| "Image"} {photo.byte_size ? ` · ${Math.ceil(photo.byte_size / 1024)} KB` : ""} </span> </div> {canMutatePhoto(photo) && ( <div className="record-actions"> <button type="button" onClick={() => setEditing(photo)}> Edit </button> <button type="button" className="danger-action" onClick={() => { setArchiveTarget(photo); setArchiveReason(""); }} > Archive </button> </div> )} </article> ))} </div> ) : ( <p className="empty-state"> {galleryFilter === "All Photos" ? "No images yet." : `No ${galleryFilter.toLocaleLowerCase()} images yet.`} </p> )} {editing && ( <MediaMetadataDialog photo={editing} actor={actor} mutate={mutate} onClose={() => setEditing(undefined)} /> )} {archiveTarget && ( <Dialog title="Archive photo?" subtitle={archiveTarget.label} onClose={() => setArchiveTarget(undefined)} footer={ <button className="danger-action" type="submit" form="archive-photo-form" > Archive photo </button> } > <form id="archive-photo-form" onSubmit={(event) => { event.preventDefault(); setError(""); if ( mutate( (db) => archiveJobPhotoForActor( db, archiveTarget.id, actor.id, archiveReason, ), setError, ) ) setArchiveTarget(undefined); }} > <label> Archive reason <textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> </Dialog> )} 

### ACT-App-tsx-13212

Component: JobMediaPanel Â· src/App.tsx:13212-13217

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              value={uploadPhase}
              onChange={(event) =>
                setUploadPhase(event.target.value as JobMediaCategory)
              }
            >
```

Content/label expression:  <option>Before Work</option> <option>After Work</option> 

### FORM-App-tsx-13223

Component: JobMediaPanel Â· src/App.tsx:13223-13223

Tag: form; visibility: canUpload

```tsx
<form onSubmit={upload}>
```

Content/label expression:  <div className="form-grid"> <label> Photo label <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={`${uploadPhase} photo`} /> </label> <label> Image file <input id={`job-media-file-${view.job.id}`} aria-describedby={`job-media-help-${view.job.id}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void chooseFile(event.target.files?.[0]) } /> </label> </div> <p className="field-help" id={`job-media-help-${view.job.id}`}> JPEG, PNG, or WebP; maximum input 10 MB. Images are compressed below 1 MB and are not stored outside this session. </p> {prepared && ( <p className="media-ready" aria-live="polite"> Ready: {prepared.width} × {prepared.height} ·{" "} {Math.ceil(prepared.byteSize / 1024)} KB </p> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} <button className="primary-action" disabled={busy}> {busy ? "Compressing…" : `Upload to ${uploadPhase}`} </button> 

### ACT-App-tsx-13227

Component: JobMediaPanel Â· src/App.tsx:13227-13231

Tag: input; visibility: canUpload

```tsx
<input
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    placeholder={`${uploadPhase} photo`}
                  />
```

Content/label expression: 

### ACT-App-tsx-13235

Component: JobMediaPanel Â· src/App.tsx:13235-13243

Tag: input; visibility: canUpload

```tsx
<input
                    id={`job-media-file-${view.job.id}`}
                    aria-describedby={`job-media-help-${view.job.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      void chooseFile(event.target.files?.[0])
                    }
                  />
```

Content/label expression: 

### STATE-App-tsx-13257

Component: JobMediaPanel Â· src/App.tsx:13257-13257

Tag: p; visibility: error; canUpload

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-13261

Component: JobMediaPanel Â· src/App.tsx:13261-13261

Tag: button; visibility: canUpload

```tsx
<button className="primary-action" disabled={busy}>
```

Content/label expression:  {busy ? "Compressing…" : `Upload to ${uploadPhase}`} 

### ACT-App-tsx-13295

Component: JobMediaPanel Â· src/App.tsx:13295-13295

Tag: button; visibility: canMutatePhoto(photo); rows.length

```tsx
<button type="button" onClick={() => setEditing(photo)}>
```

Content/label expression: Edit 

### ACT-App-tsx-13298

Component: JobMediaPanel Â· src/App.tsx:13298-13305

Tag: button; visibility: canMutatePhoto(photo); rows.length

```tsx
<button
                      type="button"
                      className="danger-action"
                      onClick={() => {
                        setArchiveTarget(photo);
                        setArchiveReason("");
                      }}
                    >
```

Content/label expression: Archive 

### ACT-App-tsx-13321

Component: JobMediaPanel Â· src/App.tsx:13321-13326

Tag: MediaMetadataDialog; visibility: editing

```tsx
<MediaMetadataDialog
            photo={editing}
            actor={actor}
            mutate={mutate}
            onClose={() => setEditing(undefined)}
          />
```

Content/label expression: 

### STATE-App-tsx-13329

Component: JobMediaPanel Â· src/App.tsx:13329-13342

Tag: Dialog; visibility: archiveTarget

```tsx
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
```

Content/label expression:  <form id="archive-photo-form" onSubmit={(event) => { event.preventDefault(); setError(""); if ( mutate( (db) => archiveJobPhotoForActor( db, archiveTarget.id, actor.id, archiveReason, ), setError, ) ) setArchiveTarget(undefined); }} > <label> Archive reason <textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 

### ACT-App-tsx-13334

Component: JobMediaPanel Â· src/App.tsx:13334-13338

Tag: button; visibility: archiveTarget

```tsx
<button
                className="danger-action"
                type="submit"
                form="archive-photo-form"
              >
```

Content/label expression: Archive photo 

### FORM-App-tsx-13343

Component: JobMediaPanel Â· src/App.tsx:13343-13362

Tag: form; visibility: archiveTarget

```tsx
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
```

Content/label expression:  <label> Archive reason <textarea data-dialog-initial-focus required value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-13365

Component: JobMediaPanel Â· src/App.tsx:13365-13370

Tag: textarea; visibility: archiveTarget

```tsx
<textarea
                  data-dialog-initial-focus
                  required
                  value={archiveReason}
                  onChange={(event) => setArchiveReason(event.target.value)}
                />
```

Content/label expression: 

### STATE-App-tsx-13373

Component: JobMediaPanel Â· src/App.tsx:13373-13373

Tag: p; visibility: error; archiveTarget

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### STATE-App-tsx-13402

Component: MediaMetadataDialog Â· src/App.tsx:13402-13415

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="media-metadata-form" onSubmit={(event) => { event.preventDefault(); if ( mutate( (db) => updateJobPhotoForActor(db, photo.id, actor.id, { label, category, }), setError, ) ) onClose(); }} > <label> Photo label <input data-dialog-initial-focus value={label} onChange={(event) => setLabel(event.target.value)} /> </label> <label> Work phase <select value={category} onChange={(event) => setCategory(event.target.value as JobMediaCategory) } > <option>Before Work</option> <option>After Work</option> </select> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 

### ACT-App-tsx-13407

Component: MediaMetadataDialog Â· src/App.tsx:13407-13411

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="primary-action"
          type="submit"
          form="media-metadata-form"
        >
```

Content/label expression: Save metadata 

### FORM-App-tsx-13416

Component: MediaMetadataDialog Â· src/App.tsx:13416-13432

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <label> Photo label <input data-dialog-initial-focus value={label} onChange={(event) => setLabel(event.target.value)} /> </label> <label> Work phase <select value={category} onChange={(event) => setCategory(event.target.value as JobMediaCategory) } > <option>Before Work</option> <option>After Work</option> </select> </label> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-13435

Component: MediaMetadataDialog Â· src/App.tsx:13435-13439

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            data-dialog-initial-focus
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
```

Content/label expression: 

### ACT-App-tsx-13443

Component: MediaMetadataDialog Â· src/App.tsx:13443-13448

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as JobMediaCategory)
            }
          >
```

Content/label expression:  <option>Before Work</option> <option>After Work</option> 

### STATE-App-tsx-13454

Component: MediaMetadataDialog Â· src/App.tsx:13454-13454

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### FORM-App-tsx-13559

Component: MaterialRequestEditor Â· src/App.tsx:13559-13565

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form
      className={embedded ? "" : "desk-panel"}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
```

Content/label expression:  {!embedded && ( <PanelTitle icon={<PackageCheck />} title="Request Form" subtitle={ store ? "Inventory request or tracking-only local purchase" : "Job-linked material request" } /> )} {store && ( <fieldset className="source-toggle"> <legend>Source</legend> <label> <input type="radio" checked={source === "inventory"} onChange={() => { setSource("inventory"); setError(""); }} /> Inventory </label> <label> <input type="radio" checked={source === "local"} onChange={() => { setSource("local"); setError(""); }} /> Local purchase </label> </fieldset> )} {source === "inventory" ? ( <> <label> Request <select value={draft.id} onChange={(event) => selectRequest(Number(event.target.value))} > <option value={0}>New request</option> {requests.map((request) => ( <option key={request.id} value={request.id}> Request #{request.id} </option> ))} </select> </label> {store ? ( <JobPicker jobs={state.jobs} selectedJobId={draft.job_card_id \|\| undefined} onSelect={setJob} label="Material request job" period={period} onPeriodChange={setPeriod} /> ) : ( <label> Job <select value={draft.job_card_id} onChange={(event) => setDraft({ ...draft, job_card_id: Number(event.target.value), }) } > {state.jobs.map((job) => ( <option key={job.job.id} value={job.job.id}> {job.job.job_no} </option> ))} </select> </label> )} <label> Item <select value={draft.item_id} onChange={(event) => setDraft({ ...draft, item_id: Number(event.target.value) }) } > {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} </select> </label> <label> Requested Qty <input type="number" min="0.01" step="0.01" value={draft.requested_qty} onChange={(event) => setDraft({ ...draft, requested_qty: Number(event.target.value), }) } /> </label> </> ) : ( <> <label> Local purchase <select value={purchase.id} onChange={(event) => selectPurchase(Number(event.target.value))} > <option value={0}>New local purchase</option> {purchases.map((item) => ( <option key={item.id} value={item.id}> {item.item_description} · {item.bill_reference} </option> ))} </select> </label> <JobPicker jobs={state.jobs} selectedJobId={purchase.job_card_id \|\| undefined} onSelect={setJob} label="Local purchase job" period={period} onPeriodChange={setPeriod} /> <div className="form-grid"> <label> Item description <input required value={purchase.item_description} onChange={(event) => setPurchase({ ...purchase, item_description: event.target.value, }) } /> </label> <label> Quantity <input required type="number" min="0.01" step="0.01" value={purchase.quantity} onChange={(event) => setPurchase({ ...purchase, quantity: Number(event.target.value), }) } /> </label> <label> Unit <input required value={purchase.unit} onChange={(event) => setPurchase({ ...purchase, unit: event.target.value }) } /> </label> <label> Unit cost <input required type="number" min="0" step="0.01" value={purchase.unit_cost} onChange={(event) => setPurchase({ ...purchase, unit_cost: Number(event.target.value), }) } /> </label> <label> Vendor / shop <input required value={purchase.vendor} onChange={(event) => setPurchase({ ...purchase, vendor: event.target.value }) } /> </label> <label> Bill / reference <input required value={purchase.bill_reference} onChange={(event) => setPurchase({ ...purchase, bill_reference: event.target.value, }) } /> </label> </div> <label> Note (optional) <textarea value={purchase.note ?? ""} onChange={(event) => setPurchase({ ...purchase, note: event.target.value }) } /> </label> </> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} <div className="action-row"> <button className="primary-action"> {source === "local" ? "Save Local Purchase" : "Save Request"} </button> {source === "inventory" && draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate( (db) => archiveMaterialRequest( db, draft.id, "Archived material request", ), setError, ) } > Archive </button> )} {source === "local" && purchase.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate( (db) => archiveLocalPurchase( db, purchase.id, "Archived local purchase", ), setError, ) } > Archive </button> )} </div> 

### ACT-App-tsx-13581

Component: MaterialRequestEditor Â· src/App.tsx:13581-13588

Tag: input; visibility: store

```tsx
<input
              type="radio"
              checked={source === "inventory"}
              onChange={() => {
                setSource("inventory");
                setError("");
              }}
            />
```

Content/label expression: 

### ACT-App-tsx-13592

Component: MaterialRequestEditor Â· src/App.tsx:13592-13599

Tag: input; visibility: store

```tsx
<input
              type="radio"
              checked={source === "local"}
              onChange={() => {
                setSource("local");
                setError("");
              }}
            />
```

Content/label expression: 

### ACT-App-tsx-13608

Component: MaterialRequestEditor Â· src/App.tsx:13608-13611

Tag: select; visibility: source === "inventory"

```tsx
<select
              value={draft.id}
              onChange={(event) => selectRequest(Number(event.target.value))}
            >
```

Content/label expression:  <option value={0}>New request</option> {requests.map((request) => ( <option key={request.id} value={request.id}> Request #{request.id} </option> ))} 

### ACT-App-tsx-13621

Component: MaterialRequestEditor Â· src/App.tsx:13621-13628

Tag: JobPicker; visibility: store; source === "inventory"

```tsx
<JobPicker
              jobs={state.jobs}
              selectedJobId={draft.job_card_id || undefined}
              onSelect={setJob}
              label="Material request job"
              period={period}
              onPeriodChange={setPeriod}
            />
```

Content/label expression: 

### ACT-App-tsx-13632

Component: MaterialRequestEditor Â· src/App.tsx:13632-13640

Tag: select; visibility: store; source === "inventory"

```tsx
<select
                value={draft.job_card_id}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    job_card_id: Number(event.target.value),
                  })
                }
              >
```

Content/label expression:  {state.jobs.map((job) => ( <option key={job.job.id} value={job.job.id}> {job.job.job_no} </option> ))} 

### ACT-App-tsx-13651

Component: MaterialRequestEditor Â· src/App.tsx:13651-13656

Tag: select; visibility: source === "inventory"

```tsx
<select
              value={draft.item_id}
              onChange={(event) =>
                setDraft({ ...draft, item_id: Number(event.target.value) })
              }
            >
```

Content/label expression:  {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 

### ACT-App-tsx-13666

Component: MaterialRequestEditor Â· src/App.tsx:13666-13677

Tag: input; visibility: source === "inventory"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-13684

Component: MaterialRequestEditor Â· src/App.tsx:13684-13687

Tag: select; visibility: source === "inventory"

```tsx
<select
              value={purchase.id}
              onChange={(event) => selectPurchase(Number(event.target.value))}
            >
```

Content/label expression:  <option value={0}>New local purchase</option> {purchases.map((item) => ( <option key={item.id} value={item.id}> {item.item_description} · {item.bill_reference} </option> ))} 

### ACT-App-tsx-13696

Component: MaterialRequestEditor Â· src/App.tsx:13696-13703

Tag: JobPicker; visibility: source === "inventory"

```tsx
<JobPicker
            jobs={state.jobs}
            selectedJobId={purchase.job_card_id || undefined}
            onSelect={setJob}
            label="Local purchase job"
            period={period}
            onPeriodChange={setPeriod}
          />
```

Content/label expression: 

### ACT-App-tsx-13707

Component: MaterialRequestEditor Â· src/App.tsx:13707-13716

Tag: input; visibility: source === "inventory"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-13720

Component: MaterialRequestEditor Â· src/App.tsx:13720-13732

Tag: input; visibility: source === "inventory"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-13736

Component: MaterialRequestEditor Â· src/App.tsx:13736-13742

Tag: input; visibility: source === "inventory"

```tsx
<input
                required
                value={purchase.unit}
                onChange={(event) =>
                  setPurchase({ ...purchase, unit: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-13746

Component: MaterialRequestEditor Â· src/App.tsx:13746-13758

Tag: input; visibility: source === "inventory"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-13762

Component: MaterialRequestEditor Â· src/App.tsx:13762-13768

Tag: input; visibility: source === "inventory"

```tsx
<input
                required
                value={purchase.vendor}
                onChange={(event) =>
                  setPurchase({ ...purchase, vendor: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-13772

Component: MaterialRequestEditor Â· src/App.tsx:13772-13781

Tag: input; visibility: source === "inventory"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-13786

Component: MaterialRequestEditor Â· src/App.tsx:13786-13791

Tag: textarea; visibility: source === "inventory"

```tsx
<textarea
              value={purchase.note ?? ""}
              onChange={(event) =>
                setPurchase({ ...purchase, note: event.target.value })
              }
            />
```

Content/label expression: 

### STATE-App-tsx-13796

Component: MaterialRequestEditor Â· src/App.tsx:13796-13796

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-13801

Component: MaterialRequestEditor Â· src/App.tsx:13801-13801

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression:  {source === "local" ? "Save Local Purchase" : "Save Request"} 

### ACT-App-tsx-13805

Component: MaterialRequestEditor Â· src/App.tsx:13805-13819

Tag: button; visibility: source === "inventory" && draft.id > 0

```tsx
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
```

Content/label expression: Archive 

### ACT-App-tsx-13824

Component: MaterialRequestEditor Â· src/App.tsx:13824-13838

Tag: button; visibility: source === "local" && purchase.id > 0

```tsx
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
```

Content/label expression: Archive 

### STATE-App-tsx-13888

Component: ReleaseMaterialDialog Â· src/App.tsx:13888-13902

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <div className="record-view"> <Info label="Job" value={row.view.job.job_no} /> <Info label="Item" value={item?.name ?? `Item ${row.request.item_id}`} /> <Info label="Requested quantity" value={`${row.request.requested_qty} ${item?.unit ?? ""}`} /> <Info label="Available stock" value={`${available} ${item?.unit ?? ""}`} /> </div> {row.request.requested_qty > available && ( <p className="error-text" role="alert"> Insufficient stock: this release needs {row.request.requested_qty}{" "} {item?.unit ?? "units"}, but only {available} is available. </p> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-13894

Component: ReleaseMaterialDialog Â· src/App.tsx:13894-13894

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="secondary-action" onClick={onClose}>
```

Content/label expression: Cancel 

### ACT-App-tsx-13897

Component: ReleaseMaterialDialog Â· src/App.tsx:13897-13897

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" onClick={confirm}>
```

Content/label expression: Confirm release 

### STATE-App-tsx-13919

Component: ReleaseMaterialDialog Â· src/App.tsx:13919-13919

Tag: p; visibility: row.request.requested_qty > available

```tsx
<p className="error-text" role="alert">
```

Content/label expression: Insufficient stock: this release needs {row.request.requested_qty} {" "} {item?.unit ?? "units"} , but only {available} is available. 

### STATE-App-tsx-13925

Component: ReleaseMaterialDialog Â· src/App.tsx:13925-13925

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### STATE-App-tsx-13956

Component: MaterialApprovalSubmitDialog Â· src/App.tsx:13956-13970

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <p> This holds the job and sends one consolidated material request to Admin. Store cannot issue or change materials until a decision is made. </p> {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-13962

Component: MaterialApprovalSubmitDialog Â· src/App.tsx:13962-13962

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="secondary-action" onClick={onClose}>
```

Content/label expression: Cancel 

### ACT-App-tsx-13965

Component: MaterialApprovalSubmitDialog Â· src/App.tsx:13965-13965

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" onClick={submit}>
```

Content/label expression: Needs Approval 

### STATE-App-tsx-13976

Component: MaterialApprovalSubmitDialog Â· src/App.tsx:13976-13976

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### STATE-App-tsx-14050

Component: ReconcileEditor Â· src/App.tsx:14050-14070

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="reconcile-material-form" className="reconcile-dialog-form" onSubmit={submit} > <dl className="reconciliation-context"> <div> <dt>Job card</dt> <dd>{view.job.job_no}</dd> </div> <div> <dt>Vehicle</dt> <dd>{view.vehicle.number}</dd> </div> <div> <dt>Customer</dt> <dd>{view.customer.name}</dd> </div> <div> <dt>Item</dt> <dd>{item?.name ?? "Unknown"}</dd> </div> <div> <dt>SKU</dt> <dd>{item?.sku ?? "No SKU"}</dd> </div> <div> <dt>Issued</dt> <dd> {request.issued_qty} {item?.unit ?? ""} </dd> </div> </dl> <div className="form-grid"> <label> Used <input data-dialog-initial-focus aria-label="Used quantity" type="number" min="0" step="any" value={used} onChange={changeQuantity(setUsed)} /> </label> <label> Returned <input aria-label="Returned quantity" type="number" min="0" step="any" value={returned} onChange={changeQuantity(setReturned)} /> </label> <label> Wasted <input aria-label="Wasted quantity" type="number" min="0" step="any" value={wasted} onChange={changeQuantity(setWasted)} /> </label> </div> <p className="reconciliation-equation"> {request.issued_qty} issued ={" "} {Number.isFinite(usedQty) ? usedQty : "—"} used +{" "} {Number.isFinite(returnedQty) ? returnedQty : "—"} returned +{" "} {Number.isFinite(wastedQty) ? wastedQty : "—"} wasted +{" "} {Number.isFinite(variance) ? variance : "—"} variance </p> <p className={`reconciliation-state ${state.toLowerCase()}`}> State: {state} · Variance:{" "} {Number.isFinite(variance) ? variance : "—"} </p> {needsZeroAcknowledgement && ( <label className="checkbox-line"> <input aria-label="Confirm no return or wastage" type="checkbox" checked={zeroRecordedAcknowledged} onChange={(event) => { setZeroRecordedAcknowledged(event.target.checked); setError(""); }} />{" "} I confirm that neither returned material nor wastage is being recorded. </label> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} </form> 

### ACT-App-tsx-14057

Component: ReconcileEditor Â· src/App.tsx:14057-14057

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="secondary-action" onClick={onClose}>
```

Content/label expression: Cancel 

### ACT-App-tsx-14060

Component: ReconcileEditor Â· src/App.tsx:14060-14065

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="submit"
            form="reconcile-material-form"
            className="primary-action"
            disabled={!canSave}
          >
```

Content/label expression: Save Reconciliation 

### FORM-App-tsx-14071

Component: ReconcileEditor Â· src/App.tsx:14071-14075

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form
        id="reconcile-material-form"
        className="reconcile-dialog-form"
        onSubmit={submit}
      >
```

Content/label expression:  <dl className="reconciliation-context"> <div> <dt>Job card</dt> <dd>{view.job.job_no}</dd> </div> <div> <dt>Vehicle</dt> <dd>{view.vehicle.number}</dd> </div> <div> <dt>Customer</dt> <dd>{view.customer.name}</dd> </div> <div> <dt>Item</dt> <dd>{item?.name ?? "Unknown"}</dd> </div> <div> <dt>SKU</dt> <dd>{item?.sku ?? "No SKU"}</dd> </div> <div> <dt>Issued</dt> <dd> {request.issued_qty} {item?.unit ?? ""} </dd> </div> </dl> <div className="form-grid"> <label> Used <input data-dialog-initial-focus aria-label="Used quantity" type="number" min="0" step="any" value={used} onChange={changeQuantity(setUsed)} /> </label> <label> Returned <input aria-label="Returned quantity" type="number" min="0" step="any" value={returned} onChange={changeQuantity(setReturned)} /> </label> <label> Wasted <input aria-label="Wasted quantity" type="number" min="0" step="any" value={wasted} onChange={changeQuantity(setWasted)} /> </label> </div> <p className="reconciliation-equation"> {request.issued_qty} issued ={" "} {Number.isFinite(usedQty) ? usedQty : "—"} used +{" "} {Number.isFinite(returnedQty) ? returnedQty : "—"} returned +{" "} {Number.isFinite(wastedQty) ? wastedQty : "—"} wasted +{" "} {Number.isFinite(variance) ? variance : "—"} variance </p> <p className={`reconciliation-state ${state.toLowerCase()}`}> State: {state} · Variance:{" "} {Number.isFinite(variance) ? variance : "—"} </p> {needsZeroAcknowledgement && ( <label className="checkbox-line"> <input aria-label="Confirm no return or wastage" type="checkbox" checked={zeroRecordedAcknowledged} onChange={(event) => { setZeroRecordedAcknowledged(event.target.checked); setError(""); }} />{" "} I confirm that neither returned material nor wastage is being recorded. </label> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-14107

Component: ReconcileEditor Â· src/App.tsx:14107-14115

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              data-dialog-initial-focus
              aria-label="Used quantity"
              type="number"
              min="0"
              step="any"
              value={used}
              onChange={changeQuantity(setUsed)}
            />
```

Content/label expression: 

### ACT-App-tsx-14119

Component: ReconcileEditor Â· src/App.tsx:14119-14126

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Returned quantity"
              type="number"
              min="0"
              step="any"
              value={returned}
              onChange={changeQuantity(setReturned)}
            />
```

Content/label expression: 

### ACT-App-tsx-14130

Component: ReconcileEditor Â· src/App.tsx:14130-14137

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Wasted quantity"
              type="number"
              min="0"
              step="any"
              value={wasted}
              onChange={changeQuantity(setWasted)}
            />
```

Content/label expression: 

### ACT-App-tsx-14153

Component: ReconcileEditor Â· src/App.tsx:14153-14161

Tag: input; visibility: needsZeroAcknowledgement

```tsx
<input
              aria-label="Confirm no return or wastage"
              type="checkbox"
              checked={zeroRecordedAcknowledged}
              onChange={(event) => {
                setZeroRecordedAcknowledged(event.target.checked);
                setError("");
              }}
            />
```

Content/label expression: 

### STATE-App-tsx-14167

Component: ReconcileEditor Â· src/App.tsx:14167-14167

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### FORM-App-tsx-14246

Component: QuickAddStock Â· src/App.tsx:14246-14246

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="quick-add-stock" onSubmit={submit}>
```

Content/label expression:  {!addingNew ? ( <> <SearchSelect label="Existing SKU" options={inventory.map((item) => ({ value: item.id, label: `${item.sku} · ${item.name}`, }))} value={selectedId \|\| undefined} onChange={(value) => setSelectedId(Number(value))} placeholder="Search SKU or material" openOnFocus={false} /> {selected && ( <p className="quick-add-selected"> {selected.name} · {selected.stock_qty} {selected.unit} on hand </p> )} <label> Inward quantity <input aria-label="Inward quantity" type="number" min="0.01" step="0.01" required value={inwardQty} onChange={(event) => setInwardQty(Number(event.target.value))} /> </label> <label> Purchase order (optional) <select aria-label="Purchase order" value={purchaseOrderId} onChange={(event) => { setPurchaseOrderId(Number(event.target.value)); setPurchaseOrderLineId(0); }} > <option value={0}>Unlinked/manual receipt</option> {purchaseOrders .filter((order) => ["Sent", "Partially Received", "Ready to Close"].includes( order.status, ), ) .map((order) => ( <option key={order.id} value={order.id}> {order.po_number} </option> ))} </select> </label> {purchaseOrderId > 0 && ( <label> Purchase order line <select aria-label="Purchase order line" value={purchaseOrderLineId} onChange={(event) => setPurchaseOrderLineId(Number(event.target.value)) } > <option value={0}>Select compatible line</option> {purchaseOrderLines .filter( (line) => line.purchase_order_id === purchaseOrderId && line.item_id === selectedId, ) .map((line) => ( <option key={line.id} value={line.id}> { purchaseOrders.find( (order) => order.id === purchaseOrderId, )?.po_number }{" "} ·{" "} {inventory.find((item) => item.id === line.item_id)?.name}{" "} · ordered {line.ordered_qty} </option> ))} </select> </label> )} <div className="quick-add-actions"> <button type="button" data-dialog-initial-focus className="link-action" onClick={() => setAddingNew(true)} > Add new SKU </button> <button className="primary-action" disabled={ !selectedId \|\| (purchaseOrderId > 0 && !purchaseOrderLineId) } > Record Inward </button> </div> </> ) : ( <> <div className="form-grid"> <label> SKU <input aria-label="New SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Material name <input aria-label="New material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Category <input aria-label="New SKU category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Unit <input aria-label="New SKU unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Low-stock threshold <input aria-label="New SKU low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) } /> </label> <label> Default selling price (₹) <input aria-label="New SKU selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) } /> </label> <label> Initial inward quantity <input aria-label="Initial inward quantity" type="number" min="0" step="0.01" required value={inwardQty} onChange={(event) => setInwardQty(Number(event.target.value))} /> </label> </div> <div className="quick-add-actions"> <button type="button" className="link-action" onClick={() => setAddingNew(false)} > Choose existing SKU </button> <button className="primary-action"> Create SKU &amp; Record Inward </button> </div> </> )} {error && ( <p className="error-text" role="alert"> {error} </p> )} 

### ACT-App-tsx-14249

Component: QuickAddStock Â· src/App.tsx:14249-14259

Tag: SearchSelect; visibility: !addingNew

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-14267

Component: QuickAddStock Â· src/App.tsx:14267-14275

Tag: input; visibility: !addingNew

```tsx
<input
              aria-label="Inward quantity"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={inwardQty}
              onChange={(event) => setInwardQty(Number(event.target.value))}
            />
```

Content/label expression: 

### ACT-App-tsx-14279

Component: QuickAddStock Â· src/App.tsx:14279-14286

Tag: select; visibility: !addingNew

```tsx
<select
              aria-label="Purchase order"
              value={purchaseOrderId}
              onChange={(event) => {
                setPurchaseOrderId(Number(event.target.value));
                setPurchaseOrderLineId(0);
              }}
            >
```

Content/label expression:  <option value={0}>Unlinked/manual receipt</option> {purchaseOrders .filter((order) => ["Sent", "Partially Received", "Ready to Close"].includes( order.status, ), ) .map((order) => ( <option key={order.id} value={order.id}> {order.po_number} </option> ))} 

### ACT-App-tsx-14304

Component: QuickAddStock Â· src/App.tsx:14304-14310

Tag: select; visibility: purchaseOrderId > 0; !addingNew

```tsx
<select
                aria-label="Purchase order line"
                value={purchaseOrderLineId}
                onChange={(event) =>
                  setPurchaseOrderLineId(Number(event.target.value))
                }
              >
```

Content/label expression:  <option value={0}>Select compatible line</option> {purchaseOrderLines .filter( (line) => line.purchase_order_id === purchaseOrderId && line.item_id === selectedId, ) .map((line) => ( <option key={line.id} value={line.id}> { purchaseOrders.find( (order) => order.id === purchaseOrderId, )?.po_number }{" "} ·{" "} {inventory.find((item) => item.id === line.item_id)?.name}{" "} · ordered {line.ordered_qty} </option> ))} 

### ACT-App-tsx-14334

Component: QuickAddStock Â· src/App.tsx:14334-14339

Tag: button; visibility: !addingNew

```tsx
<button
              type="button"
              data-dialog-initial-focus
              className="link-action"
              onClick={() => setAddingNew(true)}
            >
```

Content/label expression: Add new SKU 

### ACT-App-tsx-14342

Component: QuickAddStock Â· src/App.tsx:14342-14347

Tag: button; visibility: !addingNew

```tsx
<button
              className="primary-action"
              disabled={
                !selectedId || (purchaseOrderId > 0 && !purchaseOrderLineId)
              }
            >
```

Content/label expression: Record Inward 

### ACT-App-tsx-14357

Component: QuickAddStock Â· src/App.tsx:14357-14364

Tag: input; visibility: !addingNew

```tsx
<input
                aria-label="New SKU"
                required
                value={draft.sku}
                onChange={(event) =>
                  setDraft({ ...draft, sku: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-14368

Component: QuickAddStock Â· src/App.tsx:14368-14375

Tag: input; visibility: !addingNew

```tsx
<input
                aria-label="New material name"
                required
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-14379

Component: QuickAddStock Â· src/App.tsx:14379-14386

Tag: input; visibility: !addingNew

```tsx
<input
                aria-label="New SKU category"
                required
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-14390

Component: QuickAddStock Â· src/App.tsx:14390-14397

Tag: input; visibility: !addingNew

```tsx
<input
                aria-label="New SKU unit"
                required
                value={draft.unit}
                onChange={(event) =>
                  setDraft({ ...draft, unit: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-14401

Component: QuickAddStock Â· src/App.tsx:14401-14414

Tag: input; visibility: !addingNew

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-14418

Component: QuickAddStock Â· src/App.tsx:14418-14431

Tag: input; visibility: !addingNew

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-14435

Component: QuickAddStock Â· src/App.tsx:14435-14443

Tag: input; visibility: !addingNew

```tsx
<input
                aria-label="Initial inward quantity"
                type="number"
                min="0"
                step="0.01"
                required
                value={inwardQty}
                onChange={(event) => setInwardQty(Number(event.target.value))}
              />
```

Content/label expression: 

### ACT-App-tsx-14447

Component: QuickAddStock Â· src/App.tsx:14447-14451

Tag: button; visibility: !addingNew

```tsx
<button
              type="button"
              className="link-action"
              onClick={() => setAddingNew(false)}
            >
```

Content/label expression: Choose existing SKU 

### ACT-App-tsx-14454

Component: QuickAddStock Â· src/App.tsx:14454-14454

Tag: button; visibility: !addingNew

```tsx
<button className="primary-action">
```

Content/label expression: Create SKU &amp; Record Inward 

### STATE-App-tsx-14461

Component: QuickAddStock Â· src/App.tsx:14461-14461

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### STATE-App-tsx-14497

Component: EditStockDetailsDialog Â· src/App.tsx:14497-14515

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="edit-stock-details" className="stock-edit-form" onSubmit={save}> <p className="muted"> Stock quantity is changed only by an inward or stock movement. </p> <div className="form-grid"> <label> SKU <input data-dialog-initial-focus aria-label="Edit SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Material name <input aria-label="Edit material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Category <input aria-label="Edit category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Unit <input aria-label="Edit unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Low-stock threshold <input aria-label="Edit low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) } /> </label> <label> Default selling price (₹) <input aria-label="Edit selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) } /> </label> </div> {confirmingArchive && ( <p className="error-text" role="alert"> Archive this SKU? It will no longer be available for new material requests. </p> )} </form> 

### ACT-App-tsx-14503

Component: EditStockDetailsDialog Â· src/App.tsx:14503-14503

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="danger-action" onClick={archive}>
```

Content/label expression:  {confirmingArchive ? "Confirm archive" : "Archive"} 

### ACT-App-tsx-14506

Component: EditStockDetailsDialog Â· src/App.tsx:14506-14510

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            className="primary-action"
            type="submit"
            form="edit-stock-details"
          >
```

Content/label expression: Save changes 

### FORM-App-tsx-14516

Component: EditStockDetailsDialog Â· src/App.tsx:14516-14516

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="edit-stock-details" className="stock-edit-form" onSubmit={save}>
```

Content/label expression:  <p className="muted"> Stock quantity is changed only by an inward or stock movement. </p> <div className="form-grid"> <label> SKU <input data-dialog-initial-focus aria-label="Edit SKU" required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Material name <input aria-label="Edit material name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Category <input aria-label="Edit category" required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Unit <input aria-label="Edit unit" required value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Low-stock threshold <input aria-label="Edit low-stock threshold" type="number" min="0" step="0.01" required value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value), }) } /> </label> <label> Default selling price (₹) <input aria-label="Edit selling price" type="number" min="0" step="0.01" required value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value), }) } /> </label> </div> {confirmingArchive && ( <p className="error-text" role="alert"> Archive this SKU? It will no longer be available for new material requests. </p> )} 

### ACT-App-tsx-14523

Component: EditStockDetailsDialog Â· src/App.tsx:14523-14531

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              data-dialog-initial-focus
              aria-label="Edit SKU"
              required
              value={draft.sku}
              onChange={(event) =>
                setDraft({ ...draft, sku: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-14535

Component: EditStockDetailsDialog Â· src/App.tsx:14535-14542

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Edit material name"
              required
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-14546

Component: EditStockDetailsDialog Â· src/App.tsx:14546-14553

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Edit category"
              required
              value={draft.category}
              onChange={(event) =>
                setDraft({ ...draft, category: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-14557

Component: EditStockDetailsDialog Â· src/App.tsx:14557-14564

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              aria-label="Edit unit"
              required
              value={draft.unit}
              onChange={(event) =>
                setDraft({ ...draft, unit: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-14568

Component: EditStockDetailsDialog Â· src/App.tsx:14568-14581

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-14585

Component: EditStockDetailsDialog Â· src/App.tsx:14585-14598

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### STATE-App-tsx-14602

Component: EditStockDetailsDialog Â· src/App.tsx:14602-14602

Tag: p; visibility: confirmingArchive

```tsx
<p className="error-text" role="alert">
```

Content/label expression: Archive this SKU? It will no longer be available for new material requests. 

### FORM-App-tsx-14637

Component: InventoryEditor Â· src/App.tsx:14637-14647

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {!embedded && ( <PanelTitle icon={<Boxes />} title="Stock Form" subtitle="Master, stock-in and adjustment" /> )} <select value={draft.id} onChange={(event) => setDraft( state.inventory.find( (item) => item.id === Number(event.target.value), ) ?? emptyInventoryItem(), ) } > <option value={0}>New item</option> {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.sku} </option> ))} </select> <div className="form-grid"> <label> SKU <input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value }) } /> </label> <label> Category <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value }) } /> </label> <label> Name <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value }) } /> </label> <label> Unit <input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value }) } /> </label> <label> Stock <input type="number" value={draft.stock_qty} onChange={(event) => setDraft({ ...draft, stock_qty: Number(event.target.value) }) } /> </label> <label> Low Stock <input type="number" value={draft.low_stock_qty} onChange={(event) => setDraft({ ...draft, low_stock_qty: Number(event.target.value) }) } /> </label> <label> Selling Price <input type="number" min="0" step="0.01" value={draft.selling_price} onChange={(event) => setDraft({ ...draft, selling_price: Number(event.target.value) }) } /> </label> </div> <label> Movement Qty <input type="number" value={movementQty} onChange={(event) => setMovementQty(Number(event.target.value))} /> </label> <div className="action-row"> <button className="primary-action">Save Item</button> {draft.id > 0 && ( <button type="button" onClick={() => mutate((db) => stockIn(db, draft.id, movementQty, "Manual stock-in"), ) } > Stock In </button> )} {draft.id > 0 && ( <button type="button" onClick={() => mutate((db) => adjustStock(db, draft.id, movementQty, "Manual adjustment"), ) } > Set Stock </button> )} {draft.id > 0 && ( <button type="button" className="danger-action" onClick={() => mutate((db) => archiveInventoryItem(db, draft.id, "Archived inventory item"), ) } > Archive </button> )} </div> {draft.id > 0 && ( <section className="local-purchase-records" aria-label="Item purchase history" > <h4>Item purchase history</h4> {purchaseHistory.length === 0 ? ( <p className="empty-state"> No inward purchase receipts for this item. </p> ) : ( <ul className="material-rows"> {purchaseHistory.map(({ line, purchase }) => ( <li key={line.id} className="material-row"> <div className="material-row-main"> <strong> {purchase.invoice_date} ·{" "} {state.suppliers.find( (supplier) => supplier.id === purchase.supplier_id, )?.name ?? "Archived supplier"} </strong> <span> {line.received_qty} {draft.unit} · {money(line.unit_cost)}{" "} pre-GST · GST {line.gst_rate}% </span> <small> Invoice {purchase.supplier_invoice_no} ·{" "} {purchase.po_number ? `PO ${purchase.po_number} · ` : ""} {purchase.status} </small> </div> </li> ))} </ul> )} </section> )} 

### ACT-App-tsx-14655

Component: InventoryEditor Â· src/App.tsx:14655-14664

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <option value={0}>New item</option> {state.inventory.map((item) => ( <option key={item.id} value={item.id}> {item.sku} </option> ))} 

### ACT-App-tsx-14675

Component: InventoryEditor Â· src/App.tsx:14675-14680

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.sku}
            onChange={(event) =>
              setDraft({ ...draft, sku: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14684

Component: InventoryEditor Â· src/App.tsx:14684-14689

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.category}
            onChange={(event) =>
              setDraft({ ...draft, category: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14693

Component: InventoryEditor Â· src/App.tsx:14693-14698

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14702

Component: InventoryEditor Â· src/App.tsx:14702-14707

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            value={draft.unit}
            onChange={(event) =>
              setDraft({ ...draft, unit: event.target.value })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14711

Component: InventoryEditor Â· src/App.tsx:14711-14717

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="number"
            value={draft.stock_qty}
            onChange={(event) =>
              setDraft({ ...draft, stock_qty: Number(event.target.value) })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14721

Component: InventoryEditor Â· src/App.tsx:14721-14727

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="number"
            value={draft.low_stock_qty}
            onChange={(event) =>
              setDraft({ ...draft, low_stock_qty: Number(event.target.value) })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14731

Component: InventoryEditor Â· src/App.tsx:14731-14739

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            type="number"
            min="0"
            step="0.01"
            value={draft.selling_price}
            onChange={(event) =>
              setDraft({ ...draft, selling_price: Number(event.target.value) })
            }
          />
```

Content/label expression: 

### ACT-App-tsx-14744

Component: InventoryEditor Â· src/App.tsx:14744-14748

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={movementQty}
          onChange={(event) => setMovementQty(Number(event.target.value))}
        />
```

Content/label expression: 

### ACT-App-tsx-14751

Component: InventoryEditor Â· src/App.tsx:14751-14751

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Item

### ACT-App-tsx-14753

Component: InventoryEditor Â· src/App.tsx:14753-14760

Tag: button; visibility: draft.id > 0

```tsx
<button
            type="button"
            onClick={() =>
              mutate((db) =>
                stockIn(db, draft.id, movementQty, "Manual stock-in"),
              )
            }
          >
```

Content/label expression: Stock In 

### ACT-App-tsx-14765

Component: InventoryEditor Â· src/App.tsx:14765-14772

Tag: button; visibility: draft.id > 0

```tsx
<button
            type="button"
            onClick={() =>
              mutate((db) =>
                adjustStock(db, draft.id, movementQty, "Manual adjustment"),
              )
            }
          >
```

Content/label expression: Set Stock 

### ACT-App-tsx-14777

Component: InventoryEditor Â· src/App.tsx:14777-14785

Tag: button; visibility: draft.id > 0

```tsx
<button
            type="button"
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveInventoryItem(db, draft.id, "Archived inventory item"),
              )
            }
          >
```

Content/label expression: Archive 

### FORM-App-tsx-14848

Component: TaskCreator Â· src/App.tsx:14848-14867

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <label> New Task <input value={title} onChange={(event) => setTitle(event.target.value)} /> </label> <label> Notes <input value={notes} onChange={(event) => setNotes(event.target.value)} /> </label> <button>Add Task</button> 

### ACT-App-tsx-14870

Component: TaskCreator Â· src/App.tsx:14870-14873

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
```

Content/label expression: 

### ACT-App-tsx-14877

Component: TaskCreator Â· src/App.tsx:14877-14880

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
```

Content/label expression: 

### ACT-App-tsx-14882

Component: TaskCreator Â· src/App.tsx:14882-14882

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button>
```

Content/label expression: Add Task

### ACT-App-tsx-14904

Component: QcEditor Â· src/App.tsx:14904-14906

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
            >
```

Content/label expression: Pass 

### ACT-App-tsx-14909

Component: QcEditor Â· src/App.tsx:14909-14915

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              onClick={() =>
                mutate((db) =>
                  failQcWithRework(db, check.id, technicianId, reason),
                )
              }
            >
```

Content/label expression: Fail + Rework 

### ACT-App-tsx-14923

Component: QcEditor Â· src/App.tsx:14923-14926

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
```

Content/label expression: 

### ACT-App-tsx-14929

Component: QcEditor Â· src/App.tsx:14929-14931

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          onClick={() => mutate((db) => markWashingNeeded(db, view.job.id))}
        >
```

Content/label expression: Washing Needed 

### ACT-App-tsx-14934

Component: QcEditor Â· src/App.tsx:14934-14934

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button onClick={() => mutate((db) => passQc(db, view.job.id))}>
```

Content/label expression: Pass All QC 

### ACT-App-tsx-14970

Component: ReadyToInvoiceDraft Â· src/App.tsx:14970-14970

Tag: button; visibility: canCreate

```tsx
<button type="button" className="primary-action" onClick={onCreate}>
```

Content/label expression: Create Invoice 

### STATE-App-tsx-14982

Component: ReadyToInvoiceDraft Â· src/App.tsx:14982-14982

Tag: p; visibility: warning

```tsx
<p className="permission-note" role="status">
```

Content/label expression:  {warning} 

### ACT-App-tsx-15114

Component: DataFlowWorkspace Â· src/App.tsx:15114-15124

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <option value="">All months</option> {months.map((value) => ( <option key={value} value={value}> {new Date(`${value}-01T00:00:00`).toLocaleDateString( "en-IN", { month: "long", year: "numeric" }, )} </option> ))} 

### ACT-App-tsx-15138

Component: DataFlowWorkspace Â· src/App.tsx:15138-15149

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <option value="">All dates</option> {dates.map((value) => ( <option key={value} value={value}> {new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", })} </option> ))} 

### ACT-App-tsx-15164

Component: DataFlowWorkspace Â· src/App.tsx:15164-15187

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-15197

Component: DataFlowWorkspace Â· src/App.tsx:15197-15207

Tag: button; visibility: options.length; open

```tsx
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
```

Content/label expression:  <strong>{view.job.job_no}</strong> <span> {view.vehicle.number} · {view.customer.name} </span> 

### STATE-App-tsx-15215

Component: DataFlowWorkspace Â· src/App.tsx:15215-15215

Tag: p; visibility: options.length; open

```tsx
<p className="data-flow-no-matches" role="status">
```

Content/label expression: No matching jobs 

### ACT-App-tsx-15222

Component: DataFlowWorkspace Â· src/App.tsx:15222-15222

Tag: FilterClearButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<FilterClearButton onClick={clear} />
```

Content/label expression: 

### ACT-App-tsx-15308

Component: DocumentDownloadButton Â· src/App.tsx:15308-15314

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
        type="button"
        className={className}
        disabled={status === "preparing"}
        aria-busy={status === "preparing"}
        onClick={download}
      >
```

Content/label expression:  <Download size={15} /> {status === "preparing" ? "Preparing…" : status === "done" ? "Downloaded ✓" : (label ?? "Download PDF")} 

### ACT-App-tsx-15323

Component: DocumentDownloadButton Â· src/App.tsx:15323-15327

Tag: button; visibility: showPrint

```tsx
<button
          type="button"
          className="workflow-action action-secondary document-print"
          onClick={print}
        >
```

Content/label expression:  <Printer size={15} /> Print 

### STATE-App-tsx-15333

Component: DocumentDownloadButton Â· src/App.tsx:15333-15333

Tag: span; visibility: status === "error"

```tsx
<span className="document-error" role="alert">
```

Content/label expression:  {errorMessage} 

### ACT-App-tsx-15362

Component: DataFlowLine Â· src/App.tsx:15362-15369

Tag: DocumentDownloadButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<DocumentDownloadButton
        kind={event.document.kind}
        view={view}
        snapshotId={snap?.id}
        label="PDF"
        showPrint={false}
        className="workflow-action action-document document-download data-flow-document-action"
      />
```

Content/label expression: 

### ACT-App-tsx-15409

Component: DataFlowLine Â· src/App.tsx:15409-15413

Tag: DocumentDownloadButton; visibility: row.document && row.done

```tsx
<DocumentDownloadButton
                  kind={row.document}
                  view={view}
                  className="workflow-action action-document document-download data-flow-document-action"
                />
```

Content/label expression: 

### ACT-App-tsx-15538

Component: JobDocuments Â· src/App.tsx:15538-15542

Tag: button; visibility: actions.includes("create-estimate"); documents.length

```tsx
<button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("estimate")}
                    >
```

Content/label expression:  <Plus size={15} /> Create Estimate 

### ACT-App-tsx-15548

Component: JobDocuments Â· src/App.tsx:15548-15552

Tag: button; visibility: actions.includes("edit-estimate"); documents.length

```tsx
<button
                      type="button"
                      className="workflow-action action-secondary"
                      onClick={() => setEditor("estimate")}
                    >
```

Content/label expression:  <Pencil size={15} /> Edit 

### ACT-App-tsx-15558

Component: JobDocuments Â· src/App.tsx:15558-15562

Tag: button; visibility: actions.includes("approve-estimate"); documents.length

```tsx
<button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("approve-estimate")}
                    >
```

Content/label expression:  <Check size={15} /> Approve Estimate 

### ACT-App-tsx-15568

Component: JobDocuments Â· src/App.tsx:15568-15572

Tag: button; visibility: actions.includes("create-invoice"); documents.length

```tsx
<button
                      type="button"
                      className="workflow-action action-primary"
                      onClick={() => setEditor("invoice")}
                    >
```

Content/label expression:  <Plus size={15} /> Create Invoice 

### ACT-App-tsx-15578

Component: JobDocuments Â· src/App.tsx:15578-15582

Tag: button; visibility: actions.includes("edit-invoice"); documents.length

```tsx
<button
                      type="button"
                      className="workflow-action action-secondary"
                      onClick={() => setEditor("invoice")}
                    >
```

Content/label expression:  <Pencil size={15} /> Edit 

### ACT-App-tsx-15588

Component: JobDocuments Â· src/App.tsx:15588-15593

Tag: DocumentDownloadButton; visibility: actions.includes("download"); documents.length

```tsx
<DocumentDownloadButton
                      kind={document.kind}
                      view={view}
                      snapshotId={document.snapshotId}
                      className="workflow-action action-document document-download"
                    />
```

Content/label expression: 

### ACT-App-tsx-15606

Component: JobDocuments Â· src/App.tsx:15606-15611

Tag: EstimateDialog; visibility: editor === "estimate"

```tsx
<EstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-15614

Component: JobDocuments Â· src/App.tsx:15614-15619

Tag: ApproveEstimateDialog; visibility: editor === "approve-estimate"

```tsx
<ApproveEstimateDialog
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-15622

Component: JobDocuments Â· src/App.tsx:15622-15629

Tag: InvoiceDialog; visibility: editor === "invoice"

```tsx
<InvoiceDialog
          fixedJob
          action={view.invoice ? "edit" : "create"}
          view={view}
          actor={actor}
          mutate={mutate}
          onClose={() => setEditor(undefined)}
        />
```

Content/label expression: 

### STATE-App-tsx-15756

Component: AddJobCardDialog Â· src/App.tsx:15756-15766

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <form id="add-job-card-form" onSubmit={submit}> <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Customer" options={state.customers.map((item) => ({ value: item.id, label: `${item.name} / ${item.mobile}`, }))} value={customerId \|\| undefined} onChange={(value) => { setCustomerId(Number(value)); setVehicleId(0); }} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > + Add new customer </button> </div> <div className="field-with-action"> <SearchSelect label="Vehicle" options={vehicleOptions.map((item) => ({ value: item.id, label: `${item.number} / ${item.make} ${item.model}`, }))} value={vehicleId \|\| undefined} onChange={(value) => setVehicleId(Number(value))} placeholder="Search registration or model" /> <button type="button" className="link-action" onClick={() => setQuickAdd("vehicle")} > + Add new vehicle </button> </div> <label> Service advisor <select value={advisorId} disabled={actor.role === "service"} onChange={(event) => setAdvisorId(Number(event.target.value))} > {advisors.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} </select> </label> <label> ODO Meter Reading (km) <input required min="0" type="number" inputMode="numeric" placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`} value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel/Battery Level <div className="field-pair"> <input required placeholder="Value" value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select aria-label="Fuel or battery unit" value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> </div> <label> Requested work <input required value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> {error && ( <p role="alert" className="form-error"> {error} </p> )} </form> {quickAdd === "customer" && ( <Dialog title="Add Customer" onClose={() => setQuickAdd(undefined)}> <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setAwaiting("customer"); setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> </Dialog> )} {quickAdd === "vehicle" && ( <Dialog title="Add Vehicle" onClose={() => setQuickAdd(undefined)}> <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: customerId \|\| state.customers[0]?.id \|\| 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => { setAwaiting("vehicle"); setQuickAdd(undefined); }} /> </Dialog> )} 

### ACT-App-tsx-15762

Component: AddJobCardDialog Â· src/App.tsx:15762-15762

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button form="add-job-card-form" className="primary-action">
```

Content/label expression: Create Job Card 

### FORM-App-tsx-15767

Component: AddJobCardDialog Â· src/App.tsx:15767-15767

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="add-job-card-form" onSubmit={submit}>
```

Content/label expression:  <div className="form-grid"> <div className="field-with-action"> <SearchSelect label="Customer" options={state.customers.map((item) => ({ value: item.id, label: `${item.name} / ${item.mobile}`, }))} value={customerId \|\| undefined} onChange={(value) => { setCustomerId(Number(value)); setVehicleId(0); }} placeholder="Search customer or mobile" /> <button type="button" className="link-action" onClick={() => setQuickAdd("customer")} > + Add new customer </button> </div> <div className="field-with-action"> <SearchSelect label="Vehicle" options={vehicleOptions.map((item) => ({ value: item.id, label: `${item.number} / ${item.make} ${item.model}`, }))} value={vehicleId \|\| undefined} onChange={(value) => setVehicleId(Number(value))} placeholder="Search registration or model" /> <button type="button" className="link-action" onClick={() => setQuickAdd("vehicle")} > + Add new vehicle </button> </div> <label> Service advisor <select value={advisorId} disabled={actor.role === "service"} onChange={(event) => setAdvisorId(Number(event.target.value))} > {advisors.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} </select> </label> <label> ODO Meter Reading (km) <input required min="0" type="number" inputMode="numeric" placeholder={`Current vehicle KM: ${vehicle?.km ?? "—"}`} value={form.odoReading} onChange={(event) => setForm({ ...form, odoReading: event.target.value }) } /> </label> <label> Fuel/Battery Level <div className="field-pair"> <input required placeholder="Value" value={form.fuelLevelValue} onChange={(event) => setForm({ ...form, fuelLevelValue: event.target.value }) } /> <select aria-label="Fuel or battery unit" value={form.fuelLevelUnit} onChange={(event) => setForm({ ...form, fuelLevelUnit: event.target .value as typeof form.fuelLevelUnit, }) } > <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> </select> </div> </label> <label> Keys <input value={form.keys} onChange={(event) => setForm({ ...form, keys: event.target.value }) } /> </label> <label> Accessories <input value={form.accessories} onChange={(event) => setForm({ ...form, accessories: event.target.value }) } /> </label> </div> <label> Requested work <input required value={form.requestedWork} onChange={(event) => setForm({ ...form, requestedWork: event.target.value }) } /> </label> {error && ( <p role="alert" className="form-error"> {error} </p> )} 

### ACT-App-tsx-15770

Component: AddJobCardDialog Â· src/App.tsx:15770-15782

Tag: SearchSelect; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-15783

Component: AddJobCardDialog Â· src/App.tsx:15783-15787

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              type="button"
              className="link-action"
              onClick={() => setQuickAdd("customer")}
            >
```

Content/label expression: + Add new customer 

### ACT-App-tsx-15792

Component: AddJobCardDialog Â· src/App.tsx:15792-15801

Tag: SearchSelect; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-15802

Component: AddJobCardDialog Â· src/App.tsx:15802-15806

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              type="button"
              className="link-action"
              onClick={() => setQuickAdd("vehicle")}
            >
```

Content/label expression: + Add new vehicle 

### ACT-App-tsx-15812

Component: AddJobCardDialog Â· src/App.tsx:15812-15816

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
              value={advisorId}
              disabled={actor.role === "service"}
              onChange={(event) => setAdvisorId(Number(event.target.value))}
            >
```

Content/label expression:  {advisors.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 

### ACT-App-tsx-15826

Component: AddJobCardDialog Â· src/App.tsx:15826-15836

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-15841

Component: AddJobCardDialog Â· src/App.tsx:15841-15848

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
                required
                placeholder="Value"
                value={form.fuelLevelValue}
                onChange={(event) =>
                  setForm({ ...form, fuelLevelValue: event.target.value })
                }
              />
```

Content/label expression: 

### ACT-App-tsx-15849

Component: AddJobCardDialog Â· src/App.tsx:15849-15859

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option> 

### ACT-App-tsx-15869

Component: AddJobCardDialog Â· src/App.tsx:15869-15874

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              value={form.keys}
              onChange={(event) =>
                setForm({ ...form, keys: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-15878

Component: AddJobCardDialog Â· src/App.tsx:15878-15883

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
              value={form.accessories}
              onChange={(event) =>
                setForm({ ...form, accessories: event.target.value })
              }
            />
```

Content/label expression: 

### ACT-App-tsx-15888

Component: AddJobCardDialog Â· src/App.tsx:15888-15894

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            required
            value={form.requestedWork}
            onChange={(event) =>
              setForm({ ...form, requestedWork: event.target.value })
            }
          />
```

Content/label expression: 

### STATE-App-tsx-15897

Component: AddJobCardDialog Â· src/App.tsx:15897-15897

Tag: p; visibility: error

```tsx
<p role="alert" className="form-error">
```

Content/label expression:  {error} 

### STATE-App-tsx-15903

Component: AddJobCardDialog Â· src/App.tsx:15903-15903

Tag: Dialog; visibility: quickAdd === "customer"

```tsx
<Dialog title="Add Customer" onClose={() => setQuickAdd(undefined)}>
```

Content/label expression:  <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} onSaved={() => { setAwaiting("customer"); setQuickAdd(undefined); setNewCustomer({ id: 0, name: "", mobile: "", type: "Individual", }); }} /> 

### ACT-App-tsx-15904

Component: AddJobCardDialog Â· src/App.tsx:15904-15919

Tag: CustomerEditor; visibility: quickAdd === "customer"

```tsx
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
```

Content/label expression: 

### STATE-App-tsx-15923

Component: AddJobCardDialog Â· src/App.tsx:15923-15923

Tag: Dialog; visibility: quickAdd === "vehicle"

```tsx
<Dialog title="Add Vehicle" onClose={() => setQuickAdd(undefined)}>
```

Content/label expression:  <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: customerId \|\| state.customers[0]?.id \|\| 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} onSaved={() => { setAwaiting("vehicle"); setQuickAdd(undefined); }} /> 

### ACT-App-tsx-15924

Component: AddJobCardDialog Â· src/App.tsx:15924-15942

Tag: VehicleMasterPanel; visibility: quickAdd === "vehicle"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-15977

Component: JobBodyMarkPanel Â· src/App.tsx:15977-15994

Tag: BodyMarkDiagram; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-15997

Component: JobBodyMarkPanel Â· src/App.tsx:15997-16002

Tag: button; visibility: editable

```tsx
<button
            type="button"
            className="primary-action"
            disabled={saved}
            onClick={save}
          >
```

Content/label expression:  {saved ? "Marks saved" : "Save Body Marks"} 

### STATE-App-tsx-16008

Component: JobBodyMarkPanel Â· src/App.tsx:16008-16008

Tag: p; visibility: error

```tsx
<p role="alert" className="form-error">
```

Content/label expression:  {error} 

### STATE-App-tsx-16051

Component: JobRecordDialog Â· src/App.tsx:16051-16057

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog
        wide
        className="dialog-job"
        title={`Archived Job ${view.job.job_no}`}
        subtitle={`${view.vehicle.number} · ${view.customer.name}`}
        onClose={onClose}
      >
```

Content/label expression:  <div className="record-view"> <p className="permission-note">Read-only historical record.</p> <Info label="Archived on" value={view.job.archived_at ?? "—"} /> <Info label="Archive reason" value={view.job.archived_reason ?? "—"} /> <JobSnapshot view={view} /> <Info label="Requested work" value={view.visit.requested_work} /> <Info label="Advisor" value={view.advisor.name} /> <Info label="Technician" value={view.technician.name} /> </div> 

### STATE-App-tsx-16073

Component: JobRecordDialog Â· src/App.tsx:16073-16079

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog
      wide
      className="dialog-job"
      title={`${mode === "view" ? "View" : "Edit"} Job ${view.job.job_no}`}
      subtitle={`${view.vehicle.number} · ${view.customer.name}`}
      onClose={onClose}
    >
```

Content/label expression:  {mode === "edit" && ( <JobLifecyclePanel view={view} users={state.users} actor={actor} mutate={mutate} visible /> )} <div className="sub-tabs" role="tablist" aria-label="Job record sections" onKeyDown={handleTabListKeyDown} > {JOB_CARD_TABS.map((item) => ( <button id={`job-record-tab-${view.job.id}-${item.key}`} aria-controls={`job-record-${view.job.id}-${item.key}`} tabIndex={tab === item.key ? 0 : -1} key={item.key} role="tab" aria-selected={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)} > {item.label} </button> ))} </div> <div id={panelId} role="tabpanel" aria-labelledby={`job-record-tab-${view.job.id}-${tab}`} > {tab === "task-list" ? ( <JobTaskListPanel view={view} catalog={state.service_catalog} actor={actor} mutate={mutate} /> ) : tab === "documents" ? ( <section className="editor-block job-card-documents" aria-label="Current job documents" > <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> ) : tab === "bodymark" ? ( <JobBodyMarkPanel view={view} actor={actor} mutate={mutate} editable={mode === "edit"} /> ) : tab === "media" ? ( <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} /> ) : tab === "materials" ? ( <JobMaterialsPanel view={view} inventory={state.inventory} actor={actor} mutate={mutate} /> ) : tab === "payment" ? ( <JobPaymentPanel view={view} actor={actor} mutate={mutate} /> ) : tab === "invoice" ? ( <JobInvoicePanel view={view} actor={actor} mutate={mutate} onOpen={() => setDocumentEditor("invoice")} onEstimate={() => setDocumentEditor("approve-estimate")} /> ) : isStubTab(tab) ? ( <p className="empty-state job-card-stub"> {JOB_CARD_TABS.find((item) => item.key === tab)?.label} is coming soon. </p> ) : mode === "edit" ? ( <> <JobEditor embedded key={view.job.updated_at} view={view} users={state.users} mutate={mutate} actor={actor} saved={saved} onSaveResult={onSaveResult} /> <JobSheetSection key={`sheet-${view.job.updated_at}`} view={view} actor={actor} mutate={mutate} editable /> {onAdminArchive && ( <div className="admin-archive-action"> <button type="button" className="danger-action" onClick={archive} > Archive Job </button> </div> )} </> ) : ( <div className="record-view"> <JobSnapshot view={view} /> <Info label="Requested work" value={view.visit.requested_work} /> <Info label="Work completed" value={view.job.work_list \|\| "—"} /> <Info label="Advisor" value={view.advisor.name} /> <Info label="Technician" value={view.technician.name} /> <JobSheetSection view={view} actor={actor} mutate={mutate} /> </div> )} {tab === "details" && ( <section className="editor-block job-card-documents job-documents-block" aria-label="Current job documents" > <h4>Current Documents</h4> <p className="muted">Only active records are available</p> <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> )} </div> {tab !== "documents" && tab !== "details" && documentEditor === "estimate" && ( <EstimateDialog view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)} /> )} {tab !== "documents" && tab !== "details" && documentEditor === "approve-estimate" && ( <ApproveEstimateDialog view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)} /> )} {tab !== "documents" && tab !== "details" && documentEditor === "invoice" && ( <InvoiceDialog fixedJob action={view.invoice ? "edit" : "create"} view={view} actor={actor} mutate={mutate} onClose={() => setDocumentEditor(undefined)} /> )} 

### STATE-App-tsx-16089

Component: JobRecordDialog Â· src/App.tsx:16089-16094

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
        className="sub-tabs"
        role="tablist"
        aria-label="Job record sections"
        onKeyDown={handleTabListKeyDown}
      >
```

Content/label expression:  {JOB_CARD_TABS.map((item) => ( <button id={`job-record-tab-${view.job.id}-${item.key}`} aria-controls={`job-record-${view.job.id}-${item.key}`} tabIndex={tab === item.key ? 0 : -1} key={item.key} role="tab" aria-selected={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)} > {item.label} </button> ))} 

### STATE-App-tsx-16096

Component: JobRecordDialog Â· src/App.tsx:16096-16105

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {item.label} 

### STATE-App-tsx-16110

Component: JobRecordDialog Â· src/App.tsx:16110-16114

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`job-record-tab-${view.job.id}-${tab}`}
      >
```

Content/label expression:  {tab === "task-list" ? ( <JobTaskListPanel view={view} catalog={state.service_catalog} actor={actor} mutate={mutate} /> ) : tab === "documents" ? ( <section className="editor-block job-card-documents" aria-label="Current job documents" > <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> ) : tab === "bodymark" ? ( <JobBodyMarkPanel view={view} actor={actor} mutate={mutate} editable={mode === "edit"} /> ) : tab === "media" ? ( <JobMediaPanel embedded view={view} actor={actor} mutate={mutate} /> ) : tab === "materials" ? ( <JobMaterialsPanel view={view} inventory={state.inventory} actor={actor} mutate={mutate} /> ) : tab === "payment" ? ( <JobPaymentPanel view={view} actor={actor} mutate={mutate} /> ) : tab === "invoice" ? ( <JobInvoicePanel view={view} actor={actor} mutate={mutate} onOpen={() => setDocumentEditor("invoice")} onEstimate={() => setDocumentEditor("approve-estimate")} /> ) : isStubTab(tab) ? ( <p className="empty-state job-card-stub"> {JOB_CARD_TABS.find((item) => item.key === tab)?.label} is coming soon. </p> ) : mode === "edit" ? ( <> <JobEditor embedded key={view.job.updated_at} view={view} users={state.users} mutate={mutate} actor={actor} saved={saved} onSaveResult={onSaveResult} /> <JobSheetSection key={`sheet-${view.job.updated_at}`} view={view} actor={actor} mutate={mutate} editable /> {onAdminArchive && ( <div className="admin-archive-action"> <button type="button" className="danger-action" onClick={archive} > Archive Job </button> </div> )} </> ) : ( <div className="record-view"> <JobSnapshot view={view} /> <Info label="Requested work" value={view.visit.requested_work} /> <Info label="Work completed" value={view.job.work_list \|\| "—"} /> <Info label="Advisor" value={view.advisor.name} /> <Info label="Technician" value={view.technician.name} /> <JobSheetSection view={view} actor={actor} mutate={mutate} /> </div> )} {tab === "details" && ( <section className="editor-block job-card-documents job-documents-block" aria-label="Current job documents" > <h4>Current Documents</h4> <p className="muted">Only active records are available</p> <JobDocuments view={view} actor={actor} mutate={mutate} editor={documentEditor} setEditor={setDocumentEditor} /> </section> )} 

### ACT-App-tsx-16154

Component: JobRecordDialog Â· src/App.tsx:16154-16160

Tag: JobInvoicePanel; visibility: tab === "invoice"; tab === "payment"; tab === "materials"; tab === "media"; tab === "bodymark"; tab === "documents"; tab === "task-list"

```tsx
<JobInvoicePanel
            view={view}
            actor={actor}
            mutate={mutate}
            onOpen={() => setDocumentEditor("invoice")}
            onEstimate={() => setDocumentEditor("approve-estimate")}
          />
```

Content/label expression: 

### ACT-App-tsx-16168

Component: JobRecordDialog Â· src/App.tsx:16168-16177

Tag: JobEditor; visibility: mode === "edit"; isStubTab(tab); tab === "invoice"; tab === "payment"; tab === "materials"; tab === "media"; tab === "bodymark"; tab === "documents"; tab === "task-list"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-16187

Component: JobRecordDialog Â· src/App.tsx:16187-16191

Tag: button; visibility: onAdminArchive; mode === "edit"; isStubTab(tab); tab === "invoice"; tab === "payment"; tab === "materials"; tab === "media"; tab === "bodymark"; tab === "documents"; tab === "task-list"

```tsx
<button
                  type="button"
                  className="danger-action"
                  onClick={archive}
                >
```

Content/label expression: Archive Job 

### ACT-App-tsx-16227

Component: JobRecordDialog Â· src/App.tsx:16227-16232

Tag: EstimateDialog; visibility: tab !== "documents" && tab !== "details" && documentEditor === "estimate"

```tsx
<EstimateDialog
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-16237

Component: JobRecordDialog Â· src/App.tsx:16237-16242

Tag: ApproveEstimateDialog; visibility: tab !== "documents" && tab !== "details" && documentEditor === "approve-estimate"

```tsx
<ApproveEstimateDialog
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-16247

Component: JobRecordDialog Â· src/App.tsx:16247-16254

Tag: InvoiceDialog; visibility: tab !== "documents" && tab !== "details" && documentEditor === "invoice"

```tsx
<InvoiceDialog
            fixedJob
            action={view.invoice ? "edit" : "create"}
            view={view}
            actor={actor}
            mutate={mutate}
            onClose={() => setDocumentEditor(undefined)}
          />
```

Content/label expression: 

### ACT-App-tsx-16292

Component: JobTaskListPanel Â· src/App.tsx:16292-16300

Tag: button; visibility: editable && view.estimate?.status !== "Approved"

```tsx
<button
            type="button"
            className="primary-action"
            onClick={() =>
              run((db) =>
                prefillEstimateFromTaskListForActor(db, view.job.id, actor.id),
              )
            }
          >
```

Content/label expression: Prefill Estimate 

### ACT-App-tsx-16314

Component: JobTaskListPanel Â· src/App.tsx:16314-16319

Tag: input; visibility: editable

```tsx
<input
              aria-label="Search service catalog"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service"
            />
```

Content/label expression: 

### ACT-App-tsx-16324

Component: JobTaskListPanel Â· src/App.tsx:16324-16335

Tag: button; visibility: query; editable

```tsx
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
```

Content/label expression: Add {item.name} · {money(item.base_rate)} 

### ACT-App-tsx-16343

Component: JobTaskListPanel Â· src/App.tsx:16343-16347

Tag: input; visibility: editable

```tsx
<input
              aria-label="Manual task name"
              value={manual}
              onChange={(event) => setManual(event.target.value)}
            />
```

Content/label expression: 

### ACT-App-tsx-16351

Component: JobTaskListPanel Â· src/App.tsx:16351-16358

Tag: input; visibility: editable

```tsx
<input
              aria-label="Manual task rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
```

Content/label expression: 

### ACT-App-tsx-16360

Component: JobTaskListPanel Â· src/App.tsx:16360-16376

Tag: button; visibility: editable

```tsx
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
```

Content/label expression: Add manual task 

### STATE-App-tsx-16382

Component: JobTaskListPanel Â· src/App.tsx:16382-16382

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression:  {error} 

### ACT-App-tsx-16400

Component: JobTaskListPanel Â· src/App.tsx:16400-16414

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-16418

Component: JobTaskListPanel Â· src/App.tsx:16418-16430

Tag: input; visibility: editable

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-16437

Component: JobTaskListPanel Â· src/App.tsx:16437-16452

Tag: input; visibility: editable

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-16459

Component: JobTaskListPanel Â· src/App.tsx:16459-16467

Tag: button; visibility: editable

```tsx
<button
                      type="button"
                      className="danger-action"
                      onClick={() =>
                        run((db) =>
                          archiveJobTaskListItemForActor(db, item.id, actor.id),
                        )
                      }
                    >
```

Content/label expression: Remove 

### STATE-App-tsx-16511

Component: CustomerRecordDialog Â· src/App.tsx:16511-16516

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog
      wide
      title={`${mode === "view" ? "View" : "Edit"} Customer`}
      subtitle={`${customer.name} · ${customer.mobile}`}
      onClose={onClose}
    >
```

Content/label expression:  {mode === "edit" ? ( <CustomerEditor embedded value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose} /> ) : ( <div className="record-view"> {customer.archived_at && ( <> <p className="permission-note">Read-only archived record.</p> <Info label="Archived on" value={customer.archived_at} /> <Info label="Archive reason" value={customer.archived_reason ?? "—"} /> </> )} <Info label="Customer type" value={customer.type} /> <Info label="Vehicles" value={vehicles.length} /> {vehicles.map((vehicle) => ( <Info key={vehicle.id} label={vehicle.number} value={`${vehicle.make} ${vehicle.model}`} /> ))} <Info label="Jobs" value={jobs.length} /> {jobs.map((view) => ( <Info key={view.job.id} label={view.job.job_no} value={`${view.vehicle.number} · ${view.job.main_status}`} /> ))} </div> )} 

### ACT-App-tsx-16518

Component: CustomerRecordDialog Â· src/App.tsx:16518-16524

Tag: CustomerEditor; visibility: mode === "edit"

```tsx
<CustomerEditor
          embedded
          value={draft}
          setValue={setDraft}
          mutate={mutate}
          onSaved={onClose}
        />
```

Content/label expression: 

### STATE-App-tsx-16581

Component: VehicleRecordDialog Â· src/App.tsx:16581-16586

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog
      wide
      title={`${mode === "view" ? "View" : "Edit"} Vehicle`}
      subtitle={`${vehicle.number} · ${vehicle.make} ${vehicle.model}`}
      onClose={onClose}
    >
```

Content/label expression:  {mode === "edit" ? ( <VehicleMasterPanel embedded state={state} value={draft} setValue={setDraft} mutate={mutate} onSaved={onClose} /> ) : ( <div className="record-view"> {vehicle.archived_at && ( <> <p className="permission-note">Read-only archived record.</p> <Info label="Archived on" value={vehicle.archived_at} /> <Info label="Archive reason" value={vehicle.archived_reason ?? "—"} /> </> )} <Info label="Registration" value={vehicle.number} /> <Info label="Make / model" value={`${vehicle.make} ${vehicle.model}`} /> <Info label="Color" value={vehicle.color} /> <Info label="Odometer" value={`${vehicle.km.toLocaleString("en-IN")} km`} /> <Info label="Owner" value={owner ? `${owner.name} · ${owner.mobile}` : "—"} /> <Info label="Linked jobs" value={jobs.length} /> {jobs.map((view) => ( <Info key={view.job.id} label={view.job.job_no} value={`${view.job.main_status} · ${view.visit.received_at.slice(0, 10)}`} /> ))} </div> )} 

### ACT-App-tsx-16588

Component: VehicleRecordDialog Â· src/App.tsx:16588-16595

Tag: VehicleMasterPanel; visibility: mode === "edit"

```tsx
<VehicleMasterPanel
          embedded
          state={state}
          value={draft}
          setValue={setDraft}
          mutate={mutate}
          onSaved={onClose}
        />
```

Content/label expression: 

### ACT-App-tsx-16724

Component: VisitEditor Â· src/App.tsx:16724-16727

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
            value={advisorId}
            onChange={(event) => setAdvisorId(Number(event.target.value))}
          >
```

Content/label expression:  {advisorId === 0 && <option value={0}>Not mapped</option>} {ordered.map((advisor) => ( <option key={advisor.id} value={advisor.id}> {advisor.name} {present.some((item) => item.id === advisor.id) ? " (Present)" : " (Away)"} </option> ))} 

### ACT-App-tsx-16739

Component: VisitEditor Â· src/App.tsx:16739-16745

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="primary-action"
          disabled={!advisorId || advisorId === view.job.advisor_id}
          onClick={() =>
            mutate((db) => assignAdvisor(db, view.job.id, advisorId))
          }
        >
```

Content/label expression:  {view.job.advisor_id ? "Update Advisor" : "Assign Advisor"} 

### ACT-App-tsx-16776

Component: DuplicateCustomerEditor Â· src/App.tsx:16776-16779

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.name}
          onChange={(event) => setValue({ ...value, name: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-16783

Component: DuplicateCustomerEditor Â· src/App.tsx:16783-16788

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.mobile}
          onChange={(event) =>
            setValue({ ...value, mobile: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16792

Component: DuplicateCustomerEditor Â· src/App.tsx:16792-16795

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.type}
          onChange={(event) => setValue({ ...value, type: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-16798

Component: DuplicateCustomerEditor Â· src/App.tsx:16798-16809

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Save Customer 

### ACT-App-tsx-16812

Component: DuplicateCustomerEditor Â· src/App.tsx:16812-16820

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="danger-action"
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              archiveCustomer(db, value.id, "Archived from customer desk"),
            )
          }
        >
```

Content/label expression: Archive 

### ACT-App-tsx-16848

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16848-16853

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
          value={value.customer_id}
          onChange={(event) =>
            setValue({ ...value, customer_id: Number(event.target.value) })
          }
        >
```

Content/label expression:  {state.customers.map((customer) => ( <option key={customer.id} value={customer.id}> {customer.name} </option> ))} 

### ACT-App-tsx-16863

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16863-16868

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.number}
          onChange={(event) =>
            setValue({ ...value, number: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16872

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16872-16875

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.make}
          onChange={(event) => setValue({ ...value, make: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-16879

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16879-16884

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.model}
          onChange={(event) =>
            setValue({ ...value, model: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16888

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16888-16893

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={value.color}
          onChange={(event) =>
            setValue({ ...value, color: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16897

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16897-16903

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={value.km}
          onChange={(event) =>
            setValue({ ...value, km: Number(event.target.value) })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16906

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16906-16920

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Save Vehicle 

### ACT-App-tsx-16923

Component: DuplicateVehicleMasterPanel Â· src/App.tsx:16923-16931

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="danger-action"
          disabled={!value.id}
          onClick={() =>
            mutate((db) =>
              archiveVehicle(db, value.id, "Archived from vehicle desk"),
            )
          }
        >
```

Content/label expression: Archive 

### ACT-App-tsx-16963

Component: DuplicateEstimateEditor Â· src/App.tsx:16963-16970

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            className="danger-action"
            onClick={() =>
              mutate((db) =>
                archiveEstimateItem(db, item.id, "Removed from estimate"),
              )
            }
          >
```

Content/label expression: Archive Item 

### ACT-App-tsx-16977

Component: DuplicateEstimateEditor Â· src/App.tsx:16977-16982

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16986

Component: DuplicateEstimateEditor Â· src/App.tsx:16986-16992

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={draft.qty}
          onChange={(event) =>
            setDraft({ ...draft, qty: Number(event.target.value) })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-16996

Component: DuplicateEstimateEditor Â· src/App.tsx:16996-17002

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={draft.rate}
          onChange={(event) =>
            setDraft({ ...draft, rate: Number(event.target.value) })
          }
        />
```

Content/label expression: 

### ACT-App-tsx-17004

Component: DuplicateEstimateEditor Â· src/App.tsx:17004-17012

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
        disabled={!estimateId}
        onClick={() =>
          estimateId &&
          mutate((db) =>
            createEstimateItem(db, { estimate_id: estimateId, ...draft }),
          )
        }
      >
```

Content/label expression: Add Item 

### ACT-App-tsx-17038

Component: DuplicateFollowupEditor Â· src/App.tsx:17038-17044

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              onClick={() =>
                mutate((db) =>
                  markFollowupDone(db, followup.id, followup.outcome || "Done"),
                )
              }
            >
```

Content/label expression: Done 

### ACT-App-tsx-17047

Component: DuplicateFollowupEditor Â· src/App.tsx:17047-17054

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              className="danger-action"
              onClick={() =>
                mutate((db) =>
                  archiveFollowup(db, followup.id, "Removed follow-up"),
                )
              }
            >
```

Content/label expression: Archive 

### ACT-App-tsx-17062

Component: DuplicateFollowupEditor Â· src/App.tsx:17062-17062

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={note} onChange={(event) => setNote(event.target.value)} />
```

Content/label expression: 

### ACT-App-tsx-17064

Component: DuplicateFollowupEditor Â· src/App.tsx:17064-17076

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Add Follow-up 

### ACT-App-tsx-17118

Component: DuplicateJobEditor Â· src/App.tsx:17118-17121

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={workList}
          onChange={(event) => setWorkList(event.target.value)}
        />
```

Content/label expression: 

### ACT-App-tsx-17125

Component: DuplicateJobEditor Â· src/App.tsx:17125-17128

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
          value={advisorId}
          onChange={(event) => setAdvisorId(Number(event.target.value))}
        >
```

Content/label expression:  {users .filter((item) => item.role === "service") .map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 

### ACT-App-tsx-17140

Component: DuplicateJobEditor Â· src/App.tsx:17140-17143

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
          value={technicianId}
          onChange={(event) => setTechnicianId(Number(event.target.value))}
        >
```

Content/label expression:  {users .filter((item) => item.role === "tech") .map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 

### ACT-App-tsx-17156

Component: DuplicateJobEditor Â· src/App.tsx:17156-17161

Tag: select; visibility: allowStatus

```tsx
<select
            value={mainStatus}
            onChange={(event) =>
              setMainStatus(event.target.value as MainStatus)
            }
          >
```

Content/label expression:  <option>NEW</option> <option>IN_PROGRESS</option> <option>COMPLETED</option> <option>CLOSED</option> 

### ACT-App-tsx-17172

Component: DuplicateJobEditor Â· src/App.tsx:17172-17175

Tag: input; visibility: allowStatus

```tsx
<input
            value={subStatus}
            onChange={(event) => setSubStatus(event.target.value as SubStatus)}
          />
```

Content/label expression: 

### ACT-App-tsx-17178

Component: DuplicateJobEditor Â· src/App.tsx:17178-17190

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Save Job Card 

### ACT-App-tsx-17234

Component: DuplicateInventoryEditor Â· src/App.tsx:17234-17243

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression:  {state.inventory.map((next) => ( <option key={next.id} value={next.id}> {next.name} </option> ))} 

### ACT-App-tsx-17253

Component: DuplicateInventoryEditor Â· src/App.tsx:17253-17256

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={item.name}
          onChange={(event) => setItem({ ...item, name: event.target.value })}
        />
```

Content/label expression: 

### ACT-App-tsx-17260

Component: DuplicateInventoryEditor Â· src/App.tsx:17260-17264

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={qty}
          onChange={(event) => setQty(Number(event.target.value))}
        />
```

Content/label expression: 

### ACT-App-tsx-17267

Component: DuplicateInventoryEditor Â· src/App.tsx:17267-17269

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          onClick={() => mutate((db) => updateInventoryItem(db, item.id, item))}
        >
```

Content/label expression: Save Item 

### ACT-App-tsx-17272

Component: DuplicateInventoryEditor Â· src/App.tsx:17272-17276

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          onClick={() =>
            mutate((db) => stockIn(db, item.id, qty, "Manual stock-in"))
          }
        >
```

Content/label expression: Stock In 

### ACT-App-tsx-17279

Component: DuplicateInventoryEditor Â· src/App.tsx:17279-17283

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          onClick={() =>
            mutate((db) => adjustStock(db, item.id, qty, "Manual adjustment"))
          }
        >
```

Content/label expression: Adjust 

### ACT-App-tsx-17286

Component: DuplicateInventoryEditor Â· src/App.tsx:17286-17300

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Duplicate New 

### ACT-App-tsx-17303

Component: DuplicateInventoryEditor Â· src/App.tsx:17303-17310

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="danger-action"
          onClick={() =>
            mutate((db) =>
              archiveInventoryItem(db, item.id, "Archived from stock desk"),
            )
          }
        >
```

Content/label expression: Archive 

### ACT-App-tsx-17349

Component: DuplicateReconcileEditor Â· src/App.tsx:17349-17352

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select
          value={requestId}
          onChange={(event) => setRequestId(Number(event.target.value))}
        >
```

Content/label expression:  {requests.map(({ request, item }) => ( <option key={request.id} value={request.id}> {item?.name ?? request.id} </option> ))} 

### ACT-App-tsx-17362

Component: DuplicateReconcileEditor Â· src/App.tsx:17362-17366

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={used}
          onChange={(event) => setUsed(Number(event.target.value))}
        />
```

Content/label expression: 

### ACT-App-tsx-17370

Component: DuplicateReconcileEditor Â· src/App.tsx:17370-17374

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={returned}
          onChange={(event) => setReturned(Number(event.target.value))}
        />
```

Content/label expression: 

### ACT-App-tsx-17378

Component: DuplicateReconcileEditor Â· src/App.tsx:17378-17382

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          type="number"
          value={wasted}
          onChange={(event) => setWasted(Number(event.target.value))}
        />
```

Content/label expression: 

### ACT-App-tsx-17384

Component: DuplicateReconcileEditor Â· src/App.tsx:17384-17390

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
        onClick={() =>
          mutate((db) =>
            reconcileMaterialQty(db, requestId, used, returned, wasted),
          )
        }
      >
```

Content/label expression: Save Reconcile 

### ACT-App-tsx-17413

Component: DuplicateTaskCreator Â· src/App.tsx:17413-17416

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
```

Content/label expression: 

### ACT-App-tsx-17418

Component: DuplicateTaskCreator Â· src/App.tsx:17418-17430

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Add Task 

### ACT-App-tsx-17456

Component: DuplicateQcEditor Â· src/App.tsx:17456-17458

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
              onClick={() => mutate((db) => updateQcCheck(db, check.id, true))}
            >
```

Content/label expression: Pass 

### ACT-App-tsx-17461

Component: DuplicateQcEditor Â· src/App.tsx:17461-17472

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: Fail 

### ACT-App-tsx-17480

Component: DuplicateQcEditor Â· src/App.tsx:17480-17483

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
```

Content/label expression: 

### ACT-App-tsx-17485

Component: DuplicateQcEditor Â· src/App.tsx:17485-17485

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button onClick={() => mutate((db) => passQc(db, view.job.id))}>
```

Content/label expression: Pass All QC 

### ACT-App-tsx-17577

Component: JobCardFilterFields Â· src/App.tsx:17577-17577

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={searchLabel} value={values.search} placeholder="Job, vehicle, customer or mobile" onChange={(event) => onChange({ search: event.target.value })} />
```

Content/label expression: 

### ACT-App-tsx-17578

Component: JobCardFilterFields Â· src/App.tsx:17578-17578

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Main status" value={values.primary} onChange={(event) => onChange({ primary: event.target.value })}>
```

Content/label expression: <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"].map((value) => <option key={value}>{value}</option>)}

### ACT-App-tsx-17579

Component: JobCardFilterFields Â· src/App.tsx:17579-17579

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Workflow status" value={values.secondary} onChange={(event) => onChange({ secondary: event.target.value })}>
```

Content/label expression: <option value="ALL">All workflows</option> {workflows.map((value) => <option key={value}>{value}</option>)}

### ACT-App-tsx-17580

Component: JobCardFilterFields Â· src/App.tsx:17580-17580

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Estimated delivery date" type="date" value={values.date} onChange={(event) => onChange({ date: event.target.value })} />
```

Content/label expression: 

### ACT-App-tsx-17581

Component: JobCardFilterFields Â· src/App.tsx:17581-17581

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Estimated delivery month-year" value={values.month} onChange={(event) => onChange({ month: event.target.value })}>
```

Content/label expression: <option value="">All months</option> {jobDeliveryMonths(jobs, values.month).map((value) => <option key={value} value={value}>{new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</option>)}

### ACT-App-tsx-17582

Component: JobCardFilterFields Â· src/App.tsx:17582-17582

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Service advisor filter" value={values.advisor} onChange={(event) => onChange({ advisor: event.target.value })}>
```

Content/label expression: <option value="ALL">All advisors</option> {advisors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}

### ACT-App-tsx-17583

Component: JobCardFilterFields Â· src/App.tsx:17583-17583

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Sort results" value={values.sort} onChange={(event) => onChange({ sort: event.target.value })}>
```

Content/label expression: <option value="newest">Newest</option> <option value="oldest">Oldest</option> <option value="delivery-soonest">Estimated delivery (soonest)</option> <option value="delivery-latest">Estimated delivery (latest)</option> <option value="amount-high">Amount (high to low)</option> <option value="amount-low">Amount (low to high)</option>

### ACT-App-tsx-17584

Component: JobCardFilterFields Â· src/App.tsx:17584-17584

Tag: Switch; visibility: showArchive

```tsx
<Switch className="job-card-archive-switch" label="Show archived only" checked={values.archivedOnly} onCheckedChange={(archivedOnly) => onChange({ archivedOnly })} />
```

Content/label expression: 

### ACT-App-tsx-17585

Component: JobCardFilterFields Â· src/App.tsx:17585-17585

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={onClear} />
```

Content/label expression: 

### ACT-App-tsx-17930

Component: EntityList Â· src/App.tsx:17930-17930

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="back-button" onClick={closeRecord}>
```

Content/label expression: ← Back to {entityTitle(kind)} 

### ACT-App-tsx-18170

Component: EntityList Â· src/App.tsx:18170-18178

Tag: JobRecordDialog; visibility: dialogJob

```tsx
<JobRecordDialog
          view={dialogJob}
          state={state}
          mutate={mutate}
          actor={actor}
          mode={archivedOnly ? "view" : recordMode}
          historical={archivedOnly}
          onClose={closeRecord}
        />
```

Content/label expression: 

### ACT-App-tsx-18181

Component: EntityList Â· src/App.tsx:18181-18187

Tag: CustomerRecordDialog; visibility: dialogCustomer

```tsx
<CustomerRecordDialog
          customer={dialogCustomer}
          state={state}
          mutate={mutate}
          mode={recordMode}
          onClose={closeRecord}
        />
```

Content/label expression: 

### ACT-App-tsx-18190

Component: EntityList Â· src/App.tsx:18190-18196

Tag: VehicleRecordDialog; visibility: dialogVehicle

```tsx
<VehicleRecordDialog
          vehicle={dialogVehicle}
          state={state}
          mutate={mutate}
          mode={recordMode}
          onClose={closeRecord}
        />
```

Content/label expression: 

### ACT-App-tsx-18210

Component: EntityList Â· src/App.tsx:18210-18210

Tag: button; visibility: canCreate

```tsx
<button className="primary-action" onClick={() => setCreating(true)}>
```

Content/label expression:  {createLabel} 

### ACT-App-tsx-18215

Component: EntityList Â· src/App.tsx:18215-18215

Tag: button; visibility: canAddJob

```tsx
<button className="primary-action" onClick={() => setAddingJob(true)}>
```

Content/label expression: Add Job Card 

### ACT-App-tsx-18221

Component: EntityList Â· src/App.tsx:18221-18226

Tag: AddJobCardDialog; visibility: addingJob

```tsx
<AddJobCardDialog
          state={state}
          mutate={mutate}
          actor={actor}
          onClose={() => setAddingJob(false)}
        />
```

Content/label expression: 

### STATE-App-tsx-18229

Component: EntityList Â· src/App.tsx:18229-18229

Tag: Dialog; visibility: creating

```tsx
<Dialog title={createLabel} onClose={() => setCreating(false)}>
```

Content/label expression:  {kind === "customers" && ( <CustomerEditor embedded value={newCustomer} setValue={setNewCustomer} mutate={mutate} /> )} {kind === "vehicles" && ( <VehicleMasterPanel embedded state={state} value={{ id: 0, customer_id: state.customers[0]?.id ?? 0, number: "", make: "", model: "", color: "", km: 0, }} setValue={() => undefined} mutate={mutate} /> )} 

### ACT-App-tsx-18261

Component: EntityList Â· src/App.tsx:18261-18266

Tag: input; visibility: !hideSearch && kind !== "jobs" && filterLayout !== "search"

```tsx
<input
              aria-label={`Search ${title.toLocaleLowerCase()}`}
              value={effectiveSearch}
              placeholder={searchPlaceholder(kind)}
              onChange={(event) => updateSearch(event.target.value)}
            />
```

Content/label expression: 

### ACT-App-tsx-18269

Component: EntityList Â· src/App.tsx:18269-18273

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className="mobile-filter-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
```

Content/label expression:  {filtersOpen ? "Hide filters" : "Show filters"} 

### ACT-App-tsx-18282

Component: EntityList Â· src/App.tsx:18282-18287

Tag: input; visibility: !hideSearch && kind !== "jobs" && filterLayout === "search"

```tsx
<input
                aria-label="Search records"
                value={effectiveSearch}
                placeholder={searchPlaceholder(kind)}
                onChange={(event) => updateSearch(event.target.value)}
              />
```

Content/label expression: 

### ACT-App-tsx-18291

Component: EntityList Â· src/App.tsx:18291-18302

Tag: JobCardFilterFields; visibility: kind === "jobs"

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-18305

Component: EntityList Â· src/App.tsx:18305-18312

Tag: Switch; visibility: role === "admin" && kind !== "jobs"

```tsx
<Switch
              label="Show archived only"
              checked={archivedOnly}
              onCheckedChange={(checked) => {
                updateFilters({ archivedOnly: checked });
                setSelectedId(undefined);
              }}
            />
```

Content/label expression: 

### ACT-App-tsx-18318

Component: EntityList Â· src/App.tsx:18318-18324

Tag: select; visibility: false && kind === "jobs"

```tsx
<select
                  aria-label="Main status"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All statuses</option> {[ "NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED", ].map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-18339

Component: EntityList Â· src/App.tsx:18339-18345

Tag: select; visibility: false && kind === "jobs"

```tsx
<select
                  aria-label="Workflow status"
                  value={filters.secondary}
                  onChange={(event) =>
                    updateFilters({ secondary: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All workflows</option> {Array.from( new Set(state.jobs.map((item) => item.job.sub_status)), ).map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-18356

Component: EntityList Â· src/App.tsx:18356-18363

Tag: input; visibility: false && kind === "jobs"

```tsx
<input
                  aria-label="Estimated delivery date"
                  type="date"
                  value={filters.date}
                  onChange={(event) =>
                    updateFilters({ date: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-18367

Component: EntityList Â· src/App.tsx:18367-18374

Tag: input; visibility: false && kind === "jobs"

```tsx
<input
                  aria-label="Estimated delivery month"
                  type="month"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-18378

Component: EntityList Â· src/App.tsx:18378-18384

Tag: select; visibility: false && kind === "jobs"

```tsx
<select
                  aria-label="Customer filter"
                  value={filters.customer}
                  onChange={(event) =>
                    updateFilters({ customer: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All customers</option> {jobCustomerOptions.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 

### ACT-App-tsx-18395

Component: EntityList Â· src/App.tsx:18395-18401

Tag: select; visibility: false && kind === "jobs"

```tsx
<select
                  aria-label="Vehicle filter"
                  value={filters.vehicle}
                  onChange={(event) =>
                    updateFilters({ vehicle: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All vehicles</option> {jobVehicleOptions.map((item) => ( <option key={item.id} value={item.id}> {item.number} </option> ))} 

### ACT-App-tsx-18412

Component: EntityList Â· src/App.tsx:18412-18418

Tag: select; visibility: false && kind === "jobs"

```tsx
<select
                  aria-label="Service advisor filter"
                  value={filters.advisor}
                  onChange={(event) =>
                    updateFilters({ advisor: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All advisors</option> {jobAdvisorOptions.map((item) => ( <option key={item.id} value={item.id}> {item.name} </option> ))} 

### ACT-App-tsx-18433

Component: EntityList Â· src/App.tsx:18433-18439

Tag: select; visibility: kind === "customers"

```tsx
<select
                  aria-label="Customer type"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All types</option> {customerTypes.map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-18448

Component: EntityList Â· src/App.tsx:18448-18454

Tag: select; visibility: kind === "customers"

```tsx
<select
                  aria-label="Customer served month"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                >
```

Content/label expression:  <option value="">All months</option> {servedMonths.map((value) => ( <option key={value} value={value}> {value} </option> ))} 

### ACT-App-tsx-18468

Component: EntityList Â· src/App.tsx:18468-18474

Tag: select; visibility: kind === "vehicles"

```tsx
<select
                aria-label="Vehicle served month"
                value={filters.month}
                onChange={(event) =>
                  updateFilters({ month: event.target.value })
                }
              >
```

Content/label expression:  <option value="">All months</option> {servedMonths.map((value) => ( <option key={value} value={value}> {value} </option> ))} 

### ACT-App-tsx-18488

Component: EntityList Â· src/App.tsx:18488-18494

Tag: select; visibility: kind === "media"

```tsx
<select
                  aria-label="Job card filter"
                  value={filters.primary}
                  onChange={(event) =>
                    updateFilters({ primary: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All job cards</option> {mediaJobs.map((item) => ( <option value={item.job.id} key={item.job.id}> {item.job.job_no} </option> ))} 

### ACT-App-tsx-18505

Component: EntityList Â· src/App.tsx:18505-18511

Tag: select; visibility: kind === "media"

```tsx
<select
                  aria-label="Media category"
                  value={filters.secondary}
                  onChange={(event) =>
                    updateFilters({ secondary: event.target.value })
                  }
                >
```

Content/label expression:  <option value="ALL">All categories</option> {categories.map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-18520

Component: EntityList Â· src/App.tsx:18520-18527

Tag: input; visibility: kind === "media"

```tsx
<input
                  aria-label="Media received date"
                  type="date"
                  value={filters.date}
                  onChange={(event) =>
                    updateFilters({ date: event.target.value })
                  }
                />
```

Content/label expression: 

### ACT-App-tsx-18531

Component: EntityList Â· src/App.tsx:18531-18537

Tag: select; visibility: kind === "media"

```tsx
<select
                  aria-label="Media month-year"
                  value={filters.month}
                  onChange={(event) =>
                    updateFilters({ month: event.target.value })
                  }
                >
```

Content/label expression:  <option value="">All months</option> {mediaMonths.map((value) => ( <option key={value} value={value}> {value} </option> ))} 

### ACT-App-tsx-18551

Component: EntityList Â· src/App.tsx:18551-18557

Tag: select; visibility: kind !== "media" && kind !== "jobs"

```tsx
<select
                aria-label="Sort results"
                value={filters.sort}
                onChange={(event) =>
                  updateFilters({ sort: event.target.value })
                }
              >
```

Content/label expression:  <><option value="alphabetical">Alphabetical</option><option value="recent">Recent</option></> 

### ACT-App-tsx-18562

Component: EntityList Â· src/App.tsx:18562-18562

Tag: ListSearchActions; visibility: kind !== "jobs"

```tsx
<ListSearchActions onClear={clearFilters} />
```

Content/label expression: 

### ACT-App-tsx-18566

Component: EntityList Â· src/App.tsx:18566-18591

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-18577

Component: EntityList Â· src/App.tsx:18577-18577

Tag: ViewModeToggle; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ViewModeToggle value={viewMode} onChange={setViewMode} />
```

Content/label expression: 

### ACT-App-tsx-18596

Component: EntityList Â· src/App.tsx:18596-18596

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton onClick={clearFilters} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-18611

Component: EntityList Â· src/App.tsx:18611-18615

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={changePage}
      />
```

Content/label expression: 

### ACT-App-tsx-18651

Component: ViewModeToggle Â· src/App.tsx:18651-18655

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
        aria-pressed={value === "grid"}
        className={value === "grid" ? "active" : ""}
        onClick={() => onChange("grid")}
      >
```

Content/label expression: Grid 

### ACT-App-tsx-18658

Component: ViewModeToggle Â· src/App.tsx:18658-18662

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
        aria-pressed={value === "table"}
        className={value === "table" ? "active" : ""}
        onClick={() => onChange("table")}
      >
```

Content/label expression: Table 

### ACT-App-tsx-18679

Component: ListExportControls Â· src/App.tsx:18679-18679

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<DownloadMenu report={report} />
```

Content/label expression: 

### ACT-App-tsx-18778

Component: EntityResults Â· src/App.tsx:18778-18784

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<RecordActions
            onView={() => openRecord(row.job.id, "view")}
            onEdit={
              manageable ? () => openRecord(row.job.id, "edit") : undefined
            }
            onArchive={manageable ? () => archive(row.job.id) : undefined}
          />
```

Content/label expression: 

### ACT-App-tsx-18812

Component: EntityResults Â· src/App.tsx:18812-18816

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<RecordActions
            onView={() => openRecord(row.id, "view")}
            onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined}
            onArchive={canArchive ? () => archive(row.id) : undefined}
          />
```

Content/label expression: 

### ACT-App-tsx-18839

Component: EntityResults Â· src/App.tsx:18839-18843

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<RecordActions
            onView={() => openRecord(row.id, "view")}
            onEdit={canArchive ? () => openRecord(row.id, "edit") : undefined}
            onArchive={canArchive ? () => archive(row.id) : undefined}
          />
```

Content/label expression: 

### ACT-App-tsx-18858

Component: EntityResults Â· src/App.tsx:18858-18861

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<RecordActions
          onView={() => openRecord(photo.id)}
          onArchive={canArchive ? () => archive(photo.id) : undefined}
        />
```

Content/label expression: 

### ACT-App-tsx-18918

Component: RecordActions Â· src/App.tsx:18918-18925

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
        type="button"
        className={actionClass}
        onClick={(event) => {
          event.stopPropagation();
          onView();
        }}
      >
```

Content/label expression: View 

### ACT-App-tsx-18929

Component: RecordActions Â· src/App.tsx:18929-18936

Tag: button; visibility: onEdit

```tsx
<button
          type="button"
          className={actionClass}
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
```

Content/label expression:  {editLabel} 

### ACT-App-tsx-18941

Component: RecordActions Â· src/App.tsx:18941-18950

Tag: button; visibility: onArchive

```tsx
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
```

Content/label expression: Archive 

### ACT-App-tsx-19058

Component: EntityTableRow Â· src/App.tsx:19058-19079

Tag: RecordActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-19149

Component: JobRows Â· src/App.tsx:19149-19153

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
          className={selectedJobId === view.job.id ? "row active" : "row"}
          key={view.job.id}
          onClick={() => onSelect?.(view.job.id)}
        >
```

Content/label expression:  <strong>{view.job.job_no}</strong> <span>{view.vehicle.number}</span> <Status status={view.job.main_status} sub={view.job.sub_status} unmapped={ view.job.advisor_id === 0 && view.job.main_status === "NEW" } /> <DocumentChips view={view} /> 

### ACT-App-tsx-19249

Component: FilterableJobRows Â· src/App.tsx:19249-19256

Tag: JobRecordDialog; visibility: selected && dialog && queueActions

```tsx
<JobRecordDialog
          view={selected}
          state={queueActions.state}
          mutate={queueActions.mutate}
          actor={queueActions.actor}
          mode={dialog}
          onClose={() => setDialog(undefined)}
        />
```

Content/label expression: 

### ACT-App-tsx-19269

Component: FilterableJobRows Â· src/App.tsx:19269-19277

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input
            aria-label={`Search ${title.toLocaleLowerCase()}`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Job, vehicle or customer"
          />
```

Content/label expression: 

### ACT-App-tsx-19283

Component: FilterableJobRows Â· src/App.tsx:19283-19292

Tag: input; visibility: readyToInvoiceFilters

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-19296

Component: FilterableJobRows Â· src/App.tsx:19296-19304

Tag: select; visibility: readyToInvoiceFilters

```tsx
<select
                aria-label="Ready To Invoice month-year"
                value={receivedMonth}
                onChange={(event) => {
                  setReceivedMonth(event.target.value);
                  setReceivedDate("");
                  setPage(1);
                }}
              >
```

Content/label expression:  <option value="">All months</option> {availableReceivedMonths.map((month) => ( <option key={month} value={month}> {SEARCH_MONTH_YEAR_FORMATTER.format( new Date(`${month}-01T00:00:00Z`), )} </option> ))} 

### ACT-App-tsx-19320

Component: FilterableJobRows Â· src/App.tsx:19320-19327

Tag: select; visibility: showStatusFilter

```tsx
<select
              aria-label={`${title} status`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
```

Content/label expression:  <option value="ALL">All statuses</option> {["NEW", "IN_PROGRESS", "COMPLETED", "CLOSED"].map((value) => ( <option key={value}>{value}</option> ))} 

### ACT-App-tsx-19335

Component: FilterableJobRows Â· src/App.tsx:19335-19335

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clearFilters} />
```

Content/label expression: 

### ACT-App-tsx-19337

Component: FilterableJobRows Â· src/App.tsx:19337-19365

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
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
```

Content/label expression: 

### ACT-App-tsx-19368

Component: FilterableJobRows Â· src/App.tsx:19368-19372

Tag: ReadyToInvoiceRows; visibility: readyToInvoiceFilters; paged.totalCount

```tsx
<ReadyToInvoiceRows
            jobs={paged.items}
            selectedJobId={selectedJobId}
            onSelect={onSelect ?? (() => {})}
          />
```

Content/label expression: 

### ACT-App-tsx-19401

Component: FilterableJobRows Â· src/App.tsx:19401-19408

Tag: button; visibility: queueActions; readyToInvoiceFilters; paged.totalCount

```tsx
<button
                          type="button"
                          className="grid-action"
                          onClick={() => {
                            setSelected(row);
                            setDialog("view");
                          }}
                        >
```

Content/label expression: View 

### ACT-App-tsx-19413

Component: FilterableJobRows Â· src/App.tsx:19413-19420

Tag: button; visibility: queueActions.actor.role === "service" && queueActions.actor.id === row.job.advisor_id; queueActions; readyToInvoiceFilters; paged.totalCount

```tsx
<button
                              type="button"
                              className="grid-action"
                              onClick={() => {
                                setSelected(row);
                                setDialog("edit");
                              }}
                            >
```

Content/label expression: Edit 

### ACT-App-tsx-19432

Component: FilterableJobRows Â· src/App.tsx:19432-19436

Tag: JobRows; visibility: queueActions; readyToInvoiceFilters; paged.totalCount

```tsx
<JobRows
            jobs={paged.items}
            selectedJobId={selectedJobId}
            onSelect={onSelect}
          />
```

Content/label expression: 

### ACT-App-tsx-19441

Component: FilterableJobRows Â· src/App.tsx:19441-19441

Tag: FilterClearButton; visibility: paged.totalCount

```tsx
<FilterClearButton onClick={clearFilters} label="Clear filters" />
```

Content/label expression: 

### ACT-App-tsx-19444

Component: FilterableJobRows Â· src/App.tsx:19444-19448

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination
        page={paged.page}
        pageCount={paged.pageCount}
        onChange={setPage}
      />
```

Content/label expression: 

### ACT-App-tsx-19471

Component: ReadyToInvoiceRows Â· src/App.tsx:19471-19476

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button
            type="button"
            key={view.job.id}
            className={`ready-to-invoice-row${selectedJobId === view.job.id ? " active" : ""}`}
            onClick={() => onSelect(view.job.id)}
          >
```

Content/label expression:  <strong>{view.job.job_no}</strong> <span> {view.customer.name} · {view.vehicle.number} </span> <span>Received {view.visit.received_at.slice(0, 10)}</span> <span> {draft.lines.length} billable item {draft.lines.length === 1 ? "" : "s"} </span> <strong>{money(totals.total)}</strong> <span className={ready && !warning ? "ready-state" : "warning-state"} > {warning ?? (ready ? "Ready to invoice" : "Estimate approval required")} </span> 

### STATE-billing-manager-tsx-154

Component: BillingManager Â· src/billing-manager.tsx:154-154

Tag: section; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<section className={panel ? "workspace single-panel" : "billing-manager"} data-billing-manager={mode} role="tabpanel">
```

Content/label expression:  <div className={panel ? "desk-panel" : "manager-panel"} role={panel ? undefined : "tabpanel"}> {pendingInvoicesOnly && <div className="panel-actions"><div><h2>Ready To Invoice</h2><p>Active invoices awaiting payment. View or download invoices from this read-only queue.</p></div></div>} {panel && !compactAccountsPanel && <> <div className="panel-actions"><div><h2>{mode}</h2><p>{mode === "Payments" ? "Paid invoices with downloadable receipts" : "All workshop jobs"}</p></div></div> {actor.role === "accounts" && <p className="permission-note">Invoices are view/download-only. Use Quick Mark Paid to complete the handover.</p>} {actor.role === "accounts" && <AccountsReconciliationQueues jobs={state.jobs} />} {!editable && actor.role !== "accounts" && <p className="permission-note">Read-only billing access.</p>} {inline && <p className="permission-note" role="note">Click a row for lines, GST and totals.{manage ? "" : " Create or edit invoices from the Job Card."}</p>} </>} {manage && <> {pickedJob && <div className="action-row"><span className="result-summary">{pickedJob.invoice ? `${pickedJob.invoice.invoice_no} · ${invoiceStatus(pickedJob)}` : "No invoice yet"}</span> {pickedJob.invoice ? <><button onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}>View Invoice</button>{canEditInvoice(actor, pickedJob.job) && pickedJob.invoice.status === "Pending" && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}>Edit Invoice</button>}</> : canCreateInvoice(actor, pickedJob.job) && <button className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}>Create Invoice</button>}</div>}</>} <div className="store-filter-grid billing-panel-filter-grid"> <label className="list-search">Search<input aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, invoice, customer, vehicle or reference" /></label> <label>Month-Year<select aria-label={`${mode} Month-Year filter`} value={eventMonth} onChange={(event) => { setEventMonth(event.target.value); setPage(1); }}><option value="ALL">All months</option>{availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}</select></label> {showStatusFilter && <label>Status<select aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="ALL">All</option>{statusOptions.map((value) => <option key={value}>{value}</option>)}</select></label>} {showPaymentModeFilter && <label>Payment mode<select aria-label="Payment mode filter" value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value as "ALL" \| PaymentMode); setPage(1); }}><option value="ALL">All</option>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as PaymentMode[]).map((value) => <option key={value}>{value}</option>)}</select></label>} <ListSearchActions onClear={clear} /> </div> <PaginationToolbar controls={<DownloadMenu report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${mode} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} /> <div className="table-wrap"><table aria-label={`${mode} manager`}><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}<th>Actions</th></tr></thead><tbody>{paged.items.map((record) => { const open = expanded === record.key; const quickPay = !pendingInvoicesOnly && mode === "Invoices" && record.view.invoice?.status === "Pending" && canRecordOrVoidPayment(actor, record.view.job); const highlightClass = accountsRowHighlight(mode, record, compactAccountsPanel); return <Fragment key={record.key}> <tr className={[record.kind === "void" ? "billing-row-void" : "", highlightClass, inline ? "billing-row-click" : ""].filter(Boolean).join(" ") \|\| undefined} {...(inline ? { tabIndex: 0, "aria-expanded": open, "aria-controls": `billing-detail-${record.key}`, onClick: () => toggle(record.key), onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => { if (event.target === event.currentTarget && (event.key === "Enter" \|\| event.key === " ")) { event.preventDefault(); toggle(record.key); } } } : {})}>{columns.map((column) => <td key={column.header}>{String(column.value(record))}</td>)}<td><div className="grid-actions billing-table-actions"> {mode === "Invoices" && <><button type="button" className="billing-table-action" onClick={(event) => { event.stopPropagation(); setInvoiceDialog({ action: "view", view: record.view }); }}><Eye size={15} />View</button><DocumentDownloadButton kind="invoice" view={record.view} label="Download" className="billing-table-action" />{quickPay && <button type="button" className="billing-table-action billing-table-action-primary" onClick={(event) => { event.stopPropagation(); setPaymentDialog(record.view); }}><Check size={15} />Quick Mark Paid</button>}</>} {mode === "Payments" && record.payment && <DocumentDownloadButton kind="payment-receipt" view={record.view} label="Receipt" className="billing-table-action" />} {mode === "Delivery" && <DocumentDownloadButton kind="gate-pass" view={record.view} label="Gate pass" className="billing-table-action" />} </div></td></tr> {inline && open && <tr className="billing-detail-row"><td colSpan={columns.length + 1} id={`billing-detail-${record.key}`}><BillingDetail record={record} actor={actor} mutate={mutate} readOnly={pendingInvoicesOnly} /></td></tr>} </Fragment>; })}</tbody></table></div> {paged.totalCount === 0 && <div className="list-empty"><h3>No matching records</h3><FilterClearButton onClick={clear} label="Clear filters" /></div>} <ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} /> {invoiceDialog && <InvoiceDialog action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)} />} {paymentDialog?.invoice && <PaymentDialog view={paymentDialog} actor={actor} mutate={mutate} onClose={() => setPaymentDialog(undefined)} />} </div> 

### ACT-billing-manager-tsx-166

Component: BillingManager Â· src/billing-manager.tsx:166-166

Tag: button; visibility: pickedJob.invoice; pickedJob; manage

```tsx
<button onClick={() => setInvoiceDialog({ action: "view", view: pickedJob })}>
```

Content/label expression: View Invoice

### ACT-billing-manager-tsx-166

Component: BillingManager Â· src/billing-manager.tsx:166-166

Tag: button; visibility: canEditInvoice(actor, pickedJob.job) && pickedJob.invoice.status === "Pending"; pickedJob.invoice; pickedJob; manage

```tsx
<button className="primary-action" onClick={() => setInvoiceDialog({ action: "edit", view: pickedJob })}>
```

Content/label expression: Edit Invoice

### ACT-billing-manager-tsx-166

Component: BillingManager Â· src/billing-manager.tsx:166-166

Tag: button; visibility: canCreateInvoice(actor, pickedJob.job); pickedJob.invoice; pickedJob; manage

```tsx
<button className="primary-action" onClick={() => setInvoiceDialog({ action: "create", view: pickedJob })}>
```

Content/label expression: Create Invoice

### ACT-billing-manager-tsx-168

Component: BillingManager Â· src/billing-manager.tsx:168-168

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Search ${mode.toLowerCase()}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Job, invoice, customer, vehicle or reference" />
```

Content/label expression: 

### ACT-billing-manager-tsx-169

Component: BillingManager Â· src/billing-manager.tsx:169-169

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`${mode} Month-Year filter`} value={eventMonth} onChange={(event) => { setEventMonth(event.target.value); setPage(1); }}>
```

Content/label expression: <option value="ALL">All months</option> {availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}

### ACT-billing-manager-tsx-170

Component: BillingManager Â· src/billing-manager.tsx:170-170

Tag: select; visibility: showStatusFilter

```tsx
<select aria-label={`${mode} status filter`} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
```

Content/label expression: <option value="ALL">All</option> {statusOptions.map((value) => <option key={value}>{value}</option>)}

### ACT-billing-manager-tsx-171

Component: BillingManager Â· src/billing-manager.tsx:171-171

Tag: select; visibility: showPaymentModeFilter

```tsx
<select aria-label="Payment mode filter" value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value as "ALL" | PaymentMode); setPage(1); }}>
```

Content/label expression: <option value="ALL">All</option> {(["UPI", "Cash", "Card", "Bank transfer", "Other"] as PaymentMode[]).map((value) => <option key={value}>{value}</option>)}

### ACT-billing-manager-tsx-172

Component: BillingManager Â· src/billing-manager.tsx:172-172

Tag: ListSearchActions; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ListSearchActions onClear={clear} />
```

Content/label expression: 

### ACT-billing-manager-tsx-174

Component: BillingManager Â· src/billing-manager.tsx:174-174

Tag: PaginationToolbar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<PaginationToolbar controls={<DownloadMenu report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }} />} from={paged.from} to={paged.to} totalCount={paged.totalCount} page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeAriaLabel={`${mode} records per page`} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
```

Content/label expression: 

### ACT-billing-manager-tsx-174

Component: BillingManager Â· src/billing-manager.tsx:174-174

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<DownloadMenu report={{ title: pendingInvoicesOnly ? "Ready To Invoice" : mode, filters: activeFilterSummary({ Search: search.trim(), "Month-Year": eventMonth === "ALL" ? "ALL" : monthYearLabel(eventMonth), Status: pendingInvoicesOnly ? "Pending" : status, "Payment mode": paymentMode }), columns, rows: filtered }} />
```

Content/label expression: 

### ACT-billing-manager-tsx-181

Component: BillingManager Â· src/billing-manager.tsx:181-181

Tag: button; visibility: mode === "Invoices"

```tsx
<button type="button" className="billing-table-action" onClick={(event) => { event.stopPropagation(); setInvoiceDialog({ action: "view", view: record.view }); }}>
```

Content/label expression: <Eye size={15} /> View

### ACT-billing-manager-tsx-181

Component: BillingManager Â· src/billing-manager.tsx:181-181

Tag: DocumentDownloadButton; visibility: mode === "Invoices"

```tsx
<DocumentDownloadButton kind="invoice" view={record.view} label="Download" className="billing-table-action" />
```

Content/label expression: 

### ACT-billing-manager-tsx-181

Component: BillingManager Â· src/billing-manager.tsx:181-181

Tag: button; visibility: quickPay; mode === "Invoices"

```tsx
<button type="button" className="billing-table-action billing-table-action-primary" onClick={(event) => { event.stopPropagation(); setPaymentDialog(record.view); }}>
```

Content/label expression: <Check size={15} /> Quick Mark Paid

### ACT-billing-manager-tsx-182

Component: BillingManager Â· src/billing-manager.tsx:182-182

Tag: DocumentDownloadButton; visibility: mode === "Payments" && record.payment

```tsx
<DocumentDownloadButton kind="payment-receipt" view={record.view} label="Receipt" className="billing-table-action" />
```

Content/label expression: 

### ACT-billing-manager-tsx-183

Component: BillingManager Â· src/billing-manager.tsx:183-183

Tag: DocumentDownloadButton; visibility: mode === "Delivery"

```tsx
<DocumentDownloadButton kind="gate-pass" view={record.view} label="Gate pass" className="billing-table-action" />
```

Content/label expression: 

### ACT-billing-manager-tsx-188

Component: BillingManager Â· src/billing-manager.tsx:188-188

Tag: FilterClearButton; visibility: paged.totalCount === 0

```tsx
<FilterClearButton onClick={clear} label="Clear filters" />
```

Content/label expression: 

### ACT-billing-manager-tsx-189

Component: BillingManager Â· src/billing-manager.tsx:189-189

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination page={paged.page} pageCount={paged.pageCount} onChange={setPage} />
```

Content/label expression: 

### ACT-billing-manager-tsx-190

Component: BillingManager Â· src/billing-manager.tsx:190-190

Tag: InvoiceDialog; visibility: invoiceDialog

```tsx
<InvoiceDialog action={invoiceDialog.action} view={invoiceDialog.view} fixedJob actor={actor} mutate={mutate} onClose={() => setInvoiceDialog(undefined)} />
```

Content/label expression: 

### ACT-billing-manager-tsx-191

Component: BillingManager Â· src/billing-manager.tsx:191-191

Tag: PaymentDialog; visibility: paymentDialog?.invoice

```tsx
<PaymentDialog view={paymentDialog} actor={actor} mutate={mutate} onClose={() => setPaymentDialog(undefined)} />
```

Content/label expression: 

### ACT-billing-manager-tsx-227

Component: BillingDetail Â· src/billing-manager.tsx:227-227

Tag: InlineVoid; visibility: !readOnly && payment && !payment.voided_at && actor.role === "admin"

```tsx
<InlineVoid label="Void Payment" hint="Voiding reopens the Invoice and voids the Receipt." onVoid={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} mutate={mutate} />
```

Content/label expression: 

### ACT-billing-manager-tsx-228

Component: BillingDetail Â· src/billing-manager.tsx:228-228

Tag: InlineVoid; visibility: !readOnly && !payment && invoice && actor.role === "admin" && canVoidCurrentInvoice(actor, view)

```tsx
<InlineVoid label="Void Invoice" hint="Voiding unlocks the material rows this invoice billed." onVoid={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} mutate={mutate} />
```

Content/label expression: 

### ACT-billing-manager-tsx-236

Component: InlineVoid Â· src/billing-manager.tsx:236-236

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="danger-action" onClick={() => setOpen(true)}>
```

Content/label expression: {label}

### FORM-billing-manager-tsx-243

Component: InlineVoid Â· src/billing-manager.tsx:243-243

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="billing-dialog-form" onSubmit={submit} aria-label={label}>
```

Content/label expression:  <p className="permission-note">{hint}</p> <label>Void reason<textarea aria-label={`${label} reason`} required value={reason} onChange={(event) => setReason(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} <div className="action-row"><button type="button" onClick={() => { setOpen(false); setReason(""); setError(""); }}>Cancel</button><button type="submit" className="danger-action">Confirm {label}</button></div> 

### ACT-billing-manager-tsx-245

Component: InlineVoid Â· src/billing-manager.tsx:245-245

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea aria-label={`${label} reason`} required value={reason} onChange={(event) => setReason(event.target.value)} />
```

Content/label expression: 

### STATE-billing-manager-tsx-246

Component: InlineVoid Â· src/billing-manager.tsx:246-246

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-billing-manager-tsx-247

Component: InlineVoid Â· src/billing-manager.tsx:247-247

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" onClick={() => { setOpen(false); setReason(""); setError(""); }}>
```

Content/label expression: Cancel

### ACT-billing-manager-tsx-247

Component: InlineVoid Â· src/billing-manager.tsx:247-247

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="submit" className="danger-action">
```

Content/label expression: Confirm {label}

### FORM-billing-manager-tsx-263

Component: RecordPaymentForm Â· src/billing-manager.tsx:263-263

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="billing-dialog-form" onSubmit={record} aria-label="Quick mark paid">
```

Content/label expression:  <div className="form-grid"><label>Amount<input aria-label="Payment amount" value={money(invoice.total)} disabled readOnly /></label><label>Mode<select aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}>{(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>{mode === "Other" && <label>Other detail<input aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)} /></label>}<label>Reference (optional)<input aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)} /></label></div> <label>Notes (optional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} <div className="action-row"><button type="submit" className="primary-action">Confirm Payment</button></div> 

### ACT-billing-manager-tsx-264

Component: RecordPaymentForm Â· src/billing-manager.tsx:264-264

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Payment amount" value={money(invoice.total)} disabled readOnly />
```

Content/label expression: 

### ACT-billing-manager-tsx-264

Component: RecordPaymentForm Â· src/billing-manager.tsx:264-264

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Payment mode" value={mode} onChange={(event) => setMode(event.target.value as PaymentMode)}>
```

Content/label expression: {(["UPI", "Cash", "Card", "Bank transfer", "Other"] as const).map((value) => <option key={value}>{value}</option>)}

### ACT-billing-manager-tsx-264

Component: RecordPaymentForm Â· src/billing-manager.tsx:264-264

Tag: input; visibility: mode === "Other"

```tsx
<input aria-label="Other payment detail" value={otherDetail} onChange={(event) => setOtherDetail(event.target.value)} />
```

Content/label expression: 

### ACT-billing-manager-tsx-264

Component: RecordPaymentForm Â· src/billing-manager.tsx:264-264

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Payment reference" value={reference} onChange={(event) => setReference(event.target.value)} />
```

Content/label expression: 

### ACT-billing-manager-tsx-264

Component: RecordPaymentForm Â· src/billing-manager.tsx:264-264

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
```

Content/label expression: 

### STATE-billing-manager-tsx-265

Component: RecordPaymentForm Â· src/billing-manager.tsx:265-265

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-billing-manager-tsx-266

Component: RecordPaymentForm Â· src/billing-manager.tsx:266-266

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="submit" className="primary-action">
```

Content/label expression: Confirm Payment

### STATE-billing-manager-tsx-317

Component: InvoiceDialog Â· src/billing-manager.tsx:317-317

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog title={`${action[0].toUpperCase() + action.slice(1)} Invoice`} subtitle={`${selected.job.job_no} · ${selected.vehicle.number}`} onClose={onClose} wide className="dialog-document-editor" footer={!readOnly && <button className="primary-action" type="submit" form="invoice-dialog-form">{action === "edit" ? "Update Invoice" : "Save Invoice"}</button>}>
```

Content/label expression: <form id="invoice-dialog-form" className="billing-dialog-form" onSubmit={submit}> {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>} {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>} <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div> <div className="estimate-items"><div className="line-items-header"><strong>Invoice items</strong>{!lockFinancials && <button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}><Plus size={16} />Add Item</button>}</div><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST type</span><span>GST rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }) })}><option>CGST+SGST</option><option>IGST</option><option>No GST</option></select>{item.gst_type === "No GST" ? <span className="gst-no-rate">0%</span> : <SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />} {!lockFinancials && <button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div> <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div> <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label> {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>} {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference and notes can still be updated.</p>} {error && <p className="error-text" role="alert">{error}</p>} </form>

### ACT-billing-manager-tsx-317

Component: InvoiceDialog Â· src/billing-manager.tsx:317-317

Tag: button; visibility: !readOnly

```tsx
<button className="primary-action" type="submit" form="invoice-dialog-form">
```

Content/label expression: {action === "edit" ? "Update Invoice" : "Save Invoice"}

### FORM-billing-manager-tsx-317

Component: InvoiceDialog Â· src/billing-manager.tsx:317-317

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="invoice-dialog-form" className="billing-dialog-form" onSubmit={submit}>
```

Content/label expression:  {action === "create" && !fixedJob && candidates.length > 1 && <label>Job<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>{candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}</select></label>} {warning && !readOnly && <p className="permission-note" role="status">{warning}</p>} <div className="form-grid"><label>Tally invoice number<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} /></label><label>Flat discount (₹)<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div> <div className="estimate-items"><div className="line-items-header"><strong>Invoice items</strong>{!lockFinancials && <button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}><Plus size={16} />Add Item</button>}</div><div className="estimate-item estimate-item-heading"><span>Kind</span><span>Description</span><span>Quantity</span><span>Rate</span><span>GST type</span><span>GST rate</span><span>Action</span></div>{items.map((item, index) => <div className="estimate-item" key={item.id ?? `new-${index}`}><select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}><option>Service</option><option>Material</option></select><input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} /><input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /><input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} /><select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate \|\| 18 }) })}><option>CGST+SGST</option><option>IGST</option><option>No GST</option></select>{item.gst_type === "No GST" ? <span className="gst-no-rate">0%</span> : <SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />} {!lockFinancials && <button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>Remove</button>}</div>)}{!lockFinancials && lateMaterials.map((line) => <button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>Add late material: {line.description} x {line.qty}</button>)}</div> <div className="invoice-totals" aria-label="Invoice totals"><span>Subtotal <strong>{money(totals.subtotal)}</strong></span><span>Discount <strong>{money(totals.discount)}</strong></span><span>GST <strong>{money(totals.gst)}</strong></span><span>Total <strong>{money(totals.total)}</strong></span></div> <label>Notes<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></label> {action === "edit" && !lockFinancials && <label>Edit note<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." /></label>} {financialLocked && <p className="permission-note">Financial fields and line items are locked because this invoice has an active payment. Tally reference and notes can still be updated.</p>} {error && <p className="error-text" role="alert">{error}</p>} 

### ACT-billing-manager-tsx-318

Component: InvoiceDialog Â· src/billing-manager.tsx:318-318

Tag: select; visibility: action === "create" && !fixedJob && candidates.length > 1

```tsx
<select aria-label="Billing job" value={selected.job.id} onChange={(event) => chooseJob(Number(event.target.value))}>
```

Content/label expression: {candidates.map((candidate) => <option key={candidate.job.id} value={candidate.job.id}>{candidate.job.job_no} · {candidate.vehicle.number}</option>)}

### STATE-billing-manager-tsx-319

Component: InvoiceDialog Â· src/billing-manager.tsx:319-319

Tag: p; visibility: warning && !readOnly

```tsx
<p className="permission-note" role="status">
```

Content/label expression: {warning}

### ACT-billing-manager-tsx-320

Component: InvoiceDialog Â· src/billing-manager.tsx:320-320

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input data-dialog-initial-focus value={tally} disabled={readOnly} onChange={(event) => setTally(event.target.value)} />
```

Content/label expression: 

### ACT-billing-manager-tsx-320

Component: InvoiceDialog Â· src/billing-manager.tsx:320-320

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Invoice discount" type="number" min="0" step="0.01" value={discount} disabled={lockFinancials} onChange={(event) => setDiscount(Number(event.target.value))} />
```

Content/label expression: 

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: button; visibility: !lockFinancials

```tsx
<button type="button" className="add-line-item" onClick={() => setItems((rows) => [...rows, { kind: "Service", description: "", qty: 1, rate: 0, gst_type: "CGST+SGST", gst_rate: 18 }])}>
```

Content/label expression: <Plus size={16} /> Add Item

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`Invoice item ${index + 1} type`} value={item.kind} disabled={lockFinancials} onChange={(event) => updateItem(index, { kind: event.target.value as InvoiceItemDraft["kind"] })}>
```

Content/label expression: <option>Service</option> <option>Material</option>

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Invoice item ${index + 1} description`} value={item.description} disabled={lockFinancials} onChange={(event) => updateItem(index, { description: event.target.value })} />
```

Content/label expression: 

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Invoice item ${index + 1} quantity`} type="number" min="0.01" step="0.01" value={item.qty} disabled={lockFinancials} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Invoice item ${index + 1} rate`} type="number" min="0" step="0.01" value={item.rate} disabled={lockFinancials} onChange={(event) => updateItem(index, { rate: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`Invoice item ${index + 1} GST type`} value={item.gst_type} disabled={lockFinancials} onChange={(event) => updateItem(index, { gst_type: event.target.value as GstType, ...(event.target.value === "No GST" ? { gst_rate: 0 } : { gst_rate: item.gst_rate || 18 }) })}>
```

Content/label expression: <option>CGST+SGST</option> <option>IGST</option> <option>No GST</option>

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: SearchSelect; visibility: item.gst_type === "No GST"

```tsx
<SearchSelect label={`Invoice item ${index + 1} GST rate`} options={GST_RATE_OPTIONS} value={item.gst_rate} disabled={lockFinancials} onChange={(value) => updateItem(index, { gst_rate: Number(value) })} placeholder="GST rate" hideLabel />
```

Content/label expression: 

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: button; visibility: !lockFinancials

```tsx
<button type="button" className="link-action line-remove" aria-label={`Remove invoice item ${index + 1}`} onClick={() => setItems((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}>
```

Content/label expression: Remove

### ACT-billing-manager-tsx-321

Component: InvoiceDialog Â· src/billing-manager.tsx:321-321

Tag: button; visibility: !lockFinancials

```tsx
<button type="button" key={line.material_row_id} onClick={() => setItems((rows) => [...rows, line])}>
```

Content/label expression: Add late material: {line.description} x {line.qty}

### ACT-billing-manager-tsx-323

Component: InvoiceDialog Â· src/billing-manager.tsx:323-323

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} />
```

Content/label expression: 

### ACT-billing-manager-tsx-324

Component: InvoiceDialog Â· src/billing-manager.tsx:324-324

Tag: textarea; visibility: action === "edit" && !lockFinancials

```tsx
<textarea aria-label="Invoice edit note" value={editNote} onChange={(event) => setEditNote(event.target.value)} placeholder="Required when lines or discount change. Recorded in Data Flow." />
```

Content/label expression: 

### STATE-billing-manager-tsx-326

Component: InvoiceDialog Â· src/billing-manager.tsx:326-326

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### STATE-billing-manager-tsx-333

Component: PaymentDialog Â· src/billing-manager.tsx:333-333

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog title="Quick Mark Paid" subtitle={`${view.job.job_no} · ${invoice.invoice_no}`} onClose={onClose} footer={null}>
```

Content/label expression: <RecordPaymentForm invoice={invoice} actor={actor} mutate={(action, onError) => { const ok = mutate(action, onError); if (ok) onClose(); return ok; }} />

### STATE-billing-manager-tsx-351

Component: JobInvoicePanel Â· src/billing-manager.tsx:351-351

Tag: p; visibility: warning

```tsx
<p className="permission-note" role="status">
```

Content/label expression: {warning}

### ACT-billing-manager-tsx-352

Component: JobInvoicePanel Â· src/billing-manager.tsx:352-352

Tag: button; visibility: estimateActions.includes("approve-estimate")

```tsx
<button type="button" className="primary-action" onClick={onEstimate}>
```

Content/label expression: Approve Estimate

### ACT-billing-manager-tsx-352

Component: JobInvoicePanel Â· src/billing-manager.tsx:352-352

Tag: button; visibility: actions.includes("create-invoice")

```tsx
<button type="button" className="primary-action" onClick={onOpen}>
```

Content/label expression: Create Invoice

### ACT-billing-manager-tsx-357

Component: JobInvoicePanel Â· src/billing-manager.tsx:357-357

Tag: button; visibility: actions.includes("edit-invoice")

```tsx
<button type="button" className="primary-action" onClick={onOpen}>
```

Content/label expression: Edit Invoice

### ACT-billing-manager-tsx-357

Component: JobInvoicePanel Â· src/billing-manager.tsx:357-357

Tag: button; visibility: canVoidInvoice

```tsx
<button type="button" className="danger-action" onClick={() => setVoiding(true)}>
```

Content/label expression: Void Invoice

### STATE-billing-manager-tsx-359

Component: JobInvoicePanel Â· src/billing-manager.tsx:359-359

Tag: p; visibility: warning

```tsx
<p className="permission-note" role="status">
```

Content/label expression: {warning}

### ACT-billing-manager-tsx-361

Component: JobInvoicePanel Â· src/billing-manager.tsx:361-361

Tag: VoidReasonDialog; visibility: voiding

```tsx
<VoidReasonDialog title="Void Invoice?" subtitle={`${view.job.job_no} · Unlocks the material rows it billed`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidInvoiceForActor(db, invoice.id, actor.id, reason)} />
```

Content/label expression: 

### STATE-billing-manager-tsx-374

Component: VoidReasonDialog Â· src/billing-manager.tsx:374-374

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog title={title} subtitle={subtitle} onClose={onClose} footer={<button className="danger-action" type="submit" form="void-reason-dialog-form">Void</button>}>
```

Content/label expression: <form id="void-reason-dialog-form" className="billing-dialog-form" onSubmit={submit}> <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} </form>

### ACT-billing-manager-tsx-374

Component: VoidReasonDialog Â· src/billing-manager.tsx:374-374

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="danger-action" type="submit" form="void-reason-dialog-form">
```

Content/label expression: Void

### FORM-billing-manager-tsx-374

Component: VoidReasonDialog Â· src/billing-manager.tsx:374-374

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="void-reason-dialog-form" className="billing-dialog-form" onSubmit={submit}>
```

Content/label expression:  <label>Reason<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} /></label> {error && <p className="error-text" role="alert">{error}</p>} 

### ACT-billing-manager-tsx-375

Component: VoidReasonDialog Â· src/billing-manager.tsx:375-375

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea data-dialog-initial-focus required value={reason} onChange={(event) => setReason(event.target.value)} />
```

Content/label expression: 

### STATE-billing-manager-tsx-376

Component: VoidReasonDialog Â· src/billing-manager.tsx:376-376

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-billing-manager-tsx-391

Component: JobPaymentPanel Â· src/billing-manager.tsx:391-391

Tag: button; visibility: payment && actor.role === "admin"

```tsx
<button type="button" className="danger-action" onClick={() => setVoiding(true)}>
```

Content/label expression: Void Payment

### ACT-billing-manager-tsx-396

Component: JobPaymentPanel Â· src/billing-manager.tsx:396-396

Tag: VoidReasonDialog; visibility: voiding && payment

```tsx
<VoidReasonDialog title="Void Payment?" subtitle={`${view.job.job_no} · Reopens the Invoice and voids the Receipt`} mutate={mutate} onClose={() => setVoiding(false)} action={(db, reason) => voidPaymentForActor(db, payment.id, actor.id, reason)} />
```

Content/label expression: 

### ACT-body-mark-tsx-65

Component: BodyMarkDiagram Â· src/body-mark.tsx:65-68

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className={`body-mark-canvas${onChange ? " editable" : ""}`} role="group" aria-label="Combined vehicle body-mark illustration" onClick={onChange ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onChange(addDamageMark(marks, ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100));
      } : undefined}>
```

Content/label expression:  <img src={DAMAGE_DIAGRAM_ASSET} alt="Vehicle body illustration" /> {marks.map((mark) => <button key={mark.id} type="button" className="damage-marker" data-testid="damage-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} aria-label={`Remove damage mark ${mark.id}`} title={`Remove damage mark ${mark.id}`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }} disabled={!onChange}>{mark.id}<X size={10} aria-hidden="true" /></button>)} 

### ACT-body-mark-tsx-70

Component: BodyMarkDiagram Â· src/body-mark.tsx:70-70

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button key={mark.id} type="button" className="damage-marker" data-testid="damage-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} aria-label={`Remove damage mark ${mark.id}`} title={`Remove damage mark ${mark.id}`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }} disabled={!onChange}>
```

Content/label expression: {mark.id} <X size={10} aria-hidden="true" />

### ACT-body-mark-tsx-74

Component: BodyMarkDiagram Â· src/body-mark.tsx:74-74

Tag: button; visibility: !hideDownload

```tsx
<button type="button" className="workflow-action action-document document-download" onClick={download}>
```

Content/label expression: <Download size={15} /> Download image

### STATE-body-mark-tsx-76

Component: BodyMarkDiagram Â· src/body-mark.tsx:76-76

Tag: p; visibility: error

```tsx
<p role="alert" className="form-error">
```

Content/label expression: {error}

### ACT-booking-calendar-tsx-40

Component: BookingCalendar Â· src/booking-calendar.tsx:40-40

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={() => { setForm(draftFor(selectedDate)); setError(""); setCreating(true); }} disabled={!canOverride && !capacity.serviceWork.remaining && !capacity.generalCheckupFollowup.remaining}>
```

Content/label expression: <Plus size={16} /> Create Booking

### ACT-booking-calendar-tsx-41

Component: BookingCalendar Â· src/booking-calendar.tsx:41-41

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" aria-label="Previous month" disabled={month === range.firstMonth} onClick={() => changeMonth(-1)}>
```

Content/label expression: <ChevronLeft size={18} />

### ACT-booking-calendar-tsx-41

Component: BookingCalendar Â· src/booking-calendar.tsx:41-41

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" aria-label="Next month" disabled={month === range.lastMonth} onClick={() => changeMonth(1)}>
```

Content/label expression: <ChevronRight size={18} />

### ACT-booking-calendar-tsx-41

Component: BookingCalendar Â· src/booking-calendar.tsx:41-41

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" key={date} role="gridcell" disabled={!isAdvanceBookingDate(date, range)} onClick={() => selectDate(date)} className={`booking-calendar-day${!date.startsWith(month) ? " outside-month" : ""}${date === selectedDate ? " selected" : ""}${full ? " full" : ""}`} aria-pressed={date === selectedDate}>
```

Content/label expression: <span>{Number(date.slice(-2))}</span> <small>SW {c.serviceWork.count}/{c.serviceWork.limit} · C {c.generalCheckupFollowup.count}/{c.generalCheckupFollowup.limit}</small>

### ACT-booking-calendar-tsx-42

Component: BookingCalendar Â· src/booking-calendar.tsx:42-42

Tag: button; visibility: canOverride

```tsx
<button type="button" aria-label="Admin control: set daily booking limits" onClick={() => { setCapacityDraft(draftCapacity(selectedDate)); setError(""); setEditingCapacity(true); }}>
```

Content/label expression: Admin: Set limits

### STATE-booking-calendar-tsx-42

Component: BookingCalendar Â· src/booking-calendar.tsx:42-42

Tag: p; visibility: (!capacity.serviceWork.remaining \|\| !capacity.generalCheckupFollowup.remaining)

```tsx
<p className="booking-capacity-alert" role="status">
```

Content/label expression: {!capacity.serviceWork.remaining ? "Service Work is full. " : ""} {!capacity.generalCheckupFollowup.remaining ? "General Checkup / Follow-up is full. " : ""} Reception cannot select a full type. {canOverride ? " Admin may add one with an override reason." : ""}

### STATE-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: Dialog; visibility: creating

```tsx
<Dialog title="Create advance booking" subtitle={`Booking for ${dateLabel(selectedDate)}`} onClose={() => setCreating(false)}>
```

Content/label expression: <form className="booking-form" onSubmit={submit}><label>Customer name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label><label>Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label><label>Vehicle number<input required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })} /></label><label>Make<input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /></label><label>Model<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label><label>Color<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label><label>Booking date<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} /></label><label>Service type<select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}>{serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}</select></label><label>Arrival window<select value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}>{windows.map((w) => <option key={w} value={w}>{w \|\| "Not set"}</option>)}</select></label><label className="booking-form-wide">Requested work<textarea required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })} /></label>{formQuota.remaining === 0 && canOverride && <label className="booking-form-wide">Admin override reason (recorded in the booking audit trail)<textarea required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })} /></label>}{error && <p className="error-text booking-form-wide" role="alert">{error}</p>}<div className="action-row booking-form-wide"><button className="primary-action">Save Booking</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div></form>

### FORM-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: form; visibility: creating

```tsx
<form className="booking-form" onSubmit={submit}>
```

Content/label expression: <label>Customer name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label> <label>Mobile<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label> <label>Vehicle number<input required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })} /></label> <label>Make<input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} /></label> <label>Model<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label> <label>Color<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label> <label>Booking date<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} /></label> <label>Service type<select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}>{serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}</select></label> <label>Arrival window<select value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}>{windows.map((w) => <option key={w} value={w}>{w \|\| "Not set"}</option>)}</select></label> <label className="booking-form-wide">Requested work<textarea required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })} /></label> {formQuota.remaining === 0 && canOverride && <label className="booking-form-wide">Admin override reason (recorded in the booking audit trail)<textarea required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })} /></label>} {error && <p className="error-text booking-form-wide" role="alert">{error}</p>} <div className="action-row booking-form-wide"><button className="primary-action">Save Booking</button><button type="button" onClick={() => setCreating(false)}>Cancel</button></div>

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input required value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value.toUpperCase() })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: input; visibility: creating

```tsx
<input required type="date" min={range.min} max={range.max} value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: select; visibility: creating

```tsx
<select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as BookingServiceType })}>
```

Content/label expression: {serviceTypes.map((type) => <option key={type} value={type} disabled={!canOverride && quota(form.bookingDate, type).remaining === 0}>{type}{quota(form.bookingDate, type).remaining === 0 ? " (full)" : ""}</option>)}

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: select; visibility: creating

```tsx
<select value={form.arrivalWindow} onChange={(e) => setForm({ ...form, arrivalWindow: e.target.value as BookingArrivalWindow })}>
```

Content/label expression: {windows.map((w) => <option key={w} value={w}>{w \|\| "Not set"}</option>)}

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: textarea; visibility: creating

```tsx
<textarea required value={form.requestedWork} onChange={(e) => setForm({ ...form, requestedWork: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: textarea; visibility: formQuota.remaining === 0 && canOverride; creating

```tsx
<textarea required value={form.capacityOverrideReason} onChange={(e) => setForm({ ...form, capacityOverrideReason: e.target.value })} />
```

Content/label expression: 

### STATE-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: p; visibility: error; creating

```tsx
<p className="error-text booking-form-wide" role="alert">
```

Content/label expression: {error}

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: button; visibility: creating

```tsx
<button className="primary-action">
```

Content/label expression: Save Booking

### ACT-booking-calendar-tsx-43

Component: BookingCalendar Â· src/booking-calendar.tsx:43-43

Tag: button; visibility: creating

```tsx
<button type="button" onClick={() => setCreating(false)}>
```

Content/label expression: Cancel

### STATE-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: Dialog; visibility: editingCapacity

```tsx
<Dialog title="Set daily booking limits" subtitle={dateLabel(selectedDate)} onClose={() => setEditingCapacity(false)}>
```

Content/label expression: <form onSubmit={saveLimits}><label>Service Work bookings allowed<input aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })} /></label><label>General Checkup / Follow-up bookings allowed<input aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })} /></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="action-row"><button className="primary-action">Save limits</button><button type="button" onClick={() => setEditingCapacity(false)}>Cancel</button></div></form>

### FORM-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: form; visibility: editingCapacity

```tsx
<form onSubmit={saveLimits}>
```

Content/label expression: <label>Service Work bookings allowed<input aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })} /></label> <label>General Checkup / Follow-up bookings allowed<input aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })} /></label> {error && <p className="error-text" role="alert">{error}</p>} <div className="action-row"><button className="primary-action">Save limits</button><button type="button" onClick={() => setEditingCapacity(false)}>Cancel</button></div>

### ACT-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: input; visibility: editingCapacity

```tsx
<input aria-label="Service Work booking capacity" required type="number" min="0" step="1" value={capacityDraft.serviceWork} onChange={(e) => setCapacityDraft({ ...capacityDraft, serviceWork: e.target.value })} />
```

Content/label expression: 

### ACT-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: input; visibility: editingCapacity

```tsx
<input aria-label="General Checkup / Follow-up booking capacity" required type="number" min="0" step="1" value={capacityDraft.generalCheckupFollowup} onChange={(e) => setCapacityDraft({ ...capacityDraft, generalCheckupFollowup: e.target.value })} />
```

Content/label expression: 

### STATE-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: p; visibility: error; editingCapacity

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: button; visibility: editingCapacity

```tsx
<button className="primary-action">
```

Content/label expression: Save limits

### ACT-booking-calendar-tsx-44

Component: BookingCalendar Â· src/booking-calendar.tsx:44-44

Tag: button; visibility: editingCapacity

```tsx
<button type="button" onClick={() => setEditingCapacity(false)}>
```

Content/label expression: Cancel

### STATE-booking-check-in-tsx-35

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:35-35

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog wide title="Check in advance booking" subtitle={`${booking.customer_name} · ${booking.vehicle_no}`} onClose={onClose} footer={<button className="primary-action" type="submit" form="booking-check-in-form">Create Visit and Job Card</button>}>
```

Content/label expression:  <form id="booking-check-in-form" onSubmit={submit}> <p className="permission-note">Booking details are prefilled below. Capture actual arrival condition; advisor assignment happens after check-in.</p> <div className="form-grid"> <label>Customer name<input value={booking.customer_name} readOnly /></label><label>Mobile<input value={booking.mobile} readOnly /></label> <label>Vehicle number<input value={booking.vehicle_no} readOnly /></label><label>Vehicle<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly /></label><label>Booked service type<input value={booking.service_type} readOnly /></label> <label>ODO meter reading (km)<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} /></label> <label>Fuel / battery level<div className="field-pair"><input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} /><select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}><option value="bars">bars</option><option value="%">%</option><option value="litres">litres</option><option value="Other">Other</option></select></div></label> <label>Keys<input value={keys} onChange={(event) => setKeys(event.target.value)} /></label><label>Accessories<input value={accessories} onChange={(event) => setAccessories(event.target.value)} /></label> </div> <label>Requested work<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} /></label> <div className="damage-capture"><strong>Arrival body marks (optional)</strong><BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} /></div> {error && <p className="form-error" role="alert">{error}</p>} </form> 

### ACT-booking-check-in-tsx-35

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:35-35

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit" form="booking-check-in-form">
```

Content/label expression: Create Visit and Job Card

### FORM-booking-check-in-tsx-36

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:36-36

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="booking-check-in-form" onSubmit={submit}>
```

Content/label expression:  <p className="permission-note">Booking details are prefilled below. Capture actual arrival condition; advisor assignment happens after check-in.</p> <div className="form-grid"> <label>Customer name<input value={booking.customer_name} readOnly /></label><label>Mobile<input value={booking.mobile} readOnly /></label> <label>Vehicle number<input value={booking.vehicle_no} readOnly /></label><label>Vehicle<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly /></label><label>Booked service type<input value={booking.service_type} readOnly /></label> <label>ODO meter reading (km)<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} /></label> <label>Fuel / battery level<div className="field-pair"><input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} /><select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}><option value="bars">bars</option><option value="%">%</option><option value="litres">litres</option><option value="Other">Other</option></select></div></label> <label>Keys<input value={keys} onChange={(event) => setKeys(event.target.value)} /></label><label>Accessories<input value={accessories} onChange={(event) => setAccessories(event.target.value)} /></label> </div> <label>Requested work<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} /></label> <div className="damage-capture"><strong>Arrival body marks (optional)</strong><BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} /></div> {error && <p className="form-error" role="alert">{error}</p>} 

### ACT-booking-check-in-tsx-39

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:39-39

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={booking.customer_name} readOnly />
```

Content/label expression: 

### ACT-booking-check-in-tsx-39

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:39-39

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={booking.mobile} readOnly />
```

Content/label expression: 

### ACT-booking-check-in-tsx-40

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:40-40

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={booking.vehicle_no} readOnly />
```

Content/label expression: 

### ACT-booking-check-in-tsx-40

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:40-40

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} readOnly />
```

Content/label expression: 

### ACT-booking-check-in-tsx-40

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:40-40

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={booking.service_type} readOnly />
```

Content/label expression: 

### ACT-booking-check-in-tsx-41

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:41-41

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input data-dialog-initial-focus required type="number" min="0" value={odoReading} onChange={(event) => setOdoReading(event.target.value)} />
```

Content/label expression: 

### ACT-booking-check-in-tsx-42

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:42-42

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input required value={fuelLevelValue} onChange={(event) => setFuelLevelValue(event.target.value)} />
```

Content/label expression: 

### ACT-booking-check-in-tsx-42

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:42-42

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={fuelLevelUnit} onChange={(event) => setFuelLevelUnit(event.target.value as FuelUnit)}>
```

Content/label expression: <option value="bars">bars</option> <option value="%">%</option> <option value="litres">litres</option> <option value="Other">Other</option>

### ACT-booking-check-in-tsx-43

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:43-43

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={keys} onChange={(event) => setKeys(event.target.value)} />
```

Content/label expression: 

### ACT-booking-check-in-tsx-43

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:43-43

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={accessories} onChange={(event) => setAccessories(event.target.value)} />
```

Content/label expression: 

### ACT-booking-check-in-tsx-45

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:45-45

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea required rows={3} value={requestedWork} onChange={(event) => setRequestedWork(event.target.value)} />
```

Content/label expression: 

### ACT-booking-check-in-tsx-46

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:46-46

Tag: BodyMarkDiagram; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<BodyMarkDiagram marks={marks} onChange={setMarks} hideDownload meta={{ vehicleName: `${booking.make} ${booking.model}`, color: booking.color, regNo: booking.vehicle_no }} />
```

Content/label expression: 

### STATE-booking-check-in-tsx-47

Component: BookingCheckInDialog Â· src/booking-check-in.tsx:47-47

Tag: p; visibility: error

```tsx
<p className="form-error" role="alert">
```

Content/label expression: {error}

### ACT-booking-expected-today-tsx-71

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:71-71

Tag: BookingCheckInDialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<BookingCheckInDialog booking={selected.booking} actor={actor} mutate={mutate} onClose={closeAction} onCreated={(jobId, jobNo) => { closeAction(); onCheckedIn?.(jobId, jobNo); }} />
```

Content/label expression: 

### ACT-booking-expected-today-tsx-82

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:82-82

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Expected today follow-up status" value={filter} onChange={(event) => setFilter(event.target.value as ExpectedTodayFilter)}>
```

Content/label expression:  <option value="ALL">All expected</option> <option value="NEEDS_FOLLOW_UP">Needs follow-up</option> <option value="CALLED">Call logged</option> 

### ACT-booking-expected-today-tsx-91

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:91-91

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="primary-action" onClick={() => openAction(booking, "check-in")}>
```

Content/label expression: Check in

### ACT-booking-expected-today-tsx-91

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:91-91

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" onClick={() => openAction(booking, "call")}>
```

Content/label expression: Log call {calls.length ? ` (${calls.length})` : ""}

### ACT-booking-expected-today-tsx-91

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:91-91

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" onClick={() => openAction(booking, "reschedule")}>
```

Content/label expression: Reschedule

### ACT-booking-expected-today-tsx-91

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:91-91

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="danger-action" onClick={() => openAction(booking, "cancel")}>
```

Content/label expression: Cancel

### ACT-booking-expected-today-tsx-91

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:91-91

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="secondary-action" onClick={() => openAction(booking, "no-show")}>
```

Content/label expression: No-show

### STATE-booking-expected-today-tsx-95

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:95-95

Tag: Dialog; visibility: selected

```tsx
<Dialog title={title} subtitle={`${selected.booking.customer_name} · ${selected.booking.vehicle_no}`} onClose={closeAction} footer={<button type="submit" form="booking-follow-up-form" className={selected.action === "cancel" ? "danger-action" : "primary-action"}>{selected.action === "call" ? "Save call note" : selected.action === "reschedule" ? "Save reschedule" : selected.action === "cancel" ? "Cancel booking" : "Mark no-show"}</button>}>
```

Content/label expression:  <form id="booking-follow-up-form" className="booking-follow-up-form" onSubmit={submit}> {selected.action === "reschedule" && <><label>New booking date<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required /></label><label>Booked service type<input value={selected.booking.service_type} readOnly /></label><label>Arrival window<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>{windowOptions.map((window) => <option key={window} value={window}>{window \|\| "Not set"}</option>)}</select></label>{rescheduleQuotaFull && actor.role === "admin" && <label>Admin override reason (recorded in the booking audit trail)<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} /></label>}</>} <label>{selected.action === "call" ? "Call note" : selected.action === "reschedule" ? "Reschedule reason" : selected.action === "cancel" ? "Cancellation reason" : "No-show reason"}<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required /></label> {selected.action === "no-show" && <p className="permission-note">Use this only after day-end follow-up. This is a manual status and cannot be undone from Expected Today.</p>} {error && <p className="form-error" role="alert">{error}</p>} </form> 

### ACT-booking-expected-today-tsx-95

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:95-95

Tag: button; visibility: selected

```tsx
<button type="submit" form="booking-follow-up-form" className={selected.action === "cancel" ? "danger-action" : "primary-action"}>
```

Content/label expression: {selected.action === "call" ? "Save call note" : selected.action === "reschedule" ? "Save reschedule" : selected.action === "cancel" ? "Cancel booking" : "Mark no-show"}

### FORM-booking-expected-today-tsx-96

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:96-96

Tag: form; visibility: selected

```tsx
<form id="booking-follow-up-form" className="booking-follow-up-form" onSubmit={submit}>
```

Content/label expression:  {selected.action === "reschedule" && <><label>New booking date<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required /></label><label>Booked service type<input value={selected.booking.service_type} readOnly /></label><label>Arrival window<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>{windowOptions.map((window) => <option key={window} value={window}>{window \|\| "Not set"}</option>)}</select></label>{rescheduleQuotaFull && actor.role === "admin" && <label>Admin override reason (recorded in the booking audit trail)<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} /></label>}</>} <label>{selected.action === "call" ? "Call note" : selected.action === "reschedule" ? "Reschedule reason" : selected.action === "cancel" ? "Cancellation reason" : "No-show reason"}<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required /></label> {selected.action === "no-show" && <p className="permission-note">Use this only after day-end follow-up. This is a manual status and cannot be undone from Expected Today.</p>} {error && <p className="form-error" role="alert">{error}</p>} 

### ACT-booking-expected-today-tsx-97

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:97-97

Tag: input; visibility: selected.action === "reschedule"; selected

```tsx
<input data-dialog-initial-focus type="date" min={range.min} max={range.max} value={rescheduleDate} onChange={(event) => setRescheduleDate(event.target.value)} required />
```

Content/label expression: 

### ACT-booking-expected-today-tsx-97

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:97-97

Tag: input; visibility: selected.action === "reschedule"; selected

```tsx
<input value={selected.booking.service_type} readOnly />
```

Content/label expression: 

### ACT-booking-expected-today-tsx-97

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:97-97

Tag: select; visibility: selected.action === "reschedule"; selected

```tsx
<select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value as BookingArrivalWindow)}>
```

Content/label expression: {windowOptions.map((window) => <option key={window} value={window}>{window \|\| "Not set"}</option>)}

### ACT-booking-expected-today-tsx-97

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:97-97

Tag: textarea; visibility: rescheduleQuotaFull && actor.role === "admin"; selected.action === "reschedule"; selected

```tsx
<textarea required value={capacityOverrideReason} onChange={(event) => setCapacityOverrideReason(event.target.value)} />
```

Content/label expression: 

### ACT-booking-expected-today-tsx-98

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:98-98

Tag: textarea; visibility: selected

```tsx
<textarea data-dialog-initial-focus value={note} onChange={(event) => setNote(event.target.value)} placeholder={selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} required />
```

Content/label expression: 

### STATE-booking-expected-today-tsx-100

Component: ExpectedTodayBookings Â· src/booking-expected-today.tsx:100-100

Tag: p; visibility: error; selected

```tsx
<p className="form-error" role="alert">
```

Content/label expression: {error}

### ACT-developer-console-tsx-12

Component: DeveloperConsole Â· src/developer-console.tsx:12-12

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="danger-action" onClick={onReset}>
```

Content/label expression: <RotateCcw size={16} /> Reset demo

### STATE-developer-console-tsx-13

Component: DeveloperConsole Â· src/developer-console.tsx:13-13

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="management-tabs" role="tablist" aria-label="Developer Console tabs">
```

Content/label expression: {(["Tenants", "Communications", "Billing"] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}

### STATE-developer-console-tsx-13

Component: DeveloperConsole Â· src/developer-console.tsx:13-13

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
```

Content/label expression: {item}

### ACT-developer-console-tsx-15

Component: DeveloperConsole Â· src/developer-console.tsx:15-15

Tag: button; visibility: tab === "Tenants"

```tsx
<button className={`tenant-row ${item.id === tenant.id ? "selected" : ""}`} key={item.id} onClick={() => commit((current) => ({ ...current, selectedTenantId: item.id }))}>
```

Content/label expression: <Building2 size={18}/> <span><strong>{item.profile.name}</strong><small>{item.lifecycle}</small></span>

### ACT-developer-console-tsx-15

Component: DeveloperConsole Â· src/developer-console.tsx:15-15

Tag: TenantCreate; visibility: tab === "Tenants"

```tsx
<TenantCreate onCreate={(profile) => commit((current) => createTenant(current, profile))}/>
```

Content/label expression: 

### ACT-developer-console-tsx-15

Component: DeveloperConsole Â· src/developer-console.tsx:15-15

Tag: TenantProfileForm; visibility: tab === "Tenants"

```tsx
<TenantProfileForm profile={tenant.profile} onSave={(profile) => commit((current) => updateTenantProfile(current, tenant.id, profile))}/>
```

Content/label expression: 

### ACT-developer-console-tsx-15

Component: DeveloperConsole Â· src/developer-console.tsx:15-15

Tag: button; visibility: tab === "Tenants"

```tsx
<button className={tenant.lifecycle === "active" ? "danger-action" : "primary-action"} onClick={() => commit((current) => setTenantLifecycle(current, tenant.id, tenant.lifecycle === "active" ? "disabled" : "active"))}>
```

Content/label expression: {tenant.lifecycle === "active" ? "Disable tenant" : "Restore tenant"}

### ACT-developer-console-tsx-15

Component: DeveloperConsole Â· src/developer-console.tsx:15-15

Tag: select; visibility: tab === "Tenants"

```tsx
<select aria-label="Emulate role" value={role} onChange={(event) => setRole(event.target.value as EmulationRole)}>
```

Content/label expression: {Object.entries(EMULATION_ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}

### ACT-developer-console-tsx-15

Component: DeveloperConsole Â· src/developer-console.tsx:15-15

Tag: button; visibility: tab === "Tenants"

```tsx
<button className="primary-action" disabled={tenant.lifecycle !== "active"} onClick={() => onEmulate(role)}>
```

Content/label expression: <Play size={16}/> Emulate tenant

### ACT-developer-console-tsx-16

Component: DeveloperConsole Â· src/developer-console.tsx:16-16

Tag: input; visibility: tab === "Communications"

```tsx
<input type="checkbox" checked={state.communications[channel].active} onChange={(event) => commit((current) => updateCommunication(current, channel, { active: event.target.checked }))}/>
```

Content/label expression: 

### ACT-developer-console-tsx-16

Component: DeveloperConsole Â· src/developer-console.tsx:16-16

Tag: input; visibility: tab === "Communications"

```tsx
<input value={state.communications[channel].sender} onChange={(event) => commit((current) => updateCommunication(current, channel, { sender: event.target.value }))}/>
```

Content/label expression: 

### ACT-developer-console-tsx-16

Component: DeveloperConsole Â· src/developer-console.tsx:16-16

Tag: button; visibility: tab === "Communications"

```tsx
<button className="primary-action" onClick={() => test(channel)}>
```

Content/label expression: Send simulated test

### FORM-developer-console-tsx-21

Component: TenantCreate Â· src/developer-console.tsx:21-21

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="inline-form" onSubmit={submit}>
```

Content/label expression: <input aria-label="New tenant name" value={name} onChange={(event) => setName(event.target.value)} placeholder="New workshop name"/> <button className="primary-action"><Plus size={16}/> Create tenant</button>

### ACT-developer-console-tsx-21

Component: TenantCreate Â· src/developer-console.tsx:21-21

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="New tenant name" value={name} onChange={(event) => setName(event.target.value)} placeholder="New workshop name"/>
```

Content/label expression: 

### ACT-developer-console-tsx-21

Component: TenantCreate Â· src/developer-console.tsx:21-21

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: <Plus size={16}/> Create tenant

### FORM-developer-console-tsx-22

Component: TenantProfileForm Â· src/developer-console.tsx:22-22

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="developer-form" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
```

Content/label expression: <div className="developer-form-grid">{(["name", "brandName", "address", "contactName", "email", "phone", "gstin", "timezone", "currency", "invoicePrefix"] as const).map((key) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<input value={draft[key]} onChange={(event) => change(key, event.target.value)}/></label>)}</div> <button className="primary-action">Save company profile</button>

### ACT-developer-console-tsx-22

Component: TenantProfileForm Â· src/developer-console.tsx:22-22

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={draft[key]} onChange={(event) => change(key, event.target.value)}/>
```

Content/label expression: 

### ACT-developer-console-tsx-22

Component: TenantProfileForm Â· src/developer-console.tsx:22-22

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save company profile

### FORM-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="desk-panel developer-form" onSubmit={(event) => { event.preventDefault(); commit((current) => createPlatformCharge(current, { tenantId, description, amount: Number(amount), dueDate })); setDescription(""); setAmount(""); setDueDate(""); }}>
```

Content/label expression: <h2>Quick platform charge</h2> <label>Description<input value={description} onChange={(event) => setDescription(event.target.value)}/></label> <label>Amount<input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)}/></label> <label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)}/></label> <button className="primary-action">Create charge</button>

### ACT-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={description} onChange={(event) => setDescription(event.target.value)}/>
```

Content/label expression: 

### ACT-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)}/>
```

Content/label expression: 

### ACT-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)}/>
```

Content/label expression: 

### ACT-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Create charge

### ACT-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: input; visibility: charges.length

```tsx
<input aria-label={`Payment for ${charge.description}`} type="number" min="1" placeholder="Payment amount" value={payment[charge.id] ?? ""} onChange={(event) => setPayment({ ...payment, [charge.id]: event.target.value })}/>
```

Content/label expression: 

### ACT-developer-console-tsx-23

Component: Billing Â· src/developer-console.tsx:23-23

Tag: button; visibility: charges.length

```tsx
<button onClick={() => { const value = Number(payment[charge.id]); if (value > 0) { commit((current) => recordPlatformPayment(current, charge.id, value)); setPayment({ ...payment, [charge.id]: "" }); } }}>
```

Content/label expression: Record payment

### ACT-document-download-tsx-26

Component: DocumentDownloadButton Â· src/document-download.tsx:26-26

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className={className} disabled={status === "preparing"} aria-busy={status === "preparing"} onClick={(event) => { event.stopPropagation(); void download(); }}>
```

Content/label expression: <Download size={15} /> {status === "preparing" ? "Preparing…" : status === "done" ? "Downloaded ✓" : label ?? "Download PDF"}

### ACT-document-download-tsx-26

Component: DocumentDownloadButton Â· src/document-download.tsx:26-26

Tag: button; visibility: showPrint

```tsx
<button type="button" className="workflow-action action-secondary document-print" onClick={(event) => { event.stopPropagation(); print(); }}>
```

Content/label expression: <Printer size={15} /> Print

### STATE-document-download-tsx-26

Component: DocumentDownloadButton Â· src/document-download.tsx:26-26

Tag: span; visibility: status === "error"

```tsx
<span className="document-error" role="alert">
```

Content/label expression: {errorMessage}

### ACT-job-picker-tsx-22

Component: JobPicker Â· src/job-picker.tsx:22-22

Tag: input; visibility: showJobResults

```tsx
<input type="search" aria-label={`${label} search`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job, vehicle, customer or mobile" />
```

Content/label expression: 

### ACT-job-picker-tsx-22

Component: JobPicker Â· src/job-picker.tsx:22-22

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`${label} Month-Year filter`} value={period.monthYear} onChange={(event) => setPeriod({ monthYear: event.target.value })}>
```

Content/label expression: <option value="ALL">All months</option> {availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}

### ACT-job-picker-tsx-22

Component: JobPicker Â· src/job-picker.tsx:22-22

Tag: select; visibility: showJobResults

```tsx
<select aria-label="Job results" value={selectedJobId ?? ""} onChange={(event) => onSelect(event.target.value ? Number(event.target.value) : undefined)}>
```

Content/label expression: <option value="">Choose a job</option> {options.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}</option>)}

### ACT-job-picker-tsx-22

Component: JobPicker Â· src/job-picker.tsx:22-22

Tag: FilterClearButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<FilterClearButton onClick={reset} label="Clear filters" />
```

Content/label expression: 

### STATE-job-picker-tsx-22

Component: JobPicker Â· src/job-picker.tsx:22-22

Tag: p; visibility: showJobResults && query && options.length === 0

```tsx
<p className="job-picker-empty" role="status">
```

Content/label expression: No matching jobs

### FORM-job-sheet-ui-tsx-18

Component: EstimatedDeliveryRow Â· src/job-sheet-ui.tsx:18-22

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="info-row" onSubmit={(event) => {
        event.preventDefault();
        setError("");
        mutate((db) => updateEstimatedDeliveryForActor(db, view.job.id, actor.id, date), setError);
      }}>
```

Content/label expression:  <label htmlFor={`job-delivery-date-${view.job.id}`}>Estimated Delivery Date</label> <div className="job-sheet-delivery-actions"> <input id={`job-delivery-date-${view.job.id}`} type="date" value={date} onChange={(event) => setDate(event.target.value)} /> <button type="submit" className="primary-action">Save</button> </div> 

### ACT-job-sheet-ui-tsx-25

Component: EstimatedDeliveryRow Â· src/job-sheet-ui.tsx:25-25

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input id={`job-delivery-date-${view.job.id}`} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
```

Content/label expression: 

### ACT-job-sheet-ui-tsx-26

Component: EstimatedDeliveryRow Â· src/job-sheet-ui.tsx:26-26

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="submit" className="primary-action">
```

Content/label expression: Save

### STATE-job-sheet-ui-tsx-29

Component: EstimatedDeliveryRow Â· src/job-sheet-ui.tsx:29-29

Tag: p; visibility: error

```tsx
<p role="alert" className="form-error">
```

Content/label expression: {error}

### ACT-job-sheet-ui-tsx-37

Component: DamageDiagram Â· src/job-sheet-ui.tsx:37-40

Tag: svg; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<svg viewBox="0 0 100 200" role="img" aria-label="Vehicle damage diagram, top view" onClick={onAdd ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onAdd(((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100);
      } : undefined}>
```

Content/label expression:  <rect x="18" y="8" width="64" height="184" rx="26" className="damage-body" /> <rect x="26" y="40" width="48" height="34" rx="6" className="damage-glass" /> <rect x="26" y="128" width="48" height="26" rx="6" className="damage-glass" /> <line x1="18" y1="100" x2="82" y2="100" className="damage-body-line" /> {marks.filter((mark) => !mark.view).map((mark) => ( <g key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x} ${mark.y * 2})`} onClick={(event) => { event.stopPropagation(); onRemove?.(mark.id); }}> <circle r="5" /> <text textAnchor="middle" dy="2.5">{mark.id}</text> </g> ))} 

### ACT-job-sheet-ui-tsx-46

Component: DamageDiagram Â· src/job-sheet-ui.tsx:46-46

Tag: g; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<g key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x} ${mark.y * 2})`} onClick={(event) => { event.stopPropagation(); onRemove?.(mark.id); }}>
```

Content/label expression:  <circle r="5" /> <text textAnchor="middle" dy="2.5">{mark.id}</text> 

### FORM-job-sheet-ui-tsx-88

Component: JobSheetSection Â· src/job-sheet-ui.tsx:88-88

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form onSubmit={(event) => { event.preventDefault(); setError(""); mutate((db) => updateJobSheetForActor(db, view.job.id, actor.id, draft), setError); }}>
```

Content/label expression:  <div className="form-grid"> <label>Service Type<select value={draft.service_type} onChange={set("service_type")}><option value="">—</option>{SERVICE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label> <label>Pickup / Drop<select value={draft.pickup_drop} onChange={set("pickup_drop")}><option value="">—</option>{PICKUP_DROP_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label> <label>Estimated Delivery Date<input type="date" value={draft.estimated_delivery} onChange={set("estimated_delivery")} /></label> <label>Fuel<select value={draft.fuel} onChange={set("fuel")}>{[...new Set([draft.fuel, ...FUEL_LEVELS])].filter(Boolean).map((item) => <option key={item}>{item}</option>)}</select></label> <label>Accessories<input value={draft.accessories} onChange={set("accessories")} /></label> <label>Engine Number<input value={draft.engine_no} onChange={set("engine_no")} /></label> </div> <label>Address<input value={draft.address} onChange={set("address")} /></label> <button className="primary-action">Save Job Sheet</button> {error && <p role="alert" className="form-error">{error}</p>} 

### ACT-job-sheet-ui-tsx-90

Component: JobSheetSection Â· src/job-sheet-ui.tsx:90-90

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={draft.service_type} onChange={set("service_type")}>
```

Content/label expression: <option value="">—</option> {SERVICE_TYPES.map((item) => <option key={item}>{item}</option>)}

### ACT-job-sheet-ui-tsx-91

Component: JobSheetSection Â· src/job-sheet-ui.tsx:91-91

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={draft.pickup_drop} onChange={set("pickup_drop")}>
```

Content/label expression: <option value="">—</option> {PICKUP_DROP_OPTIONS.map((item) => <option key={item}>{item}</option>)}

### ACT-job-sheet-ui-tsx-92

Component: JobSheetSection Â· src/job-sheet-ui.tsx:92-92

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="date" value={draft.estimated_delivery} onChange={set("estimated_delivery")} />
```

Content/label expression: 

### ACT-job-sheet-ui-tsx-93

Component: JobSheetSection Â· src/job-sheet-ui.tsx:93-93

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={draft.fuel} onChange={set("fuel")}>
```

Content/label expression: {[...new Set([draft.fuel, ...FUEL_LEVELS])].filter(Boolean).map((item) => <option key={item}>{item}</option>)}

### ACT-job-sheet-ui-tsx-94

Component: JobSheetSection Â· src/job-sheet-ui.tsx:94-94

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={draft.accessories} onChange={set("accessories")} />
```

Content/label expression: 

### ACT-job-sheet-ui-tsx-95

Component: JobSheetSection Â· src/job-sheet-ui.tsx:95-95

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={draft.engine_no} onChange={set("engine_no")} />
```

Content/label expression: 

### ACT-job-sheet-ui-tsx-97

Component: JobSheetSection Â· src/job-sheet-ui.tsx:97-97

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={draft.address} onChange={set("address")} />
```

Content/label expression: 

### ACT-job-sheet-ui-tsx-98

Component: JobSheetSection Â· src/job-sheet-ui.tsx:98-98

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action">
```

Content/label expression: Save Job Sheet

### STATE-job-sheet-ui-tsx-99

Component: JobSheetSection Â· src/job-sheet-ui.tsx:99-99

Tag: p; visibility: error

```tsx
<p role="alert" className="form-error">
```

Content/label expression: {error}

### ACT-local-sales-tsx-28

Component: LocalSalesWorkspace Â· src/local-sales.tsx:28-28

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<DownloadMenu report={salesLeadsReport(filteredLeads, leadCreatedMonth, leadQuery, leadStage)} />
```

Content/label expression: 

### ACT-local-sales-tsx-28

Component: LocalSalesWorkspace Â· src/local-sales.tsx:28-28

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={() => { setSelectedLead(null); setLeadDialog("add"); }}>
```

Content/label expression: Add Lead

### STATE-local-sales-tsx-28

Component: LocalSalesWorkspace Â· src/local-sales.tsx:28-28

Tag: p; visibility: error

```tsx
<p className="api-error" role="alert">
```

Content/label expression: {error}

### ACT-local-sales-tsx-28

Component: LocalSalesWorkspace Â· src/local-sales.tsx:28-28

Tag: SalesLeadFilterBar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<SalesLeadFilterBar query={leadQuery} stage={leadStage} createdMonth={leadCreatedMonth} onQueryChange={setLeadQuery} onStageChange={setLeadStage} onCreatedMonthChange={setLeadCreatedMonth} onClear={() => { setLeadQuery(""); setLeadStage(""); setLeadCreatedMonth(""); }} />
```

Content/label expression: 

### ACT-local-sales-tsx-28

Component: LocalSalesWorkspace Â· src/local-sales.tsx:28-28

Tag: SalesLeadDialog; visibility: leadDialog

```tsx
<SalesLeadDialog lead={selectedLead ? leadDraft(remoteLead(selectedLead)) : blankLeadDraft} editing={leadDialog === "edit"} onSave={saveLead} onClose={closeLeadDialog} />
```

Content/label expression: 

### ACT-local-sales-tsx-28

Component: LocalSalesWorkspace Â· src/local-sales.tsx:28-28

Tag: SalesLeadRegister; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<SalesLeadRegister leads={filteredLeads} onEdit={(lead) => { const localLead = state.sales_leads.find((item) => item.id === lead.id); if (localLead) { setSelectedLead(localLead); setLeadDialog("edit"); } }} onSave={saveInlineLead} />
```

Content/label expression: 

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={() => setEditor("new")}>
```

Content/label expression: New Quotation

### STATE-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: p; visibility: error

```tsx
<p className="api-error" role="alert">
```

Content/label expression: {error}

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: QuotationEditorDialog; visibility: editor

```tsx
<QuotationEditorDialog leads={leads} templates={templates} tasks={tasks} quotation={editor === "new" ? undefined : editor} busy={false} onClose={() => setEditor(null)} onSave={saveQuotation} />
```

Content/label expression: 

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: QuotationDetailsDialog; visibility: details

```tsx
<QuotationDetailsDialog quotation={details} lead={leads.find((lead) => lead.id === details.leadId)} templateName={templates.find((template) => template.id === details.templateId)?.name ?? details.templateId} loadDocument={() => Promise.resolve(localDocument(details, leads.find((lead) => lead.id === details.leadId)))} onClose={() => setDetails(null)} />
```

Content/label expression: 

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: QuotationFilterBar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationFilterBar query={query} status={quotationStatus} createdDate={createdDate} createdMonth={createdMonth} onQueryChange={setQuery} onStatusChange={setQuotationStatus} onCreatedDateChange={setCreatedDate} onCreatedMonthChange={setCreatedMonth} onClear={() => { setQuery(""); setQuotationStatus(""); setCreatedDate(""); setCreatedMonth(""); }} />
```

Content/label expression: 

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="billing-table-action" onClick={() => setDetails(item)}>
```

Content/label expression: <Eye size={15} /> View details

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: button; visibility: item.status === "DRAFT"

```tsx
<button type="button" className="billing-table-action" onClick={() => setEditor(item)}>
```

Content/label expression: <Pencil size={15} /> Edit

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: QuotationOutputControls; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationOutputControls className="quotation-document-actions" buttonClassName="billing-table-action" loadDocument={() => Promise.resolve(localDocument(item, lead))} onError={setError} />
```

Content/label expression: 

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="billing-table-action billing-table-action-primary" disabled={["ACCEPTED", "REJECTED", "EXPIRED"].includes(item.status)} onClick={() => mutate((db) => setSalesQuotationStatus(db, item.id, "SENT"), setError)}>
```

Content/label expression: <Send size={15} /> Mark sent

### ACT-local-sales-tsx-31

Component: LocalSalesWorkspace Â· src/local-sales.tsx:31-31

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="billing-table-action" disabled={item.status !== "SENT"} onClick={() => mutate((db) => setSalesQuotationStatus(db, item.id, "ACCEPTED"), setError)}>
```

Content/label expression: <Check size={15} /> Accept

### ACT-materials-ui-tsx-20

Component: InventoryPicker Â· src/materials-ui.tsx:20-20

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={label} role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && options[activeIndex] ? `${listId}-${options[activeIndex]!.id}` : open && allOptionLabel ? `${listId}-all` : undefined} aria-autocomplete="list" disabled={disabled} value={query} placeholder="Type to search inventory" onFocus={() => { setOpen(true); setActiveIndex(0); }} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.min(index + 1, Math.max(options.length - 1, 0))); } else if (event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.max(index - 1, 0)); } else if (event.key === "Enter" && open && options[activeIndex] !== undefined) { event.preventDefault(); chooseOption(options[activeIndex]); } else if (event.key === "Enter" && open && allOptionLabel && activeIndex === 0) { event.preventDefault(); chooseOption(undefined); } else if (event.key === "Escape") setOpen(false); }} />
```

Content/label expression: 

### ACT-materials-ui-tsx-21

Component: InventoryPicker Â· src/materials-ui.tsx:21-21

Tag: button; visibility: open

```tsx
<button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseOption(option)}>
```

Content/label expression: {option ? pickerLabel(option) : allOptionLabel}

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: InventoryPicker; visibility: editing

```tsx
<InventoryPicker inventory={inventory} value={itemId} onChange={setItemId} label="Item" />
```

Content/label expression: 

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: input; visibility: editing

```tsx
<input aria-label="Qty" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))} />
```

Content/label expression: 

### STATE-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: p; visibility: warning

```tsx
<p className="permission-note" role="status">
```

Content/label expression: {warning}

### STATE-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: input; visibility: issued; editing

```tsx
<input aria-label="Edit request note" placeholder="Note required" value={note} onChange={(event) => setNote(event.target.value)} />
```

Content/label expression: 

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: button; visibility: editing

```tsx
<button type="button" className="grid-action" onClick={() => { const ok = run((db) => issued ? editIssuedMaterialRowForActor(db, row.id, actor.id, itemId, qty, note) : draft ? updateMaterialRowForActor(db, row.id, actor.id, itemId, qty) : reRequestMaterialRowForActor(db, row.id, actor.id, itemId, qty)); if (ok) setEditing(false); }}>
```

Content/label expression: Save

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: button; visibility: editing

```tsx
<button type="button" className="grid-action" onClick={() => setEditing(false)}>
```

Content/label expression: Cancel

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: button; visibility: actions.includes("request"); editing

```tsx
<button type="button" className="grid-action" onClick={() => run((db) => requestMaterialRowForActor(db, row.id, actor.id))}>
```

Content/label expression: Request Item

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: button; visibility: (actions.includes("edit") \|\| actions.includes("re-request") \|\| issued); editing

```tsx
<button type="button" className="grid-action" onClick={() => setEditing(true)}>
```

Content/label expression: Edit Request

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: button; visibility: actions.includes("cancel"); editing

```tsx
<button type="button" className="grid-action grid-action-danger" onClick={() => run((db) => cancelMaterialRowForActor(db, row.id, actor.id))}>
```

Content/label expression: Cancel Request

### ACT-materials-ui-tsx-29

Component: MaterialRow Â· src/materials-ui.tsx:29-29

Tag: button; visibility: actions.includes("delete"); editing

```tsx
<button type="button" className="grid-action grid-action-danger" onClick={() => run((db) => deleteMaterialRowForActor(db, row.id, actor.id))}>
```

Content/label expression: Delete

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: InventoryPicker; visibility: !editable

```tsx
<InventoryPicker inventory={inventory} value={itemId} onChange={setItemId} label="Item" />
```

Content/label expression: 

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: input; visibility: !editable

```tsx
<input aria-label="Qty" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))} />
```

Content/label expression: 

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: button; visibility: !editable

```tsx
<button type="button" className="primary-action" onClick={add}>
```

Content/label expression: Add Row

### FORM-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: form; visibility: !editable

```tsx
<form className="material-new-item" onSubmit={(event) => { event.preventDefault(); requestNew(); }}>
```

Content/label expression: <h5>Request New Item</h5> <label>Item name<input required value={newItem.item_name} onChange={(event) => setNewItem({ ...newItem, item_name: event.target.value })} /></label> <label>Quantity<input required type="number" min="0.01" step="0.01" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: Number(event.target.value) })} /></label> <label>Unit<input required value={newItem.unit} onChange={(event) => setNewItem({ ...newItem, unit: event.target.value })} /></label> <button className="secondary-action">Request New Item</button>

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: input; visibility: !editable

```tsx
<input required value={newItem.item_name} onChange={(event) => setNewItem({ ...newItem, item_name: event.target.value })} />
```

Content/label expression: 

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: input; visibility: !editable

```tsx
<input required type="number" min="0.01" step="0.01" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: input; visibility: !editable

```tsx
<input required value={newItem.unit} onChange={(event) => setNewItem({ ...newItem, unit: event.target.value })} />
```

Content/label expression: 

### ACT-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: button; visibility: !editable

```tsx
<button className="secondary-action">
```

Content/label expression: Request New Item

### STATE-materials-ui-tsx-41

Component: JobMaterialsPanel Â· src/materials-ui.tsx:41-41

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-pagination-toolbar-tsx-24

Component: PaginationToolbar Â· src/pagination-toolbar.tsx:24-24

Tag: PageSizeSelect; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<PageSizeSelect ariaLabel={pageSizeAriaLabel} value={pageSize} onChange={onPageSizeChange} />
```

Content/label expression: 

### ACT-pagination-toolbar-tsx-25

Component: PaginationToolbar Â· src/pagination-toolbar.tsx:25-25

Tag: ResultPagination; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<ResultPagination page={page} pageCount={pageCount} onChange={onPageChange} />
```

Content/label expression: 

### ACT-pagination-toolbar-tsx-35

Component: ResultPagination Â· src/pagination-toolbar.tsx:35-35

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" aria-label="First page" title="First page" disabled={atFirstPage} onClick={() => onChange(1)}>
```

Content/label expression: <ChevronFirst aria-hidden="true" size={18} />

### ACT-pagination-toolbar-tsx-36

Component: ResultPagination Â· src/pagination-toolbar.tsx:36-36

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" aria-label="Previous page" title="Previous page" disabled={atFirstPage} onClick={() => onChange(page - 1)}>
```

Content/label expression: <ChevronLeft aria-hidden="true" size={18} />

### ACT-pagination-toolbar-tsx-41

Component: ResultPagination Â· src/pagination-toolbar.tsx:41-41

Tag: button; visibility: token === "ellipsis"

```tsx
<button type="button" key={token} aria-label={`Page ${token}`} aria-current={page === token ? "page" : undefined} className={page === token ? "active" : ""} onClick={() => onChange(token)}>
```

Content/label expression: {token}

### ACT-pagination-toolbar-tsx-43

Component: ResultPagination Â· src/pagination-toolbar.tsx:43-43

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" aria-label="Next page" title="Next page" disabled={atLastPage} onClick={() => onChange(page + 1)}>
```

Content/label expression: <ChevronRight aria-hidden="true" size={18} />

### ACT-pagination-toolbar-tsx-44

Component: ResultPagination Â· src/pagination-toolbar.tsx:44-44

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" aria-label="Last page" title="Last page" disabled={atLastPage} onClick={() => onChange(pageCount)}>
```

Content/label expression: <ChevronLast aria-hidden="true" size={18} />

### ACT-quotation-dialog-tsx-26

Component: CatalogDescriptionCombobox Â· src/quotation-dialog.tsx:26-26

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input required role="combobox" aria-label={`Catalog description for line ${lineNumber}`} aria-expanded={open} aria-controls={listId} aria-activedescendant={open && matches[activeIndex] ? `${listId}-${matches[activeIndex].id}` : undefined} aria-autocomplete="list" placeholder="Type a description or search catalog" value={value} onFocus={openOptions} onClick={() => !open && openOptions()} onChange={(event) => { onChange(event.target.value); openOptions(); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={(event) => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActiveIndex((index) => event.key === "ArrowDown" ? Math.min(index + 1, Math.max(matches.length - 1, 0)) : Math.max(index - 1, 0)); } else if (event.key === "Enter" && open && matches[activeIndex]) { event.preventDefault(); choose(matches[activeIndex]); } else if (event.key === "Escape") { event.preventDefault(); setOpen(false); } }} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-27

Component: CatalogDescriptionCombobox Â· src/quotation-dialog.tsx:27-27

Tag: button; visibility: matches.length; open

```tsx
<button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(task)}>
```

Content/label expression: {task.name} · {money(task.rate)} · GST {task.gstRate} %

### STATE-quotation-dialog-tsx-27

Component: CatalogDescriptionCombobox Â· src/quotation-dialog.tsx:27-27

Tag: li; visibility: matches.length; open

```tsx
<li className="picker-stock" role="status">
```

Content/label expression: No catalog matches — your description will be saved as entered.

### STATE-quotation-dialog-tsx-41

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:41-41

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog wide title={quotation ? "Edit quotation" : "New quotation"} subtitle={quotation ? `${quotation.quotationNo} · Draft` : "Create a frozen quotation document"} onClose={onClose} className="dialog-document-editor quotation-dialog" footer={<button className="primary-action" type="submit" form="quotation-editor-form" disabled={busy}>{quotation ? "Save quotation" : "Create quotation"}</button>}>
```

Content/label expression: <form id="quotation-editor-form" className="billing-dialog-form quotation-editor-form" onSubmit={submit}> <div className="form-grid"><label>Lead<select data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}><option value={0}>Select lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}</select></label><label>Valid until<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} /></label><label>Template<select required value={templateId} onChange={(event) => selectTemplate(event.target.value)}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}</select></label><label>Discount<input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label></div> <label className="quotation-notes">Customer notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label> <div className="estimate-items"><div className="line-items-header"><strong>Line items</strong><button type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus size={16} />Add Item</button></div>{catalogError && <p className="error-text" role="alert">Service catalog unavailable: {catalogError}</p>}<div className="estimate-item estimate-item-heading quotation-item-heading"><span>Catalog description</span><span>Quantity</span><span>Rate</span><span>GST rate</span><span>Action</span></div>{lines.map((line, index) => <div className="estimate-item quotation-item" key={line.id ?? index}><CatalogDescriptionCombobox lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)} /><input aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })} /><input aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })} /><input aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })} /><button type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}>Remove</button></div>)}</div> <QuotationTotals subtotal={amount.subtotal} discount={Number(discount) \|\| 0} gst={amount.gst} total={amount.total} /> </form>

### ACT-quotation-dialog-tsx-41

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:41-41

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit" form="quotation-editor-form" disabled={busy}>
```

Content/label expression: {quotation ? "Save quotation" : "Create quotation"}

### FORM-quotation-dialog-tsx-41

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:41-41

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id="quotation-editor-form" className="billing-dialog-form quotation-editor-form" onSubmit={submit}>
```

Content/label expression:  <div className="form-grid"><label>Lead<select data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}><option value={0}>Select lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}</select></label><label>Valid until<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} /></label><label>Template<select required value={templateId} onChange={(event) => selectTemplate(event.target.value)}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}</select></label><label>Discount<input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label></div> <label className="quotation-notes">Customer notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label> <div className="estimate-items"><div className="line-items-header"><strong>Line items</strong><button type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus size={16} />Add Item</button></div>{catalogError && <p className="error-text" role="alert">Service catalog unavailable: {catalogError}</p>}<div className="estimate-item estimate-item-heading quotation-item-heading"><span>Catalog description</span><span>Quantity</span><span>Rate</span><span>GST rate</span><span>Action</span></div>{lines.map((line, index) => <div className="estimate-item quotation-item" key={line.id ?? index}><CatalogDescriptionCombobox lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)} /><input aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })} /><input aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })} /><input aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })} /><button type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}>Remove</button></div>)}</div> <QuotationTotals subtotal={amount.subtotal} discount={Number(discount) \|\| 0} gst={amount.gst} total={amount.total} /> 

### ACT-quotation-dialog-tsx-42

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:42-42

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select data-dialog-initial-focus required value={leadId} onChange={(event) => setLeadId(Number(event.target.value))}>
```

Content/label expression: <option value={0}>Select lead</option> {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.displayName} · {lead.phone}</option>)}

### ACT-quotation-dialog-tsx-42

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:42-42

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-42

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:42-42

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select required value={templateId} onChange={(event) => selectTemplate(event.target.value)}>
```

Content/label expression: {templates.map((template) => <option key={template.id} value={template.id}>{template.name}{template.active ? " (Active)" : ""}</option>)}

### ACT-quotation-dialog-tsx-42

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:42-42

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-43

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:43-43

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="add-line-item" onClick={() => setLines((current) => [...current, emptyLine()])}>
```

Content/label expression: <Plus size={16} /> Add Item

### STATE-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: p; visibility: catalogError

```tsx
<p className="error-text" role="alert">
```

Content/label expression: Service catalog unavailable: {catalogError}

### ACT-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: CatalogDescriptionCombobox; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<CatalogDescriptionCombobox lineNumber={index + 1} value={line.description} tasks={tasks} onChange={(description) => changeLine(index, { description })} onSelect={(task) => selectTask(index, task)} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Quantity for line ${index + 1}`} type="number" min="0.001" step="0.001" required value={line.quantity} onChange={(event) => changeLine(index, { quantity: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Rate for line ${index + 1}`} type="number" min="0" required value={line.rate} onChange={(event) => changeLine(index, { rate: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`GST rate for line ${index + 1}`} type="number" min="0" max="100" required value={line.gstRate} onChange={(event) => changeLine(index, { gstRate: Number(event.target.value) })} />
```

Content/label expression: 

### ACT-quotation-dialog-tsx-44

Component: QuotationEditorDialog Â· src/quotation-dialog.tsx:44-44

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="link-action line-remove" aria-label={`Remove quotation item ${index + 1}`} onClick={() => setLines((current) => current.length > 1 ? current.filter((_, lineIndex) => lineIndex !== index) : [emptyLine()])}>
```

Content/label expression: Remove

### ACT-quotation-dialog-tsx-51

Component: QuotationOutputControls Â· src/quotation-dialog.tsx:51-51

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className={buttonClassName} disabled={Boolean(busy)} aria-busy={Boolean(busy)} onClick={() => void run("download")}>
```

Content/label expression: <Download size={15} /> {busy === "download" ? "Generating PDF…" : "Download PDF"}

### ACT-quotation-dialog-tsx-51

Component: QuotationOutputControls Â· src/quotation-dialog.tsx:51-51

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className={buttonClassName} disabled={Boolean(busy)} aria-busy={Boolean(busy)} onClick={() => void run("print")}>
```

Content/label expression: <Printer size={15} /> {busy === "print" ? "Preparing print…" : "Print"}

### ACT-quotation-dialog-tsx-52

Component: QuotationDownloadButton Â· src/quotation-dialog.tsx:52-52

Tag: QuotationOutputControls; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationOutputControls className={className} buttonClassName={buttonClassName} loadDocument={() => salesApi.document(config, quotationId)} onError={onError} />
```

Content/label expression: 

### STATE-quotation-dialog-tsx-53

Component: QuotationDetailsDialog Â· src/quotation-dialog.tsx:53-53

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog wide title={`Quotation ${quotation.quotationNo}`} subtitle="Read-only frozen quotation" onClose={onClose} className="dialog-document-editor quotation-dialog" footer={<QuotationOutputControls loadDocument={document} onError={setError} className="quotation-output-controls" buttonClassName="billing-table-action" />}>
```

Content/label expression: <div className="quotation-details-content">{error && <p className="error-text" role="alert">{error}</p>}<div className="form-grid"><p><strong>Customer</strong><br />{lead?.displayName ?? quotation.leadId}<br />{lead?.phone}</p><p><strong>Status</strong><br />{quotation.status}</p><p><strong>Valid until</strong><br />{quotation.validUntil ?? "—"}</p><p><strong>Template</strong><br />{templateName}</p></div><div className="table-wrap"><table aria-label="Quotation details"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>GST</th><th>Amount</th></tr></thead><tbody>{quotation.lines.map((line, index) => <tr key={line.id ?? index}><td>{line.description}</td><td>{line.quantity}</td><td>{money(line.rate)}</td><td>{line.gstRate}%</td><td>{money(line.quantity * line.rate)}</td></tr>)}</tbody></table></div>{quotation.customerNotes && <section className="quotation-notes"><strong>Notes</strong><p>{quotation.customerNotes}</p></section>}<QuotationTotals subtotal={quotation.subtotal} discount={quotation.discount} gst={quotation.gstAmount} total={quotation.total} /></div>

### ACT-quotation-dialog-tsx-53

Component: QuotationDetailsDialog Â· src/quotation-dialog.tsx:53-53

Tag: QuotationOutputControls; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationOutputControls loadDocument={document} onError={setError} className="quotation-output-controls" buttonClassName="billing-table-action" />
```

Content/label expression: 

### STATE-quotation-dialog-tsx-53

Component: QuotationDetailsDialog Â· src/quotation-dialog.tsx:53-53

Tag: p; visibility: error

```tsx
<p className="error-text" role="alert">
```

Content/label expression: {error}

### ACT-quotation-filter-bar-tsx-4

Component: QuotationFilterBar Â· src/quotation-filter-bar.tsx:4-4

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Search quotations" value={query} disabled={busy} onChange={(event) => onQueryChange(event.target.value)} placeholder="Quotation number or lead" />
```

Content/label expression: 

### ACT-quotation-filter-bar-tsx-4

Component: QuotationFilterBar Â· src/quotation-filter-bar.tsx:4-4

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Quotation created date" type="date" value={createdDate} disabled={busy} onChange={(event) => onCreatedDateChange(event.target.value)} />
```

Content/label expression: 

### ACT-quotation-filter-bar-tsx-4

Component: QuotationFilterBar Â· src/quotation-filter-bar.tsx:4-4

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Quotation created month/year" type="month" value={createdMonth} disabled={busy} onChange={(event) => onCreatedMonthChange(event.target.value)} />
```

Content/label expression: 

### ACT-quotation-filter-bar-tsx-4

Component: QuotationFilterBar Â· src/quotation-filter-bar.tsx:4-4

Tag: FilterClearButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<FilterClearButton onClick={onClear} disabled={busy} />
```

Content/label expression: 

### STATE-remote-finance-tsx-75

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:75-75

Tag: div; visibility: error

```tsx
<div className="api-error" role="alert">
```

Content/label expression: {error} <button onClick={() => void refresh()}>Retry</button>

### ACT-remote-finance-tsx-75

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:75-75

Tag: button; visibility: error

```tsx
<button onClick={() => void refresh()}>
```

Content/label expression: Retry

### ACT-remote-finance-tsx-76

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:76-76

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={selected?.id ?? 0} onChange={(event) => setSelectedId(Number(event.target.value))}>
```

Content/label expression: <option value={0}>Select job</option> {jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.status}</option>)}

### ACT-remote-finance-tsx-77

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:77-77

Tag: button; visibility: mode === "invoice"

```tsx
<button className="primary-action" disabled={busy || Boolean(active) || (requiresInvoiceReplacement(invoices) && !replacesInvoiceId)} onClick={issue}>
```

Content/label expression: {replacesInvoiceId ? "Issue replacement invoice" : "Issue approved estimate"}

### ACT-remote-finance-tsx-77

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:77-77

Tag: button; visibility: replacesInvoiceId; mode === "invoice"

```tsx
<button disabled={busy} onClick={() => setReplacesInvoiceId(undefined)}>
```

Content/label expression: Cancel replacement

### ACT-remote-finance-tsx-77

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:77-77

Tag: InvoiceRows; visibility: mode === "invoice"

```tsx
<InvoiceRows invoices={invoices} busy={busy} onDownload={download} onVoid={voidInvoice} onReplace={prepareReplacement} onCreditRefund={creditAndRefund} />
```

Content/label expression: 

### ACT-remote-finance-tsx-78

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:78-78

Tag: InvoiceRows; visibility: mode === "payment"

```tsx
<InvoiceRows invoices={invoices} busy={busy} onDownload={download} />
```

Content/label expression: 

### ACT-remote-finance-tsx-78

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:78-78

Tag: input; visibility: active; mode === "payment"

```tsx
<input min="0.01" type="number" value={payAmount} onChange={(event) => setPayAmount(event.target.value)} />
```

Content/label expression: 

### ACT-remote-finance-tsx-78

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:78-78

Tag: select; visibility: active; mode === "payment"

```tsx
<select value={method} onChange={(event) => setMethod(event.target.value as typeof method)}>
```

Content/label expression: {["upi", "cash", "card", "bank_transfer", "other"].map((value) => <option key={value}>{value}</option>)}

### ACT-remote-finance-tsx-78

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:78-78

Tag: input; visibility: active; mode === "payment"

```tsx
<input value={reference} onChange={(event) => setReference(event.target.value)} />
```

Content/label expression: 

### ACT-remote-finance-tsx-78

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:78-78

Tag: button; visibility: active; mode === "payment"

```tsx
<button className="primary-action" disabled={busy || active.status === "SETTLED"} onClick={pay}>
```

Content/label expression: Record payment

### ACT-remote-finance-tsx-78

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:78-78

Tag: button; visibility: mode === "payment"

```tsx
<button disabled={busy} onClick={() => void download(payment.contentPath, payment.receiptNumber)}>
```

Content/label expression: Download

### ACT-remote-finance-tsx-79

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:79-79

Tag: button; visibility: delivery; mode === "delivery"

```tsx
<button disabled={busy} onClick={() => void download(delivery.contentPath, delivery.gatePassNumber)}>
```

Content/label expression: Download gate pass

### ACT-remote-finance-tsx-79

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:79-79

Tag: InvoiceRows; visibility: delivery; mode === "delivery"

```tsx
<InvoiceRows invoices={invoices} busy={busy} onDownload={download} />
```

Content/label expression: 

### ACT-remote-finance-tsx-79

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:79-79

Tag: input; visibility: delivery; mode === "delivery"

```tsx
<input value={deliveredBy} onChange={(event) => setDeliveredBy(event.target.value)} />
```

Content/label expression: 

### ACT-remote-finance-tsx-79

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:79-79

Tag: input; visibility: delivery; mode === "delivery"

```tsx
<input min="0" type="number" value={finalOdometer} onChange={(event) => setFinalOdometer(event.target.value)} />
```

Content/label expression: 

### ACT-remote-finance-tsx-79

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:79-79

Tag: input; visibility: delivery; mode === "delivery"

```tsx
<input value={acknowledgement} onChange={(event) => setAcknowledgement(event.target.value)} />
```

Content/label expression: 

### ACT-remote-finance-tsx-79

Component: RemoteFinanceWorkspace Â· src/remote-finance.tsx:79-79

Tag: button; visibility: delivery; mode === "delivery"

```tsx
<button className="primary-action" disabled={busy || active?.status !== "SETTLED" || selected?.status !== "COMPLETED"} onClick={handover}>
```

Content/label expression: Issue gate pass & hand over

### ACT-remote-finance-tsx-85

Component: InvoiceRows Â· src/remote-finance.tsx:85-85

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button disabled={busy} onClick={() => void onDownload(invoice.contentPath, invoice.number)}>
```

Content/label expression: Download

### ACT-remote-finance-tsx-85

Component: InvoiceRows Â· src/remote-finance.tsx:85-85

Tag: button; visibility: onVoid && canVoidRemoteInvoice(invoice); (onVoid \|\| onReplace \|\| onCreditRefund)

```tsx
<button className="danger-action" disabled={busy} onClick={() => onVoid(invoice)}>
```

Content/label expression: Void with reason

### ACT-remote-finance-tsx-85

Component: InvoiceRows Â· src/remote-finance.tsx:85-85

Tag: button; visibility: onCreditRefund && (invoice.status === "PARTIAL" \|\| invoice.status === "SETTLED"); (onVoid \|\| onReplace \|\| onCreditRefund)

```tsx
<button className="danger-action" disabled={busy} onClick={() => onCreditRefund(invoice)}>
```

Content/label expression: Credit & refund

### ACT-remote-finance-tsx-85

Component: InvoiceRows Â· src/remote-finance.tsx:85-85

Tag: button; visibility: onReplace && canReplaceRemoteInvoice(invoice, activeExists); (onVoid \|\| onReplace \|\| onCreditRefund)

```tsx
<button disabled={busy} onClick={() => onReplace(invoice)}>
```

Content/label expression: Issue replacement

### STATE-remote-followups-tsx-55

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:55-55

Tag: div; visibility: error

```tsx
<div className="api-error" role="alert">
```

Content/label expression: {error}

### FORM-remote-followups-tsx-56

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:56-56

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="store-filter-grid" onSubmit={search}>
```

Content/label expression: <label className="list-search">Search all records<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, registration, job card, or invoice" /></label> <button className="primary-action" disabled={busy}>Search</button>

### ACT-remote-followups-tsx-56

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:56-56

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer, registration, job card, or invoice" />
```

Content/label expression: 

### ACT-remote-followups-tsx-56

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:56-56

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" disabled={busy}>
```

Content/label expression: Search

### STATE-remote-followups-tsx-64

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:64-64

Tag: div; visibility: error

```tsx
<div className="api-error" role="alert">
```

Content/label expression: {error} <button onClick={() => void refresh()}>Retry</button>

### ACT-remote-followups-tsx-64

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:64-64

Tag: button; visibility: error

```tsx
<button onClick={() => void refresh()}>
```

Content/label expression: Retry

### FORM-remote-followups-tsx-65

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:65-65

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form className="form-grid" onSubmit={editing ? saveEdit : create}>
```

Content/label expression: <h3>{formTitle}</h3> {!editing && <label>Job<select required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}><option value={0}>Select job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.vehicleNo} · {job.customerName}</option>)}</select></label>} <label>Due date<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label> <label>Note<textarea required rows={2} value={note} onChange={(event) => setNote(event.target.value)} /></label> {editing && <label>Outcome<textarea rows={2} value={outcome} onChange={(event) => setOutcome(event.target.value)} /></label>} <div className="action-row"><button className="primary-action" disabled={busy}>{editing ? "Save Follow-up" : "Create Follow-up"}</button>{editing && <button type="button" disabled={busy} onClick={() => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); }}>Cancel</button>}</div> 

### ACT-remote-followups-tsx-66

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:66-66

Tag: select; visibility: !editing

```tsx
<select required value={jobId} onChange={(event) => setJobId(Number(event.target.value))}>
```

Content/label expression: <option value={0}>Select job</option> {jobs.map((job) => <option key={job.id} value={job.id}>{job.jobNo} · {job.vehicleNo} · {job.customerName}</option>)}

### ACT-remote-followups-tsx-67

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:67-67

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
```

Content/label expression: 

### ACT-remote-followups-tsx-68

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:68-68

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea required rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
```

Content/label expression: 

### ACT-remote-followups-tsx-69

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:69-69

Tag: textarea; visibility: editing

```tsx
<textarea rows={2} value={outcome} onChange={(event) => setOutcome(event.target.value)} />
```

Content/label expression: 

### ACT-remote-followups-tsx-70

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:70-70

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" disabled={busy}>
```

Content/label expression: {editing ? "Save Follow-up" : "Create Follow-up"}

### ACT-remote-followups-tsx-70

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:70-70

Tag: button; visibility: editing

```tsx
<button type="button" disabled={busy} onClick={() => { setEditing(undefined); setNote(""); setDueAt(""); setOutcome(""); }}>
```

Content/label expression: Cancel

### ACT-remote-followups-tsx-72

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:72-72

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button disabled={busy} onClick={() => beginEdit(item)}>
```

Content/label expression: Edit

### ACT-remote-followups-tsx-72

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:72-72

Tag: button; visibility: item.status === "OPEN"

```tsx
<button disabled={busy} onClick={() => complete(item)}>
```

Content/label expression: Complete

### ACT-remote-followups-tsx-72

Component: RemoteFollowupsWorkspace Â· src/remote-followups.tsx:72-72

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="grid-action-danger" disabled={busy} onClick={() => archive(item)}>
```

Content/label expression: Archive

### ACT-remote-sales-tsx-28

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:28-28

Tag: DownloadMenu; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<DownloadMenu report={salesLeadsReport(leads, createdMonth, query, stage)} />
```

Content/label expression: 

### ACT-remote-sales-tsx-28

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:28-28

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={() => { setSelectedLead(null); setLeadDialog("add"); }}>
```

Content/label expression: Add Lead

### STATE-remote-sales-tsx-28

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:28-28

Tag: p; visibility: error

```tsx
<p className="api-error" role="alert">
```

Content/label expression: {error}

### ACT-remote-sales-tsx-28

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:28-28

Tag: SalesLeadFilterBar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<SalesLeadFilterBar query={query} stage={stage} createdMonth={createdMonth} busy={busy} onQueryChange={setQuery} onStageChange={setStage} onCreatedMonthChange={setCreatedMonth} onClear={() => { setQuery(""); setStage(""); setCreatedMonth(""); }} />
```

Content/label expression: 

### ACT-remote-sales-tsx-28

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:28-28

Tag: SalesLeadDialog; visibility: leadDialog

```tsx
<SalesLeadDialog lead={selectedLead ? leadDraft(selectedLead) : blankLeadDraft} editing={leadDialog === "edit"} busy={busy} onSave={saveLead} onClose={closeLeadDialog} />
```

Content/label expression: 

### ACT-remote-sales-tsx-28

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:28-28

Tag: SalesLeadRegister; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<SalesLeadRegister leads={leads} busy={busy} onEdit={(lead) => { setSelectedLead(lead); setLeadDialog("edit"); }} onSave={saveInlineLead} />
```

Content/label expression: 

### ACT-remote-sales-tsx-29

Component: RemoteSalesWorkspace Â· src/remote-sales.tsx:29-29

Tag: QuotationWorkspace; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationWorkspace config={config} leads={leads} quotations={quotations} templates={templates} error={error} busy={busy} query={query} onQueryChange={setQuery} createdDate={createdDate} onCreatedDateChange={setCreatedDate} createdMonth={createdMonth} onCreatedMonthChange={setCreatedMonth} run={run} />
```

Content/label expression: 

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" onClick={() => setEditor("new")}>
```

Content/label expression: New Quotation

### STATE-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: p; visibility: (error \|\| documentError)

```tsx
<p className="api-error" role="alert">
```

Content/label expression: {error \|\| documentError}

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: QuotationEditorDialog; visibility: editor

```tsx
<QuotationEditorDialog config={config} leads={leads} templates={templates} quotation={editor === "new" ? undefined : editor} busy={busy} onClose={() => setEditor(null)} onSave={(input) => run(() => editor !== "new" ? salesApi.updateQuotation(config, editor.id, input) : salesApi.createQuotation(config, input), () => setEditor(null))} />
```

Content/label expression: 

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: QuotationDetailsDialog; visibility: details

```tsx
<QuotationDetailsDialog config={config} quotation={details} lead={leads.find((lead) => lead.id === details.leadId)} templateName={templates.find((template) => template.id === details.templateId)?.name ?? details.templateId} onClose={() => setDetails(null)} />
```

Content/label expression: 

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: QuotationFilterBar; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationFilterBar query={query} status={status} createdDate={createdDate} createdMonth={createdMonth} busy={busy} onQueryChange={onQueryChange} onStatusChange={onStatusChange} onCreatedDateChange={onCreatedDateChange} onCreatedMonthChange={onCreatedMonthChange} onClear={clearFilters} />
```

Content/label expression: 

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="billing-table-action" onClick={() => setDetails(item)}>
```

Content/label expression: <Eye size={15} /> View details

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: button; visibility: item.status === "DRAFT"

```tsx
<button type="button" className="billing-table-action" disabled={busy} onClick={() => setEditor(item)}>
```

Content/label expression: <Pencil size={15} /> Edit

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: QuotationDownloadButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<QuotationDownloadButton config={config} quotationId={item.id} className="quotation-document-actions" buttonClassName="billing-table-action" onError={setDocumentError} />
```

Content/label expression: 

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="billing-table-action billing-table-action-primary" disabled={busy || ["ACCEPTED", "REJECTED", "EXPIRED"].includes(item.status)} onClick={() => run(() => salesApi.status(config, item.id, "SENT"))}>
```

Content/label expression: <Send size={15} /> Mark sent

### ACT-remote-sales-tsx-40

Component: QuotationWorkspace Â· src/remote-sales.tsx:40-40

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="billing-table-action" disabled={busy || item.status !== "SENT"} onClick={() => run(() => salesApi.status(config, item.id, "ACCEPTED"))}>
```

Content/label expression: <Check size={15} /> Accept

### STATE-sales-lead-dialog-tsx-37

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:37-37

Tag: Dialog; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Dialog wide title={editing ? "Edit Lead" : "Add Lead"} onClose={onClose} footer={<button className="primary-action" type="submit" form={formId} disabled={busy}>{editing ? "Save Changes" : "Save Lead"}</button>}>
```

Content/label expression:  <form id={formId} className="form-grid" onSubmit={save}> <label>Name<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} /></label> <label>Phone<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} /></label> <label>Company<input disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })} /></label> <Switch label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })} /> <label>Email<input type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })} /></label> <Switch label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })} /> <label>Address<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} /></label> <label>Service interest<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} /></label> <label>Stage<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}><option value="NEW">New</option><option value="QUALIFIED">Qualified</option><option value="QUOTATION_SENT">Quotation sent</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label> <label>Temperature<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></label> <label>Follow-up date<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value \|\| null })} /></label> <Switch label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })} /> <label>Site visit date<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value \|\| null })} /></label> <label>Notes<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} /></label> </form> 

### ACT-sales-lead-dialog-tsx-37

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:37-37

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button className="primary-action" type="submit" form={formId} disabled={busy}>
```

Content/label expression: {editing ? "Save Changes" : "Save Lead"}

### FORM-sales-lead-dialog-tsx-38

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:38-38

Tag: form; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<form id={formId} className="form-grid" onSubmit={save}>
```

Content/label expression:  <label>Name<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} /></label> <label>Phone<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} /></label> <label>Company<input disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })} /></label> <Switch label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })} /> <label>Email<input type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })} /></label> <Switch label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })} /> <label>Address<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} /></label> <label>Service interest<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} /></label> <label>Stage<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}><option value="NEW">New</option><option value="QUALIFIED">Qualified</option><option value="QUOTATION_SENT">Quotation sent</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label> <label>Temperature<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></label> <label>Follow-up date<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value \|\| null })} /></label> <Switch label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })} /> <label>Site visit date<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value \|\| null })} /></label> <label>Notes<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} /></label> 

### ACT-sales-lead-dialog-tsx-39

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:39-39

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-40

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:40-40

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-41

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:41-41

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input disabled={draft.companyNotEntered} value={draft.company} placeholder={draft.companyNotEntered ? "Not entered" : undefined} onChange={(event) => update({ company: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-42

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:42-42

Tag: Switch; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Switch label="Company not entered" checked={draft.companyNotEntered} onCheckedChange={(companyNotEntered) => update({ companyNotEntered, company: companyNotEntered ? "" : draft.company })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-43

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:43-43

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="email" disabled={draft.emailNotEntered} value={draft.email} placeholder={draft.emailNotEntered ? "Not entered" : undefined} onChange={(event) => update({ email: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-44

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:44-44

Tag: Switch; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Switch label="Email not entered" checked={draft.emailNotEntered} onCheckedChange={(emailNotEntered) => update({ emailNotEntered, email: emailNotEntered ? "" : draft.email })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-45

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:45-45

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-46

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:46-46

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-47

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:47-47

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}>
```

Content/label expression: <option value="NEW">New</option> <option value="QUALIFIED">Qualified</option> <option value="QUOTATION_SENT">Quotation sent</option> <option value="WON">Won</option> <option value="LOST">Lost</option>

### ACT-sales-lead-dialog-tsx-48

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:48-48

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}>
```

Content/label expression: <option value="HOT">Hot</option> <option value="WARM">Warm</option> <option value="COLD">Cold</option>

### ACT-sales-lead-dialog-tsx-49

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:49-49

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value || null })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-50

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:50-50

Tag: Switch; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<Switch label="Site visit completed" checked={draft.siteVisitCompleted} onCheckedChange={(siteVisitCompleted) => update({ siteVisitCompleted, siteVisitDate: siteVisitCompleted ? draft.siteVisitDate : null })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-51

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:51-51

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value || null })} />
```

Content/label expression: 

### ACT-sales-lead-dialog-tsx-52

Component: SalesLeadDialog Â· src/sales-lead-dialog.tsx:52-52

Tag: textarea; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} />
```

Content/label expression: 

### ACT-sales-lead-register-tsx-81

Component: SalesLeadFilterBar Â· src/sales-lead-register.tsx:81-81

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Search leads" value={query} disabled={busy} onChange={(event) => onQueryChange(event.target.value)} placeholder="Name, company, or phone" />
```

Content/label expression: 

### ACT-sales-lead-register-tsx-84

Component: SalesLeadFilterBar Â· src/sales-lead-register.tsx:84-84

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label="Lead status filter" value={stage} disabled={busy} onChange={(event) => onStageChange(event.target.value as LeadStage | "")}>
```

Content/label expression:  <option value="">All statuses</option> {leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)} 

### ACT-sales-lead-register-tsx-90

Component: SalesLeadFilterBar Â· src/sales-lead-register.tsx:90-90

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label="Lead created month/year" type="month" value={createdMonth} disabled={busy} onChange={(event) => onCreatedMonthChange(event.target.value)} />
```

Content/label expression: 

### ACT-sales-lead-register-tsx-92

Component: SalesLeadFilterBar Â· src/sales-lead-register.tsx:92-92

Tag: FilterClearButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<FilterClearButton onClick={onClear} disabled={busy} />
```

Content/label expression: 

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`Stage for ${item.displayName}`} disabled={disabled} value={draft.stage} onChange={(event) => update(item, { stage: event.target.value as LeadFormDraft["stage"] })}>
```

Content/label expression: {leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`Temperature for ${item.displayName}`} disabled={disabled} value={draft.temperature} onChange={(event) => update(item, { temperature: event.target.value as LeadFormDraft["temperature"] })}>
```

Content/label expression: <option value="HOT">Hot</option> <option value="WARM">Warm</option> <option value="COLD">Cold</option>

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input aria-label={`Follow-up for ${item.displayName}`} disabled={disabled} type="date" value={draft.followUpDue ?? ""} onChange={(event) => update(item, { followUpDue: event.target.value || null })} />
```

Content/label expression: 

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={`Site visit for ${item.displayName}`} disabled={disabled} value={draft.siteVisitCompleted ? "yes" : "no"} onChange={(event) => update(item, { siteVisitCompleted: event.target.value === "yes", siteVisitDate: event.target.value === "yes" ? draft.siteVisitDate : null })}>
```

Content/label expression: <option value="yes">Yes</option> <option value="no">No</option>

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="sales-lead-action sales-lead-action-secondary" disabled={disabled} onClick={() => onEdit(item)}>
```

Content/label expression: Edit

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: button; visibility: dirty

```tsx
<button type="button" className="primary-action sales-lead-action sales-lead-action-save" disabled={disabled} onClick={() => void save(item)}>
```

Content/label expression: Save

### ACT-sales-lead-register-tsx-124

Component: SalesLeadRegister Â· src/sales-lead-register.tsx:124-124

Tag: button; visibility: dirty

```tsx
<button type="button" className="sales-lead-action sales-lead-action-secondary" disabled={disabled} onClick={() => cancel(item.id)}>
```

Content/label expression: Cancel

### ACT-ui-kit-tsx-7

Component: FilterClearButton Â· src/ui-kit.tsx:7-7

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="filter-clear-action" onClick={onClick} disabled={disabled}>
```

Content/label expression: {label}

### ACT-ui-kit-tsx-11

Component: ListSearchActions Â· src/ui-kit.tsx:11-11

Tag: FilterClearButton; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<FilterClearButton onClick={onClear} />
```

Content/label expression: 

### ACT-ui-kit-tsx-15

Component: Switch Â· src/ui-kit.tsx:15-15

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" role="switch" aria-label={label} aria-checked={checked} className={`ui-switch ${className}`.trim()} onClick={() => onCheckedChange(!checked)}>
```

Content/label expression:  <span className="ui-switch-control" aria-hidden="true"><span /></span> <span className="ui-switch-label">{label}</span> <span className="ui-switch-state" aria-hidden="true">{checked ? "On" : "Off"}</span> 

### ACT-ui-kit-tsx-21

Component: PageSizeSelect Â· src/ui-kit.tsx:21-21

Tag: select; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<select aria-label={ariaLabel} value={value} onChange={(event) => onChange(Number(event.target.value))}>
```

Content/label expression: {PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}

### ACT-ui-kit-tsx-37

Component: DownloadMenu Â· src/ui-kit.tsx:37-37

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="download-menu-trigger" disabled={disabled} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
```

Content/label expression: <Download size={16} /> Download

### ACT-ui-kit-tsx-38

Component: DownloadMenu Â· src/ui-kit.tsx:38-38

Tag: button; visibility: open

```tsx
<button type="button" role="menuitem" onClick={() => run(downloadExcel)}>
```

Content/label expression: Excel (.xlsx)

### ACT-ui-kit-tsx-38

Component: DownloadMenu Â· src/ui-kit.tsx:38-38

Tag: button; visibility: open

```tsx
<button type="button" role="menuitem" onClick={() => run(downloadPdf)}>
```

Content/label expression: PDF

### ACT-ui-kit-tsx-77

Component: Dialog Â· src/ui-kit.tsx:77-77

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
```

Content/label expression:  <div ref={panelRef} tabIndex={-1} className={`${wide ? 'dialog-panel dialog-wide' : 'dialog-panel'}${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}> <div className="dialog-header"><div><h2 id={titleId}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div> <div className="dialog-body">{children}</div> <div className="dialog-footer"><div className="dialog-footer-actions">{footer}</div><button type="button" className="back-action" onClick={onClose}>Go Back</button></div> </div> 

### STATE-ui-kit-tsx-78

Component: Dialog Â· src/ui-kit.tsx:78-78

Tag: div; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<div ref={panelRef} tabIndex={-1} className={`${wide ? 'dialog-panel dialog-wide' : 'dialog-panel'}${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
```

Content/label expression:  <div className="dialog-header"><div><h2 id={titleId}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div> <div className="dialog-body">{children}</div> <div className="dialog-footer"><div className="dialog-footer-actions">{footer}</div><button type="button" className="back-action" onClick={onClose}>Go Back</button></div> 

### ACT-ui-kit-tsx-81

Component: Dialog Â· src/ui-kit.tsx:81-81

Tag: button; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<button type="button" className="back-action" onClick={onClose}>
```

Content/label expression: Go Back

### ACT-ui-kit-tsx-111

Component: SearchSelect Â· src/ui-kit.tsx:111-111

Tag: input; visibility: No enclosing JSX conditional; inspect owning component guard.

```tsx
<input role="combobox" aria-label={label} aria-expanded={open} aria-controls={listId} aria-autocomplete="list" disabled={disabled} placeholder={placeholder} value={open ? query : selected?.label ?? ''} onFocus={() => { if (openOnFocus) { setQuery(''); setOpen(true); } }} onClick={() => { if (!open) { setQuery(''); setOpen(true); } }} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={(event) => { if (event.key === 'Enter' && open) { event.preventDefault(); if (shown[0]) { onChange(shown[0].value); setOpen(false); } } else if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); } }} />
```

Content/label expression: 

### ACT-ui-kit-tsx-112

Component: SearchSelect Â· src/ui-kit.tsx:112-112

Tag: button; visibility: shown.length; open

```tsx
<button type="button" role="option" aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option.value); setOpen(false); }}>
```

Content/label expression: {option.label}