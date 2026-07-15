import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

async function handler(request: NextRequest, user: { userId: string; role: string }) {
  await connectDB();
  const currentUser = await User.findById(user.userId).select("-password");

  if (!currentUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: currentUser });
}

export const GET = withAuth(handler);
