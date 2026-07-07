import { getDict } from "@/lib/i18n";
import LoginForm from "./LoginForm";

export function generateMetadata({ params }) {
  const t = getDict(params.locale);
  return { title: `${t.admin.login.title} — ${t.brand}` };
}

export default function LoginPage({ params }) {
  const { locale } = params;
  const t = getDict(locale).admin.login;
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{t.title}</h1>
        <p className="text-sm text-slate-500 mb-6">{t.subtitle}</p>
        <LoginForm locale={locale} t={t} />
      </div>
    </div>
  );
}
