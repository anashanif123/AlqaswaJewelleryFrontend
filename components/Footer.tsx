"use client";
import Link from "next/link";
import type { Category } from "@/lib/api";
import { useStore } from "@/lib/store";
import NewsletterForm from "./NewsletterForm";

const help: [string, string][] = [
  ["Track your order", "/track"],
  ["Shipping policy", "/help/delivery"],
  ["Return & exchange policy", "/help/returns"],
  ["Jewellery care", "/help/care"],
  ["Size guide", "/help/size-guide"],
  ["Contact us", "/contact"],
];

export default function Footer({ categories }: { categories: Category[] }) {
  const { settings } = useStore();
  const wa = settings?.whatsapp;
  return (
    <footer className="footer">
      <div className="footer__top wrap">
        <div className="footer__col">
          <h2>Connect With Us</h2>
          <address className="footer__contact">
            {settings?.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>}
            {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings?.address && <span>{settings.address}</span>}
          </address>
          {wa && (
            <a className="footer__wa" href={`https://wa.me/${wa}`} target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M8.5 8.5c0 4 3 7 7 7l1.2-1.6-2-1-1 .8a5 5 0 0 1-2.4-2.4l.8-1-1-2z" /></svg>
              Chat on WhatsApp
            </a>
          )}
        </div>
        <div className="footer__col">
          <h2>Shop</h2>
          <ul>
            <li><Link href="/shop?sort=new">New Arrival</Link></li>
            {categories.slice(0, 6).map((c) => <li key={c._id}><Link href={`/shop?category=${c.slug}`}>{c.name}</Link></li>)}
            <li><Link href="/shop?sale=true">Sale</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h2>Policies</h2>
          <ul>{help.map(([t, h]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
        </div>
      </div>
      <div className="footer__mid wrap">
        <div className="footer__news">
          <h2>Join Our Mailing List</h2>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer__legal">
        <p>© {new Date().getFullYear()}, <Link href="/">{settings?.storeName || "Al Qaswa"}</Link> · Cash on delivery across Pakistan</p>
      </div>
    </footer>
  );
}
