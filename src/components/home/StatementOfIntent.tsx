import { PageContainer } from "@/components/layout/PageContainer";
import { SectionEyebrow } from "@/components/ui/ContactBand";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { profileData } from "@/data/profile";

/**
 * Career-direction band. Uses only the confirmed career directions from the
 * profile; the hero already carries the statement of intent.
 */
export function StatementOfIntent() {
  return (
    <section className="py-8 md:py-12">
      <PageContainer>
        <div className="relative overflow-hidden rounded-[2rem] bg-golden/10 px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-16 h-64 w-64 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-golden/15"
          />
          <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end">
            <FadeIn className="lg:col-span-5">
              <SectionEyebrow>Career direction</SectionEyebrow>
              <h2 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Where the craft is <span className="italic text-golden">heading</span>
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-foreground/70">
                Training at {profileData.institution} is the first step toward a professional future in food.
              </p>
            </FadeIn>

            <StaggerContainer className="lg:col-span-7">
              <ol className="grid gap-4 sm:grid-cols-3">
                {profileData.careerDirection.map((item, i) => (
                  <StaggerItem
                    key={item}
                    as="li"
                    className="flex h-full flex-col rounded-2xl bg-background/80 p-6 shadow-sm backdrop-blur-sm"
                  >
                    <span className="font-serif text-3xl font-bold text-golden">0{i + 1}</span>
                    <span className="mt-6 text-sm font-medium leading-snug text-foreground md:text-base">{item}</span>
                  </StaggerItem>
                ))}
              </ol>
            </StaggerContainer>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
