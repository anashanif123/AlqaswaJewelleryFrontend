"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/api";

const sorts = [["new", "Newest"], ["popular", "Most loved"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["rating", "Top rated"]];
const prices = [["", "Any price"], ["0-25000", "Under Rs 25,000"], ["25000-75000", "Rs 25,000 – 75,000"], ["75000-150000", "Rs 75,000 – 150,000"], ["150000-", "Over Rs 150,000"]];

export default function ShopFilters({ categories, total }: { categories: Category[]; total: number }) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const set = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) v ? p.set(k, v) : p.delete(k);
    p.delete("page");
    router.push(`${path}?${p}`, { scroll: false });
  };
  const cat = sp.get("category") || "";
  const price = sp.get("min") || sp.get("max") ? `${sp.get("min") || 0}-${sp.get("max") || ""}` : "";

  return (
    <div className="filters">
      <div className="chips" role="tablist" aria-label="Category">
        {[{ name: "All", slug: "" }, ...categories].map((c) => (
          <button key={c.slug} role="tab" aria-selected={cat === c.slug} className={`chip ${cat === c.slug ? "chip--on" : ""}`}
            onClick={() => set({ category: c.slug || null })}>{c.name}</button>
        ))}
      </div>
      <div className="filters__row">
        <span className="filters__count">{total} {total === 1 ? "piece" : "pieces"}</span>
        <label className="toggle">
          <input type="checkbox" checked={sp.get("sale") === "true"} onChange={(e) => set({ sale: e.target.checked ? "true" : null })} /> On sale
        </label>
        <label className="toggle">
          <input type="checkbox" checked={sp.get("inStock") === "true"} onChange={(e) => set({ inStock: e.target.checked ? "true" : null })} /> In stock
        </label>
        <select aria-label="Price" className="select" value={price}
          onChange={(e) => { const [min, max] = e.target.value.split("-"); set({ min: min && min !== "0" ? min : null, max: max || null }); }}>
          {prices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select aria-label="Sort" className="select" value={sp.get("sort") || "new"} onChange={(e) => set({ sort: e.target.value === "new" ? null : e.target.value })}>
          {sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}
