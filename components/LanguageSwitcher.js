"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const LOCALES = ["en", "ar"];
const LABELS = { en: "EN", ar: "ع" };

export default function LanguageSwitcher({ currentLocale }) {
  const pathname = usePathname() || `/${currentLocale}`;

  function pathFor(locale) {
    const parts = pathname.split("/");
    if (LOCALES.includes(parts[1])) {
      parts[1] = locale;
      return parts.join("/") || `/${locale}`;
    }
    return `/${locale}${pathname}`;
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={pathFor(l)}
          className={`px-2 py-1 rounded ${
            l === currentLocale
              ? "bg-brand-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {LABELS[l]}
        </Link>
      ))}
    </div>
  );
}
