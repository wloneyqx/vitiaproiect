import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProductGrid } from "@/components/Shop";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: { where: { enabled: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ topSellerRank: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });
  const saleProducts = products.filter((product) => product.isOnSale);

  return (
    <>
      <Header />
      <main className="pt-28">
        <ProductGrid products={saleProducts} />
      </main>
      <Footer />
    </>
  );
}
