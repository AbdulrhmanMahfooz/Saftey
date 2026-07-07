import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServiceById, updateService, deleteService } from "@/lib/data";
import { verifySession } from "@/lib/auth";
import { str, num, stringArray, ValidationError } from "@/lib/validate";

export async function GET(_req, { params }) {
  const svc = await getServiceById(params.id);
  if (!svc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(svc);
}

async function requireAdmin() {
  const token = cookies().get("admin_session")?.value;
  return verifySession(token);
}

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  try {
    const patch = {};
    if (body.title !== undefined) patch.title = str(body.title, { name: "Title", max: 200 });
    if (body.description !== undefined)
      patch.description = str(body.description, { name: "Description", max: 4000 });
    if (body.price !== undefined)
      patch.price = num(body.price, { min: 0, max: 1_000_000, name: "Price" });
    if (body.duration !== undefined)
      patch.duration = str(body.duration, { name: "Duration", max: 100, allowEmpty: true });
    if (body.features !== undefined)
      patch.features = stringArray(body.features, {
        name: "Features",
        maxItems: 30,
        itemMax: 200,
      });
    const updated = await updateService(params.id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }
}

export async function DELETE(_req, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ok = await deleteService(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
