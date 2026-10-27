// Server-safe, data only. Two fictional shops — a salon and a dog walker — resolved the way a product resolves them (ADR-007
// §6): the services with their OWN photo or none, photos that appear once, the next free times. Used by the examples, the
// stories, the catalogue tests and the composer's thumbnails. Never a real shop, price or person.
import type { ShopPhoto } from "../frame";
import type { ShopGalleryPhoto } from "../gallery/gallery";
import type { ShopService } from "../services/services";
import { DEMO_PHOTOS, type DemoPhoto } from "./media";

export { DEMO_PHOTOS, type DemoPhoto } from "./media";

/** A demo photo with its words. */
export const demoPhoto = (name: DemoPhoto, alt: string): ShopPhoto => ({ src: DEMO_PHOTOS[name], alt });

export type DemoShop = {
  id: "salon" | "pets";
  name: string;
  eyebrow: string;
  promise: string;
  /** The preset the shop wears. */
  preset: string;
  cover: ShopPhoto & { phone?: string };
  services: ShopService[];
  /** The gallery: none of them is a cover or a service's photo. */
  photos: ShopGalleryPhoto[];
  times: { id: string; label: string; href: string }[];
  hours: { id: string; label: string; hours: string }[];
  status: { open: boolean; label: string; detail: string };
  team: { id: string; name: string }[];
  address: string;
  phone: string;
};

const week = (hours: string, closed = "Closed") =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({ id: String(i + 1), label, hours: i === 6 ? closed : hours }));

export const demoSalon: DemoShop = {
  id: "salon",
  name: "Salon Cèdre & Ciseaux",
  eyebrow: "Saint-Henri · Montréal",
  promise: "A neighbourhood salon on Notre-Dame West: cuts, colour and beard care, with the person of your choice.",
  preset: "salon-vitrine",
  cover: demoPhoto("salon-cover", "The salon's window on a winter evening, warm light on the brick street"),
  services: [
    { id: "short", name: "Short cut", price: "$45", duration: "30 min", description: "Scissor or clipper, razor finish", category: "cuts", href: "#book-short" },
    { id: "blow", name: "Cut and blow-dry", price: "$75", duration: "1 h", description: "A tailored cut, a blow-dry that lasts", category: "cuts", popular: true, photo: demoPhoto("salon-chair", "The leather chair by the window"), href: "#book-blow" },
    { id: "beard", name: "Beard trim", price: "$25", duration: "20 min", description: "Edges and a hot towel", category: "beard", photo: demoPhoto("salon-towels", "Rolled warm towels on a shelf"), href: "#book-beard" },
    { id: "colour", name: "Full colour", price: "$160", priceFrom: "from", duration: "2 h 30", description: "Price confirmed at the consultation", category: "colour", photo: demoPhoto("salon-colour", "Two copper bowls of colour on marble"), href: "#book-colour" },
    { id: "balayage", name: "Balayage", price: "$220", priceFrom: "from", duration: "3 h", description: "Gradual lightening, natural result", category: "colour", photo: demoPhoto("salon-shelf", "Amber bottles on the window shelf"), href: "#book-balayage" },
  ],
  photos: [
    { id: "mirror", photo: demoPhoto("salon-mirror", "A round mirror with fairy lights on a brick wall") },
    { id: "basin", photo: demoPhoto("salon-basin", "A basin under a pendant lamp") },
    { id: "brushes", photo: demoPhoto("salon-brushes", "Brushes and a dryer on a wooden counter") },
    { id: "station", photo: demoPhoto("salon-station", "A styling station facing the rainy street") },
    { id: "tools", photo: demoPhoto("salon-tools", "Scissors and a comb under a brass lamp") },
  ],
  times: [
    { id: "t1", label: "Today 4:30 pm", href: "#t1" },
    { id: "t2", label: "Today 6:00 pm", href: "#t2" },
    { id: "t3", label: "Tue 9:00 am", href: "#t3" },
    { id: "t4", label: "Tue 10:30 am", href: "#t4" },
  ],
  hours: week("9 am – 8 pm"),
  status: { open: true, label: "Open now", detail: "until 8 pm" },
  team: [{ id: "e", name: "Éric" }, { id: "k", name: "Karim" }, { id: "j", name: "Jade" }, { id: "c", name: "Camille" }],
  address: "2400 Notre-Dame St W",
  phone: "514-555-0110",
};

export const demoPets: DemoShop = {
  id: "pets",
  name: "Pattes de Saint-Henri",
  eyebrow: "Saint-Henri · Montréal",
  promise: "Neighbourhood dog walks along the canal, with a photo and a note after each one.",
  preset: "pets-canal",
  cover: demoPhoto("pets-cover", "A golden dog facing the Lachine canal at sunset"),
  services: [
    { id: "walk30", name: "Quick walk", price: "$22", duration: "30 min", capacity: "1 dog", description: "A loop of the block and a drink of water", category: "walks", href: "#book-walk30" },
    { id: "walk60", name: "Canal walk", price: "$35", duration: "1 h", capacity: "Up to 2 dogs", description: "The canal path, a photo and a note", category: "walks", popular: true, photo: demoPhoto("pets-leash", "Leashes hanging by a red-brick doorway"), href: "#book-walk60" },
    { id: "pack", name: "Pack adventure", price: "$48", duration: "2 h", capacity: "Up to 5 dogs", description: "The Mont-Royal trails, small friendly group", category: "walks", href: "#book-pack" },
    { id: "visit", name: "Home visit", price: "$18", duration: "20 min", capacity: "1 pet", description: "Food, water, a cuddle and a report", category: "care", photo: demoPhoto("pets-door", "A terrier waiting at a red door"), href: "#book-visit" },
  ],
  photos: [
    { id: "ball", photo: demoPhoto("pets-ball", "A dog leaping for a ball in the autumn park") },
    { id: "canal", photo: demoPhoto("pets-canal", "Two dogs resting on the grass by the canal") },
    { id: "leaves", photo: demoPhoto("pets-leaves", "A small dog running through fallen leaves") },
    { id: "snow", photo: demoPhoto("pets-snow", "A dog in a red coat on a snowy street at night") },
    { id: "stairs", photo: demoPhoto("pets-stairs", "A dog sitting on an outdoor staircase") },
  ],
  times: [
    { id: "t1", label: "Today 5:00 pm", href: "#t1" },
    { id: "t2", label: "Tomorrow 8:00 am", href: "#t2" },
    { id: "t3", label: "Tomorrow 12:30 pm", href: "#t3" },
  ],
  hours: week("7 am – 7 pm", "By request"),
  status: { open: true, label: "Open now", detail: "until 7 pm" },
  team: [{ id: "m", name: "Maude" }, { id: "s", name: "Samuel" }],
  address: "Saint-Henri, Montréal",
  phone: "514-555-0142",
};

// The rest of the demo salon's page (U2): what clients say, its news, its questions, its rules, its story, its reels, its map.
export const demoReviews = {
  summary: {
    score: 4.7,
    count: 38,
    distribution: [0, 1, 2, 7, 28] as [number, number, number, number, number],
    scoreText: "4.7 / 5",
    countText: "38 verified reviews",
    summaryText: "4.7 out of 5 from 38 verified reviews",
    starText: (stars: number, count: number) => `${stars} stars: ${count} reviews`,
  },
  reviews: [
    { id: "r1", author: "Nadia F.", date: "October 2026", dateTime: "2026-10", service: "Cut and blow-dry", rating: 5, ratingText: "5 out of 5", text: "The best blow-dry in the neighbourhood, simply. Booked in two taps." },
    { id: "r2", author: "Léo P.", date: "October 2026", dateTime: "2026-10", service: "Balayage", rating: 5, ratingText: "5 out of 5", text: "Jade listened, never pushed. The price was the one announced." },
    { id: "r3", author: "Camille L.", date: "September 2026", dateTime: "2026-09", service: "Beard trim", rating: 4, ratingText: "4 out of 5", text: "Quick, precise, and the hot towel is a treat." },
  ],
};

export const demoReel = { id: "reel", platform: "tiktok" as const, url: "https://www.tiktok.com/@salon.cedre/video/7123456789012345678", title: "The salon's latest reel" };

export const demoFlyers = [
  { id: "f1", text: "New: hot-towel beard care, every day this week.", signature: "Jade", until: "2026-11-10" },
  { id: "f2", text: "Closed Monday November 3 — back Tuesday at 9.", signature: "Éric", until: "2026-11-03" },
  { id: "f3", text: "Gift cards at the counter, any amount.", signature: "Camille" },
];

export const demoFaq = [
  { id: "q1", question: "Do I need to book?", answer: "Booking is the surest way to have the person you want. We also take walk-ins when a chair is free." },
  { id: "q2", question: "Can I cancel?", answer: "Free up to 24 hours before. After that the first half of the service is kept." },
  { id: "q3", question: "Do you do kids' cuts?", answer: "Yes, from age 4, with Éric on Saturday mornings." },
];

export const demoPolicies = [
  { id: "p1", term: "Cancellation", details: "Free up to 24 hours before" },
  { id: "p2", term: "Prices", details: "Before taxes; colour is confirmed at the consultation" },
  { id: "p3", term: "Booking window", details: "Up to 60 days ahead" },
];

export const demoStory = {
  quote: "Cuts that last, and advice that is honest.",
  body: "Three friends opened the salon in 2019 on the corner where the old bakery stood. We kept the brick, the big windows and the habit of asking before cutting.",
  owner: { name: "Jade" },
};

export const demoMap = { label: "Where the salon is", center: [-73.5859, 45.4789] as [number, number], zoom: 15, showLabel: "Show the map", places: [{ position: [-73.5859, 45.4789] as [number, number], label: "Salon Cèdre & Ciseaux" }] };
