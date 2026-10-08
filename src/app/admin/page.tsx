import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  // Defense-in-depth server check
  await requireAuth();

  // Query live database state to display status
  const [profileCount, projectCount] = await Promise.all([
    prisma.profile.count(),
    prisma.project.count(),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
              Welcome, Ruth
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Editorial Content Management System — Phase 2 Architecture
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Neon PostgreSQL Connected</span>
          </div>
        </div>
      </div>

      {/* Database Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile Status */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Profile & Bio
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              Singleton
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">{profileCount}</span>
            <span className="text-xs text-stone-500">Record in Neon</span>
          </div>
          <p className="mt-2 text-xs text-stone-600">
            Name, headline, culinary statement, and contact details.
          </p>
          <div className="mt-4 border-t border-stone-100 pt-3">
            <span className="text-xs font-medium text-amber-800">
              Milestone 8.3 target
            </span>
          </div>
        </div>

        {/* Project Status */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Culinary Works
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Active
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">{projectCount}</span>
            <span className="text-xs text-stone-500">Projects in Neon</span>
          </div>
          <p className="mt-2 text-xs text-stone-600">
            Dishes, preparation procedures, metadata, and categories.
          </p>
          <div className="mt-4 border-t border-stone-100 pt-3">
            <span className="text-xs font-medium text-emerald-800">
              Milestone 8.4 target
            </span>
          </div>
        </div>

        {/* Media Status */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
              Media & Imagery
            </span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
              Storage
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900">Local / Blob</span>
            <span className="text-xs text-stone-500">Target</span>
          </div>
          <p className="mt-2 text-xs text-stone-600">
            Image asset uploads, focal crops, and aspect controls.
          </p>
          <div className="mt-4 border-t border-stone-100 pt-3">
            <span className="text-xs font-medium text-stone-700">
              Milestone 8.5 target
            </span>
          </div>
        </div>
      </div>

      {/* Security & Architecture Summary */}
      <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-6">
        <h2 className="font-serif text-lg font-bold text-stone-900">
          CMS Security & Session Summary
        </h2>
        <div className="mt-4 grid gap-4 text-xs text-stone-600 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-semibold text-stone-800">Session Cookie:</span>
            <p className="mt-1 font-mono text-[11px] text-stone-700">HttpOnly, SameSite=Lax, Secure</p>
          </div>
          <div>
            <span className="font-semibold text-stone-800">Token Algorithm:</span>
            <p className="mt-1 font-mono text-[11px] text-stone-700">HMAC-SHA256 (node:crypto)</p>
          </div>
          <div>
            <span className="font-semibold text-stone-800">Protection Layer:</span>
            <p className="mt-1 font-mono text-[11px] text-stone-700">src/proxy.ts (Next.js 16)</p>
          </div>
          <div>
            <span className="font-semibold text-stone-800">Brute-Force Guard:</span>
            <p className="mt-1 font-mono text-[11px] text-stone-700">IP-keyed window + 1s delay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
