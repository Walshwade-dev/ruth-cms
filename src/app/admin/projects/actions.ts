"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import {
  ALLOWED_STATUSES,
  PROJECT_LIMITS,
  ProjectStatus,
  isProjectStatus,
  slugify,
  isValidSlug,
  validateOrder,
  validateProjectId,
  parseStringArray,
} from "@/lib/validation/projects";

export type { ProjectStatus };

export interface ProjectActionState {
  error?: string;
  success?: boolean;
  message?: string;
  projectId?: string;
  slug?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Centralized cache and route invalidator called after successful mutations.
 */
function invalidateProjectCaches(slug?: string, oldSlug?: string) {
  // 1. Next.js 16 On-demand tag invalidation ({ expire: 0 } invalidates immediately)
  revalidateTag("projects", { expire: 0 });

  // 2. Revalidate related route paths across public and admin interfaces
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(`/portfolio/${slug}`, "page");
  }
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/portfolio/${oldSlug}`, "page");
  }
}

/**
 * Helper to extract project ID flexibly from different Server Action calling conventions.
 */
function extractProjectId(
  targetIdOrState?: string | ProjectActionState | FormData,
  maybeStateOrFormData?: ProjectActionState | FormData,
  maybeFormData?: FormData
): string | null {
  if (typeof targetIdOrState === "string" && targetIdOrState.trim()) {
    return targetIdOrState.trim();
  }
  if (targetIdOrState && typeof (targetIdOrState as unknown as FormData).get === "function") {
    const val = (targetIdOrState as unknown as FormData).get("id")?.toString().trim();
    if (val) return val;
  }
  if (maybeStateOrFormData && typeof (maybeStateOrFormData as unknown as FormData).get === "function") {
    const val = (maybeStateOrFormData as unknown as FormData).get("id")?.toString().trim();
    if (val) return val;
  }
  if (maybeFormData && typeof maybeFormData.get === "function") {
    const val = maybeFormData.get("id")?.toString().trim();
    if (val) return val;
  }
  return null;
}

/**
 * Server Action to create a new project in the CMS.
 */
export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  // 1. Enforce Server-Side Authentication
  try {
    await requireAuth();
  } catch {
    return { error: "Authentication required. Please log in to perform this action." };
  }

  try {
    // 2. Extract and sanitize input fields
    const title = formData.get("title")?.toString().trim() || "";
    const rawSlug = formData.get("slug")?.toString().trim() || "";
    const category = formData.get("category")?.toString().trim() || "";
    const rawStatus = formData.get("status")?.toString().trim() || "Draft";
    const summaryRaw = formData.get("summary")?.toString().trim();
    const summary = summaryRaw ? summaryRaw : null;
    const ctaLabelRaw = formData.get("ctaLabel")?.toString().trim();
    const ctaLabel = ctaLabelRaw ? ctaLabelRaw : null;
    const orderRaw = formData.get("order")?.toString().trim();

    const featuredImageRaw = formData.get("featuredImage")?.toString().trim();
    const featuredImage = featuredImageRaw ? featuredImageRaw : null;
    const featuredImageAltRaw = formData.get("featuredImageAlt")?.toString().trim();
    const featuredImageAlt = featuredImageAltRaw ? featuredImageAltRaw : (featuredImage ? title : null);

    const imageAspectRaw = formData.get("imageAspect")?.toString().trim();
    const imageAspect = imageAspectRaw || "aspect-[3/4]";
    const imageObjectPositionRaw = formData.get("imageObjectPosition")?.toString().trim();
    const imageObjectPosition = imageObjectPositionRaw || "center";

    // 3. Validation
    const fieldErrors: Record<string, string> = {};

    // Title validation
    if (!title || title.length < PROJECT_LIMITS.MIN_TITLE_LENGTH) {
      fieldErrors.title = `Project title is required (minimum ${PROJECT_LIMITS.MIN_TITLE_LENGTH} characters).`;
    } else if (title.length > PROJECT_LIMITS.MAX_TITLE_LENGTH) {
      fieldErrors.title = `Project title must not exceed ${PROJECT_LIMITS.MAX_TITLE_LENGTH} characters.`;
    }

    // Slug validation and normalization
    const slugBase = rawSlug || title;
    const normalizedSlug = slugify(slugBase);

    if (!isValidSlug(normalizedSlug)) {
      fieldErrors.slug = `Invalid slug format. Slugs must contain only lowercase letters, numbers, and hyphens (${PROJECT_LIMITS.MIN_SLUG_LENGTH}-${PROJECT_LIMITS.MAX_SLUG_LENGTH} characters).`;
    }

    // Status validation
    if (!isProjectStatus(rawStatus)) {
      fieldErrors.status = `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`;
    }

    // Order validation: if provided, must be a valid non-negative integer
    let order: number;
    if (orderRaw !== undefined && orderRaw !== "") {
      const orderCheck = validateOrder(orderRaw);
      if (!orderCheck.valid) {
        fieldErrors.order = orderCheck.error;
        order = 0;
      } else {
        order = orderCheck.value;
      }
    } else {
      const maxOrder = await prisma.project.aggregate({
        _max: { order: true },
      });
      order = (maxOrder._max.order ?? -1) + 1;
    }

    // Max length validations
    if (category.length > PROJECT_LIMITS.MAX_CATEGORY_LENGTH) {
      fieldErrors.category = `Category must not exceed ${PROJECT_LIMITS.MAX_CATEGORY_LENGTH} characters.`;
    }

    if (summary && summary.length > PROJECT_LIMITS.MAX_SUMMARY_LENGTH) {
      fieldErrors.summary = `Summary must not exceed ${PROJECT_LIMITS.MAX_SUMMARY_LENGTH} characters.`;
    }

    if (ctaLabel && ctaLabel.length > PROJECT_LIMITS.MAX_CTA_LABEL_LENGTH) {
      fieldErrors.ctaLabel = `CTA label must not exceed ${PROJECT_LIMITS.MAX_CTA_LABEL_LENGTH} characters.`;
    }

    if (featuredImage && featuredImage.length > PROJECT_LIMITS.MAX_IMAGE_PATH_LENGTH) {
      fieldErrors.featuredImage = `Featured image path must not exceed ${PROJECT_LIMITS.MAX_IMAGE_PATH_LENGTH} characters.`;
    }

    if (featuredImageAlt && featuredImageAlt.length > PROJECT_LIMITS.MAX_IMAGE_ALT_LENGTH) {
      fieldErrors.featuredImageAlt = `Featured image alt text must not exceed ${PROJECT_LIMITS.MAX_IMAGE_ALT_LENGTH} characters.`;
    }

    if (imageAspect && imageAspect.length > PROJECT_LIMITS.MAX_IMAGE_ASPECT_LENGTH) {
      fieldErrors.imageAspect = `Image aspect ratio must not exceed ${PROJECT_LIMITS.MAX_IMAGE_ASPECT_LENGTH} characters.`;
    }

    if (imageObjectPosition && imageObjectPosition.length > PROJECT_LIMITS.MAX_IMAGE_POSITION_LENGTH) {
      fieldErrors.imageObjectPosition = `Image focal position must not exceed ${PROJECT_LIMITS.MAX_IMAGE_POSITION_LENGTH} characters.`;
    }

    // Array validations (prevent silent data corruption)
    const confirmedDetailsResult = parseStringArray(formData, "confirmedDetails");
    if (!confirmedDetailsResult.success) {
      fieldErrors.confirmedDetails = confirmedDetailsResult.error;
    }

    const suggestedContextResult = parseStringArray(formData, "suggestedContext");
    if (!suggestedContextResult.success) {
      fieldErrors.suggestedContext = suggestedContextResult.error;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        error: "Please correct the highlighted errors before saving.",
        fieldErrors,
      };
    }

    const confirmedDetails = confirmedDetailsResult.success ? confirmedDetailsResult.data : [];
    const suggestedContext = suggestedContextResult.success ? suggestedContextResult.data : [];

    // Slug uniqueness pre-check
    const existingWithSlug = await prisma.project.findUnique({
      where: { slug: normalizedSlug },
    });
    if (existingWithSlug) {
      return {
        error: `A project with the slug "${normalizedSlug}" already exists. Please choose a different slug.`,
        fieldErrors: { slug: "Slug is already in use." },
      };
    }

    // 4. Persist to Neon PostgreSQL
    const created = await prisma.project.create({
      data: {
        title,
        slug: normalizedSlug,
        category,
        status: rawStatus,
        summary,
        ctaLabel,
        confirmedDetails,
        suggestedContext,
        featuredImage,
        featuredImageAlt,
        imageAspect,
        imageObjectPosition,
        order,
      },
    });

    // 5. Invalidate caches
    invalidateProjectCaches(created.slug);

    return {
      success: true,
      message: `Project "${created.title}" created successfully.`,
      projectId: created.id,
      slug: created.slug,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "A project with this slug already exists. Please choose a unique slug.",
        fieldErrors: { slug: "Slug must be unique." },
      };
    }

    console.error("Error creating project:", error);
    return {
      error: "An unexpected error occurred while creating the project. Please try again.",
    };
  }
}

/**
 * Server Action to update an existing project in the CMS.
 * Preserves unedited fields and existing imagery unless explicitly changed or cleared.
 */
export async function updateProject(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  // 1. Enforce Server-Side Authentication
  try {
    await requireAuth();
  } catch {
    return { error: "Authentication required. Please log in to perform this action." };
  }

  try {
    const rawId = formData.get("id")?.toString();
    const idValidation = validateProjectId(rawId);
    if (!idValidation.valid) {
      return { error: idValidation.error };
    }
    const id = idValidation.id;

    // Retrieve existing record to preserve unedited fields
    const existing = await prisma.project.findUnique({
      where: { id },
    });
    if (!existing) {
      return { error: "Project not found or may have been deleted." };
    }

    const fieldErrors: Record<string, string> = {};

    // Title: update if present in formData, otherwise preserve
    let title = existing.title;
    if (formData.has("title")) {
      const rawTitle = formData.get("title")?.toString().trim() || "";
      if (!rawTitle || rawTitle.length < PROJECT_LIMITS.MIN_TITLE_LENGTH) {
        fieldErrors.title = `Project title is required (minimum ${PROJECT_LIMITS.MIN_TITLE_LENGTH} characters).`;
      } else if (rawTitle.length > PROJECT_LIMITS.MAX_TITLE_LENGTH) {
        fieldErrors.title = `Project title must not exceed ${PROJECT_LIMITS.MAX_TITLE_LENGTH} characters.`;
      } else {
        title = rawTitle;
      }
    }

    // Slug: update if present, otherwise preserve
    let slug = existing.slug;
    if (formData.has("slug")) {
      const rawSlug = formData.get("slug")?.toString().trim() || "";
      const normalizedSlug = rawSlug ? slugify(rawSlug) : slugify(title);

      if (!isValidSlug(normalizedSlug)) {
        fieldErrors.slug = `Invalid slug format. Slugs must contain only lowercase letters, numbers, and hyphens (${PROJECT_LIMITS.MIN_SLUG_LENGTH}-${PROJECT_LIMITS.MAX_SLUG_LENGTH} characters).`;
      } else if (normalizedSlug !== existing.slug) {
        // Uniqueness check across other projects
        const duplicate = await prisma.project.findFirst({
          where: {
            slug: normalizedSlug,
            NOT: { id: existing.id },
          },
        });
        if (duplicate) {
          fieldErrors.slug = `The slug "${normalizedSlug}" is already in use by another project.`;
        } else {
          slug = normalizedSlug;
        }
      }
    }

    // Status: update if present, otherwise preserve
    let status = existing.status;
    if (formData.has("status")) {
      const rawStatus = formData.get("status")?.toString().trim() || "";
      if (isProjectStatus(rawStatus)) {
        status = rawStatus;
      } else {
        fieldErrors.status = `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`;
      }
    }

    // Category: update if present, otherwise preserve
    let category = existing.category;
    if (formData.has("category")) {
      category = formData.get("category")?.toString().trim() || "";
      if (category.length > PROJECT_LIMITS.MAX_CATEGORY_LENGTH) {
        fieldErrors.category = `Category must not exceed ${PROJECT_LIMITS.MAX_CATEGORY_LENGTH} characters.`;
      }
    }

    // Summary: update if present, otherwise preserve
    let summary = existing.summary;
    if (formData.has("summary")) {
      const rawSummary = formData.get("summary")?.toString().trim();
      summary = rawSummary ? rawSummary : null;
      if (summary && summary.length > PROJECT_LIMITS.MAX_SUMMARY_LENGTH) {
        fieldErrors.summary = `Summary must not exceed ${PROJECT_LIMITS.MAX_SUMMARY_LENGTH} characters.`;
      }
    }

    // ctaLabel: update if present, otherwise preserve
    let ctaLabel = existing.ctaLabel;
    if (formData.has("ctaLabel")) {
      const rawCta = formData.get("ctaLabel")?.toString().trim();
      ctaLabel = rawCta ? rawCta : null;
      if (ctaLabel && ctaLabel.length > PROJECT_LIMITS.MAX_CTA_LABEL_LENGTH) {
        fieldErrors.ctaLabel = `CTA label must not exceed ${PROJECT_LIMITS.MAX_CTA_LABEL_LENGTH} characters.`;
      }
    }

    // Order: update if present, otherwise preserve. Rejects malformed values.
    let order = existing.order;
    if (formData.has("order")) {
      const orderRaw = formData.get("order")?.toString().trim();
      const orderCheck = validateOrder(orderRaw);
      if (!orderCheck.valid) {
        fieldErrors.order = orderCheck.error;
      } else {
        order = orderCheck.value;
      }
    }

    // Arrays: parse if present in formData, otherwise preserve
    let confirmedDetails = existing.confirmedDetails;
    if (formData.has("confirmedDetails") || formData.has("confirmedDetails[]")) {
      const parseResult = parseStringArray(formData, "confirmedDetails");
      if (!parseResult.success) {
        fieldErrors.confirmedDetails = parseResult.error;
      } else {
        confirmedDetails = parseResult.data;
      }
    }

    let suggestedContext = existing.suggestedContext;
    if (formData.has("suggestedContext") || formData.has("suggestedContext[]")) {
      const parseResult = parseStringArray(formData, "suggestedContext");
      if (!parseResult.success) {
        fieldErrors.suggestedContext = parseResult.error;
      } else {
        suggestedContext = parseResult.data;
      }
    }

    // Image handling with explicit removal flag or cleared input
    const removeFeaturedImage =
      formData.get("removeFeaturedImage")?.toString() === "true";

    let featuredImage = existing.featuredImage;
    if (removeFeaturedImage) {
      featuredImage = null;
    } else if (formData.has("featuredImage")) {
      const newImage = formData.get("featuredImage")?.toString().trim();
      if (newImage) {
        if (newImage.length > PROJECT_LIMITS.MAX_IMAGE_PATH_LENGTH) {
          fieldErrors.featuredImage = `Featured image path must not exceed ${PROJECT_LIMITS.MAX_IMAGE_PATH_LENGTH} characters.`;
        } else {
          featuredImage = newImage;
        }
      } else {
        featuredImage = null;
      }
    }

    // Alt text
    let featuredImageAlt = existing.featuredImageAlt;
    if (removeFeaturedImage || featuredImage === null) {
      featuredImageAlt = null;
    } else if (formData.has("featuredImageAlt")) {
      const newAlt = formData.get("featuredImageAlt")?.toString().trim();
      featuredImageAlt = newAlt || (featuredImage ? title : null);
      if (featuredImageAlt && featuredImageAlt.length > PROJECT_LIMITS.MAX_IMAGE_ALT_LENGTH) {
        fieldErrors.featuredImageAlt = `Featured image alt text must not exceed ${PROJECT_LIMITS.MAX_IMAGE_ALT_LENGTH} characters.`;
      }
    }

    // Image aspect and position
    let imageAspect = existing.imageAspect;
    if (formData.has("imageAspect")) {
      imageAspect = formData.get("imageAspect")?.toString().trim() || existing.imageAspect;
      if (imageAspect && imageAspect.length > PROJECT_LIMITS.MAX_IMAGE_ASPECT_LENGTH) {
        fieldErrors.imageAspect = `Image aspect ratio must not exceed ${PROJECT_LIMITS.MAX_IMAGE_ASPECT_LENGTH} characters.`;
      }
    }

    let imageObjectPosition = existing.imageObjectPosition;
    if (formData.has("imageObjectPosition")) {
      imageObjectPosition =
        formData.get("imageObjectPosition")?.toString().trim() || existing.imageObjectPosition;
      if (imageObjectPosition && imageObjectPosition.length > PROJECT_LIMITS.MAX_IMAGE_POSITION_LENGTH) {
        fieldErrors.imageObjectPosition = `Image focal position must not exceed ${PROJECT_LIMITS.MAX_IMAGE_POSITION_LENGTH} characters.`;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        error: "Please correct the highlighted errors before saving.",
        fieldErrors,
      };
    }

    // Persist updates to Neon PostgreSQL
    const updated = await prisma.project.update({
      where: { id: existing.id },
      data: {
        title,
        slug,
        category,
        status,
        summary,
        ctaLabel,
        confirmedDetails,
        suggestedContext,
        featuredImage,
        featuredImageAlt,
        imageAspect,
        imageObjectPosition,
        order,
      },
    });

    // Invalidate caches (pass old slug in case slug changed)
    invalidateProjectCaches(updated.slug, existing.slug);

    return {
      success: true,
      message: `Project "${updated.title}" updated successfully.`,
      projectId: updated.id,
      slug: updated.slug,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "A project with this slug already exists. Please choose a unique slug.",
        fieldErrors: { slug: "Slug must be unique." },
      };
    }

    console.error("Error updating project:", error);
    return {
      error: "An unexpected error occurred while updating the project. Please try again.",
    };
  }
}

/**
 * Server Action to publish a project.
 */
export async function publishProject(
  targetIdOrState?: string | ProjectActionState | FormData,
  maybeStateOrFormData?: ProjectActionState | FormData,
  maybeFormData?: FormData
): Promise<ProjectActionState> {
  try {
    await requireAuth();
  } catch {
    return { error: "Authentication required. Please log in to perform this action." };
  }

  try {
    const rawId = extractProjectId(targetIdOrState, maybeStateOrFormData, maybeFormData);
    const idValidation = validateProjectId(rawId);
    if (!idValidation.valid) {
      return { error: idValidation.error };
    }
    const id = idValidation.id;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Project not found or may have been deleted." };
    }

    if (existing.status === "Published") {
      return {
        success: true,
        message: `Project "${existing.title}" is already published.`,
        projectId: existing.id,
        slug: existing.slug,
      };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { status: "Published" },
    });

    invalidateProjectCaches(updated.slug);

    return {
      success: true,
      message: `Project "${updated.title}" is now published and live on the portfolio.`,
      projectId: updated.id,
      slug: updated.slug,
    };
  } catch (error) {
    console.error("Error publishing project:", error);
    return {
      error: "An unexpected error occurred while publishing the project. Please try again.",
    };
  }
}

/**
 * Server Action to unpublish a project (reverting to "Draft" status).
 */
export async function unpublishProject(
  targetIdOrState?: string | ProjectActionState | FormData,
  maybeStateOrFormData?: ProjectActionState | FormData,
  maybeFormData?: FormData
): Promise<ProjectActionState> {
  try {
    await requireAuth();
  } catch {
    return { error: "Authentication required. Please log in to perform this action." };
  }

  try {
    const rawId = extractProjectId(targetIdOrState, maybeStateOrFormData, maybeFormData);
    const idValidation = validateProjectId(rawId);
    if (!idValidation.valid) {
      return { error: idValidation.error };
    }
    const id = idValidation.id;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Project not found or may have been deleted." };
    }

    if (existing.status === "Draft") {
      return {
        success: true,
        message: `Project "${existing.title}" is already unpublished.`,
        projectId: existing.id,
        slug: existing.slug,
      };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { status: "Draft" },
    });

    invalidateProjectCaches(updated.slug);

    return {
      success: true,
      message: `Project "${updated.title}" was unpublished and moved to drafts.`,
      projectId: updated.id,
      slug: updated.slug,
    };
  } catch (error) {
    console.error("Error unpublishing project:", error);
    return {
      error: "An unexpected error occurred while unpublishing the project. Please try again.",
    };
  }
}

/**
 * Server Action to set an arbitrary allowed project status (e.g. "Pending Confirmation").
 * Validates both the runtime ID and status.
 */
export async function setProjectStatus(
  id: unknown,
  status: unknown
): Promise<ProjectActionState> {
  try {
    await requireAuth();
  } catch {
    return { error: "Authentication required. Please log in to perform this action." };
  }

  const idValidation = validateProjectId(id);
  if (!idValidation.valid) {
    return { error: idValidation.error };
  }

  if (!isProjectStatus(status)) {
    return {
      error: `Invalid status: "${String(status)}". Allowed statuses: ${ALLOWED_STATUSES.join(", ")}.`,
    };
  }

  try {
    const existing = await prisma.project.findUnique({ where: { id: idValidation.id } });
    if (!existing) {
      return { error: "Project not found or may have been deleted." };
    }

    const updated = await prisma.project.update({
      where: { id: idValidation.id },
      data: { status },
    });

    invalidateProjectCaches(updated.slug);

    return {
      success: true,
      message: `Project "${updated.title}" status updated to ${status}.`,
      projectId: updated.id,
      slug: updated.slug,
    };
  } catch (error) {
    console.error("Error updating project status:", error);
    return {
      error: "An unexpected error occurred while updating project status. Please try again.",
    };
  }
}

/**
 * Server Action to safely delete a project from Neon PostgreSQL.
 */
export async function deleteProject(
  targetIdOrState?: string | ProjectActionState | FormData,
  maybeStateOrFormData?: ProjectActionState | FormData,
  maybeFormData?: FormData
): Promise<ProjectActionState> {
  try {
    await requireAuth();
  } catch {
    return { error: "Authentication required. Please log in to perform this action." };
  }

  try {
    const rawId = extractProjectId(targetIdOrState, maybeStateOrFormData, maybeFormData);
    const idValidation = validateProjectId(rawId);
    if (!idValidation.valid) {
      return { error: idValidation.error };
    }
    const id = idValidation.id;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Project not found or has already been deleted." };
    }

    await prisma.project.delete({
      where: { id },
    });

    invalidateProjectCaches(existing.slug);

    return {
      success: true,
      message: `Project "${existing.title}" was permanently deleted.`,
      projectId: existing.id,
      slug: existing.slug,
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      error: "An unexpected error occurred while deleting the project. Please try again.",
    };
  }
}
