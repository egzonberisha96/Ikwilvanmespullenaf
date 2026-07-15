import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function BevestigingPage({ searchParams }: { searchParams: { nummer?: string } }) {
  const nummer = searchParams.nummer;

  return (
    <div className="container-page flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-16 text-center">
      <CheckCircle2 className="mb-6 text-brand-600" size={56} />
      <h1 className="text-2xl font-extrabold text-ink-950">Je aanvraag is verzonden!</h1>
      <p className="mt-3 text-ink-600">
        We hebben je aanvraag doorgestuurd naar geschikte partners. Je ontvangt binnen 24 uur de eerste reacties per e-mail.
      </p>
      {nummer && (
        <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50 px-6 py-3">
          <span className="text-xs font-semibold uppercase text-ink-400">Aanvraagnummer</span>
          <p className="text-lg font-bold text-ink-900">{nummer}</p>
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {nummer && (
          <Link href={`/aanvraag/${nummer}`} className="btn-primary">
            Bekijk status
          </Link>
        )}
        <Link href="/" className="btn-secondary">
          Terug naar home
        </Link>
      </div>
    </div>
  );
}
