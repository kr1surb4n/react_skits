import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";   
import { Request } from "express";  


export const prisma = new PrismaClient();

export interface Context {    // define the interface of the Contentx
    prisma: PrismaClient;
    userId?: string;
}

// define it as a function, that takes the request as argument
export const context = ({ req }: { req: Request }): Context => {   // concrete implementation
    const token =
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {  
        prisma,
        userId: token?.userId, 
    };
};
