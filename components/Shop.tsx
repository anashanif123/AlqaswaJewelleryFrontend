"use client";
import { useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function Shop({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [filter, setFilter] = useState<string>("all");
  const list = filter === "all" ? products : products.filter((p) => p.category?.slug === filter);

  return (
    <section className="shop wrap" id="rings">
      <div className="section-head">
        <h2>Pieces people are choosing this week</h2>
        <div className="chips" role="tablist" aria-label="Filter by type">
          {[{ name: "All", slug: "all" }, ...categories].map((c) => (
            <button key={c.slug} role="tab" aria-selected={filter === c.slug}
              className={`chip ${filter === c.slug ? "chip--on" : ""}`} onClick={() => setFilter(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {list.map((p) => <ProductCard key={p._id} p={p} />)}
      </div>
      <div className="center-cta">
        <Link href={filter === "all" ? "/shop" : `/shop?category=${filter}`} className="btn btn--outline">View all pieces</Link>
      </div>
    </section>
  );
}
