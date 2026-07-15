import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "employee", department, managerId } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      managerId,
    });

    return NextResponse.json({ user: { id: user._id, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && "name" in error && error.name === "ValidationError") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
