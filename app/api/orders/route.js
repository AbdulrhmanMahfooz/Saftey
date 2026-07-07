import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrders, createOrder } from "@/lib/data";
import { verifySession } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { str, email, ValidationError } from "@/lib/validate";

export async function GET() {
  const token = cookies().get("admin_session")?.value;
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`orders:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const clean = {
      serviceId: body.serviceId ? str(body.serviceId, { name: "Service", max: 100 }) : null,
      serviceTitle: str(body.serviceTitle || "General inquiry", {
        name: "Service title",
        max: 200,
      }),
      customerName: str(body.customerName, { name: "Name", max: 200 }),
      customerEmail: email(body.customerEmail),
      customerPhone: str(body.customerPhone, {
        name: "Phone",
        max: 40,
        allowEmpty: true,
      }),
      notes: str(body.notes, { name: "Notes", max: 4000, allowEmpty: true }),
    };
    const created = await createOrder(clean);
    return NextResponse.json(
      { id: created.id, ok: true },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }
}
