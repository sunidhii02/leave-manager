import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

export function withAuth(handler: (request: NextRequest, user: { userId: string; role: string }) => Promise<NextResponse>) {
  return async function wrapped(request: NextRequest) {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = verifyToken(token);
      return handler(request, decoded);
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
}
