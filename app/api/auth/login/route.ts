import { NextResponse } from "next/server";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthorizeUrl,
} from "@/lib/spotify";
import { setVerifierCookie } from "@/lib/cookies";
import { DEMO_MODE } from "@/lib/demo";

export async function GET() {
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  // In demo mode, skip Spotify and go straight to callback with a fake code
  if (DEMO_MODE) {
    const res = NextResponse.redirect(
      `${appUrl}/api/auth/callback?code=demo_code&state=demo_state`
    );
    res.cookies.set("sp_oauth_state", "demo_state", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 300,
    });
    res.cookies.set("sp_code_verifier", "demo_verifier", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 300,
    });
    return res;
  }

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
