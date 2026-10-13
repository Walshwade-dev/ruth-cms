import { Hero } from "@/components/home/Hero";
import { StatementOfIntent } from "@/components/home/StatementOfIntent";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { CompetenciesMatrix } from "@/components/home/CompetenciesMatrix";

export default function Home() {
  return (
    <main className="flex-grow">
      <Hero />
      <StatementOfIntent />
      <SelectedWorks />
      <CompetenciesMatrix />
    </main>
  );
}
