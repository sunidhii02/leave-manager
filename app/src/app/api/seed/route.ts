import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LeaveType } from "@/models/leaveType";
import { User } from "@/models/user";

export async function POST() {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      await User.create({
        name: "Demo Admin",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      });
    }

    const existingEmployee = await User.findOne({ email: "employee@example.com" });
    if (!existingEmployee) {
      await User.create({
        name: "Demo Employee",
        email: "employee@example.com",
        password: "password123",
        role: "employee",
      });
    }

    const existingTypes = await LeaveType.find({});
    if (existingTypes.length === 0) {
      await LeaveType.create([
        { name: "Vacation", code: "VAC", maxDays: 25, isActive: true },
        { name: "Sick Leave", code: "SICK", maxDays: 12, isActive: true },
        { name: "Personal", code: "PER", maxDays: 6, isActive: true },
      ]);
    }

    return NextResponse.json({ message: "Seed data created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Seeding failed" }, { status: 500 });
  }
}
