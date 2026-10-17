import { getProfile } from "@/lib/data/profile";
import { getPublishedWorks, getCategories } from "@/lib/data/projects";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export default async function PortfolioPage() {
  const [profile, works, categories] = await Promise.all([
    getProfile(),
    getPublishedWorks(),
    getCategories(),
  ]);

  return <PortfolioView profile={profile} works={works} categories={categories} />;
}
