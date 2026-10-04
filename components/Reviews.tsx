"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, dateFmt } from "@/lib/api";
import { useStore } from "@/lib/store";

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
    <section className="reviews wrap">
      <div className="section-head">
        <h2>What customers say</h2>
        {count > 0 && <p className="stars">{"★".repeat(Math.round(rating))}<span>{rating} from {count} reviews</span></p>}
      </div>
      {items.length === 0 && <p className="muted">No reviews yet. Bought this piece? Tell others what you think.</p>}
      <div className="reviews__list">
        {items.map((r) => (
          <article key={r._id} className="review">
            <p className="stars">{"★".repeat(r.rating)}<span>{r.name} · {dateFmt(r.createdAt)}</span></p>
            {r.comment && <p>{r.comment}</p>}
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
        <p className="muted"><Link href="/account" className="link">Log in</Link> to write a review.</p>
      )}
    </section>
  );
}
