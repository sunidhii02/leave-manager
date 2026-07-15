import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-semibold text-white">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400"
      >
        Back to home
      </Link>
    </div>
  );
}
