"use client";
import { useEffect, useState } from "react";
import { api, imgUrl } from "@/lib/api";

export type Field = {
  name: string; label: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "select" | "multiselect" | "tags" | "images" | "image" | "date" | "password";
  options?: [string, string][]; // [value, label]
  source?: string; // API path returning { items } for select options (value=_id, label=name)
  required?: boolean; nullable?: boolean; initial?: any; wide?: boolean; hint?: string; placeholder?: string;
};

const toInput = (f: Field, v: any) => {
  if (v === undefined || v === null) return f.type === "checkbox" ? false : f.type === "tags" || f.type === "images" || f.type === "multiselect" ? [] : "";
  if (f.type === "date") return String(v).slice(0, 10);
  if (f.type === "select" && typeof v === "object") return v._id;
  if (f.type === "multiselect") return v.map((x: any) => (typeof x === "object" ? x._id : x));
  return v;
};

/** Converts form values to the JSON the API expects (numbers, nulls for cleared optionals). */
const toBody = (fields: Field[], vals: Record<string, any>, editing: boolean) => {
  const out: Record<string, any> = {};
  for (const f of fields) {
    let v = vals[f.name];
    if (f.type === "number") v = v === "" || v === undefined ? (editing && f.nullable ? null : undefined) : Number(v);
    else if (f.type === "date") v = v ? v : editing ? null : undefined;
    else if (f.type === "password" && !v) v = undefined;
    else if (typeof v === "string" && v === "" && !f.required) v = editing && f.type !== "select" ? "" : undefined;
    if (v !== undefined) out[f.name] = v;
  }
  return out;
};

function Options({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  const [opts, setOpts] = useState<[string, string][]>(f.options || []);
  useEffect(() => {
    if (f.source) api<{ items: any[] }>(f.source).then((r) => setOpts(r.items.map((i) => [i._id, i.name || i.code]))).catch(() => {});
  }, [f.source]);
  if (f.type === "multiselect")
    return (
      <div className="chips">
        {opts.map(([v, l]) => {
          const on = value.includes(v);
          return <button key={v} type="button" className={`chip ${on ? "chip--on" : ""}`} onClick={() => onChange(on ? value.filter((x: string) => x !== v) : [...value, v])}>{l}</button>;
        })}
      </div>
    );
  return (
    <select className="input" value={value} required={f.required} onChange={(e) => onChange(e.target.value)}>
      {!f.required && <option value="">—</option>}
      {f.required && !value && <option value="">Choose…</option>}
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

function Images({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    // One request per photo: hosting limits request size (~4.5 MB on Vercel)
    const urls: string[] = [];
    for (const f of [...files]) {
      if (f.size > 4 * 1024 * 1024) { alert(`${f.name} is over 4 MB — please use a smaller photo`); continue; }
      const form = new FormData();
      form.append("images", f);
      try { urls.push(...(await api<{ urls: string[] }>("/admin/upload", { form })).urls); }
      catch (e) { alert(`${f.name}: ${(e as Error).message}`); }
    }
    onChange([...value, ...urls]);
    setBusy(false);
  };
  const move = (i: number, d: number) => {
    const n = [...value];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    onChange(n);
  };
  return (
    <div className="imgs">
      {value.map((u, i) => (
        <figure key={u} className="imgs__item">
          <img src={imgUrl(u, 200)} alt="" />
          <figcaption>
            {i > 0 && <button type="button" onClick={() => move(i, -1)} aria-label="Move left">←</button>}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== u))} aria-label="Remove">×</button>
          </figcaption>
        </figure>
      ))}
      <label className="imgs__add">{busy ? "Uploading…" : "+ Add photos"}<input type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} /></label>
    </div>
  );
}

export default function Form({ fields, initial, onSubmit, submitLabel = "Save" }: {
  fields: Field[]; initial?: Record<string, any> | null; onSubmit: (body: Record<string, any>) => Promise<void>; submitLabel?: string;
}) {
  const [vals, setVals] = useState<Record<string, any>>(() => Object.fromEntries(fields.map((f) => [f.name, toInput(f, initial ? initial[f.name] : f.initial)])));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setVals((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try { await onSubmit(toBody(fields, vals, !!initial)); } catch (err) { setError((err as Error).message); }
    setBusy(false);
  };

  return (
    <form className="fld-grid" onSubmit={submit}>
      {fields.map((f) => {
        const v = vals[f.name];
        const common = { required: f.required, placeholder: f.placeholder, className: "input" };
        return (
          <label key={f.name} className={`fld ${f.wide || ["textarea", "images", "image", "multiselect"].includes(f.type || "") ? "fld--wide" : ""} ${f.type === "checkbox" ? "fld--check" : ""}`}>
            {f.type === "checkbox" ? (
              <span className="toggle"><input type="checkbox" checked={!!v} onChange={(e) => set(f.name, e.target.checked)} /> {f.label}</span>
            ) : <span>{f.label}</span>}
            {f.type === "textarea" && <textarea {...common} rows={4} value={v} onChange={(e) => set(f.name, e.target.value)} />}
            {(f.type === "select" || f.type === "multiselect") && <Options f={f} value={v} onChange={(x) => set(f.name, x)} />}
            {f.type === "images" && <Images value={v} onChange={(x) => set(f.name, x)} />}
            {f.type === "image" && <Images value={v ? [v] : []} onChange={(x) => set(f.name, x[x.length - 1] || "")} />}
            {f.type === "tags" && <input {...common} value={v.join(", ")} onChange={(e) => set(f.name, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />}
            {(!f.type || ["text", "number", "date", "password"].includes(f.type)) && (
              <input {...common} type={f.type || "text"} step={f.type === "number" ? "any" : undefined} value={v} onChange={(e) => set(f.name, e.target.value)} />
            )}
            {f.hint && <small className="muted">{f.hint}</small>}
          </label>
        );
      })}
      {error && <p className="form-error fld--wide">{error}</p>}
      <div className="fld--wide"><button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : submitLabel}</button></div>
    </form>
  );
}
