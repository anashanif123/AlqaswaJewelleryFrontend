"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { imgUrl, type Slide } from "@/lib/api";
import { Jewel } from "./Art";

const DURATION = 6500;

// Shown until the admin adds slides (Admin → Home carousel).
export const defaultSlides: Slide[] = [
  { _id: "d1", kicker: "The bridal & everyday edit", title: "Jewellery made to be handed down", subtitle: "Hallmarked gold, honest prices and designs drawn from the arches and crescents of old Lahore.", ctaLabel: "Shop the collection", ctaLink: "/shop", kind: "necklace", tone: "sand" },
  { _id: "d2", kicker: "Bridal sittings", title: "Your set, chosen with you", subtitle: "Sit with us at the studio or on video call. Free alterations until your wedding day.", ctaLabel: "Book a sitting", ctaLink: "/bridal", kind: "earring", tone: "emerald" },
  { _id: "d3", kicker: "Everyday gold", title: "Small pieces, worn every day", subtitle: "Rings and studs from Rs 18,900. Free resizing for a year.", ctaLabel: "Shop rings", ctaLink: "/shop?category=rings", kind: "ring", tone: "rose" },
];

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

  const dark = (s: Slide) => !!s.image || s.tone === "emerald";

  return (
    <section className={`slider ${paused ? "slider--paused" : ""} ${dark(list[i]) ? "slider--dark" : ""}`} aria-roledescription="carousel" aria-label="Highlights"
      style={{ "--dur": `${DURATION}ms` } as React.CSSProperties}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); }}>
      {list.map((s, n) => {
        const Title = n === 0 ? "h1" : "h2";
        return (
          <div key={s._id} className={`slide ${n === i ? "slide--on" : ""} ${s.image ? "slide--photo" : `slide--${s.tone || "sand"}`} ${dark(s) ? "slide--dark" : ""}`}
            aria-hidden={n !== i} role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${list.length}`}>
            {s.image ? (
              <picture>
                {s.mobileImage && <source media="(max-width: 760px)" srcSet={imgUrl(s.mobileImage, 900)} />}
                <img className="slide__bg" src={imgUrl(s.image, 2000)} alt="" fetchPriority={n === 0 ? "high" : "low"} />
              </picture>
            ) : (
              <div className="slide__art" aria-hidden="true"><Jewel kind={s.kind || "necklace"} /></div>
            )}
            <div className="slide__copy">
              {s.kicker && <p className="slide__kicker">{s.kicker}</p>}
              <Title>{s.title}</Title>
              {s.subtitle && <p className="slide__sub">{s.subtitle}</p>}
              {s.ctaLabel && <Link href={s.ctaLink || "/shop"} className="btn" tabIndex={n === i ? 0 : -1}>{s.ctaLabel}</Link>}
            </div>
          </div>
        );
      })}

      {list.length > 1 && (
        <div className="slider__ui">
          <div className="slider__bars">
            {list.map((s, n) => (
              <button key={s._id + i} className={`slider__bar ${n === i ? "slider__bar--on" : n < i ? "slider__bar--done" : ""}`} onClick={() => go(n)} aria-label={`Show slide ${n + 1}`}><span /></button>
            ))}
          </div>
          <span className="slider__count">{String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
          <button className="slider__arrow" onClick={() => go(i - 1)} aria-label="Previous slide">←</button>
          <button className="slider__arrow" onClick={() => go(i + 1)} aria-label="Next slide">→</button>
        </div>
      )}
    </section>
  );
}
