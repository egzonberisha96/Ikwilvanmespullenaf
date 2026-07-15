"use client";

import type { RequestType } from "./request-wizard";

const PLACEHOLDERS: Record<string, string> = {
  LOSSE_SPULLEN: "Bijv. 2-zits bank, lichtgrijs, weinig gebruikt, ophalen in Utrecht...",
  COMPLETE_INBOEDEL: "Bijv. Volledige inboedel van een 3-kamerwoning, incl. witgoed en meubels...",
  WONINGONTRUIMING: "Bijv. Woning van 90m² moet bezemschoon opgeleverd worden voor 1 augustus...",
  BEDRIJFSINVENTARIS: "Bijv. 20 bureaustoelen, 10 bureaus en 4 kasten uit kantoorpand...",
  BEDRIJFSONTRUIMING: "Bijv. Bedrijfspand van 300m² compleet ontruimen inclusief magazijnstellingen...",
};

export function StepDescription({
  value,
  onChange,
  type,
}: {
  value: string;
  onChange: (v: string) => void;
  type: RequestType | null;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-950">Omschrijf kort wat je kwijt wilt</h2>
      <p className="mb-6 text-sm text-ink-600">
        Vermeld type spullen, hoeveelheid en eventuele bijzonderheden zoals staat of afmetingen.
      </p>
      <textarea
        className="input min-h-[160px] resize-y"
        placeholder={type ? PLACEHOLDERS[type] : "Beschrijf je spullen..."}
        value={value}
        maxLength={2000}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-1 text-right text-xs text-ink-400">{value.length}/2000</div>
    </div>
  );
}
