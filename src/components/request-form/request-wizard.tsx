"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Loader2 } from "lucide-react";
import { cn, isValidDutchPostcode } from "@/lib/utils";
import { StepCategory } from "./step-category";
import { StepPhotos } from "./step-photos";
import { StepDescription } from "./step-description";
import { StepAddress } from "./step-address";
import { StepContact } from "./step-contact";

export type RequestType =
  | "LOSSE_SPULLEN"
  | "COMPLETE_INBOEDEL"
  | "WONINGONTRUIMING"
  | "BEDRIJFSINVENTARIS"
  | "BEDRIJFSONTRUIMING";

export interface RequestFormState {
  type: RequestType | null;
  photos: { url: string; key?: string }[];
  description: string;
  postcode: string;
  city: string;
  street: string;
  houseNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

const STEP_LABELS = ["Categorie", "Foto's", "Omschrijving", "Adres", "Contact", "Verzenden"];

export function RequestWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const initialType = params.get("type") as RequestType | null;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RequestFormState>({
    type: initialType,
    photos: [],
    description: "",
    postcode: "",
    city: "",
    street: "",
    houseNumber: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  function update(patch: Partial<RequestFormState>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function canGoNext(): boolean {
    switch (step) {
      case 0:
        return !!form.type;
      case 1:
        return form.photos.length > 0;
      case 2:
        return form.description.trim().length >= 10;
      case 3:
        return isValidDutchPostcode(form.postcode) && form.city.trim().length > 1;
      case 4:
        return (
          form.contactName.trim().length > 1 &&
          /\S+@\S+\.\S+/.test(form.contactEmail) &&
          form.contactPhone.trim().length > 7
        );
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Er ging iets mis");
      toast.success("Je aanvraag is verzonden!");
      router.push(`/aanvraag/bevestiging?nummer=${data.requestNumber}`);
    } catch (err: any) {
      toast.error(err.message ?? "Er ging iets mis, probeer het opnieuw");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-medium text-ink-500">
          {STEP_LABELS.map((label, i) => (
            <span key={label} className={cn(i <= step && "text-brand-700")}>
              {label}
            </span>
          ))}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        {step === 0 && <StepCategory value={form.type} onChange={(type) => update({ type })} />}
        {step === 1 && <StepPhotos photos={form.photos} onChange={(photos) => update({ photos })} />}
        {step === 2 && (
          <StepDescription value={form.description} onChange={(description) => update({ description })} type={form.type} />
        )}
        {step === 3 && (
          <StepAddress
            postcode={form.postcode}
            city={form.city}
            street={form.street}
            houseNumber={form.houseNumber}
            onChange={update}
          />
        )}
        {step === 4 && (
          <StepContact
            contactName={form.contactName}
            contactEmail={form.contactEmail}
            contactPhone={form.contactPhone}
            onChange={update}
          />
        )}
        {step === 5 && <StepSummary form={form} />}

        <div className="mt-8 flex items-center justify-between">
          <button
            className="btn-ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
          >
            Vorige
          </button>

          {step < STEP_LABELS.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1))}
              disabled={!canGoNext()}
            >
              Volgende
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
              Aanvraag versturen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepSummary({ form }: { form: RequestFormState }) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-950">Controleer je aanvraag</h2>
      <p className="mb-6 text-sm text-ink-600">Klopt alles? Verstuur dan je aanvraag naar onze partners.</p>
      <dl className="space-y-3 text-sm">
        <Row label="Categorie" value={form.type ?? "-"} />
        <Row label="Foto's" value={`${form.photos.length} foto('s)`} />
        <Row label="Omschrijving" value={form.description} />
        <Row label="Adres" value={`${form.postcode}, ${form.city}${form.street ? `, ${form.street} ${form.houseNumber}` : ""}`} />
        <Row label="Naam" value={form.contactName} />
        <Row label="E-mail" value={form.contactEmail} />
        <Row label="Telefoon" value={form.contactPhone} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-ink-100 pb-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="text-ink-800">{value}</dd>
    </div>
  );
}
