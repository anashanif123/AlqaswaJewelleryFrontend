"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHead from "@/components/PageHead";
import { statusLabel } from "@/components/OrderView";
import { api, dateFmt, type Order, type User } from "@/lib/api";
import { formatPrice } from "@/lib/data";
import { useStore } from "@/lib/store";

function AuthForms() {
  const { login } = useStore();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = Object.fromEntries(new FormData(e.currentTarget));
      const r = await api<{ token: string; user: User }>(`/auth/${mode}`, { body });
      login(r.token, r.user);
      const next = new URLSearchParams(location.search).get("next");
      if (next?.startsWith("/")) router.push(next);
      else if (r.user.role === "admin") router.push("/admin");
    } catch (err) { setError((err as Error).message); }
    setBusy(false);
  };

  return (
    <div className="box narrow stack">
      <div className="chips" role="tablist">
        <button role="tab" aria-selected={mode === "login"} className={`chip ${mode === "login" ? "chip--on" : ""}`} onClick={() => setMode("login")}>Log in</button>
        <button role="tab" aria-selected={mode === "register"} className={`chip ${mode === "register" ? "chip--on" : ""}`} onClick={() => setMode("register")}>Create account</button>
      </div>
      <form className="stack" onSubmit={submit} key={mode}>
        {mode === "register" && <label className="fld"><span>Full name</span><input className="input" name="name" required minLength={2} autoComplete="name" /></label>}
        <label className="fld"><span>Email</span><input className="input" name="email" type="email" required autoComplete="email" /></label>
        {mode === "register" && <label className="fld"><span>Phone (optional)</span><input className="input" name="phone" type="tel" autoComplete="tel" /></label>}
        <label className="fld"><span>Password</span><input className="input" name="password" type="password" required minLength={mode === "register" ? 6 : 1} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
      </form>
    </div>
  );
}

function Dashboard({ user }: { user: User }) {
  const { logout, refreshUser } = useStore();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => { api<{ items: Order[] }>("/orders/mine").then((r) => setOrders(r.items)).catch(() => setOrders([])); }, []);

  const send = (path: string, method: string) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await api(path, { method, body: Object.fromEntries(new FormData(form)) });
      setMsg("Saved");
      form.reset();
      refreshUser();
    } catch (err) { setMsg((err as Error).message); }
  };
  const cancel = async (n: string) => {
    if (!confirm(`Cancel order ${n}?`)) return;
    try {
      const r = await api<{ order: Order }>(`/orders/${n}/cancel`, { method: "POST" });
      setOrders((o) => o!.map((x) => (x.number === n ? r.order : x)));
    } catch (err) { alert((err as Error).message); }
  };

  return (
    <div className="stack">
      <div className="chips">
        {[["orders", "Orders"], ["profile", "Profile"], ["addresses", "Addresses"], ["password", "Password"]].map(([k, l]) => (
          <button key={k} className={`chip ${tab === k ? "chip--on" : ""}`} onClick={() => (setTab(k), setMsg(""))}>{l}</button>
        ))}
        {user.role === "admin" && <Link className="chip" href="/admin">Admin panel</Link>}
        <button className="chip" onClick={logout}>Log out</button>
      </div>

      {tab === "orders" && (orders === null ? <p className="muted">Loading…</p> : orders.length === 0 ? (
        <div className="empty"><h2>No orders yet</h2><Link href="/shop" className="btn">Start shopping</Link></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th /></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><Link className="link" href={`/order/${o.number}`}>{o.number}</Link></td>
                  <td>{dateFmt(o.createdAt)}</td>
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td><span className={`badge badge--${o.status}`}>{statusLabel(o.status)}</span></td>
                  <td>{["pending", "confirmed"].includes(o.status) && <button className="linkish" onClick={() => cancel(o.number)}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {tab === "profile" && (
        <form className="box stack narrow" onSubmit={send("/auth/me", "PATCH")}>
          <p className="muted">{user.email}</p>
          <label className="fld"><span>Name</span><input className="input" name="name" defaultValue={user.name} required minLength={2} /></label>
          <label className="fld"><span>Phone</span><input className="input" name="phone" defaultValue={user.phone} /></label>
          <button className="btn" type="submit">Save</button>
        </form>
      )}

      {tab === "addresses" && (
        <div className="stack">
          {user.addresses.map((a) => (
            <div key={a._id} className="box row-between">
              <p><strong>{a.label || a.name}</strong><br />{a.name} · {a.phone}<br />{a.line1}, {a.city}</p>
              <button className="linkish" onClick={() => api(`/auth/me/addresses/${a._id}`, { method: "DELETE" }).then(refreshUser)}>Remove</button>
            </div>
          ))}
          <form className="box fld-grid" onSubmit={send("/auth/me/addresses", "POST")}>
            <label className="fld"><span>Label</span><input className="input" name="label" placeholder="Home, Office…" /></label>
            <label className="fld"><span>Name</span><input className="input" name="name" required /></label>
            <label className="fld"><span>Phone</span><input className="input" name="phone" required /></label>
            <label className="fld"><span>City</span><input className="input" name="city" required /></label>
            <label className="fld fld--wide"><span>Address</span><input className="input" name="line1" required /></label>
            <button className="btn" type="submit">Add address</button>
          </form>
        </div>
      )}

      {tab === "password" && (
        <form className="box stack narrow" onSubmit={send("/auth/me/password", "PATCH")}>
          <label className="fld"><span>Current password</span><input className="input" type="password" name="current" required /></label>
          <label className="fld"><span>New password</span><input className="input" type="password" name="password" required minLength={6} /></label>
          <button className="btn" type="submit">Update password</button>
        </form>
      )}
      {msg && <p className="note" role="status">{msg}</p>}
    </div>
  );
}

export default function AccountPage() {
  const { user, ready } = useStore();
  return (
    <>
      <PageHead title={user ? `Salaam, ${user.name.split(" ")[0]}` : "Your account"} crumbs={[{ label: "Account" }]} />
      <section className="wrap page">{!ready ? <p className="muted">Loading…</p> : user ? <Dashboard user={user} /> : <AuthForms />}</section>
    </>
  );
}
