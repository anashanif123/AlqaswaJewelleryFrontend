"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { imgUrl, type Product } from "@/lib/api";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import { faqs, features, infoPages } from "@/lib/pages";
import { Jewel } from "./Art";
import { Price, Stars, onSale } from "./ProductCard";

/** Real sale end date for the countdown, e.g. NEXT_PUBLIC_SALE_ENDS=2026-12-01T23:59:00+05:00. No date set = no countdown. */
const SALE_ENDS = process.env.NEXT_PUBLIC_SALE_ENDS ? new Date(process.env.NEXT_PUBLIC_SALE_ENDS).getTime() : 0;

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!SALE_ENDS || now === null || now >= SALE_ENDS) return null;
  const s = Math.floor((SALE_ENDS - now) / 1000);
  const parts = s >= 86400
    ? [[Math.floor(s / 86400), "days"], [Math.floor((s % 86400) / 3600), "hours"], [Math.floor((s % 3600) / 60), "mins"]]
    : [[Math.floor(s / 3600), "hours"], [Math.floor((s % 3600) / 60), "mins"], [s % 60, "secs"]];
  return (
    <div className="countdown" role="timer" aria-label="Sale ends in">
      <p>Sale Ends In</p>
      <div>
        {parts.map(([n, l], i) => (
          <span key={l as string} className="countdown__unit">{i > 0 && <i aria-hidden="true">:</i>}<b>{String(n).padStart(2, "0")}</b><small>{l}</small></span>
        ))}
      </div>
    </div>
  );
}

/** Estimated arrival: 5 working days (Mon–Sat) from today. */
function deliverBy() {
  const d = new Date();
  for (let n = 0; n < 5;) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n++; }
  return d.toLocaleDateString("en-PK", { weekday: "short", month: "long", day: "numeric" });
}

function Accordion({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <details className="acc">
      <summary>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg>
        <h2>{title}</h2>
        <svg viewBox="0 0 24 24" className="acc__chev" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </summary>
      <div className="acc__body">{children}</div>
    </details>
  );
}

export default function ProductBuy({ p }: { p: Product }) {
  const { add, wishlist, toggleWish, settings } = useStore();
  const router = useRouter();
  const sp = useSearchParams();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(() => { const o = sp.get("option"); return o && p.sizes.includes(o) ? o : p.sizes[0] || ""; });
  const [qty, setQty] = useState(1);
  const [when, setWhen] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => { setWhen(deliverBy()); setUrl(location.href.split("?")[0]); }, []);
  const saved = wishlist.includes(p._id);
  const soldOut = p.stock <= 0;
  const kind = p.category?.kind;
  const optLabel = kind === "ring" || kind === "bangle" ? "Size" : "Colour";
  const wa = settings?.whatsapp;

  const buy = (go: boolean) => {
    add(p, qty, size || undefined);
    if (go) router.push("/checkout");
  };
  const waText = encodeURIComponent(`Hi Al Qaswa! I want to see this on a live video call:\n${p.name}${size ? ` (${size})` : ""}\n${url}`);

  return (
    <section className="pdp wrap">
      <div className="pdp__gallery">
        <div className={`pdp__main card__media tone-${p.tone} ${p.images[0] ? "card__media--photo" : ""}`}>
          {p.images[img] ? <img src={imgUrl(p.images[img], 1200)} alt={p.name} className="media-img" /> : <Jewel kind={kind} />}
        </div>
        {p.images.length > 1 && (
          <div className="pdp__thumbs">
            {p.images.map((src, i) => (
              <button key={src + i} className={`pdp__thumb ${i === img ? "pdp__thumb--on" : ""}`} onClick={() => setImg(i)} aria-label={`Load image ${i + 1} in gallery view`}>
                <img src={imgUrl(src, 240)} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp__info">
        <h1 className="pdp__title">{p.name}</h1>
        {p.reviewCount > 0 && <a href="#reviews"><Stars rating={p.rating} count={p.reviewCount} /></a>}
        <div className="pdp__price">
          <Price p={p} />
          {soldOut ? <span className="card__badge pdp__badge pdp__badge--out">Sold out</span> : onSale(p) && <span className="card__badge pdp__badge">Sale</span>}
        </div>
        <p className="pdp__ship"><Link href="/help/delivery">Shipping</Link> calculated at checkout.</p>

        {p.sizes.length > 0 && (
          <fieldset className="opt">
            <legend>{optLabel}{kind === "ring" && <Link href="/help/size-guide">Size guide</Link>}</legend>
            <div className="chips">
              {p.sizes.map((s) => (
                <button key={s} type="button" className={`chip ${size === s ? "chip--on" : ""}`} aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </fieldset>
        )}

        {!soldOut && (
          <div className="opt">
            <span className="opt__label">Quantity</span>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label={`Decrease quantity for ${p.name}`} disabled={qty <= 1}>−</button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} aria-label={`Increase quantity for ${p.name}`}>+</button>
            </div>
          </div>
        )}
        <p className={`stock ${soldOut ? "stock--out" : p.stock <= 3 ? "stock--low" : ""}`}>
          {soldOut ? "Sold out" : p.stock <= 3 ? `Low stock: ${p.stock} left` : "In stock"}
        </p>

        {soldOut ? (
          wa && <a className="btn btn--block" href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi, is ${p.name} coming back in stock?`)}`} target="_blank" rel="noopener">Ask on WhatsApp</a>
        ) : (
          <div className="pdp__buy">
            <button className="btn btn--outline btn--block" onClick={() => buy(false)}>Add to cart</button>
            <button className="btn btn--block" onClick={() => buy(true)}>Buy it now</button>
          </div>
        )}

        {onSale(p) && !soldOut && <Countdown />}

        {wa && (
          <div className="vcall">
            <span className="vcall__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg></span>
            <div>
              <p className="vcall__title">See it Live on Video Call</p>
              <p className="vcall__text">Not sure about size or colour? We&apos;ll show you this piece live on WhatsApp.</p>
              <a className="vcall__btn" href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                Request Video Call
              </a>
            </div>
          </div>
        )}

        <div className="pdp__perks">
          <span><i className="dot" />Deliver by <b>{when || "…"}</b></span>
          {settings?.freeShippingOver ? <span><i className="dot" /><b>FREE SHIPPING</b> above {formatPrice(settings.freeShippingOver)}</span> : <span><i className="dot" /><b>Cash on delivery</b> available</span>}
        </div>

        <div className="feats">
          <h2>Features You&apos;ll Love</h2>
          <ul>{features.map((f) => <li key={f}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>{f}</li>)}</ul>
        </div>

        {(p.description || p.metal || p.sku) && (
          <div className="pdp__desc">
            {p.description?.split(/\n\s*\n/).map((t, i) => <p key={i}>{t}</p>)}
            {(p.metal || p.weight || p.sku) && (
              <ul>
                {p.metal && <li><b>Material:</b> {p.metal}</li>}
                {p.weight && <li><b>Weight:</b> {p.weight}</li>}
                {p.sku && <li><b>Code:</b> {p.sku}</li>}
              </ul>
            )}
          </div>
        )}

        <div className="accs">
          <Accordion title="Shipping Policy" icon="M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z">
            {infoPages.delivery.sections.map((s) => <p key={s.h}><b>{s.h}.</b> {s.p.join(" ")}</p>)}
          </Accordion>
          <Accordion title="Return & Exchange Policy" icon="M4 9h13l-3-3M20 15H7l3 3">
            {infoPages.returns.sections.map((s) => <p key={s.h}><b>{s.h}.</b> {s.p.join(" ")}</p>)}
          </Accordion>
          <Accordion title="FAQs" icon="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01">
            {faqs.map((f) => <p key={f.q}><b>{f.q}</b><br />{f.a}</p>)}
          </Accordion>
        </div>

        <button className={`linkish ${saved ? "linkish--on" : ""}`} onClick={() => toggleWish(p._id).catch(() => {})}>
          {saved ? "♥ Saved to wishlist" : "♡ Add to wishlist"}
        </button>
      </div>
    </section>
  );
}
