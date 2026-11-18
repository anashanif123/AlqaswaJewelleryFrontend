import Link from "next/link";

/** Plain page title with optional breadcrumb, matching the clean white store layout. */
export default function PageHead({ title, kicker, crumbs = [], children }: {
  title: string; kicker?: string; crumbs?: { label: string; href?: string }[]; children?: React.ReactNode;
}) {
  return (
    <section className="phead wrap">
      {crumbs.length > 0 && (
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : c.label}</span>
          ))}
        </nav>
      )}
      <h1>{title}</h1>
      {kicker && <p className="phead__sub">{kicker}</p>}
      {children}
    </section>
  );
}
