import { getDict } from "@/lib/i18n";
import ContactForm from "./ContactForm";

export function generateMetadata({ params }) {
  const t = getDict(params.locale);
  return { title: `${t.contact.title} — ${t.brand}` };
}

export default function ContactPage({ params }) {
  const t = getDict(params.locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.contact.title}</h1>
      <p className="text-slate-600 mb-8">{t.contact.subtitle}</p>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card">
          <ContactForm t={t.form} />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-slate-900">{t.contact.emailLabel}</h2>
            <p className="text-slate-600">hello@saftey.example</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{t.contact.phoneLabel}</h2>
            <p className="text-slate-600">+000 000 0000</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{t.contact.hoursLabel}</h2>
            <p className="text-slate-600">{t.contact.hoursValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
