import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LeaveType } from "@/models/leaveType";

export async function GET() {
  try {
    await connectDB();

    const existingTypes = await LeaveType.find({}).sort({ name: 1 }).lean();
    if (existingTypes.length > 0) {
      return NextResponse.json({ leaveTypes: existingTypes });
    }

    const seedTypes = [
      { name: "Vacation", code: "VAC", maxDays: 25, isActive: true },
      { name: "Sick Leave", code: "SICK", maxDays: 12, isActive: true },
      { name: "Personal", code: "PER", maxDays: 6, isActive: true },
    ];

    const created = await LeaveType.create(seedTypes);
    return NextResponse.json({ leaveTypes: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to load leave types" }, { status: 500 });
  }
}
