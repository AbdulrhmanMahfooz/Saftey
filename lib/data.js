import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJsonAtomic(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

const locks = new Map();
async function withLock(file, fn) {
  const prev = locks.get(file) || Promise.resolve();
  let release;
  const next = new Promise((r) => (release = r));
  locks.set(file, prev.then(() => next));
  try {
    await prev;
    return await fn();
  } finally {
    release();
    if (locks.get(file) === next) locks.delete(file);
  }
}

function id() {
  return crypto.randomBytes(8).toString("hex");
}

async function mutateFile(file, fallback, mutator) {
  return withLock(file, async () => {
    const current = await readJson(file, fallback);
    const result = await mutator(current);
    if (result && result.next !== undefined) {
      await writeJsonAtomic(file, result.next);
      return result.value;
    }
    await writeJsonAtomic(file, result);
    return result;
  });
}

export async function getServices() {
  return readJson(SERVICES_FILE, []);
}

export async function getServiceById(sid) {
  const all = await getServices();
  return all.find((s) => s.id === sid) || null;
}

export async function createService(input) {
  return mutateFile(SERVICES_FILE, [], (all) => {
    const record = {
      id: id(),
      title: input.title,
      description: input.description,
      price: Number(input.price) || 0,
      duration: input.duration || "",
      features: Array.isArray(input.features) ? input.features : [],
      createdAt: new Date().toISOString(),
    };
    return { next: [record, ...all], value: record };
  });
}

export async function updateService(sid, patch) {
  return mutateFile(SERVICES_FILE, [], (all) => {
    const idx = all.findIndex((s) => s.id === sid);
    if (idx === -1) return { next: all, value: null };
    const merged = {
      ...all[idx],
      ...patch,
      price:
        patch.price !== undefined ? Number(patch.price) || 0 : all[idx].price,
      features: Array.isArray(patch.features) ? patch.features : all[idx].features,
    };
    const next = [...all];
    next[idx] = merged;
    return { next, value: merged };
  });
}

export async function deleteService(sid) {
  return mutateFile(SERVICES_FILE, [], (all) => {
    const next = all.filter((s) => s.id !== sid);
    return { next, value: next.length !== all.length };
  });
}

export async function getOrders() {
  return readJson(ORDERS_FILE, []);
}

export async function createOrder(input) {
  const service = input.serviceId ? await getServiceById(input.serviceId) : null;
  return mutateFile(ORDERS_FILE, [], (orders) => {
    const record = {
      id: id(),
      serviceId: input.serviceId || null,
      serviceTitle: input.serviceTitle || service?.title || "General inquiry",
      price: service?.price || 0,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone || "",
      notes: input.notes || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };
    return { next: [record, ...orders], value: record };
  });
}

export async function updateOrder(oid, patch) {
  return mutateFile(ORDERS_FILE, [], (orders) => {
    const idx = orders.findIndex((o) => o.id === oid);
    if (idx === -1) return { next: orders, value: null };
    const merged = { ...orders[idx], ...patch };
    const next = [...orders];
    next[idx] = merged;
    return { next, value: merged };
  });
}

export async function deleteOrder(oid) {
  return mutateFile(ORDERS_FILE, [], (orders) => {
    const next = orders.filter((o) => o.id !== oid);
    return { next, value: next.length !== orders.length };
  });
}
