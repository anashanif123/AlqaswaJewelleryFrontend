"use client";
import { useState } from "react";
import Link from "next/link";
import { Stars } from "./ProductCard";

export type ShowcaseReview = { _id: string; name: string; rating: number; comment?: string; product: { name: string; slug: string } };

/** One review at a time with arrows, like a testimonial carousel. Only real, published reviews are passed in. */
export default function HappyCustomers({ reviews, title = "Happy Customers" }: { reviews: ShowcaseReview[]; title?: string }) {
  const [i, setI] = useState(0);
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const r = reviews[i];
  const go = (d: number) => setI((i + d + reviews.length) % reviews.length);
  return (
    <section className="block wrap happy" aria-label="Customer reviews">
      <h2 className="title center">{title}</h2>
      <p className="happy__avg"><Stars rating={avg} count={reviews.length} bare /> <span>{avg.toFixed(2)} ★ ({reviews.length})</span></p>
      <div className="happy__card" aria-live="polite">
        <svg className="happy__q" viewBox="0 0 40 24" aria-hidden="true"><path d="M6 0h8v10c0 7-4 12-10 14l-1-3c4-2 5-5 5-8H6zM26 0h8v10c0 7-4 12-10 14l-1-3c4-2 5-5 5-8h-2z" /></svg>
        <p className="happy__text">{r.comment || r.product.name}</p>
        <Stars rating={r.rating} count={1} bare />
        <p className="happy__name">{r.name}</p>
        <Link href={`/product/${r.product.slug}`} className="happy__prod">{r.product.name}</Link>
      </div>
      {reviews.length > 1 && (
        <div className="happy__nav">
          <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous review"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button className="icon-btn" onClick={() => go(1)} aria-label="Next review"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      )}
    </section>
  );
}
