import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-extrabold text-brand-600">404</h1>
      <p className="mt-3 text-lg font-semibold text-ink-900">Pagina niet gevonden</p>
      <p className="mt-1 text-sm text-ink-600">De pagina die je zoekt bestaat niet (meer).</p>
      <Link href="/" className="btn-primary mt-6">
        Terug naar home
      </Link>
    </div>
  );
}
