import { query } from "@/lib/mysql";
import { apiError, json, parseJson } from "@/lib/api-response";
import { reviewApiSchema } from "@/lib/api-schemas";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/mysql";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId");
  const reviews = await query<RowDataPacket[]>(
    `SELECT id, product_id AS productId, customer_name AS customerName, rating, comment, approved, created_at AS createdAt
     FROM reviews
     WHERE approved = TRUE ${productId ? "AND product_id = :productId" : ""}
     ORDER BY created_at DESC`,
    productId ? { productId } : {},
  );
  return json({ reviews });
}

export async function POST(request: Request) {
  const parsed = await parseJson(request, reviewApiSchema);
  if (!parsed.success) return apiError("Invalid review data.", 422);
  const products = await query<RowDataPacket[]>(
    `SELECT id FROM products WHERE id = :productId AND active = TRUE LIMIT 1`,
    { productId: parsed.data.productId },
  );
  if (!products[0]) return apiError("Product not found.", 404);

  try {
    const [result] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO reviews (product_id, customer_name, rating, comment, approved)
       VALUES (:productId, :customerName, :rating, :comment, FALSE)`,
      parsed.data,
    );
    return json({ reviewId: result.insertId, approved: false }, 201);
  } catch {
    return apiError("Could not save review.", 400);
  }
}
