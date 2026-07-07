import "../globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { LOCALES, getDict, isRtl } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata({ params }) {
  const { locale } = params;
  const t = getDict(locale);
  const title = `${t.brand} — ${t.home.heroTitle}`;
  const description = t.home.heroSubtitle;
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `/${l}`]));
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${t.brand}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: t.brand,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  if (!LOCALES.includes(locale)) notFound();
  const t = getDict(locale);
  const rtl = isRtl(locale);

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <body className="min-h-screen flex flex-col bg-slate-50">
        <SkipLink label={t.a11y.skip} />
        <Nav locale={locale} t={t} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
