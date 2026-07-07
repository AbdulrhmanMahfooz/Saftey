import crypto from "crypto";

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_PASS_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "change-me-to-a-long-random-string";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

function scryptHash(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      KEY_LEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (err, derived) => (err ? reject(err) : resolve(derived))
    );
  });
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scryptHash(password, salt);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function verifyHash(password, stored) {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hashHex] = parts;
  const derived = await scryptHash(password, salt);
  const stored_ = Buffer.from(hashHex, "hex");
  if (derived.length !== stored_.length) return false;
  return crypto.timingSafeEqual(derived, stored_);
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function checkCredentials(username, password) {
  if (!safeEqual(username, ADMIN_USER)) return false;
  if (ADMIN_PASS_HASH) return verifyHash(password, ADMIN_PASS_HASH);
  return safeEqual(password, ADMIN_PASS);
}

export function issueSession() {
  const payload = { u: ADMIN_USER, t: Date.now() };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export async function verifySession(token) {
  if (!token || typeof token !== "string") return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const ageMs = Date.now() - payload.t;
    return ageMs >= 0 && ageMs < 1000 * 60 * 60 * 24 * 7;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = "admin_session";
