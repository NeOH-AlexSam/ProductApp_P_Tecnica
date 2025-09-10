import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
    email: string;
    esadmin: string; // "true" o "false"
}

export async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token) return null;

    try {
        const decoded = jwt.decode(token) as JwtPayload | null;
        if(!decoded) return null;

        return {
            email: decoded.email,
            isAdmin: decoded.esadmin === "true",
        }
    }
    catch {
        return null;
    }
}