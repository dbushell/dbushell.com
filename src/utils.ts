import { crypto, type DigestAlgorithm } from "@std/crypto";
import { encodeBase64, encodeHex } from "@std/encoding";

/** Non-cryptographic hash as hexadecimal */
export const encodeHash = (value: string): Promise<string> =>
  crypto.subtle
    .digest("FNV32A", new TextEncoder().encode(value))
    .then(encodeHex);

/** Cryptographic hash */
export const encodeCrypto = async (
  value: string,
  algorithm?: DigestAlgorithm,
): Promise<Uint8Array> =>
  new Uint8Array(
    await crypto.subtle.digest(
      algorithm ?? "SHA-256",
      new TextEncoder().encode(value),
    ),
  );

/** Cryptographic hash as base64 */
export const encodeCryptoBase64 = async (
  value: string,
  algorithm?: DigestAlgorithm,
): Promise<string> => encodeBase64(await encodeCrypto(value, algorithm));
