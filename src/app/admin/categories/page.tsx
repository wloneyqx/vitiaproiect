import AdminShell from "@/components/admin/AdminShell";
import CategoryForm from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/mysql";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await query<RowDataPacket[]>(
    `SELECT id, name, slug, description, active, sort_order AS sortOrder FROM categories ORDER BY sort_order ASC, name ASC`,
  );

  return (
    <AdminShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Categories</h1>
          <div className="mt-8 grid gap-4">
            {categories.map((category) => (
              <article key={category.id} className="rounded-2xl border border-border bg-white/50 p-5 font-sans text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-lg text-charcoal">{category.name}</strong>
                    <p className="text-charcoal-soft">{category.slug} - sort {category.sortOrder}</p>
                  </div>
                  <span className="font-semibold">{category.active ? "Active" : "Hidden"}</span>
                </div>
                {category.description && <p className="mt-3 text-charcoal-soft">{category.description}</p>}
              </article>
            ))}
          </div>
        </section>
        <CategoryForm />
      </div>
    </AdminShell>
  );
}
