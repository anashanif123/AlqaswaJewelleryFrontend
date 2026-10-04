"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken, type Product, type Settings, type User } from "./api";

export type CartLine = {
  id: string; slug: string; name: string; price: number; kind: Product["category"]["kind"]; tone: Product["tone"];
  image?: string; size?: string; qty: number; stock: number;
};

type Store = {
  ready: boolean;
  user: User | null;
  settings: Settings | null;
  cart: CartLine[];
  count: number;
  add: (p: Product, qty?: number, size?: string) => void;
  setQty: (id: string, size: string | undefined, qty: number) => void;
  remove: (id: string, size?: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (id: string) => Promise<boolean>;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);
const CART_KEY = "aq_cart";
const WISH_KEY = "aq_wish";
const read = <T,>(k: string, d: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || "") ?? d; } catch { return d; }
};
const write = (k: string, v: unknown) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [localWish, setLocalWish] = useState<string[]>([]);

  const refreshUser = useCallback(async () => {
    if (!getToken()) return setUser(null);
    try { setUser((await api<{ user: User }>("/auth/me")).user); } catch { setToken(null); setUser(null); }
  }, []);

  useEffect(() => {
    setCart(read(CART_KEY, []));
    setLocalWish(read(WISH_KEY, []));
    api<Settings>("/settings").then(setSettings).catch(() => {});
    refreshUser().finally(() => setReady(true));
  }, [refreshUser]);

  const saveCart = (next: CartLine[]) => (setCart(next), write(CART_KEY, next));
  const same = (l: CartLine, id: string, size?: string) => l.id === id && (l.size || "") === (size || "");

  const value = useMemo<Store>(() => {
    const wishlist = user ? user.wishlist.map(String) : localWish;
    return {
      ready, user, settings, cart, wishlist,
      count: cart.reduce((s, l) => s + l.qty, 0),
      add: (p, qty = 1, size) => {
        const hit = cart.find((l) => same(l, p._id, size));
        saveCart(hit
          ? cart.map((l) => (l === hit ? { ...l, qty: Math.min(l.qty + qty, p.stock || 20) } : l))
          : [...cart, { id: p._id, slug: p.slug, name: p.name, price: p.price, kind: p.category?.kind || "ring", tone: p.tone, image: p.images?.[0], size, qty, stock: p.stock }]);
        window.dispatchEvent(new Event("bag:add"));
      },
      setQty: (id, size, qty) => saveCart(cart.map((l) => (same(l, id, size) ? { ...l, qty: Math.max(1, Math.min(qty, l.stock || 20)) } : l))),
      remove: (id, size) => saveCart(cart.filter((l) => !same(l, id, size))),
      clear: () => saveCart([]),
      toggleWish: async (id) => {
        if (user) {
          const r = await api<{ wishlist: string[]; saved: boolean }>(`/auth/me/wishlist/${id}`, { method: "POST" });
          setUser({ ...user, wishlist: r.wishlist });
          return r.saved;
        }
        const saved = !localWish.includes(id);
        const next = saved ? [...localWish, id] : localWish.filter((w) => w !== id);
        setLocalWish(next);
        write(WISH_KEY, next);
        return saved;
      },
      login: (token, u) => (setToken(token), setUser(u)),
      logout: () => (setToken(null), setUser(null)),
      refreshUser,
    };
  }, [ready, user, settings, cart, localWish, refreshUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside <StoreProvider>");
  return s;
};
