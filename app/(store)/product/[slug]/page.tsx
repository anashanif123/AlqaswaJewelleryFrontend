import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductBuy from "@/components/ProductBuy";
import Reviews from "@/components/Reviews";
import { safeApi, type Product } from "@/lib/api";

type Data = { item: Product; related: Product[] } | null;
const load = (slug: string) => safeApi<Data>(`/products/${encodeURIComponent(slug)}`, null);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await load((await params).slug);
  return d ? { title: d.item.name, description: d.item.description?.slice(0, 160) } : { title: "Not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = await load((await params).slug);
  if (!d) notFound();
  const { item: p, related } = d;

  return (
    <>
      <ProductBuy p={p} />
      <Reviews productId={p._id} rating={p.rating} count={p.reviewCount} />
      {related.length > 0 && (
        <section className="block wrap">
          <h2 className="title">You may also like</h2>
          <ul className="rail rail--grid">{related.slice(0, 4).map((r) => <li key={r._id}><ProductCard p={r} /></li>)}</ul>
        </section>
      )}
    </>
  );
}
