"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { uploadCustomerPhoto } from "@/lib/actions/upload-customer-photo";
import { useCart } from "@/lib/cart/CartContext";
import type { ProductWithVariants } from "@/lib/products";

const defaultSizes = ["30 x 40 cm", "50 x 70 cm", "70 x 100 cm"];
const defaultStyles = ["Classic", "Modern", "Royal"];

export default function ProductDetailClient({ product }: { product: ProductWithVariants }) {
  const { addItem } = useCart();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? "");
  const [size, setSize] = useState(product.variants[0]?.size ?? defaultSizes[0]);
  const [style, setStyle] = useState(product.variants[0]?.style ?? defaultStyles[0]);
  const [note, setNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
  const price = selectedVariant?.priceOverride ?? product.price;
  const sizes = product.variants.length ? product.variants.map((variant) => variant.size) : defaultSizes;
  const styles = product.variants.length
    ? [...new Set(product.variants.map((variant) => variant.style).filter(Boolean) as string[])]
    : defaultStyles;

  const canAdd = useMemo(() => !isPending, [isPending]);

  function uploadPhoto() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.set("photo", file);
    startTransition(async () => {
      const result = await uploadCustomerPhoto(data);
      if (result.ok) {
        setPhotoUrl(result.url);
        setMessage("Photo uploaded.");
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="mt-8 space-y-7">
      <div>
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Size</p>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSize(item);
                const variant = product.variants.find((v) => v.size === item);
                setSelectedVariantId(variant?.id ?? "");
                if (variant?.style) setStyle(variant.style);
              }}
              className={`rounded-full border px-3 py-2 font-sans text-sm font-semibold ${
                size === item ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal-soft"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Style</p>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStyle(item)}
              className={`rounded-full border px-3 py-2 font-sans text-sm font-semibold ${
                style === item ? "border-gold bg-gold text-charcoal" : "border-border text-charcoal-soft"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">
          Customer photo
        </label>
        <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto} className="block w-full font-sans text-sm" />
        {message && <p className="mt-2 font-sans text-sm text-gold-deep">{message}</p>}
      </div>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Notes for the artist"
        className="min-h-28 w-full rounded-xl border border-border bg-white/60 p-4 font-sans text-sm outline-none focus:border-gold"
      />

      <button
        type="button"
        disabled={!canAdd}
        onClick={() =>
          addItem({
            productId: product.id,
            variantId: selectedVariantId || undefined,
            slug: product.slug,
            name: product.name,
            material: product.material,
            image: product.imageUrl ?? undefined,
            unitPrice: price,
            customization: { uploadedPhotoUrl: photoUrl, size, style, note },
          })
        }
        className="w-full rounded-full border border-gold bg-gold px-6 py-4 font-sans text-sm font-bold text-charcoal transition-all hover:-translate-y-0.5"
      >
        Add custom portrait - ${price.toFixed(0)}
      </button>
      <Link href="/cart" className="block text-center font-sans text-sm font-semibold text-charcoal-soft hover:text-charcoal">
        View cart
      </Link>
    </div>
  );
}
