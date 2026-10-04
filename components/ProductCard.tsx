"use client";
import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { imgUrl, type Product } from "@/lib/api";
import { useStore } from "@/lib/store";
import { Jewel } from "./Art";

/** Product photo, or the gold line-art fallback when no image is uploaded. */
export function ProductMedia({ p, className = "" }: { p: Pick<Product, "images" | "name" | "tone"> & { kind?: Product["category"]["kind"] }; className?: string }) {
  return p.images?.[0]
    ? <img src={imgUrl(p.images[0])} alt={p.name} className={`media-img ${className}`} loading="lazy" />
    : <Jewel kind={p.kind || "ring"} className={className} />;
}

export function Price({ p }: { p: Pick<Product, "price" | "compareAtPrice"> }) {
  return (
    <span className="price">
      {formatPrice(p.price)}
      {p.compareAtPrice && p.compareAtPrice > p.price && <s className="price__was">{formatPrice(p.compareAtPrice)}</s>}
    </span>
  );
}

export default function ProductCard({ p }: { p: Product }) {
  const { add, wishlist, toggleWish } = useStore();
  const [added, setAdded] = useState(false);
  const saved = wishlist.includes(p._id);
  const soldOut = p.stock <= 0;
  const tag = soldOut ? "Sold out" : p.discountPercent ? `${p.discountPercent}% off` : p.tag;

  const onAdd = () => {
    add(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="card">
      <div className={`card__media tone-${p.tone} ${p.images?.[0] ? "card__media--photo" : ""}`}>
        {tag && <span className="card__tag">{tag}</span>}
        <Link href={`/product/${p.slug}`} aria-label={p.name} className="card__link">
          <ProductMedia p={{ ...p, kind: p.category?.kind }} />
        </Link>
        <button className={`card__wish ${saved ? "card__wish--on" : ""}`} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${p.name}`}
          onClick={() => toggleWish(p._id).catch(() => {})}>
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
        </button>
      </div>
      <div className="card__body">
        <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        <p className="card__metal">{p.metal}</p>
        <div className="card__row">
          <Price p={p} />
          {p.sizes?.length ? (
            <Link className="btn btn--small" href={`/product/${p.slug}`}>Choose size</Link>
          ) : (
            <button className="btn btn--small" onClick={onAdd} disabled={soldOut}>
              {soldOut ? "Sold out" : added ? "Added" : "Add to bag"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
