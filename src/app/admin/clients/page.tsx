import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/mysql";
import { formatDate, formatMoney } from "@/lib/order-utils";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

type ClientRow = RowDataPacket & {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  orderCount: number;
  paidOrderCount: number;
  totalSpent: number;
  latestOrderId: number;
  latestOrderNumber: string;
  latestOrderAt: Date;
};

export default async function AdminClientsPage() {
  await requireAdmin();
  const clients = await query<ClientRow[]>(
    `SELECT
       SUBSTRING_INDEX(MAX(CONCAT(DATE_FORMAT(created_at, '%Y%m%d%H%i%s'), '|', customer_name)), '|', -1) AS customerName,
       LOWER(customer_email) AS email,
       SUBSTRING_INDEX(MAX(CONCAT(DATE_FORMAT(created_at, '%Y%m%d%H%i%s'), '|', customer_phone)), '|', -1) AS phone,
       SUBSTRING_INDEX(MAX(CONCAT(DATE_FORMAT(created_at, '%Y%m%d%H%i%s'), '|', delivery_city)), '|', -1) AS city,
       SUBSTRING_INDEX(MAX(CONCAT(DATE_FORMAT(created_at, '%Y%m%d%H%i%s'), '|', delivery_country)), '|', -1) AS country,
       COUNT(*) AS orderCount,
       SUM(payment_status = 'PAID') AS paidOrderCount,
       COALESCE(SUM(CASE WHEN payment_status = 'PAID' THEN total ELSE 0 END), 0) AS totalSpent,
       CAST(SUBSTRING_INDEX(MAX(CONCAT(DATE_FORMAT(created_at, '%Y%m%d%H%i%s'), '|', id)), '|', -1) AS UNSIGNED) AS latestOrderId,
       SUBSTRING_INDEX(MAX(CONCAT(DATE_FORMAT(created_at, '%Y%m%d%H%i%s'), '|', order_number)), '|', -1) AS latestOrderNumber,
       MAX(created_at) AS latestOrderAt
     FROM orders
     GROUP BY LOWER(customer_email)
     ORDER BY latestOrderAt DESC`,
  );

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Customer book</p>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Clients</h1>
        </div>
        <span className="font-sans text-sm font-semibold text-charcoal-soft">{clients.length} clients</span>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white/50">
        {clients.map((client) => (
          <article
            key={client.email}
            className="grid gap-4 border-b border-border p-5 font-sans text-sm last:border-b-0 lg:grid-cols-[1.2fr_1fr_130px_140px_170px]"
          >
            <div>
              <strong className="text-base text-charcoal">{client.customerName}</strong>
              <p className="mt-1 text-charcoal-soft">
                <a href={`mailto:${client.email}`} className="hover:text-gold-deep">{client.email}</a>
              </p>
              <p className="text-charcoal-soft">{client.phone}</p>
            </div>
            <div className="text-charcoal-soft">
              <p>{[client.city, client.country].filter(Boolean).join(", ")}</p>
              <p>Last order: {formatDate(new Date(client.latestOrderAt))}</p>
            </div>
            <div>
              <p className="text-charcoal-soft">Orders</p>
              <strong>{client.orderCount}</strong>
            </div>
            <div>
              <p className="text-charcoal-soft">Paid</p>
              <strong>{client.paidOrderCount}</strong>
            </div>
            <div className="lg:text-right">
              <p className="font-bold">{formatMoney(Number(client.totalSpent))}</p>
              <Link href={`/admin/orders/${client.latestOrderId}`} className="text-charcoal-soft hover:text-gold-deep">
                {client.latestOrderNumber}
              </Link>
            </div>
          </article>
        ))}
        {clients.length === 0 && (
          <p className="p-6 font-sans text-sm text-charcoal-soft">No clients yet. They will appear here after the first order.</p>
        )}
      </div>
    </AdminShell>
  );
}
