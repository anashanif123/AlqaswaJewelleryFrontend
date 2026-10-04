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
  if (state === "done") return <p className="news__done">You are on the list. We will write when something new lands.</p>;
  return (
    <form className="news__form" onSubmit={submit}>
      <label htmlFor="email" className="sr">Email address</label>
      <input id="email" name="email" type="email" placeholder="you@example.com" required />
      <button className="btn" type="submit" disabled={state === "busy"}>{state === "busy" ? "…" : "Subscribe"}</button>
      {!["idle", "busy"].includes(state) && <p className="form-error">{state}</p>}
    </form>
  );
}
