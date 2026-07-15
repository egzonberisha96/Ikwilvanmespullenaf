import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacybeleid" };

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-2xl py-14 text-sm text-ink-700">
      <h1 className="mb-6 text-3xl font-extrabold text-ink-950">Privacybeleid</h1>
      <div className="space-y-6">
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">1. Welke gegevens verzamelen we</h2>
          <p>
            Wanneer je een aanvraag plaatst, verzamelen we je naam, e-mailadres, telefoonnummer, adresgegevens en de
            foto&apos;s en omschrijving die je aanlevert. Deze gegevens zijn nodig om je aanvraag te kunnen verwerken
            en door te sturen naar geschikte partners.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">2. Hoe gebruiken we je gegevens</h2>
          <p>
            We gebruiken je gegevens uitsluitend om je aanvraag te matchen met relevante, aangesloten partners en om
            je op de hoogte te houden van de status van je aanvraag. We verkopen je gegevens nooit aan derden.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">3. Bewaartermijn</h2>
          <p>We bewaren je gegevens niet langer dan noodzakelijk voor het doel waarvoor ze zijn verzameld.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">4. Jouw rechten</h2>
          <p>
            Je hebt het recht om je gegevens in te zien, te corrigeren of te laten verwijderen. Neem hiervoor contact
            met ons op via info@ikwilvanmespullenaf.nl.
          </p>
        </section>
      </div>
    </div>
  );
}
