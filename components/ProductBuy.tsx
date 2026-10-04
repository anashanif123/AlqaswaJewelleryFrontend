"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { imgUrl, type Product } from "@/lib/api";
import { useStore } from "@/lib/store";
import { Jewel } from "./Art";
import { Price } from "./ProductCard";

export default function ProductBuy({ p }: { p: Product }) {
  const { add, wishlist, toggleWish, settings } = useStore();
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const saved = wishlist.includes(p._id);
  const soldOut = p.stock <= 0;

  const buy = (go: boolean) => {
    if (p.sizes.length && !size) return setMsg("Please choose a size first");
    add(p, qty, size || undefined);
    setMsg("Added to your bag");
    if (go) router.push("/cart");
  };

  return (
    <section className="pdp wrap">
      <div className="pdp__gallery">
        <div className={`pdp__main card__media tone-${p.tone} ${p.images[0] ? "card__media--photo" : ""}`}>
          {p.discountPercent > 0 && <span className="card__tag">{p.discountPercent}% off</span>}
          {p.images[img] ? <img src={imgUrl(p.images[img])} alt={p.name} className="media-img" /> : <Jewel kind={p.category.kind} />}
        </div>
        {p.images.length > 1 && (
          <div className="pdp__thumbs">
            {p.images.map((src, i) => (
              <button key={src} className={`pdp__thumb ${i === img ? "pdp__thumb--on" : ""}`} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}>
                <img src={imgUrl(src)} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp__info">
        {p.reviewCount > 0 && <p className="stars" aria-label={`${p.rating} out of 5`}>{"★".repeat(Math.round(p.rating))}<span>{p.rating} · {p.reviewCount} reviews</span></p>}
        <p className="pdp__price"><Price p={p} /></p>
        <p className={`stock ${soldOut ? "stock--out" : p.stock <= 3 ? "stock--low" : ""}`}>
          {soldOut ? "Sold out — ask us about making one to order" : p.stock <= 3 ? `Only ${p.stock} left` : "In stock, ready to ship"}
        </p>
        {p.description && <p className="pdp__desc">{p.description}</p>}

        {p.sizes.length > 0 && (
          <fieldset className="opt">
            <legend>Size {p.category.kind === "ring" && <Link href="/help/size-guide">Size guide</Link>}</legend>
            <div className="chips">
              {p.sizes.map((s) => (
                <button key={s} type="button" className={`chip ${size === s ? "chip--on" : ""}`} aria-pressed={size === s} onClick={() => (setSize(s), setMsg(""))}>{s}</button>
              ))}
            </div>
          </fieldset>
        )}

        {!soldOut && (
          <div className="pdp__buy">
            <div className="qty" aria-label="Quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} aria-label="More">+</button>
            </div>
            <button className="btn" onClick={() => buy(false)}>Add to bag</button>
            <button className="btn btn--gold" onClick={() => buy(true)}>Buy now</button>
          </div>
        )}
        {soldOut && settings && <a className="btn btn--gold" href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to order ${p.name}`)}`}>Ask on WhatsApp</a>}
        {msg && <p className="note" role="status">{msg} {msg.startsWith("Added") && <Link href="/cart">View bag →</Link>}</p>}

        <button className={`linkish ${saved ? "linkish--on" : ""}`} onClick={() => toggleWish(p._id).catch(() => {})}>
          {saved ? "♥ Saved to wishlist" : "♡ Save to wishlist"}
        </button>

        <dl className="specs">
          {p.metal && <><dt>Metal</dt><dd>{p.metal}</dd></>}
          {p.weight && <><dt>Weight</dt><dd>{p.weight}</dd></>}
          {p.sku && <><dt>Code</dt><dd>{p.sku}</dd></>}
          <dt>Delivery</dt><dd>2 to 5 working days across Pakistan, insured</dd>
          <dt>Promise</dt><dd>Hallmarked · 7-day exchange · free resizing for a year</dd>
        </dl>
      </div>
    </section>
  );
}
