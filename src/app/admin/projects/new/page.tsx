import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getCategories, getAllProjectsAdmin } from "@/lib/data/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Create Project | Ruth Shiru CMS",
};

export default async function NewProjectPage() {
  // Defense-in-depth server-side authentication check
  await requireAuth();

  // Read existing categories and projects to suggest next available order
  const [categories, projects] = await Promise.all([
    getCategories(),
    getAllProjectsAdmin(),
  ]);

  const maxOrder = projects.reduce((max, p) => Math.max(max, p.order), -1);
  const suggestedOrder = maxOrder + 1;

  return (
    <div className="space-y-6">
      {/* Page Header with Breadcrumbs */}
      <div>
        <nav className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-500">
          <Link href="/admin" className="hover:text-stone-800 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/admin/projects" className="hover:text-stone-800 hover:underline">
            Culinary Works
          </Link>
          <span>/</span>
          <span className="text-stone-800">New Project</span>
        </nav>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
              Create Practical Work
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Add a new culinary assessment record, plating exercise, or dish to your portfolio database.
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            ← Cancel and Return
          </Link>
        </div>
      </div>

      {/* Project Form in Create Mode */}
      <ProjectForm
        mode="create"
        existingCategories={categories}
        suggestedOrder={suggestedOrder}
      />
    </div>
  );
}
