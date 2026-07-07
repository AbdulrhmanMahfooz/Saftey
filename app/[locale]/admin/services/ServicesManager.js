"use client";

import { useState } from "react";
import { Toast, useToast } from "@/components/Toast";

const emptyForm = {
  id: null,
  title: "",
  description: "",
  price: "",
  duration: "",
  features: "",
};

export default function ServicesManager({ initialServices, t }) {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const { toast, show } = useToast();

  function edit(s) {
    setForm({
      id: s.id,
      title: s.title,
      description: s.description,
      price: String(s.price),
      duration: s.duration,
      features: (s.features || []).join("\n"),
    });
  }

  function reset() {
    setForm(emptyForm);
    setError("");
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const url = form.id ? `/api/services/${form.id}` : "/api/services";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || t.failSave);
      return;
    }
    const saved = await res.json();
    const wasEdit = !!form.id;
    setServices((prev) => {
      if (wasEdit) return prev.map((s) => (s.id === form.id ? saved : s));
      return [saved, ...prev];
    });
    reset();
    show(wasEdit ? t.updated : t.created);
  }

  async function remove(id) {
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(id);
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      show(t.deleted);
    } else {
      show(t.failDelete, "error");
    }
  }

  return (
    <div>
      <Toast toast={toast} />
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t.title}</h1>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3 space-y-3">
          {services.length === 0 && (
            <div className="card text-slate-500 text-sm">{t.empty}</div>
          )}
          {services.map((s) => (
            <div key={s.id} className="card flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900">{s.title}</div>
                <div className="text-sm text-slate-600 line-clamp-2">{s.description}</div>
                <div className="text-sm text-brand-700 font-bold mt-1">
                  ${s.price} · {s.duration}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => edit(s)} className="btn-secondary text-sm">
                  {t.editBtn}
                </button>
                <button
                  onClick={() => remove(s.id)}
                  disabled={deletingId === s.id}
                  className="btn-danger text-sm disabled:opacity-60"
                >
                  {deletingId === s.id ? t.saving : t.deleteBtn}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <div className="card sticky top-4">
            <h2 className="font-semibold text-slate-900 mb-4">
              {form.id ? t.edit : t.addNew}
            </h2>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="label">{t.fTitle}</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">{t.fDescription}</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t.fPrice}</label>
                  <input
                    type="number"
                    className="input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">{t.fDuration}</label>
                  <input
                    className="input"
                    placeholder={t.fDurationPlaceholder}
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">{t.fFeatures}</label>
                <textarea
                  className="input"
                  rows={4}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? t.saving : form.id ? t.update : t.add}
                </button>
                {form.id && (
                  <button type="button" onClick={reset} className="btn-secondary">
                    {t.cancel}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
