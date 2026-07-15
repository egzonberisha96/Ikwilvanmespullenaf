import Link from "next/link";
import {
  Camera,
  ClipboardList,
  MapPin,
  Send,
  ShieldCheck,
  Clock,
  Users,
  Star,
  Sofa,
  Building2,
  Home,
  Warehouse,
  ChevronRight,
} from "lucide-react";
import { FaqAccordion } from "@/components/home/faq-accordion";

const STEPS = [
  { icon: ClipboardList, title: "Kies een categorie", text: "Losse spullen, complete inboedel of een hele ontruiming." },
  { icon: Camera, title: "Upload foto's", text: "Een paar duidelijke foto's is genoeg om een goed beeld te geven." },
  { icon: Send, title: "Ontvang bod of offerte", text: "Aangesloten partners reageren binnen 24 uur met een voorstel." },
];

const REASONS = [
  { icon: Clock, title: "Snel geregeld", text: "Binnen 24 uur reactie van betrouwbare, aangesloten partners." },
  { icon: ShieldCheck, title: "Veilig & betrouwbaar", text: "Alle partners zijn gescreend voordat ze aansluiten." },
  { icon: Users, title: "Landelijk netwerk", text: "Opkopers, ontruimers, kringloopwinkels en transportbedrijven." },
];

const CATEGORY_CARDS = [
  { icon: Sofa, title: "Losse spullen", desc: "Van bank tot fiets: snel en eenvoudig verkocht.", href: "/aanvraag?type=LOSSE_SPULLEN" },
  { icon: Home, title: "Complete inboedel", desc: "Je hele inboedel in één keer verkopen.", href: "/aanvraag?type=COMPLETE_INBOEDEL" },
  { icon: Warehouse, title: "Woningontruiming", desc: "Laat je woning volledig en bezemschoon ontruimen.", href: "/aanvraag?type=WONINGONTRUIMING" },
  { icon: Building2, title: "Bedrijfsinventaris", desc: "Kantoormeubilair of machines kwijt? Wij regelen het.", href: "/aanvraag?type=BEDRIJFSINVENTARIS" },
];

const REVIEWS = [
  { name: "Marieke uit Utrecht", text: "Binnen een dag drie biedingen ontvangen. Supersnel en zonder gedoe geregeld.", rating: 5 },
  { name: "Peter uit Rotterdam", text: "Onze bedrijfsruimte moest leeg. Een ontruimingsbedrijf nam alles keurig over.", rating: 5 },
  { name: "Sanne uit Eindhoven", text: "Makkelijker kan bijna niet. Foto's geüpload en dezelfde dag al een goed bod.", rating: 4 },
];

const FAQS = [
  {
    q: "Wat kost het om een aanvraag te plaatsen?",
    a: "Een aanvraag plaatsen is volledig gratis. Je ontvangt vrijblijvend biedingen en offertes van partners.",
  },
  {
    q: "Hoe snel krijg ik een reactie?",
    a: "In de meeste gevallen ontvang je binnen 24 uur de eerste reacties van aangesloten partners.",
  },
  {
    q: "Zijn de partners betrouwbaar?",
    a: "Ja, alle partners doorlopen een screening voordat ze zich mogen aansluiten bij het platform.",
  },
  {
    q: "Ben ik verplicht een bod te accepteren?",
    a: "Nee, je bent volledig vrij om te kiezen welk bod of welke offerte je accepteert — of om geen enkel bod te accepteren.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center animate-fade-in">
            <span className="badge mb-4 w-fit bg-brand-100 text-brand-700">Binnen 24 uur een reactie</span>
            <h1 className="text-4xl font-extrabold leading-tight text-ink-950 sm:text-5xl">
              Van je spullen af <span className="text-brand-600">zonder gedoe.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-600">
              Upload je foto&apos;s en ontvang binnen 24 uur een bod of offerte van betrouwbare, aangesloten partners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/aanvraag?type=LOSSE_SPULLEN" className="btn-primary">
                Spullen verkopen <ChevronRight size={16} />
              </Link>
              <Link href="/aanvraag?type=COMPLETE_INBOEDEL" className="btn-secondary">
                Spullen laten ophalen
              </Link>
              <Link href="/aanvraag?type=WONINGONTRUIMING" className="btn-secondary">
                Woning ontruimen
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-ink-500">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 font-semibold text-ink-800">4.8/5</span>
              </div>
              <span>op basis van 1.200+ reviews</span>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="card w-full max-w-md p-6">
              <p className="mb-4 text-sm font-semibold text-ink-500">Wat wil je kwijt?</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_CARDS.map((c) => (
                  <Link
                    key={c.title}
                    href={c.href}
                    className="group flex flex-col gap-2 rounded-xl border border-ink-100 p-4 transition hover:border-brand-300 hover:bg-brand-50"
                  >
                    <c.icon className="text-brand-600" size={22} />
                    <span className="text-sm font-semibold text-ink-900">{c.title}</span>
                    <span className="text-xs text-ink-500">{c.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section id="hoe-werkt-het" className="container-page py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-ink-950">Hoe werkt het</h2>
          <p className="mt-2 text-ink-600">In drie simpele stappen van je spullen af</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card relative p-8 text-center">
              <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <s.icon className="mx-auto mb-4 mt-4 text-brand-600" size={32} />
              <h3 className="mb-2 font-bold text-ink-900">{s.title}</h3>
              <p className="text-sm text-ink-600">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/aanvraag" className="btn-primary">
            Start je aanvraag <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Waarom kiezen voor ons */}
      <section className="bg-ink-50 py-20">
        <div className="container-page">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-ink-950">Waarom kiezen voor ons</h2>
            <p className="mt-2 text-ink-600">Betrouwbaar, snel en zonder verrassingen</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="flex flex-col items-center text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <r.icon size={26} />
                </span>
                <h3 className="mb-2 font-bold text-ink-900">{r.title}</h3>
                <p className="text-sm text-ink-600">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="container-page py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-ink-950">Wat klanten zeggen</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="card p-6">
              <div className="mb-3 flex gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-sm text-ink-700">&ldquo;{r.text}&rdquo;</p>
              <p className="text-sm font-semibold text-ink-900">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-ink-50 py-20">
        <div className="container-page max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-ink-950">Veelgestelde vragen</h2>
          </div>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 py-16">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <MapPin className="text-brand-200" size={32} />
          <h2 className="text-3xl font-extrabold text-white">Klaar om van je spullen af te komen?</h2>
          <p className="max-w-lg text-brand-100">
            Plaats gratis en vrijblijvend je aanvraag en ontvang binnen 24 uur reacties van partners bij jou in de buurt.
          </p>
          <Link href="/aanvraag" className="btn bg-white text-brand-700 hover:bg-brand-50">
            Start nu je aanvraag <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
