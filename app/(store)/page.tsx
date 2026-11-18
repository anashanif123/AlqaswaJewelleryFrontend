import HeroCarousel from "@/components/HeroCarousel";
import HappyCustomers, { type ShowcaseReview } from "@/components/HappyCustomers";
import { Collections, ProductSection } from "@/components/Sections";
import { safeApi, type Category, type Paged, type Product, type Slide } from "@/lib/api";
import { categories as fallbackCats, products as fallbackProducts } from "@/lib/data";

type Review = { _id: string; name: string; rating: number; comment?: string; createdAt: string };
const empty: Paged<Product> = { items: [], total: 0, page: 1, pages: 1 };

export default async function Home() {
  const [slides, cats, fresh, best] = await Promise.all([
    safeApi<{ items: Slide[] }>("/slides", { items: [] }),
    safeApi<{ items: Category[] }>("/categories", { items: fallbackCats }),
    safeApi<Paged<Product>>("/products?sort=new&limit=8", { ...empty, items: fallbackProducts }),
    safeApi<Paged<Product>>("/products?sort=popular&limit=6", { ...empty, items: fallbackProducts.slice(0, 6) }),
  ]);

  // Latest published reviews from the best sellers, shown in "Happy Customers".
  const reviewed = best.items.filter((p) => p.reviewCount > 0).slice(0, 5);
  const lists = await Promise.all(reviewed.map((p) => safeApi<{ items: Review[] }>(`/products/${p._id}/reviews`, { items: [] })));
  const reviews: ShowcaseReview[] = lists
    .flatMap((l, n) => l.items.map((r) => ({ ...r, product: { name: reviewed[n].name, slug: reviewed[n].slug } })))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 12);

  return (
    <>
      <HeroCarousel slides={slides.items} />
      <ProductSection title="New Arrivals" products={fresh.items} href="/shop?sort=new" />
      <Collections cats={cats.items} />
      <ProductSection title="Best Sellers" products={best.items} href="/shop?sort=popular" layout="row" />
      <HappyCustomers reviews={reviews} />
    </>
  );
}
