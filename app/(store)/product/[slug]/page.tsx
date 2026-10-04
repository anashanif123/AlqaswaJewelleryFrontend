import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
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
      <PageHead title={p.name} kicker={p.metal}
        crumbs={[{ label: "Shop", href: "/shop" }, { label: p.category.name, href: `/shop?category=${p.category.slug}` }, { label: p.name }]} />
      <ProductBuy p={p} />
      <Reviews productId={p._id} rating={p.rating} count={p.reviewCount} />
      {related.length > 0 && (
        <section className="shop wrap related">
          <div className="section-head"><h2>You may also like</h2></div>
          <div className="grid">{related.map((r) => <ProductCard key={r._id} p={r} />)}</div>
        </section>
      )}
    </>
  );
}
