/**
 * Google Drive "share" links (drive.google.com/file/d/ID/view, ?id=ID, etc.)
 * are viewer pages, not direct image bytes, so they don't render as <img src>.
 * Convert them to a direct-loading URL. Only works for files shared as
 * "Anyone with the link".
 */
export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!/drive\.google\.com/.test(trimmed)) return trimmed;

  const fileIdMatch =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);

  if (!fileIdMatch) return trimmed;

  return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
}
