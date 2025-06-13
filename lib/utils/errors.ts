import { AUTH_CONSTANTS } from "@/lib/constants/auth-constant";

export class AuthError extends Error {
  constructor(message: string, public code: string, public statusCode = 400) {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export const ErrorHandler = {
  auth: (error: unknown): AuthError => {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(error.message, "AUTH_ERROR");
    }

    return new AuthError(
      AUTH_CONSTANTS.ERRORS.SERVER_ERROR,
      "UNKNOWN_ERROR",
      500
    );
  },

  validation: (error: unknown): ValidationError => {
    if (error instanceof ValidationError) {
      return error;
    }

    if (error instanceof Error) {
      return new ValidationError(error.message);
    }

    return new ValidationError("Validation failed");
  },

  database: (error: unknown): DatabaseError => {
    if (error instanceof DatabaseError) {
      return error;
    }

    if (error instanceof Error) {
      return new DatabaseError(error.message);
    }

    return new DatabaseError("Database operation failed");
  },

  handle: (
    error: unknown
  ): { message: string; code: string; statusCode: number } => {
    if (error instanceof AuthError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      };
    }

    if (error instanceof ValidationError) {
      return {
        message: error.message,
        code: "VALIDATION_ERROR",
        statusCode: 400,
      };
    }

    if (error instanceof DatabaseError) {
      return {
        message: error.message,
        code: "DATABASE_ERROR",
        statusCode: 500,
      };
    }

    console.error("Unhandled error:", error);
    return {
      message: AUTH_CONSTANTS.ERRORS.SERVER_ERROR,
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };
  },
};

export const CommonErrors = {
  UNAUTHORIZED: new AuthError(
    AUTH_CONSTANTS.ERRORS.UNAUTHORIZED,
    "UNAUTHORIZED",
    401
  ),
  FORBIDDEN: new AuthError(AUTH_CONSTANTS.ERRORS.FORBIDDEN, "FORBIDDEN", 403),
  USER_NOT_FOUND: new AuthError(
    AUTH_CONSTANTS.ERRORS.USER_NOT_FOUND,
    "USER_NOT_FOUND",
    404
  ),
  INVALID_CREDENTIALS: new AuthError(
    AUTH_CONSTANTS.ERRORS.INVALID_CREDENTIALS,
    "INVALID_CREDENTIALS",
    401
  ),
  EMAIL_IN_USE: new AuthError(
    AUTH_CONSTANTS.ERRORS.EMAIL_IN_USE,
    "EMAIL_IN_USE",
    409
  ),
  EMAIL_NOT_VERIFIED: new AuthError(
    AUTH_CONSTANTS.ERRORS.EMAIL_NOT_VERIFIED,
    "EMAIL_NOT_VERIFIED",
    403
  ),
  INVALID_TOKEN: new AuthError(
    AUTH_CONSTANTS.ERRORS.INVALID_TOKEN,
    "INVALID_TOKEN",
    401
  ),
};
