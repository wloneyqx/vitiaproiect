import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "svidanie_art - Where Memories Meet Artistry",
  description:
    "Luxury custom portraits on metal, string art, and museum-quality canvas. High-quality materials and master craftsmanship for weddings, birthdays, and family tributes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ivory font-sans text-charcoal">
        <I18nProvider>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
