import Link from "next/link";
import { imgUrl, type Category, type Product } from "@/lib/api";
import { Jewel } from "./Art";
import ProductCard from "./ProductCard";

/** Heading + products + maroon "View all" button. `layout` picks a 4-column grid or a 6-across row; both scroll sideways on phones. */
export function ProductSection({ title, products, href, layout = "grid" }: { title: string; products: Product[]; href: string; layout?: "grid" | "row" }) {
  if (!products.length) return null;
  return (
    <section className="block wrap">
      <h2 className="title">{title}</h2>
      <ul className={`rail rail--${layout}`} aria-label={title}>
        {products.map((p) => <li key={p._id}><ProductCard p={p} /></li>)}
      </ul>
      <div className="center-cta"><Link href={href} className="btn" aria-label={`View all products in ${title}`}>View all</Link></div>
    </section>
  );
}

export function CollectionTile({ c }: { c: Category }) {
  return (
    <Link href={`/shop?category=${c.slug}`} className="coll">
      <span className={`coll__img ${c.image ? "coll__img--photo" : ""}`}>
        {c.image ? <img src={imgUrl(c.image, 500)} alt="" loading="lazy" /> : <Jewel kind={c.kind} />}
      </span>
      <span className="coll__name">{c.name}</span>
    </Link>
  );
}

export function Collections({ cats, title = "Shop By Collection" }: { cats: Category[]; title?: string }) {
  const list = cats.slice(0, 6);
  if (!list.length) return null;
  return (
    <section className="block wrap">
      <h2 className="title">{title}</h2>
      <ul className="rail rail--row">{list.map((c) => <li key={c._id}><CollectionTile c={c} /></li>)}</ul>
      <div className="center-cta"><Link href="/collections" className="btn">View all</Link></div>
    </section>
  );
}
