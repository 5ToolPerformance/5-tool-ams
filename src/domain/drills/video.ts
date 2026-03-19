const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

export type ParsedYouTubeVideo = {
  videoProvider: "youtube";
  videoId: string;
  videoUrl: string;
};

function isValidVideoId(value: string) {
  return /^[a-zA-Z0-9_-]{11}$/.test(value);
}

export function parseYouTubeVideoUrl(rawUrl: string | null | undefined): ParsedYouTubeVideo | null {
  const trimmed = rawUrl?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Video URL must be a valid YouTube link");
  }

  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) {
    throw new Error("Video URL must be a valid YouTube link");
  }

  let videoId = "";

  if (host.includes("youtu.be")) {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } else if (url.pathname === "/watch") {
    videoId = url.searchParams.get("v") ?? "";
  } else if (url.pathname.startsWith("/embed/")) {
    videoId = url.pathname.split("/")[2] ?? "";
  } else if (url.pathname.startsWith("/shorts/")) {
    videoId = url.pathname.split("/")[2] ?? "";
  }

  if (!isValidVideoId(videoId)) {
    throw new Error("Video URL must be a valid YouTube link");
  }

  return {
    videoProvider: "youtube",
    videoId,
    videoUrl: trimmed,
  };
}

export function getYouTubeThumbnailUrl(videoId: string | null | undefined) {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string | null | undefined) {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}
