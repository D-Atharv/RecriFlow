function asString(value: string | undefined, fallback = ""): string {
  return value?.trim() ? value : fallback;
}

export const env = {
  NODE_ENV: asString(process.env.NODE_ENV, "development"),
  NEXT_PUBLIC_APP_URL: asString(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
  AUTH_SECRET: asString(process.env.AUTH_SECRET, "local-dev-secret-change-in-production"),

  DATABASE_URL: asString(process.env.DATABASE_URL),

  R2_ENDPOINT: asString(process.env.R2_ENDPOINT),
  R2_ACCESS_KEY_ID: asString(process.env.R2_ACCESS_KEY_ID),
  R2_SECRET_ACCESS_KEY: asString(process.env.R2_SECRET_ACCESS_KEY),
  R2_BUCKET_NAME: asString(process.env.R2_BUCKET_NAME),
  R2_PUBLIC_URL: asString(process.env.R2_PUBLIC_URL),

  PARSER_SERVICE_URL: asString(process.env.PARSER_SERVICE_URL),
  PARSER_API_KEY: asString(process.env.PARSER_API_KEY),

  GOOGLE_SHEET_ID: asString(process.env.GOOGLE_SHEET_ID),
  GOOGLE_SERVICE_ACCOUNT_KEY: asString(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),

  RESEND_API_KEY: asString(process.env.RESEND_API_KEY),
  EMAIL_FROM: asString(process.env.EMAIL_FROM, "TalentLens <noreply@talentlens.local>"),
};

export function requireEnvValue(value: string, key: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
