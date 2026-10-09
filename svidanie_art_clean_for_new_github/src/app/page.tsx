import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PortraitShowcaseCarousel from "@/components/PortraitShowcaseCarousel";
import Shop from "@/components/Shop";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

// Prisma reads aren't a recognized Next "dynamic API", so without this a
// build could prerender this page once and admin product edits would never
// show up on the live site without a full rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: { where: { enabled: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ topSellerRank: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <PortraitShowcaseCarousel />
        <Shop products={products} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
