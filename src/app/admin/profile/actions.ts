"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { SocialLink } from "@/lib/data/profile";

export interface ProfileActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  // 1. Enforce Server-Side Authentication
  await requireAuth();

  try {
    const name = formData.get("name")?.toString().trim();
    const title = formData.get("title")?.toString().trim();
    const institution = formData.get("institution")?.toString().trim();
    const programme = formData.get("programme")?.toString().trim();
    const level = formData.get("level")?.toString().trim();
    const statement = formData.get("statement")?.toString().trim();
    const bioRaw = formData.get("bio")?.toString().trim();
    const bio = bioRaw ? bioRaw : null;
    const imageUrl = formData.get("imageUrl")?.toString().trim() || null;
    const imageAspect = formData.get("imageAspect")?.toString().trim() || "aspect-[3/4]";
    const imageObjectPosition =
      formData.get("imageObjectPosition")?.toString().trim() || "center 30%";

    const careerDirectionRaw = formData.get("careerDirection")?.toString() || "";
    const careerDirection = careerDirectionRaw
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const emailRaw = formData.get("email")?.toString().trim();
    const email = emailRaw ? emailRaw : null;

    const phoneRaw = formData.get("phone")?.toString().trim();
    const phone = phoneRaw ? phoneRaw : null;

    const linkedInUrlRaw = formData.get("linkedinUrl")?.toString().trim();
    const instagramUrlRaw = formData.get("instagramUrl")?.toString().trim();

    const socials: SocialLink[] = [
      {
        platform: "LinkedIn",
        url: linkedInUrlRaw ? linkedInUrlRaw : null,
      },
      {
        platform: "Instagram",
        url: instagramUrlRaw ? instagramUrlRaw : null,
      },
    ];

    // Required fields validation
    if (!name || !title || !institution || !programme || !level || !statement) {
      return {
        error: "Name, title, institution, programme, level, and statement are required.",
      };
    }

    // 2. Persist to Neon PostgreSQL via Prisma
    await prisma.$transaction(async (tx) => {
      await tx.profile.update({
        where: { id: "default" },
        data: {
          name,
          title,
          institution,
          programme,
          level,
          statement,
          bio,
          careerDirection,
          imageUrl,
          imageAspect,
          imageObjectPosition,
        },
      });

      await tx.contact.upsert({
        where: { profileId: "default" },
        create: {
          profileId: "default",
          email,
          phone,
          socials: socials as object,
        },
        update: {
          email,
          phone,
          socials: socials as object,
        },
      });
    });

    // 3. Next.js 16 On-Demand Cache Invalidation
    // { expire: 0 } invalidates immediately so the next request gets fresh data
    revalidateTag("profile", { expire: 0 });
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/portfolio");
    revalidatePath("/learning-journey");

    return {
      success: true,
      message: "Profile and contact details saved successfully. Public cache invalidated.",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      error: "An unexpected error occurred while saving profile details. Please try again.",
    };
  }
}
