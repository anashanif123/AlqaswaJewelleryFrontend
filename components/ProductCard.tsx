import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { imgUrl, type Product } from "@/lib/api";
import { Jewel } from "./Art";
import { cleanOptions } from "@/lib/options";

/** Product photo, or the line-art fallback when no image is uploaded. */
export function ProductMedia({ p, className = "", w = 700 }: { p: Pick<Product, "images" | "name" | "tone"> & { kind?: Product["category"]["kind"] }; className?: string; w?: number }) {
  return p.images?.[0]
    ? <img src={imgUrl(p.images[0], w)} alt={p.name} className={`media-img ${className}`} loading="lazy" />
    : <Jewel kind={p.kind || "ring"} className={className} />;
}

export const onSale = (p: Pick<Product, "price" | "compareAtPrice">) => !!p.compareAtPrice && p.compareAtPrice > p.price;

export function Price({ p, from = false }: { p: Pick<Product, "price" | "compareAtPrice">; from?: boolean }) {
  const sale = onSale(p);
  return (
    <span className={`price ${sale ? "price--sale" : ""}`}>
      {sale && <><span className="sr">Regular price</span><s className="price__was">{formatPrice(p.compareAtPrice!)}</s><span className="sr">Sale price</span></>}
      <span className="price__now">{from ? "From " : ""}{formatPrice(p.price)}</span>
    </span>
  );
}

export function Stars({ rating, count, compact = false, bare = false }: { rating: number; count: number; compact?: boolean; bare?: boolean }) {
  if (!count) return null;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="rate" aria-label={`${rating.toFixed(1)} out of 5 stars, ${count} reviews`}>
      <span className="rate__stars" aria-hidden="true"><span style={{ width: `${pct}%` }}>★★★★★</span>★★★★★</span>
      {!bare && <span className="rate__n">{compact ? `(${count})` : `${count} review${count === 1 ? "" : "s"}`}</span>}
    </span>
  );
}

const MAX_OPTS = 8;

export default function ProductCard({ p }: { p: Product }) {
  const soldOut = p.stock <= 0;
  const sale = onSale(p);
  const badge = soldOut ? "Sold out" : sale ? "Sale" : p.tag;
  const href = `/product/${p.slug}`;
  // Colours are shown under the card when set, otherwise sizes.
  const colors = cleanOptions(p.colors);
  const opts = colors.length ? colors : cleanOptions(p.sizes);
  const param = colors.length ? "color" : "size";

  return (
    <article className="card">
      <Link href={href} className={`card__media tone-${p.tone} ${p.images?.[0] ? "card__media--photo" : ""}`} tabIndex={-1} aria-hidden="true">
        <ProductMedia p={{ ...p, kind: p.category?.kind }} />
        {p.images?.[1] && <img src={imgUrl(p.images[1], 700)} alt="" className="media-img card__alt" loading="lazy" />}
        {badge && <span className={`card__badge ${soldOut ? "card__badge--out" : sale ? "" : "card__badge--tag"}`}>{badge}</span>}
      </Link>
      <div className="card__body">
        <h3><Link href={href}>{p.name}</Link></h3>
        <Stars rating={p.rating} count={p.reviewCount} compact />
        <Price p={p} />
        {opts.length > 0 && (
          <ul className="card__opts" aria-label="Available options">
            {opts.slice(0, MAX_OPTS).map((o) => <li key={o}><Link href={`${href}?${param}=${encodeURIComponent(o)}`}>{o}</Link></li>)}
            {opts.length > MAX_OPTS && <li><Link href={href} className="more">+{opts.length - MAX_OPTS}</Link></li>}
          </ul>
        )}
      </div>
    </article>
  );
}
