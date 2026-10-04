import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import { infoPages } from "@/lib/pages";

export const generateStaticParams = () => Object.keys(infoPages).map((slug) => ({ slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return { title: infoPages[(await params).slug]?.title };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = infoPages[slug];
  if (!page) notFound();
  return (
    <>
      <PageHead title={page.title} kicker={page.kicker} crumbs={[{ label: "Help" }, { label: page.title }]} />
      <section className="wrap page info">
        <aside className="info__nav">
          {Object.entries(infoPages).map(([s, p]) => <Link key={s} href={`/help/${s}`} className={s === slug ? "on" : ""}>{p.title}</Link>)}
          <Link href="/contact">Contact us</Link>
        </aside>
        <article className="prose">
          {page.sections.map((s) => (
            <section key={s.h}><h2>{s.h}</h2>{s.p.map((t) => <p key={t}>{t}</p>)}</section>
          ))}
        </article>
      </section>
    </>
  );
}
