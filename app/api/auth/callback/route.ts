import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/spotify";
import { setTokenCookie, clearVerifierCookie } from "@/lib/cookies";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(
      `${appUrl}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}?error=missing_code`);
  }

  // Validate state
  const storedState = req.cookies.get("sp_oauth_state")?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}?error=state_mismatch`);
  }

  // Get code verifier from cookie
  const codeVerifier = req.cookies.get("sp_code_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(`${appUrl}?error=missing_verifier`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier);

    const res = NextResponse.redirect(`${appUrl}/discover`);

    // Store access token in secure HTTP-only cookie
    setTokenCookie(res, tokens.access_token, tokens.expires_in);

    // Clean up temporary cookies
    clearVerifierCookie(res);
    res.cookies.delete("sp_oauth_state");

    return res;
  } catch (err) {
    console.error("Token exchange error:", err);
    return NextResponse.redirect(`${appUrl}?error=token_exchange_failed`);
  }
}
