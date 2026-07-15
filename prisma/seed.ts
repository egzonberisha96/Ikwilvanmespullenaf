import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ---------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------
  const categoryData = [
    { name: "Meubels", slug: "meubels", type: "LOSSE_SPULLEN" as const },
    { name: "Witgoed & elektronica", slug: "witgoed-elektronica", type: "LOSSE_SPULLEN" as const },
    { name: "Complete inboedel", slug: "complete-inboedel", type: "COMPLETE_INBOEDEL" as const },
    { name: "Woningontruiming", slug: "woningontruiming", type: "WONINGONTRUIMING" as const },
    { name: "Kantoormeubilair", slug: "kantoormeubilair", type: "BEDRIJFSINVENTARIS" as const },
    { name: "Machines & apparatuur", slug: "machines-apparatuur", type: "BEDRIJFSINVENTARIS" as const },
    { name: "Bedrijfsontruiming", slug: "bedrijfsontruiming", type: "BEDRIJFSONTRUIMING" as const },
  ];

  const categories = [];
  for (const c of categoryData) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    categories.push(cat);
  }

  // ---------------------------------------------------------------------
  // Admin account
  // ---------------------------------------------------------------------
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@ikwilvanmespullenaf.nl" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@ikwilvanmespullenaf.nl",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // ---------------------------------------------------------------------
  // Customer account
  // ---------------------------------------------------------------------
  const customerPassword = await bcrypt.hash("Klant123!", 12);
  const customer = await prisma.user.upsert({
    where: { email: "klant@voorbeeld.nl" },
    update: {},
    create: {
      name: "Jan de Klant",
      email: "klant@voorbeeld.nl",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      phone: "0612345678",
      city: "Utrecht",
      postcode: "3511 AB",
    },
  });

  // ---------------------------------------------------------------------
  // Partner accounts
  // ---------------------------------------------------------------------
  const partnerPassword = await bcrypt.hash("Partner123!", 12);

  const partnerDefs = [
    {
      email: "opkoper@voorbeeld.nl",
      name: "Piet Opkoper",
      companyName: "Utrecht Opkopers B.V.",
      type: "OPKOPER" as const,
      baseCity: "Utrecht",
      basePostcode: "3511 AB",
      workRegions: ["Utrecht", "Nieuwegein", "Zeist"],
    },
    {
      email: "ontruiming@voorbeeld.nl",
      name: "Sanne Ontruimer",
      companyName: "SnelOntruimd B.V.",
      type: "ONTRUIMINGSBEDRIJF" as const,
      baseCity: "Amsterdam",
      basePostcode: "1011 AB",
      workRegions: ["Amsterdam", "Haarlem", "Amstelveen"],
    },
    {
      email: "kringloop@voorbeeld.nl",
      name: "Kees Kringloop",
      companyName: "Kringloop Centraal",
      type: "KRINGLOOPWINKEL" as const,
      baseCity: "Rotterdam",
      basePostcode: "3011 AB",
      workRegions: ["Rotterdam", "Schiedam", "Vlaardingen"],
    },
    {
      email: "transport@voorbeeld.nl",
      name: "Tom Transporteur",
      companyName: "Snel Transport & Logistiek",
      type: "TRANSPORTBEDRIJF" as const,
      baseCity: "Eindhoven",
      basePostcode: "5611 AB",
      workRegions: ["Eindhoven", "Tilburg", "Helmond"],
    },
  ];

  const partners = [];
  for (const p of partnerDefs) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { name: p.name, email: p.email, passwordHash: partnerPassword, role: "PARTNER" },
    });

    const partner = await prisma.partner.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        companyName: p.companyName,
        type: p.type,
        baseCity: p.baseCity,
        basePostcode: p.basePostcode,
        workRegions: p.workRegions,
        workRadiusKm: 30,
        isApproved: true,
        isActive: true,
        subscriptionPlan: "BASIS",
        commissionType: "VAST_BEDRAG",
        commissionValue: 15,
      },
    });
    partners.push(partner);
  }

  // ---------------------------------------------------------------------
  // Sample requests
  // ---------------------------------------------------------------------
  const existingRequests = await prisma.request.count();
  if (existingRequests === 0) {
    const req1 = await prisma.request.create({
      data: {
        requestNumber: "IWMA-2026-000001",
        type: "LOSSE_SPULLEN",
        categoryId: categories[0].id,
        description: "2-zits bank, lichtgrijs, weinig gebruikt. Ophalen in Utrecht centrum.",
        postcode: "3511 AB",
        city: "Utrecht",
        contactName: "Jan de Klant",
        contactEmail: "klant@voorbeeld.nl",
        contactPhone: "0612345678",
        userId: customer.id,
        status: "BIEDINGEN_ONTVANGEN",
        photos: {
          create: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", sortOrder: 0 }],
        },
      },
    });

    await prisma.bid.create({
      data: {
        requestId: req1.id,
        partnerId: partners[0].id,
        amount: 75,
        message: "We komen graag morgen de bank ophalen!",
      },
    });

    await prisma.request.create({
      data: {
        requestNumber: "IWMA-2026-000002",
        type: "WONINGONTRUIMING",
        categoryId: categories[3].id,
        description: "Woning van 90m² moet bezemschoon opgeleverd worden voor 1 augustus.",
        postcode: "1011 AB",
        city: "Amsterdam",
        contactName: "Marieke Jansen",
        contactEmail: "marieke@voorbeeld.nl",
        contactPhone: "0687654321",
        status: "NIEUW",
        photos: {
          create: [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", sortOrder: 0 }],
        },
      },
    });
  }

  // ---------------------------------------------------------------------
  // Default platform settings
  // ---------------------------------------------------------------------
  await prisma.setting.upsert({
    where: { key: "commission_type" },
    update: {},
    create: { key: "commission_type", value: "VAST_BEDRAG" },
  });
  await prisma.setting.upsert({
    where: { key: "commission_fixed_amount" },
    update: {},
    create: { key: "commission_fixed_amount", value: "15" },
  });
  await prisma.setting.upsert({
    where: { key: "commission_percentage" },
    update: {},
    create: { key: "commission_percentage", value: "10" },
  });

  // ---------------------------------------------------------------------
  // Sample blog post
  // ---------------------------------------------------------------------
  await prisma.blogPost.upsert({
    where: { slug: "5-tips-voor-een-snelle-woningontruiming" },
    update: {},
    create: {
      title: "5 tips voor een snelle woningontruiming",
      slug: "5-tips-voor-een-snelle-woningontruiming",
      excerpt: "Een woning ontruimen kan overweldigend zijn. Met deze tips pak je het slim aan.",
      content:
        "Een woningontruiming voelt vaak als een grote klus, maar met een goede aanpak gaat het sneller dan je denkt.\n\n1. Begin met sorteren: wat wil je behouden, verkopen of weggeven?\n2. Maak duidelijke foto's van waardevolle spullen voordat je een aanvraag plaatst.\n3. Vraag meerdere offertes aan om een goede prijs te krijgen.\n4. Plan de ontruiming ruim voor de opleverdatum.\n5. Laat de laatste bezemschone check over aan professionals.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seeding klaar!");
  console.log("\nTestaccounts:");
  console.log("  Admin:    admin@ikwilvanmespullenaf.nl / Admin123!");
  console.log("  Klant:    klant@voorbeeld.nl / Klant123!");
  console.log("  Partner:  opkoper@voorbeeld.nl / Partner123!  (en 3 andere partnertypes, zie README)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
