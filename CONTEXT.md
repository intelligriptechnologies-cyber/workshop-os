# WorkshopOS — reference-based list-view notes

## Purpose and constraints

These notes capture the representation and layout patterns visible in the five images under `Garage App alternative Snaps/Spec`. They are direction for review, not an instruction to copy the reference application's branding or data model.

- Keep the current WorkshopOS color palette, typography, borders, and role-based accents.
- Borrow information hierarchy, spacing, density, view modes, and control placement.
- Treat the screenshots as presentation references rather than pixel-perfect designs.
- Do not introduce new domain entities or change WorkshopOS lifecycle behavior solely because a field or action appears in a screenshot.
- Desktop is the primary reference. Responsive layouts should remain usable without reproducing the screenshots exactly.

## Shared list-page structure

All list pages in the references sit inside a persistent desktop workspace with left navigation and a top account/workspace header. The content area follows this order:

1. Page title and short explanatory subtitle where useful.
2. Search/filter toolbar in a separate full-width surface.
3. Grid/Table or Grid/List view toggle aligned left above the results.
4. Result range and pagination aligned right on the same row as the view toggle.
5. Cards or table rows below, with actions attached to each record.

Recommended reusable WorkshopOS primitives:

- `ListPageHeader`: title, subtitle, and primary page action.
- `ListFilterBar`: search, select filters, optional show/hide-filters control.
- `ViewModeToggle`: Grid and Table/List choices with icon and text.
- `ResultPagination`: “Showing X to Y of Z” plus page number and previous/next controls.
- `RecordCard`: consistent sections for identity, metadata, status, value, and actions.
- `RecordActions`: a predictable View/Edit/Archive/Download arrangement.
- `StatusBadge` and `PriorityBadge`: semantic variants mapped to existing WorkshopOS colors.
- `EmptyState`: clear no-results message and a reset-filters action.

Search, filters, view mode, and current page should remain stable while opening and returning from a record where practical.

## Vehicle list

Reference: `Vehicle List view.jpeg`.

### Page layout

- Full-width vehicle search at the top.
- View toggle below search on the left, with result range and pagination on the right.
- Three equal-width cards per desktop row with generous horizontal gaps.
- Table view as the alternate dense representation, although its contents are not shown.

### Vehicle card hierarchy

1. Registration number as the strongest identifier.
2. Make and model as the secondary heading.
3. Variant/year/fuel summary on one compact line when those values exist in WorkshopOS.
4. Small color swatch followed by the color name.
5. Customer block with name and mobile number.
6. Two equal-width actions at the bottom: Edit and Delete/Archive.

Use Archive where WorkshopOS currently archives rather than hard-deletes. Do not fabricate variant or year when those fields are unavailable.

## Job-card list

References: `Job Card List.jpeg` and `Job Card List View.jpeg`.

### Filter and result controls

- A titled “Job Card Filters” surface above results.
- Search across job-card number, customer, and vehicle.
- Status as the primary select filter.
- Optional “Show Filters” control for advanced filters.
- Grid as the default mode and Table as the alternate.
- Four cards per desktop row.
- Pagination showing both visible range and page count.

### Job-card hierarchy

1. Vehicle identity strip at the top with registration number.
2. Vehicle make/model.
3. Job-card number and date/reference line.
4. Priority, primary status, and workflow-stage badges grouped together.
5. Customer name and mobile in a distinct section.
6. Total cost aligned as label left/value right.
7. Inline status selector for permitted users.
8. Two-by-two actions: View, Edit, Delete/Archive, Download.

The reference uses High/Medium priority and Pending/In Progress/Delivered states. WorkshopOS should display only its current vocabulary and permissions. Existing WorkshopOS status colors remain authoritative.

### Table representation

The references show the toggle but not the expanded table. Derive it from card information rather than inventing fields. Suggested columns: Job Card, Vehicle, Customer, Priority, Status, Total, and Actions. On narrow screens, prefer stacked cards over a compressed table.

## Vehicle media gallery

Reference: `Gallery Media List View.jpeg`.

### Page and controls

- Clear title and subtitle describing before/after documentation.
- One toolbar row with search, Job Card, Category, and Type filters, view toggle, and primary Upload Vehicle Media action.
- KPI strip immediately below: Total Images, Before Images, After Images, and Job Cards.
- Image-first card grid below the KPI strip.

### Media card hierarchy

1. Large preview with consistent aspect ratio.
2. Overlay labels such as Before, After, Inspection, and Other.
3. `+N more` overlay when one card represents related images.
4. Vehicle registration as the primary text below the image.
5. Job-card identity and capture date/time as supporting metadata.
6. Compact View, Edit, and Delete/Archive actions.

Grid is the visual browsing mode; List is the dense management mode. Missing image sources should use the existing WorkshopOS placeholder treatment.

## Job-card detail/workspace

Reference: `Job Card details.jpeg`.

This is not a list view, but it shows how a selected record should open:

- Back navigation and clear “Job Card Workspace” heading.
- Contextual quick actions aligned right: Add Customer, Add Vehicle, and Add Mechanic.
- Two-column desktop workspace.
- Narrow left context column with Customer & Vehicle summary and Media Gallery/upload controls.
- Wider right column containing the job-card form.
- Related fields grouped under section headings.
- Searchable/addable selectors for customer, vehicle, service type, and mechanics.
- Delivery date, priority, and status presented as normal job-card fields.

Preserve current WorkshopOS job-card fields, permissions, and lifecycle commands. The useful pattern is linked context beside the form, not the reference application's exact field set.

## Recommended adaptation targets

| Existing WorkshopOS area | Representation direction |
| --- | --- |
| `JobRows`, Admin Jobs, advisor queue | Shared job-card grid/table modes, filters, pagination summary, and consistent actions |
| Vehicle master | Searchable vehicle list with three-column cards and table mode; retain current editor and archive behavior |
| Photo editor | Image-first gallery with filters, KPIs, grid/list mode, and upload action; retain current photo categories and mutations |
| Job-card editor | Two-column selected-record workspace with linked customer/vehicle/media context beside the form |

## Responsive expectations

- Four-column job cards collapse to two columns, then one.
- Three-column vehicle cards collapse to two, then one.
- Filter controls wrap logically; search becomes full width when space is limited.
- View toggle, result count, and pagination may stack but stay grouped.
- Actions remain comfortably tappable and never depend on hover.
- Dense table mode may switch to cards on small screens instead of forcing horizontal scrolling.

## Review decisions still needed

- Remember grid/table choice per page or only for the current session?
- Which WorkshopOS roles may edit status directly from a job-card list?
- Does Download map to an existing job-card export, or should it be omitted for now?
- Should vehicle/media destructive-action labels always say Archive to match current behavior?
- What should the page size be? The references show 10 records per page.
