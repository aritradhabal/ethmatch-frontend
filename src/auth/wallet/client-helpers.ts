/**
 * Generates an HMAC-SHA256 hash of the provided nonce using a secret key from the environment.
 * Edge-safe implementation using Web Crypto API.
 * @param {Object} params - The parameters object.
 * @param {string} params.nonce - The nonce to be hashed.
 * @returns {Promise<string>} The resulting HMAC hash in hexadecimal format.
 */
export const hashNonce = async ({
  nonce,
}: {
  nonce: string;
}): Promise<string> => {
  const secret = process.env.HMAC_SECRET_KEY!;
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(nonce));
  const bytes = new Uint8Array(signature);

  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
};
