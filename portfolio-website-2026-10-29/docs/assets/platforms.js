function detectPlatform(value = "") {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be" ? parts[0] : url.searchParams.get("v") || (["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : "");
      if (!id || !/^[\w-]{11}$/.test(id)) return null;
      return { name: "YouTube", embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
    }
    if (["vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = host === "player.vimeo.com" ? parts[1] : parts.find((p) => /^\d+$/.test(p));
      if (!id || !/^\d+$/.test(id)) return null;
      const hash = url.searchParams.get("h") || parts[parts.indexOf(id) + 1];
      return { name: "Vimeo", embed: `https://player.vimeo.com/video/${id}${hash && /^[a-zA-Z0-9]+$/.test(hash) ? `?h=${hash}` : ""}`, thumbnail: "" };
    }
  } catch {
  }
  return null;
}
function safeUrl(value = "") {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}
export {
  detectPlatform,
  safeUrl
};
