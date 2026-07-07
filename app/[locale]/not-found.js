"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict, LOCALES } from "@/lib/i18n";

export default function LocaleNotFound() {
  const pathname = usePathname() || "";
  const segment = pathname.split("/")[1];
  const locale = LOCALES.includes(segment) ? segment : "en";
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="text-6xl font-bold text-brand-700 mb-2">404</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.notFound.title}</h1>
      <p className="text-slate-600 mb-6">{t.notFound.message}</p>
      <Link href={`/${locale}`} className="btn-primary">{t.errors.backHome}</Link>
    </div>
  );
}
