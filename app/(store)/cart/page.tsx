"use client";
import { useState } from "react";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import Summary from "@/components/Summary";
import { ProductMedia } from "@/components/ProductCard";
import { useQuote } from "@/components/useQuote";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const { cart, setQty, remove, ready } = useStore();
  const [coupon, setCoupon] = useState("");
  const [code, setCode] = useState("");
  const { quote, error } = useQuote(cart, coupon);

  const apply = (e: React.FormEvent) => (e.preventDefault(), setCoupon(code.trim().toUpperCase()));

  return (
    <>
      <PageHead title="Your bag" crumbs={[{ label: "Bag" }]} />
      <section className="wrap page">
        {ready && cart.length === 0 ? (
          <div className="empty">
            <h2>Your bag is empty</h2>
            <p>Find something you will keep for years.</p>
            <Link href="/shop" className="btn">Start shopping</Link>
          </div>
        ) : (
          <div className="split">
            <ul className="lines">
              {cart.map((l) => (
                <li key={l.id + (l.size || "")} className="line">
                  <Link href={`/product/${l.slug}`} className={`line__media card__media tone-${l.tone}`}>
                    <ProductMedia p={{ name: l.name, tone: l.tone, kind: l.kind, images: l.image ? [l.image] : [] }} />
                  </Link>
                  <div className="line__info">
                    <h3><Link href={`/product/${l.slug}`}>{l.name}</Link></h3>
                    {l.size && <p className="muted">Size {l.size}</p>}
                    <div className="qty">
                      <button onClick={() => setQty(l.id, l.size, l.qty - 1)} aria-label="Less">−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.size, l.qty + 1)} aria-label="More">+</button>
                    </div>
                  </div>
                  <div className="line__end">
                    <span className="price">{formatPrice(l.price * l.qty)}</span>
                    <button className="linkish" onClick={() => remove(l.id, l.size)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <aside>
              <Summary q={quote}>
                <form className="coupon" onSubmit={apply}>
                  <label htmlFor="code" className="sr">Discount code</label>
                  <input id="code" className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" />
                  <button className="btn btn--small" type="submit">Apply</button>
                </form>
                {error && <p className="form-error">{error}{coupon && <> <button className="linkish" onClick={() => (setCoupon(""), setCode(""))}>Remove code</button></>}</p>}
                <Link href={`/checkout${coupon && !error ? `?coupon=${coupon}` : ""}`} className={`btn btn--block ${error && !coupon ? "btn--disabled" : ""}`}>Checkout</Link>
                <Link href="/shop" className="linkish center">Continue shopping</Link>
              </Summary>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
