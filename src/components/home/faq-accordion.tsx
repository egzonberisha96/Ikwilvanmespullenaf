"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.q} className="card overflow-hidden">
          <button
            className="flex w-full items-center justify-between p-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-ink-900">{item.q}</span>
            <ChevronDown
              size={18}
              className={cn("shrink-0 text-ink-400 transition-transform", open === i && "rotate-180")}
            />
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-ink-600">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}
