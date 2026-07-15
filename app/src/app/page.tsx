"use client";

import Link from "next/link";
import { useState } from "react";

const stats = [
  { value: "2 min", label: "Average request time" },
  { value: "24h", label: "Approval turnaround" },
  { value: "100%", label: "Policy compliance" },
];

const features = [
  {
    title: "Self-service requests",
    description: "Employees submit leave requests with dates, types, and reasons — no back-and-forth emails needed.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    title: "Manager approvals",
    description: "Review pending requests, approve or reject with one click, and leave a comment for the employee.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Admin oversight",
    description: "Define leave types, set policies, and monitor all activity from a centralized admin console.",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Real-time status",
    description: "Track every request from submission to decision — pending, approved, or rejected — in a single view.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const steps = [
  { step: "01", title: "Submit", description: "Employee selects a leave type, picks dates, and writes a reason." },
  { step: "02", title: "Review", description: "Manager sees the request in their queue with full context." },
  { step: "03", title: "Decide", description: "Approve or reject with a single click — the employee is notified instantly." },
];

export default function Home() {
  const [message, setMessage] = useState("");

  async function handleSeed() {
    const response = await fetch("/api/seed", { method: "POST" });
    const data = await response.json();
    setMessage(data.message || "Seeded");
  }

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">Leave management</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Every leave request, one calm dashboard.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            LeaveFlow replaces scattered emails and spreadsheets with a single source of truth — so employees get answers faster and managers stay in control.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-indigo-500 px-6 py-3.5 font-medium text-white transition hover:bg-indigo-400">
              Sign in to continue
            </Link>
            <Link href="/requests" className="rounded-full border border-white/10 px-6 py-3.5 font-medium text-slate-200 transition hover:bg-white/5">
              View requests
            </Link>
          </div>
          {message ? <p className="mt-4 text-sm text-indigo-300">{message}</p> : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">Quick start</p>
          <h2 className="mt-3 text-xl font-semibold text-white">Spin up demo data</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Seed the database with sample leave types and two demo accounts so you can explore the full workflow in seconds.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3">
            <p className="text-xs text-slate-500">Admin</p>
            <p className="font-medium text-white">admin@example.com</p>
            <p className="text-xs text-slate-500 mt-2">Employee</p>
            <p className="font-medium text-white">employee@example.com</p>
            <p className="text-xs text-slate-500 mt-1">Password for both: password123</p>
          </div>
          <button
            type="button"
            onClick={handleSeed}
            className="mt-6 w-full rounded-full border border-indigo-500/40 px-5 py-3 font-medium text-indigo-300 transition hover:bg-indigo-500/10"
          >
            Seed demo accounts
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-6 text-center">
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">How it works</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Three steps, zero friction</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
              <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                Step {step.step}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">Features</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Everything you need to manage leave</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-2xl shadow-black/30">
        <h2 className="text-3xl font-semibold text-white">Ready to streamline leave?</h2>
        <p className="mt-3 text-slate-400">Sign in with the demo accounts above or register a new one.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="rounded-full bg-indigo-500 px-6 py-3.5 font-medium text-white transition hover:bg-indigo-400">
            Get started
          </Link>
          <Link href="/dashboard" className="rounded-full border border-white/10 px-6 py-3.5 font-medium text-slate-200 transition hover:bg-white/5">
            View dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
