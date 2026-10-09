import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProductGrid } from "@/components/Shop";
import { prisma } from "@/lib/db";
import type { Material } from "@/lib/types";

const categories: Material[] = ["canvas", "metal", "string"];

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.includes(category as Material)) notFound();

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: { where: { enabled: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ topSellerRank: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return (
    <>
      <Header />
      <main className="pt-28">
        <ProductGrid products={products.filter((product) => product.material === category)} />
      </main>
      <Footer />
    </>
  );
}
