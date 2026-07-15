import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://leaveflow.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "LeaveFlow — Leave Management Made Simple",
    template: "%s | LeaveFlow",
  },
  description:
    "Submit leave requests, approve with one click, and track everything in real time. A calm dashboard for employees, managers, and admins.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "LeaveFlow",
    title: "LeaveFlow — Leave Management Made Simple",
    description:
      "Submit leave requests, approve with one click, and track everything in real time.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LeaveFlow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeaveFlow — Leave Management Made Simple",
    description:
      "Submit leave requests, approve with one click, and track everything in real time.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
