import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProductGrid } from "@/components/Shop";
import { getProducts } from "@/lib/repositories/product-repository";
import type { Material } from "@/lib/types";

const categories: Material[] = ["canvas", "metal", "string"];

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.includes(category as Material)) notFound();

  const products = await getProducts({ active: true, material: category as Material, sort: "featured" });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-28">
        <ProductGrid products={products} variant="dark" />
      </main>
      <Footer variant="dark" />
    </>
  );
}
