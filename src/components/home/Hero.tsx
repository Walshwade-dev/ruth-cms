import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { CtaLink } from "@/components/ui/CtaLink";
import { FadeIn, ScrollDrift } from "@/components/ui/Motion";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { profileData } from "@/data/profile";
import { getPublishedWorks, getPublishedWork } from "@/data/works";
import { learningAreas, coreSkills } from "@/data/learning";

export function Hero() {
  // Published works only. Poultry Preparation is the strongest single
  // action photograph; the starter spread provides a contrasting food detail.
  const dominant = getPublishedWork("poultry-preparation");
  const detail = getPublishedWork("minestrone-and-avocado");
  const [firstName, ...rest] = profileData.name.split(" ");

  const stats = [
    { value: getPublishedWorks().length, label: "Practical works" },
    { value: learningAreas.length, label: "Curriculum modules" },
    { value: coreSkills.length, label: "Core competencies" },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-golden/[0.07] via-background to-background">
      <PageContainer className="pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-6 xl:col-span-6">
            <FadeIn delay={0.05}>
              <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-golden/30 bg-background/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground/80">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-golden" />
                {profileData.institution} &middot; {profileData.level}
              </p>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl xl:text-7xl">
                {firstName} <span className="italic text-golden">{rest.join(" ")}</span>
              </h1>
              <p className="mt-5 font-serif text-xl text-foreground/80 md:text-2xl">{profileData.title}</p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
                {profileData.statement}
              </p>
            </FadeIn>

            <FadeIn delay={0.32}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CtaLink href="/portfolio">View practical work</CtaLink>
                <CtaLink href="/learning-journey" variant="secondary">
                  Follow the journey
                </CtaLink>
              </div>
            </FadeIn>

            <FadeIn delay={0.42}>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-foreground/10 pt-6">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <dt className="text-xs leading-snug text-foreground/70">{s.label}</dt>
                    <dd className="order-first font-serif text-3xl font-bold text-foreground md:text-4xl">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>

          {/* Photographic composition */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:mr-0 lg:max-w-[30rem]">
              {/* Warm accent plane behind the photograph */}
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-4 bottom-10 left-10 rounded-[2rem] bg-golden/15 sm:-right-6 sm:-top-6"
              />

              {dominant?.featuredImage && (
                <FadeIn delay={0.15} direction="left" className="relative">
                  <ScrollDrift distance={18}>
                    <Link
                      href={`/portfolio/${dominant.slug}`}
                      className="group block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-4"
                    >
                      <PhotoFrame
                        src={dominant.featuredImage}
                        alt={dominant.featuredImageAlt}
                        imageStyle={dominant.imageStyle}
                        aspect="aspect-[4/5]"
                        sizes="(max-width: 1024px) 90vw, 480px"
                        priority
                        zoomOnHover
                        className="shadow-[0_30px_60px_-25px_rgba(28,25,23,0.45)]"
                      />
                      <span className="absolute bottom-5 right-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur-sm">
                        {dominant.title}
                      </span>
                    </Link>
                  </ScrollDrift>
                </FadeIn>
              )}

              {detail?.featuredImage && (
                <FadeIn
                  delay={0.45}
                  direction="up"
                  className="absolute -bottom-10 -left-3 w-32 sm:-left-12 sm:w-44 lg:-left-20 lg:w-52"
                >
                  <div className="-rotate-3 rounded-2xl bg-background p-1.5 shadow-xl">
                    <PhotoFrame
                      src={detail.featuredImage}
                      alt={detail.featuredImageAlt}
                      imageStyle={detail.imageStyle}
                      aspect="aspect-square"
                      rounded="rounded-xl"
                      sizes="210px"
                    />
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
