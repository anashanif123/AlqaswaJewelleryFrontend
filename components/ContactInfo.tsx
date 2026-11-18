"use client";
import { useStore } from "@/lib/store";

/** Contact details from Admin → Settings. */
export default function ContactInfo() {
  const { settings: s } = useStore();
  if (!s) return <aside className="summary"><p className="muted">Loading…</p></aside>;
  return (
    <aside className="summary">
      {s.address && <><h3>Address</h3><p>{s.address}</p></>}
      {(s.phone || s.whatsapp) && (
        <>
          <h3>Call or WhatsApp</h3>
          <p>
            {s.phone && <a className="link" href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a>}
            {s.phone && s.whatsapp && " · "}
            {s.whatsapp && <a className="link" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>}
          </p>
        </>
      )}
      {s.email && <><h3>Email</h3><p><a className="link" href={`mailto:${s.email}`}>{s.email}</a></p></>}
    </aside>
  );
}
