"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("leaveflow-token");
    if (!token) {
      setUser(null);
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((data) => setUser(data.user || null));
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("leaveflow-token");
    setUser(null);
    router.push("/login");
  }

  const links = [
    { href: "/", label: "Home" },
    ...(user?.role === "employee"
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/requests", label: "My Requests" },
          { href: "/requests", label: "Raise New Request" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/requests", label: "My Requests" },
          { href: "/admin", label: "Approvals" },
        ]),
    ...(user ? [] : [{ href: "/login", label: "Login" }]),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            LeaveFlow
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            {links.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            {user ? (
              <button type="button" onClick={handleLogout} className="rounded-full border border-white/10 px-3 py-1.5 transition hover:bg-slate-800 hover:text-white">
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <footer className="border-t border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-400">
          Designed for fast approvals and clear leave visibility.
        </div>
      </footer>
    </div>
  );
}
