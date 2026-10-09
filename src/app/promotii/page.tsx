import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProductGrid } from "@/components/Shop";
import { getProducts } from "@/lib/repositories/product-repository";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const products = await getProducts({ active: true, sort: "featured" });
  const saleProducts = products.filter((product) => product.isOnSale);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-28">
        <ProductGrid products={saleProducts} title="Promotii" variant="dark" />
      </main>
      <Footer variant="dark" />
    </>
  );
}
