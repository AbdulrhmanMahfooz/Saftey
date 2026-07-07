import Link from "next/link";

export default function Footer({ locale, t }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-3">
        <p>© {new Date().getFullYear()} {t.brand}. {t.footer.rights}</p>
        <div className="flex gap-4">
          <Link href={`/${locale}/privacy`} className="hover:text-brand-700">
            {t.footer.privacy}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-brand-700">
            {t.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
