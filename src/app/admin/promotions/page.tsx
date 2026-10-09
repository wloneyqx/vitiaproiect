import AdminShell from "@/components/admin/AdminShell";
import PromotionForm from "@/components/admin/PromotionForm";
import { togglePromotionActive } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/mysql";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  await requireAdmin();
  const promotions = await query<RowDataPacket[]>(
    `SELECT id, name, code, discount_type AS discountType, discount_value AS discountValue, active FROM promotions ORDER BY created_at DESC`,
  );

  return (
    <AdminShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Promotions</h1>
          <div className="mt-8 grid gap-4">
            {promotions.map((promotion) => (
              <article key={promotion.id} className="rounded-2xl border border-border bg-white/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <strong className="font-serif text-xl text-charcoal">{promotion.name}</strong>
                    <p className="font-sans text-sm text-charcoal-soft">
                      {promotion.code ?? "No code"} - {promotion.discountValue} {promotion.discountType}
                    </p>
                  </div>
                  <form action={togglePromotionActive}>
                    <input type="hidden" name="id" value={promotion.id} />
                    <input type="hidden" name="active" value={String(!promotion.active)} />
                    <button className="rounded-full border border-border px-4 py-2 font-sans text-xs font-bold text-charcoal-soft">
                      {promotion.active ? "Disable" : "Enable"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
        <PromotionForm />
      </div>
    </AdminShell>
  );
}
