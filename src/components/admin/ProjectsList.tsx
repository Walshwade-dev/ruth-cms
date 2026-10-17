"use client";

import { useState, useTransition, useMemo, useOptimistic } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  publishProject,
  unpublishProject,
  deleteProject,
} from "@/app/admin/projects/actions";
import type { PracticalWork } from "@/lib/data/projects";
import type { ProjectStatus } from "@/lib/validation/projects";

interface ProjectsListProps {
  initialProjects: PracticalWork[];
}

type FilterStatus = "All" | ProjectStatus;

type OptimisticAction =
  | { type: "status"; id: string; status: ProjectStatus }
  | { type: "delete"; id: string };

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<PracticalWork | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // React 19 optimistic UI state directly derived from server props
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    initialProjects,
    (currentProjects, update: OptimisticAction) => {
      if (update.type === "delete") {
        return currentProjects.filter((p) => p.id !== update.id);
      }
      if (update.type === "status") {
        return currentProjects.map((p) =>
          p.id === update.id ? { ...p, status: update.status } : p
        );
      }
      return currentProjects;
    }
  );

  // Status counts for badge tabs
  const counts = useMemo(() => {
    return {
      all: optimisticProjects.length,
      published: optimisticProjects.filter((p) => p.status === "Published").length,
      pending: optimisticProjects.filter((p) => p.status === "Pending Confirmation").length,
      draft: optimisticProjects.filter((p) => p.status === "Draft").length,
    };
  }, [optimisticProjects]);

  // Filtered projects by status and search query
  const filteredProjects = useMemo(() => {
    return optimisticProjects.filter((project) => {
      // Status filter
      if (selectedStatus !== "All" && project.status !== selectedStatus) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesCategory = project.category.toLowerCase().includes(query);
        const matchesSlug = project.slug.toLowerCase().includes(query);
        return matchesTitle || matchesCategory || matchesSlug;
      }
      return true;
    });
  }, [optimisticProjects, selectedStatus, searchQuery]);

  // Quick action: Toggle publish/unpublish
  const handleTogglePublish = (project: PracticalWork) => {
    setFeedback(null);
    setPendingActionId(project.id);
    const isCurrentlyPublished = project.status === "Published";
    const nextStatus: ProjectStatus = isCurrentlyPublished ? "Draft" : "Published";

    startTransition(async () => {
      setOptimisticProjects({ type: "status", id: project.id, status: nextStatus });
      const result = isCurrentlyPublished
        ? await unpublishProject(project.id)
        : await publishProject(project.id);

      setPendingActionId(null);

      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({
          type: "success",
          message:
            result.message ||
            (isCurrentlyPublished
              ? `Project "${project.title}" moved to drafts.`
              : `Project "${project.title}" is now published.`),
        });
        router.refresh();
      }
    });
  };

  // Safe delete handler with confirmation
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    const target = projectToDelete;
    setFeedback(null);
    setPendingActionId(target.id);

    startTransition(async () => {
      setOptimisticProjects({ type: "delete", id: target.id });
      const result = await deleteProject(target.id);
      setPendingActionId(null);
      setProjectToDelete(null);

      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({
          type: "success",
          message: result.message || `Project "${target.title}" was permanently deleted.`,
        });
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`flex items-center justify-between rounded-xl border p-4 text-sm shadow-xs transition-all ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "error" ? (
              <svg className="h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 text-sm font-semibold"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedStatus("All")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStatus === "All"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <span>All Works</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                selectedStatus === "All" ? "bg-stone-700 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("Published")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStatus === "Published"
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Published</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                selectedStatus === "Published" ? "bg-emerald-950 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {counts.published}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("Pending Confirmation")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStatus === "Pending Confirmation"
                ? "bg-amber-800 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>Pending</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                selectedStatus === "Pending Confirmation" ? "bg-amber-950 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("Draft")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStatus === "Draft"
                ? "bg-stone-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            <span>Drafts</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                selectedStatus === "Draft" ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {counts.draft}
            </span>
          </button>
        </div>

        {/* Text Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 pl-9 text-xs text-stone-900 shadow-xs placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Projects Cards Container */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-lg font-bold text-stone-900">No projects found</h3>
          <p className="mt-1 text-xs text-stone-500">
            {searchQuery
              ? `No projects matched "${searchQuery}". Try clearing your search term.`
              : `No projects currently in "${selectedStatus}".`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Clear Search
              </button>
            )}
            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
            >
              + Create New Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
          <div className="divide-y divide-stone-100">
            {filteredProjects.map((project) => {
              const isActionPending = isPending && pendingActionId === project.id;
              const isPublished = project.status === "Published";

              return (
                <div
                  key={project.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-stone-50/70 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  {/* Left: Thumbnail & Core Details */}
                  <div className="flex items-start gap-4">
                    {/* Thumbnail Image */}
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 border border-stone-200/60">
                      {project.featuredImage ? (
                        <Image
                          src={project.featuredImage}
                          alt={project.featuredImageAlt || project.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-stone-400 uppercase tracking-wider text-center p-1">
                          No Photo
                        </div>
                      )}
                    </div>

                    {/* Metadata & Titles */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Order badge */}
                        <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold font-mono text-stone-600">
                          #{project.order}
                        </span>

                        {/* Category badge */}
                        {project.category ? (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60">
                            {project.category}
                          </span>
                        ) : (
                          <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                            Uncategorized
                          </span>
                        )}

                        {/* Status Badge */}
                        <StatusBadge status={project.status} />
                      </div>

                      {/* Title */}
                      <h2 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="hover:text-amber-800 hover:underline transition"
                        >
                          {project.title}
                        </Link>
                      </h2>

                      {/* Slug & Links */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="font-mono text-[11px] text-stone-500">/{project.slug}</span>
                        {isPublished && (
                          <>
                            <span>&middot;</span>
                            <Link
                              href={`/portfolio/${project.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 hover:underline"
                            >
                              <span>View Live</span>
                              <span>↗</span>
                            </Link>
                          </>
                        )}
                        {project.confirmedDetails && project.confirmedDetails.length > 0 && (
                          <>
                            <span>&middot;</span>
                            <span>{project.confirmedDetails.length} observations</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100 sm:border-0 sm:pt-0 shrink-0 self-end sm:self-center">
                    {/* Quick Publish / Unpublish Toggle */}
                    <button
                      type="button"
                      disabled={isActionPending}
                      onClick={() => handleTogglePublish(project)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-2xs transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                        isPublished
                          ? "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                          : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                      title={isPublished ? "Revert project to Draft status" : "Publish project live on the portfolio"}
                    >
                      {isActionPending ? (
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Syncing...</span>
                        </span>
                      ) : isPublished ? (
                        "Unpublish"
                      ) : (
                        "Publish Live"
                      )}
                    </button>

                    {/* Edit Link */}
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 hover:text-stone-900 focus:outline-none"
                    >
                      Edit
                    </Link>

                    {/* Safe Delete Trigger */}
                    <button
                      type="button"
                      disabled={isActionPending}
                      onClick={() => setProjectToDelete(project)}
                      className="rounded-lg border border-transparent p-1.5 text-stone-400 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition focus:outline-none"
                      title={`Delete "${project.title}"`}
                      aria-label={`Delete ${project.title}`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {projectToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 id="delete-dialog-title" className="font-serif text-lg font-bold text-stone-900">
                  Delete Project?
                </h3>
                <p className="text-xs text-stone-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-stone-900 font-semibold">&ldquo;{projectToDelete.title}&rdquo;</strong>?
              This record will be removed from Neon PostgreSQL and will no longer appear on your portfolio.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setProjectToDelete(null)}
                className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Project"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "Published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        Published
      </span>
    );
  }

  if (status === "Pending Confirmation") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pending Confirmation
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600">
      <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
      Draft
    </span>
  );
}
