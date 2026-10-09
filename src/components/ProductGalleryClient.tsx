"use client";

import { useMemo, useState } from "react";
import PortraitArt from "@/components/PortraitArt";
import { getProductImages, type ProductWithVariants } from "@/lib/products";

export default function ProductGalleryClient({ product }: { product: ProductWithVariants }) {
  const images = useMemo(() => getProductImages(product), [product]);
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="liquid-glass group overflow-hidden rounded-[28px]">
        <div className="relative aspect-[0.86] max-h-[680px] min-h-[420px] overflow-hidden">
          {activeImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[8%] group-hover:scale-[1.02]" />
              {images[1] && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[1]} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full translate-x-full object-cover opacity-0 transition-[transform,opacity] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
                </>
              )}
            </>
          ) : (
            <PortraitArt material={product.material} seed={product.id} label={product.name} className="h-full w-full" />
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`${product.name} ${index + 1}`}
              onMouseEnter={() => setActiveImage(image)}
              onFocus={() => setActiveImage(image)}
              onClick={() => setActiveImage(image)}
              className={`aspect-square overflow-hidden rounded-[18px] border bg-white/[0.04] transition-[border-color,transform] duration-[250ms] hover:-translate-y-0.5 ${
                activeImage === image ? "border-white" : "border-white/15"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
