import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import ProductDeleteForm from "@/components/admin/ProductDeleteForm";
import PortraitArt from "@/components/PortraitArt";
import { toggleProductActive } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { materials } from "@/lib/data";
import { formatMoney } from "@/lib/order-utils";
import { getProducts } from "@/lib/repositories/product-repository";
import type { Material } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; material?: string; status?: string; sort?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const products = await getProducts({
    query: params.q,
    material: materials.some((item) => item.id === params.material) ? (params.material as Material) : undefined,
    status: params.status === "hidden" || params.status === "active" ? params.status : "all",
    sort:
      params.sort === "oldest" || params.sort === "name" || params.sort === "price-low" || params.sort === "price-high" || params.sort === "featured"
        ? params.sort
        : "newest",
  });

  return (
    <AdminShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Catalog admin</p>
              <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Products</h1>
            </div>
            <span className="font-sans text-sm font-semibold text-charcoal-soft">{products.length} products</span>
          </div>

          <form className="mt-6 grid gap-3 rounded-2xl border border-border bg-white/50 p-4 sm:grid-cols-2 xl:grid-cols-[1fr_150px_130px_150px_auto]">
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search products"
              className="rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm"
            />
            <select name="material" defaultValue={params.material ?? ""} className="rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
              <option value="">All materials</option>
              {materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}
            </select>
            <select name="status" defaultValue={params.status ?? "all"} className="rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
            <select name="sort" defaultValue={params.sort ?? "newest"} className="rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="featured">Featured first</option>
              <option value="name">Name</option>
              <option value="price-low">Price low</option>
              <option value="price-high">Price high</option>
            </select>
            <button className="rounded-full bg-charcoal px-5 py-3 font-sans text-sm font-bold text-ivory">Filter</button>
          </form>

          <div className="mt-8 grid gap-4">
            {products.map((product) => (
              <article key={product.id} className="grid gap-4 rounded-2xl border border-border bg-white/50 p-4 sm:grid-cols-[120px_1fr_auto]">
                <div className="h-28 overflow-hidden rounded-xl">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <PortraitArt material={product.material} seed={product.id} className="h-full w-full" />
                  )}
                </div>
                <div>
                  <Link href={`/admin/products/${product.id}`} className="font-serif text-2xl text-charcoal hover:text-gold-deep">{product.name}</Link>
                  <p className="mt-1 font-sans text-sm text-charcoal-soft">{product.slug}</p>
                  <p className="mt-2 font-sans text-xs uppercase tracking-widest text-charcoal-soft">
                    {product.active ? "Active" : "Hidden"} {product.topSellerRank ? `- Top #${product.topSellerRank}` : ""} - {product.variants.length} variants
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <strong className="w-full font-display text-xl text-charcoal sm:text-right">{formatMoney(product.price)}</strong>
                  <Link href={`/admin/products/${product.id}`} className="rounded-full border border-border px-4 py-2 text-xs font-bold text-charcoal-soft hover:bg-ivory-deep">Edit</Link>
                  <form action={toggleProductActive}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="active" value={String(!product.active)} />
                    <button className="rounded-full border border-border px-4 py-2 text-xs font-bold text-charcoal-soft hover:bg-ivory-deep">
                      {product.active ? "Hide" : "Activate"}
                    </button>
                  </form>
                  <ProductDeleteForm id={product.id} name={product.name} />
                </div>
              </article>
            ))}
            {products.length === 0 && (
              <p className="rounded-2xl border border-border bg-white/50 p-6 font-sans text-sm text-charcoal-soft">No products match these filters.</p>
            )}
          </div>
        </section>
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <ProductForm />
        </aside>
      </div>
    </AdminShell>
  );
}
