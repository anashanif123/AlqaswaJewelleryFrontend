"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, dateFmt } from "@/lib/api";
import { formatPrice } from "@/lib/data";
import { statusLabel } from "@/components/OrderView";

type Stats = {
  revenue: number; orders: number; revenue30: number; orders30: number; customers: number; products: number;
  byStatus: Record<string, number>; daily: { _id: string; revenue: number; orders: number }[];
  top: { _id: string; name: string; sold: number; stock: number }[]; lowStock: { _id: string; name: string; stock: number }[];
  recent: { _id: string; number: string; shippingAddress: { name: string }; total: number; status: string; createdAt: string }[];
};

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { api<Stats>("/admin/stats").then(setS).catch((e) => setErr(e.message)); }, []);
  if (err) return <p className="form-error">{err}</p>;
  if (!s) return <p className="muted">Loading…</p>;
  const byDay = new Map(s.daily.map((d) => [d._id, d]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const key = new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10);
    return byDay.get(key) || { _id: key, revenue: 0, orders: 0 };
  });
  const max = Math.max(...days.map((d) => d.revenue), 1);

  return (
    <div className="stack">
      <div className="adm-head"><h1>Dashboard</h1><Link className="btn" href="/admin/products">Add a product</Link></div>
      <div className="kpis">
        <div className="kpi"><span>Revenue, last 30 days</span><strong>{formatPrice(s.revenue30)}</strong><small>{formatPrice(s.revenue)} all time</small></div>
        <div className="kpi"><span>Orders, last 30 days</span><strong>{s.orders30}</strong><small>{s.orders} all time</small></div>
        <div className="kpi"><span>Waiting to confirm</span><strong>{s.byStatus.pending || 0}</strong><small><Link className="link" href="/admin/orders?status=pending">Review now</Link></small></div>
        <div className="kpi"><span>Customers · Products</span><strong>{s.customers} · {s.products}</strong></div>
      </div>
      <div className="adm-grid">
        <div className="box">
          <h3>Daily revenue, last 30 days</h3>
          {s.daily.length ? (
            <div className="bars">{days.map((d) => <div key={d._id} style={{ height: `${Math.max((d.revenue / max) * 100, 1)}%` }} title={`${d._id}: ${formatPrice(d.revenue)} · ${d.orders} orders`} />)}</div>
          ) : <p className="muted">No sales yet.</p>}
        </div>
        <div className="box">
          <h3>Low stock</h3>
          {s.lowStock.length ? <ul className="history">{s.lowStock.map((p) => <li key={p._id}>{p.name} — <strong>{p.stock}</strong> left</li>)}</ul> : <p className="muted">Everything is well stocked.</p>}
        </div>
        <div className="box">
          <h3>Recent orders</h3>
          <table className="table"><tbody>
            {s.recent.map((o) => (
              <tr key={o._id}>
                <td><Link className="link" href={`/admin/orders?open=${o._id}`}>{o.number}</Link></td>
                <td>{o.shippingAddress?.name}</td><td>{dateFmt(o.createdAt)}</td><td>{formatPrice(o.total)}</td>
                <td><span className={`badge badge--${o.status}`}>{statusLabel(o.status)}</span></td>
              </tr>
            ))}
          </tbody></table>
        </div>
        <div className="box">
          <h3>Best sellers</h3>
          <ul className="history">{s.top.map((p) => <li key={p._id}>{p.name} — {p.sold} sold</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
