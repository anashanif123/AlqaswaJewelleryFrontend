"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import ProductCard from "@/components/ProductCard";
import { api, type Paged, type Product } from "@/lib/api";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { wishlist, ready } = useStore();
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!wishlist.length) return setItems([]);
    api<Paged<Product>>(`/products?ids=${wishlist.join(",")}&limit=60`).then((r) => setItems(r.items)).catch(() => setItems([]));
  }, [ready, wishlist.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHead title="Your wishlist" crumbs={[{ label: "Wishlist" }]} />
      <section className="wrap page">
        {items === null ? <p className="muted">Loading…</p> : items.length === 0 ? (
          <div className="empty"><h2>Nothing saved yet</h2><p>Tap the heart on any piece to keep it here.</p><Link href="/shop" className="btn">Browse jewellery</Link></div>
        ) : <div className="grid">{items.map((p) => <ProductCard key={p._id} p={p} />)}</div>}
      </section>
    </>
  );
}
