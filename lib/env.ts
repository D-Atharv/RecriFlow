function asString(value: string | undefined, fallback = ""): string {
  return value?.trim() ? value.trim() : fallback;
}

function asBoolean(value: string | undefined, fallback = false): boolean {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function asPositiveInteger(value: string | undefined, fallback: number): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number.parseInt(value.trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export const env = {
  NODE_ENV: asString(process.env.NODE_ENV, "development"),
  NEXT_PUBLIC_APP_URL: asString(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
  AUTH_SECRET: asString(process.env.AUTH_SECRET, "local-dev-secret-change-in-production"),

  DATABASE_URL: asString(process.env.DATABASE_URL),

  AWS_S3_REGION: asString(process.env.AWS_S3_REGION),
  AWS_S3_BUCKET_NAME: asString(process.env.AWS_S3_BUCKET_NAME),
  AWS_S3_ACCESS_KEY_ID: asString(process.env.AWS_S3_ACCESS_KEY_ID),
  AWS_S3_SECRET_ACCESS_KEY: asString(process.env.AWS_S3_SECRET_ACCESS_KEY),
  AWS_S3_ENDPOINT: asString(process.env.AWS_S3_ENDPOINT),
  AWS_S3_FORCE_PATH_STYLE: asBoolean(process.env.AWS_S3_FORCE_PATH_STYLE),
  AWS_S3_SIGNED_URL_TTL_SECONDS: asPositiveInteger(process.env.AWS_S3_SIGNED_URL_TTL_SECONDS, 300),

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
