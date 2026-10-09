"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import CartLineItem from "./CartLineItem";

export default function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
          Your Cart
        </p>
        <h1 className="font-serif text-5xl italic text-white">
          Your cart is empty
        </h1>
        <p className="mt-4 text-lg text-white/62">
          Find the material and moment that speaks to you.
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-block cursor-pointer rounded-[9999px] bg-white px-6 py-3 font-sans text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)]"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
      <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
        Your Cart
      </p>
      <h1 className="font-serif text-5xl italic text-white sm:text-6xl">
        Review your pieces
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="liquid-glass rounded-[28px] px-6">
          {items.map((item) => (
            <CartLineItem
              key={item.lineId}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="liquid-glass h-fit rounded-[28px] p-6">
          <h2 className="font-serif text-xl italic text-white">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between border-t border-white/12 pt-4 font-sans text-sm text-white/62">
            <span>Subtotal</span>
            <span className="font-semibold text-white">${subtotal.toFixed(0)}</span>
          </div>
          <p className="mt-2 font-sans text-xs text-white/50">
            Shipping is free worldwide, calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="mt-6 block cursor-pointer rounded-[9999px] bg-white px-6 py-3 text-center font-sans text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)]"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/catalog"
            className="mt-3 block text-center font-sans text-sm font-medium text-white/55 transition-colors hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
