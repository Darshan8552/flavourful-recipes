import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be less than 50 characters" })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces",
      }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  code: z
    .string()
    .length(6, { message: "Verification code must be 6 digits" })
    .regex(/^\d{6}$/, {
      message: "Verification code must contain only numbers",
    }),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Reset token is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" })
      .max(100, { message: "Password must be less than 100 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    })
    .optional(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim()
    .optional(),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  role: z.enum(["user", "admin", "moderator"], {
    errorMap: () => ({ message: "Role must be user, admin, or moderator" }),
  }),
});

export const deleteUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationFormValues = z.infer<
  typeof resendVerificationSchema
>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type UpdateUserRoleFormValues = z.infer<typeof updateUserRoleSchema>;
export type DeleteUserFormValues = z.infer<typeof deleteUserSchema>;
