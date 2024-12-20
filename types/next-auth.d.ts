import { UserRole } from "@prisma/client";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { type DefaultSession } from "next-auth";


export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  isTwoFactorEnabled:boolean;
  isOAuth: boolean;
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
