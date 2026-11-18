import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { safeApi, type Category } from "@/lib/api";
import { categories as fallbackCats } from "@/lib/data";

export default async function NotFound() {
  const cats = await safeApi<{ items: Category[] }>("/categories", { items: fallbackCats });
  return (
    <>
      <Header categories={cats.items} />
      <section className="wrap page empty">
        <h1 className="title">Page not found</h1>
        <p>The page or product you were looking for is not here any more.</p>
        <Link href="/shop" className="btn">Continue shopping</Link>
      </section>
      <Footer categories={cats.items} />
      <CartDrawer />
    </>
  );
}
