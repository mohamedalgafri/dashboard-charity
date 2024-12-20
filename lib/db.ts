// // import "server-only";
// import { PrismaClient } from "@prisma/client";

// declare global {
//   // eslint-disable-next-line no-var
//   var cachedPrisma: PrismaClient;
// }

// export let prisma: PrismaClient;
// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.cachedPrisma) {
//     global.cachedPrisma = new PrismaClient();
//   }
//   prisma = global.cachedPrisma;
// }


import {PrismaClient} from "@prisma/client"

declare global{
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;