import { query } from "@/lib/mysql";
import { json } from "@/lib/api-response";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await query<RowDataPacket[]>(
    `SELECT id, name, slug, description, active, sort_order AS sortOrder
     FROM categories
     WHERE active = TRUE
     ORDER BY sort_order ASC, name ASC`,
  );
  return json({ categories });
}
