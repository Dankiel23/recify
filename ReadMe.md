# Recify — Spotify Recommendations

Paste a Spotify track link and discover similar music.

## Setup

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Set **Redirect URI** to `http://localhost:3000/api/auth/callback`
4. Note your **Client ID** and **Client Secret**

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```
SPOTIFY_CLIENT_ID=<your client id>
SPOTIFY_CLIENT_SECRET=<your client secret>
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
APP_URL=http://localhost:3000
COOKIE_SECRET=<any random 32+ char string>
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Manual Test Checklist

- [ ] Visit `/` — see login page
- [ ] Click "Login with Spotify" — redirected to Spotify, then back to `/discover`
- [ ] Paste a Spotify track URL (e.g. `https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8`)
- [ ] Click "Get Recommendations" — see 20 recommended tracks with album art
- [ ] Click "Open in Spotify" — opens track in new tab
- [ ] Click play button on tracks with previews — audio plays
- [ ] Paste invalid input — see error message
- [ ] After token expires (~1hr) — redirected to re-login

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Spotify Web API with OAuth PKCE
- Zod for input validation
