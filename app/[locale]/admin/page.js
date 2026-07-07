import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getServices, getOrders } from "@/lib/data";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({ params }) {
  const { locale } = params;
  const t = getDict(locale).admin;
  const token = cookies().get("admin_session")?.value;
  const authed = token ? await verifySession(token) : false;
  if (!authed) redirect(`/${locale}/admin/login`);

  const [services, orders] = await Promise.all([getServices(), getOrders()]);
  const pending = orders.filter((o) => o.status === "new").length;
  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t.dashboard.title}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="text-sm text-slate-500">{t.dashboard.services}</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{services.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">{t.dashboard.newRequests}</div>
          <div className="text-3xl font-bold text-brand-700 mt-1">{pending}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">{t.dashboard.revenue}</div>
          <div className="text-3xl font-bold text-green-600 mt-1">${revenue}</div>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="font-semibold text-slate-900 mb-3">{t.dashboard.recent}</h2>
        {orders.length === 0 ? (
          <p className="text-slate-500 text-sm">{t.dashboard.empty}</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="py-3 flex justify-between text-sm">
                <div>
                  <div className="font-medium text-slate-900">{o.customerName}</div>
                  <div className="text-slate-500">{o.serviceTitle}</div>
                </div>
                <div className="text-slate-500">
                  {new Date(o.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US"
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
