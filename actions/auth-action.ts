"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { hash, verify } from "argon2";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/user";
import { OtpModel } from "@/lib/db/models/otp";
import { sendVerificationEmail } from "@/lib/email/nodemailer";
import { redirect } from "next/navigation";
import type {
  SignUpCredentials,
  SignInCredentials,
  VerifyEmailData,
  ResendVerificationData,
  AuthResponse,
  SessionResponse,
} from "@/lib/types/auth-types";
import { generateOTP } from "@/lib/generate-otp";
import { revalidatePath } from "next/cache";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const ACCESS_TOKEN_EXPIRY = 15 * 60;

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

async function generateToken(userId: string, expiresIn: number) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(JWT_SECRET);

  return token;
}

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("auth-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_EXPIRY,
    path: "/",
  });

  cookieStore.set("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_EXPIRY,
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  cookieStore.set("refresh-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function signUpWithCredentials(
  credentials: SignUpCredentials
): Promise<AuthResponse> {
  const { name, email, password } = credentials;
  try {
    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return { success: false, error: "Email already in Exist" };
    }

    const hashedPassword = await hash(password);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "user",
      emailVerified: false,
    });

    const otp = generateOTP();

    await OtpModel.create({
      userId: user._id,
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendVerificationEmail(email, otp);

    return { success: true, userId: user._id.toString() };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function signInWithCredentials(
  credentials: SignInCredentials
): Promise<AuthResponse> {
  const { email, password } = credentials;
  try {
    await connectToDatabase();

    const user = await UserModel.findOne({ email }).select("+password").exec();

    if (!user) {
      return { success: false, error: "User does Not Exist" };
    }

    const isValidPassword = await verify(user.password!, password);

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.emailVerified) {
      const otp = generateOTP();

      await OtpModel.findOneAndUpdate(
        { email },
        {
          userId: user._id,
          email,
          code: otp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
        { upsert: true }
      );

      await sendVerificationEmail(email, otp);

      revalidatePath("/", "layout");
      revalidatePath("/dashboard");
      revalidatePath("/profile");

      return {
        success: false,
        error:
          "Email not verified. A new verification code has been sent to your email.",
        requireVerification: true,
      };
    }

    const accessToken = await generateToken(
      user._id.toString(),
      ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = await generateToken(
      user._id.toString(),
      REFRESH_TOKEN_EXPIRY
    );

    await setAuthCookies(accessToken, refreshToken);

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}

export async function verifyEmail(
  data: VerifyEmailData
): Promise<AuthResponse> {
  const { email, code } = data;
  try {
    await connectToDatabase();

    const otp = await OtpModel.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return { success: false, error: "Invalid or expired verification code" };
    }

    const user = await UserModel.findByIdAndUpdate(
      otp.userId,
      { emailVerified: true },
      { new: true }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await OtpModel.deleteOne({ _id: otp._id });

    const accessToken = await generateToken(
      user._id.toString(),
      ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = await generateToken(
      user._id.toString(),
      REFRESH_TOKEN_EXPIRY
    );

    await setAuthCookies(accessToken, refreshToken);

    return { success: true };
  } catch (error) {
    console.error("Verify email error:", error);
    return { success: false, error: "Failed to verify email" };
  }
}

export async function resendVerificationCode(
  data: ResendVerificationData
): Promise<AuthResponse> {
  const { email } = data;
  try {
    await connectToDatabase();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const otp = generateOTP();

    await OtpModel.findOneAndUpdate(
      { email },
      {
        userId: user._id,
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
      { upsert: true }
    );

    await sendVerificationEmail(email, otp);

    return { success: true };
  } catch (error) {
    console.error("Resend verification code error:", error);
    return { success: false, error: "Failed to resend verification code" };
  }
}

export async function refreshSession(): Promise<SessionResponse> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token")?.value;

    if (!refreshToken) {
      return { success: false };
    }

    const { payload } = await jwtVerify(refreshToken, JWT_SECRET);

    if (!payload || !payload.sub || !payload.exp) {
      return { success: false };
    }

    if (Date.now() >= payload.exp * 1000) {
      return { success: false };
    }

    await connectToDatabase();
    const user = await UserModel.findById(payload.sub).lean();

    if (!user) {
      return { success: false };
    }

    const newAccessToken = await generateToken(
      user._id.toString(),
      ACCESS_TOKEN_EXPIRY
    );
    const newRefreshToken = await generateToken(
      user._id.toString(),
      REFRESH_TOKEN_EXPIRY
    );
    await setAuthCookies(newAccessToken, newRefreshToken);

    return {
      success: true,
      session: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          emailVerified: user.emailVerified,
        },
        expires: new Date(
          (Date.now() / 1000 + ACCESS_TOKEN_EXPIRY) * 1000
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error("Refresh session error:", error);
    return { success: false };
  }
}

export async function signOut() {
  await clearAuthCookies();
  redirect("/");
}
