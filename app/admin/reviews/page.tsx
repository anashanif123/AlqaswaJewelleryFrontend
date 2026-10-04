"use client";
import Resource from "@/components/admin/Resource";
import { api, dateFmt } from "@/lib/api";

type Review = { _id: string; product?: { name: string; slug: string }; name: string; rating: number; comment?: string; approved: boolean; createdAt: string };

export default function ReviewsAdmin() {
  return (
    <Resource<Review>
      title="Reviews" path="reviews" canCreate={false} canEdit={false}
      filters={[{ name: "approved", label: "Shown", options: [["true", "Shown"], ["false", "Hidden"]] }]}
      columns={[
        { label: "Product", render: (r) => r.product?.name },
        { label: "By", render: (r) => <>{r.name}<br /><small className="muted">{dateFmt(r.createdAt)}</small></> },
        { label: "Rating", render: (r) => <span className="stars">{"★".repeat(r.rating)}</span> },
        { label: "Comment", render: (r) => r.comment },
        { label: "Status", render: (r) => <span className={`badge badge--${r.approved ? "on" : "off"}`}>{r.approved ? "Shown" : "Hidden"}</span> },
      ]}
      rowActions={(r, reload) => (
        <button className="linkish" onClick={() => api(`/admin/reviews/${r._id}`, { method: "PATCH", body: { approved: !r.approved } }).then(reload)}>{r.approved ? "Hide" : "Show"}</button>
      )}
    />
  );
}
