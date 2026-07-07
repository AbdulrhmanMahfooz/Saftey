import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkCredentials, issueSession, SESSION_COOKIE } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`login:${ip}`, { limit: 5, windowMs: 5 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": "300" } }
    );
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { username, password } = body || {};
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username ||
    !password
  ) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  const ok = await checkCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  const token = issueSession();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  return NextResponse.json({ ok: true });
}
