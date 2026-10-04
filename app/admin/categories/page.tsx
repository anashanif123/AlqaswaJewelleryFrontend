"use client";
import Resource from "@/components/admin/Resource";
import type { Field } from "@/components/admin/Form";
import { Jewel } from "@/components/Art";
import { imgUrl, type Category } from "@/lib/api";

const fields: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "kind", label: "Icon", type: "select", options: [["ring", "Ring"], ["necklace", "Necklace"], ["earring", "Earring"], ["bangle", "Bangle"], ["pendant", "Pendant"]], initial: "ring" },
  { name: "sort", label: "Order (lower shows first)", type: "number" },
  { name: "slug", label: "URL slug", hint: "Leave empty to generate from the name" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "image", label: "Photo (portrait, shown in the arch on the home page)", type: "image" },
  { name: "active", label: "Visible in store", type: "checkbox", initial: true },
];

export default function CategoriesAdmin() {
  return (
    <Resource<Category>
      title="Categories" path="categories" fields={fields}
      columns={[
        { label: "", render: (c) => <span className={`thumb card__media tone-emerald ${c.image ? "card__media--photo" : ""}`}>{c.image ? <img className="media-img" src={imgUrl(c.image, 120)} alt="" /> : <Jewel kind={c.kind} />}</span> },
        { label: "Name", render: (c) => c.name },
        { label: "Slug", render: (c) => <code>{c.slug}</code> },
        { label: "Order", render: (c) => c.sort },
        { label: "Status", render: (c) => <span className={`badge badge--${c.active ? "on" : "off"}`}>{c.active ? "Visible" : "Hidden"}</span> },
      ]}
    />
  );
}
