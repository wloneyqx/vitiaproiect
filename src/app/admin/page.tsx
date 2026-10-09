import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { formatMoney } from "@/lib/order-utils";
import { countOrdersByStatus, getOrders, getRevenueTotal } from "@/lib/repositories/order-repository";
import { getProducts } from "@/lib/repositories/product-repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [orders, products, revenue, pending] = await Promise.all([
    getOrders(8),
    getProducts(),
    getRevenueTotal(),
    countOrdersByStatus("NEW"),
  ]);

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Control room</p>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Dashboard</h1>
        </div>
        <Link href="/admin/products" className="rounded-full bg-gold px-5 py-3 font-sans text-sm font-bold text-charcoal">Manage products</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Revenue", formatMoney(revenue._sum.total ?? 0)],
          ["Orders", String(orders.length)],
          ["New orders", String(pending)],
          ["Products", String(products.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-white/60 p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">{label}</p>
            <p className="mt-3 font-display text-3xl font-extrabold text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-white/50">
        <div className="border-b border-border p-6">
          <h2 className="font-serif text-2xl text-charcoal">Latest orders</h2>
        </div>
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-3 p-5 font-sans text-sm hover:bg-ivory-deep sm:grid-cols-[160px_1fr_130px_120px]">
              <strong>{order.orderNumber}</strong>
              <span>{order.firstName} {order.lastName} - {order.email}</span>
              <span>{order.status}</span>
              <span className="font-bold">{formatMoney(order.total)}</span>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
