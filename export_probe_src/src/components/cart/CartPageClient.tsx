"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import CartLineItem from "./CartLineItem";

export default function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Your Cart
        </p>
        <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">
          Your cart is empty
        </h1>
        <p className="mt-4 font-serif text-lg italic text-charcoal-soft">
          Find the material and moment that speaks to you.
        </p>
        <Link
          href="/#products"
          className="mt-8 inline-block cursor-pointer rounded-full border border-gold bg-gold px-6 py-3 font-sans text-sm font-semibold text-charcoal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.6)]"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
      <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
        Your Cart
      </p>
      <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal sm:text-5xl">
        Review your pieces
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border px-6">
          {items.map((item) => (
            <CartLineItem
              key={item.lineId}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-sans text-sm text-charcoal-soft">
            <span>Subtotal</span>
            <span className="font-semibold text-charcoal">${subtotal.toFixed(0)}</span>
          </div>
          <p className="mt-2 font-sans text-xs text-charcoal-soft">
            Shipping is free worldwide, calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="mt-6 block cursor-pointer rounded-full border border-gold bg-gold px-6 py-3 text-center font-sans text-sm font-semibold text-charcoal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.6)]"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/#products"
            className="mt-3 block text-center font-sans text-sm font-medium text-charcoal-soft transition-colors hover:text-charcoal"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
