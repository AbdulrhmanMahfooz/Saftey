import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Nav({ locale, t }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 gap-4 flex-wrap">
        <Link href={`/${locale}`} className="text-xl font-bold text-brand-700">
          {t.brand}
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-700 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-brand-700">{t.nav.home}</Link>
          <Link href={`/${locale}/services`} className="hover:text-brand-700">{t.nav.services}</Link>
          <Link href={`/${locale}/contact`} className="hover:text-brand-700">{t.nav.contact}</Link>
          <Link href={`/${locale}/admin`} className="text-slate-500 hover:text-brand-700">
            {t.nav.admin}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </nav>
      </div>
    </header>
  );
}
