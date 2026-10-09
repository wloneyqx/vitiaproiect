import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortraitShowcaseCarousel from "@/components/PortraitShowcaseCarousel";
import { DarkShop, ProductGrid } from "@/components/Shop";
import { getProducts } from "@/lib/repositories/product-repository";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getProducts({ active: true, sort: "featured" });

  return (
    <>
      <Header />
      <main className="bg-black pt-24">
        <DarkShop />
        <PortraitShowcaseCarousel />
        <ProductGrid products={products} variant="dark" />
      </main>
      <Footer variant="dark" />
    </>
  );
}
