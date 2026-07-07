import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getOrders } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import OrdersManager from "./OrdersManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ params }) {
  const { locale } = params;
  const token = cookies().get("admin_session")?.value;
  const authed = token ? await verifySession(token) : false;
  if (!authed) redirect(`/${locale}/admin/login`);

  const orders = await getOrders();
  const d = getDict(locale);
  return (
    <OrdersManager
      initialOrders={orders}
      locale={locale}
      t={d.admin.orders}
      status={d.admin.status}
    />
  );
}
