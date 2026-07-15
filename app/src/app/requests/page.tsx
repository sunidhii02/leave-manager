"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LeaveType { _id: string; name: string; }
interface LeaveRequest { _id: string; leaveTypeId: string; startDate: string; endDate: string; reason: string; status: string; }
interface UserPayload { _id: string; name: string; role: string; }

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [form, setForm] = useState({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("leaveflow-token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((data) => {
        if (!data.user) {
          router.replace("/login");
          return;
        }

        setUser(data.user);
        return fetch("/api/leave-requests", { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((response) => response?.json())
      .then((data) => setRequests(data?.requests || []));

    fetch("/api/leave-types")
      .then((response) => response.json())
      .then((data) => setLeaveTypes(data.leaveTypes || []));
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("leaveflow-token");
    if (!token || !user) return;

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/leave-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Failed to submit request");
      return;
    }

    setMessage("Request submitted successfully");
    setForm({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
    const refreshed = await fetch("/api/leave-requests", { headers: { Authorization: `Bearer ${token}` } });
    const refreshedData = await refreshed.json();
    setRequests(refreshedData.requests || []);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Employee request center</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Your leave requests</h1>
        <p className="mt-2 text-sm text-slate-400">Keep track of request status, reasons, and approvals from a single view.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Raise a new request</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Leave type
            <select value={form.leaveTypeId} onChange={(event) => setForm({ ...form, leaveTypeId: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100">
              <option value="">Select type</option>
              {leaveTypes.map((type) => (
                <option key={type._id} value={type._id}>{type.name}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-300">
            Reason
            <input value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100" />
          </label>

          <label className="text-sm text-slate-300">
            Start date
            <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100" />
          </label>

          <label className="text-sm text-slate-300">
            End date
            <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="rounded-full bg-indigo-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-60">
          {loading ? "Submitting..." : "Submit request"}
        </button>
        {message ? <p className="text-sm text-indigo-300">{message}</p> : null}
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => {
          const leaveType = leaveTypes.find((type) => type._id === request.leaveTypeId);
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
            <article key={request._id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">{leaveType?.name || "Leave request"}</h2>
                <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">{request.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{request.reason}</p>
              <p className="mt-3 text-sm text-slate-300">{formatDate(request.startDate)} → {formatDate(request.endDate)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
