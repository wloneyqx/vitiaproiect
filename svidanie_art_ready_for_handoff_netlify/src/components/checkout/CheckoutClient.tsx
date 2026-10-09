"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { createOrder, type CheckoutState } from "@/lib/actions/create-order";
import { useCart } from "@/lib/cart/CartContext";
import CartLineItem from "@/components/cart/CartLineItem";

const initialState: CheckoutState = { ok: false, error: "" };

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
        <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Checkout</h1>
        <p className="mt-4 font-serif text-lg italic text-charcoal-soft">Your cart is empty.</p>
        <Link href="/#products" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-charcoal">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_380px] lg:px-10">
      <form action={formAction} className="space-y-6">
        <div>
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Checkout</p>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Delivery details</h1>
        </div>
        <input type="hidden" name="cart" value={cartPayload} />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["country", "Country"],
            ["city", "City"],
            ["address", "Address"],
            ["postalCode", "Postal code"],
          ].map(([name, label]) => (
            <label key={name} className={name === "address" ? "sm:col-span-2" : ""}>
              <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">{label}</span>
              <input
                name={name}
                required
                type={name === "email" ? "email" : "text"}
                className="w-full rounded-xl border border-border bg-white/60 px-4 py-3 font-sans text-sm outline-none focus:border-gold"
              />
            </label>
          ))}
        </div>
        {state.error && <p className="font-sans text-sm font-semibold text-red-700">{state.error}</p>}
        <button disabled={pending} className="rounded-full border border-gold bg-gold px-7 py-3 font-sans text-sm font-bold text-charcoal">
          {pending ? "Creating order..." : "Place order"}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-border p-6">
        <h2 className="font-serif text-xl text-charcoal">Order summary</h2>
        <div className="mt-2">{items.map((item) => <CartLineItem key={item.lineId} item={item} editable={false} />)}</div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-sans text-sm">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(0)}</strong>
        </div>
        <div className="mt-2 flex items-center justify-between font-sans text-sm">
          <span>Shipping</span>
          <strong>Free</strong>
        </div>
      </aside>
    </div>
  );
}
