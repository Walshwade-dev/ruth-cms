import Link from "next/link";
import { FadeIn } from "@/components/ui/Motion";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { PracticalWork } from "@/data/works";

interface PortfolioGridProps {
  works: PracticalWork[];
}

export function PortfolioGrid({ works }: PortfolioGridProps) {
  if (works.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-golden/10 border border-golden/20 flex items-center justify-center mx-auto mb-4 text-golden font-serif text-2xl">
          &empty;
        </div>
        <p className="text-foreground/80 font-serif text-2xl mb-2">
          No works in this category
        </p>
        <p className="text-sm text-foreground/50">
          Select another category or view all published assessments.
        </p>
      </div>
    );
  }

  // When all 5 items are shown, display the lead work in an expansive
  // spotlight card, and the remaining 4 items as a balanced 2x2 grid.
  const isAllFive = works.length === 5;
  const isSingle = works.length === 1;

  if (isAllFive) {
    const leadWork = works[0];
    const gridWorks = works.slice(1);

    return (
      <div className="space-y-12 lg:space-y-16">
        {/* Featured Assessment Spotlight Card */}
        <FeaturedSpotlightCard work={leadWork} index={1} />

        {/* 2x2 Balanced Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {gridWorks.map((work, idx) => (
            <EditorialCard key={work.id} work={work} index={idx + 2} />
          ))}
        </div>
      </div>
    );
  }

  if (isSingle) {
    return (
      <div className="max-w-5xl mx-auto">
        <FeaturedSpotlightCard work={works[0]} index={1} />
      </div>
    );
  }

  // For 2 or more filtered items (e.g., 2 items in Main Meals or Starter Meals)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      {works.map((work, idx) => (
        <EditorialCard key={work.id} work={work} index={idx + 1} />
      ))}
    </div>
  );
}

/**
 * Large-format horizontal spotlight card for the lead assessment.
 * Balances a dominant photographic frame with rich editorial context.
 */
function FeaturedSpotlightCard({ work, index }: { work: PracticalWork; index: number }) {
  return (
    <FadeIn direction="up">
      <article className="group relative rounded-[2.5rem] bg-white border border-foreground/[0.08] shadow-[0_8px_30px_-6px_rgba(28,25,23,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(28,25,23,0.12)] hover:border-golden/40 transition-all duration-500 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Photo Column */}
          <div className="lg:col-span-7 relative p-4 sm:p-5 lg:p-6 pb-0 lg:pb-6">
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-foreground/5 min-h-[18rem] sm:min-h-[22rem] lg:min-h-[26rem]">
              {work.featuredImage ? (
                <PhotoFrame
                  src={work.featuredImage}
                  alt={work.featuredImageAlt}
                  imageStyle={work.imageStyle}
                  aspect="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto h-full"
                  rounded="rounded-[2rem]"
                  sizes="(max-width: 1024px) 100vw, 650px"
                  zoomOnHover
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/40 text-sm">
                  [Assessment Photo]
                </div>
              )}

              {/* Floating badges on photo */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-background/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden" />
                  Featured Assessment
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Column */}
          <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Category & Index Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-golden">
                  {work.category}
                </span>
                <span className="font-serif italic text-2xl text-foreground/30">
                  0{index}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight group-hover:text-golden transition-colors">
                <Link
                  href={`/portfolio/${work.slug}`}
                  className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-xl"
                >
                  {work.title}
                </Link>
              </h2>

              {/* Summary */}
              {work.summary && (
                <p className="text-foreground/75 text-base leading-relaxed mb-6">
                  {work.summary}
                </p>
              )}

              {/* Verified Details highlight */}
              {work.confirmedDetails[0] && (
                <div className="mb-6 p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-foreground/50 block mb-1">
                    Verified Observation
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed italic">
                    &ldquo;{work.confirmedDetails[0]}&rdquo;
                  </p>
                </div>
              )}

              {/* Context Chips */}
              {work.suggestedContext.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {work.suggestedContext.map((chip, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-golden/10 text-foreground/80 border border-golden/20"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-foreground/[0.08] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-golden group-hover:text-foreground transition-colors">
              <span>{work.ctaLabel || "Explore Project"}</span>
              <span
                aria-hidden="true"
                className="transform group-hover:translate-x-1.5 transition-transform"
              >
                &rarr;
              </span>
            </div>
          </div>

        </div>
      </article>
    </FadeIn>
  );
}

/**
 * Curated card designed for 2-column balanced pairs.
 * Features an art-matting image mount, clear typography, and verified context chips.
 */
function EditorialCard({ work, index }: { work: PracticalWork; index: number }) {
  return (
    <FadeIn delay={0.08 * (index % 2)} direction="up" className="h-full flex">
      <article className="group relative flex flex-col w-full rounded-[2rem] bg-white border border-foreground/[0.08] shadow-[0_6px_24px_-6px_rgba(28,25,23,0.05)] hover:shadow-[0_16px_40px_-10px_rgba(28,25,23,0.12)] hover:border-golden/40 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
        
        {/* Gallery Matting Image Mount */}
        <div className="p-3.5 sm:p-4 pb-0">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-foreground/5">
            {work.featuredImage ? (
              <PhotoFrame
                src={work.featuredImage}
                alt={work.featuredImageAlt}
                imageStyle={work.imageStyle}
                aspect="aspect-[16/10]"
                rounded="rounded-[1.5rem]"
                sizes="(max-width: 768px) 100vw, 550px"
                zoomOnHover
              />
            ) : (
              <div className="aspect-[16/10] flex items-center justify-center text-foreground/40 text-sm">
                [Assessment Photo]
              </div>
            )}

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-golden shadow-xs border border-foreground/5">
                <span className="w-1.5 h-1.5 rounded-full bg-golden" />
                {work.category}
              </span>
              <span className="font-serif italic text-xs text-foreground/50 bg-background/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs border border-foreground/5">
                0{index}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-grow p-6 sm:p-7">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-snug group-hover:text-golden transition-colors">
            <Link
              href={`/portfolio/${work.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-xl"
            >
              {work.title}
            </Link>
          </h3>

          {work.summary && (
            <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3 mb-5">
              {work.summary}
            </p>
          )}

          {/* Context Chips */}
          {work.suggestedContext.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {work.suggestedContext.map((chip, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-foreground/[0.03] text-foreground/70 border border-foreground/[0.06]"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer */}
          <div className="mt-auto pt-4 border-t border-foreground/[0.06] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground/80 group-hover:text-golden transition-colors">
            <span>{work.ctaLabel || "View assessment"}</span>
            <span
              aria-hidden="true"
              className="transform group-hover:translate-x-1.5 transition-transform"
            >
              &rarr;
            </span>
          </div>
        </div>

      </article>
    </FadeIn>
  );
}
