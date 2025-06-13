import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/user";
import type { Session } from "@/lib/types/auth-types";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload || !payload.sub || !payload.exp) {
      return null;
    }
    if (Date.now() >= payload.exp * 1000) {
      return null;
    }

    await connectToDatabase();
    const user = await UserModel.findById(payload.sub).lean();

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        emailVerified: user.emailVerified,
      },
      expires: new Date(payload.exp * 1000).toISOString(),
    };
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireRole(role: string | string[]) {
  const session = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];

  if (!roles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}
