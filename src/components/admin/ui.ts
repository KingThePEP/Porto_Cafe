import { cn } from "@/lib/utils";

export const adminCard = "rounded-3xl border border-[#e3d6c7] bg-white p-6 shadow-[0_18px_50px_rgba(71,48,35,0.08)]";

export const adminLabel =
  "block text-xs font-bold uppercase tracking-[0.16em] text-[#7d5c4d]";

export const adminInput =
  "w-full rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3 text-sm text-[#30251f] outline-none transition-colors placeholder:text-[#7d5c4d] focus:border-[#a24931] disabled:bg-[#f7f1ea]";

export const adminTextarea = cn(adminInput, "resize-y");

export const adminPrimaryButton =
  "inline-flex items-center justify-center rounded-full bg-[#241c18] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a24931] disabled:cursor-not-allowed disabled:opacity-60";

export const adminSecondaryButton =
  "inline-flex items-center justify-center rounded-full border border-[#d8c9b8] bg-white px-5 py-3 text-sm font-semibold text-[#30251f] transition-colors hover:border-[#a24931] hover:text-[#a24931] disabled:cursor-not-allowed disabled:opacity-60";

export const adminDangerButton =
  "inline-flex items-center justify-center rounded-full border border-[#e2b7a8] bg-white px-4 py-2 text-xs font-semibold text-[#a4462f] transition-colors hover:bg-[#fdeee9] disabled:cursor-not-allowed disabled:opacity-60";

export const adminTableHead =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-[#7d5c4d]";

export const adminTableCell = "px-4 py-3 align-top text-sm text-[#4d3d33]";

export const adminEmptyState =
  "rounded-3xl border border-dashed border-[#d8c9b8] bg-[#fdfaf6] px-6 py-10 text-center text-sm text-[#7d5c4d]";
