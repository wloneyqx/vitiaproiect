import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import HomepageVideoBackground from "@/components/HomepageVideoBackground";
import { ProductGrid } from "@/components/Shop";
import { getProducts } from "@/lib/repositories/product-repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts({ active: true, sort: "featured" });

  return (
    <>
      <HomepageVideoBackground />
      <main className="relative z-10 flex-1 bg-transparent">
        <Hero />
        <HowItWorks />
        <ProductGrid products={products} variant="dark" />
      </main>
      <div className="relative z-10">
        <Footer variant="dark" />
      </div>
    </>
  );
}
