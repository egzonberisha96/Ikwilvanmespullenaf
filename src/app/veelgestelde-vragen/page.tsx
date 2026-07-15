import type { Metadata } from "next";
import { FaqAccordion } from "@/components/home/faq-accordion";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description: "Antwoorden op de meest gestelde vragen over IkWilVanMeSpullenAf.nl.",
};

const FAQS = [
  { q: "Wat kost het om een aanvraag te plaatsen?", a: "Een aanvraag plaatsen is volledig gratis en vrijblijvend." },
  { q: "Hoe snel krijg ik een reactie?", a: "In de meeste gevallen ontvang je binnen 24 uur de eerste reacties." },
  { q: "Zijn de partners betrouwbaar?", a: "Ja, alle partners doorlopen een screening voordat ze zich mogen aansluiten." },
  { q: "Ben ik verplicht een bod te accepteren?", a: "Nee, je bepaalt zelf of en welk bod je accepteert." },
  { q: "Kan ik ook als bedrijf een aanvraag plaatsen?", a: "Ja, kies bij het aanvraagformulier voor bedrijfsinventaris of bedrijfsontruiming." },
  { q: "Hoe word ik partner?", a: "Meld je aan via de partnerpagina. Na goedkeuring kun je direct reageren op aanvragen." },
];

export default function FaqPage() {
  return (
    <div className="container-page max-w-2xl py-14">
      <h1 className="mb-8 text-3xl font-extrabold text-ink-950">Veelgestelde vragen</h1>
      <FaqAccordion items={FAQS} />
    </div>
  );
}
