import { CtaLink } from "@/components/ui/CtaLink";
import { FadeIn } from "@/components/ui/Motion";

/**
 * Closing call-to-action band shared across pages. Deliberately calm: a
 * single fade, no parallax, so the journey ends quietly.
 */
export function ContactBand({
  eyebrow = "Next course",
  title = "Planning a menu or an event?",
  text = "Ruth is building toward a future in catering and food entrepreneurship. Get in touch to start a conversation.",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="px-5 sm:px-8 lg:px-10 pb-20 md:pb-28">
      <FadeIn direction="none">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[2rem] bg-foreground text-background">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-golden/25 blur-3xl"
          />
          <div className="relative grid gap-8 px-8 py-14 md:grid-cols-12 md:items-center md:px-14 md:py-16">
            <div className="md:col-span-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-golden">{eyebrow}</p>
              <h2 className="font-serif text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
              <p className="mt-4 max-w-xl text-background/70 leading-relaxed">{text}</p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <CtaLink href="/contact" variant="light">
                Get in touch
              </CtaLink>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export function SectionEyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-foreground/70 ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-golden" />
      {children}
    </p>
  );
}

