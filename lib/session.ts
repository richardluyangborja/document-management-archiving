import "server-only";

import "dotenv/config";

import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./session-types";
import { cookies } from "next/headers";
import { SESSION_COOKIE_KEY } from "./session-constants";
import { Role } from "./generated/prisma/enums";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session?: string) {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log(`Failed to verify session: ${error}`);
  }
}

export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_KEY, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_KEY);
}
