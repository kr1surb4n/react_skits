import * as jwt from "jsonwebtoken";

// this is for learning purposes only
// use .env file or env variable defined at startup
export const APP_SECRET = "GraphQL-is-aw3some";


export interface AuthTokenPayload {  // type definition
    userId: number;
}

export function decodeAuthHeader(authHeader: string): AuthTokenPayload { // 2
    const token = authHeader.replace("Bearer ", "");  // 3

    if (!token) {
        throw new Error("No token found");
    }
    return jwt.verify(token, APP_SECRET) as AuthTokenPayload;  // 4
}