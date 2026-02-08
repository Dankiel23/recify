import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/spotify";
import { parseTrackId } from "@/lib/parseSpotify";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("sp_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const trackInput = req.nextUrl.searchParams.get("seed");

  if (!trackInput) {
    return NextResponse.json(
      { error: "Missing 'seed' query parameter" },
      { status: 400 }
    );
  }

  const trackId = parseTrackId(trackInput);

  if (!trackId) {
    return NextResponse.json(
      { error: "Invalid Spotify track link or ID" },
      { status: 400 }
    );
  }

  try {
    const tracks = await getRecommendations(accessToken, trackId);
    return NextResponse.json({ tracks });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }
    console.error("Recommendations error:", err);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
