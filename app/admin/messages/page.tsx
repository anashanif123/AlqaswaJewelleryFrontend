"use client";
import Resource from "@/components/admin/Resource";
import { api, dateFmt } from "@/lib/api";

type Msg = { _id: string; type: string; name: string; email?: string; phone?: string; date?: string; message?: string; handled: boolean; createdAt: string };

export default function MessagesAdmin() {
  return (
    <Resource<Msg>
      title="Messages & bridal requests" path="messages" canCreate={false} canEdit={false}
      filters={[
        { name: "type", label: "Type", options: [["contact", "Contact"], ["bridal", "Bridal"]] },
        { name: "handled", label: "Handled", options: [["false", "Open"], ["true", "Handled"]] },
      ]}
      columns={[
        { label: "Received", render: (m) => dateFmt(m.createdAt) },
        { label: "Type", render: (m) => <span className={`badge ${m.type === "bridal" ? "badge--confirmed" : ""}`}>{m.type}</span> },
        { label: "From", render: (m) => <>{m.name}<br /><small className="muted">{[m.phone, m.email].filter(Boolean).join(" · ")}</small></> },
        { label: "Message", render: (m) => <>{m.date && <small className="muted">Wants {dateFmt(m.date)}<br /></small>}{m.message}</> },
        { label: "Status", render: (m) => <span className={`badge badge--${m.handled ? "on" : "off"}`}>{m.handled ? "Handled" : "Open"}</span> },
      ]}
      rowActions={(m, reload) => (
        <button className="linkish" onClick={() => api(`/admin/messages/${m._id}`, { method: "PATCH", body: { handled: !m.handled } }).then(reload)}>{m.handled ? "Reopen" : "Mark handled"}</button>
      )}
    />
  );
}
