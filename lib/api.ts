import type { Kind } from "./data";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export type Category = { _id: string; name: string; slug: string; kind: Kind; description?: string; image?: string; count?: number; sort?: number; active?: boolean };
export type Product = {
  _id: string; name: string; slug: string; category: Category; metal?: string; weight?: string; sku?: string; description?: string;
  price: number; compareAtPrice?: number; discountPercent: number; stock: number; sizes: string[]; images: string[];
  tag?: string; tone: "emerald" | "rose" | "night"; featured?: boolean; active?: boolean; rating: number; reviewCount: number; sold?: number;
};
export type Address = { _id?: string; label?: string; name: string; phone: string; line1: string; line2?: string; city: string; province?: string; postalCode?: string };
export type User = { _id: string; name: string; email: string; phone?: string; role: "customer" | "admin"; blocked?: boolean; addresses: Address[]; wishlist: string[]; createdAt?: string };
export type OrderItem = { product: string; name: string; slug: string; image?: string; kind?: Kind; size?: string; price: number; qty: number };
export type Order = {
  _id: string; number: string; user?: string | { name: string; email: string }; email?: string; items: OrderItem[]; shippingAddress: Address; note?: string;
  subtotal: number; discount: number; couponCode?: string; shipping: number; total: number;
  paymentMethod: "cod" | "bank"; paymentStatus: "unpaid" | "paid" | "refunded"; status: string; trackingNumber?: string;
  history: { status: string; note?: string; at: string }[]; createdAt: string;
};
export type Settings = {
  storeName: string; announcement: string; shippingFee: number; freeShippingOver: number; whatsapp: string; phone: string;
  email: string; address: string; bankDetails: string; codEnabled: boolean; bankEnabled: boolean;
};
export type Paged<T> = { items: T[]; total: number; page: number; pages: number };

export const imgUrl = (u?: string) => (!u ? "" : /^https?:/.test(u) ? u : API_URL + u);

const TOKEN_KEY = "aq_token";
export const getToken = () => {
  try { return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t: string | null) => {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {}
};

/** Small fetch wrapper: JSON in/out, bearer token, throws Error(message) on failure. */
export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; form?: FormData; revalidate?: number } = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api${path}`, {
    method: opts.method || (opts.body || opts.form ? "POST" : "GET"),
    headers: { ...(opts.body !== undefined && { "Content-Type": "application/json" }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
    ...(typeof window === "undefined" ? { next: { revalidate: opts.revalidate ?? 60 } } : { cache: "no-store" as const }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

/** Server-side read that never throws (the page renders a fallback instead). */
export async function safeApi<T>(path: string, fallback: T): Promise<T> {
  try { return await api<T>(path); } catch { return fallback; }
}

export const qs = (o: Record<string, string | number | undefined | null>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const dateFmt = (d: string) => new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
