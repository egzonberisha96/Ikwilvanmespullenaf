"use client";

import type { RequestFormState } from "./request-wizard";

export function StepAddress({
  postcode,
  city,
  street,
  houseNumber,
  onChange,
}: Pick<RequestFormState, "postcode" | "city" | "street" | "houseNumber"> & {
  onChange: (patch: Partial<RequestFormState>) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-950">Waar bevinden de spullen zich?</h2>
      <p className="mb-6 text-sm text-ink-600">
        We gebruiken dit om je aanvraag naar partners in jouw regio te sturen.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Postcode</label>
          <input
            className="input"
            placeholder="1234 AB"
            value={postcode}
            onChange={(e) => onChange({ postcode: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Plaats</label>
          <input
            className="input"
            placeholder="Utrecht"
            value={city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Straat (optioneel)</label>
          <input
            className="input"
            placeholder="Hoofdstraat"
            value={street}
            onChange={(e) => onChange({ street: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Huisnummer (optioneel)</label>
          <input
            className="input"
            placeholder="12A"
            value={houseNumber}
            onChange={(e) => onChange({ houseNumber: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
