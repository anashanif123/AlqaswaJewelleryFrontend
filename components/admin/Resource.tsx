"use client";
import { useCallback, useEffect, useState } from "react";
import { api, qs, type Paged } from "@/lib/api";
import Form, { type Field } from "./Form";

export type Column<T> = { label: string; render: (row: T) => React.ReactNode };

/** Generic admin list + create/edit/delete screen for one API resource. */
export default function Resource<T extends { _id: string }>({
  title, path, columns, fields, editFields, filters = [], canCreate = true, canEdit = true, rowActions, toolbar, mapRow,
}: {
  title: string; path: string; columns: Column<T>[]; fields?: Field[]; editFields?: Field[];
  filters?: { name: string; label: string; options: [string, string][] }[];
  canCreate?: boolean; canEdit?: boolean;
  rowActions?: (row: T, reload: () => void) => React.ReactNode; toolbar?: (reload: () => void) => React.ReactNode;
  mapRow?: (row: T) => Record<string, any>;
}) {
  const [data, setData] = useState<Paged<T> | null>(null);
  const [q, setQ] = useState("");
  const [f, setF] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api<Paged<T>>(`/admin/${path}${qs({ q, page, limit: 25, ...f })}`).then(setData).catch((e) => setError(e.message));
  }, [path, q, page, f]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const save = async (body: Record<string, any>) => {
    if (editing === "new") await api(`/admin/${path}`, { body });
    else await api(`/admin/${path}/${(editing as T)._id}`, { method: "PATCH", body });
    setEditing(null);
    load();
  };
  const remove = async (row: T) => {
    if (!confirm("Delete this permanently?")) return;
    try { await api(`/admin/${path}/${row._id}`, { method: "DELETE" }); load(); } catch (e) { alert((e as Error).message); }
  };

  const formFields = editing === "new" ? fields : editFields || fields;

  return (
    <div className="stack">
      <div className="adm-head">
        <h1>{title}</h1>
        {canCreate && fields && <button className="btn" onClick={() => setEditing("new")}>Add new</button>}
      </div>

      <div className="filters__row">
        <input className="input adm-search" placeholder="Search…" value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} />
        {filters.map((fl) => (
          <select key={fl.name} className="select" aria-label={fl.label} value={f[fl.name] || ""} onChange={(e) => (setF({ ...f, [fl.name]: e.target.value }), setPage(1))}>
            <option value="">{fl.label}: all</option>
            {fl.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        {toolbar?.(load)}
        <span className="filters__count">{data?.total ?? 0} total</span>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="table-wrap box adm-table">
        <table className="table">
          <thead><tr>{columns.map((c) => <th key={c.label}>{c.label}</th>)}<th /></tr></thead>
          <tbody>
            {data?.items.map((row) => (
              <tr key={row._id}>
                {columns.map((c) => <td key={c.label}>{c.render(row)}</td>)}
                <td className="adm-actions">
                  {rowActions?.(row, load)}
                  {canEdit && formFields && <button className="linkish" onClick={() => setEditing(row)}>Edit</button>}
                  <button className="linkish danger" onClick={() => remove(row)}>Delete</button>
                </td>
              </tr>
            ))}
            {data?.items.length === 0 && <tr><td colSpan={columns.length + 1} className="muted center">Nothing here yet</td></tr>}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="pager">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={`chip ${n === page ? "chip--on" : ""}`} onClick={() => setPage(n)}>{n}</button>
          ))}
        </div>
      )}

      {editing && formFields && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label={editing === "new" ? `New ${title}` : `Edit ${title}`}>
          <div className="drawer__scrim" onClick={() => setEditing(null)} />
          <div className="drawer__panel">
            <div className="adm-head"><h2>{editing === "new" ? "Add new" : "Edit"}</h2><button className="icon-btn" onClick={() => setEditing(null)} aria-label="Close">×</button></div>
            <Form fields={formFields} initial={editing === "new" ? null : mapRow ? mapRow(editing) : editing} onSubmit={save} />
          </div>
        </div>
      )}
    </div>
  );
}
