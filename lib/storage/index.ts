import "server-only";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";
import { DOWNLOAD_URL_TTL_DEFAULT_SECONDS } from "@/lib/storage/constants";
import { buildResumeObjectKey, fromFileRouteParam, toFileRoute } from "@/lib/storage/object-key";
import { getS3Client } from "@/lib/storage/s3-client";
import { getS3StorageConfig, hasS3StorageConfig } from "@/lib/storage/s3-config";
import { saveFile } from "@/server/data/file-store";

function assertStorageConfiguredForRuntime(): void {
  if (!hasS3StorageConfig() && env.NODE_ENV === "production") {
    throw new Error(
      "AWS S3 storage is not configured. Set AWS_S3_REGION, AWS_S3_BUCKET_NAME, AWS_S3_ACCESS_KEY_ID, and AWS_S3_SECRET_ACCESS_KEY.",
    );
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._\-() ]+/g, "_");
}

function getSignedUrlTtlSeconds(): number {
  return env.AWS_S3_SIGNED_URL_TTL_SECONDS || DOWNLOAD_URL_TTL_DEFAULT_SECONDS;
}

export async function uploadResumeFile(file: File): Promise<string> {
  assertStorageConfiguredForRuntime();

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const s3Client = getS3Client();
  const s3Config = getS3StorageConfig();

  if (s3Client && s3Config) {
    const objectKey = buildResumeObjectKey(file);
    const safeFileName = sanitizeFileName(file.name || "resume");

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: file.type || "application/octet-stream",
        ContentDisposition: `inline; filename="${safeFileName}"`,
        ServerSideEncryption: "AES256",
      }),
    );

    return toFileRoute(objectKey);
  }

  const fallback = saveFile(file.name, file.type || "application/octet-stream", fileBuffer);
  return toFileRoute(fallback.id);
}

export async function getSignedResumeDownloadUrl(fileId: string): Promise<string | null> {
  assertStorageConfiguredForRuntime();

  const s3Client = getS3Client();
  const s3Config = getS3StorageConfig();
  if (!s3Client || !s3Config) {
    return null;
  }

  const objectKey = fromFileRouteParam(fileId);

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: objectKey,
      ResponseCacheControl: "private, max-age=300",
    }),
    { expiresIn: getSignedUrlTtlSeconds() },
  );
}
