"use client";

import { useState, useRef } from "react";

interface Track {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumArt: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
}

export default function DiscoverPage() {
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setTracks([]);
    setHasSearched(true);
    stopAudio();

    try {
      const res = await fetch(
        `/api/recommendations?seed=${encodeURIComponent(input.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired — redirect to login
          window.location.href = "/api/auth/login";
          return;
        }
        setError(data.error || "Something went wrong");
        return;
      }

      setTracks(data.tracks ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function togglePreview(track: Track) {
    if (!track.previewUrl) return;

    if (playingId === track.id) {
      stopAudio();
      return;
    }

    stopAudio();
    const audio = new Audio(track.previewUrl);
    audio.volume = 0.5;
    audio.play();
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(track.id);
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Recify</h1>
          <p className="text-zinc-400">
            Paste a Spotify track link to get recommendations
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://open.spotify.com/track/... or spotify:track:..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-black hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {tracks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-300">
              Recommended Tracks
            </h2>
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 rounded-lg bg-zinc-900 border border-zinc-800 p-3 hover:border-zinc-700 transition-colors"
                >
                  {/* Album art */}
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={track.albumName}
                      className="h-14 w-14 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.name}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      {track.artists.join(", ")}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {track.albumName}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {track.previewUrl && (
                      <button
                        onClick={() => togglePreview(track)}
                        className="rounded-full p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 transition-colors"
                        title={
                          playingId === track.id
                            ? "Stop preview"
                            : "Play preview"
                        }
                      >
                        {playingId === track.id ? (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    )}
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 transition-colors"
                      title="Open in Spotify"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.2071 14.2071L9.79289 12.7929L17.585 5H13V3H21Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {hasSearched && !loading && !error && tracks.length === 0 && (
          <p className="text-center text-zinc-500">
            No recommendations found. Try a different track.
          </p>
        )}
      </div>
    </main>
  );
}
