import { getOrders } from "@/lib/repositories/order-repository";
import { apiError, json, requireApiAdmin } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await requireApiAdmin(request))) return apiError("Unauthorized.", 401);
  return json({ orders: await getOrders() });
}
