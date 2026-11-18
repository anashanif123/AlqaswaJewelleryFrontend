"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function NewsletterForm() {
  const [state, setState] = useState<"idle" | "busy" | "done" | string>("idle");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("busy");
    try {
      await api("/newsletter", { body: { email: new FormData(e.currentTarget).get("email") } });
      setState("done");
    } catch (err) {
      setState((err as Error).message);
    }
  };
  if (state === "done") return <p className="news__done">Thank you for subscribing. We will email you when new designs land.</p>;
  return (
    <form className="news__form" onSubmit={submit}>
      <label htmlFor="news-email" className="sr">Email</label>
      <input id="news-email" name="email" type="email" placeholder="Email" required />
      <button type="submit" aria-label="Subscribe" disabled={state === "busy"}>
        <svg viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
      </button>
      {!["idle", "busy"].includes(state) && <p className="form-error">{state}</p>}
    </form>
  );
}
