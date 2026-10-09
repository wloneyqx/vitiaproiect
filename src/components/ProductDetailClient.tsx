"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { uploadCustomerPhoto } from "@/lib/actions/upload-customer-photo";
import { canvasSizes, metalSizes } from "@/lib/data";
import { localizeCategory, useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart/CartContext";
import { getProductImages, type ProductWithVariants } from "@/lib/products";

export default function ProductDetailClient({ product }: { product: ProductWithVariants }) {
  const { addItem } = useCart();
  const { locale, t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const sizeOptions = useMemo<{ label: string; price: number; style?: string | null; variantId?: string }[]>(() => {
    if (product.variants.length > 0) {
      return product.variants
        .filter((variant) => variant.enabled)
        .map((variant) => ({
          label: variant.size,
          price: variant.priceOverride ?? product.price,
          style: variant.style,
          variantId: variant.id,
        }));
    }
    if (product.material === "metal") return metalSizes;
    if (product.material === "string") return [{ label: "50x50", price: product.price }];
    return canvasSizes.map((label) => ({ label, price: product.price }));
  }, [product.material, product.price, product.variants]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.label ?? "50x50");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedOption = sizeOptions.find((item) => item.label === selectedSize) ?? sizeOptions[0];
  const selectedPrice = selectedOption?.price ?? product.price;
  const selectedVariantId = selectedOption?.variantId;
  const selectedStyle = selectedOption?.style ?? localizeCategory(product.material, locale);
  const cartImage = getProductImages(product)[0];

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
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-white/45">{t("chooseSize")}</p>
        {product.material === "string" ? (
          <div className="inline-flex min-h-11 items-center rounded-[9999px] bg-white px-5 text-sm font-semibold text-black">
            {t("sizeStandard")}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {sizeOptions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSelectedSize(item.label)}
                className={`min-h-11 rounded-[9999px] border px-3 text-sm font-semibold transition-all duration-[250ms] ${
                  selectedSize === item.label ? "border-white bg-white text-black" : "border-white/15 text-white/65 hover:border-white/55 hover:text-white"
                }`}
              >
                {item.label.replace("x", "x")}
                {(product.material === "metal" || product.variants.length > 0) && <span className="block text-[11px] font-medium opacity-75">{item.price} {t("lei")}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-white/45">{t("quantity")}</p>
        <div className="liquid-glass inline-flex min-h-12 items-center rounded-[9999px]">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-12 w-12 place-items-center text-xl text-white/70 transition-colors hover:text-white">-</button>
          <span className="w-10 text-center text-base font-semibold text-white">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="grid h-12 w-12 place-items-center text-xl text-white/70 transition-colors hover:text-white">+</button>
        </div>
      </div>

      <label className="block">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.26em] text-white/45">{t("uploadPhoto")}</span>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} className="sr-only" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="liquid-glass flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-[28px] px-5 text-center text-white transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
        >
          <span className="text-3xl leading-none">+</span>
          <span className="font-semibold">{t("uploadPhoto")}</span>
          <span className="text-sm text-white/55">{t("uploadHint")}</span>
        </button>
      </label>

      {photoUrl && (
        <div className="liquid-glass overflow-hidden rounded-[24px] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="Uploaded preview" className="max-h-56 w-full rounded-[18px] object-cover" />
        </div>
      )}
      {message && <p className="text-sm font-medium text-white">{message}</p>}

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("note")}
        className="min-h-28 w-full rounded-[24px] border border-white/12 bg-white/[0.04] p-4 text-sm text-white outline-none transition-colors placeholder:text-white/38 focus:border-white/55"
      />

      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          addItem({
            productId: product.id,
            variantId: selectedVariantId,
            slug: product.slug,
            name: product.name,
            material: product.material,
            image: cartImage,
            unitPrice: selectedPrice,
            quantity,
            customization: {
              uploadedPhotoUrl: photoUrl,
              size: selectedSize,
              style: selectedStyle,
              note,
            },
          })
        }
        className="min-h-12 w-full rounded-[9999px] bg-white px-6 text-sm font-semibold text-black transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] disabled:opacity-60"
      >
        {t("addToBag")} - {selectedPrice} {t("lei")}
      </button>
      <Link href="/cart" className="block text-center text-sm font-semibold text-white/58 transition-colors hover:text-white">
        {t("viewCart")}
      </Link>
    </div>
  );
}
