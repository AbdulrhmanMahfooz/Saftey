import Link from "next/link";
import { getServices } from "@/lib/data";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }) {
  const { locale } = params;
  const t = getDict(locale);
  const services = await getServices();
  const featured = services.slice(0, 3);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t.home.heroTitle}</h1>
          <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
            {t.home.heroSubtitle}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href={`/${locale}/services`}
              className="btn bg-white text-brand-700 hover:bg-brand-50"
            >
              {t.home.browse}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="btn border border-white text-white hover:bg-white/10"
            >
              {t.home.contactUs}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t.home.featuredTitle}</h2>
            <p className="text-slate-600">{t.home.featuredSubtitle}</p>
          </div>
          <Link
            href={`/${locale}/services`}
            className="text-brand-700 font-medium hover:underline"
          >
            {t.home.viewAll} →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-slate-500">{t.home.empty}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s.id}
                href={`/${locale}/services/${s.id}`}
                className="card hover:shadow-md transition block"
              >
                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-slate-600 text-sm line-clamp-3">{s.description}</p>
                <p className="mt-4 text-brand-700 font-bold">${s.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <div className="text-3xl font-bold text-brand-700">100+</div>
            <p className="text-slate-600 mt-1">{t.home.statClients}</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-700">5★</div>
            <p className="text-slate-600 mt-1">{t.home.statRating}</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-700">24h</div>
            <p className="text-slate-600 mt-1">{t.home.statResponse}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
