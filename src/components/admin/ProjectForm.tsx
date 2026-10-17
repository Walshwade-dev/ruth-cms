"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  createProject,
  updateProject,
  ProjectActionState,
} from "@/app/admin/projects/actions";
import {
  ALLOWED_STATUSES,
  PROJECT_LIMITS,
  slugify,
} from "@/lib/validation/projects";
import type { PracticalWork } from "@/lib/data/projects";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialProject?: PracticalWork;
  existingCategories?: string[];
  suggestedOrder?: number;
}

const LOCAL_PORTFOLIO_IMAGES = [
  "/images/portfolio/poultry-preparation.jpg",
  "/images/portfolio/meat-and-savory-pies.jpg",
  "/images/portfolio/herbed-chicken.jpg",
  "/images/portfolio/minestrone-and-avocado.jpg",
  "/images/portfolio/pea-veloute.jpg",
  "/images/portfolio/vegetable-preparation.jpg",
  "/images/portfolio/citrus-preparation.jpg",
  "/images/portfolio/sauce-preparation.jpg",
  "/images/portfolio/yellow-rice-dish.jpg",
];

const ASPECT_PRESETS = [
  { value: "aspect-[3/4]", label: "Portrait 3:4 (Default Card)" },
  { value: "aspect-[4/3]", label: "Landscape 4:3" },
  { value: "aspect-[16/10]", label: "Wide 16:10 (Spotlight Matting)" },
  { value: "aspect-[3/2]", label: "Classic 3:2" },
  { value: "aspect-square", label: "Square 1:1" },
];

const FOCAL_PRESETS = [
  { value: "center", label: "Center (Balanced)" },
  { value: "center 30%", label: "Upper Center (Plating Focus)" },
  { value: "center 40%", label: "Mid Upper (Station Focus)" },
  { value: "top", label: "Top Aligned" },
  { value: "bottom", label: "Bottom Aligned" },
];

const initialState: ProjectActionState = {};

export function ProjectForm({
  mode,
  initialProject,
  existingCategories = [],
  suggestedOrder = 0,
}: ProjectFormProps) {
  const isEdit = mode === "edit";
  const action = isEdit ? updateProject : createProject;
  const [state, formAction, isPending] = useActionState(action, initialState);

  // Live title-to-slug helper state
  const [titleValue, setTitleValue] = useState(initialProject?.title || "");
  const [slugValue, setSlugValue] = useState(initialProject?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(isEdit);

  // Live image preview state
  const [imageValue, setImageValue] = useState(initialProject?.featuredImage || "");
  const [imageError, setImageError] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  // Category quick-picker state
  const [categoryValue, setCategoryValue] = useState(initialProject?.category || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    if (!isSlugManual && !isEdit) {
      setSlugValue(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManual(true);
    setSlugValue(e.target.value);
  };

  const isPublished = (initialProject?.status || "") === "Published";

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden Project ID for Updates */}
      {isEdit && initialProject && (
        <input type="hidden" name="id" value={initialProject.id} />
      )}

      {/* Global Error Banner */}
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{state.error}</span>
          </div>
        </div>
      )}

      {/* Global Success Banner */}
      {state.success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-xs"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{state.message}</span>
            </div>
            {state.slug && (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/projects"
                  className="text-xs font-semibold text-emerald-900 underline hover:text-emerald-950"
                >
                  ← Return to all projects
                </Link>
                {initialProject?.status === "Published" && (
                  <Link
                    href={`/portfolio/${state.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    <span>View on live site</span>
                    <span>↗</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 1: Core Assessment Identification */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Core Assessment Identification
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Primary title, URL slug, status, and display ordering.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              Project Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={PROJECT_LIMITS.MIN_TITLE_LENGTH}
              maxLength={PROJECT_LIMITS.MAX_TITLE_LENGTH}
              value={titleValue}
              onChange={handleTitleChange}
              placeholder="e.g. Poultry Preparation"
              className={`mt-2 block w-full rounded-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                state.fieldErrors?.title
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {state.fieldErrors?.title ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.title}</p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-500">
                Between {PROJECT_LIMITS.MIN_TITLE_LENGTH} and {PROJECT_LIMITS.MAX_TITLE_LENGTH} characters.
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              URL Slug *
            </label>
            <div className="mt-2 flex rounded-lg shadow-2xs">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 px-3 text-xs text-stone-500">
                /portfolio/
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                minLength={PROJECT_LIMITS.MIN_SLUG_LENGTH}
                maxLength={PROJECT_LIMITS.MAX_SLUG_LENGTH}
                value={slugValue}
                onChange={handleSlugChange}
                placeholder="poultry-preparation"
                className={`block w-full rounded-r-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                  state.fieldErrors?.slug
                    ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                    : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                }`}
              />
            </div>
            {state.fieldErrors?.slug ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.slug}</p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-500">
                Lowercase letters, numbers, and single hyphens. Automatically formatted from title.
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              list="category-suggestions"
              maxLength={PROJECT_LIMITS.MAX_CATEGORY_LENGTH}
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
              placeholder="e.g. Main Meals, Starter Meals, Pastry"
              className={`mt-2 block w-full rounded-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                state.fieldErrors?.category
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            <datalist id="category-suggestions">
              {existingCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {state.fieldErrors?.category ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.category}</p>
            ) : existingCategories.length > 0 ? (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-stone-500">Suggested:</span>
                {existingCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryValue(cat)}
                    className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700 hover:bg-stone-200 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Status & Display Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
              >
                Publication Status *
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initialProject?.status || "Draft"}
                className={`mt-2 block w-full rounded-lg border bg-stone-50 px-3 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                  state.fieldErrors?.status
                    ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                    : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                }`}
              >
                {ALLOWED_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.status && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.status}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="order"
                className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
              >
                Display Order *
              </label>
              <input
                id="order"
                name="order"
                type="number"
                min="0"
                step="1"
                required
                defaultValue={initialProject?.order ?? suggestedOrder}
                className={`mt-2 block w-full rounded-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                  state.fieldErrors?.order
                    ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                    : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                }`}
              />
              {state.fieldErrors?.order ? (
                <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.order}</p>
              ) : (
                <p className="mt-1 text-[11px] text-stone-500">Lower numbers display first.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Editorial Content & Presentation */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Editorial Copy & Call to Action
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Public summary text and card button labels rendered across the portfolio grid and detail view.
          </p>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div>
            <label
              htmlFor="summary"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              Public Summary & Editorial Notes
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              maxLength={PROJECT_LIMITS.MAX_SUMMARY_LENGTH}
              defaultValue={initialProject?.summary || ""}
              placeholder="e.g. A working moment at the station: Ruth, in full chef's whites, portioning raw chicken on a wooden board."
              className={`mt-2 block w-full rounded-lg border bg-stone-50 p-4 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                state.fieldErrors?.summary
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {state.fieldErrors?.summary ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.summary}</p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-500">
                Maximum {PROJECT_LIMITS.MAX_SUMMARY_LENGTH} characters. Describes the observed preparation technique.
              </p>
            )}
          </div>

          {/* CTA Label */}
          <div className="max-w-md">
            <label
              htmlFor="ctaLabel"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              Call to Action Label
            </label>
            <input
              id="ctaLabel"
              name="ctaLabel"
              type="text"
              maxLength={PROJECT_LIMITS.MAX_CTA_LABEL_LENGTH}
              defaultValue={initialProject?.ctaLabel || ""}
              placeholder="e.g. Step into the kitchen, View assessment"
              className={`mt-2 block w-full rounded-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                state.fieldErrors?.ctaLabel
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {state.fieldErrors?.ctaLabel && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.ctaLabel}</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Verified Observations & Curriculum Context */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Assessment Facts & Curriculum Context
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Observable assessment details and institutional curriculum modules. Enter one item per line.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Confirmed Details */}
          <div>
            <label
              htmlFor="confirmedDetails"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              Verified Observations (One per line)
            </label>
            <textarea
              id="confirmedDetails"
              name="confirmedDetails"
              rows={4}
              defaultValue={initialProject?.confirmedDetails?.join("\n") || ""}
              placeholder="Ruth in uniform deboning and portioning raw chicken on a board.&#10;Clean mise en place station with sanitary cutting surfaces."
              className={`mt-2 block w-full rounded-lg border bg-stone-50 p-4 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                state.fieldErrors?.confirmedDetails
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {state.fieldErrors?.confirmedDetails ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {state.fieldErrors.confirmedDetails}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-500">
                Visible facts directly confirmed in the photograph. Rendered under Verified Observations.
              </p>
            )}
          </div>

          {/* Suggested Context */}
          <div>
            <label
              htmlFor="suggestedContext"
              className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
            >
              Curriculum Context Chips (One per line)
            </label>
            <textarea
              id="suggestedContext"
              name="suggestedContext"
              rows={4}
              defaultValue={initialProject?.suggestedContext?.join("\n") || ""}
              placeholder="Main meal preparation&#10;Butchery skills&#10;Knife safety"
              className={`mt-2 block w-full rounded-lg border bg-stone-50 p-4 text-sm text-stone-900 focus:bg-white focus:outline-none ${
                state.fieldErrors?.suggestedContext
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {state.fieldErrors?.suggestedContext ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {state.fieldErrors.suggestedContext}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-stone-500">
                Curriculum syllabus tags rendered as highlighted chips on project cards and detail views.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: Photographic Framing & Art Direction */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Photographic Framing & Art Direction
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Select or enter an existing portfolio photograph path, aspect crop, and focal point.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Image Path */}
            <div>
              <label
                htmlFor="featuredImage"
                className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
              >
                Featured Image Path / URL
              </label>
              <input
                id="featuredImage"
                name="featuredImage"
                type="text"
                list="portfolio-images"
                maxLength={PROJECT_LIMITS.MAX_IMAGE_PATH_LENGTH}
                value={imageValue}
                onChange={(e) => {
                  setImageValue(e.target.value);
                  setImageError(false);
                }}
                disabled={removeImage}
                placeholder="/images/portfolio/poultry-preparation.jpg"
                className={`mt-2 block w-full rounded-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none disabled:opacity-50 ${
                  state.fieldErrors?.featuredImage
                    ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                    : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                }`}
              />
              <datalist id="portfolio-images">
                {LOCAL_PORTFOLIO_IMAGES.map((img) => (
                  <option key={img} value={img} />
                ))}
              </datalist>
              {state.fieldErrors?.featuredImage ? (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {state.fieldErrors.featuredImage}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-stone-500">
                  Select a local asset or paste a valid image path.
                </p>
              )}

              {/* Remove Image Option (Edit Mode) */}
              {isEdit && initialProject?.featuredImage && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    id="removeFeaturedImage"
                    name="removeFeaturedImage"
                    type="checkbox"
                    value="true"
                    checked={removeImage}
                    onChange={(e) => setRemoveImage(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="removeFeaturedImage" className="text-xs text-stone-600 font-medium">
                    Remove currently assigned image
                  </label>
                </div>
              )}
            </div>

            {/* Alt Text */}
            <div>
              <label
                htmlFor="featuredImageAlt"
                className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
              >
                Image Alt Text
              </label>
              <input
                id="featuredImageAlt"
                name="featuredImageAlt"
                type="text"
                maxLength={PROJECT_LIMITS.MAX_IMAGE_ALT_LENGTH}
                defaultValue={initialProject?.featuredImageAlt || ""}
                disabled={removeImage}
                placeholder="Ruth portioning raw chicken on a board"
                className={`mt-2 block w-full rounded-lg border bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:bg-white focus:outline-none disabled:opacity-50 ${
                  state.fieldErrors?.featuredImageAlt
                    ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                    : "border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                }`}
              />
              {state.fieldErrors?.featuredImageAlt ? (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {state.fieldErrors.featuredImageAlt}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-stone-500">
                  Accessible description for screen readers. Defaults to project title if empty.
                </p>
              )}
            </div>
          </div>

          {/* Aspect Ratio & Focal Alignment */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="imageAspect"
                className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
              >
                Frame Aspect Ratio
              </label>
              <input
                id="imageAspect"
                name="imageAspect"
                type="text"
                list="aspect-presets"
                maxLength={PROJECT_LIMITS.MAX_IMAGE_ASPECT_LENGTH}
                defaultValue={initialProject?.imageStyle?.aspect || "aspect-[3/4]"}
                disabled={removeImage}
                className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none disabled:opacity-50"
              />
              <datalist id="aspect-presets">
                {ASPECT_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </datalist>
              {state.fieldErrors?.imageAspect && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {state.fieldErrors.imageAspect}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="imageObjectPosition"
                className="block text-xs font-semibold tracking-wider uppercase text-stone-700"
              >
                Focal Alignment
              </label>
              <input
                id="imageObjectPosition"
                name="imageObjectPosition"
                type="text"
                list="focal-presets"
                maxLength={PROJECT_LIMITS.MAX_IMAGE_POSITION_LENGTH}
                defaultValue={initialProject?.imageStyle?.objectPosition || "center"}
                disabled={removeImage}
                className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none disabled:opacity-50"
              />
              <datalist id="focal-presets">
                {FOCAL_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </datalist>
              {state.fieldErrors?.imageObjectPosition && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {state.fieldErrors.imageObjectPosition}
                </p>
              )}
            </div>
          </div>

          {/* Live Image Preview Thumbnail */}
          {imageValue && !removeImage && !imageError && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <span className="block text-xs font-semibold tracking-wider uppercase text-stone-600 mb-3">
                Live Image Preview
              </span>
              <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-xl bg-stone-200 border border-stone-300 shadow-2xs">
                <Image
                  src={imageValue}
                  alt="Selected photograph preview"
                  fill
                  sizes="160px"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SUBMISSION FOOTER ACTIONS */}
      <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-stone-200/80 pt-6 sm:flex-row">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-stone-600 transition hover:text-stone-900"
          >
            ← Return to Projects
          </Link>
          {isEdit && isPublished && initialProject?.slug && (
            <Link
              href={`/portfolio/${initialProject.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
            >
              View on Live Site ↗
            </Link>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{isEdit ? "Persisting to Neon..." : "Creating in Neon..."}</span>
            </span>
          ) : isEdit ? (
            "Save Project Changes"
          ) : (
            "Create Practical Work"
          )}
        </button>
      </div>
    </form>
  );
}
