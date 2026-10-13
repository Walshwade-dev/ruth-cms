import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { SocialLink, ProfileData } from "@/data/profile";

export type { SocialLink, ProfileData };

/**
 * Transforms raw Prisma database records into the exact ProfileData interface
 * required by existing public presentation components.
 */
function mapProfileToContract(
  profile: NonNullable<Awaited<ReturnType<typeof fetchProfileFromDatabase>>>
): ProfileData {
  const socials = Array.isArray(profile.contact?.socials)
    ? (profile.contact.socials as unknown as SocialLink[])
    : [];

  return {
    name: profile.name,
    title: profile.title,
    institution: profile.institution,
    programme: profile.programme,
    level: profile.level,
    careerDirection: profile.careerDirection,
    statement: profile.statement,
    bio: profile.bio ?? null,
    image: profile.imageUrl ?? null,
    imageStyle: {
      aspect: profile.imageAspect ?? "aspect-[3/4]",
      objectPosition: profile.imageObjectPosition ?? "center 30%",
    },
    contact: {
      email: profile.contact?.email ?? null,
      phone: profile.contact?.phone ?? null,
      socials,
    },
  };
}

/**
 * Direct database query for the singleton Profile record in Neon.
 */
async function fetchProfileFromDatabase() {
  return prisma.profile.findUnique({
    where: { id: "default" },
    include: { contact: true },
  });
}

/**
 * Centralized Data Access Layer function for the public site.
 * Cached at the Edge with tag 'profile'.
 *
 * If the profile record is missing or Neon is unreachable, it throws
 * to allow Next.js error boundaries to respond rather than silently
 * masking failures with stale hardcoded data.
 */
export const getProfile = unstable_cache(
  async (): Promise<ProfileData> => {
    const profile = await fetchProfileFromDatabase();

    if (!profile) {
      throw new Error(
        "Profile record 'default' not found in database. Please ensure initial database seed has run."
      );
    }

    return mapProfileToContract(profile);
  },
  ["profile-singleton"],
  {
    tags: ["profile"],
    revalidate: false, // Invalidation is driven on-demand via revalidateTag upon CMS edits
  }
);

/**
 * Direct uncached read helper for the CMS admin interface.
 */
export async function getProfileDirect(): Promise<ProfileData> {
  const profile = await fetchProfileFromDatabase();

  if (!profile) {
    throw new Error(
      "Profile record 'default' not found in database. Please ensure initial database seed has run."
    );
  }

  return mapProfileToContract(profile);
}
