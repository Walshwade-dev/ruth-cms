import { PrismaClient } from "@prisma/client";
import { profileData } from "../src/data/profile";
import { works } from "../src/data/works";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database initialization status...");

  // Guard against overwriting CMS-managed content
  const [existingProfile, projectCount] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "default" } }),
    prisma.project.count(),
  ]);

  if (existingProfile || projectCount > 0) {
    console.log(
      "Database already contains content. Skipping initial seed to protect CMS-managed data."
    );
    return;
  }

  console.log("Starting initial data seed from existing static content...");

  // 1. Seed Singleton Profile
  const profile = await prisma.profile.create({
    data: {
      id: "default",
      name: profileData.name,
      title: profileData.title,
      institution: profileData.institution,
      programme: profileData.programme,
      level: profileData.level,
      statement: profileData.statement,
      bio: profileData.bio,
      careerDirection: profileData.careerDirection,
      imageUrl: profileData.image,
      imageAspect: profileData.imageStyle?.aspect ?? "aspect-[3/4]",
      imageObjectPosition: profileData.imageStyle?.objectPosition ?? "center 30%",
    },
  });

  console.log(`Initial profile created: ${profile.name} (id: ${profile.id})`);

  // 2. Seed Contact Details
  await prisma.contact.create({
    data: {
      profileId: profile.id,
      email: profileData.contact.email,
      phone: profileData.contact.phone,
      socials: profileData.contact.socials as object,
    },
  });

  console.log("Initial contact details created.");

  // 3. Seed Projects (from existing works)
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    await prisma.project.create({
      data: {
        slug: work.slug,
        title: work.title,
        category: work.category,
        status: work.status,
        summary: work.summary ?? null,
        ctaLabel: work.ctaLabel ?? null,
        confirmedDetails: work.confirmedDetails,
        suggestedContext: work.suggestedContext,
        featuredImage: work.featuredImage,
        featuredImageAlt: work.featuredImageAlt,
        imageAspect: work.imageStyle?.aspect ?? "aspect-[3/4]",
        imageObjectPosition: work.imageStyle?.objectPosition ?? "center",
        order: i + 1,
      },
    });
  }

  console.log(`Seeded ${works.length} initial projects.`);
  console.log("Initial seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error running seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
