import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart — svidanie_art",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-black pt-32 text-white">
        <CartPageClient />
      </main>
      <Footer variant="dark" />
    </>
  );
}
