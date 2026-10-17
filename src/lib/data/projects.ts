import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Project } from "@prisma/client";
import type { ImageStyle } from "@/data/works";

import type { ProjectStatus } from "@/lib/validation/projects";

export type { ProjectStatus };

export interface PracticalWork {
  id: string;
  slug: string;
  title: string;
  category: string;
  confirmedDetails: string[];
  suggestedContext: string[];
  status: ProjectStatus;
  summary?: string;
  ctaLabel?: string;
  featuredImage: string | null;
  featuredImageAlt: string;
  imageStyle?: ImageStyle;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Transforms a raw Prisma Project record from Neon into the PracticalWork contract.
 */
export function mapProjectToWork(project: Project): PracticalWork {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    status: project.status as ProjectStatus,
    summary: project.summary ?? undefined,
    ctaLabel: project.ctaLabel ?? undefined,
    confirmedDetails: project.confirmedDetails,
    suggestedContext: project.suggestedContext,
    featuredImage: project.featuredImage,
    featuredImageAlt: project.featuredImageAlt || project.title,
    imageStyle: {
      aspect: project.imageAspect || "aspect-[3/4]",
      objectPosition: project.imageObjectPosition || "center",
    },
    order: project.order,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

/**
 * Direct database query for all published projects in Neon, ordered by order index.
 */
async function fetchPublishedProjectsFromDatabase(): Promise<PracticalWork[]> {
  const projects = await prisma.project.findMany({
    where: { status: "Published" },
    orderBy: [
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });

  return projects.map(mapProjectToWork);
}

/**
 * Direct database query for a single published project by slug in Neon.
 */
async function fetchPublishedProjectBySlugFromDatabase(slug: string): Promise<PracticalWork | null> {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: "Published",
    },
  });

  if (!project) {
    return null;
  }

  return mapProjectToWork(project);
}

/**
 * Centralized Data Access Layer function for all published works.
 * Cached at the Edge with tag 'projects'.
 */
export const getPublishedWorks = unstable_cache(
  async (): Promise<PracticalWork[]> => {
    return fetchPublishedProjectsFromDatabase();
  },
  ["published-projects-list"],
  {
    tags: ["projects"],
    revalidate: false, // Invalidation is driven on-demand via revalidateTag upon CMS edits
  }
);

/**
 * Centralized Data Access Layer function for a single published project by slug.
 * Cached at the Edge with tag 'projects'.
 */
export const getPublishedWork = unstable_cache(
  async (slug: string): Promise<PracticalWork | null> => {
    return fetchPublishedProjectBySlugFromDatabase(slug);
  },
  ["published-project-by-slug"],
  {
    tags: ["projects"],
    revalidate: false,
  }
);

/**
 * Retrieves unique, sorted categories across all published practical works.
 * Cached at the Edge with tag 'projects'.
 */
export const getCategories = unstable_cache(
  async (): Promise<string[]> => {
    const works = await fetchPublishedProjectsFromDatabase();
    const cats = new Set(
      works
        .filter((w) => w.category && w.category.trim() !== "")
        .map((w) => w.category.trim())
    );
    return Array.from(cats).sort();
  },
  ["published-categories-list"],
  {
    tags: ["projects"],
    revalidate: false,
  }
);

/**
 * Direct uncached read helper for the CMS admin list.
 * Retrieves all projects regardless of status (Published, Pending Confirmation, Draft),
 * ordered by order index and creation date.
 */
export async function getAllProjectsAdmin(): Promise<PracticalWork[]> {
  const projects = await prisma.project.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  return projects.map(mapProjectToWork);
}

/**
 * Direct uncached read helper for the CMS admin editor by project ID.
 */
export async function getProjectByIdAdmin(id: string): Promise<PracticalWork | null> {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return null;
  }

  return mapProjectToWork(project);
}

/**
 * Direct uncached read helper for checking slug uniqueness during creation and edits.
 */
export async function getProjectBySlugAdmin(slug: string): Promise<PracticalWork | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return null;
  }

  return mapProjectToWork(project);
}
