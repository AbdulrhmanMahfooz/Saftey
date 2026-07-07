#!/usr/bin/env node
import crypto from "node:crypto";
import readline from "node:readline";

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

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scryptHash(password, salt);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

function promptSilent(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    rl._writeToOutput = () => {};
    rl.question("", (ans) => {
      rl.close();
      process.stdout.write("\n");
      resolve(ans);
    });
  });
}

const argPassword = process.argv[2];
const password = argPassword || (await promptSilent("Enter new admin password: "));

if (!password || password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const hash = await hashPassword(password);
console.log("\nAdd this to your .env.local (or production env):\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
console.log("Then remove ADMIN_PASSWORD from your env — the hash takes precedence.\n");
