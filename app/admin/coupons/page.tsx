"use client";
import Resource from "@/components/admin/Resource";
import type { Field } from "@/components/admin/Form";
import { dateFmt } from "@/lib/api";
import { formatPrice } from "@/lib/data";

type Coupon = { _id: string; code: string; description?: string; type: "percent" | "fixed"; value: number; minOrder: number; used: number; usageLimit?: number; expiresAt?: string; active: boolean };

const fields: Field[] = [
  { name: "code", label: "Code", required: true, placeholder: "EID25" },
  { name: "type", label: "Type", type: "select", required: true, options: [["percent", "Percent off"], ["fixed", "Fixed amount off (Rs)"]] },
  { name: "value", label: "Value", type: "number", required: true },
  { name: "minOrder", label: "Minimum order (Rs)", type: "number" },
  { name: "maxDiscount", label: "Max discount (Rs)", type: "number", nullable: true, hint: "Cap for percent codes" },
  { name: "usageLimit", label: "Total uses allowed", type: "number", nullable: true },
  { name: "perUserLimit", label: "Uses per customer", type: "number", nullable: true },
  { name: "startsAt", label: "Starts", type: "date" },
  { name: "expiresAt", label: "Expires", type: "date" },
  { name: "description", label: "Description", wide: true },
  { name: "categories", label: "Only for these categories (none = whole bag)", type: "multiselect", source: "/admin/categories?limit=200" },
  { name: "active", label: "Active", type: "checkbox" },
];

export default function CouponsAdmin() {
  return (
    <Resource<Coupon>
      title="Discount codes" path="coupons" fields={fields}
      columns={[
        { label: "Code", render: (c) => <><strong>{c.code}</strong><br /><small className="muted">{c.description}</small></> },
        { label: "Discount", render: (c) => (c.type === "percent" ? `${c.value}%` : formatPrice(c.value)) },
        { label: "Min order", render: (c) => (c.minOrder ? formatPrice(c.minOrder) : "—") },
        { label: "Used", render: (c) => `${c.used}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` },
        { label: "Expires", render: (c) => (c.expiresAt ? dateFmt(c.expiresAt) : "Never") },
        { label: "Status", render: (c) => <span className={`badge badge--${c.active ? "on" : "off"}`}>{c.active ? "Active" : "Off"}</span> },
      ]}
    />
  );
}
