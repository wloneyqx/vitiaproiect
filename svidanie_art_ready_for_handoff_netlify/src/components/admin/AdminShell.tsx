import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAdmin } from "@/lib/actions/admin";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-border bg-charcoal text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/admin" className="font-display text-xl font-extrabold">svidanie_admin</Link>
          <nav className="flex items-center gap-5 font-sans text-sm">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/admin/products">Products</Link>
            <form action={logoutAdmin}>
              <button className="rounded-full border border-gold px-4 py-2 text-gold">Logout</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
