import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getServices } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import ServicesManager from "./ServicesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage({ params }) {
  const { locale } = params;
  const token = cookies().get("admin_session")?.value;
  const authed = token ? await verifySession(token) : false;
  if (!authed) redirect(`/${locale}/admin/login`);

  const services = await getServices();
  const t = getDict(locale).admin.services;
  return <ServicesManager initialServices={services} t={t} />;
}
