import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = 1;
const DEFAULT_TTL_SECONDS = 5 * 60;

export type InternalApiTokenPayload = {
  v: typeof TOKEN_VERSION;
  iss: string;
  aud: string;
  sub: string;
  email?: string | null;
  iat: number;
  exp: number;
};

export type CreateInternalApiTokenInput = {
  secret: string;
  issuer: string;
  audience: string;
  userId: string;
  email?: string | null;
  ttlSeconds?: number;
  now?: Date;
};

export type VerifyInternalApiTokenInput = {
  token: string;
  secret: string;
  expectedIssuer: string;
  expectedAudience: string;
  now?: Date;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payloadSegment: string, secret: string) {
  return createHmac("sha256", secret).update(payloadSegment).digest("base64url");
}

function assertUsableSecret(secret: string) {
  if (secret.length < 32) {
    throw new Error("Internal API auth secret must be at least 32 characters");
  }
}

function parsePayload(payloadSegment: string): InternalApiTokenPayload | null {
  try {
    const payload = JSON.parse(base64UrlDecode(payloadSegment)) as Partial<InternalApiTokenPayload>;

    if (
      payload.v !== TOKEN_VERSION ||
      typeof payload.iss !== "string" ||
      typeof payload.aud !== "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    return {
      v: TOKEN_VERSION,
      iss: payload.iss,
      aud: payload.aud,
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : null,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual, "base64url");
  const expectedBuffer = Buffer.from(expected, "base64url");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function createInternalApiToken({
  secret,
  issuer,
  audience,
  userId,
  email = null,
  ttlSeconds = DEFAULT_TTL_SECONDS,
  now = new Date(),
}: CreateInternalApiTokenInput) {
  assertUsableSecret(secret);

  if (!userId) {
    throw new Error("Internal API token requires a userId");
  }

  const issuedAt = Math.floor(now.getTime() / 1000);
  const payload: InternalApiTokenPayload = {
    v: TOKEN_VERSION,
    iss: issuer,
    aud: audience,
    sub: userId,
    email,
    iat: issuedAt,
    exp: issuedAt + ttlSeconds,
  };

  const payloadSegment = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadSegment, secret);

  return `${payloadSegment}.${signature}`;
}

export function verifyInternalApiToken({
  token,
  secret,
  expectedIssuer,
  expectedAudience,
  now = new Date(),
}: VerifyInternalApiTokenInput): InternalApiTokenPayload | null {
  assertUsableSecret(secret);

  const [payloadSegment, signature, extra] = token.split(".");
  if (!payloadSegment || !signature || extra != null) {
    return null;
  }

  const expectedSignature = signPayload(payloadSegment, secret);
  if (!signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  const payload = parsePayload(payloadSegment);
  if (!payload) {
    return null;
  }

  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (
    payload.iss !== expectedIssuer ||
    payload.aud !== expectedAudience ||
    payload.exp < nowSeconds ||
    payload.iat > nowSeconds + 60
  ) {
    return null;
  }

  return payload;
}
