"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LeaveType { _id: string; name: string; code: string; maxDays: number; }
interface LeaveRequest { _id: string; employeeId: string; leaveTypeId: string; startDate: string; endDate: string; reason: string; status: string; }
interface UserPayload { _id: string; name: string; role: string; }

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("leaveflow-token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        setUser(data.user);
        return fetch("/api/leave-requests?role=admin", { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((response) => response?.json())
      .then((data) => setRequests(data?.requests || []))
      .finally(() => setLoading(false));

    fetch("/api/leave-types")
      .then((response) => response.json())
      .then((data) => setLeaveTypes(data.leaveTypes || []));
  }, [router]);

  async function handleDecision(requestId: string, status: string) {
    const token = localStorage.getItem("leaveflow-token");
    if (!token || !user) return;

    const response = await fetch(`/api/leave-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, reviewerId: user._id, reviewComment: `${status} by admin` }),
    });

    if (response.ok) {
      const data = await response.json();
      setRequests((current) => current.map((request) => (request._id === data.request._id ? data.request : request)));
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
          <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-700" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-700" />
              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-16 animate-pulse rounded-2xl bg-slate-700" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const pendingRequests = requests.filter((request) => request.status === "pending");

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Admin console</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Leave policy and approvals</h1>
        <p className="mt-2 text-sm text-slate-400">Review active leave requests and manage approvals directly from the database.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Leave types</h2>
          <div className="mt-4 space-y-3">
            {leaveTypes.length === 0 ? (
              <p className="text-sm text-slate-400">No leave types configured.</p>
            ) : (
              leaveTypes.map((type) => (
                <div key={type._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{type.name}</p>
                    <p className="text-sm text-slate-400">{type.code}</p>
                  </div>
                  <span className="text-sm text-indigo-300">{type.maxDays} days</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Pending approvals</h2>
          <div className="mt-4 space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-slate-400">No pending requests to review.</p>
            ) : (
              pendingRequests.map((request) => {
                const leaveType = leaveTypes.find((type) => type._id === request.leaveTypeId);
                return (
                  <div key={request._id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{leaveType?.name || "Leave request"}</p>
                        <p className="text-sm text-slate-400">{request.reason}</p>
                      </div>
                      <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">{request.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{formatDate(request.startDate)} → {formatDate(request.endDate)}</p>
                    <div className="mt-3 flex gap-3">
                      <button onClick={() => handleDecision(request._id, "approved")} className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400">Approve</button>
                      <button onClick={() => handleDecision(request._id, "rejected")} className="rounded-full bg-rose-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-rose-400">Reject</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
