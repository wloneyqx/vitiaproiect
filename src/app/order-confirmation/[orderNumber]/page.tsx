import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartLineItem from "@/components/cart/CartLineItem";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";
import { formatMoney } from "@/lib/order-utils";
import { getOrderByNumber } from "@/lib/repositories/order-repository";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <>
      <ClearCartOnMount />
      <Header />
      <main className="bg-black px-6 py-36 text-white lg:px-10">
        <div className="mx-auto max-w-4xl">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/45">Order received</p>
        <h1 className="font-serif text-5xl italic text-white">{order.orderNumber}</h1>
        <p className="mt-4 text-xl text-white/66">
          We received your custom portrait request and will contact you at {order.email}.
        </p>
        <div className="liquid-glass mt-10 rounded-[28px] px-6">
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
        <div className="mt-6 flex items-center justify-between text-2xl font-semibold">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>
        <Link href="/" className="mt-8 inline-block rounded-[9999px] bg-white px-6 py-3 font-sans text-sm font-bold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)]">
          Back to store
        </Link>
        </div>
      </main>
      <Footer variant="dark" />
    </>
  );
}
