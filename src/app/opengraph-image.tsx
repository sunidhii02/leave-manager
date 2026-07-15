import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "LeaveFlow — Leave management made simple";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          LeaveFlow
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a5b4fc",
            marginTop: 16,
          }}
        >
          Leave management made simple
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#94a3b8",
            marginTop: 24,
          }}
        >
          Submit · Approve · Track — all in one calm dashboard
        </div>
      </div>
    ),
    { ...size }
  );
}
