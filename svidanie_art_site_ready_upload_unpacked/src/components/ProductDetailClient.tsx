"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { uploadCustomerPhoto } from "@/lib/actions/upload-customer-photo";
import { canvasSizes, metalSizes } from "@/lib/data";
import { localizeCategory, useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart/CartContext";
import type { ProductWithVariants } from "@/lib/products";

export default function ProductDetailClient({ product }: { product: ProductWithVariants }) {
  const { addItem } = useCart();
  const { locale, t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const sizeOptions = useMemo(() => {
    if (product.material === "metal") return metalSizes;
    if (product.material === "string") return [{ label: "50x50", price: product.price }];
    return canvasSizes.map((label) => ({ label, price: product.price }));
  }, [product.material, product.price]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.label ?? "50x50");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedPrice = sizeOptions.find((item) => item.label === selectedSize)?.price ?? product.price;

  function uploadPhoto() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.set("photo", file);
    startTransition(async () => {
      const result = await uploadCustomerPhoto(data);
      if (result.ok) {
        setPhotoUrl(result.url);
        setMessage(t("photoReady"));
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="mt-8 space-y-7">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-soft">{t("chooseSize")}</p>
        {product.material === "string" ? (
          <div className="inline-flex min-h-11 items-center rounded-full border border-charcoal bg-charcoal px-5 text-sm font-semibold text-ivory">
            {t("sizeStandard")}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {sizeOptions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSelectedSize(item.label)}
                className={`min-h-11 rounded-full border px-3 text-sm font-semibold transition-colors duration-[250ms] ${
                  selectedSize === item.label ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal-soft hover:border-charcoal"
                }`}
              >
                {item.label.replace("x", "x")}
                {product.material === "metal" && <span className="block text-[11px] font-medium opacity-75">{item.price} {t("lei")}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-soft">{t("quantity")}</p>
        <div className="inline-flex min-h-12 items-center rounded-full border border-border bg-white/50">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-12 w-12 place-items-center text-xl">−</button>
          <span className="w-10 text-center text-base font-semibold">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="grid h-12 w-12 place-items-center text-xl">+</button>
        </div>
      </div>

      <label className="block">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-soft">{t("uploadPhoto")}</span>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={uploadPhoto} className="sr-only" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-charcoal/28 bg-white/48 px-5 text-center transition-[border-color,background,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#c98220] hover:bg-white/70"
        >
          <span className="text-3xl leading-none">+</span>
          <span className="font-semibold">{t("uploadPhoto")}</span>
          <span className="text-sm text-charcoal-soft">{t("uploadHint")}</span>
        </button>
      </label>

      {photoUrl && (
        <div className="overflow-hidden rounded-[8px] border border-border bg-white/50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="Uploaded preview" className="max-h-56 w-full rounded-[6px] object-cover" />
        </div>
      )}
      {message && <p className="text-sm font-medium text-[#c98220]">{message}</p>}

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("note")}
        className="min-h-28 w-full rounded-[8px] border border-border bg-white/60 p-4 text-sm outline-none transition-colors focus:border-[#c98220]"
      />

      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            material: product.material,
            image: product.imageUrl ?? undefined,
            unitPrice: selectedPrice,
            quantity,
            customization: {
              uploadedPhotoUrl: photoUrl,
              size: selectedSize,
              style: localizeCategory(product.material, locale),
              note,
            },
          })
        }
        className="w-full min-h-12 rounded-full bg-charcoal px-6 text-sm font-semibold text-ivory transition-[transform,background] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#c98220]"
      >
        {t("addToBag")} - {selectedPrice} {t("lei")}
      </button>
      <Link href="/cart" className="block text-center text-sm font-semibold text-charcoal-soft transition-colors hover:text-charcoal">
        {t("viewCart")}
      </Link>
    </div>
  );
}
