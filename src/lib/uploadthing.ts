import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  requestPhotos: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      // Foto's uploaden voor een aanvraag is toegestaan voor iedereen (ook bezoekers),
      // omdat het aanvraagformulier geen account vereist.
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),

  partnerLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
