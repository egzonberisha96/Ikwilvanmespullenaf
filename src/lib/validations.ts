import { z } from "zod";

export const requestFormSchema = z.object({
  type: z.enum([
    "LOSSE_SPULLEN",
    "COMPLETE_INBOEDEL",
    "WONINGONTRUIMING",
    "BEDRIJFSINVENTARIS",
    "BEDRIJFSONTRUIMING",
  ]),
  categoryId: z.string().optional().nullable(),
  photos: z.array(z.object({ url: z.string().url(), key: z.string().optional() })).min(1, "Upload minimaal 1 foto"),
  description: z.string().min(10, "Geef een omschrijving van minimaal 10 tekens").max(2000),
  postcode: z.string().regex(/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, "Ongeldige postcode"),
  city: z.string().min(2, "Plaats is verplicht"),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  contactName: z.string().min(2, "Naam is verplicht"),
  contactEmail: z.string().email("Ongeldig e-mailadres"),
  contactPhone: z.string().min(8, "Ongeldig telefoonnummer"),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Naam is verplicht"),
    email: z.string().email("Ongeldig e-mailadres"),
    password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "PARTNER"]).default("CUSTOMER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });

export const partnerRegisterSchema = z.object({
  companyName: z.string().min(2, "Bedrijfsnaam is verplicht"),
  type: z.enum(["OPKOPER", "ONTRUIMINGSBEDRIJF", "KRINGLOOPWINKEL", "TRANSPORTBEDRIJF"]),
  kvkNumber: z.string().optional(),
  basePostcode: z.string().optional(),
  baseCity: z.string().optional(),
  workRadiusKm: z.number().min(1).max(300).default(25),
});

export const bidSchema = z.object({
  requestId: z.string(),
  amount: z.number().min(0),
  message: z.string().max(1000).optional(),
  isQuote: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Wachtwoord is verplicht"),
});
