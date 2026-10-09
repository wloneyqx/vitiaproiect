import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartLineItem from "@/components/cart/CartLineItem";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/order-utils";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-36 lg:px-10">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">Order received</p>
        <h1 className="font-display text-5xl font-extrabold uppercase text-charcoal">{order.orderNumber}</h1>
        <p className="mt-4 font-serif text-xl italic text-charcoal-soft">
          We received your custom portrait request and will contact you at {order.email}.
        </p>
        <div className="mt-10 rounded-2xl border border-border px-6">
          {order.items.map((item) => (
            <CartLineItem
              key={item.id}
              editable={false}
              item={{
                lineId: item.id,
                productId: item.productId ?? item.id,
                variantId: item.variantId ?? undefined,
                slug: "",
                name: item.productName,
                material: item.material,
                image: item.productImageUrl ?? undefined,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                customization: {
                  uploadedPhotoUrl: item.uploadedPhotoUrl ?? undefined,
                  size: item.size ?? undefined,
                  style: item.style ?? undefined,
                  note: item.customizationNote ?? undefined,
                },
              }}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between font-display text-2xl font-extrabold">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>
        <Link href="/" className="mt-8 inline-block rounded-full border border-gold bg-gold px-6 py-3 font-sans text-sm font-bold text-charcoal">
          Back to store
        </Link>
      </main>
      <Footer />
    </>
  );
}
