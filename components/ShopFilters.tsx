"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/api";

const sorts = [["new", "Date, new to old"], ["popular", "Best selling"], ["price-asc", "Price, low to high"], ["price-desc", "Price, high to low"], ["rating", "Top rated"]];

function Pop({ label, active, children }: { label: string; active?: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const out = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", out);
    return () => document.removeEventListener("click", out);
  }, []);
  return (
    <div className="pop" ref={ref}>
      <button className="pop__btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        {label}{active ? ` (${active})` : ""}
        <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && <div className="pop__body">{children}</div>}
    </div>
  );
}

export default function ShopFilters({ categories, total }: { categories: Category[]; total: number }) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [min, setMin] = useState(sp.get("min") || "");
  const [max, setMax] = useState(sp.get("max") || "");
  useEffect(() => { setMin(sp.get("min") || ""); setMax(sp.get("max") || ""); }, [sp]);

  const set = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) v ? p.set(k, v) : p.delete(k);
    p.delete("page");
    router.push(`${path}?${p}`, { scroll: false });
  };
  const cat = sp.get("category") || "";
  const avail = (sp.get("inStock") === "true" ? 1 : 0) + (sp.get("sale") === "true" ? 1 : 0);
  const priced = sp.get("min") || sp.get("max") ? 1 : 0;

  return (
    <div className="filters">
      <div className="filters__left">
        <span className="filters__label">Filter:</span>
        <Pop label="Availability" active={avail}>
          <label className="toggle"><input type="checkbox" checked={sp.get("inStock") === "true"} onChange={(e) => set({ inStock: e.target.checked ? "true" : null })} /> In stock</label>
          <label className="toggle"><input type="checkbox" checked={sp.get("sale") === "true"} onChange={(e) => set({ sale: e.target.checked ? "true" : null })} /> On sale</label>
        </Pop>
        <Pop label="Price" active={priced}>
          <form className="pop__price" onSubmit={(e) => (e.preventDefault(), set({ min: min || null, max: max || null }))}>
            <label><span>Rs</span><input type="number" min={0} placeholder="From" value={min} onChange={(e) => setMin(e.target.value)} /></label>
            <label><span>Rs</span><input type="number" min={0} placeholder="To" value={max} onChange={(e) => setMax(e.target.value)} /></label>
            <button className="btn btn--small" type="submit">Apply</button>
            {priced > 0 && <button type="button" className="linkish" onClick={() => set({ min: null, max: null })}>Reset</button>}
          </form>
        </Pop>
        <Pop label="Product type" active={cat ? 1 : 0}>
          <label className="toggle"><input type="radio" name="cat" checked={!cat} onChange={() => set({ category: null })} /> All</label>
          {categories.map((c) => (
            <label key={c.slug} className="toggle"><input type="radio" name="cat" checked={cat === c.slug} onChange={() => set({ category: c.slug })} /> {c.name}</label>
          ))}
        </Pop>
      </div>
      <div className="filters__right">
        <label className="filters__sort">
          <span className="filters__label">Sort by:</span>
          <select value={sp.get("sort") || "new"} onChange={(e) => set({ sort: e.target.value === "new" ? null : e.target.value })}>
            {sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <span className="filters__count">{total} {total === 1 ? "product" : "products"}</span>
      </div>
    </div>
  );
}
