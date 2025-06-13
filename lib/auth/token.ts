import { SignJWT, jwtVerify } from "jose";
import { TokenPayload, TokenVerificationResult } from "@/lib/types/auth-types";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function generateToken(userId: string, expiresIn: number) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(
  token: string
): Promise<TokenVerificationResult> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { valid: true, payload: payload as TokenPayload };
  } catch (error) {
    return { valid: false, error };
  }
}
