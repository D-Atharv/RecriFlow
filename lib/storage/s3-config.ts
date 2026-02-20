import { env } from "@/lib/env";

export interface S3StorageConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  forcePathStyle: boolean;
}

export function hasS3StorageConfig(): boolean {
  return Boolean(
    env.AWS_S3_REGION &&
      env.AWS_S3_BUCKET_NAME &&
      env.AWS_S3_ACCESS_KEY_ID &&
      env.AWS_S3_SECRET_ACCESS_KEY,
  );
}

export function getS3StorageConfig(): S3StorageConfig | null {
  if (!hasS3StorageConfig()) {
    return null;
  }

  return {
    region: env.AWS_S3_REGION,
    bucket: env.AWS_S3_BUCKET_NAME,
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
    endpoint: env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: env.AWS_S3_FORCE_PATH_STYLE,
  };
}
