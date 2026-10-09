import { getProducts, createProduct } from "@/lib/repositories/product-repository";
import { apiError, json, parseJson, requireApiAdmin } from "@/lib/api-response";
import { productApiSchema } from "@/lib/api-schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const active = url.searchParams.get("active");
  const products = await getProducts({
    active: active === null ? undefined : active === "true",
    query: url.searchParams.get("q") ?? undefined,
    material: (url.searchParams.get("material") as never) ?? undefined,
    sort: "featured",
  });
  return json({ products });
}

export async function POST(request: Request) {
  if (!(await requireApiAdmin(request))) return apiError("Unauthorized.", 401);
  const parsed = await parseJson(request, productApiSchema);
  if (!parsed.success) return apiError("Invalid product data.", 422);
  try {
    return json({ product: await createProduct(parsed.data) }, 201);
  } catch {
    return apiError("Could not create product.", 400);
  }
}
