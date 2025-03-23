// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   global.prisma = prisma;
// }

// export default prisma;
//******************************************************************* */

// import { PrismaClient } from "@prisma/client";

// // Singleton function to initialize PrismaClient
// const getPrismaClient = (() => {
//   let instance: PrismaClient | undefined;

//   return () => {
//     if (!instance) {
//       instance = new PrismaClient();
//     }
//     return instance;
//   };
// })();

// const prisma = getPrismaClient();

// export default prisma;

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
