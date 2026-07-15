# MongoDB Schema Plan

## Collections

### users
- _id: ObjectId
- name: string
- email: string (unique)
- password: string (hashed)
- role: enum (employee, manager, admin)
- department: string
- managerId: ObjectId | null
- createdAt, updatedAt

### leaveTypes
- _id: ObjectId
- name: string
- code: string (unique)
- maxDays: number
- isActive: boolean
- createdAt, updatedAt

### leaveBalances
- _id: ObjectId
- userId: ObjectId (index)
- leaveTypeId: ObjectId (index)
- totalDays: number
- usedDays: number
- remainingDays: number
- year: number
- createdAt, updatedAt

### leaveRequests
- _id: ObjectId
- employeeId: ObjectId (index)
- leaveTypeId: ObjectId (index)
- startDate: Date
- endDate: Date
- reason: string
- status: enum (pending, approved, rejected, cancelled)
- reviewerId: ObjectId | null
- reviewComment: string
- createdAt, updatedAt

### auditLogs
- _id: ObjectId
- entityType: string
- entityId: ObjectId
- action: string
- actorId: ObjectId
- details: object
- createdAt

## Notes
- All auth credentials use hashed passwords.
- JWTs will be used for stateless authentication and should be passed in the Authorization header.
- Mongoose models are designed to be expanded with validation and indexes as the product grows.
