import { Schema, model, models } from "mongoose";

export interface ILeaveRequest extends Document {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reviewerId?: string;
  reviewComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    employeeId: { type: String, required: true, index: true },
    leaveTypeId: { type: String, required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    reviewerId: { type: String, default: null },
    reviewComment: { type: String, trim: true },
  },
  { timestamps: true }
);

export const LeaveRequest = models.LeaveRequest || model<ILeaveRequest>("LeaveRequest", leaveRequestSchema);
