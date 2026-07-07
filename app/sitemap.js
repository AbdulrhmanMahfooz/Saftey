import { getServices } from "@/lib/data";
import { LOCALES } from "@/lib/i18n";

export default async function sitemap() {
  const site = process.env.SITE_URL || "http://localhost:3000";
  const services = await getServices();
  const now = new Date();

  const staticPaths = ["", "/services", "/contact", "/privacy", "/terms"];
  const staticEntries = LOCALES.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: `${site}/${locale}${p}`,
      lastModified: now,
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.7,
    }))
  );

  const serviceEntries = LOCALES.flatMap((locale) =>
    services.map((s) => ({
      url: `${site}/${locale}/services/${s.id}`,
      lastModified: s.createdAt ? new Date(s.createdAt) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...serviceEntries];
}
