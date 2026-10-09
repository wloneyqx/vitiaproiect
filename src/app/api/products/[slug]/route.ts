import { getProductBySlug } from "@/lib/repositories/product-repository";
import { deleteProduct, getProductById, updateProduct } from "@/lib/repositories/product-repository";
import { apiError, json, parseJson, requireApiAdmin } from "@/lib/api-response";
import { productApiSchema } from "@/lib/api-schemas";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) return apiError("Product not found.", 404);
  return json({ product });
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireApiAdmin(request))) return apiError("Unauthorized.", 401);
  const parsed = await parseJson(request, productApiSchema.partial());
  if (!parsed.success) return apiError("Invalid product data.", 422);
  const { slug: productId } = await params;
  try {
    return json({ product: await updateProduct(productId, parsed.data) });
  } catch {
    return apiError("Could not update product.", 400);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireApiAdmin(request))) return apiError("Unauthorized.", 401);
  const { slug: productId } = await params;
  const product = await getProductById(productId);
  if (!product) return apiError("Product not found.", 404);
  return json({ product: await deleteProduct(productId) });
}
