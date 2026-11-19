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
