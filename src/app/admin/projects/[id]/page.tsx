import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getProjectByIdAdmin, getCategories } from "@/lib/data/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);
  return {
    title: project ? `Edit: ${project.title} | Ruth Shiru CMS` : "Edit Project | Ruth Shiru CMS",
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // Defense-in-depth server-side authentication check
  await requireAuth();

  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProjectByIdAdmin(id),
    getCategories(),
  ]);

  if (!project) {
    notFound();
  }

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
          <span className="text-stone-800">Edit: {project.title}</span>
        </nav>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
              Edit Practical Work
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Update assessment observations, curriculum tags, photograph framing, or publication status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {project.status === "Published" && (
              <Link
                href={`/portfolio/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 hover:text-stone-900"
              >
                <span>Live View</span>
                <span>↗</span>
              </Link>
            )}
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Project Form in Edit Mode */}
      <ProjectForm
        mode="edit"
        initialProject={project}
        existingCategories={categories}
      />
    </div>
  );
}
