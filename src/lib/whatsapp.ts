import { brand } from '@/content/site';

/** Builds a wa.me link with a pre-filled message. */
export function waLink(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Message for a named gift pack or collection. */
export function waOrder(item: string) {
  return waLink(`Hello! I'd like to order the ${item} from Souvenir & More.`);
}
