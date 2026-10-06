import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileBlock } from "@/components/about/ProfileBlock";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { ContactBand, SectionEyebrow } from "@/components/ui/ContactBand";
import { CtaLink } from "@/components/ui/CtaLink";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { profileData } from "@/data/profile";

export default function AboutPage() {
  return (
    <main className="flex-grow bg-background">
      {/* Intro Header */}
      <section className="bg-linear-to-b from-golden/[0.07] via-background to-background pt-16 pb-12 md:pt-24 md:pb-16 border-b border-foreground/[0.05]">
        <PageContainer className="text-center max-w-4xl mx-auto">
          <FadeIn>
            <SectionEyebrow className="justify-center">Background & Craft</SectionEyebrow>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              About <span className="text-golden italic">Ruth</span>
            </h1>
            <p className="text-foreground/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {profileData.title}
            </p>
          </FadeIn>
        </PageContainer>
      </section>

      {/* Main Two-Column Editorial Profile */}
      <section className="py-16 md:py-24">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Art-Directed Portrait Collage */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <FadeIn direction="up">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative backdrop shape */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-4 -left-4 w-full h-full rounded-[2rem] bg-golden/15 border border-golden/25 -z-10"
                  />
                  {profileData.image ? (
                    <div className="p-2 bg-white rounded-[2rem] shadow-xl border border-foreground/[0.06]">
                      <PhotoFrame
                        src={profileData.image}
                        alt="Ruth Shiru in uniform preparing and presenting culinary works"
                        imageStyle={profileData.imageStyle}
                        aspect="aspect-[3/4]"
                        rounded="rounded-[1.5rem]"
                        sizes="(max-width: 1024px) 100vw, 480px"
                        priority
                        zoomOnHover
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] rounded-[2rem] bg-foreground/5 flex items-center justify-center text-foreground/40 font-medium">
                      [Portrait Placeholder]
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between px-2 text-xs font-semibold tracking-wider uppercase text-foreground/60">
                    <span>{profileData.institution}</span>
                    <span className="text-golden">{profileData.level}</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Narrative, Curriculum, Ambition */}
            <div className="lg:col-span-7 flex flex-col space-y-12">
              <FadeIn delay={0.1}>
                <div className="p-8 md:p-10 rounded-[2rem] bg-foreground/[0.03] border border-foreground/[0.06]">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-golden mb-3 block">
                    Statement of Intent
                  </span>
                  <p className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed italic mb-6">
                    &ldquo;{profileData.statement}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-foreground/10">
                    <CtaLink href="/portfolio" variant="primary">
                      Explore culinary works
                    </CtaLink>
                    <CtaLink href="/learning-journey" variant="secondary">
                      View competencies
                    </CtaLink>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer delayChildren={0.2} staggerChildren={0.15}>
                <StaggerItem direction="up">
                  <ProfileBlock title="Formal Training">
                    <div className="rounded-2xl bg-white p-6 border border-foreground/[0.06] shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                        <h3 className="font-bold text-lg text-foreground">
                          {profileData.institution}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-golden px-2.5 py-1 bg-golden/10 rounded-full w-fit">
                          {profileData.level}
                        </span>
                      </div>
                      <p className="text-foreground/70 text-sm md:text-base">
                        {profileData.programme}
                      </p>
                    </div>
                  </ProfileBlock>
                </StaggerItem>

                <StaggerItem direction="up">
                  <ProfileBlock title="Career Trajectory & Ambition">
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {profileData.careerDirection.map((direction, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-foreground/[0.06] shadow-sm"
                        >
                          <span className="font-serif text-2xl font-bold text-golden mb-4">
                            0{idx + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground/80 leading-snug">
                            {direction}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ProfileBlock>
                </StaggerItem>
              </StaggerContainer>
            </div>

          </div>
        </PageContainer>
      </section>

      <ContactBand
        eyebrow="Collaboration"
        title="Connect with Ruth Shiru"
        text="Whether discussing culinary initiatives, catering opportunities, or food entrepreneurship."
      />
    </main>
  );
}
