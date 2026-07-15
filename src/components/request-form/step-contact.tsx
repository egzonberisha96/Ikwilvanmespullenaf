"use client";

import type { RequestFormState } from "./request-wizard";

export function StepContact({
  contactName,
  contactEmail,
  contactPhone,
  onChange,
}: Pick<RequestFormState, "contactName" | "contactEmail" | "contactPhone"> & {
  onChange: (patch: Partial<RequestFormState>) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-950">Hoe kunnen partners je bereiken?</h2>
      <p className="mb-6 text-sm text-ink-600">
        Je gegevens worden alleen gedeeld met partners die reageren op jouw aanvraag.
      </p>
      <div className="space-y-4">
        <div>
          <label className="label">Naam</label>
          <input
            className="input"
            placeholder="Voor- en achternaam"
            value={contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
          />
        </div>
        <div>
          <label className="label">E-mailadres</label>
          <input
            className="input"
            type="email"
            placeholder="naam@voorbeeld.nl"
            value={contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Telefoonnummer</label>
          <input
            className="input"
            type="tel"
            placeholder="06 12345678"
            value={contactPhone}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
