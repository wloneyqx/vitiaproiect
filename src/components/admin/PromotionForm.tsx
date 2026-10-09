"use client";

import { useActionState } from "react";
import { savePromotion, type AdminActionState } from "@/lib/actions/admin";

const initialState: AdminActionState = { ok: false, message: "" };

export default function PromotionForm() {
  const [state, formAction, pending] = useActionState(savePromotion, initialState);

  return (
    <form action={formAction} className="h-fit rounded-2xl border border-border bg-white/60 p-6">
      <h2 className="font-serif text-2xl text-charcoal">Add or update</h2>
      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Name</span>
        <input name="name" required className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Code</span>
        <input name="code" className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Type</span>
        <select name="discountType" className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
        </select>
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Value</span>
        <input name="discountValue" required type="number" min="1" step="0.01" className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
      </label>
      <label className="mt-4 flex items-center gap-3 font-sans text-sm font-semibold">
        <input name="active" type="checkbox" defaultChecked />
        Active
      </label>
      {state.message && <p className={`mt-4 font-sans text-sm font-semibold ${state.ok ? "text-green-700" : "text-red-700"}`}>{state.message}</p>}
      <button disabled={pending} className="mt-5 rounded-full bg-gold px-6 py-3 font-sans text-sm font-bold text-charcoal">
        {pending ? "Saving..." : "Save promotion"}
      </button>
    </form>
  );
}
