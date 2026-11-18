import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { safeApi, type Category } from "@/lib/api";
import { categories as fallbackCats } from "@/lib/data";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const cats = await safeApi<{ items: Category[] }>("/categories", { items: fallbackCats });
  return (
    <>
      <Header categories={cats.items} />
      <main id="main">{children}</main>
      <Footer categories={cats.items} />
      <CartDrawer />
    </>
  );
}
