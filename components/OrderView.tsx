import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { dateFmt, type Order } from "@/lib/api";
import { ProductMedia } from "./ProductCard";

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
export const statusLabel = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function OrderView({ o }: { o: Order }) {
  const at = steps.indexOf(o.status);
  const a = o.shippingAddress;
  return (
    <div className="split">
      <div className="stack">
        {at >= 0 ? (
          <ol className="steps" aria-label="Order progress">
            {steps.map((s, i) => <li key={s} className={i <= at ? "done" : ""}>{statusLabel(s)}</li>)}
          </ol>
        ) : <p className="note">This order is <strong>{o.status}</strong>.</p>}
        {o.trackingNumber && <p className="note">Courier tracking number: <strong>{o.trackingNumber}</strong></p>}

        <ul className="lines">
          {o.items.map((l, i) => (
            <li key={i} className="line">
              <Link href={`/product/${l.slug}`} className="line__media card__media tone-emerald">
                <ProductMedia p={{ name: l.name, tone: "emerald", kind: l.kind, images: l.image ? [l.image] : [] }} />
              </Link>
              <div className="line__info"><h3>{l.name}</h3><p className="muted">{l.size && `Size ${l.size} · `}Qty {l.qty}</p></div>
              <div className="line__end"><span className="price">{formatPrice(l.price * l.qty)}</span></div>
            </li>
          ))}
        </ul>

        <div className="box">
          <h3>Delivering to</h3>
          <p>{a.name} · {a.phone}<br />{a.line1}{a.line2 && `, ${a.line2}`}<br />{a.city}{a.province && `, ${a.province}`} {a.postalCode}</p>
        </div>
        <div className="box">
          <h3>History</h3>
          <ul className="history">
            {o.history.map((h, i) => <li key={i}><strong>{statusLabel(h.status)}</strong> · {dateFmt(h.at)}{h.note && ` — ${h.note}`}</li>)}
          </ul>
        </div>
      </div>
      <aside>
        <div className="summary">
          <h3>Order {o.number}</h3>
          <p className="muted small">Placed {dateFmt(o.createdAt)} · {o.paymentMethod === "cod" ? "Cash on delivery" : "Bank transfer"} · {o.paymentStatus}</p>
          <dl>
            <dt>Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd>
            {o.discount > 0 && <><dt>Discount {o.couponCode && <em>({o.couponCode})</em>}</dt><dd className="save">− {formatPrice(o.discount)}</dd></>}
            <dt>Delivery</dt><dd>{o.shipping ? formatPrice(o.shipping) : "Free"}</dd>
            <dt className="total">Total</dt><dd className="total">{formatPrice(o.total)}</dd>
          </dl>
        </div>
      </aside>
    </div>
  );
}
