export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: 15 * 60,
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60,
  OTP_EXPIRY: 15 * 60 * 1000,

  COOKIE_NAMES: {
    AUTH_TOKEN: "auth-token",
    REFRESH_TOKEN: "refresh-token",
    OAUTH_STATE: "oauth-state",
  },

  OAUTH_URLS: {
    GITHUB: {
      AUTHORIZE: "https://github.com/login/oauth/authorize",
      TOKEN: "https://github.com/login/oauth/access_token",
      USER: "https://api.github.com/user",
      EMAILS: "https://api.github.com/user/emails",
    },
    GOOGLE: {
      AUTHORIZE: "https://accounts.google.com/o/oauth2/v2/auth",
      TOKEN: "https://oauth2.googleapis.com/token",
      USER: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
  },

  ROLES: {
    USER: "user",
    ADMIN: "admin",
    MODERATOR: "moderator",
  } as const,

  PROVIDERS: {
    CREDENTIALS: "credentials",
    GITHUB: "github",
    GOOGLE: "google",
  } as const,

  ROUTES: {
    HOME: "/",
    DASHBOARD: "/dashboard",
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    VERIFY: "/auth/verify",
    ERROR: "/auth/error",
  } as const,

  ERRORS: {
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_IN_USE: "Email already in use",
    USER_NOT_FOUND: "User not found",
    INVALID_TOKEN: "Invalid or expired token",
    EMAIL_NOT_VERIFIED: "Email not verified",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    SERVER_ERROR: "An unexpected error occurred",
  } as const,
} as const;

export type UserRole =
  (typeof AUTH_CONSTANTS.ROLES)[keyof typeof AUTH_CONSTANTS.ROLES];
export type AuthProvider =
  (typeof AUTH_CONSTANTS.PROVIDERS)[keyof typeof AUTH_CONSTANTS.PROVIDERS];
export type AuthRoute =
  (typeof AUTH_CONSTANTS.ROUTES)[keyof typeof AUTH_CONSTANTS.ROUTES];
export type AuthError =
  (typeof AUTH_CONSTANTS.ERRORS)[keyof typeof AUTH_CONSTANTS.ERRORS];
