import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart-controls";
import {
  createOrderLink,
  formatPrice,
  sizeLabels,
  slugifyMenuItem,
  type MenuGroup,
  type MenuItem,
} from "@/lib/menu-data";

function PriceCell({
  value,
  itemName,
  slug,
  groupName,
  size,
  sizeNote,
  className,
}: {
  value?: number;
  itemName: string;
  slug: string;
  groupName: string;
  size: string;
  sizeNote: string;
  className?: string;
}) {
  if (!value) {
    return <span className={cn("text-right text-sm text-[#c2b3a5]", className)}>—</span>;
  }

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <a
        href={createOrderLink(itemName, size)}
        target="_blank"
        rel="noreferrer"
        className="text-right text-sm font-semibold text-[#c9674b] transition-colors hover:underline"
      >
        {formatPrice(value)}
      </a>
      <AddToCartButton
        slug={slug}
        name={itemName}
        groupName={groupName}
        sizeLabel={size}
        sizeNote={sizeNote}
        price={value}
        label="+"
        className="px-3 py-1.5 text-xs"
      />
    </div>
  );
}

function MenuRow({ item, group }: { item: MenuItem; group: MenuGroup }) {
  return (
    <li className="py-4">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-start gap-x-4">
        <div>
          <p className="text-sm font-semibold text-[#30251f]">{item.name}</p>
          {item.note ? <p className="mt-1 text-xs text-[#a27b68]">{item.note}</p> : null}
        </div>
        <PriceCell
          value={item.regular}
          itemName={item.name}
          slug={slugifyMenuItem(item.name)}
          groupName={group.name}
          size={sizeLabels.regular}
          sizeNote="Reguler"
          className="w-16 sm:w-20"
        />
        <PriceCell
          value={item.large}
          itemName={item.name}
          slug={slugifyMenuItem(item.name)}
          groupName={group.name}
          size={sizeLabels.large}
          sizeNote="Large"
          className="w-16 sm:w-20"
        />
        <PriceCell
          value={item.liter}
          itemName={item.name}
          slug={slugifyMenuItem(item.name)}
          groupName={group.name}
          size={sizeLabels.liter}
          sizeNote="1 Liter"
          className="w-20"
        />
      </div>
    </li>
  );
}

export function MenuPriceTable({ group, className }: { group: MenuGroup; className?: string }) {
  return (
    <article className={cn("rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf4] p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#30251f]">{group.name}</h3>
        <p className="w-full text-sm leading-6 text-[#806e61] sm:w-auto sm:text-right">{group.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 border-b border-[#e2d5c7] pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a27b68]">
        <span>Menu</span>
        <span className="w-16 text-right sm:w-20">{sizeLabels.regular}</span>
        <span className="w-16 text-right sm:w-20">{sizeLabels.large}</span>
        <span className="w-20 text-right">{sizeLabels.liter}</span>
      </div>

      <ul className="divide-y divide-[#eee4d8]">
        {group.items.map((item) => (
          <MenuRow key={item.name} item={item} group={group} />
        ))}
      </ul>
    </article>
  );
}
