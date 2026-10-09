import { getOrderById } from "@/lib/repositories/order-repository";
import { apiError, json, requireApiAdmin } from "@/lib/api-response";
import { idSchema } from "@/lib/api-schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiAdmin(request))) return apiError("Unauthorized.", 401);
  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return apiError("Invalid order id.", 422);
  const order = await getOrderById(parsed.data);
  if (!order) return apiError("Order not found.", 404);
  return json({ order });
}
