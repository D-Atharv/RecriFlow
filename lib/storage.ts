import "server-only";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/lib/env";
import { saveFile } from "@/server/data/file-store";

const DOWNLOAD_TTL_SECONDS = 60 * 5;
const OBJECT_KEY_PREFIX = "resume";

function hasR2Config(): boolean {
  return Boolean(
    env.R2_ENDPOINT &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_BUCKET_NAME,
  );
}

let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  return r2Client;
}

function inferExtension(file: File): string {
  if (file.type === "application/pdf") {
    return "pdf";
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return "docx";
  }

  const fromName = file.name.split(".").pop()?.toLowerCase();
  return fromName || "bin";
}

function objectKeyToRoute(fileKey: string): string {
  return `/api/files/${encodeURIComponent(fileKey)}`;
}

function routeParamToObjectKey(fileId: string): string {
  return decodeURIComponent(fileId);
}

export async function uploadResumeFile(file: File): Promise<string> {
  if (hasR2Config()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = inferExtension(file);
    const objectKey = `${OBJECT_KEY_PREFIX}-${crypto.randomUUID()}.${extension}`;
    const s3 = getR2Client();

    await s3.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: objectKey,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      }),
    );

    return objectKeyToRoute(objectKey);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = saveFile(file.name, file.type, buffer);

  return `/api/files/${saved.id}`;
}

export async function getSignedResumeDownloadUrl(fileId: string): Promise<string | null> {
  if (!hasR2Config()) {
    return null;
  }

  const objectKey = routeParamToObjectKey(fileId);
  const s3 = getR2Client();
  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: objectKey,
      ResponseCacheControl: "private, max-age=300",
    }),
    { expiresIn: DOWNLOAD_TTL_SECONDS },
  );

  return signedUrl;
}
