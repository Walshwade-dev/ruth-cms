import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getAllProjectsAdmin } from "@/lib/data/projects";
import { ProjectsList } from "@/components/admin/ProjectsList";

export const metadata = {
  title: "Culinary Works | Ruth Shiru CMS",
};

export default async function AdminProjectsPage() {
  // Defense-in-depth server-side authentication check
  await requireAuth();

  // Read latest uncached project records directly from Neon
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-6">
      {/* Page Header with Breadcrumbs */}
      <div>
        <nav className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-500">
          <Link href="/admin" className="hover:text-stone-800 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-stone-800">Culinary Works</span>
        </nav>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
              Culinary Works Management
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Manage your practical kitchen assessments, plating records, publication status, and curriculum details.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 hover:text-stone-900"
            >
              <span>View Portfolio</span>
              <span>↗</span>
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-stone-800 focus:ring-2 focus:ring-stone-500/20 focus:outline-none"
            >
              <span>+ New Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Projects List Component */}
      <ProjectsList initialProjects={projects} />
    </div>
  );
}
