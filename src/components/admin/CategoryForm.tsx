"use client";

import { useActionState } from "react";
import { saveCategory, type AdminActionState } from "@/lib/actions/admin";

const initialState: AdminActionState = { ok: false, message: "" };

export default function CategoryForm() {
  const [state, formAction, pending] = useActionState(saveCategory, initialState);

  return (
    <form action={formAction} className="h-fit rounded-2xl border border-border bg-white/60 p-6">
      <h2 className="font-serif text-2xl text-charcoal">Add or update</h2>
      {[
        ["name", "Name"],
        ["slug", "Slug"],
        ["description", "Description"],
        ["sortOrder", "Sort order"],
      ].map(([name, label]) => (
        <label key={name} className="mt-4 block">
          <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">{label}</span>
          <input name={name} required={name !== "description"} type={name === "sortOrder" ? "number" : "text"} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm" />
        </label>
      ))}
      <label className="mt-4 flex items-center gap-3 font-sans text-sm font-semibold">
        <input name="active" type="checkbox" defaultChecked />
        Active
      </label>
      {state.message && <p className={`mt-4 font-sans text-sm font-semibold ${state.ok ? "text-green-700" : "text-red-700"}`}>{state.message}</p>}
      <button disabled={pending} className="mt-5 rounded-full bg-gold px-6 py-3 font-sans text-sm font-bold text-charcoal">
        {pending ? "Saving..." : "Save category"}
      </button>
    </form>
  );
}
