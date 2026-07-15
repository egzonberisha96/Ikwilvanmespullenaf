import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Voor partners",
  description: "Sluit je aan als opkoper, ontruimingsbedrijf, kringloopwinkel of transportbedrijf en ontvang dagelijks nieuwe leads.",
};

const BENEFITS = [
  "Dagelijks verse aanvragen in jouw werkgebied",
  "Zelf bepalen op welke aanvragen je reageert",
  "Flexibel commissiemodel: per lead, per opdracht of abonnement",
  "Eigen profiel en werkgebied volledig zelf te beheren",
  "Inzicht in je prestaties via het statistiekendashboard",
];

export default function VoorPartnersPage() {
  return (
    <div className="bg-ink-50 py-16">
      <div className="container-page max-w-3xl">
        <h1 className="mb-3 text-3xl font-extrabold text-ink-950">Word partner</h1>
        <p className="mb-8 text-ink-600">
          Ben je opkoper, ontruimingsbedrijf, kringloopwinkel of transportbedrijf? Sluit je aan bij ons netwerk en
          ontvang dagelijks nieuwe aanvragen uit jouw regio.
        </p>
        <div className="card mb-8 p-6">
          <ul className="space-y-3 text-sm text-ink-700">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/partner/registreren" className="btn-primary">
          Meld je aan als partner <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
