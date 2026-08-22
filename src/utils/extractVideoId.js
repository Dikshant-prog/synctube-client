/**
 * Robust helper utility to extract valid YouTube 11-character Video ID from input
 * Supports standard URLs, short URLs, Shorts, Embeds, Live, Music URLs, and raw Video IDs.
 * @param {string} input 
 * @returns {string|null}
 */
export function extractVideoId(input) {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();

  // Raw 11-character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // URL parsing approach
  try {
    let urlString = trimmed;
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'https://' + urlString;
    }

    const url = new URL(urlString);

    // 1. Standard watch URL (e.g., youtube.com/watch?v=VIDEO_ID)
    if (url.searchParams.has('v')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
    }

    // 2. Path-based URLs: youtu.be/VIDEO_ID, youtube.com/shorts/VIDEO_ID, /embed/VIDEO_ID, /v/VIDEO_ID, /live/VIDEO_ID
    const pathSegments = url.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(lastSegment)) {
        return lastSegment;
      }
    }
  } catch (e) {
    // Ignore URL parse error and fall back to regex
  }

  // Regex fallback matching all YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  return null;
}

export default extractVideoId;
