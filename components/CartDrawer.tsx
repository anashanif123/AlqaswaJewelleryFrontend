"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import { ProductMedia } from "./ProductCard";

/** Slide-in cart from the right, opened by the header bag and after every "Add to cart". */
export default function CartDrawer() {
  const { drawer, setDrawer, cart, setQty, remove, subtotal, settings } = useStore();
  const path = usePathname();

  useEffect(() => { setDrawer(false); }, [path]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [drawer, setDrawer]);

  const free = settings?.freeShippingOver || 0;
  const left = free - subtotal;

  return (
    <div className={`cdrawer ${drawer ? "cdrawer--open" : ""}`} aria-hidden={!drawer}>
      <button className="cdrawer__shade" aria-label="Close cart" tabIndex={-1} onClick={() => setDrawer(false)} />
      <aside className="cdrawer__panel" role="dialog" aria-modal="true" aria-label="Your cart">
        <div className="cdrawer__head">
          <h2>Your cart</h2>
          <button className="icon-btn" aria-label="Close" onClick={() => setDrawer(false)}>
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cdrawer__empty">
            <h3>Your cart is empty</h3>
            <button className="btn" onClick={() => setDrawer(false)}>Continue shopping</button>
          </div>
        ) : (
          <>
            {free > 0 && (
              <p className="cdrawer__free">
                {left > 0 ? <>Add <b>{formatPrice(left)}</b> more for <b>free shipping</b></> : <>You get <b>free shipping</b> on this order</>}
                <span className="cdrawer__meter"><span style={{ width: `${Math.min(100, (subtotal / free) * 100)}%` }} /></span>
              </p>
            )}
            <div className="cdrawer__cols"><span>Product</span><span>Total</span></div>
            <ul className="cdrawer__lines">
              {cart.map((l) => (
                <li key={l.id + (l.size || "")} className="dline">
                  <Link href={`/product/${l.slug}`} className="dline__media">
                    <ProductMedia p={{ name: l.name, tone: l.tone, kind: l.kind, images: l.image ? [l.image] : [] }} />
                  </Link>
                  <div className="dline__info">
                    <Link href={`/product/${l.slug}`} className="dline__name">{l.name}</Link>
                    <span className="dline__price">{formatPrice(l.price)}</span>
                    {l.size && <span className="dline__opt">{l.kind === "ring" || l.kind === "bangle" ? "Size" : "Colour"}: {l.size}</span>}
                    <div className="dline__row">
                      <div className="qty qty--sm">
                        <button onClick={() => setQty(l.id, l.size, l.qty - 1)} aria-label={`Decrease quantity for ${l.name}`}>−</button>
                        <span>{l.qty}</span>
                        <button onClick={() => setQty(l.id, l.size, l.qty + 1)} aria-label={`Increase quantity for ${l.name}`}>+</button>
                      </div>
                      <button className="icon-btn dline__del" onClick={() => remove(l.id, l.size)} aria-label={`Remove ${l.name}`}>
                        <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
                      </button>
                    </div>
                  </div>
                  <span className="dline__total">{formatPrice(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="cdrawer__foot">
              <div className="cdrawer__sum"><span>Estimated total</span><b>{formatPrice(subtotal)} PKR</b></div>
              <p className="muted small">Discounts and delivery are worked out at checkout.</p>
              <Link href="/checkout" className="btn btn--block">Check out</Link>
              <Link href="/cart" className="linkish center">View cart</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
