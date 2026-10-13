import { notFound } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { ContactBand, SectionEyebrow } from "@/components/ui/ContactBand";
import { getPublishedWorks, getPublishedWork } from "@/data/works";

interface ProjectDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const work = getPublishedWork(slug);

  if (!work) {
    notFound();
  }

  // Related published works for continuous exploration
  const otherWorks = getPublishedWorks().filter((w) => w.slug !== work.slug);

  return (
    <main className="flex-grow bg-background">
      <div className="py-8 md:py-12 border-b border-foreground/5 bg-golden/[0.03]">
        <PageContainer>
          <nav aria-label="Breadcrumb">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 hover:text-golden transition-colors"
            >
              <span>&larr;</span> Back to all practical works
            </Link>
          </nav>
        </PageContainer>
      </div>

      <PageContainer className="py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Frame */}
          <div className="lg:col-span-7">
            <FadeIn direction="up">
              <div className="relative max-w-2xl mx-auto lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute -top-4 -left-4 w-full h-full rounded-[2rem] bg-golden/10 border border-golden/20 -z-10"
                />
                {work.featuredImage ? (
                  <PhotoFrame
                    src={work.featuredImage}
                    alt={work.featuredImageAlt}
                    imageStyle={work.imageStyle}
                    aspect="aspect-[4/3] md:aspect-[3/2]"
                    rounded="rounded-[1.75rem]"
                    sizes="(max-width: 1024px) 100vw, 700px"
                    priority
                    className="shadow-2xl"
                  />
                ) : (
                  <div className="aspect-[4/3] rounded-[1.75rem] bg-foreground/5 flex items-center justify-center text-foreground/40 font-medium">
                    [Image Placeholder]
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Editorial & Context Details */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0">
            <FadeIn delay={0.1}>
              <SectionEyebrow>{work.category}</SectionEyebrow>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
                {work.title}
              </h1>
              {work.summary && (
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-8">
                  {work.summary}
                </p>
              )}
            </FadeIn>

            <StaggerContainer delayChildren={0.2} staggerChildren={0.1} className="space-y-8 border-t border-foreground/10 pt-8">
              <StaggerItem direction="up">
                <h2 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden inline-block"></span>
                  Verified Observations
                </h2>
                <ul className="space-y-3">
                  {work.confirmedDetails.map((detail, idx) => (
                    <li key={idx} className="text-sm text-foreground/75 leading-relaxed bg-foreground/[0.02] border border-foreground/5 p-4 rounded-xl">
                      {detail}
                    </li>
                  ))}
                </ul>
              </StaggerItem>

              <StaggerItem direction="up">
                <h2 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden/60 inline-block"></span>
                  Curriculum Context
                </h2>
                <div className="flex flex-wrap gap-2">
                  {work.suggestedContext.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold tracking-wide uppercase px-3 py-1.5 bg-golden/10 border border-golden/20 text-foreground/80 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>

        {/* Explore More Works */}
        {otherWorks.length > 0 && (
          <div className="mt-24 md:mt-32 pt-16 border-t border-foreground/10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                More Practical <span className="text-golden italic">Works</span>
              </h2>
              <Link
                href="/portfolio"
                className="text-xs font-bold uppercase tracking-widest text-golden hover:text-foreground transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {otherWorks.slice(0, 4).map((w) => (
                <Link
                  key={w.id}
                  href={`/portfolio/${w.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-foreground/[0.03] p-3 border border-transparent hover:border-golden/20 transition-all hover:-translate-y-1"
                >
                  {w.featuredImage && (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                      <PhotoFrame
                        src={w.featuredImage}
                        alt={w.featuredImageAlt}
                        imageStyle={w.imageStyle}
                        aspect="aspect-[4/3]"
                        sizes="(max-width: 768px) 100vw, 250px"
                      />
                    </div>
                  )}
                  <span className="text-[10px] uppercase font-bold tracking-wider text-golden block mb-1">
                    {w.category}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-foreground group-hover:text-golden transition-colors line-clamp-1">
                    {w.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageContainer>

      <ContactBand />
    </main>
  );
}

export async function generateStaticParams() {
  const publishedWorks = getPublishedWorks();
  return publishedWorks.map((work) => ({
    slug: work.slug,
  }));
}
