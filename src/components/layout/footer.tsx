import Link from "next/link";
import { Package } from "lucide-react";

const columns = [
  {
    title: "Particulier",
    links: [
      { href: "/aanvraag?type=LOSSE_SPULLEN", label: "Losse spullen verkopen" },
      { href: "/aanvraag?type=COMPLETE_INBOEDEL", label: "Inboedel verkopen" },
      { href: "/aanvraag?type=WONINGONTRUIMING", label: "Woning laten ontruimen" },
    ],
  },
  {
    title: "Zakelijk",
    links: [
      { href: "/aanvraag?type=BEDRIJFSINVENTARIS", label: "Bedrijfsinventaris verkopen" },
      { href: "/aanvraag?type=BEDRIJFSONTRUIMING", label: "Bedrijfspand ontruimen" },
    ],
  },
  {
    title: "Partners",
    links: [
      { href: "/voor-partners", label: "Partner worden" },
      { href: "/partner/registreren", label: "Aanmelden als partner" },
      { href: "/inloggen", label: "Partner inloggen" },
    ],
  },
  {
    title: "Over ons",
    links: [
      { href: "/hoe-werkt-het", label: "Hoe werkt het" },
      { href: "/veelgestelde-vragen", label: "Veelgestelde vragen" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="container-page grid grid-cols-2 gap-8 py-14 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2 font-extrabold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Package size={16} />
            </span>
            IWMSA
          </div>
          <p className="text-sm text-ink-400">Van je spullen af zonder gedoe.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-400 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-800 py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} IkWilVanMeSpullenAf.nl — Alle rechten voorbehouden ·{" "}
        <Link href="/privacybeleid" className="hover:text-white">Privacybeleid</Link> ·{" "}
        <Link href="/algemene-voorwaarden" className="hover:text-white">Algemene voorwaarden</Link>
      </div>
    </footer>
  );
}
