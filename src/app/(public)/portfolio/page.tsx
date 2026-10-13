import { getProfile } from "@/lib/data/profile";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export default async function PortfolioPage() {
  const profile = await getProfile();
  return <PortfolioView profile={profile} />;
}
