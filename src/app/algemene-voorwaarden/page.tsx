import type { Metadata } from "next";

export const metadata: Metadata = { title: "Algemene voorwaarden" };

export default function TermsPage() {
  return (
    <div className="container-page max-w-2xl py-14 text-sm text-ink-700">
      <h1 className="mb-6 text-3xl font-extrabold text-ink-950">Algemene voorwaarden</h1>
      <div className="space-y-6">
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">1. Platform</h2>
          <p>
            IkWilVanMeSpullenAf.nl is een platform dat vraag en aanbod bij elkaar brengt tussen particulieren/bedrijven
            die van spullen af willen en aangesloten partners. Wij zijn zelf geen opkoper, ontruimer of transporteur.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">2. Aanvragen</h2>
          <p>
            Het plaatsen van een aanvraag is gratis en vrijblijvend. Een gebruiker is nooit verplicht om een
            ontvangen bod of offerte te accepteren.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">3. Partners</h2>
          <p>
            Partners zijn zelf verantwoordelijk voor de uitvoering van de opdracht en de naleving van geldende
            wet- en regelgeving. Het platform bemiddelt uitsluitend tussen partijen.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">4. Aansprakelijkheid</h2>
          <p>
            IkWilVanMeSpullenAf.nl is niet aansprakelijk voor schade die voortvloeit uit overeenkomsten tussen
            gebruikers en partners.
          </p>
        </section>
      </div>
    </div>
  );
}
