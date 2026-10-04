"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHead from "@/components/PageHead";
import Summary from "@/components/Summary";
import { useQuote } from "@/components/useQuote";
import { api, type Address, type Order } from "@/lib/api";
import { useStore } from "@/lib/store";

const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"];
const blank: Address = { name: "", phone: "", line1: "", line2: "", city: "", province: "Punjab", postalCode: "" };

export default function CheckoutPage() {
  const { cart, user, settings, clear, ready, refreshUser } = useStore();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [addr, setAddr] = useState<Address>(blank);
  const [email, setEmail] = useState("");
  const [pay, setPay] = useState<"cod" | "bank">("cod");
  const [note, setNote] = useState("");
  const [save, setSave] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { quote, error: quoteError } = useQuote(cart, coupon);

  useEffect(() => { setCoupon(new URLSearchParams(location.search).get("coupon") || ""); }, []);
  useEffect(() => {
    if (!user) return;
    setEmail(user.email);
    setAddr((a) => (a.name ? a : user.addresses[0] ? { ...blank, ...user.addresses[0] } : { ...a, name: user.name, phone: user.phone || "" }));
  }, [user]);
  useEffect(() => { if (settings && !settings.codEnabled) setPay("bank"); }, [settings]);
  useEffect(() => { if (ready && !cart.length && !busy) router.replace("/cart"); }, [ready, cart.length, busy, router]);

  const field = (k: keyof Address) => ({
    value: addr[k] || "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setAddr({ ...addr, [k]: e.target.value }),
  });

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { _id, label, ...shippingAddress } = addr;
      const { order } = await api<{ order: Order }>("/orders", {
        body: { items: cart.map((l) => ({ product: l.id, qty: l.qty, size: l.size })), coupon: coupon || undefined, email: email || undefined, paymentMethod: pay, note: note || undefined, shippingAddress },
      });
      if (user && save && !_id && !user.addresses.some((a) => a.line1 === addr.line1)) {
        await api("/auth/me/addresses", { body: { ...shippingAddress, label: "Home" } }).then(refreshUser).catch(() => {});
      }
      try { sessionStorage.setItem("aq_last_order", JSON.stringify(order)); } catch {}
      clear();
      router.push(`/order/${order.number}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead title="Checkout" crumbs={[{ label: "Bag", href: "/cart" }, { label: "Checkout" }]} />
      <section className="wrap page">
        <form className="split" onSubmit={place}>
          <div className="stack">
            {!user && <p className="note">Have an account? <Link href="/account?next=/checkout" className="link">Log in</Link> for faster checkout and order history.</p>}

            <fieldset className="box">
              <legend>Contact</legend>
              <label className="fld"><span>Email (for order updates)</span><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            </fieldset>

            <fieldset className="box">
              <legend>Delivery address</legend>
              {user && user.addresses.length > 0 && (
                <label className="fld"><span>Saved addresses</span>
                  <select className="input" onChange={(e) => setAddr(e.target.value ? { ...blank, ...user.addresses.find((a) => a._id === e.target.value)! } : blank)} value={addr._id || ""}>
                    {user.addresses.map((a) => <option key={a._id} value={a._id}>{a.label || a.name} — {a.line1}, {a.city}</option>)}
                    <option value="">Use a new address</option>
                  </select>
                </label>
              )}
              <div className="fld-grid">
                <label className="fld"><span>Full name</span><input className="input" required minLength={2} {...field("name")} /></label>
                <label className="fld"><span>Phone</span><input className="input" required type="tel" placeholder="03xx xxxxxxx" minLength={7} {...field("phone")} /></label>
                <label className="fld fld--wide"><span>Address</span><input className="input" required minLength={3} placeholder="House, street, area" {...field("line1")} /></label>
                <label className="fld fld--wide"><span>Apartment, landmark (optional)</span><input className="input" {...field("line2")} /></label>
                <label className="fld"><span>City</span><input className="input" required {...field("city")} /></label>
                <label className="fld"><span>Province</span><select className="input" {...field("province")}>{provinces.map((p) => <option key={p}>{p}</option>)}</select></label>
                <label className="fld"><span>Postal code (optional)</span><input className="input" {...field("postalCode")} /></label>
              </div>
              {user && !addr._id && <label className="toggle"><input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} /> Save this address</label>}
            </fieldset>

            <fieldset className="box">
              <legend>Payment</legend>
              {settings?.codEnabled !== false && (
                <label className={`pay ${pay === "cod" ? "pay--on" : ""}`}>
                  <input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} />
                  <span><strong>Cash on delivery</strong><small>Pay when your parcel arrives.</small></span>
                </label>
              )}
              {settings?.bankEnabled !== false && (
                <label className={`pay ${pay === "bank" ? "pay--on" : ""}`}>
                  <input type="radio" name="pay" checked={pay === "bank"} onChange={() => setPay("bank")} />
                  <span><strong>Bank transfer</strong><small>{settings?.bankDetails || "We will send account details after you order."}</small></span>
                </label>
              )}
              <label className="fld"><span>Order note (optional)</span><textarea className="input" rows={2} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift wrap, engraving, delivery time…" /></label>
            </fieldset>
          </div>

          <aside>
            <Summary q={quote}>
              <ul className="mini">
                {cart.map((l) => <li key={l.id + (l.size || "")}><span>{l.name}{l.size && ` · ${l.size}`} × {l.qty}</span></li>)}
              </ul>
              {(error || quoteError) && <p className="form-error">{error || quoteError}</p>}
              <button className="btn btn--gold btn--block" type="submit" disabled={busy || !quote}>{busy ? "Placing order…" : "Place order"}</button>
              <p className="muted small center">By ordering you agree to our <Link href="/help/returns" className="link">exchange policy</Link>.</p>
            </Summary>
          </aside>
        </form>
      </section>
    </>
  );
}
