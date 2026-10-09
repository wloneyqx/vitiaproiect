import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getProductById } from "@/lib/repositories/product-repository";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <AdminShell>
      <ProductForm product={product} />
    </AdminShell>
  );
}
