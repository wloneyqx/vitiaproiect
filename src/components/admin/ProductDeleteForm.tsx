"use client";

import { removeProduct } from "@/lib/actions/admin";

export default function ProductDeleteForm({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={removeProduct}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="rounded-full border border-red-300 px-4 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-50">
        Delete
      </button>
    </form>
  );
}
