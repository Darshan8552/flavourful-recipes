import type { Document } from "mongoose";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  provider: string;
  emailVerified?: boolean;
}

export interface Session {
  user: User;
  expires: string;
}

export interface IUser extends Document {
  _id: string;
  name?: string;
  email: string;
  password?: string;
  image: string;
  imageId: string;
  provider: string;
  providerId?: string;
  favoriteRecipes?: import("mongoose").Types.ObjectId[];
  savedRecipes?: import("mongoose").Types.ObjectId[];
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instruction {
  subheading: string;
  steps: string[];
}

export interface IRecipe extends Document {
  _id: string;
  title: string;
  createdBy: import("mongoose").Types.ObjectId;
  imageId: string;
  imageUrl: string;
  type: "veg" | "non-veg";
  description: string;
  ingredients: string[];
  instructions: Instruction[];
  category: import("mongoose").Types.ObjectId;
  cookingTime: number;
  serves: number;
  difficulty: "easy" | "medium" | "hard";
  likes?: import("mongoose").Types.ObjectId[];
  likeCount?: number;
  views?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipeUploadData {
  title: string;
  createdBy: string;
  imageId: string;
  imageUrl: string;
  type: string;
  description: string;
  ingredients: string[];
  instructions: Instruction[];
  category: string;
  cookingTime: number;
  serves: number;
  difficulty: string;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
}

export interface IComment extends Document {
  _id: string;
  recipeId: import("mongoose").Types.ObjectId;
  userId: import("mongoose").Types.ObjectId;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IViewedRecipe extends Document {
  _id: string;
  recipeId: import("mongoose").Types.ObjectId;
  userId: import("mongoose").Types.ObjectId;
  viewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOTP extends Document {
  userId: import("mongoose").Types.ObjectId;
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResendVerificationData {
  email: string;
}

// Auth response types
export interface AuthResponse {
  success: boolean;
  error?: string;
  requireVerification?: boolean;
  userId?: string;
}

export interface SessionResponse {
  success: boolean;
  session?: Session;
  error?: string;
}

export type OAuthProvider = "github" | "google";

export interface OAuthUserData {
  id: string;
  name?: string;
  email: string;
  verified_email?: boolean;
}

export interface TokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface TokenVerificationResult {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
}

export type UserRole = "user" | "admin" | "moderator";

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

export type FormState =
  | {
      errors?: {
        oldPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;
