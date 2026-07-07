export default function robots() {
  const site = process.env.SITE_URL || "http://localhost:3000";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/en/admin", "/ar/admin"] },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
