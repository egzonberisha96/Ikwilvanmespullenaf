import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.ikwilvanmespullenaf.nl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IkWilVanMeSpullenAf.nl — Van je spullen af zonder gedoe",
    template: "%s | IkWilVanMeSpullenAf.nl",
  },
  description:
    "Upload je foto's en ontvang binnen 24 uur een bod of offerte. Verkoop losse spullen, je complete inboedel of laat je woning of bedrijfspand ontruimen — snel, veilig en zonder gedoe.",
  keywords: [
    "spullen verkopen",
    "inboedel verkopen",
    "woning ontruimen",
    "huis leeghalen",
    "opkoper inboedel",
    "ontruimingsbedrijf",
    "spullen ophalen",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: "IkWilVanMeSpullenAf.nl",
    title: "IkWilVanMeSpullenAf.nl — Van je spullen af zonder gedoe",
    description: "Upload je foto's en ontvang binnen 24 uur een bod of offerte van betrouwbare partners.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IkWilVanMeSpullenAf.nl — Van je spullen af zonder gedoe",
    description: "Upload je foto's en ontvang binnen 24 uur een bod of offerte.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "IkWilVanMeSpullenAf.nl",
              url: SITE_URL,
              description:
                "Platform waar particulieren en bedrijven eenvoudig van hun spullen af komen via aangesloten partners.",
              sameAs: [],
            }),
          }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
