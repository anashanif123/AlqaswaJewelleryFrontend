"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, dateFmt } from "@/lib/api";
import { useStore } from "@/lib/store";
import { Stars } from "./ProductCard";

type Review = { _id: string; name: string; rating: number; comment?: string; createdAt: string };

export default function Reviews({ productId, rating, count }: { productId: string; rating: number; count: number }) {
  const { user } = useStore();
  const [items, setItems] = useState<Review[]>([]);
  const [stars, setStars] = useState(5);
  const [state, setState] = useState("");

  const load = () => api<{ items: Review[] }>(`/products/${productId}/reviews`).then((r) => setItems(r.items)).catch(() => {});
  useEffect(() => { load(); }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = String(new FormData(e.currentTarget).get("comment") || "");
    try {
      await api(`/products/${productId}/reviews`, { body: { rating: stars, comment } });
      setState("Thank you for your review");
      load();
    } catch (err) { setState((err as Error).message); }
  };

  return (
    <section className="reviews wrap" id="reviews">
      <h2 className="title center">Customer Reviews</h2>
      {count > 0 && <p className="happy__avg"><Stars rating={rating} count={count} /></p>}
      {items.length === 0 && <p className="muted center">No reviews yet. Bought this piece? Be the first to review it.</p>}
      <div className="reviews__list">
        {items.map((r) => (
          <article key={r._id} className="review">
            <div className="review__top"><b>{r.name}</b><Stars rating={r.rating} count={1} bare /></div>
            {r.comment && <p>{r.comment}</p>}
            <small className="muted">{dateFmt(r.createdAt)}</small>
          </article>
        ))}
      </div>
      {user ? (
        <form className="review-form" onSubmit={submit}>
          <div className="star-pick" role="radiogroup" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={stars === n} className={n <= stars ? "on" : ""} onClick={() => setStars(n)}>★</button>
            ))}
          </div>
          <textarea name="comment" className="input" rows={3} maxLength={1000} placeholder="How does it look and feel?" />
          <button className="btn btn--small" type="submit">Post review</button>
          {state && <p className="note">{state}</p>}
        </form>
      ) : (
        <p className="muted center"><Link href="/account" className="link">Log in</Link> to write a review.</p>
      )}
    </section>
  );
}
