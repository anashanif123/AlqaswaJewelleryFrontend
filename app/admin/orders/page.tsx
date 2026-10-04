"use client";
import { useEffect, useState } from "react";
import Resource from "@/components/admin/Resource";
import OrderView, { statusLabel } from "@/components/OrderView";
import { api, dateFmt, type Order } from "@/lib/api";
import { formatPrice } from "@/lib/data";

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

function OrderPanel({ id, close }: { id: string; close: () => void }) {
  const [o, setO] = useState<Order | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { api<{ item: Order }>(`/admin/orders/${id}`).then((r) => setO(r.item)); }, [id]);

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = Object.fromEntries([...new FormData(e.currentTarget)].filter(([, v]) => v !== ""));
    try { setO((await api<{ item: Order }>(`/admin/orders/${id}`, { method: "PATCH", body })).item); setMsg("Updated"); }
    catch (err) { setMsg((err as Error).message); }
  };

  return (
    <div className="drawer" role="dialog" aria-modal="true">
      <div className="drawer__scrim" onClick={close} />
      <div className="drawer__panel" style={{ width: "min(980px, 100%)" }}>
        <div className="adm-head"><h2>Order {o?.number}</h2><button className="icon-btn" onClick={close} aria-label="Close">×</button></div>
        {o && (
          <>
            <form className="box fld-grid" onSubmit={update} key={o.status + o.paymentStatus}>
              <label className="fld"><span>Status</span><select className="input" name="status" defaultValue={o.status}>{statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select></label>
              <label className="fld"><span>Payment</span><select className="input" name="paymentStatus" defaultValue={o.paymentStatus}>{["unpaid", "paid", "refunded"].map((s) => <option key={s}>{s}</option>)}</select></label>
              <label className="fld"><span>Courier tracking no.</span><input className="input" name="trackingNumber" defaultValue={o.trackingNumber} /></label>
              <label className="fld"><span>Note for history</span><input className="input" name="note" /></label>
              <p className="muted fld--wide">Customer: {typeof o.user === "object" && o.user ? `${o.user.name} (${o.user.email})` : `Guest ${o.email || ""}`}{o.note && <> · Note: “{o.note}”</>}</p>
              <div><button className="btn" type="submit">Update order</button> {msg && <span className="muted">{msg}</span>}</div>
            </form>
            <OrderView o={o} />
          </>
        )}
      </div>
    </div>
  );
}

export default function OrdersAdmin() {
  const [open, setOpen] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  useEffect(() => { setOpen(new URLSearchParams(location.search).get("open")); }, []);

  return (
    <>
      <Resource<Order>
        key={key}
        title="Orders" path="orders" canCreate={false} canEdit={false}
        filters={[
          { name: "status", label: "Status", options: statuses.map((s) => [s, statusLabel(s)]) },
          { name: "payment", label: "Payment", options: [["unpaid", "Unpaid"], ["paid", "Paid"], ["refunded", "Refunded"]] },
        ]}
        columns={[
          { label: "Order", render: (o) => <button className="linkish link" onClick={() => setOpen(o._id)}>{o.number}</button> },
          { label: "Date", render: (o) => dateFmt(o.createdAt) },
          { label: "Customer", render: (o) => <>{o.shippingAddress.name}<br /><small className="muted">{o.shippingAddress.phone} · {o.shippingAddress.city}</small></> },
          { label: "Items", render: (o) => o.items.reduce((s, i) => s + i.qty, 0) },
          { label: "Total", render: (o) => formatPrice(o.total) },
          { label: "Payment", render: (o) => <span className={`badge badge--${o.paymentStatus}`}>{o.paymentMethod.toUpperCase()} · {o.paymentStatus}</span> },
          { label: "Status", render: (o) => <span className={`badge badge--${o.status}`}>{statusLabel(o.status)}</span> },
        ]}
        rowActions={(o) => <button className="linkish" onClick={() => setOpen(o._id)}>View</button>}
      />
      {open && <OrderPanel id={open} close={() => (setOpen(null), setKey((k) => k + 1))} />}
    </>
  );
}
