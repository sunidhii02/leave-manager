import { Schema, model, models } from "mongoose";

export interface ILeaveBalance extends Document {
  userId: string;
  leaveTypeId: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    userId: { type: String, required: true, index: true },
    leaveTypeId: { type: String, required: true, index: true },
    totalDays: { type: Number, required: true, min: 0 },
    usedDays: { type: Number, required: true, min: 0, default: 0 },
    remainingDays: { type: Number, required: true, min: 0 },
    year: { type: Number, required: true, min: 2000 },
  },
  { timestamps: true }
);

export const LeaveBalance = models.LeaveBalance || model<ILeaveBalance>("LeaveBalance", leaveBalanceSchema);
