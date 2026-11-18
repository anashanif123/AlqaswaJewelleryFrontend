"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { imgUrl, type Slide } from "@/lib/api";

const DURATION = 6000;

// Shown until the admin adds banners (Admin → Home carousel).
export const defaultSlides: Slide[] = [
  { _id: "d1", kicker: "The biggest sale of the season", title: "Flat 15% Off", subtitle: "Earrings, bangles, sets and more. Cash on delivery all over Pakistan.", ctaLabel: "Shop now", ctaLink: "/shop?sale=true", tone: "rose" },
  { _id: "d2", kicker: "Bridal collection", title: "Bridal Sets", subtitle: "Necklace, earrings and tikka sets for your big day.", ctaLabel: "Shop bridal", ctaLink: "/bridal", tone: "sand" },
];

/**
 * Full-width banner. A slide with a photo shows only the photo (design your text into the banner image)
 * and the whole banner links to the button link. A slide without a photo shows the text on a soft background.
 */
export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const list = slides.length ? slides : defaultSlides;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(0);
  const go = useCallback((n: number) => setI((n + list.length) % list.length), [list.length]);

  useEffect(() => {
    if (paused || list.length < 2) return;
    const t = setTimeout(() => go(i + 1), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, go, list.length]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Banners"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); }}>
      <div className="hero__track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {list.map((s, n) => {
          const href = s.ctaLink || "/shop";
          const hidden = n !== i;
          return (
            <div key={s._id} className="hero__slide" role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${list.length}`} aria-hidden={hidden}>
              {s.image ? (
                <Link href={href} tabIndex={hidden ? -1 : 0} className="hero__photo" aria-label={s.title}>
                  <picture>
                    {s.mobileImage && <source media="(max-width: 749px)" srcSet={imgUrl(s.mobileImage, 900)} />}
                    <img src={imgUrl(s.image, 2000)} alt={s.title} fetchPriority={n === 0 ? "high" : "low"} />
                  </picture>
                </Link>
              ) : (
                <div className={`hero__text hero__text--${s.tone || "rose"}`}>
                  {s.kicker && <p className="hero__kicker"><span>{s.kicker}</span></p>}
                  {n === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}
                  {s.subtitle && <p className="hero__sub">{s.subtitle}</p>}
                  {s.ctaLabel && <Link href={href} className="btn btn--pill" tabIndex={hidden ? -1 : 0}>{s.ctaLabel}</Link>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {list.length > 1 && (
        <div className="hero__dots">
          {list.map((s, n) => (
            <button key={s._id} className={n === i ? "on" : ""} onClick={() => go(n)} aria-label={`Show banner ${n + 1}`} aria-current={n === i} />
          ))}
        </div>
      )}
    </section>
  );
}
