import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/data";
import { getDict, isRtl } from "@/lib/i18n";
import OrderForm from "./OrderForm";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { locale, id } = params;
  const service = await getServiceById(id);
  if (!service) return { title: "Not found" };
  const t = getDict(locale);
  const description = service.description.slice(0, 160);
  return {
    title: service.title,
    description,
    alternates: {
      canonical: `/${locale}/services/${id}`,
      languages: {
        en: `/en/services/${id}`,
        ar: `/ar/services/${id}`,
      },
    },
    openGraph: {
      title: `${service.title} · ${t.brand}`,
      description,
      url: `${SITE_URL}/${locale}/services/${id}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { locale, id } = params;
  const t = getDict(locale);
  const service = await getServiceById(id);
  if (!service) notFound();
  const rtl = isRtl(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@type": "Organization", name: t.brand },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${locale}/services/${service.id}`,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href={`/${locale}/services`} className="text-brand-700 text-sm hover:underline">
        {rtl ? "→" : "←"} {t.detail.back}
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold text-slate-900">{service.title}</h1>
          <p className="mt-2 text-slate-600">{service.description}</p>

          <div className="mt-6 flex gap-6 text-sm">
            <div>
              <div className="text-slate-500">{t.detail.price}</div>
              <div className="text-xl font-bold text-brand-700">${service.price}</div>
            </div>
            <div>
              <div className="text-slate-500">{t.detail.duration}</div>
              <div className="text-xl font-semibold text-slate-900">{service.duration}</div>
            </div>
          </div>

          {service.features?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-slate-900 mb-3">{t.detail.included}</h2>
              <ul className="space-y-2 text-slate-700">
                {service.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-brand-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-4">{t.detail.requestTitle}</h2>
            <OrderForm
              serviceId={service.id}
              serviceTitle={service.title}
              t={t.form}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
