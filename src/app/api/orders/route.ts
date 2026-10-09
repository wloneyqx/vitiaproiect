import { apiError, json, parseJson } from "@/lib/api-response";
import { orderApiSchema } from "@/lib/api-schemas";
import { createOrderFromPayload } from "@/lib/services/order-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseJson(request, orderApiSchema);
  if (!parsed.success) return apiError("Invalid order data.", 422);
  try {
    const order = await createOrderFromPayload(parsed.data);
    return json({ order }, 201);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Could not create order.", 400);
  }
}
