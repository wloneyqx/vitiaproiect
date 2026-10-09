import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { updateOrder } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { formatDate, formatMoney } from "@/lib/order-utils";
import { getOrderById } from "@/lib/repositories/order-repository";
import { OrderStatus, PaymentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderById(Number(id));
  if (!order) notFound();

  return (
    <AdminShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">{formatDate(order.createdAt)}</p>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">{order.orderNumber}</h1>
          <div className="mt-8 rounded-2xl border border-border bg-white/50 p-6 font-sans text-sm leading-7">
            <h2 className="mb-3 font-serif text-2xl text-charcoal">Customer</h2>
            <p>{order.firstName} {order.lastName}</p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            <p>{order.address}, {order.city}, {order.postalCode}, {order.country}</p>
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-white/50 p-6">
            <h2 className="mb-4 font-serif text-2xl text-charcoal">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-4 border-b border-border pb-4 last:border-b-0 sm:grid-cols-[96px_1fr_100px]">
                  <div className="h-24 overflow-hidden rounded-xl bg-ivory-deep">
                    {item.uploadedPhotoUrl || item.productImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.uploadedPhotoUrl ?? item.productImageUrl ?? ""} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="font-sans text-sm">
                    <strong>{item.productName}</strong>
                    <p className="text-charcoal-soft">{[item.size, item.style].filter(Boolean).join(" - ")}</p>
                    {item.customizationNote && <p className="mt-2 text-charcoal-soft">{item.customizationNote}</p>}
                  </div>
                  <strong className="font-display text-lg">{formatMoney(item.lineTotal)}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-border bg-white/60 p-6">
          <form action={updateOrder} className="space-y-4">
            <input type="hidden" name="id" value={order.id} />
            <label className="block">
              <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Order status</span>
              <select name="status" defaultValue={order.status} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
                {Object.values(OrderStatus).map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-soft">Payment</span>
              <select name="paymentStatus" defaultValue={order.paymentStatus} className="w-full rounded-xl border border-border bg-ivory px-4 py-3 font-sans text-sm">
                {Object.values(PaymentStatus).map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <div className="border-t border-border pt-4 font-sans text-sm">
              <div className="flex justify-between"><span>Subtotal</span><strong>{formatMoney(order.subtotal)}</strong></div>
              <div className="mt-2 flex justify-between"><span>Total</span><strong>{formatMoney(order.total)}</strong></div>
            </div>
            <button className="w-full rounded-full bg-gold px-5 py-3 font-sans text-sm font-bold text-charcoal">Save changes</button>
          </form>
        </aside>
      </div>
    </AdminShell>
  );
}
