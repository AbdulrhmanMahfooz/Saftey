import { getDict } from "@/lib/i18n";

export function generateMetadata({ params }) {
  const t = getDict(params.locale);
  return {
    title: t.legal.privacyTitle,
    alternates: {
      canonical: `/${params.locale}/privacy`,
      languages: { en: "/en/privacy", ar: "/ar/privacy" },
    },
  };
}

export default function PrivacyPage({ params }) {
  const t = getDict(params.locale).legal;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{t.privacyTitle}</h1>
      <p className="text-slate-500 text-sm mb-6">
        {t.lastUpdated}: {new Date().toISOString().slice(0, 10)}
      </p>
      <p className="text-slate-700 leading-7">{t.privacyBody}</p>
    </div>
  );
}
