"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ locale, label }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }
  return (
    <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600">
      {label}
    </button>
  );
}
