export const homeMessage = "Frontend demo · explore the layout.";

export const profile: {
  discord_status: "offline";
  discord_user: { avatar: string | null };
  spotify: { song: string; artist: string; albumArt: string | null } | null;
} = {
  discord_status: "offline",
  discord_user: { avatar: null },
  spotify: null,
};

export const tracks = [
  { name: "Night drive", artist: "Demo artist", image: null, url: null, nowPlaying: false, date: null },
  { name: "Underwater", artist: "Demo artist", image: null, url: null, nowPlaying: false, date: null },
];

export const projects = [
  {
    id: "avatar-demo", name: "Avatar study",
    description: "A sample avatar project. Replace this entry with your own work.",
    image: "/preview.webp", extraPhotos: [], tags: ["avatar", "unity"],
    clientUrl: null, clientLabel: null, audio: null, songName: null,
  },
  {
    id: "web-demo", name: "Personal website",
    description: "An atmospheric portfolio with a game-inspired menu.",
    image: "/preview.webp", extraPhotos: [], tags: ["web", "nextjs"],
    clientUrl: "https://example.com", clientLabel: "Example website", audio: null, songName: null,
  },
];

export const guestMessages = [
  {
    id: "welcome", name: "Visitor", website: null,
    message: "Hello! This is a local guestbook demo.",
    timestamp: "2026-01-01T12:00:00.000Z", likes: 0, liked: false,
  },
];

export const posts = [
  {
    id: "layout-notes", slug: "layout-notes", title: "Notes on this layout",
    excerpt: "A small starting point for a personal corner of the web.",
    coverImage: "/preview.webp",
    publishedAt: new Date("2026-01-01T12:00:00.000Z"),
    updatedAt: new Date("2026-01-01T12:00:00.000Z"),
    content: `# A place to begin

This is example content for the public frontend.

## Make it yours

Edit the components, styles and sample data to build your own layout.`,
  },
];

export const cases = [
  {
    id: "example", url: "https://example.com", tag: "unspecified", status: "documented",
    notes: "A fictional entry to preview this archive layout.",
    screenshot: "/preview.webp", originalScreenshot: "/preview.webp",
    detected: "2026-01-01", createdAt: "2026-01-01T12:00:00.000Z",
  },
];
