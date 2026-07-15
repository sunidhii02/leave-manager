import { Schema, model, models } from "mongoose";

export interface ILeaveType extends Document {
  name: string;
  code: string;
  maxDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const leaveTypeSchema = new Schema<ILeaveType>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    maxDays: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LeaveType = models.LeaveType || model<ILeaveType>("LeaveType", leaveTypeSchema);
