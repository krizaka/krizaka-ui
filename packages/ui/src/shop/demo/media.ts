// Demo photos of the two fictional shops (ADR-007 §6, ADR-006 §8: demo data only). Generated locally, no face, no text, no
// logo, in the style of the Krizaka banners; hosted on the CDN under `ui/shop/demo/` (hashed, immutable). Each is used at most
// once on a page: the salon has ten, the dog walker eight.
export const DEMO_PHOTOS = {
  "pets-ball": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-ball.e03f1ae74d.webp",
  "pets-canal": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-canal.4ea735fad7.webp",
  "pets-cover": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-cover.9f06b05e7d.webp",
  "pets-door": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-door.099a4143b4.webp",
  "pets-leash": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-leash.fbdb08ddad.webp",
  "pets-leaves": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-leaves.e7ce7dd035.webp",
  "pets-snow": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-snow.894afd7929.webp",
  "pets-stairs": "https://krizaka-assets.b-cdn.net/ui/shop/demo/pets-stairs.c218522480.webp",
  "salon-basin": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-basin.64dd59cac7.webp",
  "salon-brushes": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-brushes.235eebb9a1.webp",
  "salon-chair": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-chair.4cdd76afdf.webp",
  "salon-colour": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-colour.00c62a6aac.webp",
  "salon-cover": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-cover.218332751d.webp",
  "salon-mirror": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-mirror.9c2858ccd2.webp",
  "salon-shelf": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-shelf.d215d866d2.webp",
  "salon-station": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-station.91abe38059.webp",
  "salon-tools": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-tools.8ff845df44.webp",
  "salon-towels": "https://krizaka-assets.b-cdn.net/ui/shop/demo/salon-towels.8a49746a6b.webp",
} as const;
export type DemoPhoto = keyof typeof DEMO_PHOTOS;
