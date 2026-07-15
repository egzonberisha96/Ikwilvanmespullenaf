import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "VISITOR" | "CUSTOMER" | "PARTNER" | "ADMIN";
      partnerId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "VISITOR" | "CUSTOMER" | "PARTNER" | "ADMIN";
    partnerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "VISITOR" | "CUSTOMER" | "PARTNER" | "ADMIN";
    partnerId?: string | null;
  }
}
