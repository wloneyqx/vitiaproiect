"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { createOrder, type CheckoutState } from "@/lib/actions/create-order";
import { useCart } from "@/lib/cart/CartContext";
import CartLineItem from "@/components/cart/CartLineItem";

const initialState: CheckoutState = { ok: false, error: "" };

const fields = [
  ["firstName", "First name"],
  ["lastName", "Last name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["country", "Country"],
  ["city", "City"],
  ["address", "Address"],
  ["postalCode", "Postal code"],
] as const;

export default function CheckoutClient() {
  const { items, subtotal } = useCart();
  const [state, formAction, pending] = useActionState(createOrder, initialState);
  const cartPayload = useMemo(
    () =>
      JSON.stringify(
        items.map(({ productId, variantId, quantity, customization }) => ({
          productId,
          variantId,
          quantity,
          customization,
        }))
      ),
    [items]
  );

  if (items.length === 0 && !pending) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-5xl italic text-white">Checkout</h1>
        <p className="mt-4 text-lg text-white/62">Your cart is empty.</p>
        <Link href="/catalog" className="mt-8 inline-block rounded-[9999px] bg-white px-6 py-3 font-sans text-sm font-semibold text-black">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_380px] lg:px-10">
      <form action={formAction} className="space-y-6">
        <div>
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/45">Checkout</p>
          <h1 className="font-serif text-5xl italic text-white">Delivery details</h1>
        </div>
        <input type="hidden" name="cart" value={cartPayload} />
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([name, label]) => (
            <label key={name} className={name === "address" ? "sm:col-span-2" : ""}>
              <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-white/45">{label}</span>
              <input
                name={name}
                required
                type={name === "email" ? "email" : "text"}
                className="w-full rounded-[9999px] border border-white/12 bg-white/[0.04] px-4 py-3 font-sans text-sm text-white outline-none transition-colors placeholder:text-white/38 focus:border-white/55"
              />
            </label>
          ))}
        </div>
        {state.error && <p className="font-sans text-sm font-semibold text-red-300">{state.error}</p>}
        <button disabled={pending} className="rounded-[9999px] bg-white px-7 py-3 font-sans text-sm font-bold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] disabled:opacity-60">
          {pending ? "Creating order..." : "Place order"}
        </button>
      </form>

      <aside className="liquid-glass h-fit rounded-[28px] p-6">
        <h2 className="font-serif text-xl italic text-white">Order summary</h2>
        <div className="mt-2">{items.map((item) => <CartLineItem key={item.lineId} item={item} editable={false} />)}</div>
        <div className="mt-4 flex items-center justify-between border-t border-white/12 pt-4 font-sans text-sm text-white/62">
          <span>Subtotal</span>
          <strong className="text-white">${subtotal.toFixed(0)}</strong>
        </div>
        <div className="mt-2 flex items-center justify-between font-sans text-sm text-white/62">
          <span>Shipping</span>
          <strong className="text-white">Free</strong>
        </div>
      </aside>
    </div>
  );
}
