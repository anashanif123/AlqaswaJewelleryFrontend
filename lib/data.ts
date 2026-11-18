import type { Category, Product } from "./api";

export type Kind = "ring" | "necklace" | "earring" | "bangle" | "pendant";

// Fallback catalogue, shown only when the API cannot be reached. Real data lives in the backend.
export const categories: Category[] = [
  { _id: "c1", name: "Earrings", slug: "earrings", kind: "earring" },
  { _id: "c2", name: "Bangles", slug: "bangles", kind: "bangle" },
  { _id: "c3", name: "Rings", slug: "rings", kind: "ring" },
  { _id: "c4", name: "Sets", slug: "sets", kind: "necklace" },
  { _id: "c5", name: "Pendants", slug: "pendants", kind: "pendant" },
];

const cat = (k: Kind) => categories.find((c) => c.kind === k)!;
const mk = (i: number, name: string, kind: Kind, metal: string, price: number, tone: Product["tone"], tag?: string): Product => ({
  _id: `f${i}`, name, slug: name.toLowerCase().replace(/\s+/g, "-"), category: cat(kind), metal, price, tag, tone,
  discountPercent: 0, stock: 1, sizes: [], images: [], rating: 0, reviewCount: 0,
});

export const products: Product[] = [
  mk(1, "Noor kundan jhumka", "earring", "Gold plated, kundan", 2490, "rose", "New"),
  mk(2, "Zainab choker set", "necklace", "Gold plated, zircon", 6200, "rose"),
  mk(3, "Hira pearl tops", "earring", "Gold plated, pearl", 1450, "rose"),
  mk(4, "Mehr kangan pair", "bangle", "Gold plated", 3800, "rose"),
  mk(5, "Qamar Allah pendant", "pendant", "Gold plated, zircon", 2400, "rose"),
  mk(6, "Ayla zircon ring", "ring", "Silver plated, zircon", 990, "rose"),
  mk(7, "Saba emerald studs", "earring", "Gold plated, green stones", 1650, "rose", "New"),
  mk(8, "Rania mala set", "necklace", "Antique plated, pearl", 5400, "rose"),
];

export const formatPrice = (n: number) => "Rs " + n.toLocaleString("en-PK");
