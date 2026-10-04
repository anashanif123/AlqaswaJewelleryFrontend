"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function EnquiryForm({ type }: { type: "contact" | "bridal" }) {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const f = Object.fromEntries([...new FormData(e.currentTarget)].filter(([, v]) => v !== ""));
    try {
      const r = await api<{ message: string }>("/contact", { body: { ...f, type } });
      setState(r.message);
      e.currentTarget?.reset();
    } catch (err) { setState((err as Error).message); }
    setBusy(false);
  };
  return (
    <form className="box fld-grid" onSubmit={submit}>
      <label className="fld"><span>Name</span><input className="input" name="name" required minLength={2} /></label>
      <label className="fld"><span>Phone</span><input className="input" name="phone" type="tel" required /></label>
      <label className="fld"><span>Email (optional)</span><input className="input" name="email" type="email" /></label>
      {type === "bridal" && <label className="fld"><span>Preferred date</span><input className="input" name="date" type="date" /></label>}
      <label className="fld fld--wide"><span>{type === "bridal" ? "Budget, wedding date, what you have in mind" : "Message"}</span><textarea className="input" name="message" rows={4} maxLength={2000} required={type === "contact"} /></label>
      <button className="btn" type="submit" disabled={busy}>{busy ? "Sending…" : type === "bridal" ? "Request a sitting" : "Send message"}</button>
      {state && <p className="note fld--wide" role="status">{state}</p>}
    </form>
  );
}
