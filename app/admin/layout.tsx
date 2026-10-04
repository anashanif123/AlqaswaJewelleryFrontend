"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Art";
import { useStore } from "@/lib/store";
import "./admin.css";

const nav = [
  ["", "Dashboard"], ["orders", "Orders"], ["products", "Products"], ["categories", "Categories"], ["coupons", "Discounts"],
  ["customers", "Customers"], ["reviews", "Reviews"], ["messages", "Messages"], ["subscribers", "Subscribers"], ["settings", "Settings"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useStore();
  const path = usePathname();

  if (!ready) return <p className="adm-gate">Loading…</p>;
  if (user?.role !== "admin")
    return (
      <div className="adm-gate">
        <Logo />
        <p>{user ? "Your account does not have admin access." : "Please log in with an admin account."}</p>
        <Link className="btn" href="/account?next=/admin">Log in</Link>
      </div>
    );

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link href="/"><Logo light /></Link>
        <nav>
          {nav.map(([href, label]) => {
            const to = `/admin${href && "/" + href}`;
            const on = href ? path.startsWith(to) : path === "/admin";
            return <Link key={href} href={to} className={on ? "on" : ""}>{label}</Link>;
          })}
        </nav>
        <div className="adm-side__foot">
          <span>{user.name}</span>
          <Link href="/">View store</Link>
          <button className="linkish" onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
