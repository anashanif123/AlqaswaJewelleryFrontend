"use client";
import Resource from "@/components/admin/Resource";
import type { Field } from "@/components/admin/Form";
import { api, dateFmt, type User } from "@/lib/api";

const create: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", required: true },
  { name: "phone", label: "Phone" },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "role", label: "Role", type: "select", required: true, options: [["customer", "Customer"], ["admin", "Admin"]] },
];
const edit: Field[] = [
  { name: "name", label: "Name", required: true },
  { name: "phone", label: "Phone" },
  { name: "role", label: "Role", type: "select", required: true, options: [["customer", "Customer"], ["admin", "Admin"]] },
  { name: "password", label: "New password", type: "password", hint: "Leave empty to keep the current one" },
  { name: "blocked", label: "Blocked (cannot log in)", type: "checkbox" },
];

export default function CustomersAdmin() {
  return (
    <Resource<User>
      title="Customers & admins" path="users" fields={create} editFields={edit}
      filters={[
        { name: "role", label: "Role", options: [["customer", "Customers"], ["admin", "Admins"]] },
        { name: "blocked", label: "Blocked", options: [["true", "Blocked"], ["false", "Active"]] },
      ]}
      columns={[
        { label: "Name", render: (u) => <>{u.name}<br /><small className="muted">{u.email}</small></> },
        { label: "Phone", render: (u) => u.phone || "—" },
        { label: "Role", render: (u) => <span className={`badge ${u.role === "admin" ? "badge--confirmed" : ""}`}>{u.role}</span> },
        { label: "Joined", render: (u) => (u.createdAt ? dateFmt(u.createdAt) : "") },
        { label: "Status", render: (u) => <span className={`badge badge--${u.blocked ? "off" : "on"}`}>{u.blocked ? "Blocked" : "Active"}</span> },
      ]}
      rowActions={(u, reload) => (
        <button className="linkish" onClick={() => api(`/admin/users/${u._id}`, { method: "PATCH", body: { blocked: !u.blocked } }).then(reload).catch((e) => alert(e.message))}>
          {u.blocked ? "Unblock" : "Block"}
        </button>
      )}
    />
  );
}
