import Photo from '@/components/Photo';
import type { CollectionItem } from '@/content/site';

/** A collection's picture: the shop's photo with an SM/COL code sticker in the top-right corner. */
export default function CollectionPhoto({ item, index, sizes }: { item: CollectionItem; index: number; sizes: string }) {
  return (
    <div className="@container-[size] relative h-full w-full overflow-hidden bg-[#eceae6]">
      <Photo photo={item.photo} sizes={sizes} />
      {/* Top right: clear on every photo and away from the Explore badge. Inset far enough to
          survive the 1.2x zoom the phone slider rests at (it crops 10% off each edge). */}
      <div className="label absolute top-[max(16px,13cqh)] right-[max(16px,13cqw)] rotate-[4deg] rounded-[max(6px,0.8cqw)] bg-white px-[max(12px,2cqw)] py-[max(9px,1.3cqw)] text-[max(11px,1.5cqw)] leading-[1.25] text-red shadow-[0_1cqw_2cqw_rgba(0,0,0,0.15)]">
        SM/COL.{String(index + 1).padStart(2, '0')}
        <br />
        {item.tag}
      </div>
    </div>
  );
}
