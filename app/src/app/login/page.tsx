import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Authentication</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to LeaveFlow</h1>
        <p className="mt-2 text-sm text-slate-400">Use the auth form to create an account or sign in with your credentials.</p>
      </div>
      <AuthForm />
    </section>
  );
}
