import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import PortraitArt from "@/components/PortraitArt";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/order-utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { variants: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ active: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AdminShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Products</h1>
          <div className="mt-8 grid gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/admin/products/${product.id}`} className="grid gap-4 rounded-2xl border border-border bg-white/50 p-4 hover:bg-ivory-deep sm:grid-cols-[120px_1fr_130px]">
                <div className="h-28 overflow-hidden rounded-xl">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <PortraitArt material={product.material} seed={product.id} className="h-full w-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">{product.name}</h2>
                  <p className="mt-1 font-sans text-sm text-charcoal-soft">{product.slug}</p>
                  <p className="mt-2 font-sans text-xs uppercase tracking-widest text-charcoal-soft">
                    {product.active ? "Active" : "Hidden"} {product.topSellerRank ? `- Top #${product.topSellerRank}` : ""}
                  </p>
                </div>
                <strong className="font-display text-xl text-charcoal">{formatMoney(product.price)}</strong>
              </Link>
            ))}
          </div>
        </section>
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <ProductForm />
        </aside>
      </div>
    </AdminShell>
  );
}
