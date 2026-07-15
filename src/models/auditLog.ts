import { Schema, model, models } from "mongoose";

export interface IAuditLog extends Document {
  entityType: string;
  entityId: string;
  action: string;
  actorId: string;
  details: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    entityType: { type: String, required: true },
    entityId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    actorId: { type: String, required: true, index: true },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = models.AuditLog || model<IAuditLog>("AuditLog", auditLogSchema);
