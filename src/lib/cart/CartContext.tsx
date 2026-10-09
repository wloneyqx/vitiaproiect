"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Material } from "@/lib/data";

const STORAGE_KEY = "svidanie_art:cart:v1";

export type CartCustomization = {
  uploadedPhotoUrl?: string;
  previewImageUrl?: string;
  size?: string;
  style?: string;
  note?: string;
};

export type CartItem = {
  lineId: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  material: Material;
  image?: string;
  unitPrice: number;
  quantity: number;
  customization?: CartCustomization;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineId" | "quantity"> & { quantity?: number }) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeLineId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `line_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Starts empty to match the server-rendered markup exactly; hydrated from
  // localStorage below only after mount, avoiding an SSR/client hydration
  // mismatch (the same pattern already used to fix PortraitArt's SSR bug).
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time sync from an external system (localStorage) on mount, run
    // only after the empty-state SSR markup has already committed — this is
    // the sanctioned effect pattern the lint rule below is generally guarding
    // against misuse of, not the case it's meant to catch.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted/unavailable storage — start with an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = useCallback((item) => {
    setItems((prev) => [...prev, { ...item, lineId: makeLineId(), quantity: item.quantity ?? 1 }]);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.lineId !== lineId)
        : prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
