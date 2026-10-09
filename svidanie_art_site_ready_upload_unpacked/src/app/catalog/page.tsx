import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortraitShowcaseCarousel from "@/components/PortraitShowcaseCarousel";
import Shop, { ProductGrid } from "@/components/Shop";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: { where: { enabled: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ topSellerRank: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return (
    <>
      <Header />
      <main className="pt-24">
        <Shop />
        <PortraitShowcaseCarousel />
        <ProductGrid products={products} />
      </main>
      <Footer />
    </>
  );
}
