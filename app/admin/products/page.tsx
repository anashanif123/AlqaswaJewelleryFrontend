"use client";
import { useEffect, useState } from "react";
import Resource from "@/components/admin/Resource";
import type { Field } from "@/components/admin/Form";
import { ProductMedia, Price } from "@/components/ProductCard";
import { api, type Category, type Product } from "@/lib/api";

const fields: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "category", label: "Category", type: "select", source: "/admin/categories?limit=200", required: true },
  { name: "price", label: "Selling price (Rs)", type: "number", required: true },
  { name: "compareAtPrice", label: "Original price (Rs)", type: "number", nullable: true, hint: "Set higher than selling price to show a sale" },
  { name: "stock", label: "Stock", type: "number" },
  { name: "sku", label: "SKU / code" },
  { name: "metal", label: "Metal & stones", placeholder: "18k gold, lab diamond" },
  { name: "weight", label: "Weight", placeholder: "6.2 g" },
  { name: "tag", label: "Badge", placeholder: "New, Bestseller…" },
  { name: "tone", label: "Card colour", type: "select", options: [["emerald", "Emerald"], ["rose", "Rose"], ["night", "Night"]], initial: "emerald" },
  { name: "sizes", label: "Sizes (comma separated)", type: "tags", placeholder: "5, 6, 7, 8", wide: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "images", label: "Photos (first is the main photo)", type: "images" },
  { name: "slug", label: "URL slug", hint: "Leave empty to generate from the name" },
  { name: "featured", label: "Show on home page", type: "checkbox" },
  { name: "active", label: "Visible in store", type: "checkbox", initial: true },
];

function BulkDiscount({ reload }: { reload: () => void }) {
  const [cats, setCats] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => { api<{ items: Category[] }>("/admin/categories?limit=200").then((r) => setCats(r.items)); }, []);
  const apply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const r = await api<{ updated: number }>("/admin/products/bulk-discount", { body: { category: f.get("category"), percent: Number(f.get("percent")) } });
      alert(`${r.updated} products updated`);
      setOpen(false);
      reload();
    } catch (err) { alert((err as Error).message); }
  };
  return open ? (
    <form className="filters__row" onSubmit={apply}>
      <select className="select" name="category" required>{cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <input className="input adm-search" style={{ width: 110 }} name="percent" type="number" min={0} max={90} placeholder="% off" required />
      <button className="btn btn--small">Apply</button>
      <button type="button" className="linkish" onClick={() => setOpen(false)}>Cancel</button>
      <small className="muted">0% ends the sale</small>
    </form>
  ) : <button className="chip" onClick={() => setOpen(true)}>Category sale…</button>;
}

export default function ProductsAdmin() {
  return (
    <Resource<Product>
      title="Products" path="products" fields={fields}
      mapRow={(p) => ({ ...p, category: p.category?._id })}
      filters={[
        { name: "active", label: "Visibility", options: [["true", "Visible"], ["false", "Hidden"]] },
        { name: "lowStock", label: "Stock", options: [["true", "3 or fewer"]] },
        { name: "sale", label: "Sale", options: [["true", "On sale"]] },
      ]}
      toolbar={(reload) => <BulkDiscount reload={reload} />}
      columns={[
        { label: "", render: (p) => <span className={`thumb card__media tone-${p.tone} ${p.images[0] ? "card__media--photo" : ""}`}><ProductMedia p={{ ...p, kind: p.category?.kind }} /></span> },
        { label: "Name", render: (p) => <>{p.name}<br /><small className="muted">{p.sku}</small></> },
        { label: "Category", render: (p) => p.category?.name },
        { label: "Price", render: (p) => <Price p={p} /> },
        { label: "Stock", render: (p) => <span className={p.stock <= 3 ? "danger" : ""}>{p.stock}</span> },
        { label: "Sold", render: (p) => p.sold },
        { label: "Status", render: (p) => <span className={`badge badge--${p.active ? "on" : "off"}`}>{p.active ? "Visible" : "Hidden"}</span> },
      ]}
      rowActions={(p) => p.active && <a className="linkish" href={`/product/${p.slug}`} target="_blank">View</a>}
    />
  );
}
