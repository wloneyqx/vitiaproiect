import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { formatDate, formatMoney } from "@/lib/order-utils";
import { getOrders } from "@/lib/repositories/order-repository";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getOrders();

  return (
    <AdminShell>
      <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Orders</h1>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white/50">
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-3 border-b border-border p-5 font-sans text-sm last:border-b-0 hover:bg-ivory-deep lg:grid-cols-[160px_1fr_150px_130px_130px]">
            <strong>{order.orderNumber}</strong>
            <span>{order.firstName} {order.lastName}<br /><span className="text-charcoal-soft">{order.email}</span></span>
            <span>{formatDate(order.createdAt)}</span>
            <span>{order.status}</span>
            <span className="font-bold">{formatMoney(order.total)}</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
