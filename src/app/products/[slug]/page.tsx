import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductGalleryClient from "@/components/ProductGalleryClient";
import { getStartingPrice } from "@/lib/products";
import { getProductBySlug } from "@/lib/repositories/product-repository";
import { materials } from "@/lib/data";
import { formatMoney } from "@/lib/order-utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (["golden-hour", "brushed-eternity", "woven-devotion"].includes(slug)) {
    redirect("/catalog");
  }
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const material = materials.find((item) => item.id === product.material);

  return (
    <>
      <Header />
      <main className="bg-black px-4 pb-24 pt-32 text-white sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_460px]">
        <section>
          <ProductGalleryClient product={product} />
        </section>

        <section className="lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
            {material?.name ?? product.material}
          </p>
          <h1 className="font-serif text-[clamp(2.6rem,7vw,5.2rem)] italic leading-[0.96] tracking-normal text-white">
            {product.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/66">
            {product.description}
          </p>
          <p className="mt-6 text-3xl font-semibold text-white">
            From {formatMoney(getStartingPrice(product))}
          </p>
          <ProductDetailClient product={product} />
        </section>
        </div>
      </main>
      <Footer variant="dark" />
    </>
  );
}
