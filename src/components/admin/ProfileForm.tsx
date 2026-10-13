"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProfile, ProfileActionState } from "@/app/admin/profile/actions";
import type { ProfileData } from "@/lib/data/profile";

interface ProfileFormProps {
  initialProfile: ProfileData;
}

const initialState: ProfileActionState = {};

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  const linkedIn = initialProfile.contact.socials.find((s) => s.platform === "LinkedIn")?.url || "";
  const instagram = initialProfile.contact.socials.find((s) => s.platform === "Instagram")?.url || "";

  return (
    <form action={formAction} className="space-y-8">
      {/* Notifications */}
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{state.error}</span>
          </div>
        </div>
      )}

      {state.success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{state.message}</span>
          </div>
        </div>
      )}

      {/* Section 1: Professional Identity */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Professional Identity</h2>
          <p className="mt-1 text-xs text-stone-500">
            Primary identification displayed across the hero header and portfolio metadata.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialProfile.name}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Professional Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initialProfile.title}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Academic & Institutional Credentials */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Academic & Institutional Credentials</h2>
          <p className="mt-1 text-xs text-stone-500">
            Training background highlighted on the About page and Learning Journey progression.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="institution" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Institution *
            </label>
            <input
              id="institution"
              name="institution"
              type="text"
              required
              defaultValue={initialProfile.institution}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="programme" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Programme / Course *
            </label>
            <input
              id="programme"
              name="programme"
              type="text"
              required
              defaultValue={initialProfile.programme}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Certification Level *
            </label>
            <input
              id="level"
              name="level"
              type="text"
              required
              defaultValue={initialProfile.level}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Culinary Statements & Narrative */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Statements & Editorial Narrative</h2>
          <p className="mt-1 text-xs text-stone-500">
            Editorial voice featured in the homepage statement block and About profile card.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="statement" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Statement of Intent *
            </label>
            <textarea
              id="statement"
              name="statement"
              rows={3}
              required
              defaultValue={initialProfile.statement}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 p-4 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Extended Biography (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={initialProfile.bio || ""}
              placeholder="Leave blank if awaiting approved text. The public bio card is hidden while empty."
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 p-4 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
            <p className="mt-1 text-xs text-stone-500">
              If left empty, the extended biography section is gracefully omitted from the public site.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Visual Art Direction & Portrait */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Visual Art Direction & Portrait</h2>
          <p className="mt-1 text-xs text-stone-500">
            Portrait image source, framing aspect ratio, and object focal alignment.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="imageUrl" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Portrait Image Path / URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              defaultValue={initialProfile.image || ""}
              placeholder="/images/profile/ruth-shiru.jpg"
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="imageAspect" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Aspect Ratio Class
            </label>
            <input
              id="imageAspect"
              name="imageAspect"
              type="text"
              defaultValue={initialProfile.imageStyle?.aspect || "aspect-[3/4]"}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="imageObjectPosition" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Focal Position
            </label>
            <input
              id="imageObjectPosition"
              name="imageObjectPosition"
              type="text"
              defaultValue={initialProfile.imageStyle?.objectPosition || "center 30%"}
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="careerDirection" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
            Career Direction & Ambitions (One per line)
          </label>
          <textarea
            id="careerDirection"
            name="careerDirection"
            rows={3}
            defaultValue={initialProfile.careerDirection.join("\n")}
            placeholder="Food entrepreneurship&#10;Catering&#10;Professional hospitality practice"
            className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 p-4 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
          <p className="mt-1 text-xs text-stone-500">
            Each line forms a numbered ambition pill in the &ldquo;Where the craft is heading&rdquo; section.
          </p>
        </div>
      </section>

      {/* Section 5: Direct Inquiries & Professional Socials */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Contact Channels & Professional Socials</h2>
          <p className="mt-1 text-xs text-stone-500">
            Inquiry channels displayed on the Contact page and site-wide footer.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Inquiry Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={initialProfile.contact.email || ""}
              placeholder="ruth@example.com (optional)"
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Telephone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialProfile.contact.phone || ""}
              placeholder="+254 700 000000 (optional)"
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              LinkedIn Profile URL
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              defaultValue={linkedIn}
              placeholder="https://linkedin.com/in/... (optional)"
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="instagramUrl" className="block text-xs font-semibold tracking-wider uppercase text-stone-700">
              Instagram Profile URL
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={instagram}
              placeholder="https://instagram.com/... (optional)"
              className="mt-2 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Submission Actions */}
      <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-stone-200/80 pt-6 sm:flex-row">
        <Link
          href="/admin"
          className="text-xs font-medium text-stone-600 transition hover:text-stone-900"
        >
          ← Return to Dashboard
        </Link>

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
              Persisting to Neon...
            </span>
          ) : (
            "Save Profile Changes & Invalidate Cache"
          )}
        </button>
      </div>
    </form>
  );
}
