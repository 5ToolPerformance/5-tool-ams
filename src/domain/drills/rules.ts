export function canCoachEditDrill(createdBy: string, userId: string) {
  return createdBy === userId;
}

export function isImageMime(mimeType: string) {
  return mimeType.startsWith("image/");
}

export function isVideoMime(mimeType: string) {
  return mimeType.startsWith("video/");
}
