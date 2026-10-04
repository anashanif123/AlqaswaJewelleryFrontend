import Link from "next/link";
import { imgUrl, type Category } from "@/lib/api";
import { Jewel, Logo } from "./Art";
import NewsletterForm from "./NewsletterForm";

export function Categories({ cats }: { cats: Category[] }) {
  const list = cats.slice(0, 6);
  return (
    <section className="cats wrap" aria-label="Shop by type" style={{ "--n": list.length } as React.CSSProperties}>
      <div className="cats__head"><h2>Shop by piece</h2><Link href="/shop" className="link">View all</Link></div>
      {list.map((c) => (
        <Link key={c._id} href={`/shop?category=${c.slug}`} className="cat">
          <span className={`cat__arch ${c.image ? "cat__arch--photo" : ""}`}>
            {c.image ? <img src={imgUrl(c.image, 500)} alt="" loading="lazy" /> : <Jewel kind={c.kind} />}
          </span>
          <span className="cat__name">{c.name}</span>
          <span className="cat__count">{c.count} designs</span>
        </Link>
      ))}
    </section>
  );
}

export function Bridal() {
  return (
    <section className="bridal" id="bridal">
      <div className="bridal__inner wrap">
        <div className="bridal__frame">
          <Jewel kind="necklace" />
          <Jewel kind="earring" className="bridal__ear" />
        </div>
        <div className="bridal__copy">
          <h2>Your bridal set, sat down and chosen with you</h2>
          <p>
            Book a private sitting at our studio or on video call. We bring out sets in your budget,
            adjust lengths on the spot and hold your pieces until the big day.
          </p>
          <ul className="ticks">
            <li>Sets from Rs 350,000 to custom heirloom</li>
            <li>Free alterations until your wedding</li>
            <li>Pay in three parts, no extra charge</li>
          </ul>
          <div className="hero__cta">
            <Link href="/bridal" className="btn btn--gold">Book a sitting</Link>
            <a href="https://wa.me/923120253799" className="btn btn--ghost">WhatsApp us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const promises = [
  { t: "Hallmarked gold", d: "Every piece is tested and stamped, with a certificate in the box." },
  { t: "Free resizing for a year", d: "Ring too tight? Send it back and we resize it at no cost." },
  { t: "7-day easy exchange", d: "Changed your mind? Swap it for anything else in the store." },
];

export function Assurance() {
  return (
    <section className="promise wrap" id="our-story">
      <h2>Bought with confidence, worn for years</h2>
      <div className="promise__list">
        {promises.map((p) => (
          <div key={p.t} className="promise__item">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l3 6-3 12-3-12z" /><path d="M9 9h6" /></svg>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="news wrap">
      <div className="news__box">
        <div>
          <h2>Hear about new pieces first</h2>
          <p>One email when a new collection lands. No spam, unsubscribe anytime.</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}

export function Footer() {
  const cols: Record<string, [string, string][]> = {
    Shop: [["Rings", "/shop?category=rings"], ["Necklaces", "/shop?category=necklaces"], ["Earrings", "/shop?category=earrings"], ["Bangles", "/shop?category=bangles"], ["Bridal", "/bridal"]],
    Help: [["Delivery", "/help/delivery"], ["Returns & exchange", "/help/returns"], ["Ring size guide", "/help/size-guide"], ["Care for your gold", "/help/care"], ["Track your order", "/track"]],
    Visit: [["Studio, Gulberg III, Lahore", "/contact"], ["Mon to Sat, 12 to 9 pm", "/contact"], ["+92 312 0253799", "tel:+923120253799"]],
  };
  return (
    <footer className="footer">
      <div className="footer__inner wrap">
        <div className="footer__brand">
          <Logo light />
          <p>Fine jewellery, designed and finished in Lahore.</p>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <h4>{h}</h4>
            <ul>{items.map(([t, href]) => <li key={t}><Link href={href}>{t}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <p className="footer__legal wrap">© {new Date().getFullYear()} Al Qaswa Jewellery. All rights reserved.</p>
    </footer>
  );
}
