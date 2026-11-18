import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { CollectionTile } from "@/components/Sections";
import { safeApi, type Category } from "@/lib/api";
import { categories as fallbackCats } from "@/lib/data";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const cats = await safeApi<{ items: Category[] }>("/categories", { items: fallbackCats });
  return (
    <>
      <PageHead title="Collections" />
      <section className="wrap listing">
        <ul className="colls">{cats.items.map((c) => <li key={c._id}><CollectionTile c={c} /></li>)}</ul>
      </section>
    </>
  );
}
