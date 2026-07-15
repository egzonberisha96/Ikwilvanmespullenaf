import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-page max-w-lg py-14">
      <h1 className="mb-3 text-3xl font-extrabold text-ink-950">Contact</h1>
      <p className="mb-8 text-ink-600">Heb je een vraag? We helpen je graag verder.</p>
      <div className="card space-y-4 p-6">
        <a href="mailto:info@ikwilvanmespullenaf.nl" className="flex items-center gap-3 text-sm text-ink-700 hover:text-brand-700">
          <Mail size={18} /> info@ikwilvanmespullenaf.nl
        </a>
        <a href="tel:+31850000000" className="flex items-center gap-3 text-sm text-ink-700 hover:text-brand-700">
          <Phone size={18} /> 085 - 000 00 00
        </a>
      </div>
    </div>
  );
}
