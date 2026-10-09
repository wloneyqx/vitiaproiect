import { updateOrderStatus } from "@/lib/repositories/order-repository";
import { apiError, json, parseJson, requireApiAdmin } from "@/lib/api-response";
import { idSchema, orderStatusApiSchema } from "@/lib/api-schemas";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireApiAdmin(request))) return apiError("Unauthorized.", 401);
  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return apiError("Invalid order id.", 422);
  const parsed = await parseJson(request, orderStatusApiSchema);
  if (!parsed.success) return apiError("Invalid order status.", 422);
  const order = await updateOrderStatus(parsedId.data, parsed.data.status, parsed.data.paymentStatus);
  return json({ order });
}
