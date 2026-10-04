import Link from "next/link";

/** Dark arch-lit band at the top of inner pages so the fixed header sits on emerald, like the home hero. */
export default function PageHead({ title, kicker, crumbs = [], children }: {
  title: string; kicker?: string; crumbs?: { label: string; href?: string }[]; children?: React.ReactNode;
}) {
  return (
    <section className="phead">
      <div className="wrap phead__inner">
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : c.label}</span>
            ))}
          </nav>
        )}
        {kicker && <p className="hero__kicker">{kicker}</p>}
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
