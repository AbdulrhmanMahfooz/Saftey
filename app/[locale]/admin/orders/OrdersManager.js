"use client";

import { useState } from "react";
import { Toast, useToast } from "@/components/Toast";

const STATUSES = ["new", "in_progress", "completed", "cancelled"];
const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-slate-200 text-slate-700",
};

export default function OrdersManager({ initialOrders, locale, t, status }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const { toast, show } = useToast();

  async function updateStatus(id, s) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      show(t.updated);
    } else {
      show(t.failUpdate, "error");
    }
  }

  async function remove(id) {
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(id);
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      show(t.deleted);
    } else {
      show(t.failDelete, "error");
    }
  }

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const dateLocale = locale === "ar" ? "ar-EG" : "en-US";

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <select
          className="input max-w-[220px]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">{t.all} ({orders.length})</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {status[s]} ({orders.filter((o) => o.status === s).length})
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <div className="card text-slate-500 text-sm">{t.empty}</div>
      ) : (
        <div className="space-y-3">
          {shown.map((o) => (
            <div key={o.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-slate-900">{o.customerName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}
                    >
                      {status[o.status]}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{o.serviceTitle}</div>
                  <div className="text-sm text-slate-500 mt-2 space-y-0.5">
                    <div dir="ltr">
                      📧 <a className="hover:underline" href={`mailto:${o.customerEmail}`}>{o.customerEmail}</a>
                    </div>
                    {o.customerPhone && <div dir="ltr">📞 {o.customerPhone}</div>}
                  </div>
                  {o.notes && (
                    <p className="mt-3 text-sm text-slate-700 bg-slate-50 rounded p-3 whitespace-pre-wrap">
                      {o.notes}
                    </p>
                  )}
                  <div className="text-xs text-slate-400 mt-2">
                    {new Date(o.createdAt).toLocaleString(dateLocale)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <select
                    className="input text-sm"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {status[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(o.id)}
                    disabled={deletingId === o.id}
                    className="btn-danger text-sm disabled:opacity-60"
                  >
                    {t.deleteBtn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
