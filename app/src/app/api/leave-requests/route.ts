import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { LeaveRequest } from "@/models/leaveRequest";
import { User } from "@/models/user";
import { LeaveType } from "@/models/leaveType";

async function getHandler(request: NextRequest, user: { userId: string; role: string }) {
  try {
    await connectDB();

    const query = user.role === "employee" ? { employeeId: user.userId } : {};
    const requests = await LeaveRequest.find(query).sort({ createdAt: -1 }).lean();
    const employees = await User.find({}).select("_id name role").lean();
    const leaveTypes = await LeaveType.find({}).lean();

    return NextResponse.json({ requests, employees, leaveTypes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to load leave requests" }, { status: 500 });
  }
}

async function postHandler(request: NextRequest, user: { userId: string; role: string }) {
  try {
    const body = await request.json();
    const { leaveTypeId, startDate, endDate, reason, status = "pending" } = body;

    if (!leaveTypeId || !startDate || !endDate || !reason) {
      return NextResponse.json({ message: "All leave request fields are required" }, { status: 400 });
    }

    if (user.role !== "employee") {
      return NextResponse.json({ message: "Only employee accounts can create leave requests" }, { status: 403 });
    }

    await connectDB();
    const employee = await User.findById(user.userId);
    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    const created = await LeaveRequest.create({
      employeeId: user.userId,
      leaveTypeId,
      startDate,
      endDate,
      reason,
      status,
    });

    return NextResponse.json({ request: created }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create leave request" }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
