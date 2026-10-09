"use client";

import PortraitArt from "@/components/PortraitArt";
import { materials } from "@/lib/data";
import type { CartItem } from "@/lib/cart/CartContext";

function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(quantity - 1)}
        className="grid h-8 w-8 cursor-pointer place-items-center text-charcoal-soft transition-colors hover:text-charcoal"
      >
        −
      </button>
      <span className="w-6 text-center font-sans text-sm font-semibold text-charcoal">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="grid h-8 w-8 cursor-pointer place-items-center text-charcoal-soft transition-colors hover:text-charcoal"
      >
        +
      </button>
    </div>
  );
}

export default function CartLineItem({
  item,
  editable = true,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  editable?: boolean;
  onQuantityChange?: (lineId: string, quantity: number) => void;
  onRemove?: (lineId: string) => void;
}) {
  const materialLabel = materials.find((m) => m.id === item.material)?.name ?? item.material;
  const customization = item.customization;

  return (
    <div className="flex gap-4 border-b border-border py-6 last:border-b-0 sm:gap-6">
      <div className="h-28 w-24 flex-none overflow-hidden rounded-xl sm:h-32 sm:w-28">
        {item.image || customization?.uploadedPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={customization?.uploadedPhotoUrl ?? item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <PortraitArt material={item.material} seed={item.productId} className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <h3 className="font-serif text-lg text-charcoal">{item.name}</h3>
          <p className="mt-0.5 font-sans text-sm text-charcoal-soft">{materialLabel}</p>
          {(customization?.size || customization?.style) && (
            <p className="mt-1 font-sans text-xs uppercase tracking-wide text-charcoal-soft">
              {[customization?.size, customization?.style].filter(Boolean).join(" · ")}
            </p>
          )}
          {customization?.uploadedPhotoUrl && (
            <p className="mt-1 font-sans text-xs text-gold-deep">Custom photo uploaded</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
          <p className="font-display text-lg font-bold text-charcoal">
            ${(item.unitPrice * item.quantity).toFixed(0)}
          </p>
          {editable && onQuantityChange ? (
            <QuantityStepper
              quantity={item.quantity}
              onChange={(q) => onQuantityChange(item.lineId, q)}
            />
          ) : (
            <p className="font-sans text-sm text-charcoal-soft">Qty {item.quantity}</p>
          )}
          {editable && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.lineId)}
              className="cursor-pointer font-sans text-xs font-medium text-charcoal-soft underline-offset-2 transition-colors hover:text-charcoal hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
