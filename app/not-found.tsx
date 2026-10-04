import Link from "next/link";
import PageHead from "@/components/PageHead";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";

export default function NotFound() {
  return (
    <>
      <Header />
      <PageHead title="This page has gone missing" />
      <section className="wrap page empty">
        <p>The piece or page you were looking for is not here any more.</p>
        <Link href="/shop" className="btn">Browse the collection</Link>
      </section>
      <Footer />
    </>
  );
}
