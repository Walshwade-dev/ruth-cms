import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContactBand, SectionEyebrow } from "@/components/ui/ContactBand";
import { FadeIn, ScrollLine } from "@/components/ui/Motion";
import { learningAreas, coreSkills, journeyStages } from "@/data/learning";
import { profileData } from "@/data/profile";

export default function LearningJourneyPage() {
  return (
    <main className="flex-grow bg-background">
      {/* Editorial Header */}
      <section className="bg-linear-to-b from-golden/[0.07] via-background to-background pt-16 pb-12 md:pt-24 md:pb-16 border-b border-foreground/[0.05]">
        <PageContainer className="text-center max-w-4xl mx-auto">
          <FadeIn>
            <SectionEyebrow className="justify-center">Skills & Curriculum Map</SectionEyebrow>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Learning <span className="italic text-golden">Journey</span>
            </h1>
            <p className="text-foreground/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              A structured progression through technical culinary fundamentals, curriculum modules, and professional kitchen standards at {profileData.institution}.
            </p>
          </FadeIn>
        </PageContainer>
      </section>

      {/* Narrative Interactive Roadmap / Flowchart */}
      <section className="py-20 md:py-28">
        <PageContainer>
          <div className="max-w-3xl mb-16 md:mb-20">
            <SectionEyebrow>Progressive Framework</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Culinary Development <span className="text-golden italic">Flow</span>
            </h2>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              How foundational food safety and knife work connect to menu composition, plating, and hospitality management.
            </p>
          </div>

          {/* Stepped Timeline / Flowchart */}
          <div className="relative pl-6 sm:pl-10 md:pl-16 space-y-12 md:space-y-16">
            {/* Scroll-animated vertical progress track */}
            <ScrollLine className="absolute left-2.5 sm:left-4 md:left-6 top-3 bottom-8 w-0.5 rounded-full" />

            {journeyStages.map((stage, index) => {
              // Resolve linked skills and areas
              const stageSkills = stage.skillIds
                ? coreSkills.filter((s) => stage.skillIds?.includes(s.id))
                : [];
              const stageAreas = stage.areaIds
                ? learningAreas.filter((a) => stage.areaIds?.includes(a.id))
                : [];

              return (
                <FadeIn key={stage.id} delay={index * 0.08} direction="up">
                  <div className="relative group">
                    {/* Node Milestone Marker */}
                    <div className="absolute -left-[1.85rem] sm:-left-[2.85rem] md:-left-[4.35rem] top-1.5 w-6 h-6 rounded-full bg-background border-4 border-golden shadow-sm group-hover:scale-125 transition-transform duration-300" />

                    <div className="rounded-[2rem] bg-white border border-foreground/[0.07] p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-xl hover:border-golden/30 transition-all duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-golden">
                          Phase 0{index + 1} &middot; {stage.label}
                        </span>
                        {stage.portfolioCategories && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-foreground/60">
                              Evidenced in:
                            </span>
                            {stage.portfolioCategories.map((cat) => (
                              <Link
                                key={cat}
                                href="/portfolio"
                                className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-golden/10 text-golden hover:bg-golden hover:text-foreground transition-colors"
                              >
                                {cat}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                        {stage.title}
                      </h3>
                      <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
                        {stage.description}
                      </p>

                      {/* Associated Nodes Tags */}
                      {(stageSkills.length > 0 || stageAreas.length > 0) && (
                        <div className="pt-4 border-t border-foreground/[0.06] flex flex-wrap gap-2">
                          {stageSkills.map((s) => (
                            <span
                              key={s.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground/[0.03] text-foreground/80 border border-foreground/[0.06]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-golden/80" />
                              {s.name}
                            </span>
                          ))}
                          {stageAreas.map((a) => (
                            <span
                              key={a.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-golden/10 text-foreground border border-golden/20"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-golden" />
                              {a.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Full Competencies & Curriculum Matrix Overview */}
      <section className="py-20 bg-foreground/[0.02] border-t border-foreground/[0.05]">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionEyebrow>Comprehensive Index</SectionEyebrow>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Full Curriculum <span className="text-golden italic">& Skills</span>
              </h2>
              <p className="text-foreground/70 leading-relaxed text-sm md:text-base mb-6">
                Complete overview of the curriculum modules and core operational competencies covered under the {profileData.level} syllabus.
              </p>
              <div className="p-5 rounded-2xl bg-golden/10 border border-golden/20">
                <span className="text-xs font-bold uppercase tracking-wider text-golden block mb-1">
                  Institution Record
                </span>
                <p className="font-bold text-foreground text-sm">
                  {profileData.institution} &middot; {profileData.programme}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">
                  Curriculum Modules (Dishes & Courses)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {learningAreas.map((area) => (
                    <div
                      key={area.id}
                      className="p-4 rounded-xl bg-white border border-foreground/[0.07] shadow-xs flex items-center gap-2.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-golden shrink-0" />
                      <span className="text-xs md:text-sm font-semibold text-foreground">
                        {area.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 mb-4">
                  Core Competencies & Kitchen Operations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {coreSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-xl bg-white border border-foreground/[0.07] shadow-xs flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                      <span className="text-xs font-medium text-foreground/85">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <ContactBand
        eyebrow="Practical Application"
        title="See these skills in practice"
        text="Review the verified food preparations, courses, and plate presentations."
      />
    </main>
  );
}
