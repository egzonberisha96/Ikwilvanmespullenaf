import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = process.env.EMAIL_FROM ?? "IkWilVanMeSpullenAf <noreply@ikwilvanmespullenaf.nl>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function wrapper(title: string, body: string) {
  return `
  <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <div style="text-align:center; margin-bottom:24px;">
      <span style="font-size:20px; font-weight:800; color:#158252;">IkWilVanMeSpullenAf.nl</span>
    </div>
    <div style="background:#fff; border:1px solid #eceef2; border-radius:16px; padding:28px;">
      <h2 style="margin:0 0 16px; color:#20232c;">${title}</h2>
      <div style="color:#434b5f; line-height:1.6; font-size:15px;">${body}</div>
    </div>
    <p style="text-align:center; color:#8691a8; font-size:12px; margin-top:20px;">
      © ${new Date().getFullYear()} IkWilVanMeSpullenAf.nl — Van je spullen af zonder gedoe.
    </p>
  </div>`;
}

async function send(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.log(`[email:dev] Aan: ${to} | Onderwerp: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, html });
}

export const emailService = {
  async sendNewRequestConfirmation(to: string, name: string, requestNumber: string) {
    const body = `
      <p>Beste ${name},</p>
      <p>Bedankt voor je aanvraag! We hebben deze doorgestuurd naar geschikte, aangesloten partners bij jou in de buurt.</p>
      <p><strong>Aanvraagnummer:</strong> ${requestNumber}</p>
      <p>Je ontvangt binnen 24 uur de eerste reacties. Je kunt de status altijd volgen via je dashboard.</p>
      <p style="margin-top:24px;">
        <a href="${APP_URL}/aanvraag/${requestNumber}" style="background:#158252;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;">Bekijk je aanvraag</a>
      </p>`;
    await send(to, `Bevestiging aanvraag ${requestNumber}`, wrapper("Je aanvraag is ontvangen!", body));
  },

  async sendNewRequestToPartner(to: string, companyName: string, requestNumber: string, city: string) {
    const body = `
      <p>Beste ${companyName},</p>
      <p>Er staat een nieuwe aanvraag klaar in jouw werkgebied (${city}).</p>
      <p><strong>Aanvraagnummer:</strong> ${requestNumber}</p>
      <p style="margin-top:24px;">
        <a href="${APP_URL}/partner/aanvragen" style="background:#158252;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;">Bekijk aanvraag</a>
      </p>`;
    await send(to, `Nieuwe aanvraag beschikbaar (${requestNumber})`, wrapper("Nieuwe aanvraag in jouw regio", body));
  },

  async sendNewBidToCustomer(to: string, name: string, requestNumber: string, companyName: string, amount: string) {
    const body = `
      <p>Beste ${name},</p>
      <p><strong>${companyName}</strong> heeft gereageerd op jouw aanvraag ${requestNumber} met een bod/offerte van <strong>€${amount}</strong>.</p>
      <p style="margin-top:24px;">
        <a href="${APP_URL}/aanvraag/${requestNumber}" style="background:#158252;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;">Bekijk het bod</a>
      </p>`;
    await send(to, `Nieuw bod ontvangen op ${requestNumber}`, wrapper("Je hebt een nieuw bod ontvangen", body));
  },

  async sendBidAccepted(to: string, companyName: string, requestNumber: string) {
    const body = `
      <p>Beste ${companyName},</p>
      <p>Goed nieuws! Jouw bod op aanvraag <strong>${requestNumber}</strong> is geaccepteerd door de klant.</p>
      <p>Neem zo snel mogelijk contact op om de afhandeling te plannen.</p>
      <p style="margin-top:24px;">
        <a href="${APP_URL}/partner/aanvragen" style="background:#158252;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;">Bekijk opdracht</a>
      </p>`;
    await send(to, `Je bod is geaccepteerd! (${requestNumber})`, wrapper("Opdracht gegund", body));
  },

  async sendNewPartnerWelcome(to: string, companyName: string) {
    const body = `
      <p>Beste ${companyName},</p>
      <p>Bedankt voor je aanmelding als partner bij IkWilVanMeSpullenAf.nl. We beoordelen je aanmelding en nemen zo snel mogelijk contact op.</p>
      <p>Zodra je account is goedgekeurd, kun je direct aanvragen bekijken en biedingen uitbrengen.</p>`;
    await send(to, "Welkom bij IkWilVanMeSpullenAf.nl", wrapper("Aanmelding ontvangen", body));
  },

  async sendPasswordReset(to: string, name: string, token: string) {
    const url = `${APP_URL}/wachtwoord-resetten?token=${token}`;
    const body = `
      <p>Beste ${name},</p>
      <p>Je hebt een nieuw wachtwoord aangevraagd. Klik op onderstaande knop om een nieuw wachtwoord in te stellen. Deze link is 1 uur geldig.</p>
      <p style="margin-top:24px;">
        <a href="${url}" style="background:#158252;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;">Nieuw wachtwoord instellen</a>
      </p>
      <p style="font-size:13px;color:#8691a8;">Heb je dit niet aangevraagd? Dan kun je deze e-mail negeren.</p>`;
    await send(to, "Wachtwoord resetten", wrapper("Wachtwoord vergeten?", body));
  },
};
