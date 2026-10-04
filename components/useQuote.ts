"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { CartLine } from "@/lib/store";

export type Quote = { subtotal: number; discount: number; couponCode: string | null; shipping: number; total: number; freeShippingOver: number };

/** Server-priced totals for the bag (prices, coupon and delivery always come from the API). */
export function useQuote(cart: CartLine[], coupon: string) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const key = JSON.stringify(cart.map((l) => [l.id, l.qty, l.size])) + coupon;

  useEffect(() => {
    if (!cart.length) return setQuote(null);
    const items = cart.map((l) => ({ product: l.id, qty: l.qty, size: l.size }));
    api<Quote>("/cart/quote", { body: { items, coupon: coupon || undefined } })
      .then((q) => (setQuote(q), setError("")))
      .catch((e) => setError(e.message));
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return { quote, error };
}
