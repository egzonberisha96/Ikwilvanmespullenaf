"use client";

import { Sofa, Home, Warehouse, Building2, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestType } from "./request-wizard";

const OPTIONS: { type: RequestType; title: string; desc: string; icon: any }[] = [
  { type: "LOSSE_SPULLEN", title: "Losse spullen", desc: "Bijv. een bank, fiets of televisie", icon: Sofa },
  { type: "COMPLETE_INBOEDEL", title: "Complete inboedel", desc: "De volledige inhoud van je woning", icon: Home },
  { type: "WONINGONTRUIMING", title: "Woningontruiming", desc: "Woning bezemschoon laten opleveren", icon: Warehouse },
  { type: "BEDRIJFSINVENTARIS", title: "Bedrijfsinventaris", desc: "Kantoormeubilair, machines, voorraad", icon: Building2 },
  { type: "BEDRIJFSONTRUIMING", title: "Bedrijfsontruiming", desc: "Compleet bedrijfspand laten ontruimen", icon: Factory },
];

export function StepCategory({ value, onChange }: { value: RequestType | null; onChange: (t: RequestType) => void }) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-950">Wat wil je kwijt?</h2>
      <p className="mb-6 text-sm text-ink-600">Kies de categorie die het beste past bij jouw situatie.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onChange(opt.type)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition",
              value === opt.type
                ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                : "border-ink-200 hover:border-brand-300 hover:bg-ink-50"
            )}
          >
            <opt.icon size={22} className={value === opt.type ? "text-brand-700" : "text-ink-500"} />
            <span className="font-semibold text-ink-900">{opt.title}</span>
            <span className="text-xs text-ink-500">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
