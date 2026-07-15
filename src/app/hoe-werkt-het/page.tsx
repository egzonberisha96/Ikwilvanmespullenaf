import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Camera, FileText, MapPin, User, Send, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hoe werkt het",
  description: "In een paar simpele stappen van je spullen af. Ontdek hoe IkWilVanMeSpullenAf.nl werkt.",
};

const STEPS = [
  { icon: ClipboardList, title: "1. Kies een categorie", text: "Losse spullen, complete inboedel, woningontruiming, bedrijfsinventaris of bedrijfsontruiming." },
  { icon: Camera, title: "2. Upload foto's", text: "Voeg duidelijke foto's toe zodat partners een goed beeld krijgen." },
  { icon: FileText, title: "3. Geef een omschrijving", text: "Beschrijf kort wat je kwijt wilt en eventuele bijzonderheden." },
  { icon: MapPin, title: "4. Vul je adres in", text: "Postcode en plaats, zodat we partners in jouw regio kunnen benaderen." },
  { icon: User, title: "5. Vul je contactgegevens in", text: "Naam, e-mail en telefoonnummer, zodat partners contact kunnen opnemen." },
  { icon: Send, title: "6. Verstuur je aanvraag", text: "Binnen 24 uur ontvang je de eerste biedingen en offertes." },
];

export default function HoeWerktHetPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="mb-3 text-3xl font-extrabold text-ink-950">Hoe werkt het</h1>
      <p className="mb-10 text-ink-600">Van je spullen af in zes eenvoudige stappen.</p>
      <div className="space-y-4">
        {STEPS.map((s) => (
          <div key={s.title} className="card flex items-start gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <s.icon size={20} />
            </span>
            <div>
              <h2 className="font-bold text-ink-900">{s.title}</h2>
              <p className="text-sm text-ink-600">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/aanvraag" className="btn-primary">
          Start je aanvraag <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
