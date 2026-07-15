"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password, role: form.role };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Auth failed");
      return;
    }

    if (mode === "login") {
      localStorage.setItem("leaveflow-token", data.token);
      router.push("/dashboard");
      return;
    }

    setMode("login");
    setMessage("Registration successful. Please sign in.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
      <div className="mb-6 flex gap-2">
        <button type="button" onClick={() => setMode("login")} className={`rounded-full px-4 py-2 text-sm ${mode === "login" ? "bg-indigo-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
          Login
        </button>
        <button type="button" onClick={() => setMode("register")} className={`rounded-full px-4 py-2 text-sm ${mode === "register" ? "bg-indigo-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="name">Name</label>
            <input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          </div>
        )}

        {mode === "register" && (
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="role">Account role</label>
            <select id="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none">
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm text-slate-300" htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300" htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-indigo-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-indigo-400 disabled:opacity-60">
          {loading ? "Working..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-indigo-300">{message}</p> : null}
    </div>
  );
}
