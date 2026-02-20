import "server-only";

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 120_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${ITERATIONS}.${salt}.${hash}`;
}

export function verifyPassword(password: string, storedValue: string): boolean {
  const [iterationsText, salt, storedHash] = storedValue.split(".");

  if (!iterationsText || !salt || !storedHash) {
    return false;
  }

  const iterations = Number(iterationsText);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const computedHash = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString("hex");

  try {
    return timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}
