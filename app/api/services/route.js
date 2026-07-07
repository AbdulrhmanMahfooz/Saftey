import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServices, createService } from "@/lib/data";
import { verifySession } from "@/lib/auth";
import { str, num, stringArray, ValidationError } from "@/lib/validate";

export async function GET() {
  const services = await getServices();
  return NextResponse.json(services);
}

export async function POST(request) {
  const token = cookies().get("admin_session")?.value;
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  try {
    const clean = {
      title: str(body.title, { name: "Title", max: 200 }),
      description: str(body.description, { name: "Description", max: 4000 }),
      price: num(body.price, { min: 0, max: 1_000_000, name: "Price" }),
      duration: str(body.duration, { name: "Duration", max: 100, allowEmpty: true }),
      features: stringArray(body.features, { name: "Features", maxItems: 30, itemMax: 200 }),
    };
    const created = await createService(clean);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }
}
