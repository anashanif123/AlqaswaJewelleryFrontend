"use client";
import Resource from "@/components/admin/Resource";
import { api, dateFmt } from "@/lib/api";

type Sub = { _id: string; email: string; createdAt: string };

const exportCsv = async () => {
  const r = await api<{ items: Sub[] }>("/admin/subscribers?limit=200");
  const blob = new Blob(["email,joined\n" + r.items.map((s) => `${s.email},${s.createdAt}`).join("\n")], { type: "text/csv" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "subscribers.csv" });
  a.click();
};

export default function SubscribersAdmin() {
  return (
    <Resource<Sub>
      title="Newsletter subscribers" path="subscribers" canCreate={false} canEdit={false}
      toolbar={() => <button className="chip" onClick={exportCsv}>Export CSV</button>}
      columns={[{ label: "Email", render: (s) => s.email }, { label: "Joined", render: (s) => dateFmt(s.createdAt) }]}
    />
  );
}
