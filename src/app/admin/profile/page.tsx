import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getProfileDirect } from "@/lib/data/profile";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const metadata = {
  title: "Profile & Contact | Ruth Shiru CMS",
};

export default async function AdminProfilePage() {
  // Defense-in-depth server-side authentication check
  await requireAuth();

  // Read the latest uncached profile data directly from Neon
  const profile = await getProfileDirect();

  return (
    <div className="space-y-6">
      {/* Page Header with Breadcrumbs */}
      <div>
        <nav className="mb-2 flex items-center gap-2 text-xs font-medium text-stone-500">
          <Link href="/admin" className="hover:text-stone-800 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-stone-800">Profile & Contact</span>
        </nav>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
              Profile & Contact Settings
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Manage your professional identity, institutional credentials, bio, culinary statement, and public contact channels.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:underline"
          >
            <span>Preview live changes</span>
            <span>↗</span>
          </Link>
        </div>
      </div>

      {/* Interactive Form Component */}
      <ProfileForm initialProfile={profile} />
    </div>
  );
}
