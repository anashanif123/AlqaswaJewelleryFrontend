"use client";
import Resource from "@/components/admin/Resource";
import type { Field } from "@/components/admin/Form";
import { Jewel } from "@/components/Art";
import { imgUrl, type Slide } from "@/lib/api";

const fields: Field[] = [
  { name: "image", label: "Desktop banner — wide, about 1920 × 640 px. Put your text inside the banner image; the whole banner links to the button link.", type: "image" },
  { name: "mobileImage", label: "Phone banner (optional) — about 900 × 900 px.", type: "image" },
  { name: "kicker", label: "Small line above the heading", placeholder: "New collection" },
  { name: "title", label: "Heading (shown when there is no banner image; used as image description)", required: true, placeholder: "Eid edit, now in store" },
  { name: "subtitle", label: "Text under the heading", type: "textarea" },
  { name: "ctaLabel", label: "Button text", placeholder: "Shop now" },
  { name: "ctaLink", label: "Button link", placeholder: "/shop?category=rings", hint: "A page on this site like /shop, /bridal, /product/noor-solitaire-ring" },
  { name: "tone", label: "Background when there is no photo", type: "select", options: [["sand", "Sand"], ["rose", "Rose"], ["emerald", "Emerald"]], initial: "sand" },
  { name: "kind", label: "Line-art when there is no photo", type: "select", options: [["necklace", "Necklace"], ["ring", "Ring"], ["earring", "Earring"], ["bangle", "Bangle"], ["pendant", "Pendant"]], initial: "necklace" },
  { name: "sort", label: "Order (lower shows first)", type: "number" },
  { name: "active", label: "Show on home page", type: "checkbox", initial: true },
];

export default function CarouselAdmin() {
  return (
    <div className="stack">
      <p className="note">Banners appear at the top of the home page. Until you add one, two built-in text banners are shown.</p>
      <Resource<Slide>
        title="Home carousel" path="slides" fields={fields}
        columns={[
          { label: "", render: (s) => (
            <span className={`thumb card__media tone-rose ${s.image ? "card__media--photo" : ""}`} style={{ width: 96 }}>
              {s.image ? <img className="media-img" src={imgUrl(s.image, 200)} alt="" /> : <Jewel kind={s.kind || "necklace"} />}
            </span>
          ) },
          { label: "Heading", render: (s) => <>{s.title}<br /><small className="muted">{s.kicker}</small></> },
          { label: "Button", render: (s) => (s.ctaLabel ? `${s.ctaLabel} → ${s.ctaLink || "/shop"}` : "—") },
          { label: "Order", render: (s) => s.sort ?? 0 },
          { label: "Status", render: (s) => <span className={`badge badge--${s.active !== false ? "on" : "off"}`}>{s.active !== false ? "Shown" : "Hidden"}</span> },
        ]}
      />
    </div>
  );
}
