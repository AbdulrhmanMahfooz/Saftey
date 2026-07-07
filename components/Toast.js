"use client";

import { useEffect, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast]);
  return {
    toast,
    show: (message, type = "success") =>
      setToast({ message, type, key: Date.now() }),
    clear: () => setToast(null),
  };
}

export function Toast({ toast }) {
  if (!toast) return null;
  const color =
    toast.type === "error"
      ? "bg-red-600"
      : toast.type === "info"
      ? "bg-slate-800"
      : "bg-green-600";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 inset-x-4 sm:inset-auto sm:right-4 z-50 max-w-sm sm:mx-0 mx-auto ${color} text-white rounded-lg px-4 py-3 shadow-lg text-sm`}
    >
      {toast.message}
    </div>
  );
}
