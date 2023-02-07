import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export interface Context {    // define the interface of the Contentx
    prisma: PrismaClient;
}

export const context: Context = {   // concrete implementation
    prisma,
};
