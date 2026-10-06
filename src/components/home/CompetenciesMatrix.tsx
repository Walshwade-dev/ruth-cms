import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export function CompetenciesMatrix() {
  const competencies = [
    "Food preparation", "Starter meals", "Main meals", "Desserts", 
    "Pastry", "Special dishes", "Baking", "Food presentation", 
    "Cooking techniques", "Food safety", "Kitchen hygiene", 
    "Menu planning", "Kitchen management", "Hospitality"
  ];

  return (
    <section className="bg-foreground text-background">
      <PageContainer className="py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Core <span className="text-golden italic">Competencies</span>
            </h2>
            <p className="text-background/70 leading-relaxed max-w-sm">
              The foundational learning areas shaping my journey towards professional food entrepreneurship and catering.
            </p>
            <div className="pt-4">
              <Link 
                href="/learning-journey" 
                className="inline-flex items-center text-sm font-semibold tracking-wider uppercase text-golden hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 py-0.5"
              >
                View Learning Journey
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
              {competencies.map((item) => (
                <li key={item} className="flex items-center space-x-2 text-background/90 text-sm md:text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
