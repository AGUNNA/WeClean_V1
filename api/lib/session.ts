import * as jose from "jose";
import * as cookie from "cookie";
import { env } from "./env";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { findUserByUnionId } from "../queries/users";

const JWT_ALG = "HS256";

export type SessionPayload = {
  /** Stable per-account identifier stored on users.unionId. */
  unionId: string;
};

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const { unionId } = payload;
    if (!unionId || typeof unionId !== "string") return null;
    return { unionId };
  } catch (error) {
    console.warn("[session] verification failed:", error);
    return null;
  }
}

/** Read the session cookie, verify it, and resolve the current user. */
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    throw Errors.forbidden("Not authenticated.");
  }
  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Invalid session.");
  }
  const user = await findUserByUnionId(claim.unionId);
  if (!user) {
    throw Errors.forbidden("Account not found. Please sign in again.");
  }
  return user;
}
