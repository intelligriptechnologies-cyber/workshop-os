# Field-by-field UI register

Declaration sites; dynamically mapped fields retain the label expression instead of an invented value. Exact default literals are in component state initializers in evidence-ui-component-contracts.md. Required=not declared only describes the HTML/custom-control attribute; command validators remain authoritative. Native HTML default type is text.

| ID | Component / form | Label expression | Type | Value/default expression | Required | Other constraints |
|---|---|---|---|---|---|---|
| ACT-admin-console-tsx-331-C79 | LocalTeamStructure / FORM-admin-console-tsx-331-C5 | "New department" | text | {name} | true |  |
| ACT-admin-console-tsx-340-C154 | DepartmentRenameDialog / FORM-admin-console-tsx-340-C62 | "Department name" | text | {name} | true |  |
| ACT-admin-console-tsx-351-C456 | DepartmentTeamPanel / no native form ancestor | "Eligible manager" | select | {appointmentManagerId} | not declared |  |
| ACT-admin-console-tsx-351-C1408 | DepartmentTeamPanel / no native form ancestor | "Appointed manager" | select | {teamManagerId} | not declared |  |
| ACT-admin-console-tsx-351-C1726 | DepartmentTeamPanel / no native form ancestor | "Eligible advisor" | select | {advisorId} | not declared | disabled={!selectedManager} |
| ACT-admin-console-tsx-363-C306 | RemoteTeamStructure / FORM-admin-console-tsx-363-C12 | "New department" | text | {name} | true |  |
| ACT-admin-console-tsx-369-C416 | RemoteDepartmentTeamPanel / no native form ancestor | "Eligible manager" | select | {appointmentManagerId} | not declared |  |
| ACT-admin-console-tsx-369-C1443 | RemoteDepartmentTeamPanel / no native form ancestor | "Appointed manager" | select | {teamManagerId} | not declared |  |
| ACT-admin-console-tsx-369-C1772 | RemoteDepartmentTeamPanel / no native form ancestor | "Eligible advisor" | select | {advisorId} | not declared | disabled={!selectedManager} |
| ACT-admin-console-tsx-458-C11 | ServiceTaskCatalog / no native form ancestor | "Search catalog services" | "search" | {query} | not declared |  |
| ACT-admin-console-tsx-466-C26 | ServiceTaskCatalog / no native form ancestor | "Filter department" | select | {departmentId} | not declared |  |
| ACT-admin-console-tsx-467-C26 | ServiceTaskCatalog / no native form ancestor | "Filter brand name" | select | {brandId} | not declared |  |
| ACT-admin-console-tsx-468-C27 | ServiceTaskCatalog / no native form ancestor | "Filter car segment" | select | {segmentId} | not declared |  |
| ACT-admin-console-tsx-654-C13 | CatalogServiceTaskDialog / FORM-admin-console-tsx-646-C7 | "Service department" | select | {departmentId} | not declared |  |
| ACT-admin-console-tsx-664-C13 | CatalogServiceTaskDialog / FORM-admin-console-tsx-646-C7 | UNVERIFIED: supplied dynamically/externally | select | {brandId} | not declared |  |
| ACT-admin-console-tsx-676-C13 | CatalogServiceTaskDialog / FORM-admin-console-tsx-646-C7 | UNVERIFIED: supplied dynamically/externally | select | {segmentId} | not declared |  |
| ACT-admin-console-tsx-683-C13 | CatalogServiceTaskDialog / FORM-admin-console-tsx-646-C7 | "Catalog service name" | text | {name} | not declared |  |
| ACT-admin-console-tsx-693-C13 | CatalogServiceTaskDialog / FORM-admin-console-tsx-646-C7 | "Catalog base rate" | "number" | {rate} | not declared | min="0"; step="0.01" |
| ACT-admin-console-tsx-702-C11 | CatalogServiceTaskDialog / FORM-admin-console-tsx-646-C7 | "Applicable GST" | SearchSelect | {gstRate} | not declared |  |
| ACT-admin-console-tsx-726-C221 | CatalogMasterDialog / FORM-admin-console-tsx-726-C156 | {`${title} name`} | text | {name} | true |  |
| ACT-admin-console-tsx-870-C15 | RolesPageAccessTab / FORM-admin-console-tsx-845-C11 | Role name  | text | {newRole.label} | true |  |
| ACT-admin-console-tsx-880-C15 | RolesPageAccessTab / FORM-admin-console-tsx-845-C11 | Description  | text | {newRole.description} | not declared |  |
| ACT-admin-console-tsx-901-C11 | RolesPageAccessTab / no native form ancestor | "Search roles" | text | {search} | not declared |  |
| ACT-admin-console-tsx-913-C11 | RolesPageAccessTab / no native form ancestor | "Filter roles by status" | select | {statusFilter} | not declared |  |
| ACT-admin-console-tsx-998-C19 | RolesPageAccessTab / FORM-admin-console-tsx-970-C17 | UNVERIFIED: supplied dynamically/externally | text | {editDraft.label} | true |  |
| ACT-admin-console-tsx-1005-C19 | RolesPageAccessTab / FORM-admin-console-tsx-970-C17 | "Description" | text | {editDraft.description} | not declared |  |
| ACT-admin-console-tsx-1112-C19 | RolesPageAccessTab / no native form ancestor | "Page name" | text | {pageSearch} | not declared |  |
| ACT-admin-console-tsx-1236-C11 | GroupFieldset / no native form ancestor |  {" "} {group.label}  | "checkbox" | {allChecked} | not declared |  |
| ACT-admin-console-tsx-1256-C13 | GroupFieldset / no native form ancestor |  {" "} {page.label}  | "checkbox" | {draftPages.includes(page.key)} | not declared | disabled={locked} |
| ACT-admin-console-tsx-1355-C11 | AppThemeTab / no native form ancestor | "Application font" | SearchSelect | {draft.fontId} | not declared |  |
| ACT-admin-console-tsx-1423-C15 | AppThemeTab / no native form ancestor | Customer name  | text | "Aarav Motors" | not declared | readOnly=true |
| ACT-admin-console-tsx-1609-C13 | BusinessSettingsTab / no native form ancestor | Business name  | text | {draft.profile.businessName} | not declared |  |
| ACT-admin-console-tsx-1618-C13 | BusinessSettingsTab / no native form ancestor | Legal name  | text | {draft.profile.legalName} | not declared |  |
| ACT-admin-console-tsx-1627-C13 | BusinessSettingsTab / no native form ancestor | Phone  | text | {draft.profile.phone} | not declared |  |
| ACT-admin-console-tsx-1636-C13 | BusinessSettingsTab / no native form ancestor | Email  | "email" | {draft.profile.email} | not declared |  |
| ACT-admin-console-tsx-1646-C13 | BusinessSettingsTab / no native form ancestor | Address  | text | {draft.profile.address} | not declared |  |
| ACT-admin-console-tsx-1655-C13 | BusinessSettingsTab / no native form ancestor | Timezone  | text | {draft.profile.timezone} | not declared |  |
| ACT-admin-console-tsx-1664-C13 | BusinessSettingsTab / no native form ancestor | Currency  | text | {draft.profile.currency} | not declared |  |
| ACT-admin-console-tsx-1678-C15 | BusinessSettingsTab / no native form ancestor | Branch name  | text | {draft.branch.name} | not declared |  |
| ACT-admin-console-tsx-1687-C15 | BusinessSettingsTab / no native form ancestor | Opening time  | "time" | {draft.branch.openingTime} | not declared |  |
| ACT-admin-console-tsx-1697-C15 | BusinessSettingsTab / no native form ancestor | Closing time  | "time" | {draft.branch.closingTime} | not declared |  |
| ACT-admin-console-tsx-1707-C15 | BusinessSettingsTab / no native form ancestor | Holiday behavior  | select | {draft.branch.holidayBehavior} | not declared |  |
| ACT-admin-console-tsx-1727-C17 | BusinessSettingsTab / no native form ancestor |  {day}  | "checkbox" | {draft.branch.workingDays.includes(day)} | not declared |  |
| ACT-admin-console-tsx-1742-C13 | BusinessSettingsTab / no native form ancestor | Job number prefix  | text | {draft.jobs.jobNumberPrefix} | not declared |  |
| ACT-admin-console-tsx-1751-C13 | BusinessSettingsTab / no native form ancestor | Default promised hours  | "number" | {draft.jobs.defaultPromisedHours} | not declared | min={1} |
| ACT-admin-console-tsx-1765-C13 | BusinessSettingsTab / no native form ancestor |  {" "} Require QC before closure  | "checkbox" | {draft.jobs.requireQc} | not declared |  |
| ACT-admin-console-tsx-1775-C13 | BusinessSettingsTab / no native form ancestor |  {" "} Washing needed by default  | "checkbox" | {draft.jobs.washingDefault} | not declared |  |
| ACT-admin-console-tsx-1785-C13 | BusinessSettingsTab / no native form ancestor |  {" "} Auto-close after delivery  | "checkbox" | {draft.jobs.autoCloseAfterDelivery} | not declared |  |
| ACT-admin-console-tsx-1800-C13 | BusinessSettingsTab / no native form ancestor | Estimate validity (days)  | "number" | {draft.pricing.estimateValidityDays} | not declared | min={1} |
| ACT-admin-console-tsx-1815-C13 | BusinessSettingsTab / no native form ancestor | Default labour rate  | "number" | {draft.pricing.defaultLabourRate} | not declared | min={0} |
| ACT-admin-console-tsx-1830-C13 | BusinessSettingsTab / no native form ancestor | Discount approval threshold (%)  | "number" | {draft.pricing.discountApprovalPercent} | not declared | min={0}; max={100} |
| ACT-admin-console-tsx-1845-C13 | BusinessSettingsTab / no native form ancestor |  {" "} Require estimate approval  | "checkbox" | {draft.pricing.requireEstimateApproval} | not declared |  |
| ACT-admin-console-tsx-1865-C15 | BusinessSettingsTab / no native form ancestor | "GSTIN" | text | {draft.billing.gstin} | not declared |  |
| ACT-admin-console-tsx-1875-C15 | BusinessSettingsTab / no native form ancestor | "Account holder" | text | {draft.billing.bankAccountHolder} | not declared |  |
| ACT-admin-console-tsx-1885-C15 | BusinessSettingsTab / no native form ancestor | "Bank name" | text | {draft.billing.bankName} | not declared |  |
| ACT-admin-console-tsx-1895-C15 | BusinessSettingsTab / no native form ancestor | "Account number" | text | {draft.billing.bankAccountNumber} | not declared |  |
| ACT-admin-console-tsx-1906-C15 | BusinessSettingsTab / no native form ancestor | "IFSC" | text | {draft.billing.bankIfsc} | not declared |  |
| ACT-admin-console-tsx-1916-C15 | BusinessSettingsTab / no native form ancestor | "Bank branch" | text | {draft.billing.bankBranch} | not declared |  |
| ACT-admin-console-tsx-1926-C15 | BusinessSettingsTab / no native form ancestor | "UPI ID" | text | {draft.billing.upiId} | not declared |  |
| ACT-admin-console-tsx-1936-C15 | BusinessSettingsTab / no native form ancestor | Default GST %  | "number" | {draft.billing.defaultGstPercent} | not declared | min={0}; max={100} |
| ACT-admin-console-tsx-1952-C15 | BusinessSettingsTab / no native form ancestor | Invoice prefix  | text | {draft.billing.invoicePrefix} | not declared |  |
| ACT-admin-console-tsx-1961-C15 | BusinessSettingsTab / no native form ancestor | Receipt prefix  | text | {draft.billing.receiptPrefix} | not declared |  |
| ACT-admin-console-tsx-1970-C15 | BusinessSettingsTab / no native form ancestor | Gate pass prefix  | text | {draft.billing.gatePassPrefix} | not declared |  |
| ACT-admin-console-tsx-1982-C17 | BusinessSettingsTab / no native form ancestor |  {mode}  | "checkbox" | {draft.billing.paymentModes.includes(mode)} | not declared |  |
| ACT-admin-console-tsx-1999-C13 | BusinessSettingsTab / no native form ancestor | Default unit  | text | {draft.inventory.defaultUnit} | not declared |  |
| ACT-admin-console-tsx-2007-C13 | BusinessSettingsTab / no native form ancestor |  {" "} Low-stock notifications  | "checkbox" | {draft.inventory.lowStockNotifications} | not declared |  |
| ACT-admin-console-tsx-2021-C13 | BusinessSettingsTab / no native form ancestor |  {" "} Require a reason for stock adjustments  | "checkbox" | {draft.inventory.requireAdjustmentReason} | not declared |  |
| ACT-admin-console-tsx-2042-C17 | BusinessSettingsTab / no native form ancestor |  {channel}  | "checkbox" | {draft.notifications.customerChannels.includes( channel, )} | not declared |  |
| ACT-admin-console-tsx-2062-C15 | BusinessSettingsTab / no native form ancestor | Document header  | text | {draft.notifications.documentHeader} | not declared |  |
| ACT-admin-console-tsx-2075-C15 | BusinessSettingsTab / no native form ancestor | Estimate template  | text | {draft.notifications.estimateTemplate} | not declared |  |
| ACT-admin-console-tsx-2088-C15 | BusinessSettingsTab / no native form ancestor | Invoice template  | text | {draft.notifications.invoiceTemplate} | not declared |  |
| ACT-admin-console-tsx-2107-C15 | BusinessSettingsTab / no native form ancestor | Job-card creation WhatsApp template  | textarea | {draft.notifications.jobCardCreatedWhatsAppTemplate} | not declared |  |
| ACT-admin-console-tsx-2121-C15 | BusinessSettingsTab / no native form ancestor | Job-card creation email template  | textarea | {draft.notifications.jobCardCreatedEmailTemplate} | not declared |  |
| ACT-admin-console-tsx-2135-C15 | BusinessSettingsTab / no native form ancestor | Job-card closure WhatsApp template  | textarea | {draft.notifications.jobCardClosedWhatsAppTemplate} | not declared |  |
| ACT-admin-console-tsx-2149-C15 | BusinessSettingsTab / no native form ancestor | Job-card closure email template  | textarea | {draft.notifications.jobCardClosedEmailTemplate} | not declared |  |
| ACT-admin-console-tsx-2248-C11 | CompanyImageField / no native form ancestor | Choose image  | "file" | not declared; see state/props initializer | not declared | accept="image/png,image/jpeg" |
| ACT-admin-console-tsx-2387-C9 | CompanySettingsTab / no native form ancestor | Company name  | text | {companyName} | not declared |  |
| ACT-admin-console-tsx-2398-C11 | CompanySettingsTab / no native form ancestor | Address  | text | {details.address} | not declared |  |
| ACT-admin-console-tsx-2405-C11 | CompanySettingsTab / no native form ancestor | Phone  | text | {details.phone} | not declared |  |
| ACT-admin-console-tsx-2412-C11 | CompanySettingsTab / no native form ancestor | Email  | text | {details.email} | not declared |  |
| ACT-admin-console-tsx-2419-C11 | CompanySettingsTab / no native form ancestor | GSTIN  | text | {details.gstin} | not declared |  |
| ACT-admin-console-tsx-2426-C11 | CompanySettingsTab / no native form ancestor | Terms / footer  | textarea | {details.footer} | not declared |  |
| ACT-admin-console-tsx-2661-C11 | ReportTemplatesTab / no native form ancestor | "Report category" | select | {category} | not declared |  |
| ACT-admin-console-tsx-2677-C11 | ReportTemplatesTab / no native form ancestor | "Report template" | select | {selectedId ?? ""} | not declared |  |
| ACT-admin-console-tsx-2695-C11 | ReportTemplatesTab / no native form ancestor | "Template name" | text | {draft.name} | not declared |  |
| ACT-admin-console-tsx-2705-C11 | ReportTemplatesTab / no native form ancestor |  {" "} Active template  | "checkbox" | {draft.active} | not declared |  |
| ACT-admin-console-tsx-2966-C15 | InventoryImportTab / no native form ancestor | Choose File  | "file" | not declared; see state/props initializer | not declared | accept=".csv,.xlsx,.xls" |
| ACT-admin-console-tsx-2993-C17 | InventoryImportTab / no native form ancestor |  {INVENTORY_TEMPLATE_HEADERS[field]}  | select | {mapping[field] ?? ""} | not declared |  |
| ACT-admin-console-tsx-3282-C11 | LogsPanel / no native form ancestor | "Search logs" | text | {search} | not declared |  |
| ACT-admin-console-tsx-3294-C11 | LogsPanel / no native form ancestor | Date from  | "date" | {dateFrom} | not declared |  |
| ACT-admin-console-tsx-3305-C11 | LogsPanel / no native form ancestor | Date to  | "date" | {dateTo} | not declared |  |
| ACT-admin-console-tsx-3316-C11 | LogsPanel / no native form ancestor | Level  | select | {level} | not declared |  |
| ACT-admin-console-tsx-3333-C11 | LogsPanel / no native form ancestor | Area  | select | {area} | not declared |  |
| ACT-admin-console-tsx-3464-C11 | RetentionSettingsPanel / no native form ancestor | Operational / error log retention (days)  | "number" | {operationalDays} | not declared | min={1} |
| ACT-admin-console-tsx-3473-C11 | RetentionSettingsPanel / no native form ancestor | Feature activity retention (days)  | "number" | {featureDays} | not declared | min={1} |
| ACT-App-tsx-1203-C17 | App / no native form ancestor | "Search category" | select | {searchCategory} | not declared |  |
| ACT-App-tsx-1416-C15 | LoginScreen / FORM-App-tsx-1408-C11 | Email  | text | {email} | not declared |  |
| ACT-App-tsx-1423-C15 | LoginScreen / FORM-App-tsx-1408-C11 | Password  | "password" | {password} | not declared |  |
| ACT-App-tsx-1436-C13 | LoginScreen / no native form ancestor | Emulate User:  | select | {email} | not declared |  |
| ACT-App-tsx-1981-C13 | SearchPortal / no native form ancestor | "Search records" | text | {query} | not declared |  |
| ACT-App-tsx-2025-C21 | SearchPortal / no native form ancestor | "Job status" | select | {status} | not declared |  |
| ACT-App-tsx-2047-C21 | SearchPortal / no native form ancestor | "Payment mode filter" | select | {paymentMode} | not declared |  |
| ACT-App-tsx-2077-C19 | SearchPortal / no native form ancestor | "Search date" | "date" | {dateFilter} | not declared |  |
| ACT-App-tsx-2091-C19 | SearchPortal / no native form ancestor | "Search month-year" | select | {monthFilter} | not declared |  |
| ACT-App-tsx-2931-C11 | ReceptionQueueRows / no native form ancestor | "Search reception queue" | text | {search} | not declared |  |
| ACT-App-tsx-2940-C11 | ReceptionQueueRows / no native form ancestor | "Reception queue status" | select | {status} | not declared |  |
| ACT-App-tsx-3315-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | "Existing customer" | SearchSelect | {form.customerId} | not declared |  |
| ACT-App-tsx-3331-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | "Existing vehicle" | SearchSelect | {form.vehicleId} | not declared |  |
| ACT-App-tsx-3349-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Customer Name  | text | {form.customerName} | true |  |
| ACT-App-tsx-3359-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Mobile  | text | {form.mobile} | true |  |
| ACT-App-tsx-3369-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Vehicle Number  | text | {form.vehicleNo} | true |  |
| ACT-App-tsx-3379-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Make  | text | {form.make} | true |  |
| ACT-App-tsx-3389-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Model  | text | {form.model} | true |  |
| ACT-App-tsx-3399-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Color  | text | {form.color} | not declared |  |
| ACT-App-tsx-3408-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | ODO meter reading (km)  | "number" | {form.odoReading} | true | min="0" |
| ACT-App-tsx-3421-C19 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Fuel / battery level  | text | {form.fuelLevelValue} | true |  |
| ACT-App-tsx-3428-C19 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Fuel / battery level  | select | {form.fuelLevelUnit} | not declared |  |
| ACT-App-tsx-3447-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Keys  | text | {form.keys} | not declared |  |
| ACT-App-tsx-3456-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Accessories  | text | {form.accessories} | not declared |  |
| ACT-App-tsx-3465-C17 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Advisor  | select | {form.advisorId} | not declared |  |
| ACT-App-tsx-3485-C15 | CreateVisitDialog / FORM-App-tsx-3283-C7 | Requested Work  | textarea | {form.requestedWork} | true |  |
| ACT-App-tsx-3858-C11 | ServiceAdvisorList / no native form ancestor | {`Search ${title.toLowerCase()}`} | text | {search} | not declared |  |
| ACT-App-tsx-3871-C13 | ServiceAdvisorList / no native form ancestor | {`${title} received date`} | "date" | {date} | not declared |  |
| ACT-App-tsx-3884-C13 | ServiceAdvisorList / no native form ancestor | {`${title} month-year`} | select | {month} | not declared |  |
| ACT-App-tsx-4413-C13 | ServiceFollowupDialog / FORM-App-tsx-4394-C9 | "Add a concise follow-up note" | textarea | {note} | true |  |
| ACT-App-tsx-4424-C13 | ServiceFollowupDialog / FORM-App-tsx-4394-C9 | "Customer response or next step" | text | {outcome} | not declared |  |
| ACT-App-tsx-4484-C19 | ServiceFollowupDialog / no native form ancestor |  {" "} Mark Done {" "}  | "checkbox" | {completions[item.id]?.selected ?? false} | not declared |  |
| ACT-App-tsx-4498-C19 | ServiceFollowupDialog / no native form ancestor | {`Outcome for ${item.note}`} | text | {completions[item.id]?.outcome ?? ""} | not declared | disabled={!completions[item.id]?.selected} |
| ACT-App-tsx-4525-C13 | ServiceFollowupDialog / FORM-App-tsx-4522-C9 | "Add a follow-up note" | text | {note} | not declared |  |
| ACT-App-tsx-4534-C13 | ServiceFollowupDialog / FORM-App-tsx-4522-C9 | Outcome  | text | {outcome} | not declared |  |
| ACT-App-tsx-4540-C13 | ServiceFollowupDialog / FORM-App-tsx-4522-C9 |  {" "} Mark new follow-up Done  | "checkbox" | {done} | not declared |  |
| ACT-App-tsx-4608-C15 | MaterialProcurementTriage / no native form ancestor | "Procurement material request" | select | {selectedProcurement?.request.id ?? ""} | not declared |  |
| ACT-App-tsx-4991-C13 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Pending request  | select | {requestId} | not declared |  |
| ACT-App-tsx-5005-C13 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Map to inventory item (optional)  | select | {itemId} | not declared |  |
| ACT-App-tsx-5023-C17 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | {`LOCAL-${requestId}`} | text | {sku} | not declared |  |
| ACT-App-tsx-5031-C17 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Category  | text | {category} | not declared |  |
| ACT-App-tsx-5041-C15 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Unit cost  | "number" | {unitCost} | true | min="0"; step="0.01" |
| ACT-App-tsx-5052-C15 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Vendor / shop  | text | {vendor} | true |  |
| ACT-App-tsx-5060-C15 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Bill / reference  | text | {billReference} | true |  |
| ACT-App-tsx-5069-C13 | PurchaseStockIssueEditor / FORM-App-tsx-4979-C5 | Note (optional)  | textarea | {note} | not declared |  |
| ACT-App-tsx-5366-C13 | PurchaseOrdersWorkspace / no native form ancestor | "Search purchase orders" | text | {search} | not declared |  |
| ACT-App-tsx-5375-C13 | PurchaseOrdersWorkspace / no native form ancestor | "Purchase order status" | select | {status} | not declared |  |
| ACT-App-tsx-5506-C17 | PurchaseOrdersWorkspace / no native form ancestor | "PO number" | text | {selected?.po_number ?? nextPurchaseRequestNumber} | not declared | disabled=true; readOnly=true |
| ACT-App-tsx-5515-C17 | PurchaseOrdersWorkspace / no native form ancestor | "PO order date" | "date" | {orderDate} | not declared |  |
| ACT-App-tsx-5524-C17 | PurchaseOrdersWorkspace / no native form ancestor | "PO notes" | text | {notes} | not declared |  |
| ACT-App-tsx-5532-C17 | PurchaseOrdersWorkspace / no native form ancestor | "PO supplier" | text | "Assigned by Admin after request" | not declared | disabled=true; readOnly=true |
| ACT-App-tsx-5568-C21 | PurchaseOrdersWorkspace / no native form ancestor | Item type  | select | {line.new_item ? "new" : "inventory"} | not declared |  |
| ACT-App-tsx-5575-C43 | PurchaseOrdersWorkspace / no native form ancestor | {`PO line ${index + 1} new item name`} | text | {line.item_name ?? ""} | not declared |  |
| ACT-App-tsx-5576-C34 | PurchaseOrdersWorkspace / no native form ancestor | {`PO line ${index + 1} unit`} | text | {line.unit ?? ""} | not declared |  |
| ACT-App-tsx-5581-C21 | PurchaseOrdersWorkspace / no native form ancestor | {`PO line ${index + 1} quantity`} | "number" | {line.ordered_qty} | not declared | min="0.01" |
| ACT-App-tsx-5899-C17 | PurchaseOrdersWorkspace / no native form ancestor | {`Delivered quantity for PO line ${index + 1}`} | "number" | {formLine?.delivered_qty \|\| ""} | not declared | min="0"; max={Math.max(0, line.ordered_qty - delivered)}; step="0.01" |
| ACT-App-tsx-5925-C34 | PurchaseOrdersWorkspace / no native form ancestor | {`Accepted quantity for PO line ${index + 1}`} | "number" | {formLine.accepted_qty} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-5926-C34 | PurchaseOrdersWorkspace / no native form ancestor | {`Returned quantity for PO line ${index + 1}`} | "number" | {formLine.returned_qty} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-5927-C33 | PurchaseOrdersWorkspace / no native form ancestor | {`Damaged quantity for PO line ${index + 1}`} | "number" | {formLine.damaged_qty} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-5928-C32 | PurchaseOrdersWorkspace / no native form ancestor | {`Wasted quantity for PO line ${index + 1}`} | "number" | {formLine.wasted_qty} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-5953-C34 | PurchaseOrdersWorkspace / no native form ancestor | {`Supplier for PO line ${index + 1}`} | select | {formLine.supplier_id} | not declared |  |
| ACT-App-tsx-5954-C43 | PurchaseOrdersWorkspace / no native form ancestor | {`Pre-GST price for PO line ${index + 1}`} | "number" | {formLine.unit_cost \|\| ""} | not declared | min="0.01"; step="0.01" |
| ACT-App-tsx-5956-C82 | PurchaseOrdersWorkspace / no native form ancestor | {`SKU for PO line ${index + 1}`} | text | {formLine.sku} | not declared |  |
| ACT-App-tsx-5956-C237 | PurchaseOrdersWorkspace / no native form ancestor | {`Category for PO line ${index + 1}`} | text | {formLine.category} | not declared |  |
| ACT-App-tsx-5956-C403 | PurchaseOrdersWorkspace / no native form ancestor | {`Catalogue name for PO line ${index + 1}`} | text | {formLine.name} | not declared |  |
| ACT-App-tsx-5956-C567 | PurchaseOrdersWorkspace / no native form ancestor | {`Catalogue unit for PO line ${index + 1}`} | text | {formLine.unit} | not declared |  |
| ACT-App-tsx-5956-C746 | PurchaseOrdersWorkspace / no native form ancestor | {`Low stock threshold for PO line ${index + 1}`} | "number" | {formLine.low_stock_qty} | not declared | min="0" |
| ACT-App-tsx-5956-C972 | PurchaseOrdersWorkspace / no native form ancestor | {`Selling price for PO line ${index + 1}`} | "number" | {formLine.selling_price} | not declared | min="0" |
| ACT-App-tsx-6053-C97 | PreviousPriceReview / no native form ancestor | {`Quotation supplier for ${line.id}`} | text | {supplierName} | not declared |  |
| ACT-App-tsx-6053-C259 | PreviousPriceReview / no native form ancestor | {`Quotation date for ${line.id}`} | "date" | {quoteDate} | not declared |  |
| ACT-App-tsx-6053-C416 | PreviousPriceReview / no native form ancestor | {`Quotation quantity for ${line.id}`} | "number" | {quotedQty} | not declared | min="0.01" |
| ACT-App-tsx-6053-C613 | PreviousPriceReview / no native form ancestor | {`Quotation price for ${line.id}`} | "number" | {unitCost} | not declared | min="0" |
| ACT-App-tsx-6053-C817 | PreviousPriceReview / no native form ancestor | {`Quotation notes for ${line.id}`} | text | {notes} | not declared |  |
| ACT-App-tsx-6295-C13 | LegacyInwardPurchasesWorkspace / no native form ancestor | "Search inward purchases" | text | {search} | not declared |  |
| ACT-App-tsx-6304-C13 | LegacyInwardPurchasesWorkspace / no native form ancestor | "Inward purchase status" | select | {status} | not declared |  |
| ACT-App-tsx-6503-C19 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | "Purchase supplier" | select | {supplierId} | true |  |
| ACT-App-tsx-6528-C19 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | "Supplier invoice number" | text | {invoiceNo} | not declared |  |
| ACT-App-tsx-6536-C19 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | "Invoice date" | "date" | {invoiceDate} | not declared |  |
| ACT-App-tsx-6545-C19 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | "PO number" | text | {poNumber} | not declared |  |
| ACT-App-tsx-6581-C25 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | {`Receipt line ${index + 1} quantity`} | "number" | {line.received_qty} | not declared | min="0.01"; step="0.01" |
| ACT-App-tsx-6596-C25 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | {`Receipt line ${index + 1} unit cost`} | "number" | {line.unit_cost} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-6611-C25 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | {`Receipt line ${index + 1} discount`} | "number" | {line.discount} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-6626-C25 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | {`Receipt line ${index + 1} GST`} | "number" | {line.gst_rate} | not declared | min="0"; max="100"; step="0.01" |
| ACT-App-tsx-6662-C17 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | "Invoice scan" | "file" | not declared; see state/props initializer | not declared | accept="application/pdf,image/jpeg" |
| ACT-App-tsx-6699-C15 | LegacyInwardPurchasesWorkspace / FORM-App-tsx-6414-C7 | "Correction reason" | text | {revisionReason} | not declared |  |
| ACT-App-tsx-7065-C13 | InwardPurchasesWorkspace / no native form ancestor | "Search inward purchases" | text | {search} | not declared |  |
| ACT-App-tsx-7074-C13 | InwardPurchasesWorkspace / no native form ancestor | "Inward purchase status" | select | {status} | not declared |  |
| ACT-App-tsx-7307-C23 | InwardPurchasesWorkspace / no native form ancestor | "Correction reason" | text | {revisionReason} | true |  |
| ACT-App-tsx-7328-C25 | InwardPurchasesWorkspace / no native form ancestor | "Purchase supplier" | select | {supplierId} | not declared |  |
| ACT-App-tsx-7350-C25 | InwardPurchasesWorkspace / no native form ancestor | Supplier {editorMode ? ( <select data-dialog-initial-focus aria-label="Purchase supplier" value={supplierId} onChange={(event) => setSupplierId(Number(event.target.value)) } > <option value={0}>Select active supplier</option> {state.suppliers .filter( (supplier) => supplier.status === "Active" \|\| supplier.id === supplierId, ) .map((supplier) => ( <option key={supplier.id} value={supplier.id}> {supplier.name} </option> ))} </select> ) : ( <input readOnly value={supplierName(supplierId)} /> )}  | text | {supplierName(supplierId)} | not declared | readOnly=true |
| ACT-App-tsx-7355-C23 | InwardPurchasesWorkspace / no native form ancestor | "Supplier invoice number" | text | {invoiceNo} | not declared | readOnly={!editorMode && !receiveMode} |
| ACT-App-tsx-7364-C23 | InwardPurchasesWorkspace / no native form ancestor | "Invoice date" | "date" | {invoiceDate} | not declared | readOnly={!editorMode && !receiveMode} |
| ACT-App-tsx-7375-C25 | InwardPurchasesWorkspace / no native form ancestor | "PO number" | text | {poNumber} | not declared |  |
| ACT-App-tsx-7422-C23 | InwardPurchasesWorkspace / no native form ancestor | "Invoice scan" | "file" | not declared; see state/props initializer | not declared | accept="application/pdf,image/jpeg" |
| ACT-App-tsx-7517-C15 | ReceiptLines / no native form ancestor | {`Receipt line ${index + 1} quantity`} | "number" | {line.received_qty} | not declared | readOnly={!editable && !editableQuantity}; min="0.01"; step="0.01" |
| ACT-App-tsx-7535-C19 | ReceiptLines / no native form ancestor | {`Receipt line ${index + 1} unit cost`} | "number" | {line.unit_cost} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-7550-C19 | ReceiptLines / no native form ancestor | {`Receipt line ${index + 1} discount`} | "number" | {line.discount} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-7565-C19 | ReceiptLines / no native form ancestor | {`Receipt line ${index + 1} GST`} | "number" | {line.gst_rate} | not declared | min="0"; max="100"; step="0.01" |
| ACT-App-tsx-7861-C15 | SupplierMasterWorkspace / FORM-App-tsx-7858-C11 | Name  | text | {draft.name} | true |  |
| ACT-App-tsx-7872-C15 | SupplierMasterWorkspace / FORM-App-tsx-7858-C11 | Contact name  | text | {draft.contact_name} | not declared |  |
| ACT-App-tsx-7881-C15 | SupplierMasterWorkspace / FORM-App-tsx-7858-C11 | Phone  | text | {draft.phone} | not declared |  |
| ACT-App-tsx-7890-C15 | SupplierMasterWorkspace / FORM-App-tsx-7858-C11 | Email  | "email" | {draft.email} | not declared |  |
| ACT-App-tsx-7900-C15 | SupplierMasterWorkspace / FORM-App-tsx-7858-C11 | GSTIN  | text | {draft.gstin} | not declared |  |
| ACT-App-tsx-7909-C15 | SupplierMasterWorkspace / FORM-App-tsx-7858-C11 | Status  | select | {draft.status} | not declared |  |
| ACT-App-tsx-7996-C11 | StockMovementHistory / no native form ancestor | "Search stock movements" | text | {search} | not declared |  |
| ACT-App-tsx-8008-C11 | StockMovementHistory / no native form ancestor | "Stock movement date" | "date" | {date} | not declared |  |
| ACT-App-tsx-8020-C11 | StockMovementHistory / no native form ancestor | "Stock movement month" | select | {month} | not declared |  |
| ACT-App-tsx-8040-C11 | StockMovementHistory / no native form ancestor | "Stock movement direction" | select | {direction} | not declared |  |
| ACT-App-tsx-8584-C13 | StoreList / no native form ancestor | {`Search ${title.toLocaleLowerCase()}`} | text | {search} | not declared |  |
| ACT-App-tsx-8603-C15 | StoreList / no native form ancestor | "Stock category" | select | {primary} | not declared |  |
| ACT-App-tsx-8619-C15 | StoreList / no native form ancestor | "Stock status" | select | {job} | not declared |  |
| ACT-App-tsx-8634-C15 | StoreList / no native form ancestor | "Stock unit" | select | {unit} | not declared |  |
| ACT-App-tsx-8655-C19 | StoreList / no native form ancestor | {`${title} record date`} | "date" | {recordDate} | not declared |  |
| ACT-App-tsx-8668-C19 | StoreList / no native form ancestor | {`${title} record month`} | select | {recordMonth} | not declared |  |
| ACT-App-tsx-8709-C15 | StoreList / no native form ancestor | { kind === "reconcile" ? "Reconciliation state" : "Status" } | select | {primary} | not declared |  |
| ACT-App-tsx-8740-C17 | StoreList / no native form ancestor | {`${title} job`} | select | {job} | not declared |  |
| ACT-App-tsx-8779-C17 | StoreList / no native form ancestor | {`${title} item`} | select | {item} | not declared |  |
| ACT-App-tsx-9033-C17 | Technician / no native form ancestor | Work notes  | text | {task.notes} | not declared |  |
| ACT-App-tsx-9296-C13 | MaterialApprovalQueue / no native form ancestor | "Required when rejecting" | textarea | {reason} | true |  |
| ACT-App-tsx-9729-C21 | OperationalDashboard / no native form ancestor | "Cashflow month" | select | {cashflowMonth} | not declared |  |
| ACT-App-tsx-9938-C13 | ManagementHub / no native form ancestor | {`Job for ${area}`} | JobPicker | not declared; see state/props initializer | not declared |  |
| ACT-App-tsx-10084-C11 | CustomerManager / no native form ancestor | "Search customers" | text | {search} | not declared |  |
| ACT-App-tsx-10305-C11 | VehicleManager / no native form ancestor | "Search vehicles" | text | {search} | not declared |  |
| ACT-App-tsx-10533-C11 | VisitJobManager / no native form ancestor | "Search job cards" | text | {search} | not declared |  |
| ACT-App-tsx-10545-C11 | VisitJobManager / no native form ancestor | "Job status filter" | select | {status} | not declared |  |
| ACT-App-tsx-10563-C11 | VisitJobManager / no native form ancestor | "Estimated delivery date" | "date" | {deliveryDate} | not declared |  |
| ACT-App-tsx-10575-C11 | VisitJobManager / no native form ancestor | "Estimated delivery month" | "month" | {deliveryMonth} | not declared |  |
| ACT-App-tsx-10847-C11 | InventoryMaterialsManager / no native form ancestor | "Search inventory / materials" | text | {search} | not declared |  |
| ACT-App-tsx-10990-C17 | UserManager / FORM-App-tsx-10974-C11 | User name  | text | {draft.name} | true |  |
| ACT-App-tsx-11000-C17 | UserManager / FORM-App-tsx-10974-C11 | User email  | "email" | {draft.email} | true |  |
| ACT-App-tsx-11011-C17 | UserManager / FORM-App-tsx-10974-C11 | User role  | select | {draft.role} | not declared |  |
| ACT-App-tsx-11026-C17 | UserManager / FORM-App-tsx-10974-C11 | User password  | "password" | {draft.password} | true |  |
| ACT-App-tsx-11049-C11 | UserManager / no native form ancestor | "Search users" | text | {search} | not declared |  |
| ACT-App-tsx-11061-C11 | UserManager / no native form ancestor | "Filter users by role" | select | {roleFilter} | not declared |  |
| ACT-App-tsx-11079-C11 | UserManager / no native form ancestor | "Filter users by status" | select | {statusFilter} | not declared |  |
| ACT-App-tsx-11382-C15 | RemoteUserManager / FORM-App-tsx-11358-C9 | User name  | text | {draft.name} | true |  |
| ACT-App-tsx-11392-C15 | RemoteUserManager / FORM-App-tsx-11358-C9 | User email  | "email" | {draft.email} | true | disabled={Boolean(draft.id)} |
| ACT-App-tsx-11412-C17 | RemoteUserManager / FORM-App-tsx-11358-C9 |  {role.name}  | "checkbox" | {draft.roleIds.includes(role.id)} | not declared |  |
| ACT-App-tsx-11425-C17 | RemoteUserManager / FORM-App-tsx-11358-C9 |  {branch.name}  | "checkbox" | {draft.branchIds.includes(branch.id)} | not declared |  |
| ACT-App-tsx-11451-C11 | RemoteUserManager / no native form ancestor | "Search remote users" | text | {search} | not declared |  |
| ACT-App-tsx-11688-C9 | CustomerEditor / FORM-App-tsx-11665-C5 | "Customer name" | text | {value.name} | true |  |
| ACT-App-tsx-11697-C9 | CustomerEditor / FORM-App-tsx-11665-C5 | Mobile  | text | {value.mobile} | true |  |
| ACT-App-tsx-11707-C9 | CustomerEditor / FORM-App-tsx-11665-C5 | Type  | text | {value.type} | true |  |
| ACT-App-tsx-11779-C7 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | UNVERIFIED: supplied dynamically/externally | select | {draft.id} | not declared |  |
| ACT-App-tsx-11806-C9 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | Customer  | select | {draft.customer_id} | not declared |  |
| ACT-App-tsx-11822-C11 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | Number  | text | {draft.number} | not declared |  |
| ACT-App-tsx-11831-C11 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | Make  | text | {draft.make} | not declared |  |
| ACT-App-tsx-11840-C11 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | Model  | text | {draft.model} | not declared |  |
| ACT-App-tsx-11849-C11 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | Color  | text | {draft.color} | not declared |  |
| ACT-App-tsx-11858-C11 | VehicleMasterPanel / FORM-App-tsx-11758-C5 | KM  | "number" | {draft.km} | not declared |  |
| ACT-App-tsx-11913-C9 | DuplicateVisitEditor / FORM-App-tsx-11905-C5 | Advisor  | select | {draft.advisor_id} | not declared |  |
| ACT-App-tsx-11929-C11 | DuplicateVisitEditor / FORM-App-tsx-11905-C5 | Fuel  | text | {draft.fuel} | not declared |  |
| ACT-App-tsx-11938-C11 | DuplicateVisitEditor / FORM-App-tsx-11905-C5 | Keys  | text | {draft.keys} | not declared |  |
| ACT-App-tsx-11947-C11 | DuplicateVisitEditor / FORM-App-tsx-11905-C5 | Accessories  | text | {draft.accessories} | not declared |  |
| ACT-App-tsx-11956-C11 | DuplicateVisitEditor / FORM-App-tsx-11905-C5 | Photo Note  | text | {draft.photos_note} | not declared |  |
| ACT-App-tsx-11966-C9 | DuplicateVisitEditor / FORM-App-tsx-11905-C5 | Requested Work  | text | {draft.requested_work} | not declared |  |
| ACT-App-tsx-12060-C13 | JobEditor / FORM-App-tsx-12046-C7 | "Service advisor (locked)" | select | {draft.advisor_id} | not declared | disabled=true |
| ACT-App-tsx-12077-C13 | JobEditor / FORM-App-tsx-12046-C7 | Technician  | select | {draft.technician_id} | not declared |  |
| ACT-App-tsx-12097-C13 | JobEditor / FORM-App-tsx-12046-C7 | "Main Status" | select | {view.job.main_status} | not declared | disabled=true |
| ACT-App-tsx-12107-C13 | JobEditor / FORM-App-tsx-12046-C7 | Promised  | text | {draft.promised_at} | not declared |  |
| ACT-App-tsx-12117-C11 | JobEditor / FORM-App-tsx-12046-C7 | Work List  | text | {draft.work_list} | not declared |  |
| ACT-App-tsx-12126-C11 | JobEditor / FORM-App-tsx-12046-C7 | Customer Instructions  | text | {draft.customer_instructions} | not declared |  |
| ACT-App-tsx-12135-C11 | JobEditor / FORM-App-tsx-12046-C7 | Internal Instructions  | text | {draft.internal_instructions} | not declared |  |
| ACT-App-tsx-12144-C11 | JobEditor / FORM-App-tsx-12046-C7 | Advisor Notes  | text | {draft.advisor_notes} | not declared |  |
| ACT-App-tsx-12155-C13 | JobEditor / FORM-App-tsx-12046-C7 | Service Type  | select | {draft.service_type} | not declared |  |
| ACT-App-tsx-12169-C13 | JobEditor / FORM-App-tsx-12046-C7 | Pickup / Drop  | select | {draft.pickup_drop} | not declared |  |
| ACT-App-tsx-12183-C13 | JobEditor / FORM-App-tsx-12046-C7 | Estimated Delivery Date  | "date" | {draft.estimated_delivery} | not declared |  |
| ACT-App-tsx-12193-C13 | JobEditor / FORM-App-tsx-12046-C7 | Fuel  | select | {draft.fuel} | not declared |  |
| ACT-App-tsx-12208-C13 | JobEditor / FORM-App-tsx-12046-C7 | Accessories  | text | {draft.accessories} | not declared |  |
| ACT-App-tsx-12217-C13 | JobEditor / FORM-App-tsx-12046-C7 | Engine Number  | text | {draft.engine_no} | not declared |  |
| ACT-App-tsx-12227-C11 | JobEditor / FORM-App-tsx-12046-C7 | Address  | text | {draft.address} | not declared |  |
| ACT-App-tsx-12491-C17 | JobLifecyclePanel / no native form ancestor |   | "checkbox" | {Boolean(item.checked_at)} | not declared | disabled={!enabled} |
| ACT-App-tsx-12563-C15 | JobLifecyclePanel / FORM-App-tsx-12560-C11 | Confirmation note  | textarea | {note} | not declared |  |
| ACT-App-tsx-12627-C11 | ApproveEstimateDialog / FORM-App-tsx-12624-C7 | Approval note  | textarea | {note} | not declared |  |
| ACT-App-tsx-12844-C15 | EstimateDialog / FORM-App-tsx-12804-C7 | {`Item ${index + 1} kind`} | select | {item.kind} | not declared |  |
| ACT-App-tsx-12856-C15 | EstimateDialog / FORM-App-tsx-12804-C7 | {`Item ${index + 1} description`} | text | {item.description} | not declared |  |
| ACT-App-tsx-12864-C15 | EstimateDialog / FORM-App-tsx-12804-C7 | {`Item ${index + 1} quantity`} | "number" | {item.qty} | not declared | min="0.01"; step="0.01" |
| ACT-App-tsx-12874-C15 | EstimateDialog / FORM-App-tsx-12804-C7 | {`Item ${index + 1} rate`} | "number" | {item.rate} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-12884-C15 | EstimateDialog / FORM-App-tsx-12804-C7 | {`Item ${index + 1} GST type`} | select | {item.gst_type} | not declared |  |
| ACT-App-tsx-12903-C17 | EstimateDialog / FORM-App-tsx-12804-C7 | {`Item ${index + 1} GST rate`} | SearchSelect | {item.gst_rate} | not declared |  |
| ACT-App-tsx-12930-C13 | EstimateDialog / FORM-App-tsx-12804-C7 | Discount  | "number" | {discount} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-12941-C11 | EstimateDialog / FORM-App-tsx-12804-C7 | Notes  | textarea | {notes} | not declared |  |
| ACT-App-tsx-13002-C9 | FollowupEditor / FORM-App-tsx-12972-C5 | Note  | text | {draft.note} | not declared |  |
| ACT-App-tsx-13010-C11 | FollowupEditor / FORM-App-tsx-12972-C5 | Due  | "date" | {draft.due_at} | not declared |  |
| ACT-App-tsx-13020-C11 | FollowupEditor / FORM-App-tsx-12972-C5 | Outcome  | text | {draft.outcome ?? ""} | not declared |  |
| ACT-App-tsx-13212-C13 | JobMediaPanel / no native form ancestor | Upload phase  | select | {uploadPhase} | not declared |  |
| ACT-App-tsx-13227-C19 | JobMediaPanel / FORM-App-tsx-13223-C13 | {`${uploadPhase} photo`} | text | {label} | not declared |  |
| ACT-App-tsx-13235-C19 | JobMediaPanel / FORM-App-tsx-13223-C13 | Image file  | "file" | not declared; see state/props initializer | not declared | accept="image/jpeg,image/png,image/webp" |
| ACT-App-tsx-13365-C17 | JobMediaPanel / FORM-App-tsx-13343-C13 | Archive reason  | textarea | {archiveReason} | true |  |
| ACT-App-tsx-13435-C11 | MediaMetadataDialog / FORM-App-tsx-13416-C7 | Photo label  | text | {label} | not declared |  |
| ACT-App-tsx-13443-C11 | MediaMetadataDialog / FORM-App-tsx-13416-C7 | Work phase  | select | {category} | not declared |  |
| ACT-App-tsx-13581-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 |  Inventory  | "radio" | {source === "inventory"} | not declared |  |
| ACT-App-tsx-13592-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 |  Local purchase  | "radio" | {source === "local"} | not declared |  |
| ACT-App-tsx-13608-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Request  | select | {draft.id} | not declared |  |
| ACT-App-tsx-13621-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | "Material request job" | JobPicker | not declared; see state/props initializer | not declared |  |
| ACT-App-tsx-13632-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Job  | select | {draft.job_card_id} | not declared |  |
| ACT-App-tsx-13651-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Item  | select | {draft.item_id} | not declared |  |
| ACT-App-tsx-13666-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Requested Qty  | "number" | {draft.requested_qty} | not declared | min="0.01"; step="0.01" |
| ACT-App-tsx-13684-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Local purchase  | select | {purchase.id} | not declared |  |
| ACT-App-tsx-13696-C11 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | "Local purchase job" | JobPicker | not declared; see state/props initializer | not declared |  |
| ACT-App-tsx-13707-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Item description  | text | {purchase.item_description} | true |  |
| ACT-App-tsx-13720-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Quantity  | "number" | {purchase.quantity} | true | min="0.01"; step="0.01" |
| ACT-App-tsx-13736-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Unit  | text | {purchase.unit} | true |  |
| ACT-App-tsx-13746-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Unit cost  | "number" | {purchase.unit_cost} | true | min="0"; step="0.01" |
| ACT-App-tsx-13762-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Vendor / shop  | text | {purchase.vendor} | true |  |
| ACT-App-tsx-13772-C15 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Bill / reference  | text | {purchase.bill_reference} | true |  |
| ACT-App-tsx-13786-C13 | MaterialRequestEditor / FORM-App-tsx-13559-C5 | Note (optional)  | textarea | {purchase.note ?? ""} | not declared |  |
| ACT-App-tsx-14107-C13 | ReconcileEditor / FORM-App-tsx-14071-C7 | "Used quantity" | "number" | {used} | not declared | min="0"; step="any" |
| ACT-App-tsx-14119-C13 | ReconcileEditor / FORM-App-tsx-14071-C7 | "Returned quantity" | "number" | {returned} | not declared | min="0"; step="any" |
| ACT-App-tsx-14130-C13 | ReconcileEditor / FORM-App-tsx-14071-C7 | "Wasted quantity" | "number" | {wasted} | not declared | min="0"; step="any" |
| ACT-App-tsx-14153-C13 | ReconcileEditor / FORM-App-tsx-14071-C7 | "Confirm no return or wastage" | "checkbox" | {zeroRecordedAcknowledged} | not declared |  |
| ACT-App-tsx-14249-C11 | QuickAddStock / FORM-App-tsx-14246-C5 | "Existing SKU" | SearchSelect | {selectedId \|\| undefined} | not declared |  |
| ACT-App-tsx-14267-C13 | QuickAddStock / FORM-App-tsx-14246-C5 | "Inward quantity" | "number" | {inwardQty} | true | min="0.01"; step="0.01" |
| ACT-App-tsx-14279-C13 | QuickAddStock / FORM-App-tsx-14246-C5 | "Purchase order" | select | {purchaseOrderId} | not declared |  |
| ACT-App-tsx-14304-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "Purchase order line" | select | {purchaseOrderLineId} | not declared |  |
| ACT-App-tsx-14357-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "New SKU" | text | {draft.sku} | true |  |
| ACT-App-tsx-14368-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "New material name" | text | {draft.name} | true |  |
| ACT-App-tsx-14379-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "New SKU category" | text | {draft.category} | true |  |
| ACT-App-tsx-14390-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "New SKU unit" | text | {draft.unit} | true |  |
| ACT-App-tsx-14401-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "New SKU low-stock threshold" | "number" | {draft.low_stock_qty} | true | min="0"; step="0.01" |
| ACT-App-tsx-14418-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "New SKU selling price" | "number" | {draft.selling_price} | true | min="0"; step="0.01" |
| ACT-App-tsx-14435-C15 | QuickAddStock / FORM-App-tsx-14246-C5 | "Initial inward quantity" | "number" | {inwardQty} | true | min="0"; step="0.01" |
| ACT-App-tsx-14523-C13 | EditStockDetailsDialog / FORM-App-tsx-14516-C7 | "Edit SKU" | text | {draft.sku} | true |  |
| ACT-App-tsx-14535-C13 | EditStockDetailsDialog / FORM-App-tsx-14516-C7 | "Edit material name" | text | {draft.name} | true |  |
| ACT-App-tsx-14546-C13 | EditStockDetailsDialog / FORM-App-tsx-14516-C7 | "Edit category" | text | {draft.category} | true |  |
| ACT-App-tsx-14557-C13 | EditStockDetailsDialog / FORM-App-tsx-14516-C7 | "Edit unit" | text | {draft.unit} | true |  |
| ACT-App-tsx-14568-C13 | EditStockDetailsDialog / FORM-App-tsx-14516-C7 | "Edit low-stock threshold" | "number" | {draft.low_stock_qty} | true | min="0"; step="0.01" |
| ACT-App-tsx-14585-C13 | EditStockDetailsDialog / FORM-App-tsx-14516-C7 | "Edit selling price" | "number" | {draft.selling_price} | true | min="0"; step="0.01" |
| ACT-App-tsx-14655-C7 | InventoryEditor / FORM-App-tsx-14637-C5 | UNVERIFIED: supplied dynamically/externally | select | {draft.id} | not declared |  |
| ACT-App-tsx-14675-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | SKU  | text | {draft.sku} | not declared |  |
| ACT-App-tsx-14684-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | Category  | text | {draft.category} | not declared |  |
| ACT-App-tsx-14693-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | Name  | text | {draft.name} | not declared |  |
| ACT-App-tsx-14702-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | Unit  | text | {draft.unit} | not declared |  |
| ACT-App-tsx-14711-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | Stock  | "number" | {draft.stock_qty} | not declared |  |
| ACT-App-tsx-14721-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | Low Stock  | "number" | {draft.low_stock_qty} | not declared |  |
| ACT-App-tsx-14731-C11 | InventoryEditor / FORM-App-tsx-14637-C5 | Selling Price  | "number" | {draft.selling_price} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-14744-C9 | InventoryEditor / FORM-App-tsx-14637-C5 | Movement Qty  | "number" | {movementQty} | not declared |  |
| ACT-App-tsx-14870-C9 | TaskCreator / FORM-App-tsx-14848-C5 | New Task  | text | {title} | not declared |  |
| ACT-App-tsx-14877-C9 | TaskCreator / FORM-App-tsx-14848-C5 | Notes  | text | {notes} | not declared |  |
| ACT-App-tsx-14923-C9 | QcEditor / no native form ancestor | Fail/Rework Reason  | text | {reason} | not declared |  |
| ACT-App-tsx-15114-C13 | DataFlowWorkspace / no native form ancestor | "Visit month" | select | {month} | not declared |  |
| ACT-App-tsx-15138-C13 | DataFlowWorkspace / no native form ancestor | "Visit date" | select | {date} | not declared |  |
| ACT-App-tsx-15164-C13 | DataFlowWorkspace / no native form ancestor | "Job, vehicle, customer or mobile" | "search" | {query} | not declared |  |
| ACT-App-tsx-15770-C13 | AddJobCardDialog / FORM-App-tsx-15767-C7 | "Customer" | SearchSelect | {customerId \|\| undefined} | not declared |  |
| ACT-App-tsx-15792-C13 | AddJobCardDialog / FORM-App-tsx-15767-C7 | "Vehicle" | SearchSelect | {vehicleId \|\| undefined} | not declared |  |
| ACT-App-tsx-15812-C13 | AddJobCardDialog / FORM-App-tsx-15767-C7 | Service advisor  | select | {advisorId} | not declared | disabled={actor.role === "service"} |
| ACT-App-tsx-15826-C13 | AddJobCardDialog / FORM-App-tsx-15767-C7 | {`Current vehicle KM: ${vehicle?.km ?? "—"}`} | "number" | {form.odoReading} | true | min="0" |
| ACT-App-tsx-15841-C15 | AddJobCardDialog / FORM-App-tsx-15767-C7 | "Value" | text | {form.fuelLevelValue} | true |  |
| ACT-App-tsx-15849-C15 | AddJobCardDialog / FORM-App-tsx-15767-C7 | "Fuel or battery unit" | select | {form.fuelLevelUnit} | not declared |  |
| ACT-App-tsx-15869-C13 | AddJobCardDialog / FORM-App-tsx-15767-C7 | Keys  | text | {form.keys} | not declared |  |
| ACT-App-tsx-15878-C13 | AddJobCardDialog / FORM-App-tsx-15767-C7 | Accessories  | text | {form.accessories} | not declared |  |
| ACT-App-tsx-15888-C11 | AddJobCardDialog / FORM-App-tsx-15767-C7 | Requested work  | text | {form.requestedWork} | true |  |
| ACT-App-tsx-16314-C13 | JobTaskListPanel / no native form ancestor | "Search service catalog" | text | {query} | not declared |  |
| ACT-App-tsx-16343-C13 | JobTaskListPanel / no native form ancestor | "Manual task name" | text | {manual} | not declared |  |
| ACT-App-tsx-16351-C13 | JobTaskListPanel / no native form ancestor | "Manual task rate" | "number" | {rate} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-16400-C19 | JobTaskListPanel / no native form ancestor | {`${item.name} done`} | "checkbox" | {Boolean(item.done)} | not declared | disabled={!editable} |
| ACT-App-tsx-16418-C21 | JobTaskListPanel / no native form ancestor | {`${item.name} name`} | text | {item.name} | not declared |  |
| ACT-App-tsx-16437-C21 | JobTaskListPanel / no native form ancestor | {`${item.name} rate`} | "number" | {item.base_rate} | not declared | min="0"; step="0.01" |
| ACT-App-tsx-16724-C11 | VisitEditor / no native form ancestor | Advisor  | select | {advisorId} | not declared |  |
| ACT-App-tsx-16776-C9 | DuplicateCustomerEditor / no native form ancestor | Name  | text | {value.name} | not declared |  |
| ACT-App-tsx-16783-C9 | DuplicateCustomerEditor / no native form ancestor | Mobile  | text | {value.mobile} | not declared |  |
| ACT-App-tsx-16792-C9 | DuplicateCustomerEditor / no native form ancestor | Type  | text | {value.type} | not declared |  |
| ACT-App-tsx-16848-C9 | DuplicateVehicleMasterPanel / no native form ancestor | Customer  | select | {value.customer_id} | not declared |  |
| ACT-App-tsx-16863-C9 | DuplicateVehicleMasterPanel / no native form ancestor | Number  | text | {value.number} | not declared |  |
| ACT-App-tsx-16872-C9 | DuplicateVehicleMasterPanel / no native form ancestor | Make  | text | {value.make} | not declared |  |
| ACT-App-tsx-16879-C9 | DuplicateVehicleMasterPanel / no native form ancestor | Model  | text | {value.model} | not declared |  |
| ACT-App-tsx-16888-C9 | DuplicateVehicleMasterPanel / no native form ancestor | Color  | text | {value.color} | not declared |  |
| ACT-App-tsx-16897-C9 | DuplicateVehicleMasterPanel / no native form ancestor | KM  | "number" | {value.km} | not declared |  |
| ACT-App-tsx-16977-C9 | DuplicateEstimateEditor / no native form ancestor | Description  | text | {draft.description} | not declared |  |
| ACT-App-tsx-16986-C9 | DuplicateEstimateEditor / no native form ancestor | Qty  | "number" | {draft.qty} | not declared |  |
| ACT-App-tsx-16996-C9 | DuplicateEstimateEditor / no native form ancestor | Rate  | "number" | {draft.rate} | not declared |  |
| ACT-App-tsx-17062-C9 | DuplicateFollowupEditor / no native form ancestor | New note  | text | {note} | not declared |  |
| ACT-App-tsx-17118-C9 | DuplicateJobEditor / no native form ancestor | Work List  | text | {workList} | not declared |  |
| ACT-App-tsx-17125-C9 | DuplicateJobEditor / no native form ancestor | Advisor  | select | {advisorId} | not declared |  |
| ACT-App-tsx-17140-C9 | DuplicateJobEditor / no native form ancestor | Technician  | select | {technicianId} | not declared |  |
| ACT-App-tsx-17156-C11 | DuplicateJobEditor / no native form ancestor | Status  | select | {mainStatus} | not declared |  |
| ACT-App-tsx-17172-C11 | DuplicateJobEditor / no native form ancestor | Sub Status  | text | {subStatus} | not declared |  |
| ACT-App-tsx-17234-C9 | DuplicateInventoryEditor / no native form ancestor | Item  | select | {item.id} | not declared |  |
| ACT-App-tsx-17253-C9 | DuplicateInventoryEditor / no native form ancestor | Name  | text | {item.name} | not declared |  |
| ACT-App-tsx-17260-C9 | DuplicateInventoryEditor / no native form ancestor | Quantity  | "number" | {qty} | not declared |  |
| ACT-App-tsx-17349-C9 | DuplicateReconcileEditor / no native form ancestor | Request  | select | {requestId} | not declared |  |
| ACT-App-tsx-17362-C9 | DuplicateReconcileEditor / no native form ancestor | Used  | "number" | {used} | not declared |  |
| ACT-App-tsx-17370-C9 | DuplicateReconcileEditor / no native form ancestor | Returned  | "number" | {returned} | not declared |  |
| ACT-App-tsx-17378-C9 | DuplicateReconcileEditor / no native form ancestor | Wasted  | "number" | {wasted} | not declared |  |
| ACT-App-tsx-17413-C9 | DuplicateTaskCreator / no native form ancestor | New Task  | text | {title} | not declared |  |
| ACT-App-tsx-17480-C9 | DuplicateQcEditor / no native form ancestor | Fail reason  | text | {reason} | not declared |  |
| ACT-App-tsx-17577-C78 | JobCardFilterFields / no native form ancestor | {searchLabel} | text | {values.search} | not declared |  |
| ACT-App-tsx-17578-C71 | JobCardFilterFields / no native form ancestor | "Main status" | select | {values.primary} | not declared |  |
| ACT-App-tsx-17579-C72 | JobCardFilterFields / no native form ancestor | "Workflow status" | select | {values.secondary} | not declared |  |
| ACT-App-tsx-17580-C87 | JobCardFilterFields / no native form ancestor | "Estimated delivery date" | "date" | {values.date} | not declared |  |
| ACT-App-tsx-17581-C87 | JobCardFilterFields / no native form ancestor | "Estimated delivery month-year" | select | {values.month} | not declared |  |
| ACT-App-tsx-17582-C77 | JobCardFilterFields / no native form ancestor | "Service advisor filter" | select | {values.advisor} | not declared |  |
| ACT-App-tsx-17583-C60 | JobCardFilterFields / no native form ancestor | "Sort results" | select | {values.sort} | not declared |  |
| ACT-App-tsx-18261-C13 | EntityList / no native form ancestor | {`Search ${title.toLocaleLowerCase()}`} | text | {effectiveSearch} | not declared |  |
| ACT-App-tsx-18282-C15 | EntityList / no native form ancestor | "Search records" | text | {effectiveSearch} | not declared |  |
| ACT-App-tsx-18318-C17 | EntityList / no native form ancestor | "Main status" | select | {filters.primary} | not declared |  |
| ACT-App-tsx-18339-C17 | EntityList / no native form ancestor | "Workflow status" | select | {filters.secondary} | not declared |  |
| ACT-App-tsx-18356-C17 | EntityList / no native form ancestor | "Estimated delivery date" | "date" | {filters.date} | not declared |  |
| ACT-App-tsx-18367-C17 | EntityList / no native form ancestor | "Estimated delivery month" | "month" | {filters.month} | not declared |  |
| ACT-App-tsx-18378-C17 | EntityList / no native form ancestor | "Customer filter" | select | {filters.customer} | not declared |  |
| ACT-App-tsx-18395-C17 | EntityList / no native form ancestor | "Vehicle filter" | select | {filters.vehicle} | not declared |  |
| ACT-App-tsx-18412-C17 | EntityList / no native form ancestor | "Service advisor filter" | select | {filters.advisor} | not declared |  |
| ACT-App-tsx-18433-C17 | EntityList / no native form ancestor | "Customer type" | select | {filters.primary} | not declared |  |
| ACT-App-tsx-18448-C17 | EntityList / no native form ancestor | "Customer served month" | select | {filters.month} | not declared |  |
| ACT-App-tsx-18468-C15 | EntityList / no native form ancestor | "Vehicle served month" | select | {filters.month} | not declared |  |
| ACT-App-tsx-18488-C17 | EntityList / no native form ancestor | "Job card filter" | select | {filters.primary} | not declared |  |
| ACT-App-tsx-18505-C17 | EntityList / no native form ancestor | "Media category" | select | {filters.secondary} | not declared |  |
| ACT-App-tsx-18520-C17 | EntityList / no native form ancestor | "Media received date" | "date" | {filters.date} | not declared |  |
| ACT-App-tsx-18531-C17 | EntityList / no native form ancestor | "Media month-year" | select | {filters.month} | not declared |  |
| ACT-App-tsx-18551-C15 | EntityList / no native form ancestor | "Sort results" | select | {filters.sort} | not declared |  |
| ACT-App-tsx-19269-C11 | FilterableJobRows / no native form ancestor | {`Search ${title.toLocaleLowerCase()}`} | text | {search} | not declared |  |
| ACT-App-tsx-19283-C15 | FilterableJobRows / no native form ancestor | "Ready To Invoice received date" | "date" | {receivedDate} | not declared |  |
| ACT-App-tsx-19296-C15 | FilterableJobRows / no native form ancestor | "Ready To Invoice month-year" | select | {receivedMonth} | not declared |  |
| ACT-App-tsx-19320-C13 | FilterableJobRows / no native form ancestor | {`${title} status`} | select | {status} | not declared |  |
| ACT-billing-manager-tsx-168-C48 | BillingManager / no native form ancestor | {`Search ${mode.toLowerCase()}`} | text | {search} | not declared |  |
| ACT-billing-manager-tsx-169-C28 | BillingManager / no native form ancestor | {`${mode} Month-Year filter`} | select | {eventMonth} | not declared |  |
| ACT-billing-manager-tsx-170-C45 | BillingManager / no native form ancestor | {`${mode} status filter`} | select | {status} | not declared |  |
| ACT-billing-manager-tsx-171-C56 | BillingManager / no native form ancestor | "Payment mode filter" | select | {paymentMode} | not declared |  |
| ACT-billing-manager-tsx-245-C23 | InlineVoid / FORM-billing-manager-tsx-243-C10 | {`${label} reason`} | textarea | {reason} | true |  |
| ACT-billing-manager-tsx-264-C45 | RecordPaymentForm / FORM-billing-manager-tsx-263-C10 | "Payment amount" | text | {money(invoice.total)} | not declared | disabled=true; readOnly=true |
| ACT-billing-manager-tsx-264-C148 | RecordPaymentForm / FORM-billing-manager-tsx-263-C10 | "Payment mode" | select | {mode} | not declared |  |
| ACT-billing-manager-tsx-264-C432 | RecordPaymentForm / FORM-billing-manager-tsx-263-C10 | "Other payment detail" | text | {otherDetail} | not declared |  |
| ACT-billing-manager-tsx-264-C588 | RecordPaymentForm / FORM-billing-manager-tsx-263-C10 | "Payment reference" | text | {reference} | not declared |  |
| ACT-billing-manager-tsx-264-C738 | RecordPaymentForm / FORM-billing-manager-tsx-263-C10 | Notes (optional) | textarea | {notes} | not declared |  |
| ACT-billing-manager-tsx-318-C77 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | "Billing job" | select | {selected.job.id} | not declared |  |
| ACT-billing-manager-tsx-320-C59 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | Tally invoice number | text | {tally} | not declared | disabled={readOnly} |
| ACT-billing-manager-tsx-320-C211 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | "Invoice discount" | "number" | {discount} | not declared | min="0"; step="0.01"; disabled={lockFinancials} |
| ACT-billing-manager-tsx-321-C640 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | {`Invoice item ${index + 1} type`} | select | {item.kind} | not declared | disabled={lockFinancials} |
| ACT-billing-manager-tsx-321-C894 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | {`Invoice item ${index + 1} description`} | text | {item.description} | not declared | disabled={lockFinancials} |
| ACT-billing-manager-tsx-321-C1084 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | {`Invoice item ${index + 1} quantity`} | "number" | {item.qty} | not declared | min="0.01"; step="0.01"; disabled={lockFinancials} |
| ACT-billing-manager-tsx-321-C1300 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | {`Invoice item ${index + 1} rate`} | "number" | {item.rate} | not declared | min="0"; step="0.01"; disabled={lockFinancials} |
| ACT-billing-manager-tsx-321-C1511 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | {`Invoice item ${index + 1} GST type`} | select | {item.gst_type} | not declared | disabled={lockFinancials} |
| ACT-billing-manager-tsx-321-C1945 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | {`Invoice item ${index + 1} GST rate`} | SearchSelect | {item.gst_rate} | not declared | disabled={lockFinancials} |
| ACT-billing-manager-tsx-323-C17 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | Notes | textarea | {notes} | not declared | disabled={readOnly} |
| ACT-billing-manager-tsx-324-C62 | InvoiceDialog / FORM-billing-manager-tsx-317-C367 | "Invoice edit note" | textarea | {editNote} | not declared |  |
| ACT-billing-manager-tsx-375-C18 | VoidReasonDialog / FORM-billing-manager-tsx-374-C172 | Reason | textarea | {reason} | true |  |
| ACT-booking-calendar-tsx-43-C213 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Customer name | text | {form.customerName} | true |  |
| ACT-booking-calendar-tsx-43-C347 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Mobile | text | {form.mobile} | true |  |
| ACT-booking-calendar-tsx-43-C477 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Vehicle number | text | {form.vehicleNo} | true |  |
| ACT-booking-calendar-tsx-43-C617 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Make | text | {form.make} | true |  |
| ACT-booking-calendar-tsx-43-C734 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Model | text | {form.model} | true |  |
| ACT-booking-calendar-tsx-43-C853 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Color | text | {form.color} | not declared |  |
| ACT-booking-calendar-tsx-43-C970 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Booking date | "date" | {form.bookingDate} | true | min={range.min}; max={range.max} |
| ACT-booking-calendar-tsx-43-C1152 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Service type | select | {form.serviceType} | true |  |
| ACT-booking-calendar-tsx-43-C1536 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Arrival window | select | {form.arrivalWindow} | not declared |  |
| ACT-booking-calendar-tsx-43-C1806 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Requested work | textarea | {form.requestedWork} | true |  |
| ACT-booking-calendar-tsx-43-C2073 | BookingCalendar / FORM-booking-calendar-tsx-43-C144 | Admin override reason (recorded in the booking audit trail) | textarea | {form.capacityOverrideReason} | true |  |
| ACT-booking-calendar-tsx-44-C207 | BookingCalendar / FORM-booking-calendar-tsx-44-C143 | "Service Work booking capacity" | "number" | {capacityDraft.serviceWork} | true | min="0"; step="1" |
| ACT-booking-calendar-tsx-44-C478 | BookingCalendar / FORM-booking-calendar-tsx-44-C143 | "General Checkup / Follow-up booking capacity" | "number" | {capacityDraft.generalCheckupFollowup} | true | min="0"; step="1" |
| ACT-booking-check-in-tsx-39-C29 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Customer name | text | {booking.customer_name} | not declared | readOnly=true |
| ACT-booking-check-in-tsx-39-C98 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Mobile | text | {booking.mobile} | not declared | readOnly=true |
| ACT-booking-check-in-tsx-40-C30 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Vehicle number | text | {booking.vehicle_no} | not declared | readOnly=true |
| ACT-booking-check-in-tsx-40-C97 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Vehicle | text | {`${booking.make} ${booking.model}${booking.color ? ` · ${booking.color}` : ""}`} | not declared | readOnly=true |
| ACT-booking-check-in-tsx-40-C237 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Booked service type | text | {booking.service_type} | not declared | readOnly=true |
| ACT-booking-check-in-tsx-41-C38 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | ODO meter reading (km) | "number" | {odoReading} | true | min="0" |
| ACT-booking-check-in-tsx-42-C64 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Fuel / battery level | text | {fuelLevelValue} | true |  |
| ACT-booking-check-in-tsx-42-C165 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Fuel / battery level | select | {fuelLevelUnit} | not declared |  |
| ACT-booking-check-in-tsx-43-C20 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Keys | text | {keys} | not declared |  |
| ACT-booking-check-in-tsx-43-C118 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Accessories | text | {accessories} | not declared |  |
| ACT-booking-check-in-tsx-45-C28 | BookingCheckInDialog / FORM-booking-check-in-tsx-36-C5 | Requested work | textarea | {requestedWork} | true |  |
| ACT-booking-expected-today-tsx-82-C30 | ExpectedTodayBookings / no native form ancestor | "Expected today follow-up status" | select | {filter} | not declared |  |
| ACT-booking-expected-today-tsx-97-C71 | ExpectedTodayBookings / FORM-booking-expected-today-tsx-96-C7 | New booking date | "date" | {rescheduleDate} | true | min={range.min}; max={range.max} |
| ACT-booking-expected-today-tsx-97-C276 | ExpectedTodayBookings / FORM-booking-expected-today-tsx-96-C7 | Booked service type | text | {selected.booking.service_type} | not declared | readOnly=true |
| ACT-booking-expected-today-tsx-97-C361 | ExpectedTodayBookings / FORM-booking-expected-today-tsx-96-C7 | Arrival window | select | {arrivalWindow} | not declared |  |
| ACT-booking-expected-today-tsx-97-C706 | ExpectedTodayBookings / FORM-booking-expected-today-tsx-96-C7 | Admin override reason (recorded in the booking audit trail) | textarea | {capacityOverrideReason} | true |  |
| ACT-booking-expected-today-tsx-98-C189 | ExpectedTodayBookings / FORM-booking-expected-today-tsx-96-C7 | {selected.action === "call" ? "What was discussed?" : "Reason is required for the audit trail"} | textarea | {note} | true |  |
| ACT-developer-console-tsx-15-C1048 | DeveloperConsole / no native form ancestor | "Emulate role" | select | {role} | not declared |  |
| ACT-developer-console-tsx-16-C318 | DeveloperConsole / no native form ancestor | Channel active | "checkbox" | {state.communications[channel].active} | not declared |  |
| ACT-developer-console-tsx-16-C548 | DeveloperConsole / no native form ancestor | Default sender | text | {state.communications[channel].sender} | not declared |  |
| ACT-developer-console-tsx-21-C475 | TenantCreate / FORM-developer-console-tsx-21-C427 | "New tenant name" | text | {name} | not declared |  |
| ACT-developer-console-tsx-22-C605 | TenantProfileForm / FORM-developer-console-tsx-22-C280 | {key.replace(/([A-Z])/g, " $1")} | text | {draft[key]} | not declared |  |
| ACT-developer-console-tsx-23-C848 | Billing / FORM-developer-console-tsx-23-C543 | Description | text | {description} | not declared |  |
| ACT-developer-console-tsx-23-C954 | Billing / FORM-developer-console-tsx-23-C543 | Amount | "number" | {amount} | not declared | min="1" |
| ACT-developer-console-tsx-23-C1074 | Billing / FORM-developer-console-tsx-23-C543 | Due date | "date" | {dueDate} | not declared |  |
| ACT-developer-console-tsx-23-C1635 | Billing / no native form ancestor | {`Payment for ${charge.description}`} | "number" | {payment[charge.id] ?? ""} | not declared | min="1" |
| ACT-job-picker-tsx-22-C96 | JobPicker / no native form ancestor | {`${label} search`} | "search" | {query} | not declared |  |
| ACT-job-picker-tsx-22-C288 | JobPicker / no native form ancestor | {`${label} Month-Year filter`} | select | {period.monthYear} | not declared |  |
| ACT-job-picker-tsx-22-C625 | JobPicker / no native form ancestor | "Job results" | select | {selectedJobId ?? ""} | not declared |  |
| ACT-job-sheet-ui-tsx-25-C11 | EstimatedDeliveryRow / FORM-job-sheet-ui-tsx-18-C7 | UNVERIFIED: supplied dynamically/externally | "date" | {date} | not declared |  |
| ACT-job-sheet-ui-tsx-90-C30 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Service Type | select | {draft.service_type} | not declared |  |
| ACT-job-sheet-ui-tsx-91-C31 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Pickup / Drop | select | {draft.pickup_drop} | not declared |  |
| ACT-job-sheet-ui-tsx-92-C41 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Estimated Delivery Date | "date" | {draft.estimated_delivery} | not declared |  |
| ACT-job-sheet-ui-tsx-93-C22 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Fuel | select | {draft.fuel} | not declared |  |
| ACT-job-sheet-ui-tsx-94-C29 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Accessories | text | {draft.accessories} | not declared |  |
| ACT-job-sheet-ui-tsx-95-C31 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Engine Number | text | {draft.engine_no} | not declared |  |
| ACT-job-sheet-ui-tsx-97-C23 | JobSheetSection / FORM-job-sheet-ui-tsx-88-C7 | Address | text | {draft.address} | not declared |  |
| ACT-materials-ui-tsx-20-C58 | InventoryPicker / no native form ancestor | {label} | text | {query} | not declared | disabled={disabled} |
| ACT-materials-ui-tsx-29-C178 | MaterialRow / no native form ancestor | "Qty" | "number" | {qty} | not declared | min="0.01"; step="0.01" |
| ACT-materials-ui-tsx-29-C687 | MaterialRow / no native form ancestor | "Edit request note" | text | {note} | not declared |  |
| ACT-materials-ui-tsx-41-C458 | JobMaterialsPanel / no native form ancestor | "Qty" | "number" | {qty} | not declared | min="0.01"; step="0.01" |
| ACT-materials-ui-tsx-41-C824 | JobMaterialsPanel / FORM-materials-ui-tsx-41-C683 | Item name | text | {newItem.item_name} | true |  |
| ACT-materials-ui-tsx-41-C971 | JobMaterialsPanel / FORM-materials-ui-tsx-41-C683 | Quantity | "number" | {newItem.quantity} | true | min="0.01"; step="0.01" |
| ACT-materials-ui-tsx-41-C1157 | JobMaterialsPanel / FORM-materials-ui-tsx-41-C683 | Unit | text | {newItem.unit} | true |  |
| ACT-pagination-toolbar-tsx-24-C7 | PaginationToolbar / no native form ancestor | UNVERIFIED: supplied dynamically/externally | PageSizeSelect | {pageSize} | not declared |  |
| ACT-quotation-dialog-tsx-26-C147 | CatalogDescriptionCombobox / no native form ancestor | {`Catalog description for line ${lineNumber}`} | text | {value} | true |  |
| ACT-quotation-dialog-tsx-42-C43 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | Lead | select | {leadId} | true |  |
| ACT-quotation-dialog-tsx-42-C337 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | Valid until | "date" | {validUntil} | not declared |  |
| ACT-quotation-dialog-tsx-42-C456 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | Template | select | {templateId} | true |  |
| ACT-quotation-dialog-tsx-42-C718 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | Discount | "number" | {discount} | not declared | min="0" |
| ACT-quotation-dialog-tsx-43-C54 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | Customer notes | textarea | {notes} | not declared |  |
| ACT-quotation-dialog-tsx-44-C846 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | {`Quantity for line ${index + 1}`} | "number" | {line.quantity} | true | min="0.001"; step="0.001" |
| ACT-quotation-dialog-tsx-44-C1053 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | {`Rate for line ${index + 1}`} | "number" | {line.rate} | true | min="0" |
| ACT-quotation-dialog-tsx-44-C1231 | QuotationEditorDialog / FORM-quotation-dialog-tsx-41-C409 | {`GST rate for line ${index + 1}`} | "number" | {line.gstRate} | true | min="0"; max="100" |
| ACT-quotation-filter-bar-tsx-4-C113 | QuotationFilterBar / no native form ancestor | "Search quotations" | text | {query} | not declared | disabled={busy} |
| ACT-quotation-filter-bar-tsx-4-C305 | QuotationFilterBar / no native form ancestor | "Quotation created date" | "date" | {createdDate} | not declared | disabled={busy} |
| ACT-quotation-filter-bar-tsx-4-C493 | QuotationFilterBar / no native form ancestor | "Quotation created month/year" | "month" | {createdMonth} | not declared | disabled={busy} |
| ACT-remote-finance-tsx-76-C15 | RemoteFinanceWorkspace / no native form ancestor | Job | select | {selected?.id ?? 0} | not declared |  |
| ACT-remote-finance-tsx-78-C154 | RemoteFinanceWorkspace / no native form ancestor | Amount (₹) | "number" | {payAmount} | not declared | min="0.01" |
| ACT-remote-finance-tsx-78-C282 | RemoteFinanceWorkspace / no native form ancestor | Method | select | {method} | not declared |  |
| ACT-remote-finance-tsx-78-C511 | RemoteFinanceWorkspace / no native form ancestor | Reference | text | {reference} | not declared |  |
| ACT-remote-finance-tsx-79-C432 | RemoteFinanceWorkspace / no native form ancestor | Delivered by | text | {deliveredBy} | not declared |  |
| ACT-remote-finance-tsx-79-C547 | RemoteFinanceWorkspace / no native form ancestor | Final odometer | "number" | {finalOdometer} | not declared | min="0" |
| ACT-remote-finance-tsx-79-C689 | RemoteFinanceWorkspace / no native form ancestor | Acknowledgement | text | {acknowledgement} | not declared |  |
| ACT-remote-followups-tsx-56-C108 | RemoteFollowupsWorkspace / FORM-remote-followups-tsx-56-C5 | "Customer, registration, job card, or invoice" | text | {query} | not declared |  |
| ACT-remote-followups-tsx-66-C30 | RemoteFollowupsWorkspace / FORM-remote-followups-tsx-65-C5 | Job | select | {jobId} | true |  |
| ACT-remote-followups-tsx-67-C22 | RemoteFollowupsWorkspace / FORM-remote-followups-tsx-65-C5 | Due date | "date" | {dueAt} | not declared |  |
| ACT-remote-followups-tsx-68-C18 | RemoteFollowupsWorkspace / FORM-remote-followups-tsx-65-C5 | Note | textarea | {note} | true |  |
| ACT-remote-followups-tsx-69-C33 | RemoteFollowupsWorkspace / FORM-remote-followups-tsx-65-C5 | Outcome | textarea | {outcome} | not declared |  |
| ACT-sales-lead-dialog-tsx-39-C18 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Name | text | {draft.displayName} | true |  |
| ACT-sales-lead-dialog-tsx-40-C19 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Phone | text | {draft.phone} | true |  |
| ACT-sales-lead-dialog-tsx-41-C21 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | {draft.companyNotEntered ? "Not entered" : undefined} | text | {draft.company} | not declared | disabled={draft.companyNotEntered} |
| ACT-sales-lead-dialog-tsx-43-C19 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | {draft.emailNotEntered ? "Not entered" : undefined} | "email" | {draft.email} | not declared | disabled={draft.emailNotEntered} |
| ACT-sales-lead-dialog-tsx-45-C21 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Address | textarea | {draft.address} | not declared |  |
| ACT-sales-lead-dialog-tsx-46-C30 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Service interest | text | {draft.serviceInterest} | not declared |  |
| ACT-sales-lead-dialog-tsx-47-C19 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Stage | select | {draft.stage} | not declared |  |
| ACT-sales-lead-dialog-tsx-48-C25 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Temperature | select | {draft.temperature} | not declared |  |
| ACT-sales-lead-dialog-tsx-49-C28 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Follow-up date | "date" | {draft.followUpDue ?? ""} | not declared |  |
| ACT-sales-lead-dialog-tsx-51-C29 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Site visit date | "date" | {draft.siteVisitDate ?? ""} | not declared | disabled={!draft.siteVisitCompleted} |
| ACT-sales-lead-dialog-tsx-52-C19 | SalesLeadDialog / FORM-sales-lead-dialog-tsx-38-C5 | Notes | textarea | {draft.notes} | not declared |  |
| ACT-sales-lead-register-tsx-81-C7 | SalesLeadFilterBar / no native form ancestor | "Search leads" | text | {query} | not declared | disabled={busy} |
| ACT-sales-lead-register-tsx-84-C7 | SalesLeadFilterBar / no native form ancestor | "Lead status filter" | select | {stage} | not declared | disabled={busy} |
| ACT-sales-lead-register-tsx-90-C7 | SalesLeadFilterBar / no native form ancestor | "Lead created month/year" | "month" | {createdMonth} | not declared | disabled={busy} |
| ACT-sales-lead-register-tsx-124-C298 | SalesLeadRegister / no native form ancestor | {`Stage for ${item.displayName}`} | select | {draft.stage} | not declared | disabled={disabled} |
| ACT-sales-lead-register-tsx-124-C602 | SalesLeadRegister / no native form ancestor | {`Temperature for ${item.displayName}`} | select | {draft.temperature} | not declared | disabled={disabled} |
| ACT-sales-lead-register-tsx-124-C929 | SalesLeadRegister / no native form ancestor | {`Follow-up for ${item.displayName}`} | "date" | {draft.followUpDue ?? ""} | not declared | disabled={disabled} |
| ACT-sales-lead-register-tsx-124-C1140 | SalesLeadRegister / no native form ancestor | {`Site visit for ${item.displayName}`} | select | {draft.siteVisitCompleted ? "yes" : "no"} | not declared | disabled={disabled} |
| ACT-ui-kit-tsx-21-C47 | PageSizeSelect / no native form ancestor | {ariaLabel} | select | {value} | not declared |  |
| ACT-ui-kit-tsx-111-C123 | SearchSelect / no native form ancestor | {label} | text | {open ? query : selected?.label ?? ''} | not declared | disabled={disabled} |