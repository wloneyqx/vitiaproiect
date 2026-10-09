"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProduct, type AdminActionState } from "@/lib/actions/admin";
import { materials } from "@/lib/data";
import type { ProductWithVariants } from "@/lib/products";

const initialState: AdminActionState = { ok: false, message: "" };

export default function ProductForm({ product }: { product?: ProductWithVariants }) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);
  const galleryValue = product?.galleryImageUrls?.join("\n") ?? "";
  const variantsValue =
    product?.variants
      .map((variant) => [variant.size, variant.style ?? "", variant.priceOverride ?? "", String(variant.enabled)].join(" | "))
      .join("\n") ?? "";

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-white/60 p-6">
      <h2 className="font-serif text-2xl text-charcoal">{product ? "Edit product" : "New product"}</h2>
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existingImageUrl" value={product?.imageUrl ?? ""} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Name</span>
          <input name="name" required defaultValue={product?.name} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Slug</span>
          <input name="slug" required defaultValue={product?.slug} placeholder="modern-radiance" className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Price</span>
          <input name="price" required type="number" min="1" step="1" defaultValue={product?.price} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Category</span>
          <input name="category" required defaultValue={product?.category ?? "Custom Portrait"} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Old price</span>
          <input name="compareAtPrice" type="number" min="1" step="1" defaultValue={product?.compareAtPrice ?? ""} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Sale price</span>
          <input name="salePrice" type="number" min="1" step="1" defaultValue={product?.salePrice ?? ""} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Sale percent</span>
          <input name="salePercent" type="number" min="1" max="95" step="1" defaultValue={product?.salePercent ?? ""} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Material</span>
          <select name="material" defaultValue={product?.material ?? "canvas"} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
            {materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Occasion</span>
          <input name="occasion" required defaultValue={product?.occasion} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Theme</span>
          <input name="theme" defaultValue={product?.theme ?? ""} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Top seller rank</span>
          <input name="topSellerRank" type="number" min="1" defaultValue={product?.topSellerRank ?? ""} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label>
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Image</span>
          <input name="image" type="file" accept="image/*" className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
        <label className="flex items-center gap-3 font-sans text-sm font-semibold">
          <input name="active" type="checkbox" defaultChecked={product?.active ?? true} />
          Active in storefront
        </label>
        <label className="flex items-center gap-3 font-sans text-sm font-semibold">
          <input name="isOnSale" type="checkbox" defaultChecked={product?.isOnSale ?? false} />
          Promotional product
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Description</span>
        <textarea name="description" required defaultValue={product?.description} className="min-h-28 w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Gallery URLs</span>
        <textarea
          name="galleryImageUrls"
          defaultValue={galleryValue}
          placeholder="/uploads/products/gallery/portret-panza-1.jpg"
          className="min-h-28 w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Variants</span>
        <textarea
          name="variants"
          defaultValue={variantsValue}
          placeholder="30x40 | Classic | 449 | true"
          className="min-h-28 w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm"
        />
        <span className="mt-2 block font-sans text-xs text-charcoal-soft">One per line: size | style | price override | enabled.</span>
      </label>

      {state.message && <p className={`mt-4 font-sans text-sm font-semibold ${state.ok ? "text-green-700" : "text-red-700"}`}>{state.message}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button disabled={pending} className="rounded-full bg-gold px-6 py-3 font-sans text-sm font-bold text-charcoal">
          {pending ? "Saving..." : "Save product"}
        </button>
        <Link href="/admin/products" className="rounded-full border border-border px-6 py-3 font-sans text-sm font-bold text-charcoal-soft">
          Cancel
        </Link>
      </div>
    </form>
  );
}
