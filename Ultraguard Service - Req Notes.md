
App Title (Tentatively) : WorkshopOS  

(Tentatively) Tagline:   Workshop Management. Simplified.  

 # Business Requirements Document (BRD)

## Car SPA / Detailing / Workshop Management System

### 1. Purpose

The objective is to develop a simple, role-based Workshop Management Application for automotive 
service businesses such as:

* Car SPA / Detailing Centres
* PPF Studios
* Ceramic Coating Centres
* Paint & Body Shops
* Car Accessories Shops
* General Repair Workshops
* Multi-service Automobile Workshops

The application shall manage the complete customer and vehicle journey from 
**vehicle arrival to final delivery**, while also providing accurate tracking of:

* Customer and Vehicle
* Service Requests
* Estimates
* Job Cards
* Service Advisor Responsibility
* Work Progress
* Inventory / Materials
* Technician / Worker Allocation
* Quality Control
* Billing
* Payments
* Customer Delivery
* Stock Reconciliation
* Management Reports

The key objective is to eliminate disconnected Excel-based inventory tracking and introduce
 traceability between:

**Stock → Job Card → Consumption → Invoice → Payment**

---

# 2. Core Business Concept

Every vehicle entering the workshop should eventually be associated with a unique **Job Card**.

The Job Card will act as the central document connecting:

**Customer
↓
Vehicle
↓
Visit / Reception Entry
↓
Service Advisor
↓
Inspection
↓
Estimate
↓
Customer Approval
↓
Job Card
↓
Inventory / Material Allocation
↓
Work Execution
↓
Quality Check
↓
Completion
↓
Invoice
↓
Payment
↓
Vehicle Delivery**

Management should therefore be able to open any Job Card and understand the entire commercial
 and operational history of that particular vehicle visit.

---

# 3. Proposed Application Structure

The application should preferably be designed as an **admin-configurable platform rather
 than hard-coded specifically for PPF or Ceramic services**.

For example, the Admin can configure:

### Service Category

* PPF
* Ceramic Coating
* Car Detailing
* Paint Work
* Denting
* Interior Treatment
* Accessories Installation

Under a category:

### Service

PPF:

* Full Body PPF
* Bonnet PPF
* Bumper PPF
* Headlight PPF
* Door Edge PPF

Ceramic:

* 1-Year Ceramic
* 3-Year Ceramic
* 5-Year Ceramic
* Interior Ceramic
* Glass Ceramic

Paint:

* Full Body Paint
* Bumper Paint
* Door Paint
* Panel Paint

New categories and services should be configurable from the Admin Portal without requiring a software deployment.

---

# 4. User Roles

## Level 0 – Super Admin

Platform-level administration.

Can:

* Manage businesses / branches
* Configure subscription
* Configure global masters
* Configure application settings
* View all data
* Manage Business Admins

Primarily relevant when the software becomes SaaS / multi-client.

---

## Level 1 – Business Owner / Admin

Complete control of an individual business.

Can:

* View Dashboard
* Manage Employees
* Configure Service Categories
* Configure Services
* Configure Inventory
* Configure Pricing
* Configure Taxes
* View all Job Cards
* Approve discounts
* Approve inventory adjustments
* View financial reports
* View inventory reconciliation
* Configure workflow
* Access audit logs

---

## Level 2 – Workshop Manager / Branch Manager

Operational control of the workshop.

Can:

* View all vehicle jobs
* Allocate Service Advisors
* Reassign jobs
* Approve estimates
* Monitor workshop status
* Monitor delayed jobs
* Allocate manpower
* Approve material issues
* Conduct / approve QC
* Mark vehicles ready for delivery

---

## Level 3 – Reception / Front Desk

Responsible for customer intake.

Can:

* Search existing customers
* Add customer
* Add vehicle
* Create visit
* Capture vehicle arrival information
* Record customer complaints / requirements
* Take vehicle photos
* Record odometer reading
* Record fuel level
* Record vehicle condition
* Assign / request Service Advisor
* Print / share acknowledgement

---

## Level 3 – Service Advisor

The Service Advisor will be the primary owner of the customer relationship for the Job Card.

Can:

* Review customer requirement
* Inspect vehicle
* Add recommended services
* Prepare estimate
* Discuss estimate with customer
* Record customer approval
* Create / activate Job Card
* Add services
* Request materials
* Monitor job progress
* Communicate expected delivery
* Mark work complete
* Initiate QC
* Generate final estimate / billing request

---

## Level 4 – Technician / Applicator / Worker

Can:

* View assigned jobs
* Start work
* Pause work
* Resume work
* Add work notes
* Request material
* Record actual material consumed
* Upload work photographs
* Mark assigned task complete

Examples:

* PPF Technician
* Ceramic Technician
* Painter
* Detailer
* Electrician
* Accessories Installer

---

## Inventory / Store Manager

Responsible for warehouse operations.

Can:

* Receive material
* Maintain stock
* Issue material against Job Card
* Receive unused material
* Record wastage
* Record damaged stock
* Perform stock adjustment
* Conduct stock audit
* View stock reconciliation

---

## Billing / Cashier

Can:

* Prepare final bill
* Apply approved discount
* Generate invoice
* Receive payment
* Record payment mode
* Handle split payments
* Mark payment complete
* Generate receipt

---

# 5. Complete Operational Workflow

## Stage 1 – Vehicle Arrival

Customer enters the workshop.

Reception searches using:

* Customer Mobile Number
* Vehicle Registration Number

If customer exists, previous information is retrieved.

Otherwise, a new customer is created.

---

# 6. Customer Master

Information:

* Customer ID
* Customer Name
* Mobile Number
* Alternate Mobile
* Email
* Address
* GST Number, if applicable
* Customer Type

  * Individual
  * Corporate
  * Dealer
  * Fleet
* Notes

A customer may own multiple vehicles.

---

# 7. Vehicle Master

Information:

* Registration Number
* Customer
* Vehicle Make
* Vehicle Model
* Variant
* Manufacturing Year
* Fuel Type
* Colour
* VIN / Chassis Number
* Engine Number – Optional
* Current Odometer
* Insurance Information – Optional

Example:

Customer: Rahul Sharma

Vehicles:

* OD02AB1234 – Hyundai Creta
* OD02CD5678 – Mahindra Thar

---

# 8. Vehicle Reception / Check-In

Whenever a vehicle arrives, a new **Visit / Check-In Number** is created.

Example:

VIS-2026-00982

Capture:

* Arrival Date
* Arrival Time
* Odometer Reading
* Fuel Level
* Number of Keys
* Vehicle Documents Received
* Accessories present
* Spare Wheel status
* Existing Damage
* Customer Complaint
* Requested Services

### Mandatory Vehicle Photographs

Recommended:

* Front
* Rear
* Left
* Right
* Dashboard / Odometer
* Existing damages

Additional photos can be captured.

This protects both customer and workshop in case of disputes regarding pre-existing scratches/damage.

---

# 9. Service Advisor Assignment

Reception assigns a Service Advisor.

Example:

Visit: VIS-2026-00982

Customer: Rahul Sharma

Vehicle: Hyundai Creta

Service Advisor: Amit

Once assigned, Amit becomes primarily responsible for the customer and vehicle until 
delivery unless reassigned.

The system should record reassignment history.

---

# 10. Vehicle Inspection

Service Advisor conducts inspection.

Two types of requirements may be recorded:

### Customer Requested

Example:

* Full Body PPF
* Interior Cleaning

### Workshop Recommended

Example:

* Windshield Ceramic
* Alloy Ceramic
* Paint Correction

This distinction is useful for future analytics.

---

# 11. Estimate Preparation

Service Advisor prepares an Estimate.

Example:

| Service            | Qty |    Rate |  Amount |
| ------------------ | --: | ------: | ------: |
| Full Body PPF      |   1 | ₹70,000 | ₹70,000 |
| Paint Correction   |   1 |  ₹8,000 |  ₹8,000 |
| Interior Detailing |   1 |  ₹5,000 |  ₹5,000 |

Estimate:

₹83,000

Discount:

₹3,000

Net:

₹80,000 + applicable GST.

---

# 12. Customer Approval

Estimate status:

**Draft → Sent → Approved / Partially Approved / Rejected**

Approval can be recorded through:

* Digital Signature
* OTP
* WhatsApp confirmation reference
* Manual confirmation recorded by Service Advisor

For MVP, even a simple:

**Approved by Customer – Yes / No**

with:

* Date
* Time
* Employee
* Approval Notes

would be sufficient.

Later WhatsApp integration can be introduced.

---

# 13. Job Card Creation

After approval, Job Card is activated.

Example:

**JC-2026-001245**

Job Card contains:

### Customer Information

### Vehicle Information

### Service Advisor

### Approved Services

### Estimated Material

### Estimated Labour

### Estimated Completion Date

### Estimated Completion Time

### Customer Instructions

### Internal Instructions

---

# 14. Job Card Status

Recommended lifecycle:

**Draft**

↓

**Awaiting Customer Approval**

↓

**Approved**

↓

**Waiting for Work**

↓

**In Progress**

↓

**Quality Check**

↓

**Completed**

↓

**Awaiting Billing**

↓

**Invoice Generated**

↓

**Payment Pending**

↓

**Ready for Delivery**

↓

**Closed / Delivered**

Additional statuses:

* On Hold
* Waiting for Material
* Customer Approval Pending
* Cancelled

The software should maintain a complete timestamp history of these status changes.

---

# 15. Work Order / Task Management

A Job Card may contain multiple individual tasks.

Example:

### Job Card JC-1245

**Task 1**
Paint Correction
Assigned: Technician A

**Task 2**
Full Body PPF
Assigned: Technician B + Technician C

**Task 3**
Ceramic – Alloy
Assigned: Technician D

Each task should have:

* Task
* Technician
* Start Time
* Completion Time
* Status
* Notes
* Photos

Task status:

**Pending → Assigned → In Progress → Completed**

This allows management to understand exactly where a vehicle is stuck.

---

# 16. Inventory Management

This is one of the most important components.

The system should maintain:

### Item Master

Fields:

* Item Code
* Item Name
* Category
* Brand
* SKU
* Unit of Measurement
* Purchase Rate
* Selling Rate
* GST
* Minimum Stock
* Reorder Level
* Warehouse
* Batch / Roll Number where required

---

# 17. Inventory Categories

Admin controlled.

Examples:

### PPF

* Garware PPF
* Llumar PPF
* XPEL PPF
* Paint Protection Film Roll

Units can be:

* Roll
* Meter
* Square Feet
* Square Meter

### Paint

* Paint
* Primer
* Clear Coat
* Hardener
* Thinner

Units:

* Litre
* ML
* Can

### Ceramic

* Ceramic Coating
* Glass Coating
* Leather Coating

Units:

* Bottle
* ML

### Consumables

* Microfiber Cloth
* Masking Tape
* Sandpaper
* Polish
* Compound
* Shampoo

---

# 18. Stock Transactions

Every stock movement must create a transaction.

Transaction Types:

* Purchase / GRN
* Stock In
* Job Card Issue
* Job Card Return
* Wastage
* Damage
* Adjustment
* Transfer
* Stock Audit Adjustment

This creates a proper Inventory Ledger.

---

# 19. Job Card Material Planning

During Estimate / Job Card creation, the Service Advisor can estimate materials.

Example:

Full Body PPF:

Estimated:

PPF Film: 18 metres

Job Card reserves approximately:

18 metres

This gives management visibility into committed inventory.

---

# 20. Material Issue

Store Manager receives material request.

Example:

Job Card:

JC-1245

Requested:

XPEL PPF
10 metres

Store Manager issues:

10 metres.

Inventory reduces accordingly.

Most importantly:

**Inventory should never be manually reduced simply because a Job Card was created.**

Actual stock should move only when Store issues the item.

---

# 21. Material Consumption

Technician records actual consumption.

Example:

Issued:

10 metres

Consumed:

8.7 metres

Returned:

1 metre

Wastage:

0.3 metre

System automatically reconciles:

**Issued = Consumed + Returned + Wastage**

10 = 8.7 + 1 + 0.3

This single control will eliminate a large number of inventory leakage problems.

---

# 22. Job Card Inventory Reconciliation

Before Job Card can be fully closed, the system should verify:

### Material Issued

versus

### Material Consumed

*

### Material Returned

*

### Material Wasted

Any difference should appear as:

**Unreconciled Quantity**

Example:

Issued: 20 metres

Consumed: 17 metres

Returned: 2 metres

Wastage: 0.5 metres

Difference: 0.5 metre

Job Card should show:

⚠ **Inventory Reconciliation Pending – 0.5 metre**

Workshop Manager must resolve this before closure.

---

# 23. Estimate vs Actual Material Analysis

Management should later be able to analyse:

| Item     | Estimated | Actual |
| -------- | --------: | -----: |
| PPF Film |      18 M |   20 M |
| Ceramic  |     50 ML |  45 ML |
| Polish   |    200 ML | 250 ML |

This helps identify:

* Wrong estimation
* Technician inefficiency
* Excess wastage
* Possible material leakage
* Incorrect pricing

---

# 24. Additional Work During Job

Very common workshop scenario:

Customer initially approves ₹40,000.

During work another requirement is discovered.

Example:

Additional paint correction ₹6,000.

The technician should NOT simply add the work.

Service Advisor creates:

**Supplementary Estimate**

Customer approval is obtained.

Only after approval should the new service be added to the Job Card.

This provides a proper audit trail.

---

# 25. Work Progress Photographs

Job Card should allow photographs under:

### Before Work

### Work In Progress

### After Work

This is particularly useful for:

* PPF
* Paint
* Ceramic
* Denting
* Detailing

and also creates valuable evidence in case of disputes.

---

# 26. Quality Control

Technician completing work should NOT automatically mean that the vehicle is ready.

Recommended flow:

Technician:

**Work Completed**

↓

QC Person / Service Advisor:

**Quality Check**

QC checklist can depend upon Service Category.

Example PPF QC:

* Edge finishing checked
* Air bubbles checked
* Alignment checked
* Panel coverage checked
* Surface scratches checked
* Adhesion checked
* Vehicle cleanliness checked

Result:

**PASS**

or

**REWORK REQUIRED**

---

# 27. Rework Management

If QC fails:

Task returns to:

**Rework**

Reason should be captured.

Example:

* Air bubble
* Improper finishing
* Paint mismatch
* Scratch
* Customer complaint

Rework history should remain available.

This eventually gives management a valuable report:

### Rework % by Technician

---

# 28. Job Completion

After:

* All tasks completed
* QC passed
* Inventory reconciled
* Supplementary jobs approved

Service Advisor marks:

**JOB COMPLETED**

The vehicle then moves to billing.

---

# 29. Billing

The system can initially work alongside Tally.

Recommended architecture:

### Operational System

New Workshop Application

handles:

* Estimate
* Job Card
* Inventory
* Work
* QC
* Customer
* Payment tracking

### Accounting System

Tally

continues handling:

* GST Accounting
* Accounting Ledgers
* Financial Books
* GST Returns

---

# 30. Tally Integration Strategy

I would recommend two phases.

### Phase 1

System generates:

* Final Job Summary
* Invoice Details
* Tax Breakdown

Billing team enters / imports accounting transaction into Tally.

Invoice number from Tally can be entered against Job Card.

### Phase 2

Integrate Tally through:

* XML
* API / Connector
* Export mechanism

so invoices automatically move to Tally.

This prevents unnecessarily complicating the initial product.

---

# 31. Payment Management

Support:

* Cash
* UPI
* Credit Card
* Debit Card
* Bank Transfer
* Credit
* Split Payment

Example:

Invoice:

₹75,000

Payment:

₹25,000 UPI

₹50,000 Card

System should support multiple payment transactions against the same invoice.

---

# 32. Advance Payment

Particularly relevant for expensive jobs like PPF.

Example:

Estimate: ₹1,00,000

Advance: ₹30,000

Balance:

₹70,000

The advance should remain linked with the Job Card / Invoice.

---

# 33. Vehicle Delivery

Once:

* Job Completed
* QC Passed
* Invoice Generated
* Required Payment Completed

vehicle can move to:

**Ready for Delivery**

At vehicle handover capture:

* Delivery Date
* Delivery Time
* Final Odometer
* Customer acknowledgement
* Delivered By
* Customer Signature – Optional
* Delivery Photo – Optional

Status becomes:

**CLOSED / DELIVERED**

---

# 34. Mandatory Closure Controls

A Job Card ideally should NOT be closed if:

* Tasks remain incomplete
* QC not completed
* Inventory is unreconciled
* Invoice is not generated
* Payment requirement is not fulfilled

Admin can override these conditions with appropriate authorization.

All overrides must be recorded in Audit Log.

---

# 35. Appointment Management – Recommended

Customers can book:

* Date
* Time
* Vehicle
* Required Service
* Preferred Advisor

Appointment states:

**Scheduled → Arrived → Converted to Job Card → Completed**

Useful for workload planning.

---

# 36. Workshop Dashboard

Management dashboard should provide at-a-glance information.

### Today's Operations

* Vehicles Arrived
* Vehicles In Workshop
* Jobs In Progress
* Vehicles Waiting for Material
* Vehicles Waiting for Customer Approval
* Vehicles in QC
* Ready for Delivery
* Delivered Today

### Revenue

* Today's Billing
* This Month Billing
* Payments Received
* Outstanding Amount

### Inventory

* Low Stock
* Stock Value
* Unreconciled Material
* High Wastage Items

---

# 37. Workshop Floor Board

A highly useful operational screen should display vehicle jobs similar to a workshop control board.

Example:

| Vehicle | Advisor | Service | Status           | Technician | Delivery |
| ------- | ------- | ------- | ---------------- | ---------- | -------- |
| Creta   | Amit    | PPF     | In Progress      | Ravi       | 5 PM     |
| Thar    | Raj     | Ceramic | QC               | Sunil      | 3 PM     |
| BMW X1  | Amit    | Paint   | Material Waiting | Arjun      | Tomorrow |

This screen could eventually be displayed on a TV/tablet inside the workshop.

---

# 38. Reports

## Customer Reports

* Customer History
* Customer-wise Revenue
* Repeat Customers
* Service History

## Vehicle Reports

* Vehicle Service History
* Jobs Performed
* Historical Odometer

## Service Reports

* Revenue by Service
* Service Category Performance
* Most Popular Service
* Average Ticket Size

## Advisor Reports

* Jobs handled
* Revenue generated
* Conversion ratio
* Average Job Value
* Customer approval rate

## Technician Reports

* Jobs completed
* Productivity
* Average Completion Time
* Rework %
* Material Consumption
* Wastage

## Inventory Reports

* Current Stock
* Stock Ledger
* Low Stock
* Material Consumption
* Job-wise Consumption
* Wastage
* Stock Adjustment
* Fast Moving Items
* Slow Moving Items

## Financial Reports

* Daily Billing
* Monthly Billing
* Outstanding
* Payment Mode Summary
* Discount Report
* Revenue by Service Category

---

# 39. Critical Reconciliation Report

One of the most important reports should be:

## Job Card Profitability / Reconciliation

For every Job Card:

**Service Revenue**

minus

**Material Cost**

minus

**Estimated Labour Cost**

=

**Gross Contribution**

Example:

Revenue: ₹80,000

Material Cost: ₹29,000

Labour Cost: ₹8,000

Gross Contribution: ₹43,000

Even if detailed accounting remains in Tally, this provides management with operational profitability.

---

# 40. Inventory Reconciliation Dashboard

Management should easily see:

### Opening Stock

*

### Purchases

*

### Job Consumption

*

### Wastage

+/-

### Adjustments

=

### Expected Closing Stock

versus

### Physical Closing Stock

The difference becomes:

**Stock Variance**

This is where the existing Excel-based loose ends can be addressed.

---

# 41. Service Packages

Admin should be able to create packages.

Example:

## Premium Detailing Package

Includes:

* Exterior Wash
* Interior Cleaning
* Paint Correction
* Ceramic Coating

Package Price:

₹24,999

Internally, package components and required materials remain visible.

---

# 42. Dynamic Category Configuration

This is important for making the software reusable.

Instead of programming:

`PPF Module`

the architecture should use:

### Service Category

↓

### Service

↓

### Service Package

↓

### Required Materials

↓

### Checklist

↓

### Workflow

For example:

Admin creates:

**Category:** Tyre Services

Services:

* Wheel Alignment
* Wheel Balancing
* Tyre Replacement

Another business can configure:

**Category:** Mechanical Repair

Services:

* Engine Service
* Brake Repair
* Suspension Repair

No software change should be required.

---

# 43. Masters

Recommended Admin Masters:

### Business Masters

* Branch
* Department
* Employee
* Role

### Customer Masters

* Customer Type
* Lead Source

### Vehicle Masters

* Manufacturer
* Model
* Variant
* Fuel Type
* Vehicle Type

### Service Masters

* Service Category
* Service
* Service Package
* Service Checklist
* Pricing

### Inventory Masters

* Item Category
* Brand
* Item
* Unit
* Warehouse
* Supplier

### Finance Masters

* Tax
* Payment Mode
* Discount Reason

### Workflow Masters

* Job Status
* QC Checklist
* Cancellation Reason
* Rework Reason
* Wastage Reason

---

# 44. Notifications

Recommended notifications:

### Service Advisor

* New Job Assigned
* Customer Approval Received
* Technician Completed Work
* QC Failed
* Customer Payment Pending

### Store

* Material Requested
* Low Stock Alert

### Workshop Manager

* Job Delivery Delayed
* Excess Material Consumption
* High Wastage
* QC Failure

### Customer – Future Phase

WhatsApp / SMS:

* Vehicle Received
* Estimate Ready
* Estimate Approval Link
* Work Started
* Vehicle Ready
* Invoice
* Payment Link
* Service Reminder

---

# 45. Audit Trail

Every important transaction should record:

* Created By
* Created Date/Time
* Modified By
* Modified Date/Time

Critical changes should preserve old and new values.

Especially:

* Estimate changes
* Discounts
* Material adjustments
* Wastage
* Stock adjustments
* Job cancellations
* Payment changes
* Invoice changes
* Status overrides

---

# 46. Suggested Data Entities

The broad database structure could include:

1. Business
2. Branch
3. User
4. Role
5. Employee
6. Customer
7. Vehicle
8. Appointment
9. VehicleVisit
10. VehicleInspection
11. VehiclePhoto
12. Estimate
13. EstimateItem
14. CustomerApproval
15. JobCard
16. JobCardService
17. JobTask
18. TechnicianAssignment
19. ServiceCategory
20. ServiceMaster
21. ServicePackage
22. ItemCategory
23. ItemMaster
24. Warehouse
25. StockLedger
26. MaterialRequest
27. MaterialIssue
28. MaterialConsumption
29. MaterialReturn
30. MaterialWastage
31. QCInspection
32. QCChecklist
33. Rework
34. Invoice
35. InvoiceItem
36. Payment
37. Delivery
38. Notification
39. AuditLog

This architecture leaves sufficient room for future expansion.

---

# 47. Mobile / Tablet Usage

The application should be responsive.

Recommended:

### Desktop

Primarily for:

* Admin
* Accounts
* Inventory
* Reports

### Tablet

Primarily for:

* Reception
* Service Advisor
* Workshop Manager

### Mobile

Primarily for:

* Technician
* Photo Upload
* Task Update
* Material Request
* QC

A PWA architecture can be considered so technicians do not necessarily require a native Android app initially.

---

# 48. Recommended MVP

The first version should remain operationally simple.

## Phase 1 – MVP

### Customer & Vehicle

* Customer
* Vehicle
* Visit / Check-In
* Vehicle Photos

### Workshop

* Service Advisor Assignment
* Estimate
* Job Card
* Job Status
* Technician Tasks

### Inventory

* Item Master
* Stock In
* Material Request
* Material Issue
* Consumption
* Return
* Wastage
* Job Reconciliation

### Completion

* QC
* Job Completion
* Invoice Information
* Payment
* Delivery

### Dashboard

* Current Workshop Status
* Basic Sales
* Basic Inventory

This itself should solve approximately 80% of the operational control problem.

---

# 49. Phase 2

Add:

* Appointments
* WhatsApp integration
* Digital Estimate Approval
* Tally Integration
* Purchase Orders
* Supplier Management
* GRN
* Advanced Reports
* Service Reminders
* Customer Feedback
* Loyalty / Membership
* Packages
* Warranty Tracking

---

# 50. Phase 3 / SaaS Expansion

The platform can later support multiple businesses.

Structure:

**Platform**

→ Business

→ Branch

→ Department

→ User

Each Business configures its own:

* Services
* Categories
* Prices
* Inventory
* Taxes
* Workflow
* Users
* Roles

This turns the solution from a custom Car SPA application into a reusable automotive service SaaS product.

---

# 51. Important Management Controls

From a workshop management perspective, I would make the following rules fundamental to the application:

### Rule 1

No material should leave the Store without a Job Card or authorized reason.

### Rule 2

Every Job Card should have an accountable Service Advisor.

### Rule 3

Every issued material must eventually become one of:

**Consumed / Returned / Wastage**

### Rule 4

Additional customer work should require additional approval.

### Rule 5

Technician completion and QC approval should be separate activities.

### Rule 6

Vehicle delivery should happen only after operational and financial closure requirements are satisfied.

### Rule 7

Stock adjustments and discounts should always require authorization and audit history.

---

# 52. The Core Reconciliation Model

The biggest improvement over their existing Excel/Tally process will come from linking these five numbers:

### Estimate

What did we expect to use?

↓

### Material Reserved

What was provisionally planned?

↓

### Material Issued

What physically left the store?

↓

### Actual Consumption

What was actually used?

↓

### Invoice

What did we charge the customer?

Management can then identify situations such as:

**Estimated PPF: 15 metres
Issued: 19 metres
Consumed: 18 metres
Returned: 1 metre
Customer charged for service assuming 15 metres**

This becomes an immediate operational variance that management can investigate.

---

# 53. Recommended Product Philosophy

The application should feel extremely simple to workshop employees.

An employee should not need to understand ERP terminology.

Reception sees:

**Check-In Vehicle**

Service Advisor sees:

**My Jobs**

Technician sees:

**My Tasks**

Store sees:

**Material Requests**

Cashier sees:

**Pending Billing**

Manager sees:

**Workshop Dashboard**

Owner sees:

**Business Dashboard**

The complexity should remain in the backend, while each role sees only what is relevant to them.

---

# 54. Success Criteria

The system will be considered successful when management can answer these questions instantly:

1. How many cars are currently inside the workshop?
2. Who is responsible for each car?
3. What work is being performed?
4. What was promised to the customer?
5. What is the promised delivery time?
6. Which jobs are delayed?
7. Which materials were issued for a particular vehicle?
8. How much material was actually consumed?
9. How much material was returned?
10. How much was wasted?
11. Does physical inventory reconcile with system inventory?
12. What was estimated to the customer?
13. What was finally invoiced?
14. How much was collected?
15. Is any payment outstanding?
16. Which technician performed the work?
17. Did the vehicle pass QC?
18. Has the vehicle been delivered?
19. What is the approximate profitability of the Job Card?
20. Which services, advisors and technicians are performing best?

If all twenty questions can be answered reliably from the application, the core business requirement
 has been achieved.

 
 
 
 
 
 
 
 
 