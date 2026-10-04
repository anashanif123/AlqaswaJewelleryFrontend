"use client";
import { useRouter } from "next/navigation";
import PageHead from "@/components/PageHead";

export default function TrackPage() {
  const router = useRouter();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    router.push(`/order/${String(f.get("number")).trim().toUpperCase()}?phone=${encodeURIComponent(String(f.get("phone")))}`);
  };
  return (
    <>
      <PageHead title="Track your order" crumbs={[{ label: "Track order" }]} />
      <section className="wrap page narrow">
        <form className="box stack" onSubmit={submit}>
          <p className="muted">Enter the order number from your confirmation and the phone number used at checkout.</p>
          <label className="fld"><span>Order number</span><input className="input" name="number" required placeholder="AQ-10001" /></label>
          <label className="fld"><span>Phone</span><input className="input" name="phone" required type="tel" placeholder="03xx xxxxxxx" /></label>
          <button className="btn" type="submit">Find my order</button>
        </form>
      </section>
    </>
  );
}
