import type { Category, Product } from "./api";

export type Kind = "ring" | "necklace" | "earring" | "bangle" | "pendant";

// Fallback catalogue, shown only when the API cannot be reached. Real data lives in the backend.
export const categories: Category[] = [
  { _id: "c1", name: "Rings", slug: "rings", kind: "ring", count: 48 },
  { _id: "c2", name: "Necklaces", slug: "necklaces", kind: "necklace", count: 36 },
  { _id: "c3", name: "Earrings", slug: "earrings", kind: "earring", count: 52 },
  { _id: "c4", name: "Bangles", slug: "bangles", kind: "bangle", count: 24 },
  { _id: "c5", name: "Pendants", slug: "pendants", kind: "pendant", count: 30 },
];

const cat = (k: Kind) => categories.find((c) => c.kind === k)!;
const mk = (i: number, name: string, kind: Kind, metal: string, price: number, tone: Product["tone"], tag?: string): Product => ({
  _id: `f${i}`, name, slug: name.toLowerCase().replace(/\s+/g, "-"), category: cat(kind), metal, price, tag, tone,
  discountPercent: 0, stock: 1, sizes: [], images: [], rating: 0, reviewCount: 0,
});

export const products: Product[] = [
  mk(1, "Noor solitaire ring", "ring", "18k gold, lab diamond", 84500, "emerald", "New"),
  mk(2, "Zainab layered necklace", "necklace", "22k gold", 212000, "rose"),
  mk(3, "Hira drop earrings", "earring", "Gold vermeil, pearl", 18900, "night", "Bestseller"),
  mk(4, "Mehr kara bangle", "bangle", "22k gold", 156000, "emerald"),
  mk(5, "Qamar crescent pendant", "pendant", "18k gold", 42000, "rose"),
  mk(6, "Ayla twist band", "ring", "18k rose gold", 36500, "night"),
  mk(7, "Saba emerald studs", "earring", "18k gold, emerald", 58000, "emerald", "New"),
  mk(8, "Rania pearl choker", "necklace", "Silver, freshwater pearl", 27500, "rose"),
];

export const formatPrice = (n: number) => "Rs " + n.toLocaleString("en-PK");
