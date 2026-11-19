/**
 * Cleans product options typed in admin so each one becomes its own button.
 * "Golden, Silver / Green" → ["Golden", "Silver", "Green"]
 * "2.4.2.6.2.8" (bangle sizes typed without commas) → ["2.4", "2.6", "2.8"]
 */
export function cleanOptions(list: string[] = []): string[] {
  const out: string[] = [];
  for (const raw of list) {
    for (let part of raw.split(/[,/|;\n]+/)) {
      part = part.trim();
      if (!part) continue;
      const runs = /^\d+(\.\d+){2,}$/.test(part) ? part.match(/\d\.\d{1,2}/g) || [part] : [part];
      for (const r of runs) if (!out.includes(r)) out.push(r);
    }
  }
  return out;
}

/** Same product in another size or colour is its own cart line. */
export const lineKey = (l: { id: string; size?: string; color?: string }) => `${l.id}|${l.size || ""}|${l.color || ""}`;

/** "Size 2.6 · Golden" for cart and order lines. */
export const lineOptions = (l: { size?: string; color?: string }) => [l.size && `Size ${l.size}`, l.color].filter(Boolean).join(" · ");
