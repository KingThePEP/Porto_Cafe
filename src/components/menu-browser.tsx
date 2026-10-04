"use client";

import { useMemo, useState } from "react";
import { MenuPriceTable } from "@/components/menu-price-table";
import type { MenuGroup } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

export function MenuBrowser({ groups }: { groups: MenuGroup[] }) {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const visibleGroups = useMemo(
    () => (activeGroup === "all" ? groups : groups.filter((group) => group.id === activeGroup)),
    [activeGroup, groups],
  );

  const totalItems = useMemo(() => groups.reduce((total, group) => total + group.items.length, 0), [groups]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveGroup("all")}
          aria-pressed={activeGroup === "all"}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            activeGroup === "all"
              ? "border-[#241c18] bg-[#241c18] text-[#f8f1e8]"
              : "border-[#d8c9b8] bg-white text-[#4d3d33] hover:border-[#a24931] hover:text-[#a24931]",
          )}
        >
          Semua menu ({totalItems})
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroup(group.id)}
            aria-pressed={activeGroup === group.id}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              activeGroup === group.id
                ? "border-[#241c18] bg-[#241c18] text-[#f8f1e8]"
                : "border-[#d8c9b8] bg-white text-[#4d3d33] hover:border-[#a24931] hover:text-[#a24931]",
            )}
          >
            {group.name} ({group.items.length})
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6">
        {visibleGroups.map((group) => (
          <MenuPriceTable key={group.id} group={group} headingLevel="h2" />
        ))}
      </div>
    </div>
  );
}
