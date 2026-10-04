import { formatPrice } from "@/lib/data";
import type { Quote } from "./useQuote";

export default function Summary({ q, children }: { q: Quote | null; children?: React.ReactNode }) {
  if (!q) return <div className="summary"><p className="muted">Working out your total…</p>{children}</div>;
  return (
    <div className="summary">
      <h3>Order summary</h3>
      <dl>
        <dt>Subtotal</dt><dd>{formatPrice(q.subtotal)}</dd>
        {q.discount > 0 && <><dt>Discount {q.couponCode && <em>({q.couponCode})</em>}</dt><dd className="save">− {formatPrice(q.discount)}</dd></>}
        <dt>Delivery</dt><dd>{q.shipping ? formatPrice(q.shipping) : "Free"}</dd>
        <dt className="total">Total</dt><dd className="total">{formatPrice(q.total)}</dd>
      </dl>
      {children}
    </div>
  );
}
