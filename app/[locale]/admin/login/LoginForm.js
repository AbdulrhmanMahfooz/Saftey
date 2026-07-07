"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ locale, t }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || t.invalid);
      return;
    }
    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="label" htmlFor="username">{t.username}</label>
        <input id="username" name="username" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">{t.password}</label>
        <input id="password" name="password" type="password" required className="input" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? t.signingIn : t.signIn}
      </button>
      <p className="text-xs text-slate-500 pt-2">
        {t.defaultCreds}: <code dir="ltr">admin / admin123</code>
      </p>
    </form>
  );
}
