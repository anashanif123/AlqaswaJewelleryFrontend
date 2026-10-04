import Shop from "@/components/Shop";
import HeroCarousel from "@/components/HeroCarousel";
import { Categories, Bridal, Assurance, Newsletter } from "@/components/Sections";
import { safeApi, type Category, type Paged, type Product, type Slide } from "@/lib/api";
import { categories as fallbackCats, products as fallbackProducts } from "@/lib/data";

export default async function Home() {
  const [slides, cats, prods] = await Promise.all([
    safeApi<{ items: Slide[] }>("/slides", { items: [] }),
    safeApi<{ items: Category[] }>("/categories", { items: fallbackCats }),
    safeApi<Paged<Product>>("/products?featured=true&limit=8", { items: fallbackProducts, total: 0, page: 1, pages: 1 }),
  ]);
  return (
    <>
      <HeroCarousel slides={slides.items} />
      <Categories cats={cats.items} />
      <Shop products={prods.items} categories={cats.items} />
      <Bridal />
      <Assurance />
      <Newsletter />
    </>
  );
}
