import type { Kind } from "@/lib/data";

/** Al Qaswa logo: an arched window holding a crescent and a single stone. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo ${light ? "logo--light" : ""}`}>
      <svg viewBox="0 0 40 52" aria-hidden="true" className="logo__mark">
        <path d="M4 50V20a16 16 0 0 1 32 0v30" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 50V21a11 11 0 0 1 22 0v29" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".55" />
        <path d="M24.5 17a7 7 0 1 1-7.4-6.9 5.6 5.6 0 1 0 7.4 6.9z" fill="currentColor" />
        <path d="M20 30l4 5-4 6-4-6z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">Al Qaswa</span>
        <span className="logo__sub">Fine jewellery</span>
      </span>
    </span>
  );
}

/** Line-art jewellery drawn in gold. Swap for real product photos later. */
export function Jewel({ kind, className = "" }: { kind: Kind; className?: string }) {
  const s = { fill: "none", stroke: "url(#g)", strokeWidth: 2, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 120 120" className={`jewel ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3DFA8" />
          <stop offset=".5" stopColor="#C8A464" />
          <stop offset="1" stopColor="#8C6A2E" />
        </linearGradient>
      </defs>
      {kind === "ring" && (
        <g {...s}>
          <ellipse cx="60" cy="74" rx="28" ry="26" />
          <ellipse cx="60" cy="74" rx="23" ry="21" strokeWidth="1" />
          <path d="M48 46l12-16 12 16-12 8z" />
          <path d="M48 46h24M60 30v24" strokeWidth="1" />
        </g>
      )}
      {kind === "necklace" && (
        <g {...s}>
          <path d="M22 20c0 40 18 58 38 58s38-18 38-58" />
          <path d="M30 20c2 30 14 46 30 46s28-16 30-46" strokeWidth="1" />
          {[30, 40, 50, 60, 70, 80, 90].map((x, i) => (
            <circle key={x} cx={x} cy={[46, 58, 66, 69, 66, 58, 46][i]} r="2.6" fill="url(#g)" stroke="none" />
          ))}
          <path d="M60 78l7 9-7 14-7-14z" />
        </g>
      )}
      {kind === "earring" && (
        <g {...s}>
          {[40, 80].map((x) => (
            <g key={x}>
              <path d={`M${x} 18a6 6 0 1 1 0 12`} />
              <path d={`M${x} 30v14`} strokeWidth="1" />
              <path d={`M${x} 44c-12 10-12 28 0 40 12-12 12-30 0-40z`} />
              <circle cx={x} cy="96" r="5" fill="url(#g)" stroke="none" />
            </g>
          ))}
        </g>
      )}
      {kind === "bangle" && (
        <g {...s}>
          <ellipse cx="60" cy="62" rx="40" ry="18" />
          <ellipse cx="60" cy="58" rx="40" ry="18" strokeWidth="1" />
          {[-30, -15, 0, 15, 30].map((d) => (
            <path key={d} d={`M${60 + d} ${76 - Math.abs(d) / 6}l3 4-3 4-3-4z`} strokeWidth="1.2" />
          ))}
        </g>
      )}
      {kind === "pendant" && (
        <g {...s}>
          <path d="M20 14c10 24 24 34 40 34s30-10 40-34" strokeWidth="1" />
          <circle cx="60" cy="54" r="5" />
          <path d="M74 82a20 20 0 1 1-20-22 16 16 0 1 0 20 22z" />
          <path d="M62 78l3 4-3 4-3-4z" fill="url(#g)" stroke="none" />
        </g>
      )}
    </svg>
  );
}
