import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateOrder, deleteOrder } from "@/lib/data";
import { verifySession } from "@/lib/auth";
import { oneOf, ValidationError } from "@/lib/validate";

const STATUSES = ["new", "in_progress", "completed", "cancelled"];

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
    if (body.status !== undefined) patch.status = oneOf(body.status, STATUSES, "Status");
    const updated = await updateOrder(params.id, patch);
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
  const ok = await deleteOrder(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
