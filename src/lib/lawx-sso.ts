import crypto from "crypto";

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Gera token SSO para o LawX no formato:
 * base64url(payload) + '.' + base64url(HMAC-SHA256(base64url(payload), secret))
 * Payload: { email, exp } com exp em segundos (Unix).
 */
export function signLawxSSOToken(email: string, secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + 120; // válido por 2 minutos
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    exp,
  });
  const payloadB64 = base64UrlEncode(Buffer.from(payload, "utf8"));
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest();
  const sigB64 = base64UrlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}
