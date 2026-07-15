import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { LeaveRequest } from "@/models/leaveRequest";
import { User } from "@/models/user";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Only admin accounts can approve or cancel leave requests" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, reviewComment } = body;

    await connectDB();
    const reviewer = await User.findById(decoded.userId);
    if (!reviewer || reviewer.role !== "admin") {
      return NextResponse.json({ message: "Only admin accounts can approve or cancel leave requests" }, { status: 403 });
    }

    const requestDoc = await LeaveRequest.findById(id);
    if (!requestDoc) {
      return NextResponse.json({ message: "Leave request not found" }, { status: 404 });
    }

    requestDoc.status = status;
    requestDoc.reviewerId = decoded.userId;
    requestDoc.reviewComment = reviewComment || "";
    await requestDoc.save();

    return NextResponse.json({ request: requestDoc });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update leave request" }, { status: 500 });
  }
}
