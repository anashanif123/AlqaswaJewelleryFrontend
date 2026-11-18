"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Art";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/data";
import type { Category } from "@/lib/api";

type NavItem = { label: string; href?: string; badge?: string; children?: { label: string; href: string }[] };

/** Menu: fixed shortcuts, then every category from Admin → Categories, then help links. */
export function buildNav(categories: Category[]): NavItem[] {
  return [
    { label: "New Arrival", href: "/shop?sort=new" },
    { label: "Best Sellers", href: "/shop?sort=popular" },
    { label: "Under Rs 3,500", href: "/shop?max=3500", badge: "NEW" },
    ...categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
    { label: "Bridal", href: "/bridal" },
    {
      label: "Help", children: [
        { label: "Track your order", href: "/track" },
        { label: "Shipping", href: "/help/delivery" },
        { label: "Return & exchange", href: "/help/returns" },
        { label: "Jewellery care", href: "/help/care" },
        { label: "Contact us", href: "/contact" },
      ],
    },
    { label: "Sale", href: "/shop?sale=true" },
  ];
}

function Announcement() {
  const { settings } = useStore();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const custom = settings?.announcement?.split("|").map((t) => t.trim()).filter(Boolean);
  const items = custom?.length ? custom : [
    "Cash on Delivery All Over Pakistan",
    settings?.freeShippingOver ? `Free Shipping on Orders Over ${formatPrice(settings.freeShippingOver)}` : "Fast Delivery Nationwide",
    "Easy Exchange Within 7 Days",
  ];
  const run = (
    <span className="marquee__run">
      {items.map((t, i) => <span key={i}>{t}<i aria-hidden="true">{i === items.length - 1 ? "✦" : "-"}</i></span>)}
    </span>
  );
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <div className="marquee" aria-label={items.join(". ")}>
        <div className="marquee__track" aria-hidden="true">{run}{run}{run}{run}</div>
      </div>
      <Link href="/shop" className="announce__cta">Shop now!</Link>
      <button className="announce__close" aria-label="Close announcement" onClick={() => setHidden(true)}>
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  );
}

const Icon = {
  search: <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>,
  user: <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  bag: <svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" /><path d="M9 10V6.5a3 3 0 0 1 6 0V10" /></svg>,
  close: <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  menu: <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>,
  chev: <svg viewBox="0 0 24 24" className="chev"><path d="M6 9l6 6 6-6" /></svg>,
  arrow: <svg viewBox="0 0 24 24" className="arr"><path d="M4 12h16M14 6l6 6-6 6" /></svg>,
};

export default function Header({ categories }: { categories: Category[] }) {
  const { count, user, setDrawer } = useStore();
  const router = useRouter();
  const path = usePathname();
  const nav = buildNav(categories);
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const [drop, setDrop] = useState<string | null>(null);
  const [search, setSearch] = useState(false);
  const [bump, setBump] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const add = () => (setBump(true), setTimeout(() => setBump(false), 500));
    const out = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setDrop(null); };
    window.addEventListener("bag:add", add);
    document.addEventListener("click", out);
    return () => (window.removeEventListener("bag:add", add), document.removeEventListener("click", out));
  }, []);
  useEffect(() => { setMenu(false); setDrop(null); setSearch(false); }, [path]);
  useEffect(() => { if (search) input.current?.focus(); }, [search]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const bar = headRef.current?.querySelector(".header__bar");
    if (menu && bar) headRef.current!.style.setProperty("--mnav-top", `${bar.getBoundingClientRect().bottom}px`);
    if (!menu) setSub(null);
  }, [menu]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.current?.value.trim();
    setSearch(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };
  const account = user?.role === "admin" ? "/admin" : "/account";

  return (
    <>
      <Announcement />
      <header className="header" ref={headRef}>
        <div className="header__bar">
          <button className="icon-btn menu-btn" aria-label={menu ? "Close menu" : "Menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? Icon.close : Icon.menu}
          </button>
          <Link href="/" className="header__logo" aria-label="Al Qaswa home"><Logo /></Link>

          <nav className="nav" aria-label="Main" ref={navRef}>
            <ul>
              {nav.map((n) => (
                <li key={n.label} className={n.children ? "has-drop" : ""}>
                  {n.children ? (
                    <>
                      <button className="nav__link" aria-expanded={drop === n.label} onClick={() => setDrop(drop === n.label ? null : n.label)}>
                        <span>{n.label}</span>{Icon.chev}
                      </button>
                      {drop === n.label && (
                        <ul className="drop">
                          {n.children.map((c) => <li key={c.href}><Link href={c.href}>{c.label}</Link></li>)}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link href={n.href!} className="nav__link">
                      {n.badge && <em className="nav__badge">{n.badge}</em>}
                      <span>{n.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__tools">
            <button className="icon-btn" aria-label="Search" aria-expanded={search} onClick={() => setSearch(!search)}>{Icon.search}</button>
            <Link className="icon-btn hide-sm" href={account} aria-label={user ? "Account" : "Log in"}>{Icon.user}</Link>
            <button className={`icon-btn bag ${bump ? "bag--bump" : ""}`} aria-label={`Cart, ${count} items`} onClick={() => setDrawer(true)}>
              {Icon.bag}
              {count > 0 && <span className="bag__count">{count}</span>}
            </button>
          </div>
        </div>

        {search && (
          <form className="searchbar" onSubmit={submit} role="search">
            <div className="searchbar__field">
              <label htmlFor="q" className="sr">Search</label>
              <input id="q" ref={input} type="search" placeholder="Search" />
              <button type="submit" className="icon-btn" aria-label="Search">{Icon.search}</button>
            </div>
            <button type="button" className="icon-btn" aria-label="Close search" onClick={() => setSearch(false)}>{Icon.close}</button>
          </form>
        )}

        {/* Phone menu drawer */}
        <div className={`mnav ${menu ? "mnav--open" : ""}`} aria-hidden={!menu}>
          <div className="mnav__panel">
            {sub ? (
              <>
                <button className="mnav__back" onClick={() => setSub(null)}>
                  <svg viewBox="0 0 24 24"><path d="M20 12H4M10 6l-6 6 6 6" /></svg>{sub}
                </button>
                <ul className="mnav__list">
                  {nav.find((n) => n.label === sub)?.children?.map((c) => <li key={c.href}><Link href={c.href}>{c.label}</Link></li>)}
                </ul>
              </>
            ) : (
              <ul className="mnav__list">
                {nav.map((n) => (
                  <li key={n.label}>
                    {n.children
                      ? <button onClick={() => setSub(n.label)}>{n.label}{Icon.arrow}</button>
                      : <Link href={n.href!}><span>{n.label}{n.badge && <em className="nav__badge nav__badge--inline">{n.badge}</em>}</span></Link>}
                  </li>
                ))}
              </ul>
            )}
            <div className="mnav__foot">
              <Link href={account}>{Icon.user}{user ? "My account" : "Log in"}</Link>
              <Link href="/wishlist"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>Wishlist</Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
