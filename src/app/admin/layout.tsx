import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAdmin } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If unauthenticated (e.g., rendering /admin/login)
  if (!session) {
    return <div className="min-h-screen bg-stone-100/70">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-stone-900"
            >
              <span className="font-serif text-xl font-bold">Ruth Shiru</span>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold tracking-wider text-amber-800 uppercase">
                CMS
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/admin"
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:bg-stone-100"
              >
                Dashboard
              </Link>
              <span className="text-xs text-stone-300">|</span>
              <span
                title="Available in Milestone 8.3"
                className="cursor-not-allowed rounded-md px-3 py-1.5 text-xs font-medium text-stone-400"
              >
                Profile & Contact
              </span>
              <span
                title="Available in Milestone 8.4"
                className="cursor-not-allowed rounded-md px-3 py-1.5 text-xs font-medium text-stone-400"
              >
                Projects
              </span>
              <span
                title="Available in Milestone 8.5"
                className="cursor-not-allowed rounded-md px-3 py-1.5 text-xs font-medium text-stone-400"
              >
                Media
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Authenticated
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-medium text-stone-600 transition hover:text-stone-900 sm:inline"
            >
              View Live Site ↗
            </Link>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 hover:text-stone-900 focus:ring-2 focus:ring-stone-500/20 focus:outline-none"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Administrative Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
