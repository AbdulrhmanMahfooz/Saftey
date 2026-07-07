import { NextResponse } from "next/server";

const LOCALES = ["en", "ar"];
const DEFAULT_LOCALE = "en";

function pickLocale(request) {
  const accept = request.headers.get("accept-language") || "";
  const first = accept.split(",")[0]?.toLowerCase() || "";
  if (first.startsWith("ar")) return "ar";
  return DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
