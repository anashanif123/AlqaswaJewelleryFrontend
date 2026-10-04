import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import { qs, safeApi, type Category, type Paged, type Product } from "@/lib/api";
import { categories as fallbackCats } from "@/lib/data";

type SP = Record<string, string | undefined>;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  return { title: sp.q ? `Search: ${sp.q}` : sp.category ? sp.category[0].toUpperCase() + sp.category.slice(1) : "Shop all jewellery" };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const query = { q: sp.q, category: sp.category, sort: sp.sort, min: sp.min, max: sp.max, sale: sp.sale, inStock: sp.inStock, page, limit: 12 };

  const [cats, res] = await Promise.all([
    safeApi<{ items: Category[] }>("/categories", { items: fallbackCats }),
    safeApi<Paged<Product> | null>(`/products${qs(query)}`, null),
  ]);
  const cat = cats.items.find((c) => c.slug === sp.category);
  const title = sp.q ? `Results for “${sp.q}”` : cat?.name ?? "All jewellery";
  const pageLink = (n: number) => `/shop${qs({ ...query, limit: undefined, page: n > 1 ? n : undefined })}`;

  return (
    <>
      <PageHead title={title} kicker={cat?.description ?? "Hallmarked gold, finished by hand in Lahore"}
        crumbs={[{ label: "Shop", href: cat || sp.q ? "/shop" : undefined }, ...(cat ? [{ label: cat.name }] : [])]} />

      <section className="wrap listing">
        <ShopFilters categories={cats.items} total={res?.total ?? 0} />

        {!res ? (
          <div className="empty"><h2>We could not load the collection</h2><p>Please refresh in a moment.</p></div>
        ) : res.items.length === 0 ? (
          <div className="empty">
            <h2>Nothing matches yet</h2>
            <p>Try another category or clear the filters.</p>
            <Link href="/shop" className="btn">See everything</Link>
          </div>
        ) : (
          <div className="grid">{res.items.map((p) => <ProductCard key={p._id} p={p} />)}</div>
        )}

        {res && res.pages > 1 && (
          <nav className="pager" aria-label="Pages">
            {page > 1 && <Link className="chip" href={pageLink(page - 1)}>Previous</Link>}
            {Array.from({ length: res.pages }, (_, i) => i + 1).map((n) => (
              <Link key={n} href={pageLink(n)} className={`chip ${n === page ? "chip--on" : ""}`} aria-current={n === page ? "page" : undefined}>{n}</Link>
            ))}
            {page < res.pages && <Link className="chip" href={pageLink(page + 1)}>Next</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
