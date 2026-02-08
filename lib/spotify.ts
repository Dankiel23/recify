// ---- PKCE helpers ----

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ---- Spotify auth URLs ----

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

export function buildAuthorizeUrl(codeChallenge: string, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: "user-read-private",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

// ---- Token exchange ----

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    code_verifier: codeVerifier,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  return res.json();
}

// ---- Spotify API calls ----

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumArt: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
}

export async function getRecommendations(
  accessToken: string,
  seedTrackId: string,
  limit = 20
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    seed_tracks: seedTrackId,
    limit: String(limit),
  });

  const res = await fetch(`${API_BASE}/recommendations?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API error: ${res.status} ${text}`);
  }

  const data = await res.json();

  return (data.tracks ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (t: any): SpotifyTrack => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a: { name: string }) => a.name),
      albumName: t.album?.name ?? "",
      albumArt: t.album?.images?.[0]?.url ?? null,
      spotifyUrl: t.external_urls?.spotify ?? "",
      previewUrl: t.preview_url ?? null,
    })
  );
}
