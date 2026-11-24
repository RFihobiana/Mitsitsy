export const KDF_ITERATIONS = 600_000;

export interface Vault {
  v: 1;
  iter: number;
  salt: string;
  iv: string;
  data: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Web Crypto needs HTTPS or localhost. */
export const cryptoSupported = () =>
  typeof crypto !== "undefined" && !!crypto.subtle;

export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function fromBase64(text: string) {
  return Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
}

export const randomBytes = (n: number) =>
  crypto.getRandomValues(new Uint8Array(n));

/** Non-extractable AES-GCM key derived from the passphrase (PBKDF2-SHA256). */
export async function deriveKey(
  passphrase: string,
  salt: BufferSource,
  iterations: number,
) {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase.normalize("NFKC")),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** A fresh random IV on every write. */
export async function encryptJson(
  key: CryptoKey,
  salt: string,
  iterations: number,
  value: unknown,
): Promise<Vault> {
  const iv = randomBytes(12);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(value)),
  );
  return {
    v: 1,
    iter: iterations,
    salt,
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(cipher)),
  };
}

/** Throws if the key is wrong or the data was modified (GCM authentication). */
export async function decryptJson(
  key: CryptoKey,
  vault: Vault,
): Promise<unknown> {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(vault.iv) },
    key,
    fromBase64(vault.data),
  );
  return JSON.parse(decoder.decode(plain));
}

export function isVault(x: unknown): x is Vault {
  const v = x as Vault;
  return (
    !!v &&
    v.v === 1 &&
    typeof v.iter === "number" &&
    v.iter >= 100_000 &&
    v.iter <= 2_000_000 &&
    typeof v.salt === "string" &&
    typeof v.iv === "string" &&
    typeof v.data === "string"
  );
}
