import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Checkout - svidanie_art" };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-black pt-32 text-white">
        <CheckoutClient />
      </main>
      <Footer variant="dark" />
    </>
  );
}
