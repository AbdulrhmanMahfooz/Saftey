"use client";

import { useState } from "react";

export default function OrderForm({ serviceId, serviceTitle, t }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      serviceId,
      serviceTitle,
      customerName: form.get("customerName"),
      customerEmail: form.get("customerEmail"),
      customerPhone: form.get("customerPhone"),
      notes: form.get("notes"),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || t.genericError);
      setStatus("idle");
      return;
    }
    setStatus("success");
    e.target.reset();
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-2">✓</div>
        <p className="font-semibold text-slate-900">{t.received}</p>
        <p className="text-sm text-slate-600 mt-1">{t.receivedMsg}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-brand-700 hover:underline"
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="label" htmlFor="customerName">{t.name}</label>
        <input id="customerName" name="customerName" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="customerEmail">{t.email}</label>
        <input id="customerEmail" name="customerEmail" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="customerPhone">{t.phoneOptional}</label>
        <input id="customerPhone" name="customerPhone" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="notes">{t.notes}</label>
        <textarea id="notes" name="notes" rows={3} className="input" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? t.sending : t.send}
      </button>
    </form>
  );
}
