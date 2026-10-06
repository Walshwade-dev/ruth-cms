"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { ContactBand, SectionEyebrow } from "@/components/ui/ContactBand";
import { FadeIn } from "@/components/ui/Motion";
import { getPublishedWorks, getCategories } from "@/data/works";
import { profileData } from "@/data/profile";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...getCategories()];
  const publishedWorks = getPublishedWorks();

  const filteredWorks = publishedWorks.filter((work) => {
    if (activeCategory === "All") {
      return true;
    }
    return work.category === activeCategory;
  });

  return (
    <main className="flex-grow bg-background">
      {/* Editorial Header Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-golden/[0.08] via-background to-background pt-16 pb-12 md:pt-24 md:pb-16 border-b border-foreground/[0.05]">
        <PageContainer>
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              {/* Institution / Syllabus Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-golden/10 border border-golden/25 text-xs font-semibold tracking-wide text-foreground/85 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-golden" />
                <span>{profileData.institution} &middot; {profileData.level} Certification</span>
              </div>

              <SectionEyebrow className="justify-center">Curated Coursework Archive</SectionEyebrow>
              
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.05]">
                Practical <span className="text-golden italic">Work</span>
              </h1>

              <p className="text-foreground/75 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                A verified record of practical culinary assessments, dish preparations, and plating executions completed during professional kitchen training.
              </p>
            </FadeIn>

            {/* Segmented Filter Control */}
            <FadeIn delay={0.15}>
              <div className="inline-flex items-center p-1.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] backdrop-blur-sm shadow-xs flex-wrap justify-center gap-1.5">
                <div 
                  className="flex flex-wrap justify-center gap-1.5"
                  role="group" 
                  aria-label="Filter practical works by category"
                >
                  {categories.map((cat) => {
                    const count =
                      cat === "All"
                        ? publishedWorks.length
                        : publishedWorks.filter((w) => w.category === cat).length;
                    const isActive = activeCategory === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        aria-pressed={isActive}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden ${
                          isActive
                            ? "bg-foreground text-background shadow-md scale-102"
                            : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                            isActive
                              ? "bg-golden text-foreground font-black"
                              : "bg-foreground/10 text-foreground/60"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-foreground/50">
                <span>Displaying</span>
                <span className="font-bold text-foreground">{filteredWorks.length}</span>
                <span>{filteredWorks.length === 1 ? "assessment" : "assessments"}</span>
                {activeCategory !== "All" && (
                  <>
                    <span>in</span>
                    <span className="font-bold text-golden">{activeCategory}</span>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </PageContainer>
      </section>

      {/* Main Works Display Section */}
      <section className="py-16 md:py-24">
        <PageContainer>
          <PortfolioGrid works={filteredWorks} />
        </PageContainer>
      </section>

      {/* Editorial Closing Section */}
      <ContactBand
        eyebrow="Culinary Inquiries"
        title="Planning a catered event or bespoke menu?"
        text="From verified coursework to professional catering execution. Connect with Ruth to discuss culinary collaborations."
      />
    </main>
  );
}
