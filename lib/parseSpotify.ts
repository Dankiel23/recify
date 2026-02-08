import { z } from "zod";

const SPOTIFY_ID_RE = /^[A-Za-z0-9]{22}$/;

/**
 * Extract a Spotify track ID from various input formats:
 * - https://open.spotify.com/track/{id}?si=...
 * - spotify:track:{id}
 * - raw 22-char base-62 id
 */
export function parseTrackId(input: string): string | null {
  const trimmed = input.trim();

  // URL format
  const urlMatch = trimmed.match(
    /open\.spotify\.com\/track\/([A-Za-z0-9]{22})/
  );
  if (urlMatch) return urlMatch[1];

  // URI format
  const uriMatch = trimmed.match(/^spotify:track:([A-Za-z0-9]{22})$/);
  if (uriMatch) return uriMatch[1];

  // Raw ID
  if (SPOTIFY_ID_RE.test(trimmed)) return trimmed;

  return null;
}

export const trackInputSchema = z.object({
  trackId: z
    .string()
    .min(1, "Track input is required")
    .transform((val) => {
      const id = parseTrackId(val);
      if (!id) throw new Error("Invalid Spotify track link or ID");
      return id;
    }),
});
