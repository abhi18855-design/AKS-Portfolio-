/** Accept only known YouTube hosts and exact video IDs; never interpolate raw URLs. */
export function youtubeId(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(embed|shorts|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : null;
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
