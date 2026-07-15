import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "@/lib/auth";

describe("auth utilities", () => {
  const payload = { userId: "123", role: "employee" };

  it("signs and verifies a token", () => {
    const token = signToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe("123");
    expect(decoded.role).toBe("employee");
  });

  it("throws on invalid token", () => {
    expect(() => verifyToken("invalid-token")).toThrow();
  });

  it("throws on tampered token", () => {
    const token = signToken(payload);
    const tampered = token.slice(0, -5) + "XXXXX";
    expect(() => verifyToken(tampered)).toThrow();
  });
});
