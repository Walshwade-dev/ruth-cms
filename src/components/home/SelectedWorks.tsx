import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionEyebrow } from "@/components/ui/ContactBand";
import { FadeIn } from "@/components/ui/Motion";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { getPublishedWork, PracticalWork } from "@/data/works";

/**
 * Curated bento composition: one featured work (charcoal split card) balanced
 * by two supporting works (warm horizontal cards). Each card is a single
 * stretched link so keyboard users get one tab stop per work.
 */
export function SelectedWorks() {
  const featured = getPublishedWork("herbed-chicken");
  const supporting = [getPublishedWork("pea-veloute"), getPublishedWork("meat-and-savory-pies")].filter(
    (w): w is PracticalWork => Boolean(w)
  );

  return (
    <section className="py-20 md:py-28">
      <PageContainer>
        <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <SectionEyebrow>Selected works</SectionEyebrow>
            <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              From the board <span className="italic text-golden">to the plate</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-5">
            <p className="leading-relaxed text-foreground/70">
              A curated look at practical work from training: starters, mains and pastry, each prepared,
              plated and labelled for presentation.
            </p>
            <CtaLink href="/portfolio" variant="text" className="mt-5">
              Browse all practical work
            </CtaLink>
          </FadeIn>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {featured && <FeaturedCard work={featured} />}
          <div className="grid gap-6 lg:col-span-5">
            {supporting.map((work, i) => (
              <SupportingCard key={work.id} work={work} index={i + 2} />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function FeaturedCard({ work }: { work: PracticalWork }) {
  return (
    <FadeIn className="lg:col-span-7">
      <article className="group relative grid h-full overflow-hidden rounded-[2rem] bg-foreground text-background sm:grid-cols-2">
        {work.featuredImage && (
          <div className="relative">
            <PhotoFrame
              src={work.featuredImage}
              alt={work.featuredImageAlt}
              imageStyle={work.imageStyle}
              aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
              rounded="rounded-none"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              zoomOnHover
              className="sm:min-h-[26rem]"
            />
          </div>
        )}
        <div className="flex flex-col p-8 md:p-10">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-golden">{work.category}</span>
            <span className="font-serif text-2xl tracking-normal text-background/30">01</span>
          </div>
          <h3 className="mt-6 font-serif text-3xl font-bold leading-tight md:text-4xl">
            <Link
              href={`/portfolio/${work.slug}`}
              className="after:absolute after:inset-0 after:rounded-[2rem] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-golden"
            >
              {work.title}
            </Link>
          </h3>
          <p className="mt-4 leading-relaxed text-background/70">{work.summary}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-golden">
            {work.ctaLabel ?? "View project"}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </div>
      </article>
    </FadeIn>
  );
}

function SupportingCard({ work, index }: { work: PracticalWork; index: number }) {
  return (
    <FadeIn delay={0.1 * index} direction="left">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-golden/10 sm:flex-row">
        {work.featuredImage && (
          <div className="relative sm:w-2/5 sm:shrink-0">
            <PhotoFrame
              src={work.featuredImage}
              alt={work.featuredImageAlt}
              imageStyle={work.imageStyle}
              aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
              rounded="rounded-none"
              sizes="(max-width: 640px) 100vw, 220px"
              zoomOnHover
              className="sm:min-h-[13rem]"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
            <span>{work.category}</span>
            <span className="font-serif text-xl tracking-normal text-golden">0{index}</span>
          </div>
          <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-foreground">
            <Link
              href={`/portfolio/${work.slug}`}
              className="after:absolute after:inset-0 after:rounded-[2rem] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-golden"
            >
              {work.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/70">{work.summary}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-foreground">
            {work.ctaLabel ?? "View project"}
            <span aria-hidden="true" className="text-golden transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </div>
      </article>
    </FadeIn>
  );
}
