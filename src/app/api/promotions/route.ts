import { query } from "@/lib/mysql";
import { json } from "@/lib/api-response";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  const promotions = await query<RowDataPacket[]>(
    `SELECT p.id, p.name, p.code, p.discount_type AS discountType, p.discount_value AS discountValue,
            p.start_date AS startDate, p.end_date AS endDate, p.active,
            JSON_ARRAYAGG(pp.product_id) AS productIds
     FROM promotions p
     LEFT JOIN promotion_products pp ON pp.promotion_id = p.id
     WHERE p.active = TRUE
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
  );
  return json({ promotions });
}
