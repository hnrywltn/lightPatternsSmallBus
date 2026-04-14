import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET!);
const COOKIE = "lp_client_session";
const EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days in seconds

export async function signClientToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${EXPIRES_IN}s`)
    .setIssuedAt()
    .sign(secret);
}

export async function verifyClientToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub: string; email: string };
}

export async function setClientSession(userId: string, email: string) {
  const token = await signClientToken(userId, email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EXPIRES_IN,
    path: "/",
  });
}

export async function getClientSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyClientToken(token);
  } catch {
    return null;
  }
}

export async function clearClientSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
