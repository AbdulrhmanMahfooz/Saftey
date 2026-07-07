export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export function str(v, { min = 0, max = 500, name = "field", allowEmpty = false } = {}) {
  if (v == null) {
    if (allowEmpty) return "";
    throw new ValidationError(`${name} is required`);
  }
  if (typeof v !== "string") throw new ValidationError(`${name} must be text`);
  const trimmed = v.trim();
  if (!allowEmpty && trimmed.length < Math.max(1, min)) {
    throw new ValidationError(`${name} is required`);
  }
  if (trimmed.length > max) {
    throw new ValidationError(`${name} must be ${max} characters or fewer`);
  }
  return trimmed;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function email(v, name = "Email") {
  const s = str(v, { name, max: 254 });
  if (!EMAIL_RE.test(s)) throw new ValidationError(`${name} is invalid`);
  return s.toLowerCase();
}

export function num(v, { min = -Infinity, max = Infinity, name = "field", integer = false } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  if (integer && !Number.isInteger(n)) throw new ValidationError(`${name} must be an integer`);
  if (n < min || n > max) throw new ValidationError(`${name} is out of range`);
  return n;
}

export function stringArray(v, { maxItems = 50, itemMax = 200, name = "list" } = {}) {
  if (v == null) return [];
  if (!Array.isArray(v)) throw new ValidationError(`${name} must be a list`);
  if (v.length > maxItems) throw new ValidationError(`${name} has too many items`);
  return v
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
    .map((s) => (s.length > itemMax ? s.slice(0, itemMax) : s));
}

export function oneOf(v, allowed, name = "field") {
  if (!allowed.includes(v)) throw new ValidationError(`${name} is invalid`);
  return v;
}
