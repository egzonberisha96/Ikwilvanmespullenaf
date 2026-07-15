import { Suspense } from "react";
import type { Metadata } from "next";
import { RequestWizard } from "@/components/request-form/request-wizard";

export const metadata: Metadata = {
  title: "Plaats je aanvraag",
  description:
    "Kies een categorie, upload foto's en ontvang binnen 24 uur een bod of offerte van aangesloten partners.",
};

export default function AanvraagPage() {
  return (
    <div className="bg-ink-50 py-10">
      <div className="container-page max-w-2xl">
        <Suspense>
          <RequestWizard />
        </Suspense>
      </div>
    </div>
  );
}
