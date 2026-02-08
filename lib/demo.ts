import type { SpotifyTrack } from "./spotify";

export const DEMO_MODE = process.env.DEMO_MODE === "true";

const MOCK_TRACKS: SpotifyTrack[] = [
  {
    id: "3n3Ppam7vgaVa1iaRUc9Lp",
    name: "Mr. Brightside",
    artists: ["The Killers"],
    albumName: "Hot Fuss",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739c284a6855784a83ffbd4e52",
    spotifyUrl: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
    previewUrl: null,
  },
  {
    id: "5HCyWlXZPP0y6Gqq8TgA20",
    name: "Take Me Out",
    artists: ["Franz Ferdinand"],
    albumName: "Franz Ferdinand",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273f2d2adaa21ad616df6241e7d",
    spotifyUrl: "https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20",
    previewUrl: null,
  },
  {
    id: "2tpWsVSb9UEmDRxAl1zhX1",
    name: "Somebody Told Me",
    artists: ["The Killers"],
    albumName: "Hot Fuss",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739c284a6855784a83ffbd4e52",
    spotifyUrl: "https://open.spotify.com/track/2tpWsVSb9UEmDRxAl1zhX1",
    previewUrl: null,
  },
  {
    id: "0oks4FnzhNp5QPTywXhHHY",
    name: "Reptilia",
    artists: ["The Strokes"],
    albumName: "Room on Fire",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273e14f11f796cef9f9a82691a7",
    spotifyUrl: "https://open.spotify.com/track/0oks4FnzhNp5QPTywXhHHY",
    previewUrl: null,
  },
  {
    id: "3MODES4TNtygekLl146Dxd",
    name: "Feel Good Inc.",
    artists: ["Gorillaz"],
    albumName: "Demon Days",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2730289agoce6ff2eee33bfc00c",
    spotifyUrl: "https://open.spotify.com/track/3MODES4TNtygekLl146Dxd",
    previewUrl: null,
  },
  {
    id: "2H7PHVdQ3mXqEHXcvclTB0",
    name: "Fluorescent Adolescent",
    artists: ["Arctic Monkeys"],
    albumName: "Favourite Worst Nightmare",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163",
    spotifyUrl: "https://open.spotify.com/track/2H7PHVdQ3mXqEHXcvclTB0",
    previewUrl: null,
  },
  {
    id: "3YRCqOhFifThpSRFJ1VWFM",
    name: "Seven Nation Army",
    artists: ["The White Stripes"],
    albumName: "Elephant",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273c1dfd30e8b1849cf31fd2a29",
    spotifyUrl: "https://open.spotify.com/track/3YRCqOhFifThpSRFJ1VWFM",
    previewUrl: null,
  },
  {
    id: "5W3cjX2J3tjhG8zb6u0qHn",
    name: "Lonely Boy",
    artists: ["The Black Keys"],
    albumName: "El Camino",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27351340e576a4503643cc3bbb3",
    spotifyUrl: "https://open.spotify.com/track/5W3cjX2J3tjhG8zb6u0qHn",
    previewUrl: null,
  },
  {
    id: "20I6sIOMTCkB6w7ryavxtO",
    name: "Naive",
    artists: ["The Kooks"],
    albumName: "Inside In / Inside Out",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273dbb3dd82da45b7d7f31b1b42",
    spotifyUrl: "https://open.spotify.com/track/20I6sIOMTCkB6w7ryavxtO",
    previewUrl: null,
  },
  {
    id: "0WqIKmW4BTrj3eJFmnCKMv",
    name: "Banquet",
    artists: ["Bloc Party"],
    albumName: "Silent Alarm",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2735efbb2779e6a5b0f52tried7",
    spotifyUrl: "https://open.spotify.com/track/0WqIKmW4BTrj3eJFmnCKMv",
    previewUrl: null,
  },
  {
    id: "6b8Be6ljOzmkOmFslEb23P",
    name: "1901",
    artists: ["Phoenix"],
    albumName: "Wolfgang Amadeus Phoenix",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2737a4c8c59851c88f6794c3cbf",
    spotifyUrl: "https://open.spotify.com/track/6b8Be6ljOzmkOmFslEb23P",
    previewUrl: null,
  },
  {
    id: "1mea3bSkSGXuIRvnWJo9UY",
    name: "No One Knows",
    artists: ["Queens of the Stone Age"],
    albumName: "Songs for the Deaf",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273581c3debc6bc3236bb00c7d7",
    spotifyUrl: "https://open.spotify.com/track/1mea3bSkSGXuIRvnWJo9UY",
    previewUrl: null,
  },
];

export function getMockRecommendations(): SpotifyTrack[] {
  // Shuffle and return to simulate varied results
  const shuffled = [...MOCK_TRACKS].sort(() => Math.random() - 0.5);
  return shuffled;
}
