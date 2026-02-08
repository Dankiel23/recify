import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  path: "/",
};

// ---- helpers for route handlers (set on NextResponse) ----

export function setTokenCookie(res: NextResponse, accessToken: string, maxAge: number) {
  res.cookies.set("sp_access_token", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge,
  });
}

export function setVerifierCookie(res: NextResponse, verifier: string) {
  res.cookies.set("sp_code_verifier", verifier, {
    ...COOKIE_OPTIONS,
    maxAge: 300, // 5 min — only needed during auth flow
  });
}

export function clearVerifierCookie(res: NextResponse) {
  res.cookies.delete("sp_code_verifier");
}

// ---- helpers for reading cookies (server components / route handlers) ----

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("sp_access_token")?.value;
}

export async function getCodeVerifier(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("sp_code_verifier")?.value;
}
