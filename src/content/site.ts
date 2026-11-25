// Every word, price, link and media slot on the site lives here.
// Anything marked PLACEHOLDER is a stand-in until the owner confirms the real value.

import type { StaticImageData } from 'next/image';
import barcodeMugs from '../../public/media/photos/barcode-mugs.webp';
import chaiGlasses from '../../public/media/photos/chai-glasses.webp';
import crystalDhow from '../../public/media/photos/crystal-dhow.webp';
import dhowModel from '../../public/media/photos/dhow-model.webp';
import flagMug from '../../public/media/photos/flag-mug.webp';
import gahwaCups from '../../public/media/photos/gahwa-cups-case.webp';
import heritageCoin from '../../public/media/photos/heritage-coin.webp';
import kuwaitCap from '../../public/media/photos/kuwait-cap.webp';
import kuwaitCaps from '../../public/media/photos/kuwait-caps.webp';
import kuwaitTote from '../../public/media/photos/kuwait-tote.webp';
import kuwaitTowers from '../../public/media/photos/kuwait-towers.webp';
import shopCounter from '../../public/media/photos/shop-counter.webp';
import shopDisplay from '../../public/media/photos/shop-display.webp';
import skylineMugs from '../../public/media/photos/skyline-mugs.webp';
import skylineTee from '../../public/media/photos/skyline-tee.webp';
import towersTote from '../../public/media/photos/towers-tote.webp';

/** A run of text where `it: true` parts are set in the serif italic. */
export type Rich = { t: string; it?: boolean }[];

export type Photo = {
  src: StaticImageData;
  alt: string;
  /** Short caption for chips on the photo. */
  label: Rich;
  /** CSS object-position: which part of the photo to keep when it is cropped. */
  pos?: string;
};

type PhotoKey =
  | 'dhow' | 'gahwa' | 'chai' | 'coin' | 'cap' | 'shop' | 'towers'
  | 'crystal' | 'skylineMugs' | 'tee' | 'towersTote' | 'kuwaitTote' | 'counter' | 'flagMug' | 'barcodeMugs' | 'caps';

// The shop's own photos (originals in public/media/images and images2, web copies in public/media/photos).
// The images2 web copies are cropped clear of Instagram's overlay icons.
export const photos: Record<PhotoKey, Photo> = {
  dhow: { src: dhowModel, alt: 'Wooden model dhow with white sails and a Kuwait flag', label: [{ t: 'Model ' }, { t: 'dhow', it: true }], pos: '52% 50%' },
  gahwa: { src: gahwaCups, alt: 'Six white gahwa cups with a gold Kuwait crest in a brown leather travel case', label: [{ t: 'Gahwa ' }, { t: 'set', it: true }] },
  chai: { src: chaiGlasses, alt: 'Two tea glasses printed with the Kuwait skyline, one in gold and one in silver', label: [{ t: 'Chai ' }, { t: 'glasses', it: true }] },
  coin: { src: heritageCoin, alt: 'Gold-finish Kuwait one fils coin in a black satin gift box', label: [{ t: 'Heritage ' }, { t: 'coin', it: true }] },
  cap: { src: kuwaitCap, alt: 'Beige cap with a round black Kuwait map patch', label: [{ t: 'Kuwait ' }, { t: 'cap', it: true }], pos: '50% 45%' },
  shop: { src: shopDisplay, alt: 'The Souvenir & More stand: Kuwait magnets, mugs, keyrings and caps under the lit shop sign', label: [{ t: 'The ' }, { t: 'shop', it: true }], pos: '80% 30%' },
  towers: { src: kuwaitTowers, alt: 'Kuwait Towers on the seafront under a blue sky', label: [{ t: 'Kuwait ' }, { t: 'Towers', it: true }], pos: '50% 50%' },
  crystal: { src: crystalDhow, alt: 'A small crystal block with a dhow and the word Kuwait etched inside, held between two fingers', label: [{ t: 'Crystal ' }, { t: 'dhow', it: true }], pos: '50% 50%' },
  skylineMugs: { src: skylineMugs, alt: 'Two blue mugs with spoons, painted with the Kuwait skyline and the word Kuwait in English and Arabic', label: [{ t: 'Skyline ' }, { t: 'mugs', it: true }], pos: '55% 60%' },
  tee: { src: skylineTee, alt: 'White T-shirt printed with the Kuwait City skyline and the word Kuwait', label: [{ t: 'Skyline ' }, { t: 'tee', it: true }], pos: '50% 30%' },
  towersTote: { src: towersTote, alt: 'Black knitted tote bag with the Kuwait Towers and the word Kuwait in blue', label: [{ t: 'Towers ' }, { t: 'tote', it: true }], pos: '60% 60%' },
  kuwaitTote: { src: kuwaitTote, alt: 'Beige tote bag knitted all over with the word Kuwait, carried in a garden', label: [{ t: 'Kuwait ' }, { t: 'tote', it: true }], pos: '55% 75%' },
  counter: { src: shopCounter, alt: 'A Souvenir & More counter with Kuwait magnets, postcards, mugs and caps under the shop sign', label: [{ t: 'Shop ' }, { t: 'counter', it: true }], pos: '50% 55%' },
  flagMug: { src: flagMug, alt: 'White mugs printed with the Kuwait flag and the word Kuwait in English and Arabic', label: [{ t: 'Flag ' }, { t: 'mug', it: true }], pos: '55% 55%' },
  barcodeMugs: { src: barcodeMugs, alt: 'Two black mugs with a barcode Kuwait print, one in red and one in green', label: [{ t: 'Barcode ' }, { t: 'mugs', it: true }], pos: '50% 60%' },
  caps: { src: kuwaitCaps, alt: 'Four caps embroidered with Kuwait, in pink, magenta, blue and black', label: [{ t: 'Kuwait ' }, { t: 'caps', it: true }], pos: '50% 55%' },
};

export const brand = {
  name: 'Souvenir & More',
  // 512px copy of public/media/souvenirLogo.webp, used where the logo is animated.
  logo: '/media/souvenir-logo-512.webp',
  // The same stamp as white ink on black, used as a mask so it can take any colour (the O's in the wordmark).
  logoMask: '/media/souvenir-logo-mask.webp',
  tagline: 'Kuwait souvenirs & gifts', // from the shop's Instagram bio
  instagram: '@souvenir_more_kwt',
  instagramUrl: 'https://www.instagram.com/souvenir_more_kwt/',
  // Souk Mubarakiya shop, Abdulla Al Salem St (link from the Instagram bio)
  mapsUrl: 'https://maps.app.goo.gl/vface8dQqvdau3P68',
  whatsapp: '96500000000', // PLACEHOLDER: real WhatsApp number, digits only with country code
  timezone: 'Asia/Kuwait',
  timezoneLabel: 'GMT+3',
  status: 'Shipping worldwide',
};

export const nav = [
  { label: 'Craft', href: '#craft' },
  { label: 'Collections', href: '#collections' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Gift Packs', href: '#packs' },
  { label: 'Visit', href: '#visit' },
];

export const navOrder = { label: 'Order now', message: 'Hello! I would like to order a gift from Souvenir & More.' };

export const hero = {
  // Statement under the wordmark: plain lines, then the italic turn.
  lines: ['We craft keepsakes for', 'people who carry Kuwait'],
  italic: 'wherever they go',
  // PLACEHOLDER: drop a real reel at /public/media/reel.mp4 and set this to '/media/reel.mp4'.
  reelVideo: null as string | null,
};

export const loader = {
  cutLabel: 'Cut along line',
};

// Last scene of the hero reel: the shop photo beside where to find it (both from the Instagram bio).
export const shopVisit = {
  label: 'Souvenir & More',
  title: 'Visit the',
  italic: 'shop',
  places: ['Souk Mubarakiya', 'Al Asima Mall'],
  city: 'Kuwait City',
};

export const manifesto = {
  equation: ['Handmade', '+', 'Heritage', '+', 'Hospitality', '=', 'Kuwait'],
  left: [{ t: "A souvenir isn't a fridge magnet. " }, { t: "It's a piece of a place you can hold.", it: true }] as Rich,
  right: [{ t: "First, we find Kuwait's makers → " }, { t: 'then we wrap their craft for wherever home is now.', it: true }] as Rich,
  small: [
    { t: 'Mugs, totes, caps, crystal, coins, magnets, you name it. We pick, wrap and ship, so your gift never needs a second stop. ' },
    { t: 'One shop → the whole of Kuwait.', it: true },
  ] as Rich,
  // Cropped to 340 x 165; `pos` keeps the tower spheres in frame.
  image: { ...photos.towers, pos: '50% 50%' },
};

export const process = {
  a: 'A',
  b: 'B',
  note: [{ t: 'The road can get ' }, { t: 'bumpy', it: true }, { t: '. We keep your gift ' }, { t: 'rolling', it: true }, { t: ' regardless.' }] as Rich,
  pill: 'Our Process',
  steps: [
    {
      title: 'Sourcing',
      italic: '& Heritage',
      body: [{ t: 'We find the makers first: weavers, brass-smiths, carpenters. Where a piece comes from is half its story.' }] as Rich,
    },
    {
      title: 'Design',
      italic: '& Making',
      body: [{ t: 'Every piece is finished by hand and checked twice. Nothing generic, nothing mass-made.' }] as Rich,
    },
    {
      title: 'Gift',
      italic: 'Wrapping',
      body: [{ t: 'A box, a ribbon, a handwritten card. It arrives looking like you ' }, { t: 'planned it for weeks', it: true }, { t: '.' }] as Rich,
    },
    {
      title: 'Delivery',
      italic: '& Aftercare',
      body: [{ t: "Across Kuwait or across the world. If something isn't right, " }, { t: 'we make it right', it: true }, { t: '.' }] as Rich,
    },
  ],
};

// PLACEHOLDER: collection names and materials are read off the shop's photos; confirm the range with the owner.
// Keep each name + tags about as long as these, or the desktop list row gets crowded at 1024px.
export const collections = {
  title: 'Selected',
  italic: 'Collections',
  intro: [{ t: 'Pieces chosen with care, finished by hand, and wrapped the way ' }, { t: "you'd wrap them for family.", it: true }] as Rich,
  explore: 'Explore more',
  items: [
    { name: 'Dhow & Sea', tags: 'Wood, sailcloth, rope', photo: photos.dhow, tag: 'Model dhow' },
    { name: 'Gahwa & Chai', tags: 'Porcelain & glass', photo: photos.gahwa, tag: 'Gift case' },
    { name: 'Heritage Coins', tags: 'Gold finish, boxed', photo: photos.coin, tag: 'Boxed coin' },
    { name: 'Caps & Apparel', tags: 'Cotton, Kuwait patch', photo: photos.cap, tag: 'Kuwait cap' },
  ],
};

export type CollectionItem = (typeof collections.items)[number];

// Every product photo the shop has sent, for the Gallery section. Names and notes describe what is
// in each photo; nothing here is a claim the photos don't show. Order mixes categories and shapes.
export type GalleryCategory = 'mugs' | 'wear' | 'keep' | 'shop';

export const gallery = {
  pill: 'Gallery',
  title: 'Everything',
  italic: 'on our shelves',
  intro: [
    { t: 'Mugs, totes, caps, crystal and keepsakes, straight from the shop. ' },
    { t: 'Tap any piece to see it up close', it: true },
    { t: ', then ask us about it on WhatsApp.' },
  ] as Rich,
  pieces: 'pieces',
  all: 'All',
  hint: 'Tap to open',
  ask: 'Ask about this piece',
  // WhatsApp message from the big view; {name} and {code} are filled in.
  askMessage: 'Hello! I saw the {name} ({code}) in your gallery. Is it available?',
  close: 'Close',
  prev: 'Previous piece',
  next: 'Next piece',
  categories: [
    { id: 'mugs', label: 'Mugs & glasses' },
    { id: 'wear', label: 'Wear & carry' },
    { id: 'keep', label: 'Keepsakes' },
    { id: 'shop', label: 'The shop' },
  ] as { id: GalleryCategory; label: string }[],
  items: [
    { id: 'skyline-mugs', name: 'Skyline mugs', note: 'Painted skyline, spoon in the handle', cat: 'mugs', photo: photos.skylineMugs },
    { id: 'towers-tote', name: 'Towers tote', note: 'Knitted, Kuwait Towers in blue', cat: 'wear', photo: photos.towersTote },
    { id: 'crystal-dhow', name: 'Crystal dhow', note: 'Dhow etched inside a crystal block', cat: 'keep', photo: photos.crystal },
    { id: 'counter', name: 'Shop counter', note: 'Magnets, postcards, mugs and caps', cat: 'shop', photo: photos.counter },
    { id: 'kuwait-caps', name: 'Kuwait caps', note: 'Embroidered, in four colours', cat: 'wear', photo: photos.caps },
    { id: 'gahwa-set', name: 'Gahwa set', note: 'Six cups in a leather case', cat: 'mugs', photo: photos.gahwa },
    { id: 'skyline-tee', name: 'Skyline tee', note: 'Kuwait City skyline print', cat: 'wear', photo: photos.tee },
    { id: 'model-dhow', name: 'Model dhow', note: 'Wooden hull, white sails', cat: 'keep', photo: photos.dhow },
    { id: 'flag-mug', name: 'Flag mug', note: 'Kuwait flag, English and Arabic', cat: 'mugs', photo: photos.flagMug },
    { id: 'kuwait-tote', name: 'Kuwait tote', note: 'Knitted all over with Kuwait', cat: 'wear', photo: photos.kuwaitTote },
    { id: 'heritage-coin', name: 'Heritage coin', note: 'Gold finish, in a gift box', cat: 'keep', photo: photos.coin },
    { id: 'barcode-mugs', name: 'Barcode mugs', note: 'Black, in red or green', cat: 'mugs', photo: photos.barcodeMugs },
    { id: 'the-shop', name: 'The shop', note: 'Magnets, mugs and keyrings', cat: 'shop', photo: photos.shop },
    { id: 'kuwait-cap', name: 'Kuwait cap', note: 'Beige, with a map patch', cat: 'wear', photo: photos.cap },
    { id: 'chai-glasses', name: 'Chai glasses', note: 'Skyline print, gold and silver', cat: 'mugs', photo: photos.chai },
  ] as { id: string; name: string; note: string; cat: GalleryCategory; photo: Photo }[],
};

export type GalleryItem = (typeof gallery.items)[number];

// PLACEHOLDER: pack names, prices and the exact mix until the owner confirms them. The contents are
// now built from products seen in the shop's own photos (magnets and postcards from the counter shot).
export const packs = [
  {
    name: 'Mini Gift',
    abbr: 'MNI',
    code: 'SM/PKG.01-M1',
    price: 'KWD 5.000',
    intro: [{ t: 'A small, sharp hello from Kuwait, ' }, { t: 'easy to pack', it: true }, { t: ' and ' }, { t: 'easy to love', it: true }, { t: '.' }] as Rich,
    bullets: [[{ t: 'Kuwait magnet ' }, { t: '+ postcard', it: true }], [{ t: 'Gift box + ribbon' }], [{ t: 'Handwritten card' }]] as Rich[],
    footer: 'Small box, big welcome',
    back: 'Handle with care',
  },
  {
    name: 'Diwaniya Box',
    abbr: 'DIW',
    code: 'SM/PKG.02-D1',
    price: 'KWD 15.000',
    intro: [{ t: 'For the host, the office, the family visit. ' }, { t: 'Gahwa, chai and something to keep.', it: true }] as Rich,
    bullets: [[{ t: 'Gahwa cup set ' }, { t: '+ case', it: true }], [{ t: 'Skyline chai glasses' }], [{ t: 'Kuwait mug + spoon' }]] as Rich[],
    footer: 'Wrapped by hand, every time',
    back: 'Wrapped in Kuwait',
  },
  {
    name: 'Grand Heritage',
    abbr: 'GRH',
    code: 'SM/PKG.03-G1',
    price: 'KWD 35.000',
    intro: [{ t: 'The whole story in one box. Built for ' }, { t: 'big moments', it: true }, { t: ' and ' }, { t: 'bigger thank-yous', it: true }, { t: '.' }] as Rich,
    bullets: [[{ t: 'Wooden dhow model' }], [{ t: 'Crystal dhow ' }, { t: 'keepsake', it: true }], [{ t: 'Heritage coin, boxed' }]] as Rich[],
    footer: 'Keep in plain sight of guests',
    back: 'Store in plain sight',
  },
];

export const packsSection = {
  focus: { plain: ['We keep our', 'focus on'], italic: 'what matters' },
  pill: 'Our packs',
  order: 'Order on WhatsApp',
  priceLabel: 'Price starts at:',
  tear: 'Tear along line',
  note: [
    { t: 'Every pack, wrapped with care. ', it: true },
    { t: 'Whatever you choose, each piece is checked by hand, packed to travel and sent with a handwritten card.' },
  ] as Rich,
};

// The retro desktop the packs shrink into.
export const desktop = {
  // PLACEHOLDER art: generated sky-over-dunes wallpaper; swap for a photo of Kuwait if you like.
  wallpaper: '/media/wallpaper-dunes.webp',
  packsFile: 'Packs.html',
  faqFile: 'FAQ.md',
  reviewsFolder: 'Reviews',
};

// SAMPLE reviews: not real customers. Replace with real, permitted reviews before launch,
// or set `sample: false` only once they are real.
export const reviews = {
  sample: true,
  items: [
    { file: 'Noura.png', name: 'Noura A.', persona: 'hijab' as const, quote: [{ t: 'Sent the Diwaniya Box to my aunt in London. ' }, { t: 'She called me crying.', it: true }, { t: ' The wrapping alone is a gift.' }] as Rich },
    { file: 'Faisal.png', name: 'Faisal M.', persona: 'ghutra' as const, quote: [{ t: 'Forty boxes for a conference, all ' }, { t: 'on time and perfect', it: true }, { t: '. Our guests still mention them.' }] as Rich },
    { file: 'Sarah.png', name: 'Sarah L.', persona: 'short' as const, quote: [{ t: 'Leaving Kuwait after six years. ' }, { t: 'This dhow is the one thing', it: true }, { t: ' I packed in my hand luggage.' }] as Rich },
  ],
};

export const contact = {
  pill: 'Contact',
  title: 'Ready to send',
  italic: 'a piece of Kuwait?',
  body: [
    { t: "Tell us who it's for and we'll do the rest. We wrap every gift like it's for " },
    { t: 'our own family', it: true },
    { t: ', and the advice is ' },
    { t: 'free', it: true },
    { t: '.' },
  ] as Rich,
  cta: 'Order now',
  ctaTouch: 'Drag me',
  message: 'Hello! I would like to order a gift from Souvenir & More.',
};

// The location section, laid out as the address side of a postcard. Address, phone, rating and
// coordinates are from the shop's Google Maps listing (checked 2026-11-25).
const shopQuery = 'SOUVENIR AND MORE, Abdulla Al Salem St, Kuwait City 14000';

export const visit = {
  pill: 'Visit us',
  title: 'Come find us',
  italic: 'in the old souk',
  intro: [
    { t: 'Our shop is on Abdulla Al Salem St in Souk Al-Mubarakiya, a two-minute walk from Safat Square. ' },
    { t: 'Postcards, magnets and everything in between.', it: true },
  ] as Rich,
  code: 'SM/LOC.01',
  card: 'Post card',
  to: 'To',
  address: ['Souvenir & More', 'Abdulla Al Salem St', 'Souk Al-Mubarakiya', 'Kuwait City 14000'],
  addressAr: 'شارع عبدالله السالم، مدينة الكويت 14000',
  geo: { lat: 29.3726108, lng: 47.9730637, label: '29.3726° N · 47.9731° E' },
  phone: { label: '+965 6666 4609', href: 'tel:+96566664609' },
  // PLACEHOLDER: the listing only showed "Opens 4:30 PM" on the day it was checked; confirm the weekly hours.
  hours: 'Evenings from 4:30 PM',
  rating: { score: '5.0', count: 7, source: 'Google' },
  alsoAt: { label: 'Al Asima Mall', href: 'https://www.google.com/maps/search/?api=1&query=Al+Asima+Mall+Kuwait+City' },
  directions: { label: 'Get directions', href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shopQuery)}` },
  call: 'Call the shop',
  openMap: 'Open in Google Maps',
  openMapShort: 'Open in Maps', // phones
  postmark: { ring: 'KUWAIT CITY • SOUVENIR & MORE • ', centre: '14000', sub: 'KWT' },
  stamp: { country: 'KUWAIT', value: '100' },
  // Street map drawn from OpenStreetMap data (ODbL), centred on the shop: 1400 x 1100 m, so 1 unit = 1 m.
  // Label anchors are % of the map; `wide` ones sit near the edges and only show from md up.
  map: {
    src: '/media/map-souk.svg',
    alt: 'Street map of central Kuwait City with Souvenir & More marked between Souk Al-Mubarakiya and Safat Square',
    width: 1400,
    height: 1100,
    credit: '© OpenStreetMap contributors',
    creditUrl: 'https://www.openstreetmap.org/copyright',
    scale: 100, // metres shown by the scale bar
    streets: [
      { name: 'Abdullah Al-Salem St', x: 41.4, y: 36.6, angle: 77.5 },
      { name: 'Ali Al-Salem St', x: 29.1, y: 36.9, angle: -76.8 },
      { name: 'Fahad Al-Salem St', x: 43.6, y: 70.6, angle: -31.3 },
      { name: 'Ahmed Al-Jaber St', x: 73.5, y: 30.4, angle: -68.2, wide: true },
      { name: 'Abdulla Al-Mubarak St', x: 80.5, y: 65.3, angle: 39.2, wide: true },
    ],
    places: [
      // Over the souk's lanes, north-east of the node, so the pin never covers it.
      { name: 'Souk Al-Mubarakiya', x: 57, y: 30 },
      { name: 'Safat Square', x: 52.7, y: 61.7 },
      { name: 'Gold Market', x: 43.8, y: 14.6, wide: false },
    ],
  },
};

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/souvenir_more_kwt/' },
  { label: 'WhatsApp', href: 'whatsapp' },
  { label: 'Google Maps', href: 'https://maps.app.goo.gl/vface8dQqvdau3P68' },
];

export const footer = {
  links: [
    { label: 'Craft', href: '#craft' },
    { label: 'Collections', href: '#collections' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Gift Packs', href: '#packs' },
    { label: 'Visit the shop', href: '#visit' },
    { label: 'Back to top', href: '#top' },
  ],
  copyright: '© 2026 Souvenir & More',
};

// PLACEHOLDER answers: confirm shipping, payment and returns policy with the owner.
export const faq = [
  { q: 'Do you ship outside Kuwait?', a: 'Yes. We ship across the GCC and worldwide. Cost and delivery time depend on the destination, and we confirm both on WhatsApp before you pay.' },
  { q: 'How long does delivery take?', a: 'Inside Kuwait, usually within a couple of days. Abroad it depends on the courier and customs; you get an estimate before you order.' },
  { q: 'Can you add a name or a message?', a: 'Yes. Most pieces can carry a name, a date or a short message, engraved or printed. Ask us what fits your piece.' },
  { q: 'Do you take corporate and bulk orders?', a: 'Yes: diwaniya gifts, conference giveaways, welcome boxes for new teams. Send the quantity and the date and we will put a proposal together.' },
  { q: 'What about customs?', a: 'Souvenirs travel well, but some countries have rules on wood, food or perfume. We tell you if anything in your pack needs declaring.' },
  { q: 'How do I pay?', a: 'Order on WhatsApp and we send a payment link. Cash on delivery is available inside Kuwait.' },
  { q: 'What if something arrives damaged?', a: 'Send us a photo within 48 hours and we will replace it. No long forms, no back and forth.' },
];
