# Plan: Leave Management App

## 1. Goal
Build a Leave Management App in Next.js that lets employees request time off, managers review requests, and admins manage leave policies and balances. The implementation should follow the quality bar described in the provided PDF: strict TypeScript, real authentication, a real database, server-side validation, and production-ready documentation.

## 2. Assumptions
- The app is intended for a small to mid-sized organization with three main roles: employee, manager, and admin.
- Leave requests will be stored in a relational database with a simple approval workflow: pending -> approved/rejected -> cancelled where appropriate.
- The initial release will focus on core leave workflows rather than payroll integration or calendar sync.
- A PostgreSQL database will be used for production readiness, with Prisma as the ORM.
- Authentication will be handled with a managed auth solution such as Auth.js or Clerk; the plan assumes a standard login flow with role-based access control.
- The first version will not include complex reporting, multi-company support, or external HRIS integration.
- Time zones will be handled at the application level for consistency, and leave dates will be stored in a normalized format.

## 3. Proposed Scope
### MVP features
- Employee can submit a leave request with start date, end date, leave type, and reason.
- Employee can view their own leave history and current balance by leave type.
- Manager can view pending requests for their team and approve or reject them.
- Admin can manage leave types, balances, and basic policy settings.
- System prevents invalid or conflicting requests where possible.
- Audit trail records key request lifecycle events.

## 4. User Stories
### Employee
- As an employee, I want to submit a leave request so that I can request time off formally.
- As an employee, I want to see my leave balance so I know how much leave I have remaining.
- As an employee, I want to view the status of my submitted requests so I know whether they are pending, approved, or rejected.
- As an employee, I want to cancel a pending request so I can withdraw it if my plans change.

### Manager
- As a manager, I want to review leave requests from my team so I can approve or reject them efficiently.
- As a manager, I want to see request details and history so I can make informed decisions.
- As a manager, I want to be notified of new requests so I do not miss approval actions.

### Admin
- As an admin, I want to manage leave types and policy defaults so the app reflects company rules.
- As an admin, I want to adjust employee balances so leave entitlements can be maintained accurately.
- As an admin, I want to view request activity so I can audit decisions and resolve issues.

## 5. Acceptance Criteria
### Authentication and access control
- Users can sign in and are redirected to the appropriate dashboard based on role.
- Employees can only access their own requests and balances.
- Managers can only view requests for their assigned team or department.
- Admins can access all management and audit views.

### Leave request workflow
- A leave request requires a valid leave type, start date, end date, and reason.
- The app rejects overlapping requests for the same employee where the policy does not allow multiple concurrent leave entries.
- The app prevents requests that exceed the employee’s available balance.
- Requests can move through pending, approved, rejected, and cancelled states with clear UI feedback.

### Dashboard and history
- The dashboard shows summary cards for pending requests, approved leave, and remaining balance.
- Each request displays its status, dates, leave type, and decision details.
- Empty states and error states are clearly handled.

### Administration
- Admins can create, edit, and disable leave types.
- Admins can update balances for employees and view a request audit trail.

## 6. Data Shapes
### User
```ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'admin';
  managerId?: string | null;
  departmentId?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Department
```ts
interface Department {
  id: string;
  name: string;
  managerId?: string | null;
  createdAt: string;
}
```

### LeaveType
```ts
interface LeaveType {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  defaultDaysPerYear?: number | null;
  createdAt: string;
  updatedAt: string;
}
```

### LeaveBalance
```ts
interface LeaveBalance {
  id: string;
  userId: string;
  leaveTypeId: string;
  availableDays: number;
  usedDays: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}
```

### LeaveRequest
```ts
interface LeaveRequest {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedAt: string;
  reviewedAt?: string | null;
  reviewedById?: string | null;
  reviewComment?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### AuditLog
```ts
interface AuditLog {
  id: string;
  entityType: 'leave_request' | 'leave_balance' | 'leave_type';
  entityId: string;
  action: string;
  actorId: string;
  details: Record<string, unknown>;
  createdAt: string;
}
```

## 7. Affected Files and Areas
The initial implementation should touch the following areas:
- App shell and route structure
  - src/app/page.tsx
  - src/app/dashboard/page.tsx
  - src/app/requests/page.tsx
  - src/app/admin/page.tsx
- Authentication and authorization
  - src/lib/auth.ts
  - src/middleware.ts
  - src/lib/permissions.ts
- Data layer and validation
  - prisma/schema.prisma
  - src/lib/db.ts
  - src/lib/validators/leave-request.ts
  - src/server/leave-requests.ts
- UI components
  - src/components/leave-request-form.tsx
  - src/components/request-list.tsx
  - src/components/approval-panel.tsx
  - src/components/dashboard-summary.tsx
- Tests and quality gates
  - tests/unit/leave-requests.test.ts
  - tests/e2e/leave-flow.spec.ts
- Documentation and project health
  - README.md
  - docs/architecture.md
  - .env.example
  - .github/workflows/ci.yml

## 8. Edge Cases
- Overlapping leave requests for the same employee.
- Requests spanning weekends or public holidays where policy differs.
- Partial-day requests if the product later supports them.
- Rejecting a request after it has already been approved.
- Cancelling an approved request when policy disallows it.
- Manager or admin actions by unauthorized users.
- Time zone mismatches between UI date selection and stored values.
- Requests with invalid dates or end dates earlier than start dates.
- High volume of requests causing race conditions in approval logic.
- Empty states for employee history and admin management screens.

## 9. Open Questions
- Should leave balances be calculated from a fixed annual entitlement or from a more flexible policy engine?
- Should the first version support half-day or multiple-day increments only, or full-day requests only?
- Should managers be assigned by department, team, or one-to-many reporting structure?
- Should public holidays be part of the core data model or handled as a later enhancement?
- Should approval be single-stage or multi-stage for more complex organizations?
- Should notifications be email-based, in-app only, or both?
- Do we need a calendar view in the MVP, or is a list-based workflow sufficient?

## 10. Recommended Implementation Approach
- Use Next.js App Router with TypeScript strict mode.
- Use Prisma with PostgreSQL for persistence and migrations.
- Use Zod for server-side validation at API and server action boundaries.
- Use server actions or route handlers for core leave logic, avoiding unsafe client-side state manipulation.
- Use Tailwind and accessible UI primitives such as shadcn/ui for the interface.
- Add automated tests for validation, workflow logic, and core user journeys.
- Document the architecture and the API/server action contracts as the work progresses.

## 11. Suggested Delivery Plan
1. Set up the project scaffold and authentication foundation.
2. Implement the core data model and database migrations.
3. Build employee leave request and history flows.
4. Build manager approval workflow.
5. Add admin leave type and balance management.
6. Add audit logging, tests, and documentation.
7. Deploy to Vercel and verify the core flow end to end.

## 12. Notes for Review
This plan is intentionally focused on an MVP that is realistic to build well within the guidance from the PDF while still being useful as a production-grade leave system. The next step should be approval of this plan before implementation begins.
