"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminActionState } from "@/lib/actions/admin";

const initialState: AdminActionState = { ok: false, message: "" };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-6">
      <form action={formAction} className="w-full max-w-sm rounded-2xl border border-border bg-white/70 p-8 shadow-[0_24px_48px_-30px_rgba(26,26,26,0.35)]">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Private admin</p>
        <h1 className="font-display text-3xl font-extrabold uppercase text-charcoal">Sign in</h1>
        <label className="mt-8 block">
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Email</span>
          <input name="email" type="email" required className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm outline-none focus:border-gold" />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Password</span>
          <input name="password" type="password" required className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm outline-none focus:border-gold" />
        </label>
        {state.message && <p className="mt-4 font-sans text-sm font-semibold text-red-700">{state.message}</p>}
        <button disabled={pending} className="mt-6 w-full rounded-full border border-gold bg-gold px-6 py-3 font-sans text-sm font-bold text-charcoal">
          {pending ? "Checking..." : "Open admin"}
        </button>
      </form>
    </main>
  );
}
