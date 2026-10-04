"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import OrderView from "@/components/OrderView";
import { api, type Order } from "@/lib/api";
import { useStore } from "@/lib/store";

export default function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const { ready, user, settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [fresh, setFresh] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    try {
      const last = JSON.parse(sessionStorage.getItem("aq_last_order") || "null");
      if (last?.number === number) (setOrder(last), setFresh(true));
    } catch {}
    const phone = new URLSearchParams(location.search).get("phone");
    api<{ order: Order }>(`/orders/${number}${phone ? `?phone=${encodeURIComponent(phone)}` : ""}`)
      .then((r) => setOrder(r.order))
      .catch((e) => setError(e.message));
  }, [ready, number, user]);

  return (
    <>
      <PageHead title={fresh ? "Thank you, your order is in" : `Order ${number}`} kicker={fresh ? `Order ${number}` : undefined}
        crumbs={[{ label: user ? "Account" : "Track order", href: user ? "/account" : "/track" }, { label: number }]}>
        {fresh && <p className="hero__lead">We will call you to confirm shortly. {settings?.whatsapp && <>Questions? <a className="link-gold" href={`https://wa.me/${settings.whatsapp}`}>WhatsApp us</a>.</>}</p>}
      </PageHead>
      <section className="wrap page">
        {order ? <OrderView o={order} /> : error ? (
          <div className="empty"><h2>We could not find that order</h2><p>Check the number and the phone used at checkout.</p><Link className="btn" href="/track">Track an order</Link></div>
        ) : <p className="muted">Loading order…</p>}
        {fresh && order?.paymentMethod === "bank" && settings?.bankDetails && (
          <div className="box"><h3>Bank transfer details</h3><p className="pre">{settings.bankDetails}</p><p className="muted">Use {order.number} as the reference.</p></div>
        )}
      </section>
    </>
  );
}
