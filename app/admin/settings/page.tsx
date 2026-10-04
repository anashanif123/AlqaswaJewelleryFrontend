"use client";
import { useEffect, useState } from "react";
import Form, { type Field } from "@/components/admin/Form";
import { api, type Settings } from "@/lib/api";
import { useStore } from "@/lib/store";

const fields: Field[] = [
  { name: "storeName", label: "Store name" },
  { name: "announcement", label: "Top announcement bar", hint: "Leave empty to hide the bar" },
  { name: "shippingFee", label: "Delivery fee (Rs)", type: "number" },
  { name: "freeShippingOver", label: "Free delivery over (Rs)", type: "number", hint: "0 = no free delivery" },
  { name: "phone", label: "Phone" },
  { name: "whatsapp", label: "WhatsApp number", hint: "Digits only, with country code: 923001234567" },
  { name: "email", label: "Email" },
  { name: "address", label: "Studio address" },
  { name: "bankDetails", label: "Bank transfer details (shown at checkout)", type: "textarea" },
  { name: "codEnabled", label: "Allow cash on delivery", type: "checkbox" },
  { name: "bankEnabled", label: "Allow bank transfer", type: "checkbox" },
];

export default function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState("");
  const { refreshUser } = useStore();
  useEffect(() => { api<{ item: Settings }>("/admin/settings").then((r) => setS(r.item)); }, []);
  return (
    <div className="stack">
      <div className="adm-head"><h1>Store settings</h1></div>
      {s && (
        <div className="box">
          <Form fields={fields} initial={s} onSubmit={async (body) => {
            setS((await api<{ item: Settings }>("/admin/settings", { method: "PUT", body })).item);
            setMsg("Settings saved. Refresh the store to see changes.");
            refreshUser();
          }} />
        </div>
      )}
      {msg && <p className="note">{msg}</p>}
    </div>
  );
}
