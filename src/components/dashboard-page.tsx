"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface LeaveType { _id: string; name: string; code: string; maxDays: number; }
interface LeaveRequest { _id: string; employeeId: string; leaveTypeId: string; startDate: string; endDate: string; reason: string; status: string; }
interface UserPayload { _id: string; name: string; role: string; }

export function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("leaveflow-token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const userData = await response.json();
        if (!response.ok) {
          router.replace("/login");
          return;
        }

        setUser(userData.user);
        return fetch("/api/leave-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(async (requestResponse) => {
        if (!requestResponse) return;
        const requestData = await requestResponse.json();
        setRequests(requestData.requests || []);
      })
      .finally(() => setLoading(false));

    fetch("/api/leave-types")
      .then((response) => response.json())
      .then((data) => setLeaveTypes(data.leaveTypes || []));
  }, [router]);

  async function handleDecision(requestId: string, status: string) {
    const token = localStorage.getItem("leaveflow-token");
    if (!token) return;

    const response = await fetch(`/api/leave-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, reviewComment: `${status} by admin` }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Unable to update request");
      return;
    }

    setRequests((current) => current.map((request) => (request._id === data.request._id ? data.request : request)));
    setMessage(`Request ${status}`);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const summary = useMemo(() => ({
    pending: requests.filter((request) => request.status === "pending").length,
    approved: requests.filter((request) => request.status === "approved").length,
    total: requests.length,
  }), [requests]);

  if (loading) {
    return <p className="text-slate-300">Loading your workspace...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Leave workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back, {user?.name || "there"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Review live leave activity and keep your requests moving with the database-backed workflow.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Pending requests</p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary.pending}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Approved</p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary.approved}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Total requests</p>
          <p className="mt-2 text-3xl font-semibold text-white">{summary.total}</p>
        </article>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent requests</h2>
            <p className="text-sm text-slate-400">Showing the latest leave activity for your account.</p>
          </div>
          <a href="/requests" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
            Open request center
          </a>
        </div>

        <div className="space-y-3 p-6">
          {message ? <p className="text-sm text-indigo-300">{message}</p> : null}
          {requests.map((request) => {
            const leaveType = leaveTypes.find((type) => type._id === request.leaveTypeId);
            return (
              <div key={request._id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{leaveType?.name || "Leave request"}</p>
                    <p className="text-sm text-slate-400">{request.reason}</p>
                  </div>
                  <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                    {request.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{formatDate(request.startDate)} → {formatDate(request.endDate)}</p>
                {user?.role === "admin" && request.status === "pending" ? (
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => handleDecision(request._id, "approved")} className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950">Approve</button>
                    <button onClick={() => handleDecision(request._id, "rejected")} className="rounded-full bg-rose-500 px-3 py-2 text-sm font-medium text-slate-950">Reject</button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
