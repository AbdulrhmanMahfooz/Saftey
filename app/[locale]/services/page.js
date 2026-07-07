import Link from "next/link";
import { getServices } from "@/lib/data";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }) {
  const t = getDict(params.locale);
  return {
    title: t.services.title,
    description: t.services.subtitle,
    alternates: {
      canonical: `/${params.locale}/services`,
      languages: { en: "/en/services", ar: "/ar/services" },
    },
  };
}

export default async function ServicesPage({ params }) {
  const { locale } = params;
  const t = getDict(locale);
  const services = await getServices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.services.title}</h1>
      <p className="text-slate-600 mb-8">{t.services.subtitle}</p>

      {services.length === 0 ? (
        <div className="card text-center text-slate-500">{t.services.empty}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/${locale}/services/${s.id}`}
              className="card hover:shadow-md transition block"
            >
              <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-slate-600 text-sm line-clamp-3">{s.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-brand-700 font-bold">${s.price}</span>
                <span className="text-xs text-slate-500">{s.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
