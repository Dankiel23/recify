import { NextResponse } from "next/server";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthorizeUrl,
} from "@/lib/spotify";
import { setVerifierCookie } from "@/lib/cookies";

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Random state for CSRF protection
  const state = crypto.randomUUID();

  const authorizeUrl = buildAuthorizeUrl(codeChallenge, state);

  const res = NextResponse.redirect(authorizeUrl);

  // Store code verifier in HTTP-only cookie so callback can read it
  setVerifierCookie(res, codeVerifier);

  // Also store state for validation on callback
  res.cookies.set("sp_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  return res;
}
