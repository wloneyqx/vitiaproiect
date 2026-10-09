import { apiError, json } from "@/lib/api-response";
import { query } from "@/lib/mysql";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await query("SELECT 1 AS ok");
    return json({ ok: true, database: "ok" });
  } catch {
    return apiError("Health check failed.", 503);
  }
}
