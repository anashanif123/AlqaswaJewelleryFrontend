"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Art";
import { useStore } from "@/lib/store";

const links = [
  { label: "Rings", href: "/shop?category=rings" },
  { label: "Necklaces", href: "/shop?category=necklaces" },
  { label: "Earrings", href: "/shop?category=earrings" },
  { label: "Bridal", href: "/bridal" },
  { label: "Our story", href: "/help/our-story" },
];
// Shown inside the mobile menu only (the icons are hidden on small screens)
const mobileOnly = [{ label: "Wishlist", href: "/wishlist" }, { label: "Account", href: "/account" }];

export default function Header() {
  const { count, settings, user } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const add = () => (setBump(true), setTimeout(() => setBump(false), 500));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("bag:add", add);
    return () => (window.removeEventListener("scroll", onScroll), window.removeEventListener("bag:add", add));
  }, []);

  useEffect(() => { if (search) input.current?.focus(); }, [search]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.current?.value.trim();
    setSearch(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <header className={`header ${scrolled || search ? "header--solid" : ""}`}>
      {/* Free delivery bar hidden for now — set an announcement from Admin → Settings to show this bar again.
      <p className="announce">Free delivery across Pakistan on orders over Rs 25,000</p> */}
      {settings?.announcement && <p className="announce">{settings.announcement}</p>}
      <div className="header__bar wrap">
        <button className="icon-btn menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <Link href="/" aria-label="Al Qaswa home"><Logo light /></Link>
        <nav className={`nav ${open ? "nav--open" : ""} ${settings?.announcement ? "" : "nav--top"}`} aria-label="Main">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {mobileOnly.map((l) => (
            <Link key={l.label} href={l.href} className="show-sm" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </nav>
        <div className="header__tools">
          <button className="icon-btn" aria-label="Search" aria-expanded={search} onClick={() => setSearch(!search)}>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
          </button>
          <Link className="icon-btn hide-sm" href="/wishlist" aria-label="Wishlist">
            <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
          </Link>
          <Link className="icon-btn hide-sm" href={user?.role === "admin" ? "/admin" : "/account"} aria-label="Account">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>
          </Link>
          <Link className={`icon-btn bag ${bump ? "bag--bump" : ""}`} href="/cart" aria-label={`Shopping bag, ${count} items`}>
            <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
            {count > 0 && <span className="bag__count">{count}</span>}
          </Link>
        </div>
      </div>
      {search && (
        <form className="searchbar wrap" onSubmit={submit} role="search">
          <label htmlFor="q" className="sr">Search jewellery</label>
          <input id="q" ref={input} type="search" placeholder="Search rings, gold, pearl…" />
          <button className="btn btn--gold btn--small" type="submit">Search</button>
        </form>
      )}
    </header>
  );
}
