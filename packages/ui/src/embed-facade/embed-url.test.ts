import { embedUrl, isOwnPoster } from "./embed-url";

describe("embedUrl (krizaka-ui#605)", () => {
  it.each([
    ["tiktok", "https://www.tiktok.com/@cedre.ciseaux/video/7301234567890123456", "https://www.tiktok.com/embed/v2/7301234567890123456"],
    ["tiktok", "https://tiktok.com/@a/video/12345678/", "https://www.tiktok.com/embed/v2/12345678"],
    ["youtube-shorts", "https://www.youtube.com/shorts/abcDEF_-123", "https://www.youtube-nocookie.com/embed/abcDEF_-123"],
    ["youtube-shorts", "https://youtu.be/abcDEF_-123", "https://www.youtube-nocookie.com/embed/abcDEF_-123"],
    ["instagram", "https://www.instagram.com/reel/C1abcDEF123/", "https://www.instagram.com/reel/C1abcDEF123/embed"],
    ["instagram", "https://www.instagram.com/reels/C1abcDEF123/", "https://www.instagram.com/reel/C1abcDEF123/embed"],
    ["instagram", "https://instagram.com/maelle.cedre/p/C1abcDEF123", "https://www.instagram.com/p/C1abcDEF123/embed"],
  ] as const)("%s %s -> the platform's frame", (platform, url, frame) => {
    expect(embedUrl(platform, url)).toBe(frame);
  });

  it.each([
    ["tiktok", "http://www.tiktok.com/@a/video/12345678"],
    ["tiktok", "https://vm.tiktok.com/ZMabc123/"],
    ["tiktok", "https://www.tiktok.com.evil.example/@a/video/12345678"],
    ["tiktok", "https://evil.example/www.tiktok.com/@a/video/12345678"],
    ["tiktok", "https://user:pw@www.tiktok.com/@a/video/12345678"],
    ["tiktok", "https://www.tiktok.com:8443/@a/video/12345678"],
    ["tiktok", "https://www.tiktok.com/@a"],
    ["tiktok", "https://www.tiktok.com/@a/video/12345678/../../x"],
    ["youtube-shorts", "https://www.youtube.com/watch?v=abcDEF_-123"],
    ["youtube-shorts", "https://www.youtube.com/shorts/short"],
    ["youtube-shorts", "https://youtu.be.evil.example/abcDEF_-123"],
    ["instagram", "https://www.instagram.com/maelle.cedre/"],
    ["instagram", "https://www.instagram.com/p/x/"],
    ["instagram", "javascript:alert(1)"],
    ["instagram", "not a url"],
  ] as const)("%s %s -> refused", (platform, url) => {
    expect(embedUrl(platform, url)).toBeNull();
  });

  it("does not take a TikTok address for a YouTube one", () => {
    expect(embedUrl("youtube-shorts", "https://www.tiktok.com/@a/video/12345678")).toBeNull();
    expect(embedUrl("tiktok", "https://www.youtube.com/shorts/abcDEF_-123")).toBeNull();
  });
});

describe("isOwnPoster", () => {
  it("accepts a picture from the host's own storage and refuses one on a platform's domain, or off https", () => {
    expect(isOwnPoster("https://krizaka-assets.b-cdn.net/site/poster.webp")).toBe(true);
    expect(isOwnPoster("https://i.ytimg.com/vi/abc/hq720.jpg")).toBe(false);
    expect(isOwnPoster("https://p16-sign.tiktokcdn.com/x.jpeg")).toBe(false);
    expect(isOwnPoster("https://scontent.cdninstagram.com/x.jpg")).toBe(false);
    expect(isOwnPoster("https://scontent-yyz1-1.xx.fbcdn.net/x.jpg")).toBe(false);
    expect(isOwnPoster("http://example.com/x.jpg")).toBe(false);
    expect(isOwnPoster("/relative.jpg")).toBe(true);
    expect(isOwnPoster("//i.ytimg.com/x.jpg")).toBe(false);
    expect(isOwnPoster("data:image/webp;base64,AAAA")).toBe(true);
    expect(isOwnPoster("data:text/html,<script>1</script>")).toBe(false);
  });
});
