import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children, params }) {
  const { locale } = params;
  const t = getDict(locale).admin;
  const token = cookies().get("admin_session")?.value;
  const authed = token ? await verifySession(token) : false;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {authed ? (
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
          <div className="flex gap-6 text-sm font-medium">
            <Link href={`/${locale}/admin`} className="text-slate-700 hover:text-brand-700">
              {t.nav.dashboard}
            </Link>
            <Link href={`/${locale}/admin/services`} className="text-slate-700 hover:text-brand-700">
              {t.nav.services}
            </Link>
            <Link href={`/${locale}/admin/orders`} className="text-slate-700 hover:text-brand-700">
              {t.nav.orders}
            </Link>
          </div>
          <LogoutButton locale={locale} label={t.nav.logout} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
