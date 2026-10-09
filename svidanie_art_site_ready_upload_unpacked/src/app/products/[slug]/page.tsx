import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import PortraitArt from "@/components/PortraitArt";
import { prisma } from "@/lib/db";
import { getStartingPrice } from "@/lib/products";
import { materials } from "@/lib/data";
import { formatMoney } from "@/lib/order-utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { where: { enabled: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!product || !product.active) notFound();

  const material = materials.find((item) => item.id === product.material);

  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-10">
        <section>
          <div className="overflow-hidden rounded-[8px] border border-border bg-white/40">
            <div className="aspect-[0.86] max-h-[680px] min-h-[420px]">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <PortraitArt material={product.material} seed={product.id} label={product.name} className="h-full w-full" />
              )}
            </div>
          </div>
        </section>

        <section className="lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#c98220]">
            {material?.name ?? product.material}
          </p>
          <h1 className="font-sans text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.96] tracking-normal text-charcoal">
            {product.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-soft">
            {product.description}
          </p>
          <p className="mt-6 text-3xl font-semibold text-charcoal">
            From {formatMoney(getStartingPrice(product))}
          </p>
          <ProductDetailClient product={product} />
        </section>
      </main>
      <Footer />
    </>
  );
}
