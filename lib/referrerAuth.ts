import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET!);
const COOKIE = "lp_referrer_session";
const EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days

export async function signReferrerToken(referrerId: string, email: string): Promise<string> {
  return new SignJWT({ sub: referrerId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${EXPIRES_IN}s`)
    .setIssuedAt()
    .sign(secret);
}

export async function verifyReferrerToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub: string; email: string };
}

export async function setReferrerSession(referrerId: string, email: string) {
  const token = await signReferrerToken(referrerId, email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EXPIRES_IN,
    path: "/",
  });
}

export async function getReferrerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyReferrerToken(token);
  } catch {
    return null;
  }
}

export async function clearReferrerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
