import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import EnquiryForm from "@/components/EnquiryForm";
import ProductCard from "@/components/ProductCard";
import { safeApi, type Category, type Paged, type Product } from "@/lib/api";

export const metadata: Metadata = { title: "Bridal Sets" };

export default async function BridalPage() {
  const cats = await safeApi<{ items: Category[] }>("/categories", { items: [] });
  const bridal = cats.items.find((c) => /bridal/i.test(c.slug));
  const res = bridal ? await safeApi<Paged<Product> | null>(`/products?category=${bridal.slug}&limit=24`, null) : null;
  return (
    <>
      <PageHead title="Bridal Sets" kicker="Necklace, earrings and tikka sets for your mehndi, barat and walima." />
      {res && res.items.length > 0 && (
        <section className="wrap listing">
          <ul className="rail rail--grid">{res.items.map((p) => <li key={p._id}><ProductCard p={p} /></li>)}</ul>
        </section>
      )}
      <section className="wrap page narrow">
        <h2 className="title">Looking for something specific?</h2>
        <p className="muted">Tell us your colours, outfit and budget. We will send you matching sets on WhatsApp.</p>
        <EnquiryForm type="bridal" />
      </section>
    </>
  );
}
