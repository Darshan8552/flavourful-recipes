import { z } from "zod"

// Common validation utilities
export const ValidationUtils = {
  // Email validation
  email: z.string().email({ message: "Please enter a valid email address" }).toLowerCase().trim(),

  // Password validation
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),

  // Name validation
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),

  // OTP validation
  otp: z
    .string()
    .length(6, { message: "Verification code must be 6 digits" })
    .regex(/^\d{6}$/, { message: "Verification code must contain only numbers" }),

  // MongoDB ObjectId validation
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),

  // Role validation
  role: z.enum(["user", "admin", "moderator"], {
    errorMap: () => ({ message: "Role must be user, admin, or moderator" }),
  }),

  // URL validation
  url: z.string().url({ message: "Please enter a valid URL" }),

  // Phone number validation (optional)
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" })
    .optional(),
}

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return ValidationUtils.email.safeParse(email).success
}

export const validatePassword = (password: string): boolean => {
  return ValidationUtils.password.safeParse(password).success
}

export const validateObjectId = (id: string): boolean => {
  return ValidationUtils.objectId.safeParse(id).success
}

// Password strength checker
export const getPasswordStrength = (
  password: string,
): {
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push("Use at least 8 characters")

  if (/[a-z]/.test(password)) score += 1
  else feedback.push("Include lowercase letters")

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("Include uppercase letters")

  if (/\d/.test(password)) score += 1
  else feedback.push("Include numbers")

  if (/[^a-zA-Z\d]/.test(password)) score += 1
  else feedback.push("Include special characters")

  return { score, feedback }
}
