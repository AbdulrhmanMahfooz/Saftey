"use client";

import { useState } from "react";

export default function ContactForm({ t }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      serviceId: null,
      serviceTitle: "General inquiry",
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
      <div className="text-center py-6">
        <div className="text-3xl mb-2">✓</div>
        <p className="font-semibold text-slate-900">{t.sent}</p>
        <p className="text-sm text-slate-600 mt-1">{t.sentMsg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="label" htmlFor="customerName">{t.nameShort}</label>
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
        <label className="label" htmlFor="notes">{t.message}</label>
        <textarea id="notes" name="notes" rows={4} required className="input" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? t.sending : t.sendMessage}
      </button>
    </form>
  );
}
