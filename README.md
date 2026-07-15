# IkWilVanMeSpullenAf.nl

Platform waar particulieren en bedrijven eenvoudig van hun spullen af komen. Gebruikers plaatsen in een paar
stappen een aanvraag (categorie kiezen → foto's uploaden → omschrijving → adres → contact → verzenden) en
aangesloten partners (opkopers, ontruimingsbedrijven, kringloopwinkels, transportbedrijven) reageren daarop met
een bod of offerte.

## Inhoudsopgave

1. [Techstack](#techstack)
2. [Projectstructuur](#projectstructuur)
3. [Lokale installatie](#lokale-installatie)
4. [Environment variabelen](#environment-variabelen)
5. [Database](#database)
6. [Testaccounts](#testaccounts)
7. [Docker](#docker)
8. [Productie-uitrol](#productie-uitrol)
9. [Status van dit project](#status-van-dit-project)

---

## Techstack

- **Framework:** Next.js 15 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Authenticatie:** NextAuth.js (credentials provider, JWT-sessies)
- **Foto-uploads:** Uploadthing
- **E-mail:** Nodemailer (SMTP)
- **Betalingen:** Mollie (partnerabonnementen)
- **Containers:** Docker + Docker Compose

## Projectstructuur

```
src/
  app/                      Next.js App Router pagina's + API routes
    (marketing)             Homepage, hoe-werkt-het, voor-partners, FAQ, contact, blog
    aanvraag/                Multi-step aanvraagformulier + statuspagina
    dashboard/               Klantdashboard
    partner/                 Partnerdashboard
    admin/                   Adminpaneel
    api/                     Alle API routes (requests, bids, auth, admin, payments)
  components/               Herbruikbare UI-componenten per domein
  lib/                      Prisma client, auth config, e-mail, validaties, utils
  types/                    TypeScript type-uitbreidingen
prisma/
  schema.prisma             Volledig databaseschema
  seed.ts                   Seed-script met testdata en testaccounts
```

## Lokale installatie

**Vereisten:** Node.js 18.18+, npm, Docker (voor de database) of een eigen PostgreSQL-instantie.

```bash
# 1. Installeer dependencies
npm install

# 2. Kopieer environment variabelen
cp .env.example .env
# Vul minimaal DATABASE_URL en NEXTAUTH_SECRET in (zie hieronder)

# 3. Start een lokale PostgreSQL database via Docker
docker compose -f docker-compose.dev.yml up -d

# 4. Zet het databaseschema klaar
npm run db:push

# 5. Vul de database met testdata en testaccounts
npm run db:seed

# 6. Start de development server
npm run dev
```

De app draait nu op **http://localhost:3000**.

### Productiebuild lokaal testen

```bash
npm run build
npm run start
```

## Environment variabelen

Zie `.env.example` voor het volledige overzicht. De belangrijkste:

| Variabele | Omschrijving |
|---|---|
| `DATABASE_URL` | PostgreSQL connectiestring |
| `NEXTAUTH_SECRET` | Willekeurige string, genereer met `openssl rand -base64 32` |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` | Basis-URL van de applicatie |
| `UPLOADTHING_TOKEN` | API-token van [uploadthing.com](https://uploadthing.com) voor foto-uploads |
| `SMTP_*` / `EMAIL_FROM` | SMTP-gegevens voor uitgaande e-mail. Zonder deze variabelen worden e-mails alleen naar de serverconsole gelogd (handig voor lokale ontwikkeling) |
| `MOLLIE_API_KEY` | API-key van [mollie.com](https://mollie.com) voor partnerabonnementen |

## Database

Het volledige schema staat in `prisma/schema.prisma` en bevat: `User`, `Partner`, `Category`, `Request`, `Photo`,
`Bid`, `Review`, `Notification`, `Invoice`, `Payment`, `Setting`, `BlogPost` en `CityLandingPage`, inclusief alle
NextAuth-tabellen.

Handige commando's:

```bash
npm run db:push       # Schema naar database pushen (development)
npm run db:migrate     # Migratie aanmaken (voor productie-workflows)
npm run db:seed        # Testdata inladen
npm run db:studio      # Prisma Studio openen (GUI voor de database)
```

## Testaccounts

Na het draaien van `npm run db:seed` zijn de volgende accounts beschikbaar (wachtwoorden zijn expres eenvoudig
te onthouden voor test-/demodoeleinden — **wijzig deze voor productiegebruik**):

| Rol | E-mail | Wachtwoord |
|---|---|---|
| Admin | `admin@ikwilvanmespullenaf.nl` | `Admin123!` |
| Klant | `klant@voorbeeld.nl` | `Klant123!` |
| Partner (Opkoper, Utrecht) | `opkoper@voorbeeld.nl` | `Partner123!` |
| Partner (Ontruimingsbedrijf, Amsterdam) | `ontruiming@voorbeeld.nl` | `Partner123!` |
| Partner (Kringloopwinkel, Rotterdam) | `kringloop@voorbeeld.nl` | `Partner123!` |
| Partner (Transportbedrijf, Eindhoven) | `transport@voorbeeld.nl` | `Partner123!` |

Er staan ook twee voorbeeldaanvragen (`IWMA-2026-000001` en `IWMA-2026-000002`) en één voorbeeld-bod klaar, zodat
je direct door de volledige flow kunt klikken.

## Docker

**Volledige stack (app + database) draaien:**

```bash
cp .env.example .env   # vul de variabelen in
docker compose up -d --build
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

De app is dan bereikbaar op **http://localhost:3000**.

**Alleen de database** (voor lokale `npm run dev`):

```bash
docker compose -f docker-compose.dev.yml up -d
```

## Productie-uitrol

1. **Database:** gebruik een managed PostgreSQL-instantie (bijv. Neon, Supabase, RDS, of je eigen server).
2. **Environment variabelen:** zet alle variabelen uit `.env.example` klaar in je hostingomgeving, met productie­waarden (echte SMTP-gegevens, live Mollie API-key, een sterke `NEXTAUTH_SECRET`, de definitieve `NEXT_PUBLIC_APP_URL`).
3. **Migraties:** draai `npx prisma migrate deploy` als onderdeel van je deploy-pipeline (in plaats van `db push`, dat is bedoeld voor development).
4. **Build & start:**
   ```bash
   npm ci
   npm run build
   npm run start
   ```
   Of bouw en draai de meegeleverde `Dockerfile` (deze gebruikt Next.js' standalone output voor een kleine, zelfstandige image).
5. **Webhooks:** stel in je Mollie-dashboard de webhook-URL in op `https://jouwdomein.nl/api/payments/webhook`.
6. **Uploadthing:** koppel je productiedomein in het Uploadthing-dashboard.
7. **DNS/SSL:** zet `ikwilvanmespullenaf.nl` op je hostingprovider en regel een SSL-certificaat (bijv. via Let's Encrypt of je hostingprovider).
8. **SEO:** `sitemap.xml` en `robots.txt` worden automatisch gegenereerd (`src/app/sitemap.ts` / `robots.ts`) op basis van gepubliceerde blogposts en stadslandingspagina's. Voeg deze toe aan Google Search Console na livegang.

## Status van dit project

Dit is een volledig functionerende basis (**geen mockup**) met een werkende end-to-end flow: aanvraag plaatsen →
e-mailnotificatie → partner brengt bod uit → klant accepteert → statuspagina bijgewerkt. Alle in de opdracht
genoemde databasetabellen, rollen en dashboards zijn geïmplementeerd.

Voor een productielancering raden we aan om, afhankelijk van jullie exacte wensen, nog te verfijnen:

- **Facturatie:** het automatisch génereren van `Invoice`-records op basis van het gekozen commissiemodel (het
  datamodel en de admin-instellingenpagina staan al klaar; de cronjob/trigger die dit automatisch aanmaakt is een
  logisch vervolgstuk).
- **PDF-facturen:** een PDF-generator koppelen (bijv. `@react-pdf/renderer`) voor het `pdfUrl`-veld op `Invoice`.
- **Geavanceerde regiomatching:** de huidige matching tussen aanvragen en partners werkt op plaatsnaam/postcode-
  prefix; voor nauwkeurigere matching kun je een geocoding-API (bijv. Postcode.nl of Google Geocoding) toevoegen
  om op basis van straal in kilometers te matchen.
- **E-mailtemplates verfijnen:** de e-maillogica en teksten staan volledig klaar in `src/lib/email.ts`; het
  visuele ontwerp kan verder gestyled worden met jullie huisstijl.
- **Uitgebreide teststeekproef:** unit- en e2e-tests zijn nog niet toegevoegd.

Alle bovenstaande punten raken uitbreidingen bovenop een werkende basis, niet ontbrekende kernfunctionaliteit.
