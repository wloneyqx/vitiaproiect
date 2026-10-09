import AdminShell from "@/components/admin/AdminShell";
import { removeReview, toggleReviewApproval } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { query } from "@/lib/mysql";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await query<RowDataPacket[]>(
    `SELECT r.id, r.customer_name AS customerName, r.rating, r.comment, r.approved, r.created_at AS createdAt, p.name AS productName
     FROM reviews r
     JOIN products p ON p.id = r.product_id
     ORDER BY r.created_at DESC`,
  );

  return (
    <AdminShell>
      <h1 className="font-display text-4xl font-extrabold uppercase text-charcoal">Reviews</h1>
      <div className="mt-8 grid gap-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-2xl border border-border bg-white/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <strong className="font-serif text-xl text-charcoal">{review.customerName}</strong>
                <p className="font-sans text-sm text-charcoal-soft">{review.productName} - {review.rating}/5</p>
              </div>
              <div className="flex gap-2">
                <form action={toggleReviewApproval}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="approved" value={String(!review.approved)} />
                  <button className="rounded-full border border-border px-4 py-2 font-sans text-xs font-bold text-charcoal-soft">
                    {review.approved ? "Hide" : "Approve"}
                  </button>
                </form>
                <form action={removeReview}>
                  <input type="hidden" name="id" value={review.id} />
                  <button className="rounded-full border border-red-200 px-4 py-2 font-sans text-xs font-bold text-red-700">Delete</button>
                </form>
              </div>
            </div>
            <p className="mt-4 font-sans text-sm text-charcoal-soft">{review.comment}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
