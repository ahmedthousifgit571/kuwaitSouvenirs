import Image from 'next/image';
import { RichText } from '@/components/ui';
import type { Photo as PhotoData } from '@/content/site';

/**
 * One of the shop's photos, filling its positioned parent. `pos` (or the photo's own) picks
 * which part survives the crop; a blurred copy shows while the full image loads.
 */
export default function Photo({ photo, sizes, pos, className = '' }: { photo: PhotoData; sizes: string; pos?: string; className?: string }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      placeholder="blur"
      draggable={false}
      className={`object-cover select-none ${className}`}
      style={{ objectPosition: pos ?? photo.pos ?? '50% 50%' }}
    />
  );
}

/** The white caption chip that sits on a photo, e.g. "Gahwa set". */
export function PhotoChip({ photo, className = '' }: { photo: PhotoData; className?: string }) {
  return (
    <span className={`rounded-full bg-white leading-none whitespace-nowrap text-red ${className}`}>
      <RichText value={photo.label} />
    </span>
  );
}
