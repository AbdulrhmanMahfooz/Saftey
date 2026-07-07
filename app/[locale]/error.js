"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDict, LOCALES } from "@/lib/i18n";

export default function LocaleError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const pathname = usePathname() || "";
  const segment = pathname.split("/")[1];
  const locale = LOCALES.includes(segment) ? segment : "en";
  const t = getDict(locale).errors;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h1>
      <p className="text-slate-600 mb-6">{t.message}</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={() => reset()} className="btn-primary">
          {t.retry}
        </button>
        <Link href={`/${locale}`} className="btn-secondary">
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
